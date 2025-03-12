javascript:!function(){let e={MAIN_CONTAINER:"div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",CHAT_TITLE:"button[data-testid='chat-menu-trigger']",USER_MESSAGES:"div.font-user-message",CLAUDE_MESSAGES:"div[data-testid='chat-message-content']",CODE_BLOCKS:"pre",INLINE_CODE:"code",MATH_ELEMENTS:".katex, .katex-display, .math, .math-display"},t={HTML2CANVAS_URL:"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",JSPDF_URL:"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"},o=!1,n={styleSheet:null,header:null,containerClass:!1,modal:null,progressBar:null};function r(e,t=null){console.error(e,t),a(e,"error"),l()}function a(e,t="info"){let o=document.createElement("div");o.style.cssText=`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${"error"===t?"#ff4444":"#44aa44"};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease;
    `,o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.style.opacity="0",setTimeout(()=>o.remove(),300)},3e3)}function i(e,t="Processing..."){if(!n.progressBar){let o=document.createElement("div");o.style.cssText=`
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            text-align: center;
            min-width: 300px;
        `;let r=document.createElement("div");r.style.marginBottom="10px",r.textContent=t,o.appendChild(r);let a=document.createElement("div");a.style.cssText=`
            width: 100%;
            height: 10px;
            background: #333;
            border-radius: 5px;
            overflow: hidden;
        `;let i=document.createElement("div");i.style.cssText=`
            height: 100%;
            background: #44aa44;
            width: 0%;
            transition: width 0.3s ease;
        `,a.appendChild(i),o.appendChild(a);let l=document.createElement("div");l.style.marginTop="5px",l.textContent="0%",o.appendChild(l),document.body.appendChild(o),n.progressBar={container:o,fill:i,text:l,message:r}}n.progressBar.fill.style.width=`${e}%`,n.progressBar.text.textContent=`${Math.round(e)}%`,t!==n.progressBar.message.textContent&&(n.progressBar.message.textContent=t),e>=100&&setTimeout(()=>{n.progressBar&&(n.progressBar.container.remove(),n.progressBar=null)},500)}function l(){if(n.styleSheet&&n.styleSheet.remove(),n.header&&n.header.remove(),n.containerClass){let t=document.querySelector(e.MAIN_CONTAINER);t&&t.classList.remove("screenshot-container")}n.modal&&n.modal.remove(),n.progressBar&&n.progressBar.container.remove(),n={styleSheet:null,header:null,containerClass:!1,modal:null,progressBar:null}}if(!window.location.href.includes("claude.ai")){r("This bookmarklet only works on Claude chat pages");return}if(o){r("Export already in progress");return}function s(e){return new Promise((t,o)=>{let n=document.createElement("script");n.src=e,n.onload=t,n.onerror=()=>o(Error(`Unable to load ${e}`)),document.head.appendChild(n)})}async function d(e){o=!0;try{"undefined"==typeof html2canvas&&(i(10,"Loading html2canvas..."),await s(t.HTML2CANVAS_URL)),"pdf"===e&&"undefined"==typeof jspdf&&(i(30,"Loading jsPDF..."),await s(t.JSPDF_URL)),i(50,"Preparing content..."),o=!1,await c(e)}catch(n){o=!1,r(`Unable to load the required libraries: ${n.message}`,n)}}async function c(t){let o=document.querySelector(e.MAIN_CONTAINER);if(!o)throw Error("Unable to find the Claude chat container");let r=document.querySelectorAll(e.USER_MESSAGES),a=document.querySelectorAll(e.CLAUDE_MESSAGES),i=document.querySelectorAll(e.CODE_BLOCKS),s=document.querySelectorAll(e.INLINE_CODE),d=document.querySelectorAll(e.MATH_ELEMENTS),c={},g={},$={},h={},f={};if(r.length>0){let y=window.getComputedStyle(r[0]);c={fontFamily:y.fontFamily,fontSize:y.fontSize,lineHeight:y.lineHeight,color:y.color,backgroundColor:y.backgroundColor}}if(a.length>0){let u=window.getComputedStyle(a[0]);g={fontFamily:u.fontFamily,fontSize:u.fontSize,lineHeight:u.lineHeight,color:u.color,backgroundColor:u.backgroundColor,letterSpacing:u.letterSpacing}}if(i.length>0){let b=window.getComputedStyle(i[0]);$={fontFamily:b.fontFamily,fontSize:b.fontSize,lineHeight:b.lineHeight,color:b.color,backgroundColor:b.backgroundColor,padding:b.padding,borderRadius:b.borderRadius,tabSize:b.tabSize}}if(s.length>0){let x=window.getComputedStyle(s[0]);h={fontFamily:x.fontFamily,fontSize:x.fontSize,backgroundColor:x.backgroundColor,padding:x.padding,borderRadius:x.borderRadius}}if(d.length>0){let C=window.getComputedStyle(d[0]);f={fontFamily:C.fontFamily,fontSize:C.fontSize,lineHeight:C.lineHeight,verticalAlign:C.verticalAlign}}let _=document.createElement("style");_.textContent=`
        .screenshot-container {
            background-color: white !important;
            color: black !important;
            padding: 20px !important;
        }
        
        /* User messages style - FIX PADDING HERE */
        .screenshot-container .font-user-message {
            font-family: ${c.fontFamily||"var(--font-sans-serif), Arial, sans-serif"} !important;
            font-size: ${c.fontSize||"1rem"} !important;
            line-height: ${c.lineHeight||"1.6"} !important;
            color: ${c.color||"hsl(var(--text-100))"} !important;
            margin-bottom: 0 !important;
            padding: 0.5px !important;
            background-color: ${c.backgroundColor||"transparent"} !important;
            border-radius: 0.25rem !important;
        }
        
        /* User message container */
        .screenshot-container [data-testid="user-message"] {
            padding: 0 !important;
            margin: 0 !important;
        }
        
        /* Fix user message parent container */
        .screenshot-container .group {
            padding: 0.75rem !important;
            margin-bottom: 1rem !important;
            background-color: hsl(var(--bg-100)) !important;
            border-radius: 0.5rem !important;
        }
        
        /* Claude messages style */
        .screenshot-container [data-testid="chat-message-content"] {
            font-family: ${g.fontFamily||"var(--font-serif), Georgia, serif"} !important;
            font-size: ${g.fontSize||"1rem"} !important;
            line-height: ${g.lineHeight||"1.65"} !important;
            color: ${g.color||"hsl(var(--text-100))"} !important;
            letter-spacing: ${g.letterSpacing||"-0.015em"} !important;
            margin-bottom: 1.5rem !important;
            padding: 0.75rem !important;
        }
        
        /* Code block style */
        .screenshot-container pre {
            font-family: ${$.fontFamily||"'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"} !important;
            font-size: ${$.fontSize||"0.875rem"} !important;
            line-height: ${$.lineHeight||"1.625"} !important;
            color: ${$.color||"#abb2bf"} !important;
            background-color: ${$.backgroundColor||"#282c34"} !important;
            padding: ${$.padding||"1em"} !important;
            border-radius: ${$.borderRadius||"0.5rem"} !important;
            tab-size: ${$.tabSize||"2"} !important;
            overflow-x: auto !important;
            margin: 1em 0 !important;
            text-shadow: 0 1px rgba(0,0,0,.3) !important;
            white-space: pre !important;
            word-spacing: normal !important;
            word-break: normal !important;
        }
        
        /* Inline code style */
        .screenshot-container code:not(pre code) {
            font-family: ${h.fontFamily||"'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"} !important;
            font-size: 0.9rem !important;
            background-color: rgba(0, 0, 0, 0.05) !important;
            color: hsl(var(--danger-000)) !important;
            padding: 0px 4px !important;
            margin: 0 2px !important;
            border: 0.5px solid hsl(var(--border-300)) !important;
            border-radius: 0.3rem !important;
            white-space: pre-wrap !important;
        }
        
        /* Correzione per elementi strong (testo in grassetto) */
        .screenshot-container strong, .screenshot-container b {
            font-weight: 700 !important;
            vertical-align: baseline !important;
            position: static !important;
            display: inline !important;
            line-height: inherit !important;
        }
        
        /* Correzione per le formule matematiche KaTeX */
        .screenshot-container .katex-display {
            display: block !important;
            margin: 1em 0 !important;
            text-align: center !important;
        }
        
        .screenshot-container .katex {
            font-family: KaTeX_Main, Times New Roman, serif !important;
            line-height: 1.2 !important;
            text-rendering: auto !important;
            font-size: 1.1em !important;
            display: inline-block !important;
        }
        
        .screenshot-container .katex .mfrac .frac-line {
            position: relative !important;
            display: block !important;
            margin: 0.1em 0 !important;
            border-bottom: 1px solid !important;
            border-top: 0 !important;
        }
        
        .screenshot-container .katex .mfrac .frac-line::after {
            content: '' !important;
            display: block !important;
            margin-top: -1px !important;
            border-bottom: 1px solid !important;
        }
        
        .screenshot-container .katex .mfrac .num,
        .screenshot-container .katex .mfrac .den {
            display: block !important;
            text-align: center !important;
        }
        
        .screenshot-container .katex .mfrac .num {
            margin-bottom: 0.15em !important;
        }
        
        .screenshot-container .katex .mfrac .den {
            margin-top: 0.15em !important;
        }
        
        /* List styles */
        .screenshot-container ol {
            list-style-type: decimal !important;
            padding-left: 2.5em !important;
            margin-left: 0.5em !important;
            margin-top: 1em !important;
            margin-bottom: 1em !important;
        }
        
        .screenshot-container ol li {
            padding-left: 0.5em !important;
            margin-bottom: 0.5em !important;
        }
        
        .screenshot-container ul {
            list-style-type: disc !important;
            padding-left: 2.5em !important;
            margin-left: 0.5em !important;
            margin-top: 1em !important;
            margin-bottom: 1em !important;
        }
        
        .screenshot-container ul li {
            padding-left: 0.5em !important;
            margin-bottom: 0.5em !important;
        }
        
        /* Image styles */
        .screenshot-container img {
            display: inline-block;
            max-width: 100%;
            height: auto;
        }
        
        /* Message container styles */
        .screenshot-container .message-container {
            margin-bottom: 1.5rem !important;
            border-radius: 0.5rem !important;
            overflow: hidden !important;
        }
        
        /* Artifact styles */
        .screenshot-container [data-testid="artifact-card"] {
            border: 1px solid hsla(var(--border-100), 0.3) !important;
            border-radius: 0.5rem !important;
            margin: 1rem 0 !important;
            overflow: hidden !important;
        }
        
        /* Chat header */
        .chat-title-container {
            margin-bottom: 1.5rem;
            margin-top: 1.5rem;
            border-bottom: 2px solid #eee;
            padding-bottom: 1rem;
        }
        
        .chat-title-text {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: bold;
        }
        
        .chat-timestamp {
            font-size: 14px;
            opacity: 0.7;
        }
        
        /* Message roles */
        .message-role {
            font-weight: bold;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            color: hsl(var(--text-200));
        }
        
        /* Math and latex */
        .screenshot-container .katex {
            font-size: 1.1em !important;
        }
        
        /* Tables */
        .screenshot-container table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 1rem 0 !important;
        }
        
        .screenshot-container th {
            background-color: hsl(var(--bg-300)) !important;
            color: hsl(var(--text-000)) !important;
            font-weight: bold !important;
            text-align: left !important;
            padding: 0.75rem !important;
            border: 1px solid hsl(var(--border-200)) !important;
        }
        
        .screenshot-container td {
            padding: 0.75rem !important;
            border: 1px solid hsl(var(--border-200)) !important;
        }
        
        .screenshot-container tr:nth-child(even) {
            background-color: hsl(var(--bg-100)) !important;
        }
    `,document.head.appendChild(_),n.styleSheet=_,o.classList.add("screenshot-container"),n.containerClass=!0;let S=o.querySelectorAll('[data-testid="chat-message"]');S.forEach(e=>{let t=e.querySelector(".font-user-message"),o=e.querySelector('[data-testid="chat-message-content"]');if(o&&!o.querySelector(".message-role")){let n=document.createElement("div");n.className="message-role",n.textContent=t?"You:":"Claude:",o.insertBefore(n,o.firstChild)}});let E=document.querySelector(e.CHAT_TITLE),v=E?.textContent||"Claude Chat",k=v.trim().toLowerCase().replace(/^[^\w\d]+|[^\w\d]+$/g,"").replace(/[\s\W-]+/g,"-")||"claude",w=document.createElement("div");w.className="chat-title-container";let A=document.createElement("div");A.className="chat-title-text",A.textContent=v;let z=document.createElement("div");z.className="chat-timestamp",z.textContent=new Date().toLocaleString(),w.appendChild(A),w.appendChild(z),o.insertBefore(w,o.firstChild),n.header=w;try{"pdf"===t?await m(o,k):await p(o,k)}finally{l()}}async function m(e,t){a("Generating optimized PDF..."),i(60,"Rendering content...");let o=e.cloneNode(!0);o.style.width="800px",o.style.margin="0 auto",g(o),$(o),h(o),o.style.position="absolute",o.style.left="-9999px",document.body.appendChild(o);try{let n=Math.min(1.5,window.devicePixelRatio||1),r=await html2canvas(o,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:n,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.webkitFontSmoothing="antialiased",t.style.mozOsxFontSmoothing="grayscale")}});i(80,"Creating PDF...");let l=r.toDataURL("image/jpeg",1),{jsPDF:s}=window.jspdf,d=new s({compress:!0,precision:2}),c=d.internal.pageSize.getWidth(),m=d.internal.pageSize.getHeight(),p=c,f=r.height*p/r.width,y=Math.ceil(f/m);y>1&&i(85,`Creating ${y} page PDF...`),d.addImage(l,"JPEG",0,0,p,f);let u=f-m,b=1;for(;u>0;)b++,i(85+b/y*10,`Adding page ${b}/${y}...`),d.addPage(),d.addImage(l,"JPEG",0,-(m*(b-1)),p,f),u-=m;i(95,"Optimizing PDF..."),d.setProperties({title:`Claude Chat: ${t}`,subject:"Chat conversation with Claude",creator:"Claude Chat Exporter",author:"Claude User",keywords:"claude, chat, conversation",creationDate:new Date}),i(100,"Saving PDF..."),d.save(`${t}-${Date.now()}.pdf`),a("Optimized PDF saved successfully")}finally{o&&o.parentNode&&o.parentNode.removeChild(o)}}async function p(e,t){a("Generating PNG..."),i(60,"Rendering content...");let o=e.cloneNode(!0);o.style.width="800px",o.style.margin="0 auto",g(o),$(o),h(o),o.style.position="absolute",o.style.left="-9999px",document.body.appendChild(o);try{let n=await html2canvas(o,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:2*window.devicePixelRatio||2,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.padding="20px")}});i(90,"Creating PNG image...");let r=n.toDataURL("image/png");i(100,"Saving PNG...");let l=document.createElement("a");l.download=`${t}-${Date.now()}.png`,l.href=r,l.click(),a("Screenshot saved successfully")}finally{o&&o.parentNode&&o.parentNode.removeChild(o)}}function g(e){let t=e.querySelectorAll("pre");t.forEach(e=>{if(!e.classList.contains("language-")){let t=e.querySelector("code");if(t&&t.className){let o=t.className.match(/language-(\w+)/);o?e.classList.add(`language-${o[1]}`):e.classList.add("language-plaintext")}else e.classList.add("language-plaintext")}e.style.backgroundColor="#282c34",e.style.color="#abb2bf"});let o=e.querySelectorAll("code:not(pre code)");o.forEach(e=>{e.style.backgroundColor="rgba(0, 0, 0, 0.05)",e.style.color="var(--danger-000, #8B0000)",e.style.padding="0px 4px",e.style.margin="0 2px",e.style.border="0.5px solid var(--border-300, #DDD)",e.style.borderRadius="0.3rem",e.style.fontSize="0.9rem",e.style.fontFamily="'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace",e.style.whiteSpace="pre-wrap"})}function $(e){let t=e.querySelectorAll(".katex, .katex-display, .katex-html");t.forEach(e=>{e.style.display="inline-block",e.style.textRendering="auto",e.style.fontSize="1.1em",e.style.fontFamily="KaTeX_Main, Times New Roman, serif";let t=e.querySelectorAll(".frac-line");t.forEach(e=>{e.style.position="relative",e.style.display="block",e.style.margin="0.1em 0",e.style.borderBottom="1px solid",e.style.borderTop="0"});let o=e.querySelectorAll(".num");o.forEach(e=>{e.style.display="block",e.style.textAlign="center",e.style.marginBottom="0.15em"});let n=e.querySelectorAll(".den");n.forEach(e=>{e.style.display="block",e.style.textAlign="center",e.style.marginTop="0.15em"})});let o=e.querySelectorAll(".katex-display");o.forEach(e=>{e.style.display="block",e.style.margin="1em 0",e.style.textAlign="center",e.style.overflow="visible"})}function h(e){let t=e.querySelectorAll("strong, b");t.forEach(e=>{e.style.fontWeight="700",e.style.verticalAlign="baseline",e.style.position="static",e.style.display="inline",e.style.lineHeight="inherit",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",e.style.transform="none",e.style.float="none"})}!function e(){let t=document.createElement("div");t.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;let o=document.createElement("div");o.style.cssText=`
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;let a=document.createElement("h2");a.textContent="Export Claude Chat",a.style.margin="0 0 20px 0";let l=document.createElement("p");l.textContent="Choose the export format:",l.style.margin="0 0 25px 0";let s=document.createElement("div");s.style.cssText=`
        display: flex;
        justify-content: space-around;
        margin-top: 20px;
    `;let c=(e,o)=>{let a=document.createElement("button");return a.textContent=e,a.style.cssText=`
            padding: 12px 25px;
            background: #5A67D8;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.2s;
        `,a.addEventListener("mouseover",()=>{a.style.background="#4C51BF"}),a.addEventListener("mouseout",()=>{a.style.background="#5A67D8"}),a.addEventListener("click",async()=>{t.remove(),n.modal=null;try{i(0,`Initializing ${o.toUpperCase()} export...`),await d(o)}catch(e){r(`Error during export: ${e.message}`,e)}}),a},m=c("PDF","pdf"),p=c("PNG","png"),g=document.createElement("button");g.textContent="Cancel",g.style.cssText=`
        padding: 12px 25px;
        background: #E2E8F0;
        color: #4A5568;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        transition: background 0.2s;
    `,g.addEventListener("mouseover",()=>{g.style.background="#CBD5E0"}),g.addEventListener("mouseout",()=>{g.style.background="#E2E8F0"}),g.addEventListener("click",()=>{t.remove(),n.modal=null}),s.appendChild(m),s.appendChild(p),s.appendChild(g),o.appendChild(a),o.appendChild(l),o.appendChild(s),t.appendChild(o),document.body.appendChild(t),n.modal=t}()}();
