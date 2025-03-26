javascript:!function(){let e={MAIN_CONTAINER:"div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",CHAT_TITLE:"button[data-testid='chat-menu-trigger']",USER_MESSAGES:"div.font-user-message",CLAUDE_MESSAGES:"div[data-testid='chat-message-content']",DOCUMENT_CONTAINERS:"div.mx-0\\.5.mb-3.flex.flex-wrap.gap-2",DOCUMENT_ITEMS:".font-styrene.transition-all.rounded-lg",DISCLAIMER_CONTAINER:"div.ml-1.mt-0\\.5.flex.items-center.transition-transform.duration-300.ease-out",CODE_BLOCKS:"pre",INLINE_CODE:"code:not(pre code)",MATH_ELEMENTS:".katex, .katex-display, .math, .math-display"},t={HTML2CANVAS_URL:"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",JSPDF_URL:"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"},r=!1,n={styleSheet:null,modal:null,progressBar:null,tempElements:[]},o={limit:null,order:"start",removeDocuments:!0,addMessageLabels:!0};function a(e,t=null){console.error(e,t),i(e,"error"),s()}function i(e,t="info"){let r=document.createElement("div");r.style.cssText=`
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
        `,r.textContent=e,document.body.appendChild(r),n.tempElements.push(r),setTimeout(()=>{r.style.opacity="0",setTimeout(()=>{if(r.parentNode){r.remove();let e=n.tempElements.indexOf(r);e>-1&&n.tempElements.splice(e,1)}},300)},3e3)}function l(e,t="Processing..."){if(!n.progressBar){let r=document.createElement("div");r.style.cssText=`
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
            `;let o=document.createElement("div");o.style.marginBottom="10px",o.textContent=t,r.appendChild(o);let a=document.createElement("div");a.style.cssText=`
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
            `,a.appendChild(i),r.appendChild(a);let l=document.createElement("div");l.style.marginTop="5px",l.textContent="0%",r.appendChild(l),document.body.appendChild(r),n.progressBar={container:r,fill:i,text:l,message:o},n.tempElements.push(r)}n.progressBar&&(n.progressBar.fill.style.width=`${e}%`,n.progressBar.text.textContent=`${Math.round(e)}%`,t!==n.progressBar.message.textContent&&(n.progressBar.message.textContent=t),e>=100&&setTimeout(()=>{if(n.progressBar&&n.progressBar.container&&n.progressBar.container.parentNode){n.progressBar.container.remove();let e=n.tempElements.indexOf(n.progressBar.container);e>-1&&n.tempElements.splice(e,1),n.progressBar=null}},500))}function s(){n.styleSheet&&n.styleSheet.parentNode&&n.styleSheet.remove(),n.modal&&n.modal.parentNode&&n.modal.remove(),n.progressBar&&n.progressBar.container&&n.progressBar.container.parentNode&&n.progressBar.container.remove(),n.tempElements.forEach(e=>{e&&e.parentNode&&e.remove()}),n={styleSheet:null,modal:null,progressBar:null,tempElements:[]},r=!1}function m(e){return new Promise((t,r)=>{let o=document.createElement("script");o.src=e,o.onload=t,o.onerror=()=>r(Error(`Unable to load ${e}`)),document.head.appendChild(o),n.tempElements.push(o)})}async function p(e){if(!r){r=!0;try{"undefined"==typeof html2canvas&&(l(10,"Loading html2canvas..."),await m(t.HTML2CANVAS_URL)),"pdf"===e&&"undefined"==typeof jspdf&&(l(30,"Loading jsPDF..."),await m(t.JSPDF_URL)),l(50,"Preparing content..."),r=!1,await d(e)}catch(n){r=!1,a(`Unable to load required libraries: ${n.message}`,n)}}}async function d(t){try{if(!window.location.href.includes("claude.ai"))throw Error("This bookmarklet only works on Claude chat pages");let r=document.querySelector(e.MAIN_CONTAINER);if(!r)throw Error("Chat conversation container not found");let i=r.cloneNode(!0);o&&function t(r,n){try{var o;let a=Array.from(r.querySelectorAll(".group"));if(n.limit&&n.limit<a.length){let i;i="start"===n.order?a.slice(0,n.limit):"end"===n.order?a.slice(-n.limit):a,a.forEach(e=>{e.parentNode&&e.remove()});let l=r.querySelector(".chat-title-container");l?i.forEach(e=>l.parentNode.insertBefore(e,l.nextSibling)):i.forEach(e=>r.appendChild(e))}if(n.addMessageLabels){let s=r.querySelectorAll('[data-testid="chat-message"]');s.forEach(e=>{let t=e.querySelector(".font-user-message"),r=e.querySelector('[data-testid="chat-message-content"]');if(r&&!r.querySelector(".message-role")){let n=document.createElement("div");n.className="message-role",n.textContent=t?"You:":"Claude:",r.insertBefore(n,r.firstChild)}})}!function t(r){try{let n=r.querySelectorAll(e.DOCUMENT_CONTAINERS);n.forEach(t=>{let r=t.querySelectorAll(e.DOCUMENT_ITEMS);r.length>0&&(r.length===t.children.length?t.remove():r.forEach(e=>e.remove()));let n=t.querySelectorAll(".object-cover");n.forEach(e=>{let t=e.closest("div:not(.group)");t?t.remove():e.remove()})});let o=r.querySelectorAll(".object-cover");o.forEach(e=>{let t=e.closest("div:not(.group)");t?t.remove():e.remove()})}catch(a){console.error("Error removing document attachments:",a)}}(r),function t(r){try{let n=r.querySelectorAll(e.DISCLAIMER_CONTAINER);n.forEach(e=>{let t=e.parentNode;e.remove(),t&&0===t.childNodes.length&&t.remove()})}catch(o){console.error("Error removing unused spaces:",o)}}(r),o=r,["m-1","m-2","m-3","m-4","m-5","m-6","m-7","m-8","m-9","m-10","m-11","m-12","mb-1","mb-2","mb-3","mb-4","mb-5","mb-6","mb-7","mb-8","mb-9","mb-10","mb-11","mb-12","mt-1","mt-2","mt-3","mt-4","mt-5","mt-6","mt-7","mt-8","mt-9","mt-10","mt-11","mt-12","mr-1","mr-2","mr-3","mr-4","mr-5","mr-6","mr-7","mr-8","mr-9","mr-10","mr-11","mr-12","ml-1","ml-2","ml-3","ml-4","ml-5","ml-6","ml-7","ml-8","ml-9","ml-10","ml-11","ml-12","py-1","py-2","py-3","py-4","py-5","py-6","py-7","py-8","py-9","py-10","py-11","py-12","px-1","px-2","px-3","px-4","px-5","px-6","px-7","px-8","px-9","px-10","px-11","px-12"].forEach(e=>{o.querySelectorAll("."+e).forEach(t=>{t.classList.remove(e)})}),function e(t){let r=!0;for(;r;){r=!1;let n=t.querySelectorAll("*");n.forEach(e=>{e===t||e.hasChildNodes()&&""!==e.textContent.trim()||(e.remove(),r=!0)})}}(r)}catch(m){console.error("Error applying export options:",m)}}(i,o);let l=document.createElement("style");l.textContent=`
                .screenshot-container {
                    background-color: white !important;
                    color: black !important;
                    padding: 20px !important;
                }
                
                /* User messages style */
                .screenshot-container .font-user-message {
                    font-family: var(--font-sans-serif, Arial, sans-serif) !important;
                    font-size: 1rem !important;
                    line-height: 1.6 !important;
                    color: hsl(var(--text-100, #333)) !important;
                    margin-bottom: 0 !important;
                    padding: 0.5px !important;
                    background-color: transparent !important;
                    border-radius: 0.25rem !important;
                }
                
                /* User message container */
                .screenshot-container [data-testid="user-message"] {
                    padding: 0 !important;
                    margin: 0 !important;
                }
                
                /* Message container styles */
                .screenshot-container .group {
                    padding: 0.75rem !important;
                    margin-bottom: 1rem !important;
                    background-color: hsl(var(--bg-100, #f8f9fa)) !important;
                    border-radius: 0.5rem !important;
                }
                
                /* Claude messages style */
                .screenshot-container [data-testid="chat-message-content"] {
                    font-family: var(--font-serif, Georgia, serif) !important;
                    font-size: 1rem !important;
                    line-height: 1.65 !important;
                    color: hsl(var(--text-100, #333)) !important;
                    letter-spacing: -0.015em !important;
                    margin-bottom: 1.5rem !important;
                    padding: 0.75rem !important;
                }
                
                /* Code block style */
                .screenshot-container pre {
                    font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace !important;
                    font-size: 0.875rem !important;
                    line-height: 1.625 !important;
                    color: #abb2bf !important;
                    background-color: #282c34 !important;
                    padding: 1em !important;
                    border-radius: 0.5rem !important;
                    tab-size: 2 !important;
                    overflow-x: auto !important;
                    margin: 1em 0 !important;
                    text-shadow: 0 1px rgba(0,0,0,.3) !important;
                    white-space: pre !important;
                    word-spacing: normal !important;
                    word-break: normal !important;
                }
                
                /* Inline code style */
                .screenshot-container code:not(pre code) {
                    font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace !important;
                    font-size: 0.9rem !important;
                    background-color: rgba(0, 0, 0, 0.05) !important;
                    color: hsl(var(--danger-000, #8B0000)) !important;
                    padding: 0px 4px !important;
                    margin: 0 2px !important;
                    border: 0.5px solid hsl(var(--border-300, #DDD)) !important;
                    border-radius: 0.3rem !important;
                    white-space: pre-wrap !important;
                }
                
                /* Strong and bold text */
                .screenshot-container strong, .screenshot-container b {
                    font-weight: 700 !important;
                    vertical-align: baseline !important;
                    position: static !important;
                    display: inline !important;
                    line-height: inherit !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    margin-top: 0 !important;
                    margin-bottom: 0 !important;
                    transform: none !important;
                    float: none !important;
                }
                
                /* KaTeX math formulas */
                .screenshot-container .katex-display {
                    display: block !important;
                    margin: 1em 0 !important;
                    text-align: center !important;
                    overflow: visible !important;
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
                
                /* Tables */
                .screenshot-container table {
                    border-collapse: collapse !important;
                    width: 100% !important;
                    margin: 1rem 0 !important;
                }
                
                .screenshot-container th {
                    background-color: hsl(var(--bg-300, #e9ecef)) !important;
                    color: hsl(var(--text-000, #212529)) !important;
                    font-weight: bold !important;
                    text-align: left !important;
                    padding: 0.75rem !important;
                    border: 1px solid hsl(var(--border-200, #dee2e6)) !important;
                }
                
                .screenshot-container td {
                    padding: 0.75rem !important;
                    border: 1px solid hsl(var(--border-200, #dee2e6)) !important;
                }
                
                .screenshot-container tr:nth-child(even) {
                    background-color: hsl(var(--bg-100, #f8f9fa)) !important;
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
                
                /* Message labels */
                .message-role {
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    color: hsl(var(--text-200, #6c757d));
                }
            `,document.head.appendChild(l),n.styleSheet=l,n.tempElements.push(l);let s=document.querySelector(e.CHAT_TITLE),m=s?s.textContent:"Claude Chat",p=document.createElement("div");p.className="chat-title-container",p.style.cssText=`
                padding: 15px 0;
                margin-bottom: 20px;
                border-bottom: 1px solid #eaeaea;
                text-align: center;
            `;let d=document.createElement("div");d.className="chat-title-text",d.style.cssText=`
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            `,d.textContent=m;let $=document.createElement("div");$.className="chat-timestamp",$.style.cssText=`
                font-size: 14px;
                color: #666;
            `,$.textContent=new Date().toLocaleString(),p.appendChild(d),p.appendChild($),i.insertBefore(p,i.firstChild);let h=document.createElement("div");if(h.classList.add("screenshot-container"),h.style.cssText=`
                width: 800px;
                margin: 0 auto;
                background-color: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                border-radius: 8px;
                padding: 0;
                position: absolute;
                left: -9999px;
                top: 0;
            `,h.appendChild(i),document.body.appendChild(h),n.tempElements.push(h),"pdf"===t?await c(h,m):await g(h,m),h.parentNode){h.remove();let y=n.tempElements.indexOf(h);y>-1&&n.tempElements.splice(y,1)}}catch(f){a(`Error preparing export: ${f.message}`,f)}}async function c(e,t){try{i("Generating optimized PDF..."),l(60,"Rendering content..."),$(e),h(e),y(e);let r=Math.min(1.5,window.devicePixelRatio||1),n=await html2canvas(e,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:r,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.webkitFontSmoothing="antialiased",t.style.mozOsxFontSmoothing="grayscale")}});l(80,"Creating PDF...");let o=n.toDataURL("image/jpeg",1),{jsPDF:m}=window.jspdf,p=new m({compress:!0,precision:2}),d=p.internal.pageSize.getWidth(),c=p.internal.pageSize.getHeight(),g=d,f=n.height*g/n.width,u=Math.ceil(f/c);u>1&&l(85,`Creating ${u} page PDF...`),p.addImage(o,"JPEG",0,0,g,f);let x=f-c,b=1;for(;x>0;)b++,l(85+b/u*10,`Adding page ${b}/${u}...`),p.addPage(),p.addImage(o,"JPEG",0,-(c*(b-1)),g,f),x-=c;l(95,"Optimizing PDF..."),p.setProperties({title:`Claude Chat: ${t}`,subject:"Chat conversation with Claude",creator:"Claude Chat Exporter",author:"Claude User",keywords:"claude, chat, conversation",creationDate:new Date}),l(100,"Saving PDF..."),p.save(`${t}-${Date.now()}.pdf`),i("Optimized PDF saved successfully"),s()}catch(_){a(`Error generating PDF: ${_.message}`,_)}}async function g(e,t){try{i("Generating PNG..."),l(60,"Rendering content..."),$(e),h(e),y(e);let r=await html2canvas(e,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:2*window.devicePixelRatio||2,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.padding="20px")}});l(90,"Creating PNG image...");let n=r.toDataURL("image/png");l(100,"Saving PNG...");let o=document.createElement("a");o.download=`${t}-${Date.now()}.png`,o.href=n,o.click(),i("Screenshot saved successfully"),s()}catch(m){a(`Error generating PNG: ${m.message}`,m)}}function $(e){try{let t=e.querySelectorAll("pre");t.forEach(e=>{if(!e.classList.contains("language-")){let t=e.querySelector("code");if(t&&t.className){let r=t.className.match(/language-(\w+)/);r?e.classList.add(`language-${r[1]}`):e.classList.add("language-plaintext")}else e.classList.add("language-plaintext")}e.style.backgroundColor="#282c34",e.style.color="#abb2bf",e.style.padding="15px",e.style.borderRadius="8px",e.style.overflowX="auto",e.style.fontSize="14px",e.style.fontFamily="'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"});let r=e.querySelectorAll("code:not(pre code)");r.forEach(e=>{e.style.backgroundColor="rgba(0, 0, 0, 0.05)",e.style.color="var(--danger-000, #8B0000)",e.style.padding="0px 4px",e.style.margin="0 2px",e.style.border="0.5px solid var(--border-300, #DDD)",e.style.borderRadius="0.3rem",e.style.fontSize="0.9rem",e.style.fontFamily="'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace",e.style.whiteSpace="pre-wrap"})}catch(n){console.error("Error processing code formatting:",n)}}function h(e){try{let t=e.querySelectorAll(".katex, .katex-display, .katex-html");t.forEach(e=>{e.style.display="inline-block",e.style.textRendering="auto",e.style.fontSize="1.1em",e.style.fontFamily="KaTeX_Main, Times New Roman, serif";let t=e.querySelectorAll(".frac-line");t.forEach(e=>{e.style.position="relative",e.style.display="block",e.style.margin="0.1em 0",e.style.borderBottom="1px solid",e.style.borderTop="0"});let r=e.querySelectorAll(".num");r.forEach(e=>{e.style.display="block",e.style.textAlign="center",e.style.marginBottom="0.15em"});let n=e.querySelectorAll(".den");n.forEach(e=>{e.style.display="block",e.style.textAlign="center",e.style.marginTop="0.15em"})});let r=e.querySelectorAll(".katex-display");r.forEach(e=>{e.style.display="block",e.style.margin="1em 0",e.style.textAlign="center",e.style.overflow="visible"})}catch(n){console.error("Error processing KaTeX formatting:",n)}}function y(e){try{let t=e.querySelectorAll("strong, b");t.forEach(e=>{e.style.fontWeight="700",e.style.verticalAlign="baseline",e.style.position="static",e.style.display="inline",e.style.lineHeight="inherit",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",e.style.transform="none",e.style.float="none"})}catch(r){console.error("Error processing bold text formatting:",r)}}if(!window.location.href.includes("claude.ai")){a("This bookmarklet only works on Claude chat pages");return}try{!function e(){if(!r)try{let t=document.createElement("div");t.style.cssText=`
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
            `;let i=document.createElement("div");i.style.cssText=`
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            `;let m=document.createElement("h2");m.textContent="Export Claude Chat",m.style.margin="0 0 20px 0";let d=document.createElement("p");d.textContent="Choose export format and message limit:",d.style.margin="0 0 25px 0";let c=document.createElement("div");c.style.margin="20px 0";let g=document.createElement("label");g.textContent="Number of messages to export: ",g.style.marginRight="10px";let $=document.createElement("input");$.type="number",$.id="messageLimitInput",$.min="1",$.placeholder="Leave empty for all",$.style.padding="5px",$.style.borderRadius="3px",$.style.border="1px solid #ccc",$.style.width="150px",g.appendChild($),c.appendChild(g);let h=document.createElement("div");h.textContent="Message order:",h.style.marginTop="15px",h.style.marginBottom="5px",c.appendChild(h);let y=document.createElement("div");y.style.display="flex",y.style.justifyContent="center",y.style.gap="20px",y.style.margin="5px 0 15px 0";let f=document.createElement("input");f.type="radio",f.name="messageOrder",f.value="start",f.id="orderStart",f.checked=!0;let u=document.createElement("label");u.textContent="From beginning",u.setAttribute("for","orderStart"),u.style.marginLeft="5px";let x=document.createElement("input");x.type="radio",x.name="messageOrder",x.value="end",x.id="orderEnd";let b=document.createElement("label");b.textContent="From end",b.setAttribute("for","orderEnd"),b.style.marginLeft="5px";let _=document.createElement("div");_.style.display="flex",_.style.alignItems="center",_.appendChild(f),_.appendChild(u);let E=document.createElement("div");E.style.display="flex",E.style.alignItems="center",E.appendChild(x),E.appendChild(b),y.appendChild(_),y.appendChild(E),c.appendChild(y);let C=document.createElement("div");C.style.display="flex",C.style.alignItems="center",C.style.justifyContent="center",C.style.margin="15px 0";let v=document.createElement("input");v.type="checkbox",v.id="addLabelsCheck",v.checked=!0;let S=document.createElement("label");S.textContent='Add "You:" and "Claude:" labels',S.setAttribute("for","addLabelsCheck"),S.style.marginLeft="8px",C.appendChild(v),C.appendChild(S),c.appendChild(C),i.appendChild(m),i.appendChild(d),i.appendChild(c);let w=document.createElement("div");w.style.cssText="display: flex; justify-content: space-around; margin-top: 20px;";let k=()=>{let e=parseInt(document.getElementById("messageLimitInput").value);return{limit:isNaN(e)?null:e,order:document.querySelector('input[name="messageOrder"]:checked').value,removeDocuments:!0,addMessageLabels:document.getElementById("addLabelsCheck").checked}},N=(e,r)=>{let n=document.createElement("button");return n.textContent=e,n.style.cssText="padding: 12px 25px; background: #5A67D8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.2s;",n.addEventListener("mouseover",()=>{n.style.background="#4C51BF"}),n.addEventListener("mouseout",()=>{n.style.background="#5A67D8"}),n.addEventListener("click",async()=>{try{o=k(),t.parentNode&&t.remove(),l(0,`Initializing ${r.toUpperCase()} export...`),await p(r)}catch(e){a(`Error during export: ${e.message}`,e)}}),n},T=N("PDF","pdf"),A=N("PNG","png"),L=document.createElement("button");L.textContent="Cancel",L.style.cssText="padding: 12px 25px; background: #E2E8F0; color: #4A5568; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.2s;",L.addEventListener("mouseover",()=>{L.style.background="#CBD5E0"}),L.addEventListener("mouseout",()=>{L.style.background="#E2E8F0"}),L.addEventListener("click",()=>{t.parentNode&&t.remove(),s()}),w.appendChild(T),w.appendChild(A),w.appendChild(L),i.appendChild(w),t.appendChild(i),document.body.appendChild(t),n.modal=t,n.tempElements.push(t)}catch(D){a(`Error showing modal: ${D.message}`,D)}}()}catch(f){a(`Error initializing exporter: ${f.message}`,f)}}();
