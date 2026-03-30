#!/bin/bash

# WebSocket 测试脚本

set -e

echo "🚀 开始 WebSocket 服务器测试..."

# 配置
WEBSOCKET_URL="ws://localhost:8080"
HEALTH_CHECK_URL="http://localhost:8080/health"
TIMEOUT=10

# 函数：检查服务是否运行
check_service() {
    echo "🔍 检查 WebSocket 服务器健康状态..."
    if curl --silent --fail --max-time $TIMEOUT $HEALTH_CHECK_URL; then
        echo "✅ WebSocket 服务器健康检查通过"
        return 0
    else
        echo "❌ WebSocket 服务器健康检查失败"
        return 1
    fi
}

# 函数：测试 WebSocket 连接
test_websocket_connection() {
    echo "🔌 测试 WebSocket 连接..."
    
    # 使用 wscat 测试（如果可用）
    if command -v wscat &> /dev/null; then
        echo "使用 wscat 测试 WebSocket 连接..."
        timeout $TIMEOUT wscat -c $WEBSOCKET_URL -w 5 <<< '{"test": "connection"}' | head -10
        echo "✅ WebSocket 连接测试完成"
    else
        echo "⚠️  wscat 未安装，跳过详细连接测试"
        echo "建议安装: npm install -g wscat"
    fi
}

# 函数：测试消息发送
test_message_sending() {
    echo "📨 测试消息发送功能..."
    
    # 创建临时测试脚本
    cat > /tmp/test-websocket.js << 'EOF'
const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('WebSocket 连接已建立');
    ws.send('{"type":"test","message":"Hello WebSocket!"}');
});

ws.on('message', (data) => {
    console.log('收到回复:', data.toString());
    ws.close();
});

ws.on('close', () => {
    console.log('WebSocket 连接已关闭');
    process.exit(0);
});

ws.on('error', (error) => {
    console.error('WebSocket 错误:', error);
    process.exit(1);
});
EOF

    if node /tmp/test-websocket.js; then
        echo "✅ 消息发送测试通过"
    else
        echo "❌ 消息发送测试失败"
        return 1
    fi
    
    # 清理临时文件
    rm -f /tmp/test-websocket.js
}

# 函数：性能测试
performance_test() {
    echo "⚡ 执行性能测试..."
    
    # 测试连接建立时间
    START_TIME=$(date +%s%3N)
    node -e "
        const WebSocket = require('ws');
        const ws = new WebSocket('ws://localhost:8080');
        ws.on('open', () => {
            console.log('连接建立时间:', Date.now() - $START_TIME, 'ms');
            ws.close();
        });
        ws.on('error', (err) => {
            console.error('连接错误:', err);
            process.exit(1);
        });
    "
    
    echo "✅ 性能测试完成"
}

# 主测试流程
main() {
    echo "🧪 WebSocket 服务器综合测试"
    echo "================================"
    
    # 检查服务
    if ! check_service; then
        echo "❌ 测试失败：服务未运行"
        exit 1
    fi
    
    # 测试连接
    test_websocket_connection
    
    # 测试消息
    if ! test_message_sending; then
        echo "❌ 测试失败：消息发送异常"
        exit 1
    fi
    
    # 性能测试
    performance_test
    
    echo "================================"
    echo "🎉 所有测试通过！WebSocket 服务器配置正确"
}

# 执行主函数
main