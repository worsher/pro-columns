# Pro-Columns 示例项目

这是 pro-columns 的示例项目，展示了库的各种功能和使用场景。

## 📦 项目结构

```
examples/
├── src/
│   ├── pages/              # 示例页面
│   │   ├── ProTableDemo.tsx           # ProColumnsTable 示例
│   │   ├── ProFormDemo.tsx            # ProColumnsForm 示例
│   │   ├── ProDescriptionDemo.tsx     # ProColumnsDescription 示例
│   │   ├── NewStrategiesDemo.tsx      # 新策略功能演示
│   │   ├── CustomStrategyDemo.tsx     # 自定义策略示例
│   │   └── ComprehensiveDemo.tsx      # 综合演示
│   ├── components/         # 示例组件
│   ├── App.tsx            # 主应用
│   └── main.tsx           # 入口文件
├── package.json
└── vite.config.ts
```

## 🚀 快速开始

### 安装依赖

在项目根目录（不是 examples 目录）运行：

```bash
pnpm install
```

### 运行示例

```bash
# 在 examples 目录下
cd examples
pnpm run dev
```

示例应用将在 `http://localhost:5173` 启动。

### 构建示例

```bash
cd examples
pnpm run build
```

构建产物将生成在 `examples/dist` 目录。

### 预览构建

```bash
cd examples
pnpm run preview
```

## 📖 示例说明

### 1. ProTableDemo.tsx - ProColumnsTable 示例

展示 ProColumnsTable 组件的基本用法和各种策略的应用。

**包含的示例**:
- 基础表格配置
- 搜索、排序、格式化等常用策略
- 表格操作列
- 数据导出功能

**访问路径**: `/table`

### 2. ProFormDemo.tsx - ProColumnsForm 示例

展示 ProColumnsForm 组件的表单场景应用。

**包含的示例**:
- 表单字段配置
- 表单验证策略
- 默认值设置
- 字段联动

**访问路径**: `/form`

### 3. ProDescriptionDemo.tsx - ProColumnsDescription 示例

展示 ProColumnsDescription 组件的详情展示场景。

**包含的示例**:
- 详情页配置
- 格式化展示
- 工具提示应用
- 复制功能

**访问路径**: `/description`

### 4. NewStrategiesDemo.tsx - 新策略功能演示

展示最新添加的策略功能。

**包含的示例**:
- Conditional 条件策略
- Filter 数据过滤
- Aggregation 数据聚合
- Export 导出策略

**访问路径**: `/new-strategies`

### 5. CustomStrategyDemo.tsx - 自定义策略示例

展示如何创建和使用自定义策略。

**包含的示例**:
- 自定义策略定义
- 策略注册
- 策略应用
- 策略组合

**访问路径**: `/custom-strategy`

### 6. ComprehensiveDemo.tsx - 综合演示

展示多种策略组合使用的综合场景。

**包含的示例**:
- 复杂业务场景
- 多策略组合
- 场景化配置
- 预设系统应用

**访问路径**: `/comprehensive`

## 🎯 使用场景

### 场景 1: 快速上手

查看 `ProTableDemo.tsx`，了解最基本的使用方式。

### 场景 2: 学习策略

浏览各个示例文件，了解不同策略的用法：
- 搜索策略 → ProTableDemo.tsx
- 表单验证 → ProFormDemo.tsx
- 格式化 → ProDescriptionDemo.tsx
- 高级策略 → NewStrategiesDemo.tsx

### 场景 3: 自定义扩展

参考 `CustomStrategyDemo.tsx`，学习如何创建自己的策略。

### 场景 4: 实际应用

查看 `ComprehensiveDemo.tsx`，了解在实际业务中如何组合使用多种功能。

## 💡 开发提示

### 本地调试 pro-columns

如果你正在开发 pro-columns 库本身，可以这样调试：

1. 在项目根目录构建库：
   ```bash
   pnpm run build
   ```

2. 在 examples 目录启动开发服务器：
   ```bash
   cd examples
   pnpm run dev
   ```

3. 修改库代码后，重新构建即可在示例中看到效果。

### 添加新示例

1. 在 `src/pages/` 目录创建新的示例文件
2. 在 `App.tsx` 中添加路由配置
3. 更新本 README 文档

## 🔗 相关资源

- [主项目 README](../README.md)
- [策略使用指南](../STRATEGIES_GUIDE.md)
- [自定义策略指南](../CUSTOM_STRATEGY.md)
- [场景化配置指南](../SCENE_USAGE.md)
- [贡献指南](../CONTRIBUTING.md)

## 📝 技术栈

- **React**: 18.2.0
- **Ant Design**: 5.13.2
- **Pro Components**: 2.8.1
- **Vite**: 5.0.12
- **TypeScript**: 5.3.3
- **React Router**: 6.21.3

## ❓ 常见问题

### Q: 为什么修改了库代码，示例没有更新？

A: 需要在根目录重新构建库 (`pnpm run build`)，因为示例引用的是构建后的产物。

### Q: 如何添加新的依赖？

A: 在 examples 目录运行：
```bash
pnpm add <package-name>
```

### Q: 如何调试具体的策略？

A: 可以在对应的示例页面中打开浏览器开发者工具，查看 columns 的转换结果。

## 🤝 贡献

欢迎提交新的示例！请确保：

1. 代码清晰易懂
2. 包含适当的注释
3. 更新本 README 文档
4. 遵循项目的代码规范

## 📄 许可证

与主项目相同，使用 ISC 许可证。
