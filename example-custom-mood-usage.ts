/*
 * 自定义心情功能使用示例
 * 展示如何从前端调用 API 创建和使用自定义心情
 */

// 1. 上传图片并创建自定义心情
async function createCustomMoodWithImages(name: string, imageFiles: File[]) {
  const formData = new FormData();
  formData.append('name', name);
  
  // 添加图片文件（最多9张）
  imageFiles.forEach((file, index) => {
    if (index < 9) {
      formData.append('images', file);
    }
  });

  const response = await fetch('/api/custom-moods/create-with-images', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth-token')}`, // 假设使用 localStorage 存储 token
      'x-user-id': localStorage.getItem('user-id') || '', // 假设存储了用户 ID
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to create custom mood: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Custom mood created:', result);
  return result.customMood;
}

// 2. 单独上传图片
async function uploadImages(imageFiles: File[]) {
  const formData = new FormData();
  
  imageFiles.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch('/api/upload/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      'x-user-id': localStorage.getItem('user-id') || '',
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload images: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Images uploaded:', result.urls);
  return result.urls;
}

// 3. 创建自定义心情（使用已上传的图片 URL）
async function createCustomMood(name: string, imageUrls: string[]) {
  const response = await fetch('/api/custom-moods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
    },
    body: JSON.stringify({
      userId: parseInt(localStorage.getItem('user-id') || '0'),
      name: name,
      imageUrls: imageUrls,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create custom mood: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Custom mood created:', result);
  return result;
}

// 4. 获取用户的自定义心情列表
async function getUserCustomMoods(userId: number) {
  const response = await fetch(`/api/custom-moods?userId=${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch custom moods: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('User custom moods:', result);
  return result;
}

// 5. 使用自定义心情记录当天心情
async function recordMoodWithCustomMood(date: string, customMoodId: number, note?: string) {
  const response = await fetch('/api/moods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
    },
    body: JSON.stringify({
      userId: parseInt(localStorage.getItem('user-id') || '0'),
      date: date,
      moodType: 'custom', // 标记为自定义心情
      customMoodId: customMoodId, // 关联自定义心情 ID
      note: note || '',
      tags: [], // 可选标签
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to record mood: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Mood recorded with custom mood:', result);
  return result;
}

// 6. 更新自定义心情
async function updateCustomMood(id: number, name?: string, imageUrls?: string[]) {
  const updateData: any = {};
  if (name) updateData.name = name;
  if (imageUrls) updateData.imageUrls = imageUrls;

  const response = await fetch(`/api/custom-moods?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update custom mood: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Custom mood updated:', result);
  return result;
}

// 7. 删除自定义心情
async function deleteCustomMood(id: number) {
  const response = await fetch(`/api/custom-moods?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete custom mood: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('Custom mood deleted:', result);
  return result;
}

// 使用示例
async function exampleUsage() {
  try {
    // 示例 1: 上传图片并创建自定义心情
    const imageFiles: File[] = []; // 假设从 input[type="file"] 获取
    const customMood = await createCustomMoodWithImages('我的猫咪', imageFiles);
    
    // 示例 2: 记录使用自定义心情的心情
    await recordMoodWithCustomMood('2026-03-29', customMood.id, '和猫咪玩得很开心');
    
    // 示例 3: 获取用户的所有自定义心情
    const userId = parseInt(localStorage.getItem('user-id') || '0');
    const userCustomMoods = await getUserCustomMoods(userId);
    
    console.log('All set! Custom mood functionality is ready to use.');
  } catch (error) {
    console.error('Error in example usage:', error);
  }
}

export {
  createCustomMoodWithImages,
  uploadImages,
  createCustomMood,
  getUserCustomMoods,
  recordMoodWithCustomMood,
  updateCustomMood,
  deleteCustomMood,
  exampleUsage
};