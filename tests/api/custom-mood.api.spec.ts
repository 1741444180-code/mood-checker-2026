import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

// API测试基础URL
const BASE_API_URL = 'http://localhost:3000/api';

test.describe('自定义心情API测试', () => {
  let authToken: string;
  let customMoodId: number;

  // 在所有测试之前获取认证令牌
  test.beforeAll(async () => {
    // 这里应该通过登录API获取认证令牌
    // 由于是测试环境，我们可能会使用测试账户或模拟令牌
    console.log('准备API测试环境...');
  });

  test('POST /api/custom-moods - 创建自定义心情', async ({ request }) => {
    // 上传自定义心情
    const customMoodResponse = await request.post(`${BASE_API_URL}/custom-moods`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      },
      data: {
        name: '我的自定义心情',
        image_urls: ['https://example.com/image1.jpg']
      }
    });

    expect(customMoodResponse.status()).toBe(200);
    const responseJson = await customMoodResponse.json();
    expect(responseJson).toHaveProperty('id');
    expect(responseJson.name).toBe('我的自定义心情');
    
    // 保存ID供后续测试使用
    customMoodId = responseJson.id;
  });

  test('GET /api/custom-moods - 获取用户自定义心情列表', async ({ request }) => {
    const response = await request.get(`${BASE_API_URL}/custom-moods`, {
      headers: {
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      }
    });

    expect(response.status()).toBe(200);
    const responseJson = await response.json();
    expect(Array.isArray(responseJson)).toBeTruthy();
    
    // 检查是否包含刚刚创建的自定义心情
    const foundCustomMood = responseJson.find((mood: any) => mood.id === customMoodId);
    expect(foundCustomMood).toBeDefined();
  });

  test('PUT /api/custom-moods/:id - 更新自定义心情', async ({ request }) => {
    if (!customMoodId) {
      throw new Error('No custom mood ID available for update test');
    }

    const updateResponse = await request.put(`${BASE_API_URL}/custom-moods/${customMoodId}`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      },
      data: {
        name: '更新后的自定义心情',
        image_urls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
      }
    });

    expect(updateResponse.status()).toBe(200);
    const responseJson = await updateResponse.json();
    expect(responseJson.name).toBe('更新后的自定义心情');
  });

  test('DELETE /api/custom-moods/:id - 删除自定义心情', async ({ request }) => {
    if (!customMoodId) {
      throw new Error('No custom mood ID available for delete test');
    }

    const deleteResponse = await request.delete(`${BASE_API_URL}/custom-moods/${customMoodId}`, {
      headers: {
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      }
    });

    expect(deleteResponse.status()).toBe(200);
    const responseJson = await deleteResponse.json();
    expect(responseJson.success).toBeTruthy();
  });

  test('POST /api/moods - 使用自定义心情ID打卡', async ({ request }) => {
    // 首先创建一个自定义心情
    const customMoodResponse = await request.post(`${BASE_API_URL}/custom-moods`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      },
      data: {
        name: '打卡用自定义心情',
        image_urls: ['https://example.com/checkin-image.jpg']
      }
    });

    expect(customMoodResponse.status()).toBe(200);
    const customMoodData = await customMoodResponse.json();
    const customMoodIdForCheckin = customMoodData.id;

    // 使用自定义心情ID进行打卡
    const moodCheckinResponse = await request.post(`${BASE_API_URL}/moods`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      },
      data: {
        mood_type: 'custom',
        custom_mood_id: customMoodIdForCheckin,
        note: '使用自定义心情打卡',
        tags: ['测试', '自定义']
      }
    });

    expect(moodCheckinResponse.status()).toBe(200);
    const checkinResult = await moodCheckinResponse.json();
    expect(checkinResult.mood_type).toBe('custom');
    expect(checkinResult.custom_mood_id).toBe(customMoodIdForCheckin);

    // 清理：删除刚创建的自定义心情
    const deleteResponse = await request.delete(`${BASE_API_URL}/custom-moods/${customMoodIdForCheckin}`, {
      headers: {
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      }
    });
    expect(deleteResponse.status()).toBe(200);
  });

  test('图片上传功能测试 - 多张图片（1-9张）', async ({ request }) => {
    // 测试上传1张图片
    const singleImageResponse = await request.post(`${BASE_API_URL}/custom-moods`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      },
      data: {
        name: '单张图片心情',
        image_urls: ['https://example.com/single-image.jpg']
      }
    });

    expect(singleImageResponse.status()).toBe(200);

    // 测试上传多张图片（最多9张）
    const multipleImages = Array.from({ length: 5 }, (_, i) => 
      `https://example.com/image-${i+1}.jpg`
    );
    
    const multipleImageResponse = await request.post(`${BASE_API_URL}/custom-moods`, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${authToken}` // 如果需要认证
      },
      data: {
        name: '多张图片心情',
        image_urls: multipleImages
      }
    });

    expect(multipleImageResponse.status()).toBe(200);
  });
});