#!/bin/bash

# 消息推送测试脚本
# 用于验证WebSocket消息推送功能

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 开始测试消息推送配置..."
echo "工作目录: $PROJECT_ROOT"

# 检查依赖
check_dependencies() {
    echo "🔍 检查依赖..."

    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        echo "❌ npm 未安装"
        exit 1
    fi

    echo "✅ 所有依赖已安装"
}

# 启动WebSocket服务器（后台）
start_websocket_server() {
    echo "🔌 启动WebSocket服务器..."
    
    # 检查是否已经在运行
    if pgrep -f "websocket-server/server.js" > /dev/null; then
        echo "⚠️  WebSocket服务器已在运行，跳过启动"
        WEBSOCKET_PID=$(pgrep -f "websocket-server/server.js" | head -1)
    else
        cd "$PROJECT_ROOT/websocket-server"
        
        # 安装依赖（如果需要）
        if [ ! -d "node_modules" ]; then
            echo "📦 安装WebSocket服务器依赖..."
            npm init -y > /dev/null 2>&1
            npm install ws express > /dev/null 2>&1
        fi
        
        # 启动服务器
        PORT=${PORT:-8080}
        node server.js &
        WEBSOCKET_PID=$!
        echo "✅ WebSocket服务器已启动 (PID: $WEBSOCKET_PID)"
        
        # 等待服务器启动
        sleep 3
    fi
    
    cd "$PROJECT_ROOT"
}

# 测试健康检查
test_health_check() {
    echo "🏥 测试健康检查端点..."
    PORT=${PORT:-8080}
    
    if curl -s -f "http://localhost:$PORT/health" > /dev/null; then
        echo "✅ 健康检查通过"
    else
        echo "❌ 健康检查失败"
        return 1
    fi
}

# 创建测试客户端脚本
create_test_client() {
    echo "🧪 创建测试客户端..."
    
    cat > /tmp/test-websocket-client.js << 'EOF'
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;
const ws = new WebSocket(`ws://localhost:${PORT}`);

let testResults = {
    connected: false,
    authenticated: false,
    messageReceived: false,
    echoWorking: false
};

ws.on('open', () => {
    console.log('✅ WebSocket连接成功');
    testResults.connected = true;
    
    // 发送认证消息
    ws.send(JSON.stringify({
        type: 'authenticate',
        data: { userId: 'test_user_123' }
    }));
    
    // 发送测试消息
    ws.send(JSON.stringify({
        type: 'test_message',
        data: { content: 'Hello from test client!' },
        timestamp: Date.now()
    }));
});

ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('📨 收到消息:', message.type);
    
    if (message.type === 'authenticated') {
        testResults.authenticated = true;
        console.log('✅ 认证成功');
    }
    
    if (message.type === 'connection_established') {
        console.log('✅ 连接建立确认');
    }
    
    if (message.type === 'notification' || message.type === 'test_broadcast') {
        testResults.messageReceived = true;
        console.log('✅ 广播消息接收成功');
    }
    
    if (typeof message === 'string' && message.startsWith('Echo:')) {
        testResults.echoWorking = true;
        console.log('✅ Echo功能正常');
    }
});

ws.on('close', () => {
    console.log('🔌 WebSocket连接关闭');
    
    // 输出测试结果
    const passed = Object.values(testResults).every(result => result);
    console.log('\n📊 测试结果:');
    console.log('连接成功:', testResults.connected);
    console.log('认证成功:', testResults.authenticated);
    console.log('消息接收:', testResults.messageReceived);
    console.log('Echo功能:', testResults.echoWorking);
    console.log('总体结果:', passed ? '✅ 通过' : '❌ 失败');
    
    process.exit(passed ? 0 : 1);
});

// 超时处理
setTimeout(() => {
    console.log('⏰ 测试超时');
    ws.close();
}, 10000);
EOF
}

# 运行测试客户端
run_test_client() {
    echo "🏃 运行测试客户端..."
    
    if node /tmp/test-websocket-client.js; then
        echo "✅ 客户端测试通过"
        return 0
    else
        echo "❌ 客户端测试失败"
        return 1
    fi
}

# 测试Redis集成（如果可用）
test_redis_integration() {
    echo "💾 测试Redis集成..."
    
    # 检查Redis是否运行
    if redis-cli PING > /dev/null 2>&1; then
        echo "✅ Redis服务可用"
        
        # 测试简单的Redis操作
        if redis-cli SET test_key "test_value" > /dev/null 2>&1 && \
           redis-cli GET test_key | grep -q "test_value"; then
            echo "✅ Redis基本操作正常"
            redis-cli DEL test_key > /dev/null 2>&1
            return 0
        else
            echo "⚠️ Redis基本操作异常"
            return 1
        fi
    else
        echo "⚠️ Redis服务不可用，跳过Redis测试"
        return 0
    fi
}

# 清理临时文件
cleanup() {
    echo "🧹 清理临时文件..."
    rm -f /tmp/test-websocket-client.js
    
    # 如果我们启动了WebSocket服务器，则关闭它
    if [ -n "$WEBSOCKET_PID" ] && ! pgrep -f "websocket-server/server.js" > /dev/null; then
        echo "✅ WebSocket服务器已在外部管理"
    elif [ -n "$WEBSOCKET_PID" ]; then
        echo "⏹️  停止WebSocket服务器..."
        kill $WEBSOCKET_PID 2>/dev/null || true
        wait $WEBSOCKET_PID 2>/dev/null || true
    fi
}

# 主测试流程
main() {
    check_dependencies
    start_websocket_server
    test_health_check
    create_test_client
    
    echo ""
    echo "================================"
    echo "开始完整测试流程..."
    echo "================================"
    
    if test_redis_integration && test_health_check && run_test_client; then
        echo ""
        echo "🎉 所有测试通过！消息推送配置正常工作。"
        echo ""
        echo "📋 配置文件位置:"
        echo "   - WebSocket配置: $PROJECT_ROOT/src/lib/websocket-messages.ts"
        echo "   - 推送文档: $PROJECT_ROOT/message-push-config.md"
        echo "   - 测试脚本: $PROJECT_ROOT/scripts/test-message-push.sh"
        cleanup
        exit 0
    else
        echo ""
        echo "💥 测试失败！请检查错误信息。"
        cleanup
        exit 1
    fi
}

# 信号处理
trap cleanup EXIT INT TERM

# 运行主函数
main