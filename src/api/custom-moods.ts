// api/custom-moods.ts
export interface CustomMood {
  id?: number;
  name: string;
  emoji?: string;
  image_urls?: string[];
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCustomMoodRequest {
  name: string;
  emoji?: string;
  image_files?: File[];
}

/**
 * 创建自定义心情
 */
export async function createCustomMood(data: CreateCustomMoodRequest): Promise<CustomMood> {
  const formData = new FormData();
  
  formData.append('name', data.name);
  
  if (data.emoji) {
    formData.append('emoji', data.emoji);
  }
  
  if (data.image_files && data.image_files.length > 0) {
    data.image_files.forEach((file, index) => {
      formData.append(`images`, file);
    });
  }

  const response = await fetch('/api/custom-moods', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to create custom mood: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 获取用户自定义心情列表
 */
export async function getCustomMoods(): Promise<CustomMood[]> {
  const response = await fetch('/api/custom-moods');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch custom moods: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 更新自定义心情
 */
export async function updateCustomMood(id: number, data: Partial<CreateCustomMoodRequest>): Promise<CustomMood> {
  const formData = new FormData();
  
  if (data.name) {
    formData.append('name', data.name);
  }
  
  if (data.emoji) {
    formData.append('emoji', data.emoji);
  }
  
  if (data.image_files && data.image_files.length > 0) {
    data.image_files.forEach((file, index) => {
      formData.append(`images`, file);
    });
  }

  const response = await fetch(`/api/custom-moods/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to update custom mood: ${response.statusText}`);
  }

  return response.json();
}

/**
 * 删除自定义心情
 */
export async function deleteCustomMood(id: number): Promise<void> {
  const response = await fetch(`/api/custom-moods/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete custom mood: ${response.statusText}`);
  }
}