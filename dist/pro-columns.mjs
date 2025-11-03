const m = (t, r) => {
  if (!t.strategys || t.strategys.length === 0 || r.mode === "replace")
    return r;
  {
    const e = [];
    return t.strategys.forEach((s) => {
      e.push(...s.strategy);
    }), e.push(...r.strategy), {
      mode: "merge",
      strategy: e
    };
  }
}, c = (t, r) => {
  let e = { ...t };
  return r.forEach((s) => {
    s.strategy.forEach((u) => {
      const o = u(e);
      e = { ...e, ...o };
    });
  }), delete e.strategys, e;
}, p = (t) => t.map((e) => ({ ...e })).map((e) => e.strategys ? (e.strategys = e.strategys.map((s) => m(e, s)), c(e, e.strategys)) : e), y = (t) => {
  const { columns: r, enums: e = {} } = t, s = r.map((o) => {
    const n = { ...o };
    if ("enumKey" in n && n.enumKey) {
      const g = n.enumKey;
      e[g] && (n.valueEnum = e[g]), delete n.enumKey;
    }
    return n;
  });
  return p(s);
}, a = /* @__PURE__ */ new Map(), d = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(t) {
    a.set(t.name, t);
  },
  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(t) {
    return a.get(t);
  },
  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   */
  transform(t, r) {
    const e = this.getAdapter(t);
    return e ? e.transform(r) : (console.warn(`Component adapter "${t}" not found, returning original columns`), r);
  },
  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames() {
    return Array.from(a.keys());
  },
  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    a.clear();
  }
};
export {
  y as Columns,
  d as Component
};
//# sourceMappingURL=pro-columns.mjs.map
