# Pro-Columns 待优化清单

> 本文档记录了项目后续需要改进和优化的事项，按优先级和类别组织。
> 最后更新时间：2024-11-26

## 📊 当前状态

- **项目评分**: 8.9/10
- **整体覆盖率**: 85.52%
- **核心代码质量**: 优秀

---

## 🔴 高优先级改进

### 1. 提升模块测试覆盖率

**当前状态**:
- 整体覆盖率: 85.52% ✅
- 部分模块仍低于 80% 目标

**需要改进的模块**:

| 模块 | 当前覆盖率 | 目标 | 优先级 |
|------|-----------|------|--------|
| lib/columns.ts | 68.96% | 80% | 高 |
| lib/component.ts | 78.47% | 80% | 高 |
| presets/index.ts | 79.34% | 80% | 中 |
| strategy/Enum.ts | 65.34% | 80% | 中 |
| strategy/Image.ts | 38.28% | 80% | 中 |
| strategy/Link.ts | 36.69% | 80% | 中 |
| strategy/Validation.ts | 41.53% | 80% | 中 |
| strategy/index.ts | 61.5% | 80% | 高 |

**待补充的测试**:
- [ ] lib/columns.ts: 边界条件测试 (行 50, 70-82, 86-107)
- [ ] lib/component.ts: 错误处理测试 (行 195-200, 202-205)
- [ ] strategy/Image.ts: 图片渲染功能测试 (行 48-126)
- [ ] strategy/Link.ts: 链接渲染功能测试 (行 39-107)
- [ ] strategy/Validation.ts: 验证规则测试 (行 75-181)
- [ ] strategy/index.ts: 策略执行引擎测试 (行 143-157, 160-174)

**预计工时**: 1-2 天

---

### 2. TypeScript 类型安全优化

**问题**:
- 当前有 310 处 `any` 类型使用
- 降低了类型安全性和 IDE 智能提示效果

**优化策略**:
采用渐进式优化，分模块逐步消除 `any` 使用

**阶段 1: 类型定义文件** (优先级: 高)
- [ ] 优化 `type.d.ts` 中的类型定义
- [ ] 为常用的 `Record<string, any>` 定义具体接口
- [ ] 增强泛型约束

**阶段 2: 组件层** (优先级: 高)
- [ ] `components/ProColumnsTable/index.tsx` - 移除 `as any` 断言
- [ ] `components/ProColumnsForm/index.tsx` - 定义具体的 Props 类型
- [ ] `components/ProColumnsDescription/index.tsx` - 优化类型推导

**阶段 3: 核心库** (优先级: 中)
- [ ] `lib/columns.ts` - 优化列转换的类型定义
- [ ] `lib/component.ts` - 改进适配器类型系统
- [ ] `adapter/*.ts` - 增强适配器类型安全

**阶段 4: 策略层** (优先级: 低)
- [ ] 为每个策略定义精确的选项类型
- [ ] 移除策略内部的 `any` 使用

**参考改进示例**:
```typescript
// 改进前
export interface ProColumnsFormProps extends Record<string, any>

// 改进后
export interface ProColumnsFormProps extends Omit<BetaSchemaFormProps, 'columns'> {
  columns: ProColumnsType.ColumnType[]
  strategys?: ProColumnsType.Strategy[]
  enumMap?: Record<string, any[]>
}
```

**完成标准**:
- ESLint 规则改为 `'@typescript-eslint/no-explicit-any': 'error'`
- 所有 lint 检查通过

**预计工时**: 3-5 天

---

## 🟡 中优先级改进

### 3. 添加安全政策文档

- [ ] 创建 `SECURITY.md`
- [ ] 定义支持的版本
- [ ] 说明安全漏洞报告流程
- [ ] 添加安全更新策略

**预计工时**: 1 小时

---

### 4. 添加 Git Hooks

**目标**: 提交前自动进行代码质量检查

**实施步骤**:
- [ ] 安装 husky: `pnpm add -D husky`
- [ ] 安装 lint-staged: `pnpm add -D lint-staged`
- [ ] 初始化 husky: `pnpm exec husky init`
- [ ] 配置 lint-staged 规则
- [ ] 添加 pre-commit 钩子

**配置示例**:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**预计工时**: 2 小时

---

### 5. 集成 Bundle Size 监控

**目标**: 监控打包体积，防止意外膨胀

**实施步骤**:
- [ ] 安装 bundlesize: `pnpm add -D bundlesize`
- [ ] 配置大小限制 (当前 ESM: 82KB)
- [ ] 在 CI 中添加检查
- [ ] 在 PR 中显示体积变化

**package.json 配置**:
```json
{
  "bundlesize": [
    {
      "path": "./dist/pro-columns.mjs",
      "maxSize": "90 KB"
    }
  ]
}
```

**预计工时**: 2 小时

---

### 6. 增强 CI 覆盖率报告

**目标**: 在 PR 中直观展示覆盖率变化

**实施步骤**:
- [ ] 添加覆盖率对比 Action
- [ ] 在 PR 评论中显示覆盖率变化
- [ ] 启用 Codecov 严格模式
- [ ] 添加覆盖率徽章更新

**预计工时**: 2 小时

---

## 🟢 低优先级优化

### 7. 添加 E2E 测试

**目标**: 覆盖端到端的用户场景

**技术选型**: Playwright

