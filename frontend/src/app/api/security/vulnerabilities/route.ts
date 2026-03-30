import { NextRequest, NextResponse } from 'next/server';

interface Vulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  recommendation: string;
  detectedAt: string;
  status: 'open' | 'mitigated' | 'resolved';
}

// Simulated vulnerability database
const knownVulnerabilities: Vulnerability[] = [
  {
    id: 'vuln_001',
    type: 'SQL_INJECTION',
    severity: 'critical',
    title: '潜在的 SQL 注入风险',
    description: '检测到未参数化的数据库查询',
    location: '/api/users/search',
    recommendation: '使用参数化查询或 ORM',
    detectedAt: new Date().toISOString(),
    status: 'open',
  },
  {
    id: 'vuln_002',
    type: 'XSS',
    severity: 'high',
    title: '跨站脚本攻击风险',
    description: '用户输入未正确转义',
    location: '/components/CommentBox',
    recommendation: '对所有用户输入进行 HTML 转义',
    detectedAt: new Date().toISOString(),
    status: 'open',
  },
  {
    id: 'vuln_003',
    type: 'WEAK_PASSWORD',
    severity: 'medium',
    title: '弱密码策略',
    description: '密码要求过于简单',
    location: '/api/auth/register',
    recommendation: '实施更强的密码策略（最少 12 位，包含大小写字母、数字和特殊字符）',
    detectedAt: new Date().toISOString(),
    status: 'open',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const severity = searchParams.get('severity');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    // Filter vulnerabilities
    let vulnerabilities = [...knownVulnerabilities];

    if (severity) {
      vulnerabilities = vulnerabilities.filter(v => v.severity === severity);
    }

    if (status) {
      vulnerabilities = vulnerabilities.filter(v => v.status === status);
    }

    if (type) {
      vulnerabilities = vulnerabilities.filter(v => v.type === type);
    }

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    vulnerabilities.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return NextResponse.json({
      success: true,
      data: {
        vulnerabilities,
        summary: {
          total: vulnerabilities.length,
          critical: vulnerabilities.filter(v => v.severity === 'critical').length,
          high: vulnerabilities.filter(v => v.severity === 'high').length,
          medium: vulnerabilities.filter(v => v.severity === 'medium').length,
          low: vulnerabilities.filter(v => v.severity === 'low').length,
        },
      },
    });
  } catch (error) {
    console.error('Vulnerability scan GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vulnerabilities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scanType = 'full' } = body;

    // Perform vulnerability scan
    const scanResults = await performVulnerabilityScan(scanType);

    return NextResponse.json({
      success: true,
      data: scanResults,
    });
  } catch (error) {
    console.error('Vulnerability scan POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform vulnerability scan' },
      { status: 500 }
    );
  }
}

async function performVulnerabilityScan(scanType: string) {
  const startTime = Date.now();

  // Simulated scan results
  const scanResults = {
    scanId: `scan_${Date.now()}`,
    scanType,
    startTime: new Date(startTime).toISOString(),
    endTime: new Date().toISOString(),
    duration: Date.now() - startTime,
    status: 'completed',
    vulnerabilities: knownVulnerabilities,
    summary: {
      total: knownVulnerabilities.length,
      critical: knownVulnerabilities.filter(v => v.severity === 'critical').length,
      high: knownVulnerabilities.filter(v => v.severity === 'high').length,
      medium: knownVulnerabilities.filter(v => v.severity === 'medium').length,
      low: knownVulnerabilities.filter(v => v.severity === 'low').length,
    },
    recommendations: [
      '立即修复所有严重和高危漏洞',
      '实施定期的安全扫描（建议每周一次）',
      '建立漏洞响应流程',
      '对开发团队进行安全培训',
    ],
  };

  return scanResults;
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { vulnerabilityId, status } = body;

    if (!vulnerabilityId || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update vulnerability status
    const vulnIndex = knownVulnerabilities.findIndex(v => v.id === vulnerabilityId);
    if (vulnIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Vulnerability not found' },
        { status: 404 }
      );
    }

    knownVulnerabilities[vulnIndex].status = status as 'open' | 'mitigated' | 'resolved';

    return NextResponse.json({
      success: true,
      data: { vulnerability: knownVulnerabilities[vulnIndex] },
    });
  } catch (error) {
    console.error('Vulnerability update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update vulnerability' },
      { status: 500 }
    );
  }
}
