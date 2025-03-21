javascript:!function(){let e={MAIN_CONTAINER:"div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",CHAT_TITLE:"button[data-testid='chat-menu-trigger']",DOCUMENT_CONTAINERS:"div.mx-0\\.5.mb-3.flex.flex-wrap.gap-2",DOCUMENT_ITEMS:".font-styrene.transition-all.rounded-lg",DISCLAIMER_CONTAINER:"div.ml-1.mt-0\\.5.flex.items-center.transition-transform.duration-300.ease-out"},t={HTML2CANVAS_URL:"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",JSPDF_URL:"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"},r=!1,n={styleSheet:null,modal:null,progressBar:null,tempElements:[]},l={limit:null,order:"start",removeDocuments:!0};function o(e,t=null){console.error(e,t),a(e,"error"),s()}function a(e,t="info"){let r=document.createElement("div");r.style.cssText=`
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
        `,r.textContent=e,document.body.appendChild(r),n.tempElements.push(r),setTimeout(()=>{r.style.opacity="0",setTimeout(()=>{if(r.parentNode){r.remove();let e=n.tempElements.indexOf(r);e>-1&&n.tempElements.splice(e,1)}},300)},3e3)}function i(e,t="Processing..."){if(!n.progressBar){let r=document.createElement("div");r.style.cssText=`
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
            `;let l=document.createElement("div");l.style.marginBottom="10px",l.textContent=t,r.appendChild(l);let o=document.createElement("div");o.style.cssText=`
                width: 100%;
                height: 10px;
                background: #333;
                border-radius: 5px;
                overflow: hidden;
            `;let a=document.createElement("div");a.style.cssText=`
                height: 100%;
                background: #44aa44;
                width: 0%;
                transition: width 0.3s ease;
            `,o.appendChild(a),r.appendChild(o);let i=document.createElement("div");i.style.marginTop="5px",i.textContent="0%",r.appendChild(i),document.body.appendChild(r),n.progressBar={container:r,fill:a,text:i,message:l},n.tempElements.push(r)}n.progressBar&&(n.progressBar.fill.style.width=`${e}%`,n.progressBar.text.textContent=`${Math.round(e)}%`,t!==n.progressBar.message.textContent&&(n.progressBar.message.textContent=t),e>=100&&setTimeout(()=>{if(n.progressBar&&n.progressBar.container&&n.progressBar.container.parentNode){n.progressBar.container.remove();let e=n.tempElements.indexOf(n.progressBar.container);e>-1&&n.tempElements.splice(e,1),n.progressBar=null}},500))}function s(){n.styleSheet&&n.styleSheet.parentNode&&n.styleSheet.remove(),n.modal&&n.modal.parentNode&&n.modal.remove(),n.progressBar&&n.progressBar.container&&n.progressBar.container.parentNode&&n.progressBar.container.remove(),n.tempElements.forEach(e=>{e&&e.parentNode&&e.remove()}),n={styleSheet:null,modal:null,progressBar:null,tempElements:[]},r=!1}function d(e){return new Promise((t,r)=>{let l=document.createElement("script");l.src=e,l.onload=t,l.onerror=()=>r(Error(`Unable to load ${e}`)),document.head.appendChild(l),n.tempElements.push(l)})}async function p(e){if(!r){r=!0;try{"undefined"==typeof html2canvas&&(i(10,"Loading html2canvas..."),await d(t.HTML2CANVAS_URL)),"pdf"===e&&"undefined"==typeof jspdf&&(i(30,"Loading jsPDF..."),await d(t.JSPDF_URL)),i(50,"Preparing content..."),r=!1,await c(e)}catch(n){r=!1,o(`Unable to load required libraries: ${n.message}`,n)}}}async function c(t){try{let r=document.querySelector(e.MAIN_CONTAINER);if(!r)throw Error("Chat conversation container not found");let a=r.cloneNode(!0);l&&function t(r,n){try{var l;let o=Array.from(r.querySelectorAll(".group"));if(n.limit&&n.limit<o.length){let a;a="start"===n.order?o.slice(0,n.limit):"end"===n.order?o.slice(-n.limit):o,o.forEach(e=>{e.parentNode&&e.remove()});let i=r.querySelector(".chat-title-container");i?a.forEach(e=>i.parentNode.insertBefore(e,i.nextSibling)):a.forEach(e=>r.appendChild(e))}!function t(r){try{let n=r.querySelectorAll(e.DOCUMENT_CONTAINERS);n.forEach(t=>{let r=t.querySelectorAll(e.DOCUMENT_ITEMS);r.length>0&&(r.length===t.children.length?t.remove():r.forEach(e=>e.remove()));let n=t.querySelectorAll(".object-cover");n.forEach(e=>{let t=e.closest("div:not(.group)");t?t.remove():e.remove()})});let l=r.querySelectorAll(".object-cover");l.forEach(e=>{let t=e.closest("div:not(.group)");t?t.remove():e.remove()})}catch(o){console.error("Error removing document attachments:",o)}}(r),function t(r){try{let n=r.querySelectorAll(e.DISCLAIMER_CONTAINER);n.forEach(e=>{let t=e.parentNode;e.remove(),t&&0===t.childNodes.length&&t.remove()})}catch(l){console.error("Error removing unused spaces:",l)}}(r),l=r,["m-1","m-2","m-3","m-4","m-5","m-6","m-7","m-8","m-9","m-10","m-11","m-12","mb-1","mb-2","mb-3","mb-4","mb-5","mb-6","mb-7","mb-8","mb-9","mb-10","mb-11","mb-12","mt-1","mt-2","mt-3","mt-4","mt-5","mt-6","mt-7","mt-8","mt-9","mt-10","mt-11","mt-12","mr-1","mr-2","mr-3","mr-4","mr-5","mr-6","mr-7","mr-8","mr-9","mr-10","mr-11","mr-12","ml-1","ml-2","ml-3","ml-4","ml-5","ml-6","ml-7","ml-8","ml-9","ml-10","ml-11","ml-12","py-1","py-2","py-3","py-4","py-5","py-6","py-7","py-8","py-9","py-10","py-11","py-12","px-1","px-2","px-3","px-4","px-5","px-6","px-7","px-8","px-9","px-10","px-11","px-12"].forEach(e=>{l.querySelectorAll("."+e).forEach(t=>{t.classList.remove(e)})}),function e(t){let r=!0;for(;r;){r=!1;let n=t.querySelectorAll("*");n.forEach(e=>{e===t||e.hasChildNodes()&&""!==e.textContent.trim()||(e.remove(),r=!0)})}}(r)}catch(s){console.error("Error applying export options:",s)}}(a,l);let i=document.querySelector(e.CHAT_TITLE),s=i?i.textContent:"Claude Chat",d=document.createElement("div");d.className="chat-title-container",d.style.cssText=`
                padding: 15px 0;
                margin-bottom: 20px;
                border-bottom: 1px solid #eaeaea;
                text-align: center;
            `;let p=document.createElement("div");p.className="chat-title-text",p.style.cssText=`
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            `,p.textContent=s;let c=document.createElement("div");c.className="chat-timestamp",c.style.cssText=`
                font-size: 14px;
                color: #666;
            `,c.textContent=new Date().toLocaleString(),d.appendChild(p),d.appendChild(c),a.insertBefore(d,a.firstChild);let y=document.createElement("div");if(y.classList.add("screenshot-container"),y.style.cssText=`
                width: 800px;
                margin: 0 auto;
                background-color: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                border-radius: 8px;
                padding: 0; /* <-- azzerato */
                position: absolute;
                left: -9999px;
                top: 0;
            `,y.appendChild(a),document.body.appendChild(y),n.tempElements.push(y),"pdf"===t?await m(y,s):await g(y,s),y.parentNode){y.remove();let $=n.tempElements.indexOf(y);$>-1&&n.tempElements.splice($,1)}}catch(u){o(`Error preparing export: ${u.message}`,u)}}async function m(e,t){try{a("Generating optimized PDF..."),i(60,"Rendering content..."),y(e),$(e),u(e);let r=Math.min(1.5,window.devicePixelRatio||1),n=await html2canvas(e,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:r,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.webkitFontSmoothing="antialiased",t.style.mozOsxFontSmoothing="grayscale")}});i(80,"Creating PDF...");let l=n.toDataURL("image/jpeg",1),{jsPDF:d}=window.jspdf,p=new d({compress:!0,precision:2}),c=p.internal.pageSize.getWidth(),m=p.internal.pageSize.getHeight(),g=c,x=n.height*g/n.width,h=Math.ceil(x/m);h>1&&i(85,`Creating ${h} page PDF...`),p.addImage(l,"JPEG",0,0,g,x);let f=x-m,E=1;for(;f>0;)E++,i(85+E/h*10,`Adding page ${E}/${h}...`),p.addPage(),p.addImage(l,"JPEG",0,-(m*(E-1)),g,x),f-=m;i(95,"Optimizing PDF..."),p.setProperties({title:`Claude Chat: ${t}`,subject:"Chat conversation with Claude",creator:"Claude Chat Exporter",author:"Claude User",keywords:"claude, chat, conversation",creationDate:new Date}),i(100,"Saving PDF..."),p.save(`${t}-${Date.now()}.pdf`),a("Optimized PDF saved successfully"),s()}catch(_){o(`Error generating PDF: ${_.message}`,_)}}async function g(e,t){try{a("Generating PNG..."),i(60,"Rendering content..."),y(e),$(e),u(e);let r=await html2canvas(e,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:2*window.devicePixelRatio||2,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.padding="0")}});i(90,"Creating PNG image...");let n=r.toDataURL("image/png");i(100,"Saving PNG...");let l=document.createElement("a");l.download=`${t}-${Date.now()}.png`,l.href=n,l.click(),a("Screenshot saved successfully"),s()}catch(d){o(`Error generating PNG: ${d.message}`,d)}}function y(e){try{let t=e.querySelectorAll("pre");t.forEach(e=>{if(!e.classList.contains("language-")){let t=e.querySelector("code");if(t&&t.className){let r=t.className.match(/language-(\w+)/);r?e.classList.add(`language-${r[1]}`):e.classList.add("language-plaintext")}else e.classList.add("language-plaintext")}e.style.backgroundColor="#282c34",e.style.color="#abb2bf",e.style.padding="15px",e.style.borderRadius="8px",e.style.overflowX="auto",e.style.fontSize="14px",e.style.fontFamily="'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"});let r=e.querySelectorAll("code:not(pre code)");r.forEach(e=>{e.style.backgroundColor="rgba(0, 0, 0, 0.05)",e.style.color="var(--danger-000, #8B0000)",e.style.padding="0px 4px",e.style.margin="0 2px",e.style.border="0.5px solid var(--border-300, #DDD)",e.style.borderRadius="0.3rem",e.style.fontSize="0.9rem",e.style.fontFamily="'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace",e.style.whiteSpace="pre-wrap"})}catch(n){console.error("Error processing code formatting:",n)}}function $(e){try{let t=e.querySelectorAll(".katex, .katex-display, .katex-html");t.forEach(e=>{e.style.display="inline-block",e.style.textRendering="auto",e.style.fontSize="1.1em",e.style.fontFamily="KaTeX_Main, Times New Roman, serif";let t=e.querySelectorAll(".frac-line");t.forEach(e=>{e.style.position="relative",e.style.display="block",e.style.margin="0.1em 0",e.style.borderBottom="1px solid",e.style.borderTop="0"});let r=e.querySelectorAll(".num");r.forEach(e=>{e.style.display="block",e.style.textAlign="center",e.style.marginBottom="0.15em"});let n=e.querySelectorAll(".den");n.forEach(e=>{e.style.display="block",e.style.textAlign="center",e.style.marginTop="0.15em"})});let r=e.querySelectorAll(".katex-display");r.forEach(e=>{e.style.display="block",e.style.margin="1em 0",e.style.textAlign="center",e.style.overflow="visible"})}catch(n){console.error("Error processing KaTeX formatting:",n)}}function u(e){try{let t=e.querySelectorAll("strong, b");t.forEach(e=>{e.style.fontWeight="700",e.style.verticalAlign="baseline",e.style.position="static",e.style.display="inline",e.style.lineHeight="inherit",e.style.paddingTop="0",e.style.paddingBottom="0",e.style.marginTop="0",e.style.marginBottom="0",e.style.transform="none",e.style.float="none"})}catch(r){console.error("Error processing bold text formatting:",r)}}try{!function e(){if(!r)try{let t=document.createElement("div");t.style.cssText=`
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
            `;let a=document.createElement("div");a.style.cssText=`
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            `;let d=document.createElement("h2");d.textContent="Export Claude Chat",d.style.margin="0 0 20px 0";let c=document.createElement("p");c.textContent="Choose export format and message limit:",c.style.margin="0 0 25px 0";let m=document.createElement("div");m.style.margin="20px 0";let g=document.createElement("label");g.textContent="Number of messages to export: ",g.style.marginRight="10px";let y=document.createElement("input");y.type="number",y.id="messageLimitInput",y.min="1",y.placeholder="Leave empty for all",y.style.padding="5px",y.style.borderRadius="3px",y.style.border="1px solid #ccc",y.style.width="150px",g.appendChild(y),m.appendChild(g);let $=document.createElement("div");$.textContent="Message order:",$.style.marginTop="15px",$.style.marginBottom="5px",m.appendChild($);let u=document.createElement("div");u.style.display="flex",u.style.justifyContent="center",u.style.gap="20px",u.style.margin="5px 0 15px 0";let x=document.createElement("input");x.type="radio",x.name="messageOrder",x.value="start",x.id="orderStart",x.checked=!0;let h=document.createElement("label");h.textContent="From beginning",h.setAttribute("for","orderStart"),h.style.marginLeft="5px";let f=document.createElement("input");f.type="radio",f.name="messageOrder",f.value="end",f.id="orderEnd";let E=document.createElement("label");E.textContent="From end",E.setAttribute("for","orderEnd"),E.style.marginLeft="5px";let _=document.createElement("div");_.style.display="flex",_.style.alignItems="center",_.appendChild(x),_.appendChild(h);let b=document.createElement("div");b.style.display="flex",b.style.alignItems="center",b.appendChild(f),b.appendChild(E),u.appendChild(_),u.appendChild(b),m.appendChild(u),a.appendChild(d),a.appendChild(c),a.appendChild(m);let C=document.createElement("div");C.style.cssText="display: flex; justify-content: space-around; margin-top: 20px;";let v=()=>{let e=parseInt(document.getElementById("messageLimitInput").value);return{limit:isNaN(e)?null:e,order:document.querySelector('input[name="messageOrder"]:checked').value,removeDocuments:!0}},S=(e,r)=>{let n=document.createElement("button");return n.textContent=e,n.style.cssText="padding: 12px 25px; background: #5A67D8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.2s;",n.addEventListener("mouseover",()=>{n.style.background="#4C51BF"}),n.addEventListener("mouseout",()=>{n.style.background="#5A67D8"}),n.addEventListener("click",async()=>{try{l=v(),t.parentNode&&t.remove(),i(0,`Initializing ${r.toUpperCase()} export...`),await p(r)}catch(e){o(`Error during export: ${e.message}`,e)}}),n},w=S("PDF","pdf"),N=S("PNG","png"),T=document.createElement("button");T.textContent="Cancel",T.style.cssText="padding: 12px 25px; background: #E2E8F0; color: #4A5568; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.2s;",T.addEventListener("mouseover",()=>{T.style.background="#CBD5E0"}),T.addEventListener("mouseout",()=>{T.style.background="#E2E8F0"}),T.addEventListener("click",()=>{t.parentNode&&t.remove(),s()}),C.appendChild(w),C.appendChild(N),C.appendChild(T),a.appendChild(C),t.appendChild(a),document.body.appendChild(t),n.modal=t,n.tempElements.push(t)}catch(A){o(`Error showing modal: ${A.message}`,A)}}()}catch(x){o(`Error initializing exporter: ${x.message}`,x)}}();
