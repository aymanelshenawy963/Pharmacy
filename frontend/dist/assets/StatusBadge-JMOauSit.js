import{u as s,q as r,p as o,o as c,x as a}from"./index-Dn7tX2vS.js";import{c as n}from"./clsx-B-dksMZM.js";/**
 * @license lucide-react v0.493.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["circle",{cx:"9",cy:"12",r:"3",key:"u3jwor"}],["rect",{width:"20",height:"14",x:"2",y:"5",rx:"7",key:"g7kal2"}]],x=s("toggle-left",i);/**
 * @license lucide-react v0.493.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["circle",{cx:"15",cy:"12",r:"3",key:"1afu0r"}],["rect",{width:"20",height:"14",x:"2",y:"5",rx:"7",key:"g7kal2"}]],p=s("toggle-right",d),m={async getAll(e=!1){return c("/api/Roles",e?{includeDisabled:"true"}:{})},async create({name:e}){return o("/api/Roles",{name:e})},async update(e,{name:t}){return r(`/api/Roles/${e}`,{name:t})},async toggleStatus(e){return r(`/api/Roles/${e}/toggle-status`)}};function y({active:e=!0,activeText:t="Active",inactiveText:l="Inactive"}){return a.jsxs("span",{className:n("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",e?"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400":"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"),children:[a.jsx("span",{className:`mr-1.5 h-1.5 w-1.5 rounded-full ${e?"bg-emerald-500":"bg-red-500"}`}),e?t:l]})}export{y as S,x as T,p as a,m as r};
