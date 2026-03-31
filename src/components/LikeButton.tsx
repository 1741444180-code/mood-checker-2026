'use client'

import { useState, useEffect } from 'react'

interface LikeButtonProps {
  checkInId: string
  userId: string
}

interface LikeData {
  liked: boolean
  likeCount: number
}

export default function LikeButton({ checkInId, userId }: LikeButtonProps) {
  const [likeData, setLikeData] = useState<LikeData>({ liked: false, likeCount: 0 })
  const [loading, setLoading] = useState(false)
  const [animating, setAnimating] = useState(false)

  // 获取点赞数据
  const fetchLikes = async () => {
    try {
      const res = await fetch(`/api/likes?userId=${userId}&checkInId=${checkInId}`)
      const data = await res.json()
      if (data.success) {
        setLikeData({ liked: data.liked, likeCount: data.likeCount })
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error)
    }
  }

  useEffect(() => {
    fetchLikes()
  }, [checkInId, userId])

  // 处理点赞/取消点赞
  const handleLike = async () => {
    if (loading) return

    setLoading(true)
    const isLiking = !likeData.liked // 当前操作：点赞还是取消

    // 乐观更新 UI
    setLikeData(prev => ({
      liked: isLiking,
      likeCount: isLiking ? prev.likeCount + 1 : prev.likeCount - 1
    }))
    setAnimating(isLiking)

    try {
      const res = await fetch('/api/likes', {
        method: isLiking ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, checkInId }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // 服务器确认，同步数据
        setLikeData({ liked: data.liked, likeCount: data.likeCount })
      } else {
        // 失败，回滚
        fetchLikes()
      }
    } catch (error) {
      console.error('Like error:', error)
      fetchLikes() // 回滚
    } finally {
      setLoading(false)
      setTimeout(() => setAnimating(false), 300)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`like-button ${likeData.liked ? 'liked' : ''} ${animating ? 'animating' : ''}`}
      style={styles.button}
      aria-label={likeData.liked ? '取消点赞' : '点赞'}
    >
      <span style={styles.icon} className={animating ? 'like-icon-anim' : ''}>
        {likeData.liked ? '❤️' : '🤍'}
      </span>
      <span style={styles.count}>{likeData.likeCount}</span>
      <style jsx>{`
        @keyframes like-pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.4);
          }
          100% {
            transform: scale(1);
          }
        }

        .like-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 9999px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: #6b7280;
        }

        .like-button:hover {
          border-color: #f43f5e;
          background: #fef2f2;
        }

        .like-button.liked {
          border-color: #f43f5e;
          background: #fef2f2;
          color: #f43f5e;
        }

        .like-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .like-button.animating .like-icon-anim {
          animation: like-pop 0.3s ease;
        }
      `}</style>
    </button>
  )
}

const styles = {
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '9999px',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    color: '#6b7280',
  } as React.CSSProperties,
  icon: {
    fontSize: '18px',
    display: 'inline-block',
  } as React.CSSProperties,
  count: {
    fontWeight: 500,
  } as React.CSSProperties,
}
