/**
 * 工单系统配置
 * 用于自动创建和跟踪用户反馈工单
 */

// 工单状态枚举
export enum TicketStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  PENDING_CUSTOMER = 'pending_customer',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

// 工单优先级枚举
export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

// 工单类型枚举
export enum TicketType {
  BUG = 'bug',
  FEATURE_REQUEST = 'feature_request',
  QUESTION = 'question',
  OTHER = 'other',
}

// 工单分配策略
export enum AssignmentStrategy {
  ROUND_ROBIN = 'round_robin', // 轮询分配
  LOAD_BALANCED = 'load_balanced', // 负载均衡分配
  SKILL_BASED = 'skill_based', // 基于技能分配
  FIRST_AVAILABLE = 'first_available', // 第一个可用人员
}

// 工单字段接口
interface TicketField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'email' | 'phone';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

// 工单系统配置接口
interface TicketSystemConfig {
  // 系统基本信息
  systemName: string;
  baseUrl: string;
  
  // 工单状态配置
  statuses: {
    [key in TicketStatus]: {
      label: string;
      color: string;
      canTransitionTo: TicketStatus[];
      requiresComment: boolean;
    };
  };
  
  // 工单优先级配置
  priorities: {
    [key in TicketPriority]: {
      label: string;
      color: string;
      slaHours: number; // SLA小时数
    };
  };
  
  // 工单类型配置
  types: {
    [key in TicketType]: {
      label: string;
      defaultPriority: TicketPriority;
      autoAssign: boolean;
      notificationTemplate: string; // 对应邮件模板名称
    };
  };
  
  // 字段配置
  fields: TicketField[];
  
  // 分配配置
  assignment: {
    strategy: AssignmentStrategy;
    defaultAssignee: string; // 默认处理人（邮箱或ID）
    teamMembers: string[]; // 团队成员列表（邮箱或ID）
    escalationTimeHours: number; // 升级时间（小时）
  };
  
  // 自动化规则
  automation: {
    // 新工单自动分配
    autoAssignNewTickets: boolean;
    // 未响应自动升级
    autoEscalateUnresponsive: boolean;
    // 自动关闭已解决的工单（天数）
    autoCloseResolvedAfterDays: number;
    // 自动发送通知
    autoSendNotifications: boolean;
  };
  
  // 集成配置
  integrations: {
    emailEnabled: boolean;
    slackEnabled: boolean;
    webhookUrl?: string;
  };
}

