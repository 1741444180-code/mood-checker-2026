const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MOODS = [
  { level: 1, emoji: '😄', label: '开心' },
  { level: 2, emoji: '😊', label: '愉快' },
  { level: 3, emoji: '😐', label: '一般' },
  { level: 4, emoji: '😔', label: '难过' },
  { level: 5, emoji: '😢', label: '伤心' },
  { level: 6, emoji: '😠', label: '生气' },
  { level: 7, emoji: '😰', label: '焦虑' },
];

const TAGS_POOL = ['工作', '学习', '运动', '社交', '休息', '旅行', '家庭', '健康'];
const NOTES = [
  '今天工作很顺利，完成了所有任务！',
  '跟朋友出去吃了顿好吃的',
  '天气不错，散了个步',
  '项目有点赶，加了会儿班',
  '看了一部很棒的电影',
  '跑步5公里，感觉很爽',
  '和家人视频聊天，很开心',
  '今天有点累，早点休息',
  '学了一个新技能',
  '遇到一个难题，但最终解决了',
  null, null, null, // 有些天没写备注
];

async function seed() {
  console.log('🌱 开始种子数据...');

  // 创建测试用户
  const user = await prisma.user.upsert({
    where: { email: 'jianquan@test.com' },
    update: {},
    create: {
      username: 'jianquan',
      email: 'jianquan@test.com',
      password: 'jq123456',
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: 'demo@test.com' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@test.com',
      password: 'demo123',
    },
  });

  console.log(`✅ 用户: ${user.username} (id=${user.id}), ${demo.username} (id=${demo.id})`);

  // 为 demo 用户生成 30 天数据
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 模拟真实心情波动：工作日偏一般，周末偏开心
    const dayOfWeek = date.getDay();
    let moodIndex;
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      moodIndex = Math.random() > 0.3 ? 0 : 1; // 周末多开心
    } else {
      moodIndex = Math.floor(Math.random() * 4); // 工作日随机前4种
    }
    // 偶尔有坏心情
    if (Math.random() < 0.1) moodIndex = 3 + Math.floor(Math.random() * 4);

    const mood = MOODS[moodIndex];
    const note = NOTES[Math.floor(Math.random() * NOTES.length)];
    const tagCount = Math.floor(Math.random() * 3);
    const tags = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = TAGS_POOL[Math.floor(Math.random() * TAGS_POOL.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    await prisma.moodRecord.upsert({
      where: { userId_date: { userId: demo.id, date } },
      update: { moodLevel: mood.level, moodEmoji: mood.emoji, moodLabel: mood.label, note, tags: tags.join(',') },
      create: { userId: demo.id, date, moodLevel: mood.level, moodEmoji: mood.emoji, moodLabel: mood.label, note, tags: tags.join(',') },
    });
  }

  const count = await prisma.moodRecord.count({ where: { userId: demo.id } });
  console.log(`✅ demo 用户: ${count} 条心情记录（最近30天）`);

  // 也给 jianquan 生成 10 天数据
  for (let i = 9; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const mood = MOODS[Math.floor(Math.random() * 3)];
    const note = NOTES[Math.floor(Math.random() * NOTES.length)];

    await prisma.moodRecord.upsert({
      where: { userId_date: { userId: user.id, date } },
      update: { moodLevel: mood.level, moodEmoji: mood.emoji, moodLabel: mood.label, note },
      create: { userId: user.id, date, moodLevel: mood.level, moodEmoji: mood.emoji, moodLabel: mood.label, note },
    });
  }

  const jqCount = await prisma.moodRecord.count({ where: { userId: user.id } });
  console.log(`✅ jianquan 用户: ${jqCount} 条心情记录`);
  console.log('🎉 种子数据完成！');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
