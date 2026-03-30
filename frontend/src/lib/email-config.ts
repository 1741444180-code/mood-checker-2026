/**
 * 邮件通知配置
 * 用于处理用户反馈的邮件通知系统
 */

// SMTP 配置接口
interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

// 邮件模板配置接口
interface EmailTemplateConfig {
  feedbackReceived: {
    subject: string;
    html: string;
    text: string;
  };
  feedbackAssigned: {
    subject: string;
    html: string;
    text: string;
  };
  feedbackResolved: {
    subject: string;
    html: string;
    text: string;
  };
}

// 邮件队列配置
interface EmailQueueConfig {
  // 队列名称
  queueName: string;
  // 并发处理数量
  concurrency: number;
  // 重试次数
  maxRetries: number;
  // 重试延迟（毫秒）
  retryDelay: number;
  // 失败队列保留时间（毫秒）
  failedRetention: number;
}

// 主配置对象
export const emailConfig = {
  // SMTP 配置 - 从环境变量获取敏感信息
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    from: process.env.SMTP_FROM || 'noreply@example.com',
  } as SmtpConfig,

  // 邮件模板
  templates: {
    feedbackReceived: {
      subject: '感谢您的反馈 - {{appName}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>感谢您的反馈！</h2>
          <p>您好，</p>
          <p>我们已收到您提交的反馈（工单号：{{ticketId}}）。我们的团队将尽快审核并处理您的问题。</p>
          <p>您可以通过以下链接跟踪工单状态：<br>
            <a href="{{ticketUrl}}">{{ticketUrl}}</a>
          </p>
          <p>如有任何疑问，请随时联系我们。</p>
          <p>此致<br>{{appName}} 团队</p>
        </div>
      `,
      text: `感谢您的反馈！

您好，

我们已收到您提交的反馈（工单号：{{ticketId}}）。我们的团队将尽快审核并处理您的问题。

您可以通过以下链接跟踪工单状态：
{{ticketUrl}}

如有任何疑问，请随时联系我们。

此致
{{appName}} 团队
`,
    },
    feedbackAssigned: {
      subject: '您的反馈已被分配 - {{appName}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>您的反馈已被分配给处理人员</h2>
          <p>您好，</p>
          <p>您提交的反馈（工单号：{{ticketId}}）已被分配给 {{assignee}} 处理。</p>
          <p>处理人员将在 {{estimatedTime}} 内与您联系或解决问题。</p>
          <p>您可以通过以下链接跟踪工单状态：<br>
            <a href="{{ticketUrl}}">{{ticketUrl}}</a>
          </p>
          <p>感谢您的耐心等待！</p>
          <p>此致<br>{{appName}} 团队</p>
        </div>
      `,
      text: `您的反馈已被分配给处理人员

您好，

您提交的反馈（工单号：{{ticketId}}）已被分配给 {{assignee}} 处理。

处理人员将在 {{estimatedTime}} 内与您联系或解决问题。

您可以通过以下链接跟踪工单状态：
{{ticketUrl}}

感谢您的耐心等待！

此致
{{appName}} 团队
`,
    },
    feedbackResolved: {
      subject: '您的反馈已解决 - {{appName}}',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>您的反馈已解决</h2>
          <p>您好，</p>
          <p>您提交的反馈（工单号：{{ticketId}}）已被标记为已解决。</p>
          <p>解决方案摘要：<br>
            {{resolutionSummary}}
          </p>
          <p>如果您对解决方案有任何疑问或问题仍未解决，请回复此邮件，我们将重新打开工单并继续处理。</p>
          <p>感谢您帮助我们改进 {{appName}}！</p>
          <p>此致<br>{{appName}} 团队</p>
        </div>
      `,
      text: `您的反馈已解决

您好，

您提交的反馈（工单号：{{ticketId}}）已被标记为已解决。

解决方案摘要：
{{resolutionSummary}}

如果您对解决方案有任何疑问或问题仍未解决，请回复此邮件，我们将重新打开工单并继续处理。

感谢您帮助我们改进 {{appName}}！

此致
{{appName}} 团队
`,
    },
  } as EmailTemplateConfig,

  // 邮件队列配置
  queue: {
    queueName: 'feedback-email-queue',
    concurrency: 5,
    maxRetries: 3,
    retryDelay: 5000, // 5秒
    failedRetention: 86400000, // 24小时
  } as EmailQueueConfig,
};

// 验证SMTP配置是否完整
export function validateSmtpConfig(config: SmtpConfig): boolean {
  return !!(config.host && config.port && config.auth.user && config.auth.pass && config.from);
}

// 获取模板内容
export function getTemplate(templateName: keyof EmailTemplateConfig, variables: Record<string, string>): {
  subject: string;
  html: string;
  text: string;
} {
  const template = emailConfig.templates[templateName];
  if (!template) {
    throw new Error(`Unknown template: ${templateName}`);
  }

  // 替换模板变量
  const replaceVariables = (str: string): string => {
    let result = str;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return result;
  };

  return {
    subject: replaceVariables(template.subject),
    html: replaceVariables(template.html),
    text: replaceVariables(template.text),
  };
}