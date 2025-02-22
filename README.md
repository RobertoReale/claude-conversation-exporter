# Claude Conversation Exporter

A simple JavaScript bookmarklet that allows you to export Claude AI conversations to beautifully formatted PDFs or PNG screenshots directly from your browser. Convert your important conversations into shareable, printable documents with just one click.

## Overview

This is a bookmarklet that allows you to export Claude conversations to either PDF or PNG format directly from your browser.

## Features

* Converts Claude conversation messages to a nicely formatted PDF
* Captures high-quality PNG screenshots of entire conversations
* Uses html2pdf.js for PDF generation
* Uses html2canvas for screenshot generation
* Handles lists, paragraphs, and page breaks
* Dynamically loads required libraries if not already present
* Properly formats and styles all conversation elements including code blocks and lists
* Adds title and timestamp to exports

## Installation

### Method 1: Bookmarklet

1. Create a new bookmark in your browser
2. Edit the bookmark
3. Replace the URL with the minified version of the code (see below)

## Usage

1. Open a conversation in Claude
2. Click the bookmarklet
3. Based on the version you're using:
   - PDF version: A PDF will be generated and downloaded automatically
   - Screenshot version: A PNG screenshot will be generated and downloaded automatically

## Bookmarklet Code

Copy the minified version of the code below and create a new bookmark with this as the URL:

PDF:
```javascript
javascript:!function(){if(!window.location.href.includes("claude.ai")){alert("This bookmarklet only works on Claude chat pages");return}function e(e){return new Promise((t,n)=>{if(document.querySelector(`script[src="${e}"]`)){t();return}let i=document.createElement("script");i.src=e,i.onload=t,i.onerror=n,document.head.appendChild(i)})}Promise.all([e("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),e("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js")]).then(function e(){let t=document.querySelector("div.flex-1.flex.flex-col.gap-3.px-4");if(!t){alert("Could not find Claude chat container");return}let n=document.createElement("style");n.textContent=`
            .pdf-container {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
            }
            .pdf-container ol {
                list-style-type: decimal !important;
                padding-left: 2.5em !important;
                margin-left: 0.5em !important;
                margin-top: 1em !important;
                margin-bottom: 1em !important;
            }
            .pdf-container ol li {
                padding-left: 0.5em !important;
                margin-bottom: 0.5em !important;
            }
            .pdf-container ul {
                list-style-type: disc !important;
                padding-left: 2.5em !important;
                margin-left: 0.5em !important;
                margin-top: 1em !important;
                margin-bottom: 1em !important;
            }
            .pdf-container ul li {
                padding-left: 0.5em !important;
                margin-bottom: 0.5em !important;
            }
            .pdf-container img {
                display: inline-block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            }
            .pdf-container pre, .pdf-container code {
                font-family: 'Courier New', Courier, monospace !important;
                font-smooth: never;
                -webkit-font-smoothing: none;
            }
            body > div:last-child img {
                display: inline-block;
            }
        `,document.head.appendChild(n),t.classList.add("pdf-container"),document.querySelectorAll("div.font-user-message").forEach(e=>{e.style.position="relative"});let i=document.querySelector("button[data-testid='chat-menu-trigger']")?.textContent||"",o=i.trim().toLowerCase().replace(/^[^\w\d]+|[^\w\d]+$/g,"").replace(/[\s\W-]+/g,"-")||"claude",r=document.createElement("div");r.style.cssText=`
            position: absolute;
            left: 0;
            right: 0;
            top: 8px;
            text-align: center;
            margin-bottom: 2em;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        `;let a=document.createElement("h1");a.textContent=i,a.style.fontSize="18px",a.style.fontWeight="600";let l=document.createElement("p");l.textContent=new Date().toLocaleString(),l.style.cssText="font-size: 12px; opacity: 0.7;",r.appendChild(a),r.appendChild(l),t.prepend(r);let s=Math.max(2,window.devicePixelRatio||1);html2canvas(t,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:s,scrollY:-window.scrollY,windowWidth:document.documentElement.offsetWidth,windowHeight:document.documentElement.offsetHeight,onclone(e){let t=e.querySelector(".pdf-container");t.style.padding="20px",t.style.width="100%",t.querySelectorAll("pre, code").forEach(e=>{e.style.fontFamily="Courier New, Courier, monospace",e.style.fontSize="14px",e.style.lineHeight="1.4"})}}).then(e=>{let{jsPDF:t}=window.jspdf,n=new t({orientation:"p",unit:"px",format:[e.width/s,e.height/s],hotfixes:["px_scaling"],compress:!0}),i=e.toDataURL("image/jpeg",1);n.addImage(i,"JPEG",0,0,e.width/s,e.height/s,void 0,"FAST"),n.save(`${o}.pdf`)}).then(()=>{n.remove(),r.remove(),t.classList.remove("pdf-container")}).catch(e=>{alert("Error generating PDF: "+e.message),n?.remove(),r?.remove(),t.classList.remove("pdf-container")})}).catch(e=>alert("Error loading required libraries: "+e.message))}();
```

