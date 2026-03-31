# 移动端布局修复说明

## 修复日期
2026-03-29

## 问题描述
- 手机端布局不协调
- 右侧趋势分析模块（柱状图）内的布局和字体排版错位
- 移动端（375px 宽度）显示异常

## 修复内容

### 1. 整体容器优化
- **修改前**: `p-4 md:p-8`
- **修改后**: `p-3 sm:p-4 md:p-8`
- **说明**: 减小移动端 padding，增加可用空间

### 2. Header 部分
- 标题字体：`text-3xl` → `text-2xl sm:text-3xl`
- 描述文字：添加 `text-xs sm:text-sm` 和 `mt-1` 间距
- 时间选择器：`w-[180px]` → `w-full sm:w-[180px]`，移动端占满宽度
- 选择器字体：添加 `text-xs sm:text-sm`

### 3. 统计卡片（Summary Cards）
- 布局：添加 `grid-cols-2`，移动端始终显示 2 列
- 间距：`gap-4` → `gap-3 sm:gap-4`
- 卡片内边距：`pb-2` → `pb-2 sm:pb-3`
- 描述文字：`text-sm` → `text-xs sm:text-sm`
- 数字大小：`text-3xl` → `text-2xl sm:text-3xl`

### 4. 图表区域（Charts）

#### 柱状图（打卡趋势）
- 容器高度：`h-[300px]` → `h-[250px] sm:h-[300px]`
- 卡片标题：`text-xl` → `text-lg sm:text-xl`
- 卡片描述：`text-sm` → `text-xs sm:text-sm`
- X 轴字体：`fontSize={12}` → `fontSize={11}`（适配移动端）
- X 轴高度：`height={selectedDays > 14 ? 60 : 40}` → `height={selectedDays > 14 ? 55 : 40}`
- Y 轴字体：`fontSize={12}` → `fontSize={11}`
- 柱状圆角：`radius={[4, 4, 0, 0]}` → `radius={[3, 3, 0, 0]}`

#### 饼图（心情分布）
- 容器高度：`h-[300px]` → `h-[250px] sm:h-[300px]`
- 卡片标题：`text-xl` → `text-lg sm:text-xl`
- 卡片描述：`text-sm` → `text-xs sm:text-sm`
- 图例间距：`gap-4` → `gap-3 sm:gap-4`
- 图例圆点：`h-3 w-3` → `h-2.5 w-2.5 sm:h-3 sm:w-3`
- 图例文字：`text-sm` → `text-xs sm:text-sm`
- 图例 item 间距：`gap-2` → `gap-1.5 sm:gap-2`

### 5. 底部提示文字
- 间距：`mt-8` → `mt-6 sm:mt-8`
- 字体：`text-sm` → `text-xs sm:text-sm`

## 技术要点

### Tailwind CSS 响应式断点
- `sm:` = 640px (小屏手机)
- `md:` = 768px (平板)
- `lg:` = 1024px (桌面)

### 移动端优化策略
1. **减小字体大小** - 避免文字溢出
2. **调整图表高度** - 适配小屏幕
3. **优化间距** - 减少不必要的空白
4. **2 列布局** - 统计卡片在移动端保持 2 列
5. **全宽选择器** - 时间选择器在移动端更易点击

## 测试建议

### 测试设备/分辨率
- iPhone SE (375px × 667px)
- iPhone 12/13 (390px × 844px)
- iPhone 14 Pro Max (430px × 932px)
- iPad (768px × 1024px)

### 测试项目
- [ ] 页面整体布局是否协调
- [ ] 柱状图 X 轴日期标签是否清晰可读
- [ ] 饼图标签是否完整显示
- [ ] 统计卡片数字是否溢出
- [ ] 时间选择器在移动端是否易用
- [ ] 图表图例是否正常显示

## 文件位置
`/Users/lijianquan/.openclaw/workspace/projects/mood-checker/frontend/src/app/stats/page.tsx`

## 备注
- 所有修改均使用 Tailwind CSS 响应式类，无需额外 CSS
- Recharts 组件的 fontSize 等属性不支持响应式前缀，使用折中值
- 建议在实际移动设备上测试验证效果
