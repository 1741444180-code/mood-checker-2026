'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CustomMoodForm } from './custom-mood-form'
import { createCustomMood } from '@/api/custom-moods'

interface MoodOption {
  id: number
  name: string
  emoji: string
  color: string
  weight: string
}

const moodOptions: MoodOption[] = [
  { id: 1, name: '开心', emoji: '😄', color: '#FFD700', weight: '25%' },
  { id: 2, name: '平静', emoji: '😊', color: '#90EE90', weight: '30%' },
  { id: 3, name: '低落', emoji: '😔', color: '#87CEEB', weight: '15%' },
  { id: 4, name: '生气', emoji: '😠', color: '#FF6B6B', weight: '10%' },
  { id: 5, name: '焦虑', emoji: '😰', color: '#DDA0DD', weight: '10%' },
  { id: 6, name: '疲惫', emoji: '😴', color: '#D3D3D3', weight: '7%' },
  { id: 7, name: '兴奋', emoji: '🤩', color: '#FF69B4', weight: '3%' },
]

interface MoodSelectorProps {
  onSubmit: (mood: { moodId?: number; customMoodId?: number; note?: string; tags?: string[] }) => void
}

export function MoodSelector({ onSubmit }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isCustomMoodOpen, setIsCustomMoodOpen] = useState(false)
  const [customMoodId, setCustomMoodId] = useState<number | null>(null)

  const handleSubmit = () => {
    if (selectedMood !== null) {
      onSubmit({ moodId: selectedMood, note, tags })
    } else if (customMoodId !== null) {
      onSubmit({ customMoodId, note, tags })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>今日心情</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          {/* 第一行：4个心情 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {moodOptions.slice(0, 4).map((mood) => (
              <Button
                key={mood.id}
                variant={selectedMood === mood.id ? 'default' : 'outline'}
                className={`h-20 flex flex-col items-center justify-center ${
                  selectedMood === mood.id ? '' : 'hover:border-2'
                }`}
                style={{
                  borderColor: selectedMood === mood.id ? undefined : mood.color,
                  backgroundColor:
                    selectedMood === mood.id ? mood.color : undefined,
                }}
                onClick={() => setSelectedMood(mood.id)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-sm mt-1">{mood.name}</span>
              </Button>
            ))}
          </div>
          
          {/* 第二行：3个心情 + 1个自定义按钮 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {moodOptions.slice(4, 7).map((mood) => (
              <Button
                key={mood.id}
                variant={selectedMood === mood.id ? 'default' : 'outline'}
                className={`h-20 flex flex-col items-center justify-center ${
                  selectedMood === mood.id ? '' : 'hover:border-2'
                }`}
                style={{
                  borderColor: selectedMood === mood.id ? undefined : mood.color,
                  backgroundColor:
                    selectedMood === mood.id ? mood.color : undefined,
                }}
                onClick={() => setSelectedMood(mood.id)}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-sm mt-1">{mood.name}</span>
              </Button>
            ))}
            
            {/* 自定义心情按钮 */}
            <Dialog open={isCustomMoodOpen} onOpenChange={setIsCustomMoodOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center hover:border-2"
                  onClick={() => setIsCustomMoodOpen(true)}
                >
                  <span className="text-2xl">➕</span>
                  <span className="text-sm mt-1">自定义</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>自定义心情</DialogTitle>
                </DialogHeader>
                <CustomMoodForm 
                  onClose={() => setIsCustomMoodOpen(false)}
                  onSave={async (data) => {
                    try {
                      const result = await createCustomMood({
                        name: data.name,
                        emoji: data.emoji,
                        image_files: data.images
                      });
                      
                      console.log('自定义心情创建成功:', result);
                      alert('自定义心情创建成功！');
                      
                      // 设置自定义心情ID，以便后续提交使用
                      if (result.id) {
                        setCustomMoodId(result.id);
                        setSelectedMood(null); // 清除之前选择的标准心情
                      }
                      
                      setIsCustomMoodOpen(false);
                    } catch (error) {
                      console.error('创建自定义心情失败:', error);
                      alert('创建自定义心情失败，请重试');
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="note">备注</Label>
            <Textarea
              id="note"
              placeholder="今天发生了什么？"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <Label>标签</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['工作', '生活', '健康'].map((tag) => (
                <Button
                  key={tag}
                  variant={tags.includes(tag) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (tags.includes(tag)) {
                      setTags(tags.filter((t) => t !== tag))
                    } else {
                      setTags([...tags, tag])
                    }
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleSubmit}
            disabled={selectedMood === null && customMoodId === null}
          >
            打卡
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