PNG:
```javascript
javascript:!function(){let e={MAIN_CONTAINER:"div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",CHAT_TITLE:"button[data-testid='chat-menu-trigger']",USER_MESSAGES:"div.font-user-message"},t=!1,n={styleSheet:null,header:null,containerClass:!1};function a(e,t=null){console.error(e,t),i(e,"error"),o()}function i(e,t="info"){let n=document.createElement("div");n.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${"error"===t?"#ff4444":"#44aa44"};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `,n.textContent=e,document.body.appendChild(n),setTimeout(()=>n.remove(),3e3)}function o(){if(n.styleSheet&&n.styleSheet.remove(),n.header&&n.header.remove(),n.containerClass){let t=document.querySelector(e.MAIN_CONTAINER);t&&t.classList.remove("screenshot-container")}n={styleSheet:null,header:null,containerClass:!1}}if(!window.location.href.includes("claude.ai")){a("This bookmarklet only works on Claude chat pages");return}if(t){a("Screenshot generation already in progress");return}if("undefined"==typeof html2canvas){t=!0;let r=document.createElement("script");r.src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",r.onload=()=>{t=!1,l().catch(e=>a("Screenshot generation failed",e))},r.onerror=()=>{t=!1,a("Failed to load html2canvas library")},document.head.appendChild(r)}else l().catch(e=>a("Screenshot generation failed",e));async function l(){let t=document.querySelector(e.MAIN_CONTAINER);if(!t)throw Error("Could not find Claude chat container");let a=document.createElement("style");a.textContent=`
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
            .screenshot-container img {
                display: inline-block;
                max-width: 100%;
                height: auto;
            }
            body > div:last-child img {
                display: inline-block;
                max-width: 100%;
                height: auto;
            }
            .chat-title-container {
                margin-bottom: 1rem;
                margin-top: 1rem;
            }
            .chat-title-text {
                font-size: 18px;
                margin-bottom: 4px;
            }
            .chat-timestamp {
                font-size: 12px;
                opacity: 0.7;
            }
        `,document.head.appendChild(a),n.styleSheet=a,t.classList.add("screenshot-container"),n.containerClass=!0;let r=document.querySelector(e.CHAT_TITLE),l=r?.textContent||"Claude Chat",s=l.trim().toLowerCase().replace(/^[^\w\d]+|[^\w\d]+$/g,"").replace(/[\s\W-]+/g,"-")||"claude",c=document.createElement("div"),d=document.createElement("div");d.className="mb-1 mt-1";let m=document.createElement("div");m.className="chat-title-text",m.textContent=l;let p=document.createElement("div");p.className="chat-timestamp",p.textContent=new Date().toLocaleTimeString(),d.appendChild(m),d.appendChild(p),c.appendChild(d),t.insertBefore(c,t.firstChild),n.header=c;try{let h=await html2canvas(t,{logging:!1,letterRendering:1,foreignObjectRendering:!1,useCORS:!0,scale:window.devicePixelRatio||1,onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.padding="20px")}}),g=h.toDataURL("image/png"),f=document.createElement("a");f.download=`${s}-${Date.now()}.png`,f.href=g,f.click(),i("Screenshot saved successfully")}finally{o()}}}();
```

## Development

1. Clone the repository
2. Open `bookmarklet.js`
3. Make changes
4. Use a JavaScript minifier to create the bookmarklet version

## Dependencies

* html2pdf.js
* html2canvas
* jspdf

## License

MIT License
