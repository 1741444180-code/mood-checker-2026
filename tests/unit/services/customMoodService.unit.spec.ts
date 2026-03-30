import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createCustomMood, 
  getCustomMoods, 
  updateCustomMood, 
  deleteCustomMood,
  validateCustomMoodImages
} from '../../src/services/customMoodService';

// Mock API请求
vi.mock('../../src/utils/api', () => ({
  apiRequest: vi.fn()
}));

describe('自定义心情服务单元测试', () => {
  beforeEach(() => {
    // 在每个测试前重置mock
    vi.clearAllMocks();
  });

  describe('validateCustomMoodImages', () => {
    it('应该接受1-9张图片', () => {
      // 测试1张图片
      expect(validateCustomMoodImages(['image1.jpg'])).toBe(true);
      
      // 测试5张图片
      expect(validateCustomMoodImages([
        'image1.jpg', 'image2.jpg', 'image3.jpg', 
        'image4.jpg', 'image5.jpg'
      ])).toBe(true);
      
      // 测试9张图片
      expect(validateCustomMoodImages(Array(9).fill('image.jpg'))).toBe(true);
    });

    it('应该拒绝少于1张或多于9张图片', () => {
      // 测试0张图片
      expect(validateCustomMoodImages([])).toBe(false);
      
      // 测试10张图片
      expect(validateCustomMoodImages(Array(10).fill('image.jpg'))).toBe(false);
    });
  });

  describe('createCustomMood', () => {
    it('应该成功创建自定义心情', async () => {
      const mockApiResponse = {
        id: 1,
        name: '我的自定义心情',
        image_urls: ['https://example.com/image.jpg'],
        created_at: new Date().toISOString()
      };

      const apiRequest = await import('../../src/utils/api');
      (apiRequest.apiRequest as vi.Mock).mockResolvedValue(mockApiResponse);

      const result = await createCustomMood({
        name: '我的自定义心情',
        image_urls: ['https://example.com/image.jpg']
      });

      expect(apiRequest.apiRequest).toHaveBeenCalledWith(
        '/api/custom-moods',
        'POST',
        {
          name: '我的自定义心情',
          image_urls: ['https://example.com/image.jpg']
        }
      );
      expect(result).toEqual(mockApiResponse);
    });

    it('应该验证图片数量', async () => {
      await expect(createCustomMood({
        name: '我的自定义心情',
        image_urls: [] // 空数组，应该失败
      })).rejects.toThrow('图片数量必须在1-9张之间');

      await expect(createCustomMood({
        name: '我的自定义心情',
        image_urls: Array(10).fill('image.jpg') // 10张图片，应该失败
      })).rejects.toThrow('图片数量必须在1-9张之间');
    });
  });

  describe('getCustomMoods', () => {
    it('应该成功获取自定义心情列表', async () => {
      const mockResponse = [
        { id: 1, name: '心情1', image_urls: ['img1.jpg'] },
        { id: 2, name: '心情2', image_urls: ['img2.jpg'] }
      ];

      const apiRequest = await import('../../src/utils/api');
      (apiRequest.apiRequest as vi.Mock).mockResolvedValue(mockResponse);

      const result = await getCustomMoods();

      expect(apiRequest.apiRequest).toHaveBeenCalledWith('/api/custom-moods', 'GET');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateCustomMood', () => {
    it('应该成功更新自定义心情', async () => {
      const mockResponse = {
        id: 1,
        name: '更新后的心情',
        image_urls: ['https://example.com/new-image.jpg'],
        updated_at: new Date().toISOString()
      };

      const apiRequest = await import('../../src/utils/api');
      (apiRequest.apiRequest as vi.Mock).mockResolvedValue(mockResponse);

      const result = await updateCustomMood(1, {
        name: '更新后的心情',
        image_urls: ['https://example.com/new-image.jpg']
      });

      expect(apiRequest.apiRequest).toHaveBeenCalledWith(
        '/api/custom-moods/1',
        'PUT',
        {
          name: '更新后的心情',
          image_urls: ['https://example.com/new-image.jpg']
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteCustomMood', () => {
    it('应该成功删除自定义心情', async () => {
      const apiRequest = await import('../../src/utils/api');
      (apiRequest.apiRequest as vi.Mock).mockResolvedValue({ success: true });

      const result = await deleteCustomMood(1);

      expect(apiRequest.apiRequest).toHaveBeenCalledWith('/api/custom-moods/1', 'DELETE');
      expect(result).toEqual({ success: true });
    });
  });
});