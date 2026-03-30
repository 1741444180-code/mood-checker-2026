import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function generateStatsData() {
  console.log('开始生成90天心情记录...')
  
  const userId = 'test-user-id' // 使用测试用户ID
  
  // 生成过去90天的心跳记录
  for (let i = 0; i < 90; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i) // 从今天开始往前推i天
    
    // 随机选择心情状态
    const moodOptions = ['开心', '平静', '焦虑', '兴奋', '沮丧', '感动']
    const randomMood = moodOptions[Math.floor(Math.random() * moodOptions.length)]
    
    // 随机生成打卡记录
    const isCheckedIn = Math.random() > 0.3 // 70%概率打卡
    
    try {
      await prisma.heartbeat.create({
        data: {
          userId,
          date: date.toISOString().split('T')[0], // 格式化为 YYYY-MM-DD
          mood: randomMood,
          note: faker.lorem.sentence(),
          isCheckedIn,
        },
      })
      
      console.log(`已创建第${i+1}天记录: ${date.toISOString().split('T')[0]} - ${randomMood}`)
    } catch (error) {
      console.error(`创建第${i+1}天记录失败:`, error)
    }
  }
  
  console.log('90天心情记录生成完成!')
  await prisma.$disconnect()
}

generateStatsData().catch((error) => {
  console.error('生成测试数据时出错:', error)
  process.exit(1)
})