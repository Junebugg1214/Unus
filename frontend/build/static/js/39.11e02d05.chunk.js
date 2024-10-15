(self.webpackChunkunus_frontend=self.webpackChunkunus_frontend||[]).push([[39],{39:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>j});var a=t(43),r=t(216),n=t(660),l=t(140),o=t(90),c=t(264);var i=t(579);const d=e=>{let{user:s,onCloneRepo:t}=e;const[r,n]=(0,a.useState)("");return(0,i.jsxs)(l.Zp,{className:"w-full max-w-3xl mx-auto",children:[(0,i.jsx)(l.aR,{children:(0,i.jsx)("h2",{className:"text-2xl font-bold",children:"Welcome to Unus"})}),(0,i.jsxs)(l.Wu,{children:[(0,i.jsx)("p",{className:"mb-4",children:"Unus is an AI Agent Management Platform. Clone repositories, manage them, and run inferences with ease."}),s?(0,i.jsxs)("div",{className:"space-y-4",children:[(0,i.jsx)(c.p,{type:"text",placeholder:"Paste Agent GitHub URL",value:r,onChange:e=>n(e.target.value)}),(0,i.jsx)(o.$,{onClick:()=>{(/^https:\/\/github\.com\/[\w-]+\/[\w-]+(\.git)?$/.test(r)?"":"Invalid GitHub repository URL.")||(t(r),n(""))},children:"Clone Repository"})]}):(0,i.jsx)("p",{children:"Please log in or register to start using Unus."})]})]})},u=e=>{let{repos:s,onDeleteRepo:t}=e;return(0,i.jsxs)(l.Zp,{className:"w-full max-w-3xl mx-auto",children:[(0,i.jsx)(l.aR,{children:(0,i.jsx)("h2",{className:"text-2xl font-bold",children:"Manage Repositories"})}),(0,i.jsx)(l.Wu,{children:s.length>0?(0,i.jsx)("ul",{className:"space-y-2",children:s.map((e=>(0,i.jsxs)("li",{className:"flex justify-between items-center p-2 bg-gray-100 rounded",children:[(0,i.jsx)("span",{children:e}),(0,i.jsx)(o.$,{variant:"destructive",size:"sm",onClick:()=>t(e),children:"Delete"})]},e)))}):(0,i.jsx)("p",{children:"No repositories cloned yet."})})]})};var p=t(173),f=t.n(p),m=t(89);const h=a.forwardRef(((e,s)=>{let{className:t,...a}=e;return(0,i.jsx)("textarea",{className:(0,m.cn)("shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline",t),ref:s,...a})}));h.displayName="Textarea",h.propTypes={className:f().string,value:f().string,onChange:f().func,placeholder:f().string};var x=t(586);const y=e=>{let{repos:s,showAlert:t}=e;const[r,n]=(0,a.useState)(""),[d,u]=(0,a.useState)(""),[p,f]=(0,a.useState)(null),[m,y]=(0,a.useState)(""),[g,j]=(0,a.useState)(!1),v=async e=>{try{const s=await x.Ay.getTaskStatus(e);"PENDING"===s.state||"STARTED"===s.state?setTimeout((()=>v(e)),2e3):"SUCCESS"===s.state?(y(s.result),t("Inference completed","default")):"FAILURE"===s.state&&t("Inference failed","destructive")}catch(s){t("Error checking task status","destructive")}};return(0,i.jsxs)(l.Zp,{className:"w-full max-w-3xl mx-auto",children:[(0,i.jsx)(l.aR,{children:(0,i.jsx)("h2",{className:"text-2xl font-bold",children:"Run Inference"})}),(0,i.jsx)(l.Wu,{children:(0,i.jsxs)("div",{className:"space-y-4",children:[(0,i.jsxs)("select",{value:r,onChange:e=>n(e.target.value),className:"w-full p-2 border rounded",children:[(0,i.jsx)("option",{value:"",children:"Select a repository"}),s.map((e=>(0,i.jsx)("option",{value:e,children:e},e)))]}),(0,i.jsx)(h,{placeholder:"Enter text for inference",value:d,onChange:e=>u(e.target.value)}),(0,i.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,i.jsx)(c.p,{type:"file",onChange:e=>f(e.target.files[0]),className:"hidden",id:"file-upload"}),(0,i.jsx)("label",{htmlFor:"file-upload",className:"cursor-pointer",children:(0,i.jsx)(o.$,{variant:"outline",size:"icon",children:"Upload File"})}),(0,i.jsx)("span",{children:p?p.name:"No file chosen"})]}),(0,i.jsx)(o.$,{onClick:async()=>{if(!r)return void t("Please select a repository","destructive");if(!d.trim()&&!p)return void t("Please enter text or upload a file for inference","destructive");const e=d.trim()?"":"Inference text cannot be empty";if(e)t(e,"destructive");else{j(!0);try{const e=await x.Ay.runInference(r,d,p);t("Inference task started","default"),await v(e)}catch(s){t("Failed to start inference","destructive")}finally{j(!1)}}},disabled:g,children:g?"Running Inference...":"Run Inference"})]})}),m&&(0,i.jsx)(l.wL,{children:(0,i.jsxs)("div",{className:"w-full",children:[(0,i.jsx)("h3",{className:"text-lg font-semibold mb-2",children:"Output:"}),(0,i.jsx)("pre",{className:"bg-gray-100 p-4 rounded overflow-x-auto",children:m})]})})]})};var g=t(900);const j=e=>{let{user:s}=e;const[t,l]=(0,a.useState)("home"),[o,c]=(0,a.useState)([]),[p,f]=(0,a.useState)({show:!1,message:"",type:"default"}),[m,h]=(0,a.useState)(!0),j=(0,r.Zp)(),v=(0,a.useCallback)((function(e){f({show:!0,message:e,type:arguments.length>1&&void 0!==arguments[1]?arguments[1]:"default"}),setTimeout((()=>f({show:!1,message:"",type:"default"})),3e3)}),[]),N=(0,a.useCallback)((async()=>{try{h(!0);const e=await x.Ay.getClonedRepos();c(e.data)}catch(e){v("Failed to fetch cloned repositories","destructive")}finally{h(!1)}}),[v]);(0,a.useEffect)((()=>{s?N():j("/login")}),[s,N,j]);const b=(0,a.useCallback)((async e=>{try{h(!0),await x.Ay.cloneRepository(e),await N(),v("Repository cloned successfully","default")}catch(s){v("Failed to clone repository","destructive")}finally{h(!1)}}),[N,v]),w=(0,a.useCallback)((async e=>{try{h(!0),await x.Ay.deleteRepo(e),await N(),v("Repository deleted successfully","default")}catch(s){v("Failed to delete repository","destructive")}finally{h(!1)}}),[N,v]);return(0,i.jsxs)("div",{className:"min-h-screen bg-gray-100",children:[(0,i.jsx)(n.A,{user:s,onChangePage:l}),(0,i.jsxs)("main",{className:"container mx-auto px-4 py-8",children:[p.show&&(0,i.jsx)(g.F,{variant:p.type,className:"mb-4",children:(0,i.jsx)(g.T,{children:p.message})}),(()=>{if(m)return(0,i.jsx)("div",{children:"Loading..."});switch(t){case"home":return(0,i.jsx)(d,{user:s,onCloneRepo:b});case"manage-repos":return(0,i.jsx)(u,{repos:o,onDeleteRepo:w});case"inference":return(0,i.jsx)(y,{repos:o,showAlert:v});default:return null}})()]})]})}},140:(e,s,t)=>{"use strict";t.d(s,{BT:()=>u,Wu:()=>p,ZB:()=>d,Zp:()=>c,aR:()=>i,wL:()=>f});var a=t(43),r=t(173),n=t.n(r),l=t(89),o=t(579);const c=a.forwardRef(((e,s)=>{let{className:t,...a}=e;return(0,o.jsx)("div",{ref:s,className:(0,l.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",t),...a})}));c.displayName="Card";const i=a.forwardRef(((e,s)=>{let{className:t,...a}=e;return(0,o.jsx)("div",{ref:s,className:(0,l.cn)("flex flex-col space-y-1.5 p-6",t),...a})}));i.displayName="CardHeader";const d=a.forwardRef(((e,s)=>{let{className:t,children:a,...r}=e;return(0,o.jsx)("h3",{ref:s,className:(0,l.cn)("text-2xl font-semibold leading-none tracking-tight",t),...r,children:a})}));d.displayName="CardTitle";const u=a.forwardRef(((e,s)=>{let{className:t,...a}=e;return(0,o.jsx)("p",{ref:s,className:(0,l.cn)("text-sm text-muted-foreground",t),...a})}));u.displayName="CardDescription";const p=a.forwardRef(((e,s)=>{let{className:t,...a}=e;return(0,o.jsx)("div",{ref:s,className:(0,l.cn)("p-6 pt-0",t),...a})}));p.displayName="CardContent";const f=a.forwardRef(((e,s)=>{let{className:t,...a}=e;return(0,o.jsx)("div",{ref:s,className:(0,l.cn)("flex items-center p-6 pt-0",t),...a})}));f.displayName="CardFooter";const m={className:n().string,children:n().node};c.propTypes=m,i.propTypes=m,d.propTypes=m,u.propTypes=m,p.propTypes=m,f.propTypes=m},264:(e,s,t)=>{"use strict";t.d(s,{p:()=>l});var a=t(43),r=t(89),n=t(579);const l=a.forwardRef(((e,s)=>{let{className:t,type:a,...l}=e;return(0,n.jsx)("input",{type:a,className:(0,r.cn)("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",t),ref:s,"aria-label":l["aria-label"]||l.placeholder||"",...l})}));l.displayName="Input"},497:(e,s,t)=>{"use strict";var a=t(218);function r(){}function n(){}n.resetWarningCache=r,e.exports=function(){function e(e,s,t,r,n,l){if(l!==a){var o=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw o.name="Invariant Violation",o}}function s(){return e}e.isRequired=e;var t={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:s,element:e,elementType:e,instanceOf:s,node:e,objectOf:s,oneOf:s,oneOfType:s,shape:s,exact:s,checkPropTypes:n,resetWarningCache:r};return t.PropTypes=t,t}},173:(e,s,t)=>{e.exports=t(497)()},218:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"}}]);
//# sourceMappingURL=39.11e02d05.chunk.js.map