/*
 * 自定义心情功能测试
 * 验证 API 端点的基本功能
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 测试数据
const testUserId = 1;
const testCustomMoodData = {
  name: '测试自定义心情',
  imageUrls: ['https://example.com/test-image.jpg'],
};

// 1. 测试创建自定义心情
async function testCreateCustomMood() {
  console.log('Testing custom mood creation...');
  
  try {
    const newCustomMood = await prisma.customMood.create({
      data: {
        userId: testUserId,
        name: testCustomMoodData.name,
        imageUrls: testCustomMoodData.imageUrls,
      },
    });
    
    console.log('✓ Custom mood created:', newCustomMood);
    return newCustomMood;
  } catch (error) {
    console.error('✗ Failed to create custom mood:', error);
    throw error;
  }
}

// 2. 测试获取自定义心情
async function testGetCustomMood(customMoodId: number) {
  console.log('\nTesting custom mood retrieval...');
  
  try {
    const customMood = await prisma.customMood.findUnique({
      where: { id: customMoodId },
    });
    
    console.log('✓ Custom mood retrieved:', customMood);
    return customMood;
  } catch (error) {
    console.error('✗ Failed to retrieve custom mood:', error);
    throw error;
  }
}

// 3. 测试获取用户的所有自定义心情
async function testGetUserCustomMoods() {
  console.log('\nTesting user custom moods retrieval...');
  
  try {
    const customMoods = await prisma.customMood.findMany({
      where: { userId: testUserId },
    });
    
    console.log('✓ User custom moods retrieved:', customMoods);
    return customMoods;
  } catch (error) {
    console.error('✗ Failed to retrieve user custom moods:', error);
    throw error;
  }
}

// 4. 测试更新自定义心情
async function testUpdateCustomMood(customMoodId: number) {
  console.log('\nTesting custom mood update...');
  
  try {
    const updatedCustomMood = await prisma.customMood.update({
      where: { id: customMoodId },
      data: {
        name: '更新后的测试自定义心情',
        imageUrls: ['https://example.com/test-image.jpg', 'https://example.com/test-image2.jpg'],
      },
    });
    
    console.log('✓ Custom mood updated:', updatedCustomMood);
    return updatedCustomMood;
  } catch (error) {
    console.error('✗ Failed to update custom mood:', error);
    throw error;
  }
}

// 5. 测试创建带有自定义心情的心情记录
async function testCreateMoodRecordWithCustomMood(customMoodId: number) {
  console.log('\nTesting mood record creation with custom mood...');
  
  try {
    const newMoodRecord = await prisma.moodRecord.create({
      data: {
        userId: testUserId,
        date: new Date(),
        moodLevel: 5,
        moodType: 'custom',
        customMoodId: customMoodId,
        note: '使用自定义心情进行记录',
      },
    });
    
    console.log('✓ Mood record with custom mood created:', newMoodRecord);
    return newMoodRecord;
  } catch (error) {
    console.error('✗ Failed to create mood record with custom mood:', error);
    throw error;
  }
}

// 6. 测试删除自定义心情
async function testDeleteCustomMood(customMoodId: number) {
  console.log('\nTesting custom mood deletion...');
  
  try {
    // 先删除相关的心情记录
    await prisma.moodRecord.deleteMany({
      where: { customMoodId: customMoodId },
    });
    
    // 再删除自定义心情
    const deletedCustomMood = await prisma.customMood.delete({
      where: { id: customMoodId },
    });
    
    console.log('✓ Custom mood deleted:', deletedCustomMood);
    return deletedCustomMood;
  } catch (error) {
    console.error('✗ Failed to delete custom mood:', error);
    throw error;
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 Starting custom mood functionality tests...\n');
  
  let customMoodId: number | null = null;
  
  try {
    // 1. 创建自定义心情
    const createdMood = await testCreateCustomMood();
    customMoodId = createdMood.id;
    
    // 2. 获取自定义心情
    await testGetCustomMood(customMoodId);
    
    // 3. 获取用户的所有自定义心情
    await testGetUserCustomMoods();
    
    // 4. 更新自定义心情
    await testUpdateCustomMood(customMoodId);
    
    // 5. 创建带有自定义心情的心情记录
    await testCreateMoodRecordWithCustomMood(customMoodId);
    
    // 6. 删除自定义心情（以及相关记录）
    await testDeleteCustomMood(customMoodId);
    
    console.log('\n✅ All tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Tests failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行测试
runTests().catch(console.error);