import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/user - 获取用户信息
export const getUserHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        coins: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/user - 创建或更新用户
export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // 检查用户名或邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // 在实际应用中，应该对密码进行哈希处理
        avatar: avatar || null
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        coins: true,
        createdAt: true
      }
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/user - 更新用户信息
export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, email, avatar, coins } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(email && { email }),
        ...(avatar !== undefined && { avatar }),
        ...(coins !== undefined && { coins })
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        coins: true,
        updatedAt: true
      }
    });

    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default {
  getUser: getUserHandler,
  create: createUserHandler,
  update: updateUserHandler
};