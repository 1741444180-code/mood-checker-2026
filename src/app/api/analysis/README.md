# 数据分析 API

心情打卡统计和趋势分析接口。

## API 端点

### 1. GET /api/analysis/stats

获取统计数据聚合信息。

**请求参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户 ID |

**响应示例:**

```json
{
  "totalCheckIns": 25,
  "moodDistribution": [
    { "mood": 1, "count": 2 },
    { "mood": 2, "count": 3 },
    { "mood": 3, "count": 5 },
    { "mood": 4, "count": 8 },
    { "mood": 5, "count": 7 }
  ],
  "consecutiveDays": 7,
  "averageMood": 3.8
}
```

### 2. GET /api/analysis/trend

获取心情趋势数据。

**请求参数:**

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| userId | string | 是 | - | 用户 ID |
| days | number | 否 | 30 | 查询天数范围 (1-365) |

**响应示例:**

```json
{
  "data": [
    { "date": "2026-03-23", "mood": 3.5, "count": 2 },
    { "date": "2026-03-24", "mood": 4.0, "count": 1 },
    { "date": "2026-03-25", "mood": 0, "count": 0 }
  ],
  "period": {
    "start": "2026-03-23",
    "end": "2026-03-29",
    "days": 7
  }
}
```

## 测试

运行测试:

```bash
npm test
```

## 缓存策略

- 两个接口均实现了 5 分钟的内存缓存
- 相同参数的重复请求会直接返回缓存结果

## 技术栈

- **框架:** Next.js 14 (App Router)
- **ORM:** Prisma 5
- **数据库:** PostgreSQL
- **测试:** Vitest
- **语言:** TypeScript
