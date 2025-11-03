const h = (t, s) => {
  if (!t.strategys || t.strategys.length === 0 || s.mode === "replace")
    return s;
  {
    const n = [];
    return t.strategys.forEach((e) => {
      n.push(...e.strategy);
    }), n.push(...s.strategy), {
      mode: "merge",
      strategy: n
    };
  }
}, S = (t, s, n) => {
  let e = { ...t };
  return s.forEach((o) => {
    if (o.scene) {
      const g = Array.isArray(o.scene) ? o.scene : [o.scene];
      if (n && !g.includes(n))
        return;
    }
    o.strategy.forEach((g) => {
      const u = g(e, n);
      e = { ...e, ...u };
    });
  }), delete e.strategys, e;
}, C = (t, s) => t.map((e) => ({ ...e })).map((e) => e.strategys ? (e.strategys = e.strategys.map((o) => h(e, o)), S(e, e.strategys, s)) : e), M = (t) => {
  const {
    columns: s,
    enums: n = {},
    scene: e,
    applyStrategies: o,
    mergeMode: g = !0,
    columnStrategies: u
  } = t, i = s.map((a) => {
    const r = { ...a };
    if ("enumKey" in r && r.enumKey) {
      const c = r.enumKey;
      n[c] && (r.valueEnum = n[c]), delete r.enumKey;
    }
    return r;
  }).map((a) => {
    if (!o || o.length === 0)
      return a;
    const r = { ...a }, c = {
      mode: "merge",
      strategy: o
    };
    return g ? r.strategys = [...a.strategys || [], c] : r.strategys = [c], r;
  }).map((a) => {
    if (!u || u.length === 0)
      return a;
    const r = u.find(
      (f) => f.dataIndex === a.dataIndex
    );
    if (!r)
      return a;
    const c = { ...a }, y = {
      mode: "merge",
      strategy: r.strategies
    };
    return (r.mergeMode !== void 0 ? r.mergeMode : !0) ? c.strategys = [...c.strategys || [], y] : c.strategys = [y], c;
  });
  return C(i, e);
}, m = /* @__PURE__ */ new Map(), A = {
  proTable: "table",
  proForm: "form",
  proDescription: "description"
}, K = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(t) {
    m.set(t.name, t);
  },
  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(t) {
    return m.get(t);
  },
  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   * @param options 配置选项
   */
  transform(t, s, n) {
    const e = this.getAdapter(t);
    if (!e)
      return console.warn(`Component adapter "${t}" not found, returning original columns`), s;
    const { enums: o, scene: g, applyStrategies: u, mergeMode: l = !0, columnStrategies: p } = n || {}, i = g || e.scene || A[t], d = M({
      columns: s,
      enums: o,
      scene: i,
      applyStrategies: u,
      mergeMode: l,
      columnStrategies: p
    });
    return e.transform(d);
  },
  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames() {
    return Array.from(m.keys());
  },
  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    m.clear();
  }
};
export {
  M as Columns,
  K as Component
};
//# sourceMappingURL=pro-columns.mjs.map
