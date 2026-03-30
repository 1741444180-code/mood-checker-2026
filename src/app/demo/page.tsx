'use client'

import { useState, useEffect } from 'react'
import LikeButton from '@/components/LikeButton'

interface CheckIn {
  id: string
  userId: string
  mood: number
  note: string | null
  createdAt: string
}

export default function DemoPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string>('')

  // 模拟当前用户 ID（实际项目中应该从认证系统获取）
  const currentUserId = userId || 'demo-user-1'

  useEffect(() => {
    // 获取打卡列表
    const fetchCheckIns = async () => {
      try {
        // 这里调用打卡 API（如果有的话）
        // 暂时使用模拟数据
        const mockData: CheckIn[] = [
          {
            id: '1',
            userId: 'user-1',
            mood: 5,
            note: '今天心情超好！☀️',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            userId: 'user-2',
            mood: 4,
            note: '不错的一天',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: '3',
            userId: 'user-3',
            mood: 3,
            note: '普普通通',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ]
        setCheckIns(mockData)
      } catch (error) {
        console.error('Failed to fetch checkIns:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCheckIns()
  }, [])

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😢', '😕', '😐', '🙂', '😄', '🤩']
    return emojis[mood] || '😐'
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>点赞功能演示</h1>
      
      <div style={styles.userInput}>
        <label style={styles.label}>当前用户 ID: </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="输入用户 ID"
          style={styles.input}
        />
        <span style={styles.hint}>（留空使用默认 demo-user-1）</span>
      </div>

      {loading ? (
        <div style={styles.loading}>加载中...</div>
      ) : (
        <div style={styles.list}>
          {checkIns.map((checkIn) => (
            <div key={checkIn.id} style={styles.card}>
              <div style={styles.header}>
                <span style={styles.mood}>
                  {getMoodEmoji(checkIn.mood)} 心情：{checkIn.mood}/5
                </span>
                <span style={styles.date}>
                  {new Date(checkIn.createdAt).toLocaleDateString('zh-CN')}
                </span>
              </div>
              {checkIn.note && <p style={styles.note}>{checkIn.note}</p>}
              <div style={styles.footer}>
                <LikeButton checkInId={checkIn.id} userId={currentUserId} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.info}>
        <h3>功能说明：</h3>
        <ul style={styles.list}>
          <li>点击 ❤️ 按钮可以点赞/取消点赞</li>
          <li>点赞时有缩放动画效果</li>
          <li>每个用户对同一条打卡只能点赞一次</li>
          <li>实时显示点赞数量</li>
        </ul>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  } as React.CSSProperties,
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#1f2937',
  } as React.CSSProperties,
  userInput: {
    marginBottom: '30px',
    padding: '15px',
    background: '#f3f4f6',
    borderRadius: '8px',
    textAlign: 'center',
  } as React.CSSProperties,
  label: {
    fontWeight: 500,
    marginRight: '8px',
    color: '#374151',
  } as React.CSSProperties,
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '14px',
    width: '200px',
  } as React.CSSProperties,
  hint: {
    marginLeft: '8px',
    fontSize: '12px',
    color: '#6b7280',
  } as React.CSSProperties,
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  } as React.CSSProperties,
  card: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  } as React.CSSProperties,
  mood: {
    fontSize: '16px',
    fontWeight: 500,
    color: '#374151',
  } as React.CSSProperties,
  date: {
    fontSize: '14px',
    color: '#9ca3af',
  } as React.CSSProperties,
  note: {
    fontSize: '15px',
    color: '#4b5563',
    marginBottom: '16px',
    lineHeight: 1.6,
  } as React.CSSProperties,
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280',
  } as React.CSSProperties,
  info: {
    marginTop: '40px',
    padding: '20px',
    background: '#eff6ff',
    borderRadius: '8px',
    border: '1px solid #bfdbfe',
  } as React.CSSProperties,
} as const
