import M from "react";
import { Space as kr, Image as Dr, Badge as Or, Tag as Mr } from "antd";
import { ProTable as Ar, BetaSchemaForm as Yr, ProDescriptions as $r } from "@ant-design/pro-components";
function Qe(a, t) {
  const r = { ...a };
  return Object.keys(t).forEach((n) => {
    const i = t[n], o = r[n];
    i && typeof i == "object" && !Array.isArray(i) && o && typeof o == "object" && !Array.isArray(o) ? r[n] = Qe(o, i) : r[n] = i;
  }), r;
}
function S(a, t) {
  return t in a && a[t] !== void 0;
}
function x(a, t, r) {
  return S(a, t) ? a[t] : r;
}
function ut(a, t, r) {
  return {
    ...a,
    [t]: r
  };
}
function Wr(a) {
  if (S(a, "valueType"))
    return x(a, "valueType", "text") || "text";
  if (S(a, "valueEnum")) return "select";
  if (S(a, "fieldProps")) {
    const t = x(a, "fieldProps");
    if ((t == null ? void 0 : t.mode) === "multiple") return "select";
    if ((t == null ? void 0 : t.type) === "password") return "password";
  }
  return "text";
}
function Ge(a, t = "input") {
  const r = x(a, "title", "字段"), n = Wr(a), i = {
    search: "搜索",
    input: "请输入",
    select: "请选择"
  };
  let o = t;
  return ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(n) && (o = "select"), `${i[o]}${r}`;
}
function P(a) {
  return (t, r) => {
    const n = a(t, r);
    return Qe(t, n);
  };
}
const te = (a = {}) => {
  const { enable: t = !0, searchTypeMap: r = {} } = a, n = {
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
    ...r
  };
  return P((i) => {
    if (!t || S(i, "search") && !x(i, "search"))
      return { search: !1 };
    if (S(i, "search") && typeof x(i, "search") == "object")
      return {};
    const o = x(i, "valueType", "text") || "text", l = n[o] || "text";
    return {
      search: !0,
      // 在 fieldProps 中设置搜索相关属性（如果需要）
      fieldProps: {
        ...x(i, "fieldProps", {})
      },
      // 某些组件可能需要 searchType
      ...l !== "text" ? { searchType: l } : {}
    };
  });
}, D = (a = {}) => {
  const { enable: t = !0, defaultSorter: r = !1 } = a;
  return P((n) => {
    if (!t || S(n, "sorter") && x(n, "sorter") === !1)
      return { sorter: !1 };
    if (S(n, "sorter") && typeof x(n, "sorter") == "function")
      return {};
    const i = x(n, "dataIndex");
    if (!i)
      return {};
    const o = x(n, "valueType", "text") || "text";
    let l = !0;
    return ["digit", "money", "percent"].includes(o) ? l = (f, u) => {
      const d = f[i] || 0, c = u[i] || 0;
      return d - c;
    } : ["date", "dateTime", "time"].includes(o) ? l = (f, u) => {
      const d = new Date(f[i] || 0).getTime(), c = new Date(u[i] || 0).getTime();
      return d - c;
    } : o === "text" && (l = (f, u) => {
      const d = String(f[i] || ""), c = String(u[i] || "");
      return d.localeCompare(c);
    }), {
      sorter: l,
      ...r ? { defaultSortOrder: r } : {}
    };
  });
}, he = (a = {}) => {
  const { enable: t = !0, messageTemplate: r } = a, n = (i) => `请输入${i}`;
  return P((i) => {
    if (!t)
      return {};
    const o = x(i, "formItemProps.rules", []) || [];
    if (o.some((v) => v.required))
      return {};
    if (!x(i, "dataIndex"))
      return {};
    const u = x(i, "title", "此字段") || "此字段", d = typeof r == "function" ? r(u) : r || n(u), c = x(i, "valueType", "text") || "text", m = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      c
    ) ? d.replace("输入", "选择") : d;
    return {
      formItemProps: {
        ...x(i, "formItemProps", {}),
        rules: [
          ...o,
          {
            required: !0,
            message: m
          }
        ]
      }
    };
  });
}, ne = (a = {}) => {
  const { enable: t = !0, template: r, includeSearch: n = !0 } = a;
  return P((i) => {
    if (!t)
      return {};
    const o = x(i, "fieldProps", {});
    if (o.placeholder)
      return {};
    const l = x(i, "valueType", "text") || "text", u = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      l
    ) ? "select" : "input", d = r ? r(i, u) : Ge(i, u), c = {
      fieldProps: {
        ...o,
        placeholder: d
      }
    };
    if (n && S(i, "search")) {
      const p = x(i, "search");
      if (p === !0 || typeof p == "object" && p !== null) {
        const m = r ? r(i, "search") : Ge(i, "search");
        c.fieldProps.placeholder = m;
      }
    }
    return c;
  });
};
function be(a, t, r = !0) {
  if (a == null || isNaN(a)) return "-";
  const n = {
    minimumFractionDigits: t,
    maximumFractionDigits: t,
    useGrouping: r
  };
  return new Intl.NumberFormat("zh-CN", n).format(a);
}
function Vr(a, t = 2, r = "¥", n = !0) {
  if (a == null || isNaN(a)) return "-";
  const i = be(a, t, n);
  return `${r}${i}`;
}
function Nr(a, t = 2) {
  return a == null || isNaN(a) ? "-" : `${be(a, t, !1)}%`;
}
function Lr(a, t = "YYYY-MM-DD") {
  if (!a) return "-";
  const r = new Date(a);
  if (isNaN(r.getTime())) return "-";
  const n = r.getFullYear(), i = String(r.getMonth() + 1).padStart(2, "0"), o = String(r.getDate()).padStart(2, "0"), l = String(r.getHours()).padStart(2, "0"), f = String(r.getMinutes()).padStart(2, "0"), u = String(r.getSeconds()).padStart(2, "0");
  return t.replace("YYYY", String(n)).replace("MM", i).replace("DD", o).replace("HH", l).replace("mm", f).replace("ss", u);
}
const J = (a = {}) => {
  const {
    enable: t = !0,
    type: r,
    precision: n,
    symbol: i = "¥",
    useGrouping: o = !0,
    dateFormat: l = "YYYY-MM-DD",
    formatter: f
  } = a;
  return P((u) => {
    if (!t)
      return {};
    if (S(u, "render") && !f)
      return {};
    const d = x(u, "valueType", "text") || "text";
    let c = r;
    if (c || (d === "money" ? c = "money" : d === "digit" ? c = "number" : ["date", "dateTime"].includes(d) ? c = "date" : d === "percent" && (c = "percent")), !c && !f)
      return {};
    let p;
    return f ? p = (m, v) => f(m, v) : c === "money" ? p = (m) => Vr(m, n, i, o) : c === "number" ? p = (m) => be(m, n, o) : c === "percent" ? p = (m) => Nr(m, n) : c === "date" && (p = (m) => Lr(m, d === "dateTime" ? "YYYY-MM-DD HH:mm:ss" : l)), p ? {
      render: p
    } : {};
  });
}, lt = (a = {}) => {
  const {
    enable: t = !0,
    content: r,
    formType: n = "tooltip",
    showInTable: i = !0,
    showInForm: o = !0
  } = a;
  return P((l) => {
    if (!t)
      return {};
    const f = typeof r == "function" ? r(l) : r;
    if (!f)
      return {};
    const u = {};
    if (i && (S(l, "tooltip") || (u.tooltip = f)), o) {
      const d = x(l, "formItemProps", {});
      n === "tooltip" ? d.tooltip || (u.formItemProps = {
        ...d,
        tooltip: f
      }) : d.extra || (u.formItemProps = {
        ...d,
        extra: f
      });
    }
    return u;
  });
};
function Hr(a) {
  switch (x(a, "valueType", "text")) {
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
      const r = x(a, "valueEnum");
      return r && typeof r == "object" && Object.keys(r)[0] || null;
    case "textarea":
    case "text":
    case "password":
    default:
      return "";
  }
}
const ct = (a = {}) => {
  const { enable: t = !0, value: r, autoInfer: n = !1 } = a;
  return P((i) => {
    if (!t)
      return {};
    if (S(i, "initialValue"))
      return {};
    let o;
    if (r !== void 0)
      o = typeof r == "function" ? r() : r;
    else if (n)
      o = Hr(i);
    else
      return {};
    return {
      initialValue: o
    };
  });
};
function Ur(a) {
  const t = x(a, "valueType", "text") || "text";
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
  }[t];
}
function Br(a, t, r) {
  const n = x(a, "title", "");
  if (!n) return 0;
  let i = 0, o = 0;
  for (const f of n)
    /[\u4e00-\u9fa5]/.test(f) ? i++ : o++;
  const l = i * t + o * (t * 0.6) + r;
  return Math.ceil(l);
}
function ae(a, t) {
  const { value: r, auto: n, min: i, max: o, charWidth: l = 14, padding: f = 48 } = t;
  let u;
  if (r !== void 0)
    u = r;
  else if (n) {
    const d = Ur(a);
    if (d)
      u = d;
    else {
      const c = Br(a, l, f);
      c > 0 && (u = c);
    }
  }
  return u !== void 0 && (i !== void 0 && u < i && (u = i), o !== void 0 && u > o && (u = o)), u;
}
const Y = (a = {}) => {
  const {
    enable: t = !0,
    value: r,
    auto: n = !1,
    min: i,
    max: o,
    charWidth: l = 14,
    padding: f = 48,
    table: u,
    form: d,
    description: c
  } = a;
  return P((p, m) => {
    if (!t)
      return {};
    if (S(p, "width"))
      return {};
    if (m === "table") {
      if (u === null)
        return {};
      let w;
      return typeof u == "number" ? w = u : u && typeof u == "object" ? w = ae(p, {
        ...u,
        charWidth: l,
        padding: f
      }) : w = ae(p, {
        value: r,
        auto: n,
        min: i,
        max: o,
        charWidth: l,
        padding: f
      }), w !== void 0 ? { width: w } : {};
    } else {
      if (m === "form")
        return d === null ? {} : d && ["sm", "md", "lg", "xl"].includes(d) ? { width: d } : {};
      if (m === "description") {
        if (c === null)
          return {};
        if (typeof c == "number")
          return { width: c };
        const w = ae(p, {
          value: r,
          auto: n,
          min: i,
          max: o,
          charWidth: l,
          padding: f
        });
        return w !== void 0 ? { width: w } : {};
      }
    }
    const v = ae(p, {
      value: r,
      auto: n,
      min: i,
      max: o,
      charWidth: l,
      padding: f
    });
    return v !== void 0 ? { width: v } : {};
  });
}, ie = (a = {}) => {
  const { enable: t = !0, tooltipText: r = "复制", successText: n = "复制成功" } = a;
  return P((i, o) => t ? o === "form" ? {} : S(i, "copyable") ? {} : {
    copyable: {
      text: (l) => l ? String(l) : "",
      tooltips: [r, n]
    }
  } : {});
}, Gr = (a = {}) => {
  const { enable: t = !0, href: r, target: n = "_blank", onClick: i, text: o } = a;
  return P((l, f) => t ? f === "form" ? {} : S(l, "render") && !r && !i ? {} : {
    render: (d, c) => {
      const p = o ? typeof o == "function" ? o(d, c) : o : d || "-";
      if (i)
        return M.createElement(
          "a",
          {
            style: { cursor: "pointer" },
            onClick: (v) => {
              v.preventDefault(), i(d, c, v);
            }
          },
          p
        );
      const m = r ? typeof r == "function" ? r(d, c) : r : d;
      return m ? M.createElement(
        "a",
        {
          href: m,
          target: n,
          rel: n === "_blank" ? "noopener noreferrer" : void 0
        },
        p
      ) : p;
    }
  } : {});
}, Kr = (a = {}) => {
  const {
    enable: t = !0,
    width: r = 60,
    height: n = 60,
    preview: i = !0,
    fallback: o = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7lm77niYc8L3RleHQ+PC9zdmc+",
    separator: l = ",",
    maxCount: f = 5
  } = a;
  return P((u, d) => t ? d === "form" ? {} : S(u, "render") ? {} : {
    render: (p) => {
      if (!p)
        return "-";
      let m = [];
      typeof p == "string" ? m = p.split(l).filter((O) => O.trim()) : Array.isArray(p) ? m = p : m = [String(p)];
      const v = m.slice(0, f), w = m.length > f;
      return M.createElement(
        kr,
        { size: 8 },
        ...v.map(
          (O, G) => M.createElement(Dr, {
            key: G,
            src: O,
            width: r,
            height: n,
            preview: i ? {
              src: O
            } : !1,
            fallback: o,
            style: { objectFit: "cover" }
          })
        ),
        w && M.createElement(
          "span",
          { style: { color: "#999", fontSize: "12px" } },
          `+${m.length - f}`
        )
      );
    }
  } : {});
}, Ke = (a = {}) => {
  const { enable: t = !0, type: r = "badge", colorMap: n = {}, defaultColor: i = "default" } = a;
  return P((o, l) => t ? l === "form" ? {} : !S(o, "valueEnum") && !S(o, "enumKey") ? {} : S(o, "render") ? {} : r === "text" ? {} : {
    render: (u) => {
      if (u == null)
        return "-";
      const c = (x(o, "valueEnum", {}) || {})[u];
      if (!c)
        return u;
      const p = c.text || c.label || u, m = c.status || n[u] || i;
      return r === "badge" ? M.createElement(Or, {
        status: m,
        text: p
      }) : r === "tag" ? M.createElement(Mr, { color: m }, p) : p;
    }
  } : {});
}, ft = (a = {}) => {
  const {
    enable: t = !0,
    pattern: r,
    patternMessage: n = "格式不正确",
    min: i,
    minMessage: o,
    max: l,
    maxMessage: f,
    minLength: u,
    minLengthMessage: d,
    maxLength: c,
    maxLengthMessage: p,
    validator: m,
    dependencies: v
  } = a;
  return P((w, O) => {
    if (!t)
      return {};
    if (O !== "form")
      return {};
    const G = x(
      w,
      "formItemProps.rules",
      x(w, "rules", [])
    ) || [], F = [];
    r && F.push({
      pattern: r,
      message: n
    }), i !== void 0 && F.push({
      type: "number",
      min: i,
      message: o || `最小值为 ${i}`
    }), l !== void 0 && F.push({
      type: "number",
      max: l,
      message: f || `最大值为 ${l}`
    }), u !== void 0 && F.push({
      min: u,
      message: d || `最少输入 ${u} 个字符`
    }), c !== void 0 && F.push({
      max: c,
      message: p || `最多输入 ${c} 个字符`
    }), m && F.push({
      validator: m
    });
    const C = [...G, ...F], N = {};
    return C.length > 0 && (N.formItemProps = {
      ...x(w, "formItemProps", {}),
      rules: C
    }), v && v.length > 0 && (N.formItemProps = {
      ...N.formItemProps,
      dependencies: v
    }), N;
  });
};
function qr(a) {
  const { roles: t, permissions: r, userRoles: n = [], userPermissions: i = [] } = a;
  return !!((!t || t.length === 0) && (!r || r.length === 0) || t && t.length > 0 && t.some((l) => n.includes(l)) || r && r.length > 0 && r.some((l) => i.includes(l)));
}
const dt = (a = {}) => {
  const {
    enable: t = !0,
    roles: r,
    permissions: n,
    userRoles: i,
    userPermissions: o,
    hideWhenNoPermission: l = !0,
    disableWhenNoPermission: f = !1,
    checker: u
  } = a;
  return P((d, c) => {
    if (!t)
      return {};
    if (u ? u({ roles: r, permissions: n, userRoles: i, userPermissions: o }) : qr({ roles: r, permissions: n, userRoles: i, userPermissions: o }))
      return {};
    const m = {};
    return l && (c === "table" ? m.hideInTable = !0 : c === "form" ? m.hideInForm = !0 : c === "description" && (m.hideInDescriptions = !0)), f && c === "form" && !l && (m.fieldProps = {
      disabled: !0
    }, m.editable = !1), m;
  });
}, pt = (a = {}) => {
  const { enable: t = !0, input: r, output: n, display: i } = a;
  return P((o, l) => {
    if (!t)
      return {};
    const f = {};
    if ((l === "table" || l === "description") && i && (S(o, "render") || (f.render = (u, d) => i(u, d) ?? u ?? "-")), l === "form") {
      const u = x(o, "fieldProps", {}), d = x(o, "convertValue"), c = x(o, "transform");
      r && (f.fieldProps = {
        ...u,
        // 保留原有的 getValueFromEvent，如果有的话
        ...u.getValueFromEvent ? {
          getValueFromEvent: (...p) => {
            const m = u.getValueFromEvent(...p);
            return r(m);
          }
        } : {
          getValueFromEvent: (p) => r(p)
        }
      }), n && (d || (f.convertValue = (p, m) => n(p, m)), c || (f.transform = (p) => n(p)));
    }
    return f;
  });
}, mt = (a = {}) => {
  const { enable: t = !0, type: r, editableConfig: n = {} } = a;
  return P((i, o) => {
    if (!t)
      return {};
    if (o !== "table")
      return {};
    if (S(i, "editable"))
      return {};
    const f = {
      type: r || x(i, "valueType", "text")
    };
    return n.onSave && (f.onSave = async (u, d, c, p) => {
      const m = x(i, "dataIndex"), v = m ? d[m] : void 0;
      return n.onSave(u, d, v);
    }), n.onCancel && (f.onCancel = (u, d) => {
      n.onCancel(u, d);
    }), n.formItemProps && (f.formItemProps = n.formItemProps), n.fieldProps && (f.fieldProps = n.fieldProps), {
      editable: () => f
    };
  });
}, se = () => {
  try {
    return process.env.NODE_ENV === "development";
  } catch {
    return !1;
  }
}, qe = (a, t) => {
  var r, n;
  se() ? console.error("[ProColumns Strategy Error]", {
    message: a.message,
    column: ((r = t.column) == null ? void 0 : r.dataIndex) || ((n = t.column) == null ? void 0 : n.title) || "unknown",
    strategyIndex: t.strategyIndex,
    error: a
  }) : console.error("[ProColumns] Strategy execution error:", a.message);
}, Jr = (a, t) => {
  try {
    if (!a.strategys || a.strategys.length === 0 || t.mode === "replace")
      return t;
    {
      const r = [];
      return a.strategys.forEach((n) => {
        r.push(...n.strategy);
      }), r.push(...t.strategy), {
        mode: "merge",
        strategy: r
      };
    }
  } catch (r) {
    return se() && console.error("[ProColumns Strategy Merge Error]", {
      message: r.message,
      column: a.dataIndex || a.title || "unknown",
      error: r
    }), t;
  }
}, zr = (a, t, r) => {
  let n = { ...a };
  return t.forEach((i, o) => {
    try {
      if (i.scene) {
        const l = Array.isArray(i.scene) ? i.scene : [i.scene];
        if (r && !l.includes(r))
          return;
      }
      i.strategy.forEach((l, f) => {
        try {
          const u = l(n, r);
          n = { ...n, ...u };
        } catch (u) {
          qe(u, {
            column: n,
            strategyIndex: o * 1e3 + f
            // 组合索引便于定位
          });
        }
      });
    } catch (l) {
      qe(l, {
        column: n,
        strategyIndex: o
      });
    }
  }), delete n.strategys, n;
}, Qr = (a, t) => {
  try {
    return a.map((n) => ({ ...n })).map((n, i) => {
      try {
        return n.strategys ? (n.strategys = n.strategys.map((o) => Jr(n, o)), zr(n, n.strategys, t)) : n;
      } catch (o) {
        se() ? console.error("[ProColumns Strategy Processing Error]", {
          message: o.message,
          column: n.dataIndex || n.title || "unknown",
          columnIndex: i,
          error: o
        }) : console.error("[ProColumns] Column processing error:", o.message);
        const l = { ...n };
        return delete l.strategys, l;
      }
    });
  } catch (r) {
    return se() ? console.error("[ProColumns Strategy Error]", {
      message: r.message,
      error: r
    }) : console.error("[ProColumns] Unexpected error:", r.message), a.map((n) => {
      const i = { ...n };
      return delete i.strategys, i;
    });
  }
}, Zr = (a) => {
  const {
    columns: t,
    enums: r = {},
    scene: n,
    applyStrategies: i,
    mergeMode: o = !0,
    columnStrategies: l
  } = a, f = i && i.length > 0, u = l && l.length > 0, d = u ? new Map(l.map((p) => [p.dataIndex, p])) : null, c = t.map((p) => {
    const m = { ...p };
    if ("enumKey" in m && m.enumKey) {
      const v = m.enumKey;
      r[v] && (m.valueEnum = r[v]), delete m.enumKey;
    }
    if (f) {
      const v = {
        mode: "merge",
        strategy: i
      };
      o ? m.strategys = [...p.strategys || [], v] : m.strategys = [v];
    }
    if (u && d) {
      const v = d.get(m.dataIndex);
      if (v) {
        const w = {
          mode: "merge",
          strategy: v.strategies
        };
        (v.mergeMode !== void 0 ? v.mergeMode : !0) ? m.strategys = [...m.strategys || [], w] : m.strategys = [w];
      }
    }
    return m;
  });
  return Qr(c, n);
}, ue = () => {
  try {
    return process.env.NODE_ENV === "development";
  } catch {
    return !1;
  }
}, V = {
  /**
   * 记录警告信息
   */
  warn(a, t) {
    ue() ? console.warn(`[ProColumns Warning] ${a}`, t || "") : console.warn(`[ProColumns] ${a}`);
  },
  /**
   * 记录错误信息
   */
  error(a, t) {
    ue() ? (console.error(`[ProColumns Error] ${a}`, t || ""), t != null && t.stack && console.error("Stack trace:", t.stack)) : console.error(`[ProColumns] ${a}`);
  }
}, oe = /* @__PURE__ */ new Map(), Xr = {
  proTable: "table",
  proForm: "form",
  proDescription: "description"
}, B = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(a) {
    oe.set(a.name, a);
  },
  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(a) {
    return oe.get(a);
  },
  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   * @param options 配置选项
   */
  transform(a, t, r) {
    try {
      if (!a)
        return V.error("Component name is required"), t;
      if (!Array.isArray(t))
        return V.error("Columns must be an array"), [];
      const n = this.getAdapter(a);
      if (!n) {
        const p = this.getAdapterNames();
        return V.warn(
          `Component adapter "${a}" not found. Returning original columns.`,
          ue() ? {
            requestedAdapter: a,
            availableAdapters: p,
            suggestion: p.length > 0 ? `Available adapters: ${p.join(", ")}` : "No adapters registered. Did you forget to register the adapter?"
          } : void 0
        ), t;
      }
      const { enums: i, scene: o, applyStrategies: l, mergeMode: f = !0, columnStrategies: u } = r || {}, d = o || n.scene || Xr[a];
      !d && ue() && V.warn(
        `No scene specified for component "${a}". Some strategies may not work correctly.`,
        { adapter: a, providedScene: o, fallbackScene: d }
      );
      let c;
      try {
        c = Zr({
          columns: t,
          enums: i,
          scene: d,
          applyStrategies: l,
          mergeMode: f,
          columnStrategies: u
        });
      } catch (p) {
        V.error(
          "Error occurred while processing strategies. Falling back to original columns.",
          p
        ), c = t;
      }
      try {
        return n.transform(c);
      } catch (p) {
        return V.error(
          `Error occurred in adapter "${a}" transform. Falling back to processed columns.`,
          p
        ), c;
      }
    } catch (n) {
      return V.error("Unexpected error in Component.transform. Returning original columns.", n), t;
    }
  },
  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames() {
    return Array.from(oe.keys());
  },
  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    oe.clear();
  }
}, et = {
  name: "proTable",
  scene: "table",
  transform: (a) => a.map((t) => {
    const r = { ...t };
    return "ellipsis" in r || (r.ellipsis = !0), "search" in r && r.search === !1 && (r.hideInSearch = !0, delete r.search), "hideInTable" in r && r.hideInTable && (r.hideInTable = !0), "defaultHidden" in r && r.defaultHidden && delete r.defaultHidden, r;
  })
}, rt = {
  name: "proForm",
  scene: "form",
  transform: (a) => a.filter((t) => !t.hideInForm).map((t) => {
    const r = { ...t };
    if (delete r.hideInTable, delete r.ellipsis, delete r.copyable, delete r.sorter, delete r.search, delete r.hideInSearch, !r.name && r.dataIndex && (r.name = r.dataIndex), !r.width) {
      const n = r.valueType || "text";
      ["textarea"].includes(n) ? r.width = "xl" : ["dateRange", "dateTimeRange", "timeRange"].includes(n) ? r.width = "lg" : r.width = "md";
    }
    return r;
  })
}, tt = {
  name: "proDescription",
  scene: "description",
  transform: (a) => a.filter((t) => !t.hideInDescriptions).map((t) => {
    const r = { ...t };
    if (delete r.hideInTable, delete r.sorter, delete r.filters, delete r.hideInForm, delete r.formItemProps, delete r.search, delete r.hideInSearch, delete r.fieldProps, !r.span) {
      const n = r.valueType || "text";
      ["textarea", "jsonCode", "code"].includes(n) ? r.span = 3 : r.span = 1;
    }
    return r;
  })
}, U = {};
class gt {
  /**
   * 注册自定义预设
   * @param name 预设名称
   * @param preset 预设函数
   */
  static register(t, r) {
    U[t] && console.warn(`[Pro-Columns] Preset "${t}" already exists and will be overwritten.`), U[t] = r;
  }
  /**
   * 获取预设
   * @param name 预设名称
   * @returns 预设函数
   */
  static get(t) {
    return U[t];
  }
  /**
   * 获取所有预设名称
   * @returns 预设名称列表
   */
  static list() {
    return Object.keys(U);
  }
  /**
   * 清空所有预设（主要用于测试）
   */
  static clear() {
    Object.keys(U).forEach((t) => {
      delete U[t];
    });
  }
  // ==================== 内置预设 ====================
  /**
   * 可搜索字段
   * 包含：搜索、排序、占位符
   */
  static searchableField() {
    return [te(), D(), ne({ includeSearch: !0 })];
  }
  /**
   * 必填字段
   * 包含：必填、占位符
   */
  static requiredField() {
    return [he(), ne()];
  }
  /**
   * 金额字段
   * 包含：金额格式化、宽度配置、排序
   */
  static moneyField(t) {
    const { precision: r = 2 } = t || {};
    return [
      J({ type: "money", precision: r }),
      Y({ table: 120, form: "lg" }),
      D(),
      ie()
    ];
  }
  /**
   * 日期字段
   * 包含：日期格式化、排序、宽度配置
   */
  static dateField(t) {
    const { format: r = "YYYY-MM-DD" } = t || {};
    return [J({ type: "date", dateFormat: r }), D(), Y({ table: 180, form: "md" })];
  }
  /**
   * 日期时间字段
   * 包含：日期时间格式化、排序、宽度配置
   */
  static dateTimeField() {
    return [
      J({ type: "date", dateFormat: "YYYY-MM-DD HH:mm:ss" }),
      D(),
      Y({ table: 200, form: "lg" })
    ];
  }
  /**
   * 枚举字段
   * 包含：枚举渲染、搜索、必填、占位符
   */
  static enumField(t) {
    const { type: r = "badge" } = t || {};
    return [Ke({ type: r }), te(), he(), ne()];
  }
  /**
   * 只读字段
   * 包含：禁用表单输入
   */
  static readonlyField() {
    return [
      P(() => ({
        fieldProps: { disabled: !0 },
        editable: !1
      }))
    ];
  }
  /**
   * 图片字段
   * 包含：图片预览、宽度配置
   */
  static imageField(t) {
    const { width: r = 60, height: n = 60, maxCount: i = 5 } = t || {};
    return [Kr({ width: r, height: n, maxCount: i }), Y({ table: 100, form: "lg" })];
  }
  /**
   * 链接字段
   * 包含：链接跳转、宽度配置、复制
   */
  static linkField(t) {
    const { target: r = "_blank" } = t || {};
    return [Gr({ target: r }), ie(), Y({ table: 200 })];
  }
  /**
   * 数字字段
   * 包含：数字格式化、排序、宽度配置
   */
  static numberField(t) {
    const { precision: r = 0 } = t || {};
    return [J({ type: "number", precision: r }), D(), Y({ table: 100, form: "md" })];
  }
  /**
   * 百分比字段
   * 包含：百分比格式化、排序、宽度配置
   */
  static percentField(t) {
    const { precision: r = 2 } = t || {};
    return [J({ type: "percent", precision: r }), D(), Y({ table: 100, form: "md" })];
  }
  /**
   * 可编辑字段（表格内编辑）
   * 包含：可编辑配置、排序
   */
  static editableField(t) {
    const { type: r = "text", onSave: n } = t || {};
    return [
      P(() => ({
        editable: () => ({
          type: r,
          onSave: n
        })
      })),
      D()
    ];
  }
  /**
   * 完整 CRUD 字段
   * 包含：搜索、排序、必填、占位符、复制
   * 适用于常规文本字段
   */
  static fullField() {
    return [te(), D(), he(), ne({ includeSearch: !0 }), ie()];
  }
  /**
   * ID 字段
   * 包含：固定宽度、只读、复制、排序
   * 适用于主键、唯一标识等字段
   */
  static idField(t) {
    const { width: r = 80, copyable: n = !0, sortable: i = !0 } = t || {}, o = [
      P(() => ({
        width: r,
        ellipsis: !0,
        fieldProps: { disabled: !0 },
        hideInForm: !0
        // ID 通常不在表单中显示
      }))
    ];
    return n && o.push(ie()), i && o.push(D()), o;
  }
  /**
   * 状态字段
   * 包含：状态枚举、搜索、排序、筛选
   * 适用于状态、类型等枚举字段
   */
  static statusField(t) {
    const {
      type: r = "badge",
      searchable: n = !0,
      sortable: i = !0,
      filterable: o = !0
    } = t || {}, l = [
      Ke({ type: r }),
      Y({ table: 100, form: "md" })
    ];
    return n && l.push(te()), i && l.push(D()), o && l.push(
      P((f) => ({
        // 自动从 valueEnum 生成筛选选项的逻辑已在 Filter 策略中实现
        // 这里只需要标记需要筛选功能
        filters: f.valueEnum ? Object.keys(f.valueEnum).map((u) => {
          const d = f.valueEnum[u];
          return {
            text: typeof d == "object" && d.text ? d.text : String(d),
            value: u
          };
        }) : void 0,
        filterSearch: !0
      }))
    ), l;
  }
  /**
   * 操作列
   * 包含：固定在右侧、固定宽度、不导出
   * 适用于操作按钮列
   */
  static actionField(t) {
    const { width: r = 150, fixed: n = "right" } = t || {};
    return [
      P(() => ({
        title: "操作",
        dataIndex: "action",
        valueType: "option",
        width: r,
        fixed: n,
        hideInSearch: !0,
        hideInForm: !0,
        hideInDescriptions: !0,
        // 操作列通常不导出
        __export: !0,
        __exportable: !1
      }))
    ];
  }
}
var ve = { exports: {} }, z = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Je;
function nt() {
  if (Je) return z;
  Je = 1;
  var a = M, t = Symbol.for("react.element"), r = Symbol.for("react.fragment"), n = Object.prototype.hasOwnProperty, i = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, o = { key: !0, ref: !0, __self: !0, __source: !0 };
  function l(f, u, d) {
    var c, p = {}, m = null, v = null;
    d !== void 0 && (m = "" + d), u.key !== void 0 && (m = "" + u.key), u.ref !== void 0 && (v = u.ref);
    for (c in u) n.call(u, c) && !o.hasOwnProperty(c) && (p[c] = u[c]);
    if (f && f.defaultProps) for (c in u = f.defaultProps, u) p[c] === void 0 && (p[c] = u[c]);
    return { $$typeof: t, type: f, key: m, ref: v, props: p, _owner: i.current };
  }
  return z.Fragment = r, z.jsx = l, z.jsxs = l, z;
}
var Q = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ze;
function at() {
  return ze || (ze = 1, process.env.NODE_ENV !== "production" && function() {
    var a = M, t = Symbol.for("react.element"), r = Symbol.for("react.portal"), n = Symbol.for("react.fragment"), i = Symbol.for("react.strict_mode"), o = Symbol.for("react.profiler"), l = Symbol.for("react.provider"), f = Symbol.for("react.context"), u = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), c = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), v = Symbol.for("react.offscreen"), w = Symbol.iterator, O = "@@iterator";
    function G(e) {
      if (e === null || typeof e != "object")
        return null;
      var s = w && e[w] || e[O];
      return typeof s == "function" ? s : null;
    }
    var F = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function C(e) {
      {
        for (var s = arguments.length, g = new Array(s > 1 ? s - 1 : 0), y = 1; y < s; y++)
          g[y - 1] = arguments[y];
        N("error", e, g);
      }
    }
    function N(e, s, g) {
      {
        var y = F.ReactDebugCurrentFrame, T = y.getStackAddendum();
        T !== "" && (s += "%s", g = g.concat([T]));
        var R = g.map(function(b) {
          return String(b);
        });
        R.unshift("Warning: " + s), Function.prototype.apply.call(console[e], console, R);
      }
    }
    var Ze = !1, Xe = !1, er = !1, rr = !1, tr = !1, Te;
    Te = Symbol.for("react.module.reference");
    function nr(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === n || e === o || tr || e === i || e === d || e === c || rr || e === v || Ze || Xe || er || typeof e == "object" && e !== null && (e.$$typeof === m || e.$$typeof === p || e.$$typeof === l || e.$$typeof === f || e.$$typeof === u || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === Te || e.getModuleId !== void 0));
    }
    function ar(e, s, g) {
      var y = e.displayName;
      if (y)
        return y;
      var T = s.displayName || s.name || "";
      return T !== "" ? g + "(" + T + ")" : g;
    }
    function Re(e) {
      return e.displayName || "Context";
    }
    function A(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && C("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case n:
          return "Fragment";
        case r:
          return "Portal";
        case o:
          return "Profiler";
        case i:
          return "StrictMode";
        case d:
          return "Suspense";
        case c:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case f:
            var s = e;
            return Re(s) + ".Consumer";
          case l:
            var g = e;
            return Re(g._context) + ".Provider";
          case u:
            return ar(e, e.render, "ForwardRef");
          case p:
            var y = e.displayName || null;
            return y !== null ? y : A(e.type) || "Memo";
          case m: {
            var T = e, R = T._payload, b = T._init;
            try {
              return A(b(R));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var $ = Object.assign, K = 0, Ee, Pe, Se, we, _e, Ce, Ie;
    function Fe() {
    }
    Fe.__reactDisabledLog = !0;
    function ir() {
      {
        if (K === 0) {
          Ee = console.log, Pe = console.info, Se = console.warn, we = console.error, _e = console.group, Ce = console.groupCollapsed, Ie = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Fe,
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
        K++;
      }
    }
    function or() {
      {
        if (K--, K === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: $({}, e, {
              value: Ee
            }),
            info: $({}, e, {
              value: Pe
            }),
            warn: $({}, e, {
              value: Se
            }),
            error: $({}, e, {
              value: we
            }),
            group: $({}, e, {
              value: _e
            }),
            groupCollapsed: $({}, e, {
              value: Ce
            }),
            groupEnd: $({}, e, {
              value: Ie
            })
          });
        }
        K < 0 && C("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var le = F.ReactCurrentDispatcher, ce;
    function Z(e, s, g) {
      {
        if (ce === void 0)
          try {
            throw Error();
          } catch (T) {
            var y = T.stack.trim().match(/\n( *(at )?)/);
            ce = y && y[1] || "";
          }
        return `
` + ce + e;
      }
    }
    var fe = !1, X;
    {
      var sr = typeof WeakMap == "function" ? WeakMap : Map;
      X = new sr();
    }
    function je(e, s) {
      if (!e || fe)
        return "";
      {
        var g = X.get(e);
        if (g !== void 0)
          return g;
      }
      var y;
      fe = !0;
      var T = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var R;
      R = le.current, le.current = null, ir();
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
              y = j;
            }
            Reflect.construct(e, [], b);
          } else {
            try {
              b.call();
            } catch (j) {
              y = j;
            }
            e.call(b.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (j) {
            y = j;
          }
          e();
        }
      } catch (j) {
        if (j && y && typeof j.stack == "string") {
          for (var h = j.stack.split(`
`), I = y.stack.split(`
`), E = h.length - 1, _ = I.length - 1; E >= 1 && _ >= 0 && h[E] !== I[_]; )
            _--;
          for (; E >= 1 && _ >= 0; E--, _--)
            if (h[E] !== I[_]) {
              if (E !== 1 || _ !== 1)
                do
                  if (E--, _--, _ < 0 || h[E] !== I[_]) {
                    var k = `
` + h[E].replace(" at new ", " at ");
                    return e.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", e.displayName)), typeof e == "function" && X.set(e, k), k;
                  }
                while (E >= 1 && _ >= 0);
              break;
            }
        }
      } finally {
        fe = !1, le.current = R, or(), Error.prepareStackTrace = T;
      }
      var H = e ? e.displayName || e.name : "", W = H ? Z(H) : "";
      return typeof e == "function" && X.set(e, W), W;
    }
    function ur(e, s, g) {
      return je(e, !1);
    }
    function lr(e) {
      var s = e.prototype;
      return !!(s && s.isReactComponent);
    }
    function ee(e, s, g) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return je(e, lr(e));
      if (typeof e == "string")
        return Z(e);
      switch (e) {
        case d:
          return Z("Suspense");
        case c:
          return Z("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case u:
            return ur(e.render);
          case p:
            return ee(e.type, s, g);
          case m: {
            var y = e, T = y._payload, R = y._init;
            try {
              return ee(R(T), s, g);
            } catch {
            }
          }
        }
      return "";
    }
    var q = Object.prototype.hasOwnProperty, ke = {}, De = F.ReactDebugCurrentFrame;
    function re(e) {
      if (e) {
        var s = e._owner, g = ee(e.type, e._source, s ? s.type : null);
        De.setExtraStackFrame(g);
      } else
        De.setExtraStackFrame(null);
    }
    function cr(e, s, g, y, T) {
      {
        var R = Function.call.bind(q);
        for (var b in e)
          if (R(e, b)) {
            var h = void 0;
            try {
              if (typeof e[b] != "function") {
                var I = Error((y || "React class") + ": " + g + " type `" + b + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[b] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw I.name = "Invariant Violation", I;
              }
              h = e[b](s, b, y, g, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (E) {
              h = E;
            }
            h && !(h instanceof Error) && (re(T), C("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", y || "React class", g, b, typeof h), re(null)), h instanceof Error && !(h.message in ke) && (ke[h.message] = !0, re(T), C("Failed %s type: %s", g, h.message), re(null));
          }
      }
    }
    var fr = Array.isArray;
    function de(e) {
      return fr(e);
    }
    function dr(e) {
      {
        var s = typeof Symbol == "function" && Symbol.toStringTag, g = s && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return g;
      }
    }
    function pr(e) {
      try {
        return Oe(e), !1;
      } catch {
        return !0;
      }
    }
    function Oe(e) {
      return "" + e;
    }
    function Me(e) {
      if (pr(e))
        return C("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", dr(e)), Oe(e);
    }
    var Ae = F.ReactCurrentOwner, mr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Ye, $e;
    function gr(e) {
      if (q.call(e, "ref")) {
        var s = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function yr(e) {
      if (q.call(e, "key")) {
        var s = Object.getOwnPropertyDescriptor(e, "key").get;
        if (s && s.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function hr(e, s) {
      typeof e.ref == "string" && Ae.current;
    }
    function vr(e, s) {
      {
        var g = function() {
          Ye || (Ye = !0, C("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        g.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: g,
          configurable: !0
        });
      }
    }
    function br(e, s) {
      {
        var g = function() {
          $e || ($e = !0, C("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", s));
        };
        g.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: g,
          configurable: !0
        });
      }
    }
    var xr = function(e, s, g, y, T, R, b) {
      var h = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: t,
        // Built-in properties that belong on the element
        type: e,
        key: s,
        ref: g,
        props: b,
        // Record the component responsible for creating this element.
        _owner: R
      };
      return h._store = {}, Object.defineProperty(h._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(h, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: y
      }), Object.defineProperty(h, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: T
      }), Object.freeze && (Object.freeze(h.props), Object.freeze(h)), h;
    };
    function Tr(e, s, g, y, T) {
      {
        var R, b = {}, h = null, I = null;
        g !== void 0 && (Me(g), h = "" + g), yr(s) && (Me(s.key), h = "" + s.key), gr(s) && (I = s.ref, hr(s, T));
        for (R in s)
          q.call(s, R) && !mr.hasOwnProperty(R) && (b[R] = s[R]);
        if (e && e.defaultProps) {
          var E = e.defaultProps;
          for (R in E)
            b[R] === void 0 && (b[R] = E[R]);
        }
        if (h || I) {
          var _ = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          h && vr(b, _), I && br(b, _);
        }
        return xr(e, h, I, T, y, Ae.current, b);
      }
    }
    var pe = F.ReactCurrentOwner, We = F.ReactDebugCurrentFrame;
    function L(e) {
      if (e) {
        var s = e._owner, g = ee(e.type, e._source, s ? s.type : null);
        We.setExtraStackFrame(g);
      } else
        We.setExtraStackFrame(null);
    }
    var me;
    me = !1;
    function ge(e) {
      return typeof e == "object" && e !== null && e.$$typeof === t;
    }
    function Ve() {
      {
        if (pe.current) {
          var e = A(pe.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function Rr(e) {
      return "";
    }
    var Ne = {};
    function Er(e) {
      {
        var s = Ve();
        if (!s) {
          var g = typeof e == "string" ? e : e.displayName || e.name;
          g && (s = `

Check the top-level render call using <` + g + ">.");
        }
        return s;
      }
    }
    function Le(e, s) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var g = Er(s);
        if (Ne[g])
          return;
        Ne[g] = !0;
        var y = "";
        e && e._owner && e._owner !== pe.current && (y = " It was passed a child from " + A(e._owner.type) + "."), L(e), C('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', g, y), L(null);
      }
    }
    function He(e, s) {
      {
        if (typeof e != "object")
          return;
        if (de(e))
          for (var g = 0; g < e.length; g++) {
            var y = e[g];
            ge(y) && Le(y, s);
          }
        else if (ge(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var T = G(e);
          if (typeof T == "function" && T !== e.entries)
            for (var R = T.call(e), b; !(b = R.next()).done; )
              ge(b.value) && Le(b.value, s);
        }
      }
    }
    function Pr(e) {
      {
        var s = e.type;
        if (s == null || typeof s == "string")
          return;
        var g;
        if (typeof s == "function")
          g = s.propTypes;
        else if (typeof s == "object" && (s.$$typeof === u || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        s.$$typeof === p))
          g = s.propTypes;
        else
          return;
        if (g) {
          var y = A(s);
          cr(g, e.props, "prop", y, e);
        } else if (s.PropTypes !== void 0 && !me) {
          me = !0;
          var T = A(s);
          C("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", T || "Unknown");
        }
        typeof s.getDefaultProps == "function" && !s.getDefaultProps.isReactClassApproved && C("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Sr(e) {
      {
        for (var s = Object.keys(e.props), g = 0; g < s.length; g++) {
          var y = s[g];
          if (y !== "children" && y !== "key") {
            L(e), C("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", y), L(null);
            break;
          }
        }
        e.ref !== null && (L(e), C("Invalid attribute `ref` supplied to `React.Fragment`."), L(null));
      }
    }
    var Ue = {};
    function Be(e, s, g, y, T, R) {
      {
        var b = nr(e);
        if (!b) {
          var h = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var I = Rr();
          I ? h += I : h += Ve();
          var E;
          e === null ? E = "null" : de(e) ? E = "array" : e !== void 0 && e.$$typeof === t ? (E = "<" + (A(e.type) || "Unknown") + " />", h = " Did you accidentally export a JSX literal instead of a component?") : E = typeof e, C("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", E, h);
        }
        var _ = Tr(e, s, g, T, R);
        if (_ == null)
          return _;
        if (b) {
          var k = s.children;
          if (k !== void 0)
            if (y)
              if (de(k)) {
                for (var H = 0; H < k.length; H++)
                  He(k[H], e);
                Object.freeze && Object.freeze(k);
              } else
                C("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              He(k, e);
        }
        if (q.call(s, "key")) {
          var W = A(e), j = Object.keys(s).filter(function(jr) {
            return jr !== "key";
          }), ye = j.length > 0 ? "{key: someKey, " + j.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ue[W + ye]) {
            var Fr = j.length > 0 ? "{" + j.join(": ..., ") + ": ...}" : "{}";
            C(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, ye, W, Fr, W), Ue[W + ye] = !0;
          }
        }
        return e === n ? Sr(_) : Pr(_), _;
      }
    }
    function wr(e, s, g) {
      return Be(e, s, g, !0);
    }
    function _r(e, s, g) {
      return Be(e, s, g, !1);
    }
    var Cr = _r, Ir = wr;
    Q.Fragment = n, Q.jsx = Cr, Q.jsxs = Ir;
  }()), Q;
}
process.env.NODE_ENV === "production" ? ve.exports = nt() : ve.exports = at();
var xe = ve.exports;
function yt(a) {
  const {
    columns: t,
    enums: r,
    applyStrategies: n,
    mergeMode: i,
    columnStrategies: o,
    ...l
  } = a;
  return /* @__PURE__ */ xe.jsx(
    Ar,
    {
      columns: B.transform("proTable", t, {
        enums: r,
        applyStrategies: n,
        mergeMode: i,
        columnStrategies: o
      }),
      ...l
    }
  );
}
function ht(a) {
  const {
    columns: t,
    enums: r,
    applyStrategies: n,
    mergeMode: i,
    columnStrategies: o,
    ...l
  } = a;
  return /* @__PURE__ */ xe.jsx(
    Yr,
    {
      columns: B.transform("proForm", t, {
        enums: r,
        applyStrategies: n,
        mergeMode: i,
        columnStrategies: o
      }),
      ...l
    }
  );
}
function vt(a) {
  const {
    columns: t,
    enums: r,
    applyStrategies: n,
    mergeMode: i,
    columnStrategies: o,
    ...l
  } = a;
  return /* @__PURE__ */ xe.jsx(
    $r,
    {
      columns: B.transform("proDescription", t, {
        enums: r,
        applyStrategies: n,
        mergeMode: i,
        columnStrategies: o
      }),
      ...l
    }
  );
}
B.register(et);
B.register(rt);
B.register(tt);
export {
  Zr as Columns,
  B as Component,
  ie as Copy,
  ct as DefaultValue,
  mt as Editable,
  Ke as Enum,
  J as Format,
  Kr as Image,
  Gr as Link,
  dt as Permission,
  ne as Placeholder,
  gt as Presets,
  vt as ProColumnsDescription,
  ht as ProColumnsForm,
  yt as ProColumnsTable,
  he as Required,
  te as Search,
  D as Sort,
  lt as Tooltip,
  pt as Transform,
  ft as Validation,
  Y as Width,
  P as createStrategy,
  Qe as deepMerge,
  Ge as generatePlaceholder,
  x as getField,
  Wr as getFieldType,
  S as hasField,
  ut as setField
};
//# sourceMappingURL=pro-columns.mjs.map
