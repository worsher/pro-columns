const m = (t, r) => {
  if (!t.strategys || t.strategys.length === 0 || r.mode === "replace")
    return r;
  {
    const s = [];
    return t.strategys.forEach((e) => {
      s.push(...e.strategy);
    }), s.push(...r.strategy), {
      mode: "merge",
      strategy: s
    };
  }
}, d = (t, r, s) => {
  let e = { ...t };
  return r.forEach((n) => {
    if (n.scene) {
      const o = Array.isArray(n.scene) ? n.scene : [n.scene];
      if (s && !o.includes(s))
        return;
    }
    n.strategy.forEach((o) => {
      const c = o(e, s);
      e = { ...e, ...c };
    });
  }), delete e.strategys, e;
}, l = (t, r) => t.map((e) => ({ ...e })).map((e) => e.strategys ? (e.strategys = e.strategys.map((n) => m(e, n)), d(e, e.strategys, r)) : e), y = (t) => {
  const { columns: r, enums: s = {}, scene: e } = t, n = r.map((c) => {
    const a = { ...c };
    if ("enumKey" in a && a.enumKey) {
      const p = a.enumKey;
      s[p] && (a.valueEnum = s[p]), delete a.enumKey;
    }
    return a;
  });
  return l(n, e);
}, u = /* @__PURE__ */ new Map(), g = {
  proTable: "table",
  proForm: "form",
  proDescription: "description"
}, i = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(t) {
    u.set(t.name, t);
  },
  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(t) {
    return u.get(t);
  },
  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   * @param enums 枚举字典（可选）
   * @param scene 场景（可选，如不提供则自动推断）
   */
  transform(t, r, s, e) {
    const n = this.getAdapter(t);
    if (!n)
      return console.warn(`Component adapter "${t}" not found, returning original columns`), r;
    const o = e || n.scene || g[t], c = y({
      columns: r,
      enums: s,
      scene: o
    });
    return n.transform(c);
  },
  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames() {
    return Array.from(u.keys());
  },
  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    u.clear();
  }
};
export {
  y as Columns,
  i as Component
};
//# sourceMappingURL=pro-columns.mjs.map
