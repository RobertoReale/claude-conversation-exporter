javascript:!function(){let e={MAIN_CONTAINER:"div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",CHAT_TITLE:"button[data-testid='chat-menu-trigger']",USER_MESSAGES:"div.font-user-message",CLAUDE_MESSAGES:"div[data-testid='chat-message-content']",CODE_BLOCKS:"pre",INLINE_CODE:"code"},t={HTML2CANVAS_URL:"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",JSPDF_URL:"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"},o=!1,a={styleSheet:null,header:null,containerClass:!1,modal:null,progressBar:null};function n(e,t=null){console.error(e,t),r(e,"error"),l()}function r(e,t="info"){let o=document.createElement("div");o.style.cssText=`
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
        `,o.textContent=e,document.body.appendChild(o),setTimeout(()=>{o.style.opacity="0",setTimeout(()=>o.remove(),300)},3e3)}function i(e,t="Processing..."){if(!a.progressBar){let o=document.createElement("div");o.style.cssText=`
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
            `;let n=document.createElement("div");n.style.marginBottom="10px",n.textContent=t,o.appendChild(n);let r=document.createElement("div");r.style.cssText=`
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
            `,r.appendChild(i),o.appendChild(r);let l=document.createElement("div");l.style.marginTop="5px",l.textContent="0%",o.appendChild(l),document.body.appendChild(o),a.progressBar={container:o,fill:i,text:l,message:n}}a.progressBar.fill.style.width=`${e}%`,a.progressBar.text.textContent=`${Math.round(e)}%`,t!==a.progressBar.message.textContent&&(a.progressBar.message.textContent=t),e>=100&&setTimeout(()=>{a.progressBar&&(a.progressBar.container.remove(),a.progressBar=null)},500)}function l(){if(a.styleSheet&&a.styleSheet.remove(),a.header&&a.header.remove(),a.containerClass){let t=document.querySelector(e.MAIN_CONTAINER);t&&t.classList.remove("screenshot-container")}a.modal&&a.modal.remove(),a.progressBar&&a.progressBar.container.remove(),a={styleSheet:null,header:null,containerClass:!1,modal:null,progressBar:null}}if(!window.location.href.includes("claude.ai")){n("This bookmarklet only works on Claude chat pages");return}if(o){n("Export already in progress");return}function s(e){return new Promise((t,o)=>{let a=document.createElement("script");a.src=e,a.onload=t,a.onerror=()=>o(Error(`Unable to load ${e}`)),document.head.appendChild(a)})}async function d(e){o=!0;try{"undefined"==typeof html2canvas&&(i(10,"Loading html2canvas..."),await s(t.HTML2CANVAS_URL)),"pdf"===e&&"undefined"==typeof jspdf&&(i(30,"Loading jsPDF..."),await s(t.JSPDF_URL)),i(50,"Preparing content..."),o=!1,await c(e)}catch(a){o=!1,n(`Unable to load the required libraries: ${a.message}`,a)}}async function c(t){let o=document.querySelector(e.MAIN_CONTAINER);if(!o)throw Error("Unable to find the Claude chat container");let n=document.querySelectorAll(e.USER_MESSAGES),r=document.querySelectorAll(e.CLAUDE_MESSAGES),i=document.querySelectorAll(e.CODE_BLOCKS),s=document.querySelectorAll(e.INLINE_CODE),d={},c={},g={},$={};if(n.length>0){let h=window.getComputedStyle(n[0]);d={fontFamily:h.fontFamily,fontSize:h.fontSize,lineHeight:h.lineHeight,color:h.color,backgroundColor:h.backgroundColor}}if(r.length>0){let u=window.getComputedStyle(r[0]);c={fontFamily:u.fontFamily,fontSize:u.fontSize,lineHeight:u.lineHeight,color:u.color,backgroundColor:u.backgroundColor,letterSpacing:u.letterSpacing}}if(i.length>0){let f=window.getComputedStyle(i[0]);g={fontFamily:f.fontFamily,fontSize:f.fontSize,lineHeight:f.lineHeight,color:f.color,backgroundColor:f.backgroundColor,padding:f.padding,borderRadius:f.borderRadius,tabSize:f.tabSize}}if(s.length>0){let b=window.getComputedStyle(s[0]);$={fontFamily:b.fontFamily,fontSize:b.fontSize,backgroundColor:b.backgroundColor,padding:b.padding,borderRadius:b.borderRadius}}let y=document.createElement("style");y.textContent=`
            .screenshot-container {
                background-color: white !important;
                color: black !important;
                padding: 20px !important;
            }
            
            /* User messages style */
            .screenshot-container .font-user-message {
                font-family: ${d.fontFamily||"var(--font-sans-serif), Arial, sans-serif"} !important;
                font-size: ${d.fontSize||"1rem"} !important;
                line-height: ${d.lineHeight||"1.6"} !important;
                color: ${d.color||"hsl(var(--text-100))"} !important;
                margin-bottom: 1.5rem !important;
                padding: 0.75rem !important;
                background-color: ${d.backgroundColor||"hsl(var(--bg-100))"} !important;
                border-radius: 0.5rem !important;
            }
            
            /* Claude messages style */
            .screenshot-container [data-testid="chat-message-content"] {
                font-family: ${c.fontFamily||"var(--font-serif), Georgia, serif"} !important;
                font-size: ${c.fontSize||"1rem"} !important;
                line-height: ${c.lineHeight||"1.65"} !important;
                color: ${c.color||"hsl(var(--text-100))"} !important;
                letter-spacing: ${c.letterSpacing||"-0.015em"} !important;
                margin-bottom: 1.5rem !important;
                padding: 0.75rem !important;
            }
            
            /* Code block style */
            .screenshot-container pre {
                font-family: ${g.fontFamily||"'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"} !important;
                font-size: ${g.fontSize||"0.875rem"} !important;
                line-height: ${g.lineHeight||"1.625"} !important;
                color: ${g.color||"#abb2bf"} !important;
                background-color: ${g.backgroundColor||"#282c34"} !important;
                padding: ${g.padding||"1em"} !important;
                border-radius: ${g.borderRadius||"0.5rem"} !important;
                tab-size: ${g.tabSize||"2"} !important;
                overflow-x: auto !important;
                margin: 1em 0 !important;
                text-shadow: 0 1px rgba(0,0,0,.3) !important;
                white-space: pre !important;
                word-spacing: normal !important;
                word-break: normal !important;
            }
            
            /* Inline code style */
            .screenshot-container code:not(pre code) {
                font-family: ${$.fontFamily||"'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"} !important;
                font-size: 0.9rem !important;
                background-color: rgba(0, 0, 0, 0.05) !important;
                color: hsl(var(--danger-000)) !important;
                padding: 0px 4px !important;
                margin: 0 2px !important;
                border: 0.5px solid hsl(var(--border-300)) !important;
                border-radius: 0.3rem !important;
                white-space: pre-wrap !important;
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
        `,document.head.appendChild(y),a.styleSheet=y,o.classList.add("screenshot-container"),a.containerClass=!0;let x=o.querySelectorAll('[data-testid="chat-message"]');x.forEach(e=>{let t=e.querySelector(".font-user-message"),o=e.querySelector('[data-testid="chat-message-content"]');if(o&&!o.querySelector(".message-role")){let a=document.createElement("div");a.className="message-role",a.textContent=t?"You:":"Claude:",o.insertBefore(a,o.firstChild)}});let C=document.querySelector(e.CHAT_TITLE),_=C?.textContent||"Claude Chat",S=_.trim().toLowerCase().replace(/^[^\w\d]+|[^\w\d]+$/g,"").replace(/[\s\W-]+/g,"-")||"claude",v=document.createElement("div");v.className="chat-title-container";let w=document.createElement("div");w.className="chat-title-text",w.textContent=_;let E=document.createElement("div");E.className="chat-timestamp",E.textContent=new Date().toLocaleString(),v.appendChild(w),v.appendChild(E),o.insertBefore(v,o.firstChild),a.header=v;try{"pdf"===t?await p(o,S):await m(o,S)}finally{l()}}async function p(e,t){r("Generating optimized PDF..."),i(60,"Rendering content...");let o=e.cloneNode(!0);o.style.width="800px",o.style.margin="0 auto",g(o),o.style.position="absolute",o.style.left="-9999px",document.body.appendChild(o);try{let a=Math.min(1.5,window.devicePixelRatio||1),n=await html2canvas(o,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:a,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.webkitFontSmoothing="antialiased",t.style.mozOsxFontSmoothing="grayscale")}});i(80,"Creating PDF...");let l=n.toDataURL("image/jpeg",1),{jsPDF:s}=window.jspdf,d=new s({compress:!0,precision:2}),c=d.internal.pageSize.getWidth(),p=d.internal.pageSize.getHeight(),m=c,$=n.height*m/n.width,h=Math.ceil($/p);h>1&&i(85,`Creating ${h} page PDF...`),d.addImage(l,"JPEG",0,0,m,$);let u=$-p,f=1;for(;u>0;)f++,i(85+f/h*10,`Adding page ${f}/${h}...`),d.addPage(),d.addImage(l,"JPEG",0,-(p*(f-1)),m,$),u-=p;i(95,"Optimizing PDF..."),d.setProperties({title:`Claude Chat: ${t}`,subject:"Chat conversation with Claude",creator:"Claude Chat Exporter",author:"Claude User",keywords:"claude, chat, conversation",creationDate:new Date}),i(100,"Saving PDF..."),d.save(`${t}-${Date.now()}.pdf`),r("Optimized PDF saved successfully")}finally{o&&o.parentNode&&o.parentNode.removeChild(o)}}async function m(e,t){r("Generating PNG..."),i(60,"Rendering content...");let o=e.cloneNode(!0);o.style.width="800px",o.style.margin="0 auto",g(o),o.style.position="absolute",o.style.left="-9999px",document.body.appendChild(o);try{let a=await html2canvas(o,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:2*window.devicePixelRatio||2,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.padding="20px")}});i(90,"Creating PNG image...");let n=a.toDataURL("image/png");i(100,"Saving PNG...");let l=document.createElement("a");l.download=`${t}-${Date.now()}.png`,l.href=n,l.click(),r("Screenshot saved successfully")}finally{o&&o.parentNode&&o.parentNode.removeChild(o)}}function g(e){let t=e.querySelectorAll("pre");t.forEach(e=>{if(!e.classList.contains("language-")){let t=e.querySelector("code");if(t&&t.className){let o=t.className.match(/language-(\w+)/);o?e.classList.add(`language-${o[1]}`):e.classList.add("language-plaintext")}else e.classList.add("language-plaintext")}e.style.backgroundColor="#282c34",e.style.color="#abb2bf"});let o=e.querySelectorAll("code:not(pre code)");o.forEach(e=>{e.style.backgroundColor="rgba(0, 0, 0, 0.05)",e.style.color="var(--danger-000, #8B0000)",e.style.padding="0px 4px",e.style.margin="0 2px",e.style.border="0.5px solid var(--border-300, #DDD)",e.style.borderRadius="0.3rem",e.style.fontSize="0.9rem",e.style.fontFamily="'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace",e.style.whiteSpace="pre-wrap"})}!function e(){let t=document.createElement("div");t.style.cssText=`
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
        `;let r=document.createElement("h2");r.textContent="Export Claude Chat",r.style.margin="0 0 20px 0";let l=document.createElement("p");l.textContent="Choose the export format:",l.style.margin="0 0 25px 0";let s=document.createElement("div");s.style.cssText=`
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        `;let c=(e,o)=>{let r=document.createElement("button");return r.textContent=e,r.style.cssText=`
                padding: 12px 25px;
                background: #5A67D8;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: background 0.2s;
            `,r.addEventListener("mouseover",()=>{r.style.background="#4C51BF"}),r.addEventListener("mouseout",()=>{r.style.background="#5A67D8"}),r.addEventListener("click",async()=>{t.remove(),a.modal=null;try{i(0,`Initializing ${o.toUpperCase()} export...`),await d(o)}catch(e){n(`Error during export: ${e.message}`,e)}}),r},p=c("PDF","pdf"),m=c("PNG","png"),g=document.createElement("button");g.textContent="Cancel",g.style.cssText=`
            padding: 12px 25px;
            background: #E2E8F0;
            color: #4A5568;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.2s;
        `,g.addEventListener("mouseover",()=>{g.style.background="#CBD5E0"}),g.addEventListener("mouseout",()=>{g.style.background="#E2E8F0"}),g.addEventListener("click",()=>{t.remove(),a.modal=null}),s.appendChild(p),s.appendChild(m),s.appendChild(g),o.appendChild(r),o.appendChild(l),o.appendChild(s),t.appendChild(o),document.body.appendChild(t),a.modal=t}()}();
