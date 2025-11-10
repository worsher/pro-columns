import{c as F,d as N,F as l,E as w,e as k,W as z,C as v,b,a as D,R as G,P as H}from"./index-BVbW2pOK.js";import"./index-GiUgBvb1.js";import"./index-57RuBJvr.js";import"./index-Bw5gtqQz.js";import"./jsx-runtime-CDt2p4po.js";const C=(a={})=>{const{condition:o,sceneConditions:e,invert:c=!1,hideMode:g="all"}=a;return F((m,i)=>{let s=!0;if(e&&i&&i in e?s=e[i]??!0:o!==void 0&&(typeof o=="function"?s=o(m,i):s=o),c&&(s=!s),s)return{};const n={};switch(g){case"all":n.hideInTable=!0,n.hideInForm=!0,n.hideInSearch=!0,n.hideInDescriptions=!0;break;case"table":n.hideInTable=!0;break;case"form":n.hideInForm=!0;break;case"search":n.hideInSearch=!0;break;case"description":n.hideInDescriptions=!0;break}return n})},_=(a={})=>{const{enable:o=!0,type:e,aggregator:c,formatter:g,label:m,precision:i=2,showEmptyValue:s=!0}=a;return F((n,p)=>{if(!o||p!=="table")return{};if(!e&&!c)return{};const d={__aggregation:!0,__aggregationType:e||"custom"};if(c&&(d.__aggregator=c),g?d.__aggregationFormatter=g:d.__aggregationFormatter=(t,r)=>{if(t==null||t===void 0)return s?"-":"";switch(r){case"sum":case"avg":return typeof t=="number"?t.toFixed(i):String(t);case"count":return String(t);case"max":case"min":return typeof t=="number"?t.toFixed(i):String(t);default:return String(t)}},m)d.__aggregationLabel=m;else{const t={sum:"合计",avg:"平均",count:"计数",max:"最大",min:"最小",custom:"统计"};d.__aggregationLabel=t[e||"custom"]||"统计"}return d.__aggregationPrecision=i,d.__showEmptyValue=s,d})},Q=(a={})=>{const{enable:o=!0,exportable:e=!0,exportTitle:c,exportTransform:g,exportFormatter:m,exportWidth:i=15,exportAlign:s,exportOrder:n,exportMerge:p=!1,exportStyle:d}=a;return F(t=>{if(!o)return{};const r={__export:!0,__exportable:e};return c!==void 0?r.__exportTitle=c:r.__exportTitle=t.title||t.dataIndex,g&&(r.__exportTransform=g),m?r.__exportFormatter=m:r.__exportFormatter=u=>u==null||u===void 0?"":typeof u=="object"?JSON.stringify(u):String(u),i!==void 0&&(r.__exportWidth=i),s!==void 0&&(r.__exportAlign=s),n!==void 0&&(r.__exportOrder=n),p!==void 0&&(r.__exportMerge=p),d!==void 0&&(r.__exportStyle=d),r})},te={title:"Strategies/Examples",component:N,tags:["autodocs"],parameters:{layout:"fullscreen"}},y=[{id:1,name:"产品A",price:99.99,category:"electronics",stock:100,discount:.1},{id:2,name:"产品B",price:149.5,category:"books",stock:50,discount:.15},{id:3,name:"产品C",price:299,category:"electronics",stock:30,discount:.2},{id:4,name:"产品D",price:49.99,category:"clothing",stock:200,discount:.05}],E={electronics:{text:"电子产品",status:"Processing"},books:{text:"图书",status:"Success"},clothing:{text:"服装",status:"Default"}},x={args:{columns:[{title:"产品名称",dataIndex:"name"},{title:"价格（金额格式）",dataIndex:"price",strategys:[{mode:"merge",strategy:[l({type:"money",precision:2})]}]},{title:"折扣（百分比格式）",dataIndex:"discount",strategys:[{mode:"merge",strategy:[l({type:"percent",precision:1})]}]},{title:"库存（数字格式）",dataIndex:"stock",strategys:[{mode:"merge",strategy:[l({type:"number",precision:0})]}]}],dataSource:y,rowKey:"id",search:!1}},f={args:{columns:[{title:"ID",dataIndex:"id",width:80},{title:"产品名称",dataIndex:"name"},{title:"分类（自动生成筛选）",dataIndex:"category",valueEnum:E,strategys:[{mode:"merge",strategy:[w({type:"tag"}),k({filterType:"select"})]}]},{title:"库存（数字筛选）",dataIndex:"stock",strategys:[{mode:"merge",strategy:[k({filterType:"custom",filters:[{text:"充足（>100）",value:"high"},{text:"中等（50-100）",value:"medium"},{text:"不足（<50）",value:"low"}],onFilter:(a,o)=>{const e=o.stock;return a==="high"?e>100:a==="medium"?e>=50&&e<=100:a==="low"?e<50:!1}})]}]}],dataSource:y,rowKey:"id",search:!1}},I={args:{columns:[{title:"ID",dataIndex:"id",width:80},{title:"产品名称",dataIndex:"name"},{title:"价格（带求和）",dataIndex:"price",strategys:[{mode:"merge",strategy:[l({type:"money",precision:2}),_({type:"sum",precision:2})]}]},{title:"库存（带平均值）",dataIndex:"stock",strategys:[{mode:"merge",strategy:[_({type:"avg",precision:0})]}]},{title:"折扣（最大值）",dataIndex:"discount",strategys:[{mode:"merge",strategy:[l({type:"percent",precision:1}),_({type:"max",precision:2})]}]}],dataSource:y,rowKey:"id",search:!1,pagination:!1}},h={args:{columns:[{title:"ID",dataIndex:"id",width:80},{title:"产品名称",dataIndex:"name"},{title:"价格",dataIndex:"price",strategys:[{mode:"merge",strategy:[l({type:"money",precision:2}),C({})]}]},{title:"库存预警",dataIndex:"stock",strategys:[{mode:"merge",strategy:[C({})]}],render:(a,o)=>o.stock<20?"严重不足":"库存偏低"},{title:"分类",dataIndex:"category",valueEnum:E,strategys:[{mode:"merge",strategy:[w({type:"badge"})]}]}],dataSource:y,rowKey:"id",search:!1}},S={args:{columns:[{title:"ID",dataIndex:"id",strategys:[{mode:"merge",strategy:[z({table:80}),v(),b()]}]},{title:"产品名称",dataIndex:"name",strategys:[{mode:"merge",strategy:[D(),b(),G(),H()]}]},{title:"价格",dataIndex:"price",strategys:[{mode:"merge",strategy:[l({type:"money",precision:2}),b(),v(),_({type:"sum",precision:2}),Q({exportFormatter:a=>`¥${a}`})]}]},{title:"分类",dataIndex:"category",valueEnum:E,strategys:[{mode:"merge",strategy:[w({type:"badge"}),k({filterType:"select"}),D()]}]}],dataSource:y,rowKey:"id",search:{labelWidth:"auto"}}};var T,A,K;x.parameters={...x.parameters,docs:{...(T=x.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: '产品名称',
      dataIndex: 'name'
    }, {
      title: '价格（金额格式）',
      dataIndex: 'price',
      strategys: [{
        mode: 'merge',
        strategy: [Format({
          type: 'money',
          precision: 2
        })]
      }]
    }, {
      title: '折扣（百分比格式）',
      dataIndex: 'discount',
      strategys: [{
        mode: 'merge',
        strategy: [Format({
          type: 'percent',
          precision: 1
        })]
      }]
    }, {
      title: '库存（数字格式）',
      dataIndex: 'stock',
      strategys: [{
        mode: 'merge',
        strategy: [Format({
          type: 'number',
          precision: 0
        })]
      }]
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: false
  }
}`,...(K=(A=x.parameters)==null?void 0:A.docs)==null?void 0:K.source}}};var W,P,M;f.parameters={...f.parameters,docs:{...(W=f.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'ID',
      dataIndex: 'id',
      width: 80
    }, {
      title: '产品名称',
      dataIndex: 'name'
    }, {
      title: '分类（自动生成筛选）',
      dataIndex: 'category',
      valueEnum: categoryEnum,
      strategys: [{
        mode: 'merge',
        strategy: [Enum({
          type: 'tag'
        }), Filter({
          filterType: 'select'
        })]
      }]
    }, {
      title: '库存（数字筛选）',
      dataIndex: 'stock',
      strategys: [{
        mode: 'merge',
        strategy: [Filter({
          filterType: 'custom',
          filters: [{
            text: '充足（>100）',
            value: 'high'
          }, {
            text: '中等（50-100）',
            value: 'medium'
          }, {
            text: '不足（<50）',
            value: 'low'
          }],
          onFilter: (value, record) => {
            const stock = record.stock as number;
            if (value === 'high') return stock > 100;
            if (value === 'medium') return stock >= 50 && stock <= 100;
            if (value === 'low') return stock < 50;
            return false;
          }
        })]
      }]
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: false
  }
}`,...(M=(P=f.parameters)==null?void 0:P.docs)==null?void 0:M.source}}};var O,R,q;I.parameters={...I.parameters,docs:{...(O=I.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'ID',
      dataIndex: 'id',
      width: 80
    }, {
      title: '产品名称',
      dataIndex: 'name'
    }, {
      title: '价格（带求和）',
      dataIndex: 'price',
      strategys: [{
        mode: 'merge',
        strategy: [Format({
          type: 'money',
          precision: 2
        }), Aggregation({
          type: 'sum',
          precision: 2,
          format: true
        })]
      }]
    }, {
      title: '库存（带平均值）',
      dataIndex: 'stock',
      strategys: [{
        mode: 'merge',
        strategy: [Aggregation({
          type: 'avg',
          precision: 0,
          format: true
        })]
      }]
    }, {
      title: '折扣（最大值）',
      dataIndex: 'discount',
      strategys: [{
        mode: 'merge',
        strategy: [Format({
          type: 'percent',
          precision: 1
        }), Aggregation({
          type: 'max',
          precision: 2,
          format: true
        })]
      }]
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: false,
    pagination: false
  }
}`,...(q=(R=I.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var L,V,$;h.parameters={...h.parameters,docs:{...(L=h.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'ID',
      dataIndex: 'id',
      width: 80
    }, {
      title: '产品名称',
      dataIndex: 'name'
    }, {
      title: '价格',
      dataIndex: 'price',
      strategys: [{
        mode: 'merge',
        strategy: [Format({
          type: 'money',
          precision: 2
        }), Conditional({
          visible: record => record.price as number > 100
        })]
      }]
    }, {
      title: '库存预警',
      dataIndex: 'stock',
      strategys: [{
        mode: 'merge',
        strategy: [Conditional({
          visible: record => record.stock as number < 50
        })]
      }],
      render: (_, record) => {
        const stock = record.stock as number;
        return stock < 20 ? '严重不足' : '库存偏低';
      }
    }, {
      title: '分类',
      dataIndex: 'category',
      valueEnum: categoryEnum,
      strategys: [{
        mode: 'merge',
        strategy: [Enum({
          type: 'badge'
        })]
      }]
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: false
  }
}`,...($=(V=h.parameters)==null?void 0:V.docs)==null?void 0:$.source}}};var j,B,J;S.parameters={...S.parameters,docs:{...(j=S.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'ID',
      dataIndex: 'id',
      strategys: [{
        mode: 'merge',
        strategy: [Width({
          table: 80
        }), Copy(), Sort()]
      }]
    }, {
      title: '产品名称',
      dataIndex: 'name',
      strategys: [{
        mode: 'merge',
        strategy: [Search(), Sort(), Required(), Placeholder()]
      }]
    }, {
      title: '价格',
      dataIndex: 'price',
      strategys: [{
        mode: 'merge',
        strategy: [Format({
          type: 'money',
          precision: 2
        }), Sort(), Copy(), Aggregation({
          type: 'sum',
          precision: 2
        }), Export({
          exportFormatter: v => \`¥\${v}\`
        })]
      }]
    }, {
      title: '分类',
      dataIndex: 'category',
      valueEnum: categoryEnum,
      strategys: [{
        mode: 'merge',
        strategy: [Enum({
          type: 'badge'
        }), Filter({
          filterType: 'select'
        }), Search()]
      }]
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: {
      labelWidth: 'auto'
    }
  }
}`,...(J=(B=S.parameters)==null?void 0:B.docs)==null?void 0:J.source}}};const ne=["FormatStrategy","FilterStrategy","AggregationStrategy","ConditionalStrategy","CombinedStrategies"];export{I as AggregationStrategy,S as CombinedStrategies,h as ConditionalStrategy,f as FilterStrategy,x as FormatStrategy,ne as __namedExportsOrder,te as default};
