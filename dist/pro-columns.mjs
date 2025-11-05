import D from "react";
import { ProTable as wt, BetaSchemaForm as Ct, ProDescriptions as It } from "@ant-design/pro-components";
function qe(a, r) {
  const t = { ...a };
  return Object.keys(r).forEach((n) => {
    const i = r[n], o = t[n];
    i && typeof i == "object" && !Array.isArray(i) && o && typeof o == "object" && !Array.isArray(o) ? t[n] = qe(o, i) : t[n] = i;
  }), t;
}
function P(a, r) {
  return r in a && a[r] !== void 0;
}
function T(a, r, t) {
  return P(a, r) ? a[r] : t;
}
function Xt(a, r, t) {
  return {
    ...a,
    [r]: t
  };
}
function Ft(a) {
  if (P(a, "valueType"))
    return T(a, "valueType", "text") || "text";
  if (P(a, "valueEnum")) return "select";
  if (P(a, "fieldProps")) {
    const r = T(a, "fieldProps");
    if ((r == null ? void 0 : r.mode) === "multiple") return "select";
    if ((r == null ? void 0 : r.type) === "password") return "password";
  }
  return "text";
}
function He(a, r = "input") {
  const t = T(a, "title", "字段"), n = Ft(a), i = {
    search: "搜索",
    input: "请输入",
    select: "请选择"
  };
  let o = r;
  return ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(n) && (o = "select"), `${i[o]}${t}`;
}
function I(a) {
  return (r, t) => {
    const n = a(r, t);
    return qe(r, n);
  };
}
const de = (a = {}) => {
  const { enable: r = !0, searchTypeMap: t = {} } = a, n = {
    text: "text",
    textarea: "text",
    password: "text",
    digit: "digit",
    digitRange: "digitRange",
    money: "digit",
    date: "date",
    dateRange: "dateRange",
    dateTime: "dateTime",
    dateTimeRange: "dateTimeRange",
    time: "time",
    timeRange: "timeRange",
    select: "select",
    radio: "select",
    checkbox: "select",
    ...t
  };
  return I((i) => {
    if (!r || P(i, "search") && !T(i, "search"))
      return { search: !1 };
    if (P(i, "search") && typeof T(i, "search") == "object")
      return {};
    const o = T(i, "valueType", "text") || "text", l = n[o] || "text";
    return {
      search: !0,
      // 在 fieldProps 中设置搜索相关属性（如果需要）
      fieldProps: {
        ...T(i, "fieldProps", {})
      },
      // 某些组件可能需要 searchType
      ...l !== "text" ? { searchType: l } : {}
    };
  });
}, M = (a = {}) => {
  const { enable: r = !0, defaultSorter: t = !1 } = a;
  return I((n) => {
    if (!r || P(n, "sorter") && T(n, "sorter") === !1)
      return { sorter: !1 };
    if (P(n, "sorter") && typeof T(n, "sorter") == "function")
      return {};
    const i = T(n, "dataIndex");
    if (!i)
      return {};
    const o = T(n, "valueType", "text") || "text";
    let l = !0;
    return ["digit", "money", "percent"].includes(o) ? l = (m, u) => {
      const g = m[i] || 0, f = u[i] || 0;
      return g - f;
    } : ["date", "dateTime", "time"].includes(o) ? l = (m, u) => {
      const g = new Date(m[i] || 0).getTime(), f = new Date(u[i] || 0).getTime();
      return g - f;
    } : o === "text" && (l = (m, u) => {
      const g = String(m[i] || ""), f = String(u[i] || "");
      return g.localeCompare(f);
    }), {
      sorter: l,
      ...t ? { defaultSortOrder: t } : {}
    };
  });
}, pe = (a = {}) => {
  const { enable: r = !0, messageTemplate: t } = a, n = (i) => `请输入${i}`;
  return I((i) => {
    if (!r)
      return {};
    const o = T(i, "formItemProps.rules", []) || [];
    if (o.some((y) => y.required))
      return {};
    if (!T(i, "dataIndex"))
      return {};
    const u = T(i, "title", "此字段") || "此字段", g = typeof t == "function" ? t(u) : t || n(u), f = T(i, "valueType", "text") || "text", c = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      f
    ) ? g.replace("输入", "选择") : g;
    return {
      formItemProps: {
        ...T(i, "formItemProps", {}),
        rules: [
          ...o,
          {
            required: !0,
            message: c
          }
        ]
      }
    };
  });
}, te = (a = {}) => {
  const { enable: r = !0, template: t, includeSearch: n = !0 } = a;
  return I((i) => {
    if (!r)
      return {};
    const o = T(i, "fieldProps", {});
    if (o.placeholder)
      return {};
    const l = T(i, "valueType", "text") || "text", u = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      l
    ) ? "select" : "input", g = t ? t(i, u) : He(i, u), f = {
      fieldProps: {
        ...o,
        placeholder: g
      }
    };
    if (n && P(i, "search")) {
      const p = T(i, "search");
      if (p === !0 || typeof p == "object" && p !== null) {
        const c = t ? t(i, "search") : He(i, "search");
        f.fieldProps.placeholder = c;
      }
    }
    return f;
  });
};
function he(a, r, t = !0) {
  if (a == null || isNaN(a)) return "-";
  const n = {
    minimumFractionDigits: r,
    maximumFractionDigits: r,
    useGrouping: t
  };
  return new Intl.NumberFormat("zh-CN", n).format(a);
}
function jt(a, r = 2, t = "¥", n = !0) {
  if (a == null || isNaN(a)) return "-";
  const i = he(a, r, n);
  return `${t}${i}`;
}
function Ot(a, r = 2) {
  return a == null || isNaN(a) ? "-" : `${he(a, r, !1)}%`;
}
function Dt(a, r = "YYYY-MM-DD") {
  if (!a) return "-";
  const t = new Date(a);
  if (isNaN(t.getTime())) return "-";
  const n = t.getFullYear(), i = String(t.getMonth() + 1).padStart(2, "0"), o = String(t.getDate()).padStart(2, "0"), l = String(t.getHours()).padStart(2, "0"), m = String(t.getMinutes()).padStart(2, "0"), u = String(t.getSeconds()).padStart(2, "0");
  return r.replace("YYYY", String(n)).replace("MM", i).replace("DD", o).replace("HH", l).replace("mm", m).replace("ss", u);
}
const K = (a = {}) => {
  const {
    enable: r = !0,
    type: t,
    precision: n,
    symbol: i = "¥",
    useGrouping: o = !0,
    dateFormat: l = "YYYY-MM-DD",
    formatter: m
  } = a;
  return I((u) => {
    if (!r)
      return {};
    if (P(u, "render") && !m)
      return {};
    const g = T(u, "valueType", "text") || "text";
    let f = t;
    if (f || (g === "money" ? f = "money" : g === "digit" ? f = "number" : ["date", "dateTime"].includes(g) ? f = "date" : g === "percent" && (f = "percent")), !f && !m)
      return {};
    let p;
    return m ? p = (c, y) => m(c, y) : f === "money" ? p = (c) => jt(c, n, i, o) : f === "number" ? p = (c) => he(c, n, o) : f === "percent" ? p = (c) => Ot(c, n) : f === "date" && (p = (c) => Dt(c, g === "dateTime" ? "YYYY-MM-DD HH:mm:ss" : l)), p ? {
      render: p
    } : {};
  });
}, er = (a = {}) => {
  const {
    enable: r = !0,
    content: t,
    formType: n = "tooltip",
    showInTable: i = !0,
    showInForm: o = !0
  } = a;
  return I((l) => {
    if (!r)
      return {};
    const m = typeof t == "function" ? t(l) : t;
    if (!m)
      return {};
    const u = {};
    if (i && (P(l, "tooltip") || (u.tooltip = m)), o) {
      const g = T(l, "formItemProps", {});
      n === "tooltip" ? g.tooltip || (u.formItemProps = {
        ...g,
        tooltip: m
      }) : g.extra || (u.formItemProps = {
        ...g,
        extra: m
      });
    }
    return u;
  });
};
function kt(a) {
  switch (T(a, "valueType", "text")) {
    case "digit":
    case "money":
    case "percent":
      return 0;
    case "switch":
      return !1;
    case "checkbox":
      return [];
    case "date":
    case "dateTime":
      return null;
    case "dateRange":
    case "dateTimeRange":
    case "timeRange":
      return [];
    case "select":
    case "radio":
      const t = T(a, "valueEnum");
      return t && typeof t == "object" && Object.keys(t)[0] || null;
    case "textarea":
    case "text":
    case "password":
    default:
      return "";
  }
}
const tr = (a = {}) => {
  const { enable: r = !0, value: t, autoInfer: n = !1 } = a;
  return I((i) => {
    if (!r)
      return {};
    if (P(i, "initialValue"))
      return {};
    let o;
    if (t !== void 0)
      o = typeof t == "function" ? t() : t;
    else if (n)
      o = kt(i);
    else
      return {};
    return {
      initialValue: o
    };
  });
};
function Mt(a) {
  const r = T(a, "valueType", "text") || "text";
  return {
    // 数字类型
    digit: 100,
    money: 120,
    percent: 100,
    // 日期时间类型
    date: 120,
    dateTime: 180,
    time: 100,
    dateRange: 260,
    dateTimeRange: 360,
    timeRange: 200,
    // 选择类型
    select: 120,
    radio: 120,
    checkbox: 120,
    // 布尔类型
    switch: 80,
    // 操作列
    option: 150,
    // 文本类型（无固定宽度）
    text: void 0,
    textarea: void 0,
    password: void 0
  }[r];
}
function Yt(a, r, t) {
  const n = T(a, "title", "");
  if (!n) return 0;
  let i = 0, o = 0;
  for (const m of n)
    /[\u4e00-\u9fa5]/.test(m) ? i++ : o++;
  const l = i * r + o * (r * 0.6) + t;
  return Math.ceil(l);
}
function re(a, r) {
  const { value: t, auto: n, min: i, max: o, charWidth: l = 14, padding: m = 48 } = r;
  let u;
  if (t !== void 0)
    u = t;
  else if (n) {
    const g = Mt(a);
    if (g)
      u = g;
    else {
      const f = Yt(a, l, m);
      f > 0 && (u = f);
    }
  }
  return u !== void 0 && (i !== void 0 && u < i && (u = i), o !== void 0 && u > o && (u = o)), u;
}
const V = (a = {}) => {
  const {
    enable: r = !0,
    value: t,
    auto: n = !1,
    min: i,
    max: o,
    charWidth: l = 14,
    padding: m = 48,
    table: u,
    form: g,
    description: f
  } = a;
  return I((p, c) => {
    if (!r)
      return {};
    if (P(p, "width"))
      return {};
    if (c === "table") {
      if (u === null)
        return {};
      let S;
      return typeof u == "number" ? S = u : u && typeof u == "object" ? S = re(p, {
        ...u,
        charWidth: l,
        padding: m
      }) : S = re(p, {
        value: t,
        auto: n,
        min: i,
        max: o,
        charWidth: l,
        padding: m
      }), S !== void 0 ? { width: S } : {};
    } else {
      if (c === "form")
        return g === null ? {} : g && ["sm", "md", "lg", "xl"].includes(g) ? { width: g } : {};
      if (c === "description") {
        if (f === null)
          return {};
        if (typeof f == "number")
          return { width: f };
        const S = re(p, {
          value: t,
          auto: n,
          min: i,
          max: o,
          charWidth: l,
          padding: m
        });
        return S !== void 0 ? { width: S } : {};
      }
    }
    const y = re(p, {
      value: t,
      auto: n,
      min: i,
      max: o,
      charWidth: l,
      padding: m
    });
    return y !== void 0 ? { width: y } : {};
  });
}, me = (a = {}) => {
  const { enable: r = !0, tooltipText: t = "复制", successText: n = "复制成功" } = a;
  return I((i, o) => r ? o === "form" ? {} : P(i, "copyable") ? {} : {
    copyable: {
      text: (l) => l ? String(l) : "",
      tooltips: [t, n]
    }
  } : {});
}, At = (a = {}) => {
  const { enable: r = !0, href: t, target: n = "_blank", onClick: i, text: o } = a;
  return I((l, m) => r ? m === "form" ? {} : P(l, "render") && !t && !i ? {} : {
    render: (g, f) => {
      const p = o ? typeof o == "function" ? o(g, f) : o : g || "-";
      if (i)
        return D.createElement(
          "a",
          {
            style: { cursor: "pointer" },
            onClick: (y) => {
              y.preventDefault(), i(g, f, y);
            }
          },
          p
        );
      const c = t ? typeof t == "function" ? t(g, f) : t : g;
      return c ? D.createElement(
        "a",
        {
          href: c,
          target: n,
          rel: n === "_blank" ? "noopener noreferrer" : void 0
        },
        p
      ) : p;
    }
  } : {});
}, Wt = (a = {}) => {
  const {
    enable: r = !0,
    width: t = 60,
    height: n = 60,
    preview: i = !0,
    fallback: o = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7lm77niYc8L3RleHQ+PC9zdmc+",
    separator: l = ",",
    maxCount: m = 5
  } = a;
  return I((u, g) => r ? g === "form" ? {} : P(u, "render") ? {} : {
    render: (p) => {
      if (!p)
        return "-";
      let c = [];
      typeof p == "string" ? c = p.split(l).filter((C) => C.trim()) : Array.isArray(p) ? c = p : c = [String(p)];
      const y = c.slice(0, m), S = c.length > m, $ = require("antd").Image, Y = require("antd").Space;
      return D.createElement(
        Y,
        { size: 8 },
        ...y.map(
          (C, _) => D.createElement($, {
            key: _,
            src: C,
            width: t,
            height: n,
            preview: i ? {
              src: C
            } : !1,
            fallback: o,
            style: { objectFit: "cover" }
          })
        ),
        S && D.createElement(
          "span",
          { style: { color: "#999", fontSize: "12px" } },
          `+${c.length - m}`
        )
      );
    }
  } : {});
}, Vt = (a = {}) => {
  const { enable: r = !0, type: t = "badge", colorMap: n = {}, defaultColor: i = "default" } = a;
  return I((o, l) => r ? l === "form" ? {} : !P(o, "valueEnum") && !P(o, "enumKey") ? {} : P(o, "render") ? {} : t === "text" ? {} : {
    render: (u) => {
      if (u == null)
        return "-";
      const f = (T(o, "valueEnum", {}) || {})[u];
      if (!f)
        return u;
      const p = f.text || f.label || u, c = f.status || n[u] || i;
      if (t === "badge") {
        const y = require("antd").Badge;
        return D.createElement(y, {
          status: c,
          text: p
        });
      }
      if (t === "tag") {
        const y = require("antd").Tag;
        return D.createElement(y, { color: c }, p);
      }
      return p;
    }
  } : {});
}, rr = (a = {}) => {
  const {
    enable: r = !0,
    pattern: t,
    patternMessage: n = "格式不正确",
    min: i,
    minMessage: o,
    max: l,
    maxMessage: m,
    minLength: u,
    minLengthMessage: g,
    maxLength: f,
    maxLengthMessage: p,
    validator: c,
    dependencies: y
  } = a;
  return I((S, $) => {
    if (!r)
      return {};
    if ($ !== "form")
      return {};
    const Y = T(
      S,
      "formItemProps.rules",
      T(S, "rules", [])
    ) || [], C = [];
    t && C.push({
      pattern: t,
      message: n
    }), i !== void 0 && C.push({
      type: "number",
      min: i,
      message: o || `最小值为 ${i}`
    }), l !== void 0 && C.push({
      type: "number",
      max: l,
      message: m || `最大值为 ${l}`
    }), u !== void 0 && C.push({
      min: u,
      message: g || `最少输入 ${u} 个字符`
    }), f !== void 0 && C.push({
      max: f,
      message: p || `最多输入 ${f} 个字符`
    }), c && C.push({
      validator: c
    });
    const _ = [...Y, ...C], N = {};
    return _.length > 0 && (N.formItemProps = {
      ...T(S, "formItemProps", {}),
      rules: _
    }), y && y.length > 0 && (N.formItemProps = {
      ...N.formItemProps,
      dependencies: y
    }), N;
  });
};
function $t(a) {
  const { roles: r, permissions: t, userRoles: n = [], userPermissions: i = [] } = a;
  return !!((!r || r.length === 0) && (!t || t.length === 0) || r && r.length > 0 && r.some((l) => n.includes(l)) || t && t.length > 0 && t.some((l) => i.includes(l)));
}
const nr = (a = {}) => {
  const {
    enable: r = !0,
    roles: t,
    permissions: n,
    userRoles: i,
    userPermissions: o,
    hideWhenNoPermission: l = !0,
    disableWhenNoPermission: m = !1,
    checker: u
  } = a;
  return I((g, f) => {
    if (!r)
      return {};
    if (u ? u({ roles: t, permissions: n, userRoles: i, userPermissions: o }) : $t({ roles: t, permissions: n, userRoles: i, userPermissions: o }))
      return {};
    const c = {};
    return l && (f === "table" ? c.hideInTable = !0 : f === "form" ? c.hideInForm = !0 : f === "description" && (c.hideInDescriptions = !0)), m && f === "form" && !l && (c.fieldProps = {
      disabled: !0
    }, c.editable = !1), c;
  });
}, ar = (a = {}) => {
  const { enable: r = !0, input: t, output: n, display: i } = a;
  return I((o, l) => {
    if (!r)
      return {};
    const m = {};
    if ((l === "table" || l === "description") && i && (P(o, "render") || (m.render = (u, g) => i(u, g) ?? u ?? "-")), l === "form") {
      const u = T(o, "fieldProps", {}), g = T(o, "convertValue"), f = T(o, "transform");
      t && (m.fieldProps = {
        ...u,
        // 保留原有的 getValueFromEvent，如果有的话
        ...u.getValueFromEvent ? {
          getValueFromEvent: (...p) => {
            const c = u.getValueFromEvent(...p);
            return t(c);
          }
        } : {
          getValueFromEvent: (p) => t(p)
        }
      }), n && (g || (m.convertValue = (p, c) => n(p, c)), f || (m.transform = (p) => n(p)));
    }
    return m;
  });
}, ir = (a = {}) => {
  const { enable: r = !0, type: t, editableConfig: n = {} } = a;
  return I((i, o) => {
    if (!r)
      return {};
    if (o !== "table")
      return {};
    if (P(i, "editable"))
      return {};
    const m = {
      type: t || T(i, "valueType", "text")
    };
    return n.onSave && (m.onSave = async (u, g, f, p) => {
      const c = T(i, "dataIndex"), y = c ? g[c] : void 0;
      return n.onSave(u, g, y);
    }), n.onCancel && (m.onCancel = (u, g) => {
      n.onCancel(u, g);
    }), n.formItemProps && (m.formItemProps = n.formItemProps), n.fieldProps && (m.fieldProps = n.fieldProps), {
      editable: () => m
    };
  });
}, Nt = (a, r) => {
  if (!a.strategys || a.strategys.length === 0 || r.mode === "replace")
    return r;
  {
    const t = [];
    return a.strategys.forEach((n) => {
      t.push(...n.strategy);
    }), t.push(...r.strategy), {
      mode: "merge",
      strategy: t
    };
  }
}, Lt = (a, r, t) => {
  let n = { ...a };
  return r.forEach((i) => {
    if (i.scene) {
      const o = Array.isArray(i.scene) ? i.scene : [i.scene];
      if (t && !o.includes(t))
        return;
    }
    i.strategy.forEach((o) => {
      const l = o(n, t);
      n = { ...n, ...l };
    });
  }), delete n.strategys, n;
}, Ht = (a, r) => a.map((n) => ({ ...n })).map((n) => n.strategys ? (n.strategys = n.strategys.map((i) => Nt(n, i)), Lt(n, n.strategys, r)) : n), Bt = (a) => {
  const {
    columns: r,
    enums: t = {},
    scene: n,
    applyStrategies: i,
    mergeMode: o = !0,
    columnStrategies: l
  } = a, g = r.map((p) => {
    const c = { ...p };
    if ("enumKey" in c && c.enumKey) {
      const y = c.enumKey;
      t[y] && (c.valueEnum = t[y]), delete c.enumKey;
    }
    return c;
  }).map((p) => {
    if (!i || i.length === 0)
      return p;
    const c = { ...p }, y = {
      mode: "merge",
      strategy: i
    };
    return o ? c.strategys = [...p.strategys || [], y] : c.strategys = [y], c;
  }).map((p) => {
    if (!l || l.length === 0)
      return p;
    const c = l.find(
      (Y) => Y.dataIndex === p.dataIndex
    );
    if (!c)
      return p;
    const y = { ...p }, S = {
      mode: "merge",
      strategy: c.strategies
    };
    return (c.mergeMode !== void 0 ? c.mergeMode : !0) ? y.strategys = [...y.strategys || [], S] : y.strategys = [S], y;
  });
  return Ht(g, n);
}, ne = /* @__PURE__ */ new Map(), Ut = {
  proTable: "table",
  proForm: "form",
  proDescription: "description"
}, U = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(a) {
    ne.set(a.name, a);
  },
  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(a) {
    return ne.get(a);
  },
  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   * @param options 配置选项
   */
  transform(a, r, t) {
    const n = this.getAdapter(a);
    if (!n)
      return console.warn(`Component adapter "${a}" not found, returning original columns`), r;
    const { enums: i, scene: o, applyStrategies: l, mergeMode: m = !0, columnStrategies: u } = t || {}, g = o || n.scene || Ut[a], f = Bt({
      columns: r,
      enums: i,
      scene: g,
      applyStrategies: l,
      mergeMode: m,
      columnStrategies: u
    });
    return n.transform(f);
  },
  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames() {
    return Array.from(ne.keys());
  },
  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    ne.clear();
  }
}, qt = {
  name: "proTable",
  scene: "table",
  transform: (a) => a.map((r) => {
    const t = { ...r };
    return "ellipsis" in t || (t.ellipsis = !0), "search" in t && t.search === !1 && (t.hideInSearch = !0, delete t.search), "hideInTable" in t && t.hideInTable && (t.hideInTable = !0), "defaultHidden" in t && t.defaultHidden && delete t.defaultHidden, t;
  })
}, Gt = {
  name: "proForm",
  scene: "form",
  transform: (a) => a.filter((r) => !r.hideInForm).map((r) => {
    const t = { ...r };
    if (delete t.hideInTable, delete t.ellipsis, delete t.copyable, delete t.sorter, delete t.search, delete t.hideInSearch, !t.name && t.dataIndex && (t.name = t.dataIndex), !t.width) {
      const n = t.valueType || "text";
      ["textarea"].includes(n) ? t.width = "xl" : ["dateRange", "dateTimeRange", "timeRange"].includes(n) ? t.width = "lg" : t.width = "md";
    }
    return t;
  })
}, Kt = {
  name: "proDescription",
  scene: "description",
  transform: (a) => a.filter((r) => !r.hideInDescriptions).map((r) => {
    const t = { ...r };
    if (delete t.hideInTable, delete t.sorter, delete t.filters, delete t.hideInForm, delete t.formItemProps, delete t.search, delete t.hideInSearch, delete t.fieldProps, !t.span) {
      const n = t.valueType || "text";
      ["textarea", "jsonCode", "code"].includes(n) ? t.span = 3 : t.span = 1;
    }
    return t;
  })
}, B = {};
class sr {
  /**
   * 注册自定义预设
   * @param name 预设名称
   * @param preset 预设函数
   */
  static register(r, t) {
    B[r] && console.warn(`[Pro-Columns] Preset "${r}" already exists and will be overwritten.`), B[r] = t;
  }
  /**
   * 获取预设
   * @param name 预设名称
   * @returns 预设函数
   */
  static get(r) {
    return B[r];
  }
  /**
   * 获取所有预设名称
   * @returns 预设名称列表
   */
  static list() {
    return Object.keys(B);
  }
  /**
   * 清空所有预设（主要用于测试）
   */
  static clear() {
    Object.keys(B).forEach((r) => {
      delete B[r];
    });
  }
  // ==================== 内置预设 ====================
  /**
   * 可搜索字段
   * 包含：搜索、排序、占位符
   */
  static searchableField() {
    return [de(), M(), te({ includeSearch: !0 })];
  }
  /**
   * 必填字段
   * 包含：必填、占位符
   */
  static requiredField() {
    return [pe(), te()];
  }
  /**
   * 金额字段
   * 包含：金额格式化、宽度配置、排序
   */
  static moneyField(r) {
    const { precision: t = 2 } = r || {};
    return [
      K({ type: "money", precision: t }),
      V({ table: 120, form: "lg" }),
      M(),
      me()
    ];
  }
  /**
   * 日期字段
   * 包含：日期格式化、排序、宽度配置
   */
  static dateField(r) {
    const { format: t = "YYYY-MM-DD" } = r || {};
    return [K({ type: "date", dateFormat: t }), M(), V({ table: 180, form: "md" })];
  }
  /**
   * 日期时间字段
   * 包含：日期时间格式化、排序、宽度配置
   */
  static dateTimeField() {
    return [
      K({ type: "date", dateFormat: "YYYY-MM-DD HH:mm:ss" }),
      M(),
      V({ table: 200, form: "lg" })
    ];
  }
  /**
   * 枚举字段
   * 包含：枚举渲染、搜索、必填、占位符
   */
  static enumField(r) {
    const { type: t = "badge" } = r || {};
    return [Vt({ type: t }), de(), pe(), te()];
  }
  /**
   * 只读字段
   * 包含：禁用表单输入
   */
  static readonlyField() {
    return [
      {
        fieldProps: { disabled: !0 },
        editable: !1
      }
    ];
  }
  /**
   * 图片字段
   * 包含：图片预览、宽度配置
   */
  static imageField(r) {
    const { width: t = 60, height: n = 60, maxCount: i = 5 } = r || {};
    return [Wt({ width: t, height: n, maxCount: i }), V({ table: 100, form: "lg" })];
  }
  /**
   * 链接字段
   * 包含：链接跳转、宽度配置、复制
   */
  static linkField(r) {
    const { target: t = "_blank" } = r || {};
    return [At({ target: t }), me(), V({ table: 200 })];
  }
  /**
   * 数字字段
   * 包含：数字格式化、排序、宽度配置
   */
  static numberField(r) {
    const { precision: t = 0 } = r || {};
    return [K({ type: "number", precision: t }), M(), V({ table: 100, form: "md" })];
  }
  /**
   * 百分比字段
   * 包含：百分比格式化、排序、宽度配置
   */
  static percentField(r) {
    const { precision: t = 2 } = r || {};
    return [K({ type: "percent", precision: t }), M(), V({ table: 100, form: "md" })];
  }
  /**
   * 可编辑字段（表格内编辑）
   * 包含：可编辑配置、排序
   */
  static editableField(r) {
    const { type: t = "text", onSave: n } = r || {};
    return [
      {
        editable: () => ({
          type: t,
          onSave: n
        })
      },
      M()
    ];
  }
  /**
   * 完整 CRUD 字段
   * 包含：搜索、排序、必填、占位符、复制
   * 适用于常规文本字段
   */
  static fullField() {
    return [de(), M(), pe(), te({ includeSearch: !0 }), me()];
  }
}
var ge = { exports: {} }, J = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Be;
function Jt() {
  if (Be) return J;
  Be = 1;
  var a = D, r = Symbol.for("react.element"), t = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, i = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function l(m, u, g) {
    var f, p = {}, c = null, y = null;
    g !== void 0 && (c = "" + g), u.key !== void 0 && (c = "" + u.key), u.ref !== void 0 && (y = u.ref);
    for (f in u) n.call(u, f) && !o.hasOwnProperty(f) && (p[f] = u[f]);
    if (m && m.defaultProps) for (f in u = m.defaultProps, u) p[f] === void 0 && (p[f] = u[f]);
    return { $$typeof: r, type: m, key: c, ref: y, props: p, _owner: i.current };
  }
  return J.Fragment = t, J.jsx = l, J.jsxs = l, J;
}
var z = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ue;
function zt() {
  return Ue || (Ue = 1, process.env.NODE_ENV !== "production" && function() {
    var a = D, r = Symbol.for("react.element"), t = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), m = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), f = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), c = Symbol.for("react.lazy"), y = Symbol.for("react.offscreen"), S = Symbol.iterator, $ = "@@iterator";
    function Y(e) {
      if (e === null || typeof e != "object")
        return null;
      var s = S && e[S] || e[$];
      return typeof s == "function" ? s : null;
    }
    var C = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function _(e) {
      {
        for (var s = arguments.length, d = new Array(s > 1 ? s - 1 : 0), h = 1; h < s; h++)
          d[h - 1] = arguments[h];
        N("error", e, d);
      }
    }
    function N(e, s, d) {
      {
        var h = C.ReactDebugCurrentFrame, R = h.getStackAddendum();
        R !== "" && (s += "%s", d = d.concat([R]));
        var x = d.map(function(b) {
          return String(b);
        });
        x.unshift("Warning: " + s), Function.prototype.apply.call(console[e], console, x);
      }
    }
    var Ge = !1, Ke = !1, Je = !1, ze = !1, Qe = !1, ve;
    ve = Symbol.for("react.module.reference");
    function Ze(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === n || e === o || Qe || e === i || e === g || e === f || ze || e === y || Ge || Ke || Je || typeof e == "object" && e !== null && (e.$$typeof === c || e.$$typeof === p || e.$$typeof === l || e.$$typeof === m || e.$$typeof === u || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ve || e.getModuleId !== void 0));
    }
    function Xe(e, s, d) {
      var h = e.displayName;
      if (h)
        return h;
      var R = s.displayName || s.name || "";
      return R !== "" ? d + "(" + R + ")" : d;
    }
    function be(e) {
      return e.displayName || "Context";
    }
    function k(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && _("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case n:
          return "Fragment";
        case t:
          return "Portal";
        case o:
          return "Profiler";
        case i:
          return "StrictMode";
        case g:
          return "Suspense";
        case f:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case m:
            var s = e;
            return be(s) + ".Consumer";
          case l:
            var d = e;
            return be(d._context) + ".Provider";
          case u:
            return Xe(e, e.render, "ForwardRef");
          case p:
            var h = e.displayName || null;
            return h !== null ? h : k(e.type) || "Memo";
          case c: {
            var R = e, x = R._payload, b = R._init;
            try {
              return k(b(x));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var A = Object.assign, q = 0, Te, Re, xe, Ee, Pe, Se, _e;
    function we() {
    }
    we.__reactDisabledLog = !0;
    function et() {
      {
        if (q === 0) {
          Te = console.log, Re = console.info, xe = console.warn, Ee = console.error, Pe = console.group, Se = console.groupCollapsed, _e = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: we,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        q++;
      }
    }
    function tt() {
      {
        if (q--, q === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: A({}, e, {
              value: Te
            }),
            info: A({}, e, {
              value: Re
            }),
            warn: A({}, e, {
              value: xe
            }),
            error: A({}, e, {
              value: Ee
            }),
            group: A({}, e, {
              value: Pe
            }),
            groupCollapsed: A({}, e, {
              value: Se
            }),
            groupEnd: A({}, e, {
              value: _e
            })
          });
        }
        q < 0 && _("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var ae = C.ReactCurrentDispatcher, ie;
    function Q(e, s, d) {
      {
        if (ie === void 0)
          try {
            throw Error();
          } catch (R) {
            var h = R.stack.trim().match(/\n( *(at )?)/);
            ie = h && h[1] || "";
          }
        return `
` + ie + e;
      }
    }
    var se = !1, Z;
    {
      var rt = typeof WeakMap == "function" ? WeakMap : Map;
      Z = new rt();
    }
    function Ce(e, s) {
      if (!e || se)
        return "";
      {
        var d = Z.get(e);
        if (d !== void 0)
          return d;
      }
      var h;
      se = !0;
      var R = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var x;
      x = ae.current, ae.current = null, et();
      try {
        if (s) {
          var b = function() {
            throw Error();
          };
          if (Object.defineProperty(b.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(b, []);
            } catch (j) {
              h = j;
            }
            Reflect.construct(e, [], b);
          } else {
            try {
              b.call();
            } catch (j) {
              h = j;
            }
            e.call(b.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (j) {
            h = j;
          }
          e();
        }
      } catch (j) {
        if (j && h && typeof j.stack == "string") {
          for (var v = j.stack.split(`
`), F = h.stack.split(`
`), E = v.length - 1, w = F.length - 1; E >= 1 && w >= 0 && v[E] !== F[w]; )
            w--;
          for (; E >= 1 && w >= 0; E--, w--)
            if (v[E] !== F[w]) {
              if (E !== 1 || w !== 1)
                do
                  if (E--, w--, w < 0 || v[E] !== F[w]) {
                    var O = `
` + v[E].replace(" at new ", " at ");
                    return e.displayName && O.includes("<anonymous>") && (O = O.replace("<anonymous>", e.displayName)), typeof e == "function" && Z.set(e, O), O;
                  }
                while (E >= 1 && w >= 0);
              break;
            }
        }
      } finally {
        se = !1, ae.current = x, tt(), Error.prepareStackTrace = R;
      }
      var H = e ? e.displayName || e.name : "", W = H ? Q(H) : "";
      return typeof e == "function" && Z.set(e, W), W;
    }
    function nt(e, s, d) {
      return Ce(e, !1);
    }
    function at(e) {
      var s = e.prototype;
      return !!(s && s.isReactComponent);
    }
    function X(e, s, d) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Ce(e, at(e));
      if (typeof e == "string")
        return Q(e);
      switch (e) {
        case g:
          return Q("Suspense");
        case f:
          return Q("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case u:
            return nt(e.render);
          case p:
            return X(e.type, s, d);
          case c: {
            var h = e, R = h._payload, x = h._init;
            try {
              return X(x(R), s, d);
            } catch {
            }
          }
        }
      return "";
    }
    var G = Object.prototype.hasOwnProperty, Ie = {}, Fe = C.ReactDebugCurrentFrame;
    function ee(e) {
      if (e) {
        var s = e._owner, d = X(e.type, e._source, s ? s.type : null);
        Fe.setExtraStackFrame(d);
      } else
        Fe.setExtraStackFrame(null);
    }
    function it(e, s, d, h, R) {
      {
        var x = Function.call.bind(G);
        for (var b in e)
          if (x(e, b)) {
            var v = void 0;
            try {
              if (typeof e[b] != "function") {
                var F = Error((h || "React class") + ": " + d + " type `" + b + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[b] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw F.name = "Invariant Violation", F;
              }
              v = e[b](s, b, h, d, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (E) {
              v = E;
            }
            v && !(v instanceof Error) && (ee(R), _("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", h || "React class", d, b, typeof v), ee(null)), v instanceof Error && !(v.message in Ie) && (Ie[v.message] = !0, ee(R), _("Failed %s type: %s", d, v.message), ee(null));
          }
      }
    }
    var st = Array.isArray;
    function oe(e) {
      return st(e);
    }
    function ot(e) {
      {
        var s = typeof Symbol == "function" && Symbol.toStringTag, d = s && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return d;
      }
    }
    function ut(e) {
      try {
        return je(e), !1;
      } catch {
        return !0;
      }
    }
    function je(e) {
      return "" + e;
    }
    function Oe(e) {
      if (ut(e))
        return _("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", ot(e)), je(e);
    }
    var De = C.ReactCurrentOwner, lt = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, ke, Me;
    function ct(e) {
      if (G.call(e, "ref")) {
        var s = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function ft(e) {
      if (G.call(e, "key")) {
        var s = Object.getOwnPropertyDescriptor(e, "key").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function dt(e, s) {
      typeof e.ref == "string" && De.current;
    }
    function pt(e, s) {
      {
        var d = function() {
          ke || (ke = !0, _("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        d.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: d,
          configurable: !0
        });
      }
    }
    function mt(e, s) {
      {
        var d = function() {
          Me || (Me = !0, _("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        d.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: d,
          configurable: !0
        });
      }
    }
    var gt = function(e, s, d, h, R, x, b) {
      var v = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: r,
        // Built-in properties that belong on the element
        type: e,
        key: s,
        ref: d,
        props: b,
        // Record the component responsible for creating this element.
        _owner: x
      };
      return v._store = {}, Object.defineProperty(v._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(v, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: h
      }), Object.defineProperty(v, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: R
      }), Object.freeze && (Object.freeze(v.props), Object.freeze(v)), v;
    };
    function ht(e, s, d, h, R) {
      {
        var x, b = {}, v = null, F = null;
        d !== void 0 && (Oe(d), v = "" + d), ft(s) && (Oe(s.key), v = "" + s.key), ct(s) && (F = s.ref, dt(s, R));
        for (x in s)
          G.call(s, x) && !lt.hasOwnProperty(x) && (b[x] = s[x]);
        if (e && e.defaultProps) {
          var E = e.defaultProps;
          for (x in E)
            b[x] === void 0 && (b[x] = E[x]);
        }
        if (v || F) {
          var w = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          v && pt(b, w), F && mt(b, w);
        }
        return gt(e, v, F, R, h, De.current, b);
      }
    }
    var ue = C.ReactCurrentOwner, Ye = C.ReactDebugCurrentFrame;
    function L(e) {
      if (e) {
        var s = e._owner, d = X(e.type, e._source, s ? s.type : null);
        Ye.setExtraStackFrame(d);
      } else
        Ye.setExtraStackFrame(null);
    }
    var le;
    le = !1;
    function ce(e) {
      return typeof e == "object" && e !== null && e.$$typeof === r;
    }
    function Ae() {
      {
        if (ue.current) {
          var e = k(ue.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function yt(e) {
      return "";
    }
    var We = {};
    function vt(e) {
      {
        var s = Ae();
        if (!s) {
          var d = typeof e == "string" ? e : e.displayName || e.name;
          d && (s = `

Check the top-level render call using <` + d + ">.");
        }
        return s;
      }
    }
    function Ve(e, s) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var d = vt(s);
        if (We[d])
          return;
        We[d] = !0;
        var h = "";
        e && e._owner && e._owner !== ue.current && (h = " It was passed a child from " + k(e._owner.type) + "."), L(e), _('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', d, h), L(null);
      }
    }
    function $e(e, s) {
      {
        if (typeof e != "object")
          return;
        if (oe(e))
          for (var d = 0; d < e.length; d++) {
            var h = e[d];
            ce(h) && Ve(h, s);
          }
        else if (ce(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var R = Y(e);
          if (typeof R == "function" && R !== e.entries)
            for (var x = R.call(e), b; !(b = x.next()).done; )
              ce(b.value) && Ve(b.value, s);
        }
      }
    }
    function bt(e) {
      {
        var s = e.type;
        if (s == null || typeof s == "string")
          return;
        var d;
        if (typeof s == "function")
          d = s.propTypes;
        else if (typeof s == "object" && (s.$$typeof === u || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        s.$$typeof === p))
          d = s.propTypes;
        else
          return;
        if (d) {
          var h = k(s);
          it(d, e.props, "prop", h, e);
        } else if (s.PropTypes !== void 0 && !le) {
          le = !0;
          var R = k(s);
          _("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", R || "Unknown");
        }
        typeof s.getDefaultProps == "function" && !s.getDefaultProps.isReactClassApproved && _("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Tt(e) {
      {
        for (var s = Object.keys(e.props), d = 0; d < s.length; d++) {
          var h = s[d];
          if (h !== "children" && h !== "key") {
            L(e), _("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", h), L(null);
            break;
          }
        }
        e.ref !== null && (L(e), _("Invalid attribute `ref` supplied to `React.Fragment`."), L(null));
      }
    }
    var Ne = {};
    function Le(e, s, d, h, R, x) {
      {
        var b = Ze(e);
        if (!b) {
          var v = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (v += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var F = yt();
          F ? v += F : v += Ae();
          var E;
          e === null ? E = "null" : oe(e) ? E = "array" : e !== void 0 && e.$$typeof === r ? (E = "<" + (k(e.type) || "Unknown") + " />", v = " Did you accidentally export a JSX literal instead of a component?") : E = typeof e, _("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", E, v);
        }
        var w = ht(e, s, d, R, x);
        if (w == null)
          return w;
        if (b) {
          var O = s.children;
          if (O !== void 0)
            if (h)
              if (oe(O)) {
                for (var H = 0; H < O.length; H++)
                  $e(O[H], e);
                Object.freeze && Object.freeze(O);
              } else
                _("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              $e(O, e);
        }
        if (G.call(s, "key")) {
          var W = k(e), j = Object.keys(s).filter(function(_t) {
            return _t !== "key";
          }), fe = j.length > 0 ? "{key: someKey, " + j.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ne[W + fe]) {
            var St = j.length > 0 ? "{" + j.join(": ..., ") + ": ...}" : "{}";
            _(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, fe, W, St, W), Ne[W + fe] = !0;
          }
        }
        return e === n ? Tt(w) : bt(w), w;
      }
    }
    function Rt(e, s, d) {
      return Le(e, s, d, !0);
    }
    function xt(e, s, d) {
      return Le(e, s, d, !1);
    }
    var Et = xt, Pt = Rt;
    z.Fragment = n, z.jsx = Et, z.jsxs = Pt;
  }()), z;
}
process.env.NODE_ENV === "production" ? ge.exports = Jt() : ge.exports = zt();
var ye = ge.exports;
function or(a) {
  const {
    columns: r,
    enums: t,
    applyStrategies: n,
    mergeMode: i,
    columnStrategies: o,
    ...l
  } = a;
  return /* @__PURE__ */ ye.jsx(
    wt,
    {
      columns: U.transform("proTable", r, {
        enums: t,
        applyStrategies: n,
        mergeMode: i,
        columnStrategies: o
      }),
      ...l
    }
  );
}
function ur(a) {
  const {
    columns: r,
    enums: t,
    applyStrategies: n,
    mergeMode: i,
    columnStrategies: o,
    ...l
  } = a;
  return /* @__PURE__ */ ye.jsx(
    Ct,
    {
      columns: U.transform("proForm", r, {
        enums: t,
        applyStrategies: n,
        mergeMode: i,
        columnStrategies: o
      }),
      ...l
    }
  );
}
function lr(a) {
  const {
    columns: r,
    enums: t,
    applyStrategies: n,
    mergeMode: i,
    columnStrategies: o,
    ...l
  } = a;
  return /* @__PURE__ */ ye.jsx(
    It,
    {
      columns: U.transform("proDescription", r, {
        enums: t,
        applyStrategies: n,
        mergeMode: i,
        columnStrategies: o
      }),
      ...l
    }
  );
}
U.register(qt);
U.register(Gt);
U.register(Kt);
export {
  Bt as Columns,
  U as Component,
  me as Copy,
  tr as DefaultValue,
  ir as Editable,
  Vt as Enum,
  K as Format,
  Wt as Image,
  At as Link,
  nr as Permission,
  te as Placeholder,
  sr as Presets,
  lr as ProColumnsDescription,
  ur as ProColumnsForm,
  or as ProColumnsTable,
  pe as Required,
  de as Search,
  M as Sort,
  er as Tooltip,
  ar as Transform,
  rr as Validation,
  V as Width,
  I as createStrategy,
  qe as deepMerge,
  He as generatePlaceholder,
  T as getField,
  Ft as getFieldType,
  P as hasField,
  Xt as setField
};
//# sourceMappingURL=pro-columns.mjs.map
