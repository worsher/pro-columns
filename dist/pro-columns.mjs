import Me from "react";
import { ProTable as bt, BetaSchemaForm as Tt, ProDescriptions as Rt } from "@ant-design/pro-components";
function We(r, a) {
  const t = { ...r };
  return Object.keys(a).forEach((i) => {
    const o = a[i], u = t[i];
    o && typeof o == "object" && !Array.isArray(o) && u && typeof u == "object" && !Array.isArray(u) ? t[i] = We(u, o) : t[i] = o;
  }), t;
}
function O(r, a) {
  return a in r && r[a] !== void 0;
}
function R(r, a, t) {
  return O(r, a) ? r[a] : t;
}
function Nt(r, a, t) {
  return {
    ...r,
    [a]: t
  };
}
function Et(r) {
  if (O(r, "valueType"))
    return R(r, "valueType", "text") || "text";
  if (O(r, "valueEnum")) return "select";
  if (O(r, "fieldProps")) {
    const a = R(r, "fieldProps");
    if ((a == null ? void 0 : a.mode) === "multiple") return "select";
    if ((a == null ? void 0 : a.type) === "password") return "password";
  }
  return "text";
}
function Ie(r, a = "input") {
  const t = R(r, "title", "字段"), i = Et(r), o = {
    search: "搜索",
    input: "请输入",
    select: "请选择"
  };
  let u = a;
  return ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(i) && (u = "select"), `${o[u]}${t}`;
}
function F(r) {
  return (a, t) => {
    const i = r(a, t);
    return We(a, i);
  };
}
const Lt = (r = {}) => {
  const { enable: a = !0, searchTypeMap: t = {} } = r, i = {
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
  return F((o) => {
    if (!a || O(o, "search") && !R(o, "search"))
      return { search: !1 };
    if (O(o, "search") && typeof R(o, "search") == "object")
      return {};
    const u = R(o, "valueType", "text") || "text", c = i[u] || "text";
    return {
      search: !0,
      // 在 fieldProps 中设置搜索相关属性（如果需要）
      fieldProps: {
        ...R(o, "fieldProps", {})
      },
      // 某些组件可能需要 searchType
      ...c !== "text" ? { searchType: c } : {}
    };
  });
}, Ut = (r = {}) => {
  const { enable: a = !0, defaultSorter: t = !1 } = r;
  return F((i) => {
    if (!a || O(i, "sorter") && R(i, "sorter") === !1)
      return { sorter: !1 };
    if (O(i, "sorter") && typeof R(i, "sorter") == "function")
      return {};
    const o = R(i, "dataIndex");
    if (!o)
      return {};
    const u = R(i, "valueType", "text") || "text";
    let c = !0;
    return ["digit", "money", "percent"].includes(u) ? c = (g, l) => {
      const m = g[o] || 0, d = l[o] || 0;
      return m - d;
    } : ["date", "dateTime", "time"].includes(u) ? c = (g, l) => {
      const m = new Date(g[o] || 0).getTime(), d = new Date(l[o] || 0).getTime();
      return m - d;
    } : u === "text" && (c = (g, l) => {
      const m = String(g[o] || ""), d = String(l[o] || "");
      return m.localeCompare(d);
    }), {
      sorter: c,
      ...t ? { defaultSortOrder: t } : {}
    };
  });
}, Kt = (r = {}) => {
  const { enable: a = !0, messageTemplate: t } = r, i = (o) => `请输入${o}`;
  return F((o) => {
    if (!a)
      return {};
    const u = R(o, "formItemProps.rules", []) || [];
    if (u.some((E) => E.required))
      return {};
    if (!R(o, "dataIndex"))
      return {};
    const l = R(o, "title", "此字段") || "此字段", m = typeof t == "function" ? t(l) : t || i(l), d = R(o, "valueType", "text") || "text", p = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      d
    ) ? m.replace("输入", "选择") : m;
    return {
      formItemProps: {
        ...R(o, "formItemProps", {}),
        rules: [
          ...u,
          {
            required: !0,
            message: p
          }
        ]
      }
    };
  });
}, qt = (r = {}) => {
  const { enable: a = !0, template: t, includeSearch: i = !0 } = r;
  return F((o) => {
    if (!a)
      return {};
    const u = R(o, "fieldProps", {});
    if (u.placeholder)
      return {};
    const c = R(o, "valueType", "text") || "text", l = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      c
    ) ? "select" : "input", m = t ? t(o, l) : Ie(o, l), d = {
      fieldProps: {
        ...u,
        placeholder: m
      }
    };
    if (i && O(o, "search")) {
      const v = R(o, "search");
      if (v === !0 || typeof v == "object" && v !== null) {
        const p = t ? t(o, "search") : Ie(o, "search");
        d.fieldProps.placeholder = p;
      }
    }
    return d;
  });
};
function ie(r, a, t = !0) {
  if (r == null || isNaN(r)) return "-";
  const i = {
    minimumFractionDigits: a,
    maximumFractionDigits: a,
    useGrouping: t
  };
  return new Intl.NumberFormat("zh-CN", i).format(r);
}
function xt(r, a = 2, t = "¥", i = !0) {
  if (r == null || isNaN(r)) return "-";
  const o = ie(r, a, i);
  return `${t}${o}`;
}
function St(r, a = 2) {
  return r == null || isNaN(r) ? "-" : `${ie(r, a, !1)}%`;
}
function _t(r, a = "YYYY-MM-DD") {
  if (!r) return "-";
  const t = new Date(r);
  if (isNaN(t.getTime())) return "-";
  const i = t.getFullYear(), o = String(t.getMonth() + 1).padStart(2, "0"), u = String(t.getDate()).padStart(2, "0"), c = String(t.getHours()).padStart(2, "0"), g = String(t.getMinutes()).padStart(2, "0"), l = String(t.getSeconds()).padStart(2, "0");
  return a.replace("YYYY", String(i)).replace("MM", o).replace("DD", u).replace("HH", c).replace("mm", g).replace("ss", l);
}
const Bt = (r = {}) => {
  const {
    enable: a = !0,
    type: t,
    precision: i,
    symbol: o = "¥",
    useGrouping: u = !0,
    dateFormat: c = "YYYY-MM-DD",
    formatter: g
  } = r;
  return F((l) => {
    if (!a)
      return {};
    if (O(l, "render") && !g)
      return {};
    const m = R(l, "valueType", "text") || "text";
    let d = t;
    if (d || (m === "money" ? d = "money" : m === "digit" ? d = "number" : ["date", "dateTime"].includes(m) ? d = "date" : m === "percent" && (d = "percent")), !d && !g)
      return {};
    let v;
    return g ? v = (p, E) => g(p, E) : d === "money" ? v = (p) => xt(p, i, o, u) : d === "number" ? v = (p) => ie(p, i, u) : d === "percent" ? v = (p) => St(p, i) : d === "date" && (v = (p) => _t(p, m === "dateTime" ? "YYYY-MM-DD HH:mm:ss" : c)), v ? {
      render: v
    } : {};
  });
}, Ht = (r = {}) => {
  const {
    enable: a = !0,
    content: t,
    formType: i = "tooltip",
    showInTable: o = !0,
    showInForm: u = !0
  } = r;
  return F((c) => {
    if (!a)
      return {};
    const g = typeof t == "function" ? t(c) : t;
    if (!g)
      return {};
    const l = {};
    if (o && (O(c, "tooltip") || (l.tooltip = g)), u) {
      const m = R(c, "formItemProps", {});
      i === "tooltip" ? m.tooltip || (l.formItemProps = {
        ...m,
        tooltip: g
      }) : m.extra || (l.formItemProps = {
        ...m,
        extra: g
      });
    }
    return l;
  });
};
function Pt(r) {
  switch (R(r, "valueType", "text")) {
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
      const t = R(r, "valueEnum");
      return t && typeof t == "object" && Object.keys(t)[0] || null;
    case "textarea":
    case "text":
    case "password":
    default:
      return "";
  }
}
const Gt = (r = {}) => {
  const { enable: a = !0, value: t, autoInfer: i = !1 } = r;
  return F((o) => {
    if (!a)
      return {};
    if (O(o, "initialValue"))
      return {};
    let u;
    if (t !== void 0)
      u = typeof t == "function" ? t() : t;
    else if (i)
      u = Pt(o);
    else
      return {};
    return {
      initialValue: u
    };
  });
};
function wt(r) {
  const a = R(r, "valueType", "text") || "text";
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
  }[a];
}
function Ct(r, a, t) {
  const i = R(r, "title", "");
  if (!i) return 0;
  let o = 0, u = 0;
  for (const g of i)
    /[\u4e00-\u9fa5]/.test(g) ? o++ : u++;
  const c = o * a + u * (a * 0.6) + t;
  return Math.ceil(c);
}
function H(r, a) {
  const { value: t, auto: i, min: o, max: u, charWidth: c = 14, padding: g = 48 } = a;
  let l;
  if (t !== void 0)
    l = t;
  else if (i) {
    const m = wt(r);
    if (m)
      l = m;
    else {
      const d = Ct(r, c, g);
      d > 0 && (l = d);
    }
  }
  return l !== void 0 && (o !== void 0 && l < o && (l = o), u !== void 0 && l > u && (l = u)), l;
}
const Jt = (r = {}) => {
  const {
    enable: a = !0,
    value: t,
    auto: i = !1,
    min: o,
    max: u,
    charWidth: c = 14,
    padding: g = 48,
    table: l,
    form: m,
    description: d
  } = r;
  return F((v, p) => {
    if (!a)
      return {};
    if (O(v, "width"))
      return {};
    if (p === "table") {
      if (l === null)
        return {};
      let w;
      return typeof l == "number" ? w = l : l && typeof l == "object" ? w = H(v, {
        ...l,
        charWidth: c,
        padding: g
      }) : w = H(v, {
        value: t,
        auto: i,
        min: o,
        max: u,
        charWidth: c,
        padding: g
      }), w !== void 0 ? { width: w } : {};
    } else {
      if (p === "form")
        return m === null ? {} : m && ["sm", "md", "lg", "xl"].includes(m) ? { width: m } : {};
      if (p === "description") {
        if (d === null)
          return {};
        if (typeof d == "number")
          return { width: d };
        const w = H(v, {
          value: t,
          auto: i,
          min: o,
          max: u,
          charWidth: c,
          padding: g
        });
        return w !== void 0 ? { width: w } : {};
      }
    }
    const E = H(v, {
      value: t,
      auto: i,
      min: o,
      max: u,
      charWidth: c,
      padding: g
    });
    return E !== void 0 ? { width: E } : {};
  });
}, Ot = (r, a) => {
  if (!r.strategys || r.strategys.length === 0 || a.mode === "replace")
    return a;
  {
    const t = [];
    return r.strategys.forEach((i) => {
      t.push(...i.strategy);
    }), t.push(...a.strategy), {
      mode: "merge",
      strategy: t
    };
  }
}, jt = (r, a, t) => {
  let i = { ...r };
  return a.forEach((o) => {
    if (o.scene) {
      const u = Array.isArray(o.scene) ? o.scene : [o.scene];
      if (t && !u.includes(t))
        return;
    }
    o.strategy.forEach((u) => {
      const c = u(i, t);
      i = { ...i, ...c };
    });
  }), delete i.strategys, i;
}, Dt = (r, a) => r.map((i) => ({ ...i })).map((i) => i.strategys ? (i.strategys = i.strategys.map((o) => Ot(i, o)), jt(i, i.strategys, a)) : i), Ft = (r) => {
  const {
    columns: a,
    enums: t = {},
    scene: i,
    applyStrategies: o,
    mergeMode: u = !0,
    columnStrategies: c
  } = r, m = a.map((v) => {
    const p = { ...v };
    if ("enumKey" in p && p.enumKey) {
      const E = p.enumKey;
      t[E] && (p.valueEnum = t[E]), delete p.enumKey;
    }
    return p;
  }).map((v) => {
    if (!o || o.length === 0)
      return v;
    const p = { ...v }, E = {
      mode: "merge",
      strategy: o
    };
    return u ? p.strategys = [...v.strategys || [], E] : p.strategys = [E], p;
  }).map((v) => {
    if (!c || c.length === 0)
      return v;
    const p = c.find(
      (J) => J.dataIndex === v.dataIndex
    );
    if (!p)
      return v;
    const E = { ...v }, w = {
      mode: "merge",
      strategy: p.strategies
    };
    return (p.mergeMode !== void 0 ? p.mergeMode : !0) ? E.strategys = [...E.strategys || [], w] : E.strategys = [w], E;
  });
  return Dt(m, i);
}, G = /* @__PURE__ */ new Map(), It = {
  proTable: "table",
  proForm: "form",
  proDescription: "description"
}, Y = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(r) {
    G.set(r.name, r);
  },
  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(r) {
    return G.get(r);
  },
  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   * @param options 配置选项
   */
  transform(r, a, t) {
    const i = this.getAdapter(r);
    if (!i)
      return console.warn(`Component adapter "${r}" not found, returning original columns`), a;
    const { enums: o, scene: u, applyStrategies: c, mergeMode: g = !0, columnStrategies: l } = t || {}, m = u || i.scene || It[r], d = Ft({
      columns: a,
      enums: o,
      scene: m,
      applyStrategies: c,
      mergeMode: g,
      columnStrategies: l
    });
    return i.transform(d);
  },
  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames() {
    return Array.from(G.keys());
  },
  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    G.clear();
  }
}, kt = {
  name: "proTable",
  scene: "table",
  transform: (r) => r.map((a) => {
    const t = { ...a };
    return "ellipsis" in t || (t.ellipsis = !0), "search" in t && t.search === !1 && (t.hideInSearch = !0, delete t.search), "hideInTable" in t && t.hideInTable && (t.hideInTable = !0), "defaultHidden" in t && t.defaultHidden && delete t.defaultHidden, t;
  })
}, At = {
  name: "proForm",
  scene: "form",
  transform: (r) => r.filter((a) => !a.hideInForm).map((a) => {
    const t = { ...a };
    if (delete t.hideInTable, delete t.ellipsis, delete t.copyable, delete t.sorter, delete t.search, delete t.hideInSearch, !t.name && t.dataIndex && (t.name = t.dataIndex), !t.width) {
      const i = t.valueType || "text";
      ["textarea"].includes(i) ? t.width = "xl" : ["dateRange", "dateTimeRange", "timeRange"].includes(i) ? t.width = "lg" : t.width = "md";
    }
    return t;
  })
}, Mt = {
  name: "proDescription",
  scene: "description",
  transform: (r) => r.filter((a) => !a.hideInDescriptions).map((a) => {
    const t = { ...a };
    if (delete t.hideInTable, delete t.sorter, delete t.filters, delete t.hideInForm, delete t.formItemProps, delete t.search, delete t.hideInSearch, delete t.fieldProps, !t.span) {
      const i = t.valueType || "text";
      ["textarea", "jsonCode", "code"].includes(i) ? t.span = 3 : t.span = 1;
    }
    return t;
  })
};
var ae = { exports: {} }, N = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ke;
function Wt() {
  if (ke) return N;
  ke = 1;
  var r = Me, a = Symbol.for("react.element"), t = Symbol.for("react.fragment"), i = Object.prototype.hasOwnProperty, o = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, u = { key: !0, ref: !0, __self: !0, __source: !0 };
  function c(g, l, m) {
    var d, v = {}, p = null, E = null;
    m !== void 0 && (p = "" + m), l.key !== void 0 && (p = "" + l.key), l.ref !== void 0 && (E = l.ref);
    for (d in l) i.call(l, d) && !u.hasOwnProperty(d) && (v[d] = l[d]);
    if (g && g.defaultProps) for (d in l = g.defaultProps, l) v[d] === void 0 && (v[d] = l[d]);
    return { $$typeof: a, type: g, key: p, ref: E, props: v, _owner: o.current };
  }
  return N.Fragment = t, N.jsx = c, N.jsxs = c, N;
}
var L = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ae;
function Yt() {
  return Ae || (Ae = 1, process.env.NODE_ENV !== "production" && function() {
    var r = Me, a = Symbol.for("react.element"), t = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), o = Symbol.for("react.strict_mode"), u = Symbol.for("react.profiler"), c = Symbol.for("react.provider"), g = Symbol.for("react.context"), l = Symbol.for("react.forward_ref"), m = Symbol.for("react.suspense"), d = Symbol.for("react.suspense_list"), v = Symbol.for("react.memo"), p = Symbol.for("react.lazy"), E = Symbol.for("react.offscreen"), w = Symbol.iterator, se = "@@iterator";
    function J(e) {
      if (e === null || typeof e != "object")
        return null;
      var n = w && e[w] || e[se];
      return typeof n == "function" ? n : null;
    }
    var A = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function _(e) {
      {
        for (var n = arguments.length, s = new Array(n > 1 ? n - 1 : 0), f = 1; f < n; f++)
          s[f - 1] = arguments[f];
        Ye("error", e, s);
      }
    }
    function Ye(e, n, s) {
      {
        var f = A.ReactDebugCurrentFrame, b = f.getStackAddendum();
        b !== "" && (n += "%s", s = s.concat([b]));
        var T = s.map(function(y) {
          return String(y);
        });
        T.unshift("Warning: " + n), Function.prototype.apply.call(console[e], console, T);
      }
    }
    var $e = !1, Ve = !1, Ne = !1, Le = !1, Ue = !1, ue;
    ue = Symbol.for("react.module.reference");
    function Ke(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === i || e === u || Ue || e === o || e === m || e === d || Le || e === E || $e || Ve || Ne || typeof e == "object" && e !== null && (e.$$typeof === p || e.$$typeof === v || e.$$typeof === c || e.$$typeof === g || e.$$typeof === l || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === ue || e.getModuleId !== void 0));
    }
    function qe(e, n, s) {
      var f = e.displayName;
      if (f)
        return f;
      var b = n.displayName || n.name || "";
      return b !== "" ? s + "(" + b + ")" : s;
    }
    function le(e) {
      return e.displayName || "Context";
    }
    function D(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && _("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case i:
          return "Fragment";
        case t:
          return "Portal";
        case u:
          return "Profiler";
        case o:
          return "StrictMode";
        case m:
          return "Suspense";
        case d:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case g:
            var n = e;
            return le(n) + ".Consumer";
          case c:
            var s = e;
            return le(s._context) + ".Provider";
          case l:
            return qe(e, e.render, "ForwardRef");
          case v:
            var f = e.displayName || null;
            return f !== null ? f : D(e.type) || "Memo";
          case p: {
            var b = e, T = b._payload, y = b._init;
            try {
              return D(y(T));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var I = Object.assign, $ = 0, ce, fe, de, pe, me, ge, ve;
    function he() {
    }
    he.__reactDisabledLog = !0;
    function Be() {
      {
        if ($ === 0) {
          ce = console.log, fe = console.info, de = console.warn, pe = console.error, me = console.group, ge = console.groupCollapsed, ve = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: he,
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
        $++;
      }
    }
    function He() {
      {
        if ($--, $ === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: I({}, e, {
              value: ce
            }),
            info: I({}, e, {
              value: fe
            }),
            warn: I({}, e, {
              value: de
            }),
            error: I({}, e, {
              value: pe
            }),
            group: I({}, e, {
              value: me
            }),
            groupCollapsed: I({}, e, {
              value: ge
            }),
            groupEnd: I({}, e, {
              value: ve
            })
          });
        }
        $ < 0 && _("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var z = A.ReactCurrentDispatcher, X;
    function U(e, n, s) {
      {
        if (X === void 0)
          try {
            throw Error();
          } catch (b) {
            var f = b.stack.trim().match(/\n( *(at )?)/);
            X = f && f[1] || "";
          }
        return `
` + X + e;
      }
    }
    var Z = !1, K;
    {
      var Ge = typeof WeakMap == "function" ? WeakMap : Map;
      K = new Ge();
    }
    function ye(e, n) {
      if (!e || Z)
        return "";
      {
        var s = K.get(e);
        if (s !== void 0)
          return s;
      }
      var f;
      Z = !0;
      var b = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var T;
      T = z.current, z.current = null, Be();
      try {
        if (n) {
          var y = function() {
            throw Error();
          };
          if (Object.defineProperty(y.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(y, []);
            } catch (C) {
              f = C;
            }
            Reflect.construct(e, [], y);
          } else {
            try {
              y.call();
            } catch (C) {
              f = C;
            }
            e.call(y.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (C) {
            f = C;
          }
          e();
        }
      } catch (C) {
        if (C && f && typeof C.stack == "string") {
          for (var h = C.stack.split(`
`), P = f.stack.split(`
`), x = h.length - 1, S = P.length - 1; x >= 1 && S >= 0 && h[x] !== P[S]; )
            S--;
          for (; x >= 1 && S >= 0; x--, S--)
            if (h[x] !== P[S]) {
              if (x !== 1 || S !== 1)
                do
                  if (x--, S--, S < 0 || h[x] !== P[S]) {
                    var j = `
` + h[x].replace(" at new ", " at ");
                    return e.displayName && j.includes("<anonymous>") && (j = j.replace("<anonymous>", e.displayName)), typeof e == "function" && K.set(e, j), j;
                  }
                while (x >= 1 && S >= 0);
              break;
            }
        }
      } finally {
        Z = !1, z.current = T, He(), Error.prepareStackTrace = b;
      }
      var W = e ? e.displayName || e.name : "", k = W ? U(W) : "";
      return typeof e == "function" && K.set(e, k), k;
    }
    function Je(e, n, s) {
      return ye(e, !1);
    }
    function ze(e) {
      var n = e.prototype;
      return !!(n && n.isReactComponent);
    }
    function q(e, n, s) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return ye(e, ze(e));
      if (typeof e == "string")
        return U(e);
      switch (e) {
        case m:
          return U("Suspense");
        case d:
          return U("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case l:
            return Je(e.render);
          case v:
            return q(e.type, n, s);
          case p: {
            var f = e, b = f._payload, T = f._init;
            try {
              return q(T(b), n, s);
            } catch {
            }
          }
        }
      return "";
    }
    var V = Object.prototype.hasOwnProperty, be = {}, Te = A.ReactDebugCurrentFrame;
    function B(e) {
      if (e) {
        var n = e._owner, s = q(e.type, e._source, n ? n.type : null);
        Te.setExtraStackFrame(s);
      } else
        Te.setExtraStackFrame(null);
    }
    function Xe(e, n, s, f, b) {
      {
        var T = Function.call.bind(V);
        for (var y in e)
          if (T(e, y)) {
            var h = void 0;
            try {
              if (typeof e[y] != "function") {
                var P = Error((f || "React class") + ": " + s + " type `" + y + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[y] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw P.name = "Invariant Violation", P;
              }
              h = e[y](n, y, f, s, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (x) {
              h = x;
            }
            h && !(h instanceof Error) && (B(b), _("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", f || "React class", s, y, typeof h), B(null)), h instanceof Error && !(h.message in be) && (be[h.message] = !0, B(b), _("Failed %s type: %s", s, h.message), B(null));
          }
      }
    }
    var Ze = Array.isArray;
    function Q(e) {
      return Ze(e);
    }
    function Qe(e) {
      {
        var n = typeof Symbol == "function" && Symbol.toStringTag, s = n && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return s;
      }
    }
    function et(e) {
      try {
        return Re(e), !1;
      } catch {
        return !0;
      }
    }
    function Re(e) {
      return "" + e;
    }
    function Ee(e) {
      if (et(e))
        return _("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Qe(e)), Re(e);
    }
    var xe = A.ReactCurrentOwner, tt = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Se, _e;
    function rt(e) {
      if (V.call(e, "ref")) {
        var n = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function nt(e) {
      if (V.call(e, "key")) {
        var n = Object.getOwnPropertyDescriptor(e, "key").get;
        if (n && n.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function at(e, n) {
      typeof e.ref == "string" && xe.current;
    }
    function it(e, n) {
      {
        var s = function() {
          Se || (Se = !0, _("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        s.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: s,
          configurable: !0
        });
      }
    }
    function ot(e, n) {
      {
        var s = function() {
          _e || (_e = !0, _("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", n));
        };
        s.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: s,
          configurable: !0
        });
      }
    }
    var st = function(e, n, s, f, b, T, y) {
      var h = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: a,
        // Built-in properties that belong on the element
        type: e,
        key: n,
        ref: s,
        props: y,
        // Record the component responsible for creating this element.
        _owner: T
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
        value: f
      }), Object.defineProperty(h, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: b
      }), Object.freeze && (Object.freeze(h.props), Object.freeze(h)), h;
    };
    function ut(e, n, s, f, b) {
      {
        var T, y = {}, h = null, P = null;
        s !== void 0 && (Ee(s), h = "" + s), nt(n) && (Ee(n.key), h = "" + n.key), rt(n) && (P = n.ref, at(n, b));
        for (T in n)
          V.call(n, T) && !tt.hasOwnProperty(T) && (y[T] = n[T]);
        if (e && e.defaultProps) {
          var x = e.defaultProps;
          for (T in x)
            y[T] === void 0 && (y[T] = x[T]);
        }
        if (h || P) {
          var S = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          h && it(y, S), P && ot(y, S);
        }
        return st(e, h, P, b, f, xe.current, y);
      }
    }
    var ee = A.ReactCurrentOwner, Pe = A.ReactDebugCurrentFrame;
    function M(e) {
      if (e) {
        var n = e._owner, s = q(e.type, e._source, n ? n.type : null);
        Pe.setExtraStackFrame(s);
      } else
        Pe.setExtraStackFrame(null);
    }
    var te;
    te = !1;
    function re(e) {
      return typeof e == "object" && e !== null && e.$$typeof === a;
    }
    function we() {
      {
        if (ee.current) {
          var e = D(ee.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function lt(e) {
      return "";
    }
    var Ce = {};
    function ct(e) {
      {
        var n = we();
        if (!n) {
          var s = typeof e == "string" ? e : e.displayName || e.name;
          s && (n = `

Check the top-level render call using <` + s + ">.");
        }
        return n;
      }
    }
    function Oe(e, n) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var s = ct(n);
        if (Ce[s])
          return;
        Ce[s] = !0;
        var f = "";
        e && e._owner && e._owner !== ee.current && (f = " It was passed a child from " + D(e._owner.type) + "."), M(e), _('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', s, f), M(null);
      }
    }
    function je(e, n) {
      {
        if (typeof e != "object")
          return;
        if (Q(e))
          for (var s = 0; s < e.length; s++) {
            var f = e[s];
            re(f) && Oe(f, n);
          }
        else if (re(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var b = J(e);
          if (typeof b == "function" && b !== e.entries)
            for (var T = b.call(e), y; !(y = T.next()).done; )
              re(y.value) && Oe(y.value, n);
        }
      }
    }
    function ft(e) {
      {
        var n = e.type;
        if (n == null || typeof n == "string")
          return;
        var s;
        if (typeof n == "function")
          s = n.propTypes;
        else if (typeof n == "object" && (n.$$typeof === l || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        n.$$typeof === v))
          s = n.propTypes;
        else
          return;
        if (s) {
          var f = D(n);
          Xe(s, e.props, "prop", f, e);
        } else if (n.PropTypes !== void 0 && !te) {
          te = !0;
          var b = D(n);
          _("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", b || "Unknown");
        }
        typeof n.getDefaultProps == "function" && !n.getDefaultProps.isReactClassApproved && _("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function dt(e) {
      {
        for (var n = Object.keys(e.props), s = 0; s < n.length; s++) {
          var f = n[s];
          if (f !== "children" && f !== "key") {
            M(e), _("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", f), M(null);
            break;
          }
        }
        e.ref !== null && (M(e), _("Invalid attribute `ref` supplied to `React.Fragment`."), M(null));
      }
    }
    var De = {};
    function Fe(e, n, s, f, b, T) {
      {
        var y = Ke(e);
        if (!y) {
          var h = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (h += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var P = lt();
          P ? h += P : h += we();
          var x;
          e === null ? x = "null" : Q(e) ? x = "array" : e !== void 0 && e.$$typeof === a ? (x = "<" + (D(e.type) || "Unknown") + " />", h = " Did you accidentally export a JSX literal instead of a component?") : x = typeof e, _("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", x, h);
        }
        var S = ut(e, n, s, b, T);
        if (S == null)
          return S;
        if (y) {
          var j = n.children;
          if (j !== void 0)
            if (f)
              if (Q(j)) {
                for (var W = 0; W < j.length; W++)
                  je(j[W], e);
                Object.freeze && Object.freeze(j);
              } else
                _("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              je(j, e);
        }
        if (V.call(n, "key")) {
          var k = D(e), C = Object.keys(n).filter(function(yt) {
            return yt !== "key";
          }), ne = C.length > 0 ? "{key: someKey, " + C.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!De[k + ne]) {
            var ht = C.length > 0 ? "{" + C.join(": ..., ") + ": ...}" : "{}";
            _(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, ne, k, ht, k), De[k + ne] = !0;
          }
        }
        return e === i ? dt(S) : ft(S), S;
      }
    }
    function pt(e, n, s) {
      return Fe(e, n, s, !0);
    }
    function mt(e, n, s) {
      return Fe(e, n, s, !1);
    }
    var gt = mt, vt = pt;
    L.Fragment = i, L.jsx = gt, L.jsxs = vt;
  }()), L;
}
process.env.NODE_ENV === "production" ? ae.exports = Wt() : ae.exports = Yt();
var oe = ae.exports;
function zt(r) {
  const {
    columns: a,
    enums: t,
    applyStrategies: i,
    mergeMode: o,
    columnStrategies: u,
    ...c
  } = r;
  return /* @__PURE__ */ oe.jsx(
    bt,
    {
      columns: Y.transform("proTable", a, {
        enums: t,
        applyStrategies: i,
        mergeMode: o,
        columnStrategies: u
      }),
      ...c
    }
  );
}
function Xt(r) {
  const {
    columns: a,
    enums: t,
    applyStrategies: i,
    mergeMode: o,
    columnStrategies: u,
    ...c
  } = r;
  return /* @__PURE__ */ oe.jsx(
    Tt,
    {
      columns: Y.transform("proForm", a, {
        enums: t,
        applyStrategies: i,
        mergeMode: o,
        columnStrategies: u
      }),
      ...c
    }
  );
}
function Zt(r) {
  const {
    columns: a,
    enums: t,
    applyStrategies: i,
    mergeMode: o,
    columnStrategies: u,
    ...c
  } = r;
  return /* @__PURE__ */ oe.jsx(
    Rt,
    {
      columns: Y.transform("proDescription", a, {
        enums: t,
        applyStrategies: i,
        mergeMode: o,
        columnStrategies: u
      }),
      ...c
    }
  );
}
Y.register(kt);
Y.register(At);
Y.register(Mt);
export {
  Ft as Columns,
  Y as Component,
  Gt as DefaultValue,
  Bt as Format,
  qt as Placeholder,
  Zt as ProColumnsDescription,
  Xt as ProColumnsForm,
  zt as ProColumnsTable,
  Kt as Required,
  Lt as Search,
  Ut as Sort,
  Ht as Tooltip,
  Jt as Width,
  F as createStrategy,
  We as deepMerge,
  Ie as generatePlaceholder,
  R as getField,
  Et as getFieldType,
  O as hasField,
  Nt as setField
};
//# sourceMappingURL=pro-columns.mjs.map
