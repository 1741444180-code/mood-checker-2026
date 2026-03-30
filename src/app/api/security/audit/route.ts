import { NextRequest, NextResponse } from 'next/server';

interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure' | 'warning';
  details?: Record<string, any>;
}

// In-memory storage (replace with database in production)
const auditLogs: SecurityAuditLog[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const action = searchParams.get('action');
    const status = searchParams.get('status');

    // Filter logs
    let filteredLogs = auditLogs;

    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(startDate));
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }

    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    if (status) {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }

    // Sort by timestamp descending
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        logs: paginatedLogs,
        total: filteredLogs.length,
        page,
        limit,
        totalPages: Math.ceil(filteredLogs.length / limit),
      },
    });
  } catch (error) {
    console.error('Security audit GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, resource, ipAddress, userAgent, status, details } = body;

    // Validate required fields
    if (!userId || !action || !resource) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create audit log
    const log: SecurityAuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      action,
      resource,
      timestamp: new Date().toISOString(),
      ipAddress: ipAddress || request.ip || 'unknown',
      userAgent: userAgent || 'unknown',
      status,
      details,
    };

    // Store log
    auditLogs.push(log);

    // Check for suspicious activity
    if (status === 'failure') {
      await checkSuspiciousActivity(userId, action);
    }

    return NextResponse.json({
      success: true,
      data: { log },
    });
  } catch (error) {
    console.error('Security audit POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}

async function checkSuspiciousActivity(userId: string, action: string) {
  // Count recent failures
  const now = Date.now();
  const recentFailures = auditLogs.filter(log => 
    log.userId === userId && 
    log.status === 'failure' &&
    now - new Date(log.timestamp).getTime() < 5 * 60 * 1000 // 5 minutes
  ).length;

  // Alert if too many failures
  if (recentFailures >= 5) {
    console.warn(`⚠️ Suspicious activity detected for user ${userId}: ${recentFailures} failures in 5 minutes`);
    // TODO: Send alert to security team
  }
}

// Export function for programmatic use
export function logSecurityEvent(params: {
  userId: string;
  action: string;
  resource: string;
  status: 'success' | 'failure' | 'warning';
  details?: Record<string, any>;
}) {
  const log: SecurityAuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...params,
    timestamp: new Date().toISOString(),
    ipAddress: 'server',
    userAgent: 'server',
  };
  auditLogs.push(log);
  return log;
}
