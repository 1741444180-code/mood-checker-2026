'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createCustomMood } from '@/api/custom-moods'

interface CustomMoodFormProps {
  onClose: () => void;
  onSave: (data: { name: string; emoji?: string; images: File[] }) => void;
}

export function CustomMoodForm({ onClose, onSave }: CustomMoodFormProps) {
  const [name, setName] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // 常用表情
  const commonEmojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙']

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const validFiles = files.filter(file => file.type.startsWith('image/'))
      
      // 检查总数是否超过9张
      if (images.length + validFiles.length > 9) {
        alert(`最多只能上传9张图片，当前选择了${validFiles.length}张，已有${images.length}张`)
        return
      }
      
      // 添加新文件到数组
      const newImages = [...images, ...validFiles]
      setImages(newImages)
      
      // 生成预览URL
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    // 移除对应的图片文件
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    
    // 移除对应的预览URL并释放内存
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)
    setPreviewUrls(newPreviewUrls)
    
    // 释放被删除的URL对象
    URL.revokeObjectURL(previewUrls[index])
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('请输入心情名称')
      return
    }
    
    if (images.length === 0 && !selectedEmoji) {
      alert('请至少上传一张图片或选择一个表情')
      return
    }

    try {
      // 调用API创建自定义心情
      const result = await createCustomMood({
        name,
        emoji: selectedEmoji,
        image_files: images
      });
      
      console.log('自定义心情创建成功:', result);
      alert('自定义心情创建成功！');
      
      // 提交数据
      onSave({ name, emoji: selectedEmoji || undefined, images });
    } catch (error) {
      console.error('创建自定义心情失败:', error);
      alert('创建自定义心情失败，请重试');
    }
  }

  // 组件卸载时清理预览URL
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mood-name">心情名称</Label>
        <input
          id="mood-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          placeholder="给这个心情起个名字..."
        />
      </div>

      <div>
        <Label>选择表情 (可选)</Label>
        <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`text-2xl p-2 rounded border ${
                selectedEmoji === emoji
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedEmoji(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>上传图片 (最多9张，可选)</Label>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex items-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {/* 图片预览 */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`预览 ${index + 1}`}
                    className="w-full h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          取消
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
        >
          保存
        </Button>
      </div>
    </div>
  )
}