**测试场景**:
- [ ] ProColumnsTable 完整交互流程
- [ ] ProColumnsForm 表单提交
- [ ] 策略组合的实际效果
- [ ] 场景化配置的切换

**预计工时**: 3-5 天

---

### 8. 增强 Storybook 功能

**新增插件**:
- [ ] `@storybook/addon-a11y` - 可访问性检查
- [ ] `@storybook/addon-coverage` - 覆盖率集成
- [ ] `chromatic` - 视觉回归测试

**改进内容**:
- [ ] 为每个策略添加独立 Story
- [ ] 添加交互式示例
- [ ] 部署到 GitHub Pages

**预计工时**: 2-3 天

---

### 9. 为策略添加独立文档

**目标**: 每个策略都有详细的使用说明

**待补充文档**:
- [ ] strategy/README.md - 策略系统总览
- [ ] 每个策略的详细文档
  - 用途说明
  - 配置选项
  - 使用示例
  - 注意事项
  - 最佳实践

**预计工时**: 2-3 天

---

### 10. 支持按需导入

**目标**: 优化打包体积，支持 Tree Shaking

**实施方案**:
```typescript
// 当前方式
import { Search, Sort } from 'pro-columns'

// 支持按需导入
import { Search } from 'pro-columns/strategy/Search'
import { ProColumnsTable } from 'pro-columns/components/ProColumnsTable'
```

**实施步骤**:
- [ ] 优化导出结构
- [ ] 更新 package.json 的 exports 字段
- [ ] 优化 Vite 打包配置
- [ ] 更新文档说明

**预计工时**: 1 天

---

### 11. 添加样式主题定制能力

**目标**: 支持 Ant Design 主题定制

**实施步骤**:
- [ ] 设计 ThemeConfig 接口
- [ ] 在组件中支持主题配置传递
- [ ] 文档说明主题定制方法
- [ ] 添加主题定制示例

**API 设计**:
```typescript
interface ThemeConfig {
  token?: Record<string, any>
  algorithm?: Theme[]
}

<ProColumnsTable
  theme={themeConfig}
  // ...
/>
```

**预计工时**: 1-2 天

---

## 🔵 长期目标

### 12. 建立文档站点

**目标**: 提供更好的文档阅读体验

**技术选型**: VitePress

**内容规划**:
- [ ] 首页和介绍
- [ ] 快速开始
- [ ] API 文档
- [ ] 策略指南
- [ ] 最佳实践
- [ ] 常见问题
- [ ] 更新日志
- [ ] 集成 Storybook

**部署**: GitHub Pages

**预计工时**: 1-2 周

---

### 13. 国际化支持

**目标**: 扩大用户群，支持国际开发者

**实施步骤**:
- [ ] 添加英文版 README: `README.en.md`
- [ ] 翻译关键文档
  - [ ] STRATEGIES_GUIDE.en.md
  - [ ] CUSTOM_STRATEGY.en.md
  - [ ] CONTRIBUTING.en.md
- [ ] 更新 package.json description 为英文
- [ ] 在 GitHub 添加 topics:
  - typescript
  - react
  - ant-design
  - pro-components
  - columns
  - schema

**预计工时**: 3-5 天

---

### 14. 添加性能测试

**目标**: 监控和优化组件性能

**测试场景**:
- [ ] 大数据集渲染 (10000+ 条)
- [ ] 复杂策略组合性能
- [ ] 策略缓存效果验证
- [ ] 内存占用监控

**测试工具**:
- React DevTools Profiler
- Lighthouse
- 自定义性能测试

**预计工时**: 2-3 天

---

### 15. 统一测试数据管理

**目标**: 改善测试可维护性

**实施步骤**:
- [ ] 创建 `tests/fixtures/` 目录
- [ ] 统一管理 mock 数据
  - mockColumns.ts
  - mockDataSource.ts
  - mockStrategies.ts
  - mockEnums.ts
- [ ] 重构现有测试引用统一 fixtures

**预计工时**: 1-2 天

---

## 📈 优化路线图时间线

```
┌─────────────┬──────────────┬──────────────┬──────────────┐
│  本周内     │   1-2周      │    1个月     │   2-3个月    │
├─────────────┼──────────────┼──────────────┼──────────────┤
│ ✅ LICENSE  │ 安全文档     │ E2E 测试     │ 文档站点     │
│ ✅ 覆盖率   │ Git Hooks    │ Storybook    │ 国际化       │
│ ✅ Issue模板│ Bundle Size  │ 策略文档     │ 性能测试     │
│ ✅ PR模板   │ TypeScript   │ 按需导入     │ 主题定制     │
│ ✅ Examples │ CI 增强      │              │ 测试数据管理 │
└─────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 📝 备注

### 优先级说明

- **🔴 高优先级**: 影响代码质量和用户体验的核心问题
- **🟡 中优先级**: 重要的改进，但不紧急
- **🟢 低优先级**: 锦上添花的优化
- **🔵 长期目标**: 需要较多时间投入的大型改进

### 更新记录

- 2024-11-26: 初始版本，完成高优先级任务和中优先级部分任务
  - ✅ 添加 LICENSE 文件
  - ✅ 优化测试覆盖率配置 (整体达到 85.52%)
  - ✅ 创建 Issue/PR 模板
  - ✅ 完善 Examples 文档
  - ⏳ TypeScript 类型优化（待渐进式完成）

### 贡献

欢迎社区贡献者认领任务！请在对应 Issue 中留言，我们会分配给你。

---

**持续更新中...** 🚀
