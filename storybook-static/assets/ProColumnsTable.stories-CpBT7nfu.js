import{j as O}from"./jsx-runtime-CDt2p4po.js";import{c as g,h as Q,S as L,I as N,a as I,b as s,P,R as T,F as f,W as u,C as v,E as W,d as U,e as Y}from"./index-BVbW2pOK.js";import{R as x}from"./index-GiUgBvb1.js";import"./index-57RuBJvr.js";import"./index-Bw5gtqQz.js";const J=(h={})=>{const{enable:e=!0,href:t,target:a="_blank",onClick:i,text:r}=h;return g((c,l)=>e?l==="form"?{}:Q(c,"render")&&!t&&!i?{}:{render:(n,b)=>{const d=r?typeof r=="function"?r(n,b):r:n||"-";if(i)return x.createElement("a",{style:{cursor:"pointer"},onClick:F=>{F.preventDefault(),i(n,b,F)}},d);const o=t?typeof t=="function"?t(n,b):t:n;return o?x.createElement("a",{href:o,target:a,rel:a==="_blank"?"noopener noreferrer":void 0},d):d}}:{})},$=(h={})=>{const{enable:e=!0,width:t=60,height:a=60,preview:i=!0,fallback:r="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij7lm77niYc8L3RleHQ+PC9zdmc+",separator:c=",",maxCount:l=5}=h;return g((p,n)=>e?n==="form"?{}:Q(p,"render")?{}:{render:d=>{if(!d)return"-";let o=[];typeof d=="string"?o=d.split(c).filter(S=>S.trim()):Array.isArray(d)?o=d:o=[String(d)];const F=o.slice(0,l),Z=o.length>l;return x.createElement(L,{size:8},...F.map((S,K)=>x.createElement(N,{key:K,src:S,width:t,height:a,preview:i?{src:S}:!1,fallback:r,style:{objectFit:"cover"}})),Z&&x.createElement("span",{style:{color:"#999",fontSize:"12px"}},`+${o.length-l}`))}}:{})},y={};class m{static register(e,t){y[e]&&console.warn(`[Pro-Columns] Preset "${e}" already exists and will be overwritten.`),y[e]=t}static get(e){return y[e]}static list(){return Object.keys(y)}static clear(){Object.keys(y).forEach(e=>{delete y[e]})}static searchableField(){return[I(),s(),P({includeSearch:!0})]}static requiredField(){return[T(),P()]}static moneyField(e){const{precision:t=2}=e||{};return[f({type:"money",precision:t}),u({table:120,form:"lg"}),s(),v()]}static dateField(e){const{format:t="YYYY-MM-DD"}=e||{};return[f({type:"date",dateFormat:t}),s(),u({table:180,form:"md"})]}static dateTimeField(){return[f({type:"date",dateFormat:"YYYY-MM-DD HH:mm:ss"}),s(),u({table:200,form:"lg"})]}static enumField(e){const{type:t="badge"}=e||{};return[W({type:t}),I(),T(),P()]}static readonlyField(){return[g(()=>({fieldProps:{disabled:!0},editable:!1}))]}static imageField(e){const{width:t=60,height:a=60,maxCount:i=5}=e||{};return[$({width:t,height:a,maxCount:i}),u({table:100,form:"lg"})]}static linkField(e){const{target:t="_blank"}=e||{};return[J({target:t}),v(),u({table:200})]}static numberField(e){const{precision:t=0}=e||{};return[f({type:"number",precision:t}),s(),u({table:100,form:"md"})]}static percentField(e){const{precision:t=2}=e||{};return[f({type:"percent",precision:t}),s(),u({table:100,form:"md"})]}static editableField(e){const{type:t="text",onSave:a}=e||{};return[g(()=>({editable:()=>({type:t,onSave:a})})),s()]}static fullField(){return[I(),s(),T(),P({includeSearch:!0}),v()]}static idField(e){const{width:t=80,copyable:a=!0,sortable:i=!0}=e||{},r=[g(()=>({width:t,ellipsis:!0,fieldProps:{disabled:!0},hideInForm:!0}))];return a&&r.push(v()),i&&r.push(s()),r}static statusField(e){const{type:t="badge",searchable:a=!0,sortable:i=!0,filterable:r=!0}=e||{},c=[W({type:t}),u({table:100,form:"md"})];return a&&c.push(I()),i&&c.push(s()),r&&c.push(g(l=>({filters:l.valueEnum?Object.keys(l.valueEnum).map(p=>{const n=l.valueEnum[p];return{text:typeof n=="object"&&n.text?n.text:String(n),value:p}}):void 0,filterSearch:!0}))),c}static actionField(e){const{width:t=150,fixed:a="right"}=e||{};return[g(()=>({title:"操作",dataIndex:"action",valueType:"option",width:t,fixed:a,hideInSearch:!0,hideInForm:!0,hideInDescriptions:!0,__export:!0,__exportable:!1}))]}}const ae={title:"Components/ProColumnsTable",component:U,tags:["autodocs"],parameters:{layout:"fullscreen"}},k=[{id:1,name:"张三",age:28,email:"zhangsan@example.com",status:"active",amount:12500.5,createdAt:"2024-01-15"},{id:2,name:"李四",age:32,email:"lisi@example.com",status:"inactive",amount:8900,createdAt:"2024-02-20"},{id:3,name:"王五",age:25,email:"wangwu@example.com",status:"active",amount:15600.75,createdAt:"2024-03-10"}],j={active:{text:"激活",status:"Success"},inactive:{text:"未激活",status:"Default"}},w={args:{columns:[{title:"ID",dataIndex:"id",strategys:[{mode:"merge",strategy:m.idField({width:80,sortable:!0})}]},{title:"姓名",dataIndex:"name",strategys:[{mode:"merge",strategy:[I(),s()]}]},{title:"年龄",dataIndex:"age",valueType:"digit",strategys:[{mode:"merge",strategy:[s()]}]},{title:"邮箱",dataIndex:"email",valueType:"text"},{title:"状态",dataIndex:"status",valueEnum:j,strategys:[{mode:"merge",strategy:m.statusField({type:"badge",filterable:!0})}]},{title:"金额",dataIndex:"amount",valueType:"money",strategys:[{mode:"merge",strategy:m.moneyField({precision:2})}]},{title:"创建时间",dataIndex:"createdAt",valueType:"date",strategys:[{mode:"merge",strategy:m.dateField()}]}],dataSource:k,rowKey:"id",search:{labelWidth:"auto"},pagination:{pageSize:10}}},E={args:{columns:[{title:"ID",dataIndex:"id",strategys:[{mode:"merge",strategy:m.idField()}]},{title:"姓名",dataIndex:"name",strategys:[{mode:"merge",strategy:m.searchableField()}]},{title:"状态",dataIndex:"status",valueEnum:j,strategys:[{mode:"merge",strategy:m.statusField({type:"tag"})}]},{title:"金额",dataIndex:"amount",strategys:[{mode:"merge",strategy:m.moneyField()}]},{title:"操作",strategys:[{mode:"merge",strategy:m.actionField()}],render:()=>O.jsx("a",{children:"编辑"})}],dataSource:k,rowKey:"id",search:!1}},D={args:{columns:[{title:"ID",dataIndex:"id",width:80},{title:"姓名",dataIndex:"name"},{title:"状态",dataIndex:"status",valueEnum:j,strategys:[{mode:"merge",strategy:[Y({filterType:"select"})]}]},{title:"年龄",dataIndex:"age",strategys:[{mode:"merge",strategy:[Y({filterType:"number"})]}]}],dataSource:k,rowKey:"id",search:!1}};var H,R,C;w.parameters={...w.parameters,docs:{...(H=w.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'ID',
      dataIndex: 'id',
      strategys: [{
        mode: 'merge',
        strategy: Presets.idField({
          width: 80,
          sortable: true
        })
      }]
    }, {
      title: '姓名',
      dataIndex: 'name',
      strategys: [{
        mode: 'merge',
        strategy: [Search(), Sort()]
      }]
    }, {
      title: '年龄',
      dataIndex: 'age',
      valueType: 'digit',
      strategys: [{
        mode: 'merge',
        strategy: [Sort()]
      }]
    }, {
      title: '邮箱',
      dataIndex: 'email',
      valueType: 'text'
    }, {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusEnum,
      strategys: [{
        mode: 'merge',
        strategy: Presets.statusField({
          type: 'badge',
          filterable: true
        })
      }]
    }, {
      title: '金额',
      dataIndex: 'amount',
      valueType: 'money',
      strategys: [{
        mode: 'merge',
        strategy: Presets.moneyField({
          precision: 2
        })
      }]
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      strategys: [{
        mode: 'merge',
        strategy: Presets.dateField()
      }]
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: {
      labelWidth: 'auto'
    },
    pagination: {
      pageSize: 10
    }
  }
}`,...(C=(R=w.parameters)==null?void 0:R.docs)==null?void 0:C.source}}};var M,A,_;E.parameters={...E.parameters,docs:{...(M=E.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'ID',
      dataIndex: 'id',
      strategys: [{
        mode: 'merge',
        strategy: Presets.idField()
      }]
    }, {
      title: '姓名',
      dataIndex: 'name',
      strategys: [{
        mode: 'merge',
        strategy: Presets.searchableField()
      }]
    }, {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusEnum,
      strategys: [{
        mode: 'merge',
        strategy: Presets.statusField({
          type: 'tag'
        })
      }]
    }, {
      title: '金额',
      dataIndex: 'amount',
      strategys: [{
        mode: 'merge',
        strategy: Presets.moneyField()
      }]
    }, {
      title: '操作',
      strategys: [{
        mode: 'merge',
        strategy: Presets.actionField()
      }],
      render: () => <a>编辑</a>
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: false
  }
}`,...(_=(A=E.parameters)==null?void 0:A.docs)==null?void 0:_.source}}};var z,B,G;D.parameters={...D.parameters,docs:{...(z=D.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    columns: [{
      title: 'ID',
      dataIndex: 'id',
      width: 80
    }, {
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '状态',
      dataIndex: 'status',
      valueEnum: statusEnum,
      strategys: [{
        mode: 'merge',
        strategy: [Filter({
          filterType: 'select'
        })]
      }]
    }, {
      title: '年龄',
      dataIndex: 'age',
      strategys: [{
        mode: 'merge',
        strategy: [Filter({
          filterType: 'number'
        })]
      }]
    }],
    dataSource: mockData,
    rowKey: 'id',
    search: false
  }
}`,...(G=(B=D.parameters)==null?void 0:B.docs)==null?void 0:G.source}}};const re=["Basic","WithPresets","WithFilters"];export{w as Basic,D as WithFilters,E as WithPresets,re as __namedExportsOrder,ae as default};
