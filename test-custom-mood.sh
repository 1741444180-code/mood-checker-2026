#!/bin/bash

# 心情打卡网站 - 自定义心情功能测试脚本
# 用于自动化运行新增的测试用例

echo "🧪 开始运行自定义心情功能测试..."

# 确保在项目根目录
cd /Users/lijianquan/.openclaw/workspace/projects/mood-checker

echo "📋 检查测试文件..."
ls -la tests/e2e/custom-mood.e2e.spec.ts
ls -la tests/api/custom-mood.api.spec.ts
ls -la tests/unit/services/customMoodService.unit.spec.ts

echo "🔍 运行自定义心情E2E测试..."
npx playwright test tests/e2e/custom-mood.e2e.spec.ts --headed --project=chromium

if [ $? -eq 0 ]; then
    echo "✅ E2E测试运行成功"
else
    echo "❌ E2E测试运行失败"
fi

echo "🔍 运行自定义心情API测试..."
npx playwright test tests/api/custom-mood.api.spec.ts

if [ $? -eq 0 ]; then
    echo "✅ API测试运行成功"
else
    echo "❌ API测试运行失败"
fi

echo "🔍 运行自定义心情单元测试..."
npx vitest run tests/unit/services/customMoodService.unit.spec.ts

if [ $? -eq 0 ]; then
    echo "✅ 单元测试运行成功"
else
    echo "❌ 单元测试运行失败"
fi

echo "🔍 运行所有心情相关测试..."
npx playwright test tests/e2e/mood-checker.e2e.spec.ts

if [ $? -eq 0 ]; then
    echo "✅ 所有心情相关测试运行成功"
else
    echo "❌ 部分测试运行失败"
fi

echo "📊 生成测试报告..."
npx playwright show-report

echo "🧪 自定义心情功能测试完成！"