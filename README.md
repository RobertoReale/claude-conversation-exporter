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
javascript:!function(){let e={MAIN_CONTAINER:"div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",CHAT_TITLE:"button[data-testid='chat-menu-trigger']",USER_MESSAGES:"div.font-user-message"},t={SCALE:2,IMAGE_QUALITY:1,DPI:300},a=!1,n={styleSheet:null,header:null,containerClass:!1};function o(e,t=null){console.error(e,t),i(e,"error"),r()}function i(e,t="info"){let a=document.createElement("div");a.style.cssText=`
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${"error"===t?"#ff4444":"#44aa44"};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `,a.textContent=e,document.body.appendChild(a),setTimeout(()=>a.remove(),3e3)}function r(){if(n.styleSheet&&n.styleSheet.remove(),n.header&&n.header.remove(),n.containerClass){let t=document.querySelector(e.MAIN_CONTAINER);t&&t.classList.remove("screenshot-container")}n={styleSheet:null,header:null,containerClass:!1}}if(!window.location.href.includes("claude.ai")){o("This bookmarklet only works on Claude chat pages");return}if(a){o("PDF generation already in progress");return}function l(e){return new Promise((t,a)=>{let n=document.createElement("script");n.src=e,n.onload=t,n.onerror=()=>a(Error(`Failed to load ${e}`)),document.head.appendChild(n)})}async function s(){a=!0;try{"undefined"==typeof html2canvas&&await l("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"),"undefined"==typeof jspdf&&await l("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"),a=!1,await c()}catch(e){a=!1,o("Failed to load required libraries",e)}}async function c(){let a=document.querySelector(e.MAIN_CONTAINER);if(!a)throw Error("Could not find Claude chat container");let o=document.createElement("style");o.textContent=`
            .screenshot-container {
                background-color: white !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
                line-height: 1.6 !important;
            }
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
            .screenshot-container pre,
            .screenshot-container code {
                font-family: 'Courier New', Courier, monospace !important;
                background-color: #f5f5f5 !important;
                padding: 0.5em !important;
                border-radius: 4px !important;
                margin: 1em 0 !important;
            }
            body > div:last-child img {
                display: inline-block;
                max-width: 100%;
                height: auto;
            }
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
        `,document.head.appendChild(o),n.styleSheet=o,a.classList.add("screenshot-container"),n.containerClass=!0;let l=document.querySelector(e.CHAT_TITLE),s=l?.textContent||"Claude Chat",c=s.trim().toLowerCase().replace(/^[^\w\d]+|[^\w\d]+$/g,"").replace(/[\s\W-]+/g,"-")||"claude",d=document.createElement("div"),m=document.createElement("div");m.className="mb-1 mt-1";let p=document.createElement("div");p.className="chat-title-text",p.textContent=s;let h=document.createElement("div");h.className="chat-timestamp",h.textContent=new Date().toLocaleString(),m.appendChild(p),m.appendChild(h),d.appendChild(m),a.insertBefore(d,a.firstChild),n.header=d;try{i("Generating high-quality PDF...");let f=await html2canvas(a,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:t.SCALE*(window.devicePixelRatio||1),allowTaint:!1,backgroundColor:"#ffffff",imageTimeout:0,onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.padding="40px",t.style.webkitFontSmoothing="antialiased",t.style.mozOsxFontSmoothing="grayscale")}}),{jsPDF:g}=window.jspdf,u=new g({orientation:"portrait",unit:"px",format:[f.width,f.height],hotfixes:["px_scaling"],compress:!0});u.setProperties({title:s,creator:"Claude Chat Export",subject:"Chat Conversation",keywords:"claude, chat, conversation",creationDate:new Date}),u.addImage(f.toDataURL("image/jpeg",t.IMAGE_QUALITY),"JPEG",0,0,f.width,f.height,void 0,"FAST",0),u.save(`${c}-${Date.now()}.pdf`),i("High-quality PDF saved successfully")}finally{r()}}s().catch(e=>o("PDF generation failed",e))}();
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
