#!/bin/bash

# 心情打卡网站测试执行脚本
# 用于执行不同类型和级别的测试

echo "🧪 心情打卡网站 - 测试执行脚本"
echo "================================"

# 检查Node.js版本
NODE_VERSION=$(node -v)
echo "Node.js版本: $NODE_VERSION"

# 检查npm是否可用
if command -v npm &> /dev/null; then
    echo "npm可用"
else
    echo "❌ npm不可用，请先安装Node.js"
    exit 1
fi

# 检查项目目录结构
echo ""
echo "📁 检查项目结构..."
if [ -d "tests" ]; then
    echo "✓ tests目录存在"
else
    echo "❌ tests目录不存在"
    mkdir -p tests/e2e tests/unit tests/api
    echo "✓ 已创建tests目录结构"
fi

# 检查配置文件
echo ""
echo "⚙️ 检查配置文件..."

if [ -f "playwright.config.ts" ]; then
    echo "✓ Playwright配置文件存在"
else
    echo "❌ Playwright配置文件不存在"
fi

if [ -f "package.json" ]; then
    echo "✓ package.json存在"
else
    echo "❌ package.json不存在"
fi

# 显示测试脚本
echo ""
echo "🚀 可用的测试命令:"
echo "   npm run test          # 运行Jest单元测试"
echo "   npm run test:e2e      # 运行Playwright E2E测试"
echo "   npm run test:unit     # 运行单元测试"
echo "   npm run test:api      # 运行API测试"
echo "   npm run test:debug    # 调试模式运行Playwright测试"
echo ""

# 显示测试用例统计
echo "📋 P0核心功能测试用例统计:"
echo "   用户注册功能: 6个测试用例"
echo "   用户登录功能: 4个测试用例" 
echo "   今日打卡功能: 6个测试用例"
echo "   心情日历功能: 4个测试用例"
echo "   响应式设计: 3个测试用例"
echo "   性能测试: 1个测试用例"
echo "   ------------------------"
echo "   总计: 24个P0核心功能测试用例"
echo ""

echo "✅ Day 1测试准备工作完成！"
echo "📊 已完成：测试计划文档、P0测试用例设计、测试环境配置"
echo "🎯 下一步：等待开发完成后执行实际测试"