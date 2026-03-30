import { NextRequest, NextResponse } from 'next/server';

interface Feedback {
  id: string;
  userId?: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// Mock storage - In production, use a database
const feedbacks: Feedback[] = [];

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Filter feedbacks
    let filteredFeedbacks = feedbacks;

    if (status) {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.status === status);
    }

    if (category) {
      filteredFeedbacks = filteredFeedbacks.filter(f => f.category === category);
    }

    // Sort by creation date (newest first)
    filteredFeedbacks.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Limit results
    filteredFeedbacks = filteredFeedbacks.slice(0, limit);

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        feedbacks: filteredFeedbacks,
        total: filteredFeedbacks.length,
        responseTime: `${responseTime}ms`,
      },
      {
        headers: {
          'Cache-Control': 'private, no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch feedbacks',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const { email, subject, message, category, priority = 'medium' } = body;

    // Validate required fields
    if (!email || !subject || !message || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['email', 'subject', 'message', 'category'],
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid priority value',
          validValues: validPriorities,
        },
        { status: 400 }
      );
    }

    // Create feedback
    const now = new Date().toISOString();
    const newFeedback: Feedback = {
      id: `fb_${Date.now()}`,
      email,
      subject,
      message,
      category,
      priority: priority as 'low' | 'medium' | 'high',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    feedbacks.push(newFeedback);

    const responseTime = Date.now() - startTime;

    // In production, send email notification to support team
    // await sendNotificationEmail(newFeedback);

    return NextResponse.json(
      {
        success: true,
        feedback: newFeedback,
        message: 'Feedback submitted successfully. We will respond within 24-48 hours.',
        responseTime: `${responseTime}ms`,
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'private, no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit feedback',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, priority } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback ID is required',
        },
        { status: 400 }
      );
    }

    const feedback = feedbacks.find(f => f.id === id);
    if (!feedback) {
      return NextResponse.json(
        {
          success: false,
          error: 'Feedback not found',
        },
        { status: 404 }
      );
    }

    // Update fields
    if (status) {
      const validStatuses = ['pending', 'in_progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid status value',
          },
          { status: 400 }
        );
      }
      feedback.status = status as Feedback['status'];
    }

    if (priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid priority value',
          },
          { status: 400 }
        );
      }
      feedback.priority = priority as Feedback['priority'];
    }

    feedback.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      feedback,
      message: 'Feedback updated successfully',
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update feedback',
      },
      { status: 500 }
    );
  }
}
