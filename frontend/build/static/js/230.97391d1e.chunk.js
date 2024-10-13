(self.webpackChunkunus_frontend=self.webpackChunkunus_frontend||[]).push([[230],{230:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>u});var t=s(43),a=s(475),n=s(880),l=s(90),o=s(264),i=s(140),c=s(900),d=s(586),p=s(579);const u=e=>{let{onLogin:r}=e;const[s,u]=(0,t.useState)({username:"",password:""}),[m,f]=(0,t.useState)(""),[h,x]=(0,t.useState)(!1),y=e=>{const{name:r,value:s}=e.target;u((e=>({...e,[r]:s})))};return(0,p.jsxs)(i.Zp,{className:"w-full max-w-md mx-auto",children:[(0,p.jsx)(i.aR,{children:(0,p.jsx)("h2",{className:"text-2xl font-bold",children:"Login"})}),(0,p.jsx)(i.Wu,{children:(0,p.jsxs)("form",{onSubmit:async e=>{if(e.preventDefault(),f(""),s.username&&s.password){x(!0);try{const e=await d.Ay.login(s.username,s.password),{access_token:t,refresh_token:a}=e.data;n.A.set("accessToken",t,{expires:1}),n.A.set("refreshToken",a,{expires:7}),r(s.username)}catch(l){var t,a;f((null===(t=l.response)||void 0===t||null===(a=t.data)||void 0===a?void 0:a.message)||"Login failed. Please check your credentials and try again."),console.error("Login error:",l)}finally{x(!1)}}else f("Username and password are required")},className:"space-y-4",children:[(0,p.jsx)(o.p,{type:"text",name:"username",placeholder:"Username",value:s.username,onChange:y,required:!0}),(0,p.jsx)(o.p,{type:"password",name:"password",placeholder:"Password",value:s.password,onChange:y,required:!0}),m&&(0,p.jsx)(c.F,{variant:"destructive",children:(0,p.jsx)(c.T,{children:m})}),(0,p.jsx)(l.$,{type:"submit",disabled:h,children:h?"Logging in...":"Login"})]})}),(0,p.jsx)(i.wL,{className:"justify-center",children:(0,p.jsxs)("p",{className:"text-sm text-gray-600",children:["Don't have an account? ",(0,p.jsx)(a.N_,{to:"/register",className:"text-blue-600 hover:underline",children:"Register here"})]})})]})}},900:(e,r,s)=>{"use strict";s.d(r,{F:()=>p,T:()=>u});var t=s(43),a={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const n=(e,r)=>{const s=(0,t.forwardRef)(((s,n)=>{let{color:l="currentColor",size:o=24,strokeWidth:i=2,absoluteStrokeWidth:c,children:d,...p}=s;return(0,t.createElement)("svg",{ref:n,...a,width:o,height:o,stroke:l,strokeWidth:c?24*Number(i)/Number(o):i,className:`lucide lucide-${u=e,u.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,...p},[...r.map((e=>{let[r,s]=e;return(0,t.createElement)(r,s)})),...(Array.isArray(d)?d:[d])||[]]);var u}));return s.displayName=`${e}`,s},l=n("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),o=n("AlertCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]),i=n("CheckCircle",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["polyline",{points:"22 4 12 14.01 9 11.01",key:"6xbx8j"}]]),c=n("AlertTriangle",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",key:"c3ski4"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);var d=s(579);const p=e=>{let{children:r,variant:s="default"}=e;const t={default:(0,d.jsx)(l,{className:"w-5 h-5 mr-2 text-blue-500"}),destructive:(0,d.jsx)(o,{className:"w-5 h-5 mr-2 text-red-500"}),success:(0,d.jsx)(i,{className:"w-5 h-5 mr-2 text-green-500"}),warning:(0,d.jsx)(c,{className:"w-5 h-5 mr-2 text-yellow-500"})};return(0,d.jsxs)("div",{className:`flex items-center border-l-4 p-4 ${{default:"bg-blue-100 border-blue-500 text-blue-700",destructive:"bg-red-100 border-red-500 text-red-700",success:"bg-green-100 border-green-500 text-green-700",warning:"bg-yellow-100 border-yellow-500 text-yellow-700"}[s]} rounded-md shadow-sm`,role:"alert","aria-live":"assertive",children:[t[s],r]})},u=e=>{let{children:r}=e;return(0,d.jsx)("p",{className:"text-sm",children:r})}},140:(e,r,s)=>{"use strict";s.d(r,{BT:()=>p,Wu:()=>u,ZB:()=>d,Zp:()=>i,aR:()=>c,wL:()=>m});var t=s(43),a=s(173),n=s.n(a),l=s(89),o=s(579);const i=t.forwardRef(((e,r)=>{let{className:s,...t}=e;return(0,o.jsx)("div",{ref:r,className:(0,l.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",s),...t})}));i.displayName="Card";const c=t.forwardRef(((e,r)=>{let{className:s,...t}=e;return(0,o.jsx)("div",{ref:r,className:(0,l.cn)("flex flex-col space-y-1.5 p-6",s),...t})}));c.displayName="CardHeader";const d=t.forwardRef(((e,r)=>{let{className:s,children:t,...a}=e;return(0,o.jsx)("h3",{ref:r,className:(0,l.cn)("text-2xl font-semibold leading-none tracking-tight",s),...a,children:t})}));d.displayName="CardTitle";const p=t.forwardRef(((e,r)=>{let{className:s,...t}=e;return(0,o.jsx)("p",{ref:r,className:(0,l.cn)("text-sm text-muted-foreground",s),...t})}));p.displayName="CardDescription";const u=t.forwardRef(((e,r)=>{let{className:s,...t}=e;return(0,o.jsx)("div",{ref:r,className:(0,l.cn)("p-6 pt-0",s),...t})}));u.displayName="CardContent";const m=t.forwardRef(((e,r)=>{let{className:s,...t}=e;return(0,o.jsx)("div",{ref:r,className:(0,l.cn)("flex items-center p-6 pt-0",s),...t})}));m.displayName="CardFooter";const f={className:n().string,children:n().node};i.propTypes=f,c.propTypes=f,d.propTypes=f,p.propTypes=f,u.propTypes=f,m.propTypes=f},264:(e,r,s)=>{"use strict";s.d(r,{p:()=>l});var t=s(43),a=s(89),n=s(579);const l=t.forwardRef(((e,r)=>{let{className:s,type:t,...l}=e;return(0,n.jsx)("input",{type:t,className:(0,a.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",s),ref:r,"aria-label":l["aria-label"]||l.placeholder||"",...l})}));l.displayName="Input"},497:(e,r,s)=>{"use strict";var t=s(218);function a(){}function n(){}n.resetWarningCache=a,e.exports=function(){function e(e,r,s,a,n,l){if(l!==t){var o=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw o.name="Invariant Violation",o}}function r(){return e}e.isRequired=e;var s={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:r,element:e,elementType:e,instanceOf:r,node:e,objectOf:r,oneOf:r,oneOfType:r,shape:r,exact:r,checkPropTypes:n,resetWarningCache:a};return s.PropTypes=s,s}},173:(e,r,s)=>{e.exports=s(497)()},218:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}}]);
//# sourceMappingURL=230.97391d1e.chunk.js.map