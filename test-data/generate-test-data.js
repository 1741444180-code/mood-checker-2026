const fs = require('fs');
const path = require('path');

// 心情类型定义
const moodTypes = [
  { id: 1, name: "😄 开心", color: "#FFD700", weight: 0.25 }, // 25%
  { id: 2, name: "😊 平静", color: "#90EE90", weight: 0.30 }, // 30%
  { id: 3, name: "😔 低落", color: "#87CEEB", weight: 0.15 }, // 15%
  { id: 4, name: "😠 生气", color: "#FF6B6B", weight: 0.10 }, // 10%
  { id: 5, name: "😰 焦虑", color: "#DDA0DD", weight: 0.10 }, // 10%
  { id: 6, name: "😴 疲惫", color: "#D3D3D3", weight: 0.07 }, // 7%
  { id: 7, name: "🤩 兴奋", color: "#FF69B4", weight: 0.03 }  // 3%
];

// 随机生成备注内容
function getRandomNote() {
  const notes = [
    "今天工作顺利，心情不错",
    "遇到了一些困难，但还是解决了",
    "感觉有点累，需要休息一下",
    "和朋友聚会，很开心",
    "天气很好，适合出门走走",
    "学到了新知识，很有成就感",
    "今天比较忙，没时间做其他事",
    "看了喜欢的电影，放松了一下",
    "运动后感觉身心愉悦",
    "遇到了不开心的事，但会过去的",
    "早上喝了杯咖啡，精神满满",
    "完成了今天的任务，很有满足感",
    "遇到了老朋友，聊得很愉快",
    "读了一本好书，收获颇丰",
    "听到了好消息，心情大好",
    "遇到了挫折，但会努力克服",
    "今天没什么特别的，平平淡淡",
    "家人打来电话，感到温暖",
    "学习新技能，虽然难但有进步",
    "做了美味的食物，心情愉悦"
  ];
  return notes[Math.floor(Math.random() * notes.length)];
}

// 随机生成标签
function getRandomTags() {
  const tagOptions = [
    ["工作"],
    ["生活"],
    ["健康"],
    ["工作", "生活"],
    ["健康", "生活"],
    ["工作", "健康"]
  ];
  return tagOptions[Math.floor(Math.random() * tagOptions.length)];
}

// 生成指定用户的测试数据
function generateMoodData(userId, days = 90,打卡率 = 0.7) {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const formattedDate = date.toISOString().split('T')[0];
    
    // 根据打卡率决定是否打卡
    if (Math.random() < 打卡率) {
      // 根据心情权重随机选择心情
      const random = Math.random();
      let cumulativeWeight = 0;
      let selectedMood = moodTypes[0]; // 默认选择第一个
      
      for (const mood of moodTypes) {
        cumulativeWeight += mood.weight;
        if (random <= cumulativeWeight) {
          selectedMood = mood;
          break;
        }
      }
      
      // 60%概率添加备注
      const hasNote = Math.random() < 0.6;
      const note = hasNote ? getRandomNote() : null;
      
      data.push({
        userId,
        date: formattedDate,
        moodTypeId: selectedMood.id,
        moodName: selectedMood.name,
        moodColor: selectedMood.color,
        note: note,
        tags: getRandomTags(),
        createdAt: new Date(formattedDate).toISOString()
      });
    }
  }
  
  return data;
}

// 生成5个用户的测试数据
const users = [
  { id: 1,打卡率: 0.7, days: 90, description: "主账号，90天完整数据" },
  { id: 2,打卡率: 0.8, days: 60, description: "60天数据，打卡率80%，心情偏积极" },
  { id: 3,打卡率: 0.5, days: 30, description: "30天数据，打卡率50%，心情波动大" },
  { id: 4,打卡率: 0.9, days: 90, description: "90天数据，打卡率90%，心情稳定" },
  { id: 5,打卡率: 0.3, days: 15, description: "15天数据，新用户，数据不完整" }
];

// 创建目录（如果不存在）
const dir = './generated-data';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 为每个用户生成数据
users.forEach(user => {
  const userData = generateMoodData(user.id, user.days, user.打卡率);
  
  // 统计数据
  const moodCount = {};
  userData.forEach(record => {
    const moodName = record.moodName;
    moodCount[moodName] = (moodCount[moodName] || 0) + 1;
  });
  
  console.log(`用户 ${user.id} (${user.description}) 数据统计:`);
  console.log(`总记录数: ${userData.length}`);
  Object.entries(moodCount).forEach(([mood, count]) => {
    console.log(`  ${mood}: ${count} 条`);
  });
  console.log('');
  
  // 写入文件
  const filename = path.join(dir, `user_${user.id}_mood_data.json`);
  fs.writeFileSync(filename, JSON.stringify(userData, null, 2));
});

console.log("测试数据生成完成！");
console.log("数据文件已保存到 ./generated-data/ 目录中");