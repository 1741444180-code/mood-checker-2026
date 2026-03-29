// pages/api/custom-moods.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 根据请求方法处理不同的操作
  switch (req.method) {
    case 'GET':
      // 获取用户自定义心情列表
      return handleGet(req, res);
    case 'POST':
      // 创建自定义心情
      return handlePost(req, res);
    case 'PUT':
      // 更新自定义心情
      return handlePut(req, res);
    case 'DELETE':
      // 删除自定义心情
      return handleDelete(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// 处理GET请求 - 获取自定义心情列表
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 模拟返回一些数据
    const mockData = [
      {
        id: 1,
        name: '我的自定义心情',
        emoji: '🎉',
        image_urls: ['/images/custom-mood.jpg'],
        is_system: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

    return res.status(200).json(mockData);
  } catch (error) {
    console.error('Error fetching custom moods:', error);
    return res.status(500).json({ error: 'Failed to fetch custom moods' });
  }
}

// 处理POST请求 - 创建自定义心情
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 模拟创建流程
    const { name, emoji } = req.body;

    // 模拟返回的数据
    const newCustomMood = {
      id: Date.now(), // 使用时间戳作为模拟ID
      name,
      emoji: emoji || null,
      image_urls: [], // 实际应用中会处理上传的图片
      is_system: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return res.status(201).json(newCustomMood);
  } catch (error) {
    console.error('Error creating custom mood:', error);
    return res.status(500).json({ error: 'Failed to create custom mood' });
  }
}

// 处理PUT请求 - 更新自定义心情
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, emoji } = req.body;

    // 模拟更新后的数据
    const updatedCustomMood = {
      id: Number(id),
      name: name || 'Updated Mood',
      emoji: emoji || null,
      image_urls: [], // 实际应用中会处理上传的图片
      is_system: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return res.status(200).json(updatedCustomMood);
  } catch (error) {
    console.error('Error updating custom mood:', error);
    return res.status(500).json({ error: 'Failed to update custom mood' });
  }
}

// 处理DELETE请求 - 删除自定义心情
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    // 在实际应用中，这里会从数据库删除记录
    console.log(`Deleting custom mood with id: ${id}`);

    return res.status(204).end(); // No content
  } catch (error) {
    console.error('Error deleting custom mood:', error);
    return res.status(500).json({ error: 'Failed to delete custom mood' });
  }
}