import{u as n,q as a,p as o,o as d,x as s,z as i}from"./index-DFE_eGIL.js";import{c as r}from"./clsx-B-dksMZM.js";/**
 * @license lucide-react v0.493.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["circle",{cx:"9",cy:"12",r:"3",key:"u3jwor"}],["rect",{width:"20",height:"14",x:"2",y:"5",rx:"7",key:"g7kal2"}]],y=n("toggle-left",c);/**
 * @license lucide-react v0.493.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["circle",{cx:"15",cy:"12",r:"3",key:"1afu0r"}],["rect",{width:"20",height:"14",x:"2",y:"5",rx:"7",key:"g7kal2"}]],f=n("toggle-right",g),h={async getAll(e=!1){return d("/api/Roles",e?{includeDisabled:"true"}:{})},async create({name:e}){return o("/api/Roles",{name:e})},async update(e,{name:t}){return a(`/api/Roles/${e}`,{name:t})},async toggleStatus(e){return a(`/api/Roles/${e}/toggle-status`)}},p={hidden:{opacity:0,scale:.8,y:4},visible:{opacity:1,scale:1,y:0,transition:{type:"spring",damping:15,stiffness:400}}},u={hidden:{scale:0},visible:{scale:1,transition:{type:"spring",damping:12,stiffness:500,delay:.15}}};function b({active:e=!0,activeText:t="Active",inactiveText:l="Inactive"}){return s.jsxs(i.span,{variants:p,initial:"hidden",animate:"visible",className:r("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm",e?"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300":"bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"),children:[s.jsx(i.span,{variants:u,initial:"hidden",animate:"visible",className:r("mr-1.5 h-1.5 w-1.5 rounded-full",e?"bg-emerald-500":"bg-red-500")}),e?t:l]})}export{b as S,y as T,f as a,h as r};
