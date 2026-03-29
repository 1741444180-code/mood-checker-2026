# 心情打卡网站测试环境配置

## 环境信息

### 开发环境
- **URL**: [待配置]
- **访问方式**: [待配置]
- **账号信息**: 
  - 管理员账号: [待配置]
  - 测试账号: [待配置]

### 测试环境
- **URL**: [待配置]
- **访问方式**: [待配置]
- **账号信息**: 
  - 管理员账号: [待配置]
  - 测试账号: [待配置]

### 预发布环境
- **URL**: [待配置]
- **访问方式**: [待配置]
- **账号信息**: [待配置]

## 浏览器配置

### Chrome
- **版本**: 最新版
- **插件**: 
  - Lighthouse (性能测试)
  - React Developer Tools
  - Redux DevTools

### Safari
- **版本**: 最新版
- **特殊配置**: [如有]

### Firefox
- **版本**: 最新版
- **插件**:
  - Lighthouse (通过网页版)

## 设备配置

### PC端
- **分辨率**: 1920x1080
- **浏览器**: Chrome、Safari、Firefox
- **操作系统**: Windows 10/11, macOS

### 手机端
- **设备**: iPhone SE模拟 (375x667)
- **设备**: iPhone 12模拟 (390x844)
- **浏览器**: Safari Mobile, Chrome Mobile

### 平板端
- **设备**: iPad模拟 (768x1024)
- **浏览器**: Safari, Chrome

## 测试工具

### 性能测试工具
- **Lighthouse**: CLI和浏览器扩展
- **WebPageTest**: 在线性能分析
- **GTmetrix**: 页面速度分析

### 安全测试工具
- **OWASP ZAP**: 漏洞扫描
- **Burp Suite**: 渗透测试
- **SQLMap**: SQL注入检测

### 自动化测试工具
- **Playwright**: E2E测试
- **Jest**: 单元测试
- **Cypress**: 集成测试

## 测试数据

### 用户账号
```json
[
  {
    "id": 1,
    "username": "建权",
    "email": "jianquan@example.com",
    "phone": "13800138001",
    "password": "[待设置]",
    "role": "main",
    "description": "主账号，90天完整数据"
  },
  {
    "id": 2,
    "username": "测试用户A",
    "email": "testa@example.com", 
    "phone": "13800138002",
    "password": "[待设置]",
    "role": "active",
    "description": "60天数据，打卡率80%，心情偏积极"
  },
  {
    "id": 3,
    "username": "测试用户B",
    "email": "testb@example.com",
    "phone": "13800138003", 
    "password": "[待设置]",
    "role": "fluctuating",
    "description": "30天数据，打卡率50%，心情波动大"
  },
  {
    "id": 4,
    "username": "测试用户C",
    "email": "testc@example.com",
    "phone": "13800138004",
    "password": "[待设置]",
    "role": "stable", 
    "description": "90天数据，打卡率90%，心情稳定"
  },
  {
    "id": 5,
    "username": "测试用户D",
    "email": "testd@example.com",
    "phone": "13800138005",
    "password": "[待设置]",
    "role": "new",
    "description": "15天数据，新用户，数据不完整"
  }
]
```

### API端点
- **基础URL**: [待配置]
- **用户注册**: POST /api/auth/register
- **用户登录**: POST /api/auth/login
- **心情打卡**: POST /api/moods
- **获取心情**: GET /api/moods
- **统计数据**: GET /api/stats/daily|weekly|monthly
- **日历数据**: GET /api/calendar

## 监控指标

### 性能指标
- **首屏加载时间**: < 3秒
- **页面完全加载**: < 5秒
- **Lighthouse性能评分**: ≥ 90
- **API响应时间**: < 500ms
- **数据库查询时间**: < 100ms

### 功能指标
- **注册成功率**: > 95%
- **登录成功率**: > 98%
- **打卡成功率**: > 98%
- **数据一致性**: 100%

### 安全指标
- **漏洞数量**: 0高危，<5中危
- **认证通过率**: 100%
- **数据加密**: 100%

## 联系人信息

### 开发团队
- **后端Bug**: 咪咪 - [联系方式]
- **前端Bug**: 小林 - [联系方式] 
- **部署验证**: 老张 - [联系方式]
- **项目管理**: 大伟 - [联系方式]

### 产品团队
- **产品确认**: 建权 - [联系方式]
- **验收确认**: 黄金九 - [联系方式]

## 测试进度跟踪

### 当前状态
- [ ] 环境配置完成
- [ ] 测试数据准备完成
- [ ] 测试用例设计完成
- [ ] 测试工具安装配置完成
- [ ] 测试执行中...

### 风险预警
- [ ] 环境不稳定
- [ ] 功能未完成
- [ ] 性能不达标
- [ ] 安全漏洞

## 备注
- 测试期间如遇紧急问题，请联系项目经理大伟
- 所有测试结果需记录到测试报告中
- 发现的Bug需及时提交到项目管理系统