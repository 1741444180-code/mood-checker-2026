#!/bin/bash
# Day 28 成员确认状态检查脚本

echo "=== Day 28 成员确认状态检查 ==="
echo "检查时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo ""

confirmed=0
pending=0

for member in xiaoya xiaolin mimi laozhang xiaochen; do
    file="/Users/lijianquan/.openclaw/workspace-$member/DAY28-CONFIRMED.md"
    if [ -f "$file" ]; then
        # 检查是否已填写确认时间
        if grep -q "\[请填写\]" "$file"; then
            echo "⏳ $member: 等待确认"
            ((pending++))
        else
            confirm_time=$(grep "**确认时间：" "$file" | cut -d':' -f2-)
            echo "✅ $member: 已确认 ($confirm_time)"
            ((confirmed++))
        fi
    else
        echo "❌ $member: 未找到确认文件"
        ((pending++))
    fi
done

echo ""
echo "=== 汇总 ==="
echo "已确认：$confirmed/5"
echo "待确认：$pending/5"

if [ $confirmed -eq 5 ]; then
    echo "✅ 所有成员已确认！"
    exit 0
else
    echo "⏳ 等待成员确认..."
    exit 1
fi
