import React from "react";
import { Space, Image as Image$1, Badge, Tag } from "antd";
import { ProTable, BetaSchemaForm, ProDescriptions } from "@ant-design/pro-components";
function deepMerge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = result[key];
    if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue) && targetValue && typeof targetValue === "object" && !Array.isArray(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue;
    }
  });
  return result;
}
function hasField(column, field) {
  return field in column && column[field] !== void 0;
}
function getField(column, field, defaultValue) {
  return hasField(column, field) ? column[field] : defaultValue;
}
function setField(column, field, value) {
  return {
    ...column,
    [field]: value
  };
}
function getFieldType(column) {
  if (hasField(column, "valueType")) {
    return getField(column, "valueType", "text") || "text";
  }
  if (hasField(column, "valueEnum")) return "select";
  if (hasField(column, "fieldProps")) {
    const fieldProps = getField(column, "fieldProps");
    if ((fieldProps == null ? void 0 : fieldProps.mode) === "multiple") return "select";
    if ((fieldProps == null ? void 0 : fieldProps.type) === "password") return "password";
  }
  return "text";
}
function generatePlaceholder(column, action = "input") {
  const title = getField(column, "title", "字段");
  const fieldType = getFieldType(column);
  const actionText = {
    search: "搜索",
    input: "请输入",
    select: "请选择"
  };
  let defaultAction = action;
  if (["select", "radio", "checkbox", "dateRange", "timeRange"].includes(fieldType)) {
    defaultAction = "select";
  }
  return `${actionText[defaultAction]}${title}`;
}
function createStrategy(fn) {
  return (column, scene) => {
    const updates = fn(column, scene);
    return deepMerge(column, updates);
  };
}
const Search = (options = {}) => {
  const { enable = true, searchTypeMap = {} } = options;
  const defaultSearchTypeMap = {
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
    ...searchTypeMap
  };
  return createStrategy((column) => {
    if (!enable || hasField(column, "search") && !getField(column, "search")) {
      return { search: false };
    }
    if (hasField(column, "search") && typeof getField(column, "search") === "object") {
      return {};
    }
    const valueType = getField(column, "valueType", "text") || "text";
    const searchType = defaultSearchTypeMap[valueType] || "text";
    return {
      search: true,
      // 在 fieldProps 中设置搜索相关属性（如果需要）
      fieldProps: {
        ...getField(column, "fieldProps", {})
      },
      // 某些组件可能需要 searchType
      ...searchType !== "text" ? { searchType } : {}
    };
  });
};
const Sort = (options = {}) => {
  const { enable = true, defaultSorter = false } = options;
  return createStrategy((column) => {
    if (!enable || hasField(column, "sorter") && getField(column, "sorter") === false) {
      return { sorter: false };
    }
    if (hasField(column, "sorter") && typeof getField(column, "sorter") === "function") {
      return {};
    }
    const dataIndex = getField(column, "dataIndex");
    if (!dataIndex) {
      return {};
    }
    const valueType = getField(column, "valueType", "text") || "text";
    let sorter = true;
    if (["digit", "money", "percent"].includes(valueType)) {
      sorter = (a, b) => {
        const aVal = a[dataIndex] || 0;
        const bVal = b[dataIndex] || 0;
        return aVal - bVal;
      };
    } else if (["date", "dateTime", "time"].includes(valueType)) {
      sorter = (a, b) => {
        const aVal = new Date(a[dataIndex] || 0).getTime();
        const bVal = new Date(b[dataIndex] || 0).getTime();
        return aVal - bVal;
      };
    } else if (valueType === "text") {
      sorter = (a, b) => {
        const aVal = String(a[dataIndex] || "");
        const bVal = String(b[dataIndex] || "");
        return aVal.localeCompare(bVal);
      };
    }
    return {
      sorter,
      ...defaultSorter ? { defaultSortOrder: defaultSorter } : {}
    };
  });
};
const Required = (options = {}) => {
  const { enable = true, messageTemplate } = options;
  const defaultMessageTemplate = (title) => `请输入${title}`;
  return createStrategy((column) => {
    if (!enable) {
      return {};
    }
    const existingRules = getField(column, "formItemProps.rules", []) || [];
    const hasRequiredRule = existingRules.some((rule) => rule.required);
    if (hasRequiredRule) {
      return {};
    }
    const dataIndex = getField(column, "dataIndex");
    if (!dataIndex) {
      return {};
    }
    const title = getField(column, "title", "此字段") || "此字段";
    const message = typeof messageTemplate === "function" ? messageTemplate(title) : messageTemplate || defaultMessageTemplate(title);
    const valueType = getField(column, "valueType", "text") || "text";
    const isSelectType = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      valueType
    );
    const finalMessage = isSelectType ? message.replace("输入", "选择") : message;
    return {
      formItemProps: {
        ...getField(column, "formItemProps", {}),
        rules: [
          ...existingRules,
          {
            required: true,
            message: finalMessage
          }
        ]
      }
    };
  });
};
const Placeholder = (options = {}) => {
  const { enable = true, template, includeSearch = true } = options;
  return createStrategy((column) => {
    if (!enable) {
      return {};
    }
    const existingFieldProps = getField(column, "fieldProps", {});
    if (existingFieldProps.placeholder) {
      return {};
    }
    const valueType = getField(column, "valueType", "text") || "text";
    const isSelectType = ["select", "radio", "checkbox", "dateRange", "timeRange"].includes(
      valueType
    );
    const action = isSelectType ? "select" : "input";
    const placeholder = template ? template(column, action) : generatePlaceholder(column, action);
    const updates = {
      fieldProps: {
        ...existingFieldProps,
        placeholder
      }
    };
    if (includeSearch && hasField(column, "search")) {
      const searchValue = getField(column, "search");
      if (searchValue === true || typeof searchValue === "object" && searchValue !== null) {
        const searchPlaceholder = template ? template(column, "search") : generatePlaceholder(column, "search");
        updates.fieldProps.placeholder = searchPlaceholder;
      }
    }
    return updates;
  });
};
function formatNumber(value, precision, useGrouping = true) {
  if (value === null || value === void 0 || isNaN(value)) return "-";
  const options = {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    useGrouping
  };
  return new Intl.NumberFormat("zh-CN", options).format(value);
}
function formatMoney(value, precision = 2, symbol = "¥", useGrouping = true) {
  if (value === null || value === void 0 || isNaN(value)) return "-";
  const formattedNumber = formatNumber(value, precision, useGrouping);
  return `${symbol}${formattedNumber}`;
}
function formatPercent(value, precision = 2) {
  if (value === null || value === void 0 || isNaN(value)) return "-";
  return `${formatNumber(value, precision, false)}%`;
}
function formatDate(value, format = "YYYY-MM-DD") {
  if (!value) return "-";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return format.replace("YYYY", String(year)).replace("MM", month).replace("DD", day).replace("HH", hours).replace("mm", minutes).replace("ss", seconds);
}
const Format = (options = {}) => {
  const {
    enable = true,
    type,
    precision,
    symbol = "¥",
    useGrouping = true,
    dateFormat = "YYYY-MM-DD",
    formatter
  } = options;
  return createStrategy((column) => {
    if (!enable) {
      return {};
    }
    if (hasField(column, "render") && !formatter) {
      return {};
    }
    const valueType = getField(column, "valueType", "text") || "text";
    let formatType = type;
    if (!formatType) {
      if (valueType === "money") formatType = "money";
      else if (valueType === "digit") formatType = "number";
      else if (["date", "dateTime"].includes(valueType)) formatType = "date";
      else if (valueType === "percent") formatType = "percent";
    }
    if (!formatType && !formatter) {
      return {};
    }
    let renderFunction;
    if (formatter) {
      renderFunction = (text, record) => formatter(text, record);
    } else if (formatType === "money") {
      renderFunction = (text) => formatMoney(text, precision, symbol, useGrouping);
    } else if (formatType === "number") {
      renderFunction = (text) => formatNumber(text, precision, useGrouping);
    } else if (formatType === "percent") {
      renderFunction = (text) => formatPercent(text, precision);
    } else if (formatType === "date") {
      renderFunction = (text) => {
        const format = valueType === "dateTime" ? "YYYY-MM-DD HH:mm:ss" : dateFormat;
        return formatDate(text, format);
      };
    }
    if (!renderFunction) {
      return {};
    }
    return {
      render: renderFunction
    };
  });
};
const Tooltip = (options = {}) => {
  const {
    enable = true,
    content,
    formType = "tooltip",
    showInTable = true,
    showInForm = true
  } = options;
  return createStrategy((column) => {
    if (!enable) {
      return {};
    }
    const tooltipContent = typeof content === "function" ? content(column) : content;
    if (!tooltipContent) {
      return {};
    }
    const updates = {};
    if (showInTable) {
      if (!hasField(column, "tooltip")) {
        updates.tooltip = tooltipContent;
      }
    }
    if (showInForm) {
      const existingFormItemProps = getField(column, "formItemProps", {});
      if (formType === "tooltip") {
        if (!existingFormItemProps.tooltip) {
          updates.formItemProps = {
            ...existingFormItemProps,
            tooltip: tooltipContent
          };
        }
      } else {
        if (!existingFormItemProps.extra) {
          updates.formItemProps = {
            ...existingFormItemProps,
            extra: tooltipContent
          };
        }
      }
    }
    return updates;
  });
};
function inferDefaultValue(column) {
  const valueType = getField(column, "valueType", "text");
  switch (valueType) {
    case "digit":
    case "money":
    case "percent":
      return 0;
    case "switch":
      return false;
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
      const valueEnum = getField(column, "valueEnum");
      if (valueEnum && typeof valueEnum === "object") {
        const firstKey = Object.keys(valueEnum)[0];
        return firstKey || null;
      }
      return null;
    case "textarea":
    case "text":
    case "password":
    default:
      return "";
  }
}
const DefaultValue = (options = {}) => {
  const { enable = true, value, autoInfer = false } = options;
  return createStrategy((column) => {
    if (!enable) {
      return {};
    }
    if (hasField(column, "initialValue")) {
      return {};
    }
    let defaultValue;
    if (value !== void 0) {
      defaultValue = typeof value === "function" ? value() : value;
    } else if (autoInfer) {
      defaultValue = inferDefaultValue(column);
    } else {
      return {};
    }
    return {
      initialValue: defaultValue
    };
  });
};
function inferWidthByType(column) {
  const valueType = getField(column, "valueType", "text") || "text";
  const widthMap = {
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
  };
  return widthMap[valueType];
}
function calculateWidthByTitle(column, charWidth, padding) {
  const title = getField(column, "title", "");
  if (!title) return 0;
  let chineseCount = 0;
  let englishCount = 0;
  for (const char of title) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      chineseCount++;
    } else {
      englishCount++;
    }
  }
  const totalWidth = chineseCount * charWidth + englishCount * (charWidth * 0.6) + padding;
  return Math.ceil(totalWidth);
}
function calculateNumberWidth(column, config) {
  const { value, auto, min, max, charWidth = 14, padding = 48 } = config;
  let calculatedWidth;
  if (value !== void 0) {
    calculatedWidth = value;
  } else if (auto) {
    const typeWidth = inferWidthByType(column);
    if (typeWidth) {
      calculatedWidth = typeWidth;
    } else {
      const titleWidth = calculateWidthByTitle(column, charWidth, padding);
      if (titleWidth > 0) {
        calculatedWidth = titleWidth;
      }
    }
  }
  if (calculatedWidth !== void 0) {
    if (min !== void 0 && calculatedWidth < min) {
      calculatedWidth = min;
    }
    if (max !== void 0 && calculatedWidth > max) {
      calculatedWidth = max;
    }
  }
  return calculatedWidth;
}
const Width = (options = {}) => {
  const {
    enable = true,
    value,
    auto = false,
    min,
    max,
    charWidth = 14,
    padding = 48,
    table,
    form,
    description
  } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    if (hasField(column, "width")) {
      return {};
    }
    if (scene === "table") {
      if (table === null) {
        return {};
      }
      let tableWidth;
      if (typeof table === "number") {
        tableWidth = table;
      } else if (table && typeof table === "object") {
        tableWidth = calculateNumberWidth(column, {
          ...table,
          charWidth,
          padding
        });
      } else {
        tableWidth = calculateNumberWidth(column, {
          value,
          auto,
          min,
          max,
          charWidth,
          padding
        });
      }
      return tableWidth !== void 0 ? { width: tableWidth } : {};
    } else if (scene === "form") {
      if (form === null) {
        return {};
      }
      if (form && ["sm", "md", "lg", "xl"].includes(form)) {
        return { width: form };
      }
      return {};
    } else if (scene === "description") {
      if (description === null) {
        return {};
      }
      if (typeof description === "number") {
        return { width: description };
      }
      const descWidth = calculateNumberWidth(column, {
        value,
        auto,
        min,
        max,
        charWidth,
        padding
      });
      return descWidth !== void 0 ? { width: descWidth } : {};
    }
    const calculatedWidth = calculateNumberWidth(column, {
      value,
      auto,
      min,
      max,
      charWidth,
      padding
    });
    return calculatedWidth !== void 0 ? { width: calculatedWidth } : {};
  });
};
const Copy = (options = {}) => {
  const { enable = true, tooltipText = "复制", successText = "复制成功" } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    if (scene === "form") {
      return {};
    }
    if (hasField(column, "copyable")) {
      return {};
    }
    return {
      copyable: {
        text: (text) => text ? String(text) : "",
        tooltips: [tooltipText, successText]
      }
    };
  });
};
const Link = (options = {}) => {
  const { enable = true, href, target = "_blank", onClick, text } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    if (scene === "form") {
      return {};
    }
    if (hasField(column, "render") && !href && !onClick) {
      return {};
    }
    const renderFunction = (value, record) => {
      const displayText = text ? typeof text === "function" ? text(value, record) : text : value || "-";
      if (onClick) {
        return React.createElement(
          "a",
          {
            style: { cursor: "pointer" },
            onClick: (e) => {
              e.preventDefault();
              onClick(value, record, e);
            }
          },
          displayText
        );
      }
      const linkHref = href ? typeof href === "function" ? href(value, record) : href : value;
      if (!linkHref) {
        return displayText;
      }
      return React.createElement(
        "a",
        {
          href: linkHref,
          target,
          rel: target === "_blank" ? "noopener noreferrer" : void 0
        },
        displayText
      );
    };
    return {
      render: renderFunction
    };
  });
};
const Image = (options = {}) => {
  const {
    enable = true,
    width = 60,
    height = 60,
    preview = true,
    fallback = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7lm77niYc8L3RleHQ+PC9zdmc+",
    separator = ",",
    maxCount = 5
  } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    if (scene === "form") {
      return {};
    }
    if (hasField(column, "render")) {
      return {};
    }
    const renderFunction = (value) => {
      if (!value) {
        return "-";
      }
      let imageUrls = [];
      if (typeof value === "string") {
        imageUrls = value.split(separator).filter((url) => url.trim());
      } else if (Array.isArray(value)) {
        imageUrls = value;
      } else {
        imageUrls = [String(value)];
      }
      const displayUrls = imageUrls.slice(0, maxCount);
      const hasMore = imageUrls.length > maxCount;
      return React.createElement(
        Space,
        { size: 8 },
        ...displayUrls.map(
          (url, index) => React.createElement(Image$1, {
            key: index,
            src: url,
            width,
            height,
            preview: preview ? {
              src: url
            } : false,
            fallback,
            style: { objectFit: "cover" }
          })
        ),
        hasMore && React.createElement(
          "span",
          { style: { color: "#999", fontSize: "12px" } },
          `+${imageUrls.length - maxCount}`
        )
      );
    };
    return {
      render: renderFunction
    };
  });
};
const Enum = (options = {}) => {
  const { enable = true, type = "badge", colorMap = {}, defaultColor = "default" } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    if (scene === "form") {
      return {};
    }
    if (!hasField(column, "valueEnum") && !hasField(column, "enumKey")) {
      return {};
    }
    if (hasField(column, "render")) {
      return {};
    }
    if (type === "text") {
      return {};
    }
    const renderFunction = (value) => {
      if (value === null || value === void 0) {
        return "-";
      }
      const valueEnum = getField(column, "valueEnum", {}) || {};
      const enumItem = valueEnum[value];
      if (!enumItem) {
        return value;
      }
      const text = enumItem.text || enumItem.label || value;
      const status = enumItem.status || colorMap[value] || defaultColor;
      if (type === "badge") {
        return React.createElement(Badge, {
          status,
          text
        });
      }
      if (type === "tag") {
        return React.createElement(Tag, { color: status }, text);
      }
      return text;
    };
    return {
      render: renderFunction
    };
  });
};
const Validation = (options = {}) => {
  const {
    enable = true,
    pattern,
    patternMessage = "格式不正确",
    min,
    minMessage,
    max,
    maxMessage,
    minLength,
    minLengthMessage,
    maxLength,
    maxLengthMessage,
    validator,
    dependencies
  } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    if (scene !== "form") {
      return {};
    }
    const existingRules = getField(
      column,
      "formItemProps.rules",
      getField(column, "rules", [])
    ) || [];
    const newRules = [];
    if (pattern) {
      newRules.push({
        pattern,
        message: patternMessage
      });
    }
    if (min !== void 0) {
      newRules.push({
        type: "number",
        min,
        message: minMessage || `最小值为 ${min}`
      });
    }
    if (max !== void 0) {
      newRules.push({
        type: "number",
        max,
        message: maxMessage || `最大值为 ${max}`
      });
    }
    if (minLength !== void 0) {
      newRules.push({
        min: minLength,
        message: minLengthMessage || `最少输入 ${minLength} 个字符`
      });
    }
    if (maxLength !== void 0) {
      newRules.push({
        max: maxLength,
        message: maxLengthMessage || `最多输入 ${maxLength} 个字符`
      });
    }
    if (validator) {
      newRules.push({
        validator
      });
    }
    const allRules = [...existingRules, ...newRules];
    const result = {};
    if (allRules.length > 0) {
      result.formItemProps = {
        ...getField(column, "formItemProps", {}),
        rules: allRules
      };
    }
    if (dependencies && dependencies.length > 0) {
      result.formItemProps = {
        ...result.formItemProps,
        dependencies
      };
    }
    return result;
  });
};
function defaultPermissionChecker(context) {
  const { roles, permissions, userRoles = [], userPermissions = [] } = context;
  if ((!roles || roles.length === 0) && (!permissions || permissions.length === 0)) {
    return true;
  }
  if (roles && roles.length > 0) {
    const hasRole = roles.some((role) => userRoles.includes(role));
    if (hasRole) return true;
  }
  if (permissions && permissions.length > 0) {
    const hasPermission = permissions.some((permission) => userPermissions.includes(permission));
    if (hasPermission) return true;
  }
  return false;
}
const Permission = (options = {}) => {
  const {
    enable = true,
    roles,
    permissions,
    userRoles,
    userPermissions,
    hideWhenNoPermission = true,
    disableWhenNoPermission = false,
    checker
  } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    const hasPermission = checker ? checker({ roles, permissions, userRoles, userPermissions }) : defaultPermissionChecker({ roles, permissions, userRoles, userPermissions });
    if (hasPermission) {
      return {};
    }
    const result = {};
    if (hideWhenNoPermission) {
      if (scene === "table") {
        result.hideInTable = true;
      } else if (scene === "form") {
        result.hideInForm = true;
      } else if (scene === "description") {
        result.hideInDescriptions = true;
      }
    }
    if (disableWhenNoPermission && scene === "form" && !hideWhenNoPermission) {
      result.fieldProps = {
        disabled: true
      };
      result.editable = false;
    }
    return result;
  });
};
const Transform = (options = {}) => {
  const { enable = true, input, output, display } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    const result = {};
    if ((scene === "table" || scene === "description") && display) {
      if (!hasField(column, "render")) {
        result.render = (value, record) => {
          const transformed = display(value, record);
          return transformed ?? value ?? "-";
        };
      }
    }
    if (scene === "form") {
      const existingFieldProps = getField(column, "fieldProps", {});
      const existingConvertValue = getField(column, "convertValue");
      const existingTransform = getField(column, "transform");
      if (input) {
        result.fieldProps = {
          ...existingFieldProps,
          // 保留原有的 getValueFromEvent，如果有的话
          ...existingFieldProps.getValueFromEvent ? {
            getValueFromEvent: (...args) => {
              const originalValue = existingFieldProps.getValueFromEvent(...args);
              return input(originalValue);
            }
          } : {
            getValueFromEvent: (value) => input(value)
          }
        };
      }
      if (output) {
        if (!existingConvertValue) {
          result.convertValue = (value, record) => output(value, record);
        }
        if (!existingTransform) {
          result.transform = (value) => output(value);
        }
      }
    }
    return result;
  });
};
const Editable = (options = {}) => {
  const { enable = true, type, editableConfig = {} } = options;
  return createStrategy((column, scene) => {
    if (!enable) {
      return {};
    }
    if (scene !== "table") {
      return {};
    }
    if (hasField(column, "editable")) {
      return {};
    }
    const valueType = type || getField(column, "valueType", "text");
    const editableOptions = {
      type: valueType
    };
    if (editableConfig.onSave) {
      editableOptions.onSave = async (key, record, originRow, newLineConfig) => {
        const dataIndex = getField(column, "dataIndex");
        const newValue = dataIndex ? record[dataIndex] : void 0;
        return editableConfig.onSave(key, record, newValue);
      };
    }
    if (editableConfig.onCancel) {
      editableOptions.onCancel = (key, record) => {
        editableConfig.onCancel(key, record);
      };
    }
    if (editableConfig.formItemProps) {
      editableOptions.formItemProps = editableConfig.formItemProps;
    }
    if (editableConfig.fieldProps) {
      editableOptions.fieldProps = editableConfig.fieldProps;
    }
    return {
      editable: () => editableOptions
    };
  });
};
const isDevelopment$1 = () => {
  try {
    return process.env.NODE_ENV === "development";
  } catch {
    return false;
  }
};
const handleStrategyError = (error, context) => {
  var _a, _b;
  if (isDevelopment$1()) {
    console.error("[ProColumns Strategy Error]", {
      message: error.message,
      column: ((_a = context.column) == null ? void 0 : _a.dataIndex) || ((_b = context.column) == null ? void 0 : _b.title) || "unknown",
      strategyIndex: context.strategyIndex,
      error
    });
  } else {
    console.error("[ProColumns] Strategy execution error:", error.message);
  }
};
const merge = (ori, cur) => {
  try {
    if (!ori.strategys || ori.strategys.length === 0) {
      return cur;
    }
    if (cur.mode === "replace") {
      return cur;
    } else {
      const mergedStrategies = [];
      ori.strategys.forEach((s) => {
        mergedStrategies.push(...s.strategy);
      });
      mergedStrategies.push(...cur.strategy);
      return {
        mode: "merge",
        strategy: mergedStrategies
      };
    }
  } catch (error) {
    if (isDevelopment$1()) {
      console.error("[ProColumns Strategy Merge Error]", {
        message: error.message,
        column: ori.dataIndex || ori.title || "unknown",
        error
      });
    }
    return cur;
  }
};
const execute = (column, strategys, scene) => {
  let result = { ...column };
  strategys.forEach((strategyConfig, configIndex) => {
    try {
      if (strategyConfig.scene) {
        const allowedScenes = Array.isArray(strategyConfig.scene) ? strategyConfig.scene : [strategyConfig.scene];
        if (scene && !allowedScenes.includes(scene)) {
          return;
        }
      }
      strategyConfig.strategy.forEach((strategyFn, fnIndex) => {
        try {
          const processed = strategyFn(result, scene);
          result = { ...result, ...processed };
        } catch (error) {
          handleStrategyError(error, {
            column: result,
            strategyIndex: configIndex * 1e3 + fnIndex
            // 组合索引便于定位
          });
        }
      });
    } catch (error) {
      handleStrategyError(error, {
        column: result,
        strategyIndex: configIndex
      });
    }
  });
  delete result.strategys;
  return result;
};
const Strategy = (columns, scene) => {
  try {
    const copyColumns = columns.map((column) => ({ ...column }));
    return copyColumns.map((column, index) => {
      try {
        if (column.strategys) {
          column.strategys = column.strategys.map((strategy) => {
            return merge(column, strategy);
          });
          return execute(column, column.strategys, scene);
        }
        return column;
      } catch (error) {
        if (isDevelopment$1()) {
          console.error("[ProColumns Strategy Processing Error]", {
            message: error.message,
            column: column.dataIndex || column.title || "unknown",
            columnIndex: index,
            error
          });
        } else {
          console.error("[ProColumns] Column processing error:", error.message);
        }
        const result = { ...column };
        delete result.strategys;
        return result;
      }
    });
  } catch (error) {
    if (isDevelopment$1()) {
      console.error("[ProColumns Strategy Error]", {
        message: error.message,
        error
      });
    } else {
      console.error("[ProColumns] Unexpected error:", error.message);
    }
    return columns.map((col) => {
      const result = { ...col };
      delete result.strategys;
      return result;
    });
  }
};
const Columns = (props) => {
  const {
    columns,
    enums = {},
    scene,
    applyStrategies,
    mergeMode = true,
    columnStrategies
  } = props;
  const hasGlobalStrategies = applyStrategies && applyStrategies.length > 0;
  const hasColumnStrategies = columnStrategies && columnStrategies.length > 0;
  const columnStrategyMap = hasColumnStrategies ? new Map(columnStrategies.map((cs) => [cs.dataIndex, cs])) : null;
  const processedColumns = columns.map((column) => {
    const processedColumn = { ...column };
    if ("enumKey" in processedColumn && processedColumn.enumKey) {
      const enumKey = processedColumn.enumKey;
      if (enums[enumKey]) {
        processedColumn.valueEnum = enums[enumKey];
      }
      delete processedColumn.enumKey;
    }
    if (hasGlobalStrategies) {
      const runtimeStrategyConfig = {
        mode: "merge",
        strategy: applyStrategies
      };
      if (mergeMode) {
        processedColumn.strategys = [...column.strategys || [], runtimeStrategyConfig];
      } else {
        processedColumn.strategys = [runtimeStrategyConfig];
      }
    }
    if (hasColumnStrategies && columnStrategyMap) {
      const columnStrategy = columnStrategyMap.get(processedColumn.dataIndex);
      if (columnStrategy) {
        const targetStrategyConfig = {
          mode: "merge",
          strategy: columnStrategy.strategies
        };
        const columnMergeMode = columnStrategy.mergeMode !== void 0 ? columnStrategy.mergeMode : true;
        if (columnMergeMode) {
          processedColumn.strategys = [...processedColumn.strategys || [], targetStrategyConfig];
        } else {
          processedColumn.strategys = [targetStrategyConfig];
        }
      }
    }
    return processedColumn;
  });
  return Strategy(processedColumns, scene);
};
const isDevelopment = () => {
  try {
    return process.env.NODE_ENV === "development";
  } catch {
    return false;
  }
};
const ErrorHandler = {
  /**
   * 记录警告信息
   */
  warn(message, context) {
    if (isDevelopment()) {
      console.warn(`[ProColumns Warning] ${message}`, context || "");
    } else {
      console.warn(`[ProColumns] ${message}`);
    }
  },
  /**
   * 记录错误信息
   */
  error(message, error) {
    if (isDevelopment()) {
      console.error(`[ProColumns Error] ${message}`, error || "");
      if (error == null ? void 0 : error.stack) {
        console.error("Stack trace:", error.stack);
      }
    } else {
      console.error(`[ProColumns] ${message}`);
    }
  }
};
const adapters = /* @__PURE__ */ new Map();
const sceneMap = {
  proTable: "table",
  proForm: "form",
  proDescription: "description"
};
const Component = {
  /**
   * 注册组件适配器
   * @param adapter 组件适配器
   */
  register(adapter) {
    adapters.set(adapter.name, adapter);
  },
  /**
   * 获取组件适配器
   * @param name 组件名称
   */
  getAdapter(name) {
    return adapters.get(name);
  },
  /**
   * 转换 columns 为指定组件的格式
   * @param name 组件名称
   * @param columns 原始 columns
   * @param options 配置选项
   */
  transform(name, columns, options) {
    try {
      if (!name) {
        ErrorHandler.error("Component name is required");
        return columns;
      }
      if (!Array.isArray(columns)) {
        ErrorHandler.error("Columns must be an array");
        return [];
      }
      const adapter = this.getAdapter(name);
      if (!adapter) {
        const availableAdapters = this.getAdapterNames();
        ErrorHandler.warn(
          `Component adapter "${name}" not found. Returning original columns.`,
          isDevelopment() ? {
            requestedAdapter: name,
            availableAdapters,
            suggestion: availableAdapters.length > 0 ? `Available adapters: ${availableAdapters.join(", ")}` : "No adapters registered. Did you forget to register the adapter?"
          } : void 0
        );
        return columns;
      }
      const { enums, scene, applyStrategies, mergeMode = true, columnStrategies } = options || {};
      const inferredScene = scene || adapter.scene || sceneMap[name];
      if (!inferredScene && isDevelopment()) {
        ErrorHandler.warn(
          `No scene specified for component "${name}". Some strategies may not work correctly.`,
          { adapter: name, providedScene: scene, fallbackScene: inferredScene }
        );
      }
      let processedColumns;
      try {
        processedColumns = Columns({
          columns,
          enums,
          scene: inferredScene,
          applyStrategies,
          mergeMode,
          columnStrategies
        });
      } catch (error) {
        ErrorHandler.error(
          "Error occurred while processing strategies. Falling back to original columns.",
          error
        );
        processedColumns = columns;
      }
      try {
        return adapter.transform(processedColumns);
      } catch (error) {
        ErrorHandler.error(
          `Error occurred in adapter "${name}" transform. Falling back to processed columns.`,
          error
        );
        return processedColumns;
      }
    } catch (error) {
      ErrorHandler.error("Unexpected error in Component.transform. Returning original columns.", error);
      return columns;
    }
  },
  /**
   * 获取所有已注册的适配器名称
   */
  getAdapterNames() {
    return Array.from(adapters.keys());
  },
  /**
   * 清空所有适配器（主要用于测试）
   */
  clear() {
    adapters.clear();
  }
};
const ProTableAdapter = {
  name: "proTable",
  scene: "table",
  transform: (columns) => {
    return columns.map((column) => {
      const tableColumn = { ...column };
      if (!("ellipsis" in tableColumn)) {
        tableColumn.ellipsis = true;
      }
      if ("search" in tableColumn && tableColumn.search === false) {
        tableColumn.hideInSearch = true;
        delete tableColumn.search;
      }
      if ("hideInTable" in tableColumn && tableColumn.hideInTable) {
        tableColumn.hideInTable = true;
      }
      if ("defaultHidden" in tableColumn && tableColumn.defaultHidden) {
        delete tableColumn.defaultHidden;
      }
      return tableColumn;
    });
  }
};
const ProFormAdapter = {
  name: "proForm",
  scene: "form",
  transform: (columns) => {
    return columns.filter((column) => !column.hideInForm).map((column) => {
      const formField = { ...column };
      delete formField.hideInTable;
      delete formField.ellipsis;
      delete formField.copyable;
      delete formField.sorter;
      delete formField.search;
      delete formField.hideInSearch;
      if (!formField.name && formField.dataIndex) {
        formField.name = formField.dataIndex;
      }
      if (!formField.width) {
        const valueType = formField.valueType || "text";
        if (["textarea"].includes(valueType)) {
          formField.width = "xl";
        } else if (["dateRange", "dateTimeRange", "timeRange"].includes(valueType)) {
          formField.width = "lg";
        } else {
          formField.width = "md";
        }
      }
      return formField;
    });
  }
};
const ProDescriptionAdapter = {
  name: "proDescription",
  scene: "description",
  transform: (columns) => {
    return columns.filter((column) => !column.hideInDescriptions).map((column) => {
      const descColumn = { ...column };
      delete descColumn.hideInTable;
      delete descColumn.sorter;
      delete descColumn.filters;
      delete descColumn.hideInForm;
      delete descColumn.formItemProps;
      delete descColumn.search;
      delete descColumn.hideInSearch;
      delete descColumn.fieldProps;
      if (!descColumn.span) {
        const valueType = descColumn.valueType || "text";
        if (["textarea", "jsonCode", "code"].includes(valueType)) {
          descColumn.span = 3;
        } else {
          descColumn.span = 1;
        }
      }
      return descColumn;
    });
  }
};
const presetRegistry = {};
class Presets {
  /**
   * 注册自定义预设
   * @param name 预设名称
   * @param preset 预设函数
   */
  static register(name, preset) {
    if (presetRegistry[name]) {
      console.warn(`[Pro-Columns] Preset "${name}" already exists and will be overwritten.`);
    }
    presetRegistry[name] = preset;
  }
  /**
   * 获取预设
   * @param name 预设名称
   * @returns 预设函数
   */
  static get(name) {
    return presetRegistry[name];
  }
  /**
   * 获取所有预设名称
   * @returns 预设名称列表
   */
  static list() {
    return Object.keys(presetRegistry);
  }
  /**
   * 清空所有预设（主要用于测试）
   */
  static clear() {
    Object.keys(presetRegistry).forEach((key) => {
      delete presetRegistry[key];
    });
  }
  // ==================== 内置预设 ====================
  /**
   * 可搜索字段
   * 包含：搜索、排序、占位符
   */
  static searchableField() {
    return [Search(), Sort(), Placeholder({ includeSearch: true })];
  }
  /**
   * 必填字段
   * 包含：必填、占位符
   */
  static requiredField() {
    return [Required(), Placeholder()];
  }
  /**
   * 金额字段
   * 包含：金额格式化、宽度配置、排序
   */
  static moneyField(options) {
    const { precision = 2 } = options || {};
    return [
      Format({ type: "money", precision }),
      Width({ table: 120, form: "lg" }),
      Sort(),
      Copy()
    ];
  }
  /**
   * 日期字段
   * 包含：日期格式化、排序、宽度配置
   */
  static dateField(options) {
    const { format = "YYYY-MM-DD" } = options || {};
    return [Format({ type: "date", dateFormat: format }), Sort(), Width({ table: 180, form: "md" })];
  }
  /**
   * 日期时间字段
   * 包含：日期时间格式化、排序、宽度配置
   */
  static dateTimeField() {
    return [
      Format({ type: "date", dateFormat: "YYYY-MM-DD HH:mm:ss" }),
      Sort(),
      Width({ table: 200, form: "lg" })
    ];
  }
  /**
   * 枚举字段
   * 包含：枚举渲染、搜索、必填、占位符
   */
  static enumField(options) {
    const { type = "badge" } = options || {};
    return [Enum({ type }), Search(), Required(), Placeholder()];
  }
  /**
   * 只读字段
   * 包含：禁用表单输入
   */
  static readonlyField() {
    return [
      createStrategy(() => ({
        fieldProps: { disabled: true },
        editable: false
      }))
    ];
  }
  /**
   * 图片字段
   * 包含：图片预览、宽度配置
   */
  static imageField(options) {
    const { width = 60, height = 60, maxCount = 5 } = options || {};
    return [Image({ width, height, maxCount }), Width({ table: 100, form: "lg" })];
  }
  /**
   * 链接字段
   * 包含：链接跳转、宽度配置、复制
   */
  static linkField(options) {
    const { target = "_blank" } = options || {};
    return [Link({ target }), Copy(), Width({ table: 200 })];
  }
  /**
   * 数字字段
   * 包含：数字格式化、排序、宽度配置
   */
  static numberField(options) {
    const { precision = 0 } = options || {};
    return [Format({ type: "number", precision }), Sort(), Width({ table: 100, form: "md" })];
  }
  /**
   * 百分比字段
   * 包含：百分比格式化、排序、宽度配置
   */
  static percentField(options) {
    const { precision = 2 } = options || {};
    return [Format({ type: "percent", precision }), Sort(), Width({ table: 100, form: "md" })];
  }
  /**
   * 可编辑字段（表格内编辑）
   * 包含：可编辑配置、排序
   */
  static editableField(options) {
    const { type = "text", onSave } = options || {};
    return [
      createStrategy(() => {
        return {
          editable: () => ({
            type,
            onSave
          })
        };
      }),
      Sort()
    ];
  }
  /**
   * 完整 CRUD 字段
   * 包含：搜索、排序、必填、占位符、复制
   * 适用于常规文本字段
   */
  static fullField() {
    return [Search(), Sort(), Required(), Placeholder({ includeSearch: true }), Copy()];
  }
  /**
   * ID 字段
   * 包含：固定宽度、只读、复制、排序
   * 适用于主键、唯一标识等字段
   */
  static idField(options) {
    const { width = 80, copyable = true, sortable = true } = options || {};
    const strategies = [
      createStrategy(() => ({
        width,
        ellipsis: true,
        fieldProps: { disabled: true },
        hideInForm: true
        // ID 通常不在表单中显示
      }))
    ];
    if (copyable) {
      strategies.push(Copy());
    }
    if (sortable) {
      strategies.push(Sort());
    }
    return strategies;
  }
  /**
   * 状态字段
   * 包含：状态枚举、搜索、排序、筛选
   * 适用于状态、类型等枚举字段
   */
  static statusField(options) {
    const {
      type = "badge",
      searchable = true,
      sortable = true,
      filterable = true
    } = options || {};
    const strategies = [
      Enum({ type }),
      Width({ table: 100, form: "md" })
    ];
    if (searchable) {
      strategies.push(Search());
    }
    if (sortable) {
      strategies.push(Sort());
    }
    if (filterable) {
      strategies.push(
        createStrategy((column) => ({
          // 自动从 valueEnum 生成筛选选项的逻辑已在 Filter 策略中实现
          // 这里只需要标记需要筛选功能
          filters: column.valueEnum ? Object.keys(column.valueEnum).map((key) => {
            const enumItem = column.valueEnum[key];
            return {
              text: typeof enumItem === "object" && enumItem.text ? enumItem.text : String(enumItem),
              value: key
            };
          }) : void 0,
          filterSearch: true
        }))
      );
    }
    return strategies;
  }
  /**
   * 操作列
   * 包含：固定在右侧、固定宽度、不导出
   * 适用于操作按钮列
   */
  static actionField(options) {
    const { width = 150, fixed = "right" } = options || {};
    return [
      createStrategy(() => ({
        title: "操作",
        dataIndex: "action",
        valueType: "option",
        width,
        fixed,
        hideInSearch: true,
        hideInForm: true,
        hideInDescriptions: true,
        // 操作列通常不导出
        __export: true,
        __exportable: false
      }))
    ];
  }
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f = React, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  return reactJsxRuntime_production_min;
}
var reactJsxRuntime_development = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
  hasRequiredReactJsxRuntime_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var React$1 = React;
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      var ReactSharedInternals = React$1.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
            return true;
          }
        }
        return false;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x) {
                return null;
              }
            }
          }
        }
        return null;
      }
      var assign = Object.assign;
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0) {
            try {
              throw Error();
            } catch (x) {
              var match = x.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          }
          return "\n" + prefix + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== void 0) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x) {
                control = x;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              control = x;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c = controlLines.length - 1;
            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              c--;
            }
            for (; s >= 1 && c >= 0; s--, c--) {
              if (sampleLines[s] !== controlLines[c]) {
                if (s !== 1 || c !== 1) {
                  do {
                    s--;
                    c--;
                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn.displayName);
                      }
                      {
                        if (typeof fn === "function") {
                          componentFrameCache.set(fn, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn === "function") {
            componentFrameCache.set(fn, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn, false);
        }
      }
      function shouldConstruct(Component2) {
        var prototype = Component2.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x) {
              }
            }
          }
        }
        return "";
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error("Failed %s type: %s", location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown;
      var specialPropRefWarningShown;
      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, "ref")) {
            var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== void 0;
      }
      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== void 0;
      }
      function warnIfStringRefCannotBeAutoConverted(config, self) {
        {
          if (typeof config.ref === "string" && ReactCurrentOwner.current && self) ;
        }
      }
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = function() {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
      }
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = function() {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
      }
      var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type,
          key,
          ref,
          props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          element._store = {};
          Object.defineProperty(element._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          Object.defineProperty(element, "_self", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          });
          Object.defineProperty(element, "_source", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      function jsxDEV(type, config, maybeKey, source, self) {
        {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          if (maybeKey !== void 0) {
            {
              checkKeyStringCoercion(maybeKey);
            }
            key = "" + maybeKey;
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = "" + config.key;
          }
          if (hasValidRef(config)) {
            ref = config.ref;
            warnIfStringRefCannotBeAutoConverted(config, self);
          }
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          if (key || ref) {
            var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
      }
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null);
          }
        }
      }
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      function isValidElement(object) {
        {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
      }
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
      }
      function getSourceInfoErrorAddendum(source) {
        {
          return "";
        }
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
      }
      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          setCurrentlyValidatingElement$1(element);
          error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement$1(null);
        }
      }
      function validateChildKeys(node, parentType) {
        {
          if (typeof node !== "object") {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === void 0 || typeof type === "string") {
            return;
          }
          var propTypes;
          if (typeof type === "function") {
            propTypes = type.propTypes;
          } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var _name = getComponentNameFromType(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
          }
        }
      }
      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
              setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
          }
        }
      }
      var didWarnAboutKeySpread = {};
      function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
        {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendum();
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
          var element = jsxDEV(type, props, key, source, self);
          if (element == null) {
            return element;
          }
          if (validType) {
            var children = props.children;
            if (children !== void 0) {
              if (isStaticChildren) {
                if (isArray(children)) {
                  for (var i = 0; i < children.length; i++) {
                    validateChildKeys(children[i], type);
                  }
                  if (Object.freeze) {
                    Object.freeze(children);
                  }
                } else {
                  error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                }
              } else {
                validateChildKeys(children, type);
              }
            }
          }
          {
            if (hasOwnProperty.call(props, "key")) {
              var componentName = getComponentNameFromType(type);
              var keys = Object.keys(props).filter(function(k) {
                return k !== "key";
              });
              var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
              if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                didWarnAboutKeySpread[componentName + beforeExample] = true;
              }
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
      }
      function jsxWithValidationStatic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, true);
        }
      }
      function jsxWithValidationDynamic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, false);
        }
      }
      var jsx = jsxWithValidationDynamic;
      var jsxs = jsxWithValidationStatic;
      reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
      reactJsxRuntime_development.jsx = jsx;
      reactJsxRuntime_development.jsxs = jsxs;
    })();
  }
  return reactJsxRuntime_development;
}
if (process.env.NODE_ENV === "production") {
  jsxRuntime.exports = requireReactJsxRuntime_production_min();
} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}
var jsxRuntimeExports = jsxRuntime.exports;
function ProColumnsTable(props) {
  const {
    columns,
    enums,
    applyStrategies,
    mergeMode,
    columnStrategies,
    ...tableProps
  } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ProTable,
    {
      columns: Component.transform("proTable", columns, {
        enums,
        applyStrategies,
        mergeMode,
        columnStrategies
      }),
      ...tableProps
    }
  );
}
function ProColumnsForm(props) {
  const {
    columns,
    enums,
    applyStrategies,
    mergeMode,
    columnStrategies,
    ...formProps
  } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    BetaSchemaForm,
    {
      columns: Component.transform("proForm", columns, {
        enums,
        applyStrategies,
        mergeMode,
        columnStrategies
      }),
      ...formProps
    }
  );
}
function ProColumnsDescription(props) {
  const {
    columns,
    enums,
    applyStrategies,
    mergeMode,
    columnStrategies,
    ...descriptionProps
  } = props;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    ProDescriptions,
    {
      columns: Component.transform("proDescription", columns, {
        enums,
        applyStrategies,
        mergeMode,
        columnStrategies
      }),
      ...descriptionProps
    }
  );
}
Component.register(ProTableAdapter);
Component.register(ProFormAdapter);
Component.register(ProDescriptionAdapter);
export {
  Columns,
  Component,
  Copy,
  DefaultValue,
  Editable,
  Enum,
  Format,
  Image,
  Link,
  Permission,
  Placeholder,
  Presets,
  ProColumnsDescription,
  ProColumnsForm,
  ProColumnsTable,
  Required,
  Search,
  Sort,
  Tooltip,
  Transform,
  Validation,
  Width,
  createStrategy,
  deepMerge,
  generatePlaceholder,
  getField,
  getFieldType,
  hasField,
  setField
};
//# sourceMappingURL=pro-columns.mjs.map