// 工单系统配置实例
export const ticketSystemConfig: TicketSystemConfig = {
  // 系统基本信息
  systemName: process.env.APP_NAME || 'Feedback System',
  baseUrl: process.env.BASE_URL || 'https://example.com',
  
  // 工单状态配置
  statuses: {
    [TicketStatus.NEW]: {
      label: '新建',
      color: '#3b82f6', // blue-500
      canTransitionTo: [TicketStatus.ASSIGNED, TicketStatus.CLOSED],
      requiresComment: false,
    },
    [TicketStatus.ASSIGNED]: {
      label: '已分配',
      color: '#f59e0b', // amber-500
      canTransitionTo: [TicketStatus.IN_PROGRESS, TicketStatus.PENDING_CUSTOMER, TicketStatus.RESOLVED, TicketStatus.CLOSED],
      requiresComment: true,
    },
    [TicketStatus.IN_PROGRESS]: {
      label: '处理中',
      color: '#8b5cf6', // violet-500
      canTransitionTo: [TicketStatus.PENDING_CUSTOMER, TicketStatus.RESOLVED, TicketStatus.CLOSED],
      requiresComment: true,
    },
    [TicketStatus.PENDING_CUSTOMER]: {
      label: '等待客户回复',
      color: '#06b6d4', // cyan-500
      canTransitionTo: [TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED],
      requiresComment: true,
    },
    [TicketStatus.RESOLVED]: {
      label: '已解决',
      color: '#10b981', // emerald-500
      canTransitionTo: [TicketStatus.IN_PROGRESS, TicketStatus.CLOSED],
      requiresComment: true,
    },
    [TicketStatus.CLOSED]: {
      label: '已关闭',
      color: '#6b7280', // gray-500
      canTransitionTo: [],
      requiresComment: true,
    },
  },
  
  // 工单优先级配置
  priorities: {
    [TicketPriority.LOW]: {
      label: '低',
      color: '#6b7280', // gray-500
      slaHours: 168, // 7天
    },
    [TicketPriority.MEDIUM]: {
      label: '中',
      color: '#3b82f6', // blue-500
      slaHours: 72, // 3天
    },
    [TicketPriority.HIGH]: {
      label: '高',
      color: '#f59e0b', // amber-500
      slaHours: 24, // 1天
    },
    [TicketPriority.URGENT]: {
      label: '紧急',
      color: '#ef4444', // red-500
      slaHours: 4, // 4小时
    },
  },
  
  // 工单类型配置
  types: {
    [TicketType.BUG]: {
      label: 'Bug报告',
      defaultPriority: TicketPriority.HIGH,
      autoAssign: true,
      notificationTemplate: 'feedbackReceived',
    },
    [TicketType.FEATURE_REQUEST]: {
      label: '功能请求',
      defaultPriority: TicketPriority.MEDIUM,
      autoAssign: true,
      notificationTemplate: 'feedbackReceived',
    },
    [TicketType.QUESTION]: {
      label: '问题咨询',
      defaultPriority: TicketPriority.LOW,
      autoAssign: true,
      notificationTemplate: 'feedbackReceived',
    },
    [TicketType.OTHER]: {
      label: '其他',
      defaultPriority: TicketPriority.MEDIUM,
      autoAssign: true,
      notificationTemplate: 'feedbackReceived',
    },
  },
  
  // 字段配置
  fields: [
    {
      id: 'title',
      name: '标题',
      type: 'text',
      required: true,
    },
    {
      id: 'description',
      name: '详细描述',
      type: 'textarea',
      required: true,
    },
    {
      id: 'email',
      name: '联系邮箱',
      type: 'email',
      required: true,
    },
    {
      id: 'category',
      name: '分类',
      type: 'select',
      required: true,
      options: ['技术问题', '账户问题', '支付问题', '功能建议', '其他'],
    },
    {
      id: 'priority',
      name: '优先级',
      type: 'select',
      required: false,
      options: ['低', '中', '高', '紧急'],
      defaultValue: '中',
    },
    {
      id: 'attachments',
      name: '附件',
      type: 'text',
      required: false,
    },
  ],
  
  // 分配配置
  assignment: {
    strategy: AssignmentStrategy.ROUND_ROBIN,
    defaultAssignee: process.env.DEFAULT_ASSIGNEE || 'support@example.com',
    teamMembers: process.env.SUPPORT_TEAM_MEMBERS 
      ? process.env.SUPPORT_TEAM_MEMBERS.split(',') 
      : ['support1@example.com', 'support2@example.com', 'support3@example.com'],
    escalationTimeHours: 24,
  },
  
  // 自动化规则
  automation: {
    autoAssignNewTickets: true,
    autoEscalateUnresponsive: true,
    autoCloseResolvedAfterDays: 7,
    autoSendNotifications: true,
  },
  
  // 集成配置
  integrations: {
    emailEnabled: true,
    slackEnabled: false,
    webhookUrl: process.env.WEBHOOK_URL || undefined,
  },
};

// 验证工单状态转换是否有效
export function isValidStatusTransition(from: TicketStatus, to: TicketStatus): boolean {
  return ticketSystemConfig.statuses[from].canTransitionTo.includes(to);
}

// 获取工单类型的默认优先级
export function getDefaultPriorityForType(type: TicketType): TicketPriority {
  return ticketSystemConfig.types[type].defaultPriority;
}

// 获取SLA小时数
export function getSlaHours(priority: TicketPriority): number {
  return ticketSystemConfig.priorities[priority].slaHours;
}

// 获取下一个可用的处理人（轮询策略）
export function getNextAssignee(currentIndex: number): { assignee: string; nextIndex: number } {
  const teamMembers = ticketSystemConfig.assignment.teamMembers;
  if (teamMembers.length === 0) {
    return { assignee: ticketSystemConfig.assignment.defaultAssignee, nextIndex: 0 };
  }
  
  const nextIndex = (currentIndex + 1) % teamMembers.length;
  return { assignee: teamMembers[nextIndex], nextIndex };
}