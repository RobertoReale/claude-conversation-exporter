# Claude Chat Export Bookmarklet

This bookmarklet allows you to easily export your Claude AI chat conversations as PDF or PNG files with a single click. The exported files maintain high quality formatting and are perfect for saving or sharing your conversations.

## Features

- **Multiple Export Formats**: Choose between PDF or PNG format
- **High Quality Exports**: Creates high-resolution, well-formatted documents
- **Single-Page PDFs**: Exports the entire conversation as one continuous PDF
- **Custom Styling**: Applies clean, readable formatting to the exported content
- **Progress Indicator**: Shows real-time progress during export
- **User-Friendly**: Simple one-click operation with clear notifications

## Installation

1. Create a new bookmark in your browser
2. Name it "Claude Export" (or any name you prefer)
3. In the URL/location field, paste the following code:

```javascript
javascript:!function(){let e={MAIN_CONTAINER:"div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",CHAT_TITLE:"button[data-testid='chat-menu-trigger']",USER_MESSAGES:"div.font-user-message"},t={HTML2CANVAS_URL:"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",JSPDF_URL:"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"},n={SCALE:2,IMAGE_QUALITY:1,DPI:300},a=!1,o={styleSheet:null,header:null,containerClass:!1,modal:null,progressBar:null};function r(e,t=null){console.error(e,t),i(e,"error"),s()}function i(e,t="info"){let n=document.createElement("div");n.style.cssText=`
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
        `,n.textContent=e,document.body.appendChild(n),setTimeout(()=>{n.style.opacity="0",setTimeout(()=>n.remove(),300)},3e3)}function l(e,t="Processing..."){if(!o.progressBar){let n=document.createElement("div");n.style.cssText=`
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
            `;let a=document.createElement("div");a.style.marginBottom="10px",a.textContent=t,n.appendChild(a);let r=document.createElement("div");r.style.cssText=`
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
            `,r.appendChild(i),n.appendChild(r);let l=document.createElement("div");l.style.marginTop="5px",l.textContent="0%",n.appendChild(l),document.body.appendChild(n),o.progressBar={container:n,fill:i,text:l,message:a}}o.progressBar.fill.style.width=`${e}%`,o.progressBar.text.textContent=`${Math.round(e)}%`,t!==o.progressBar.message.textContent&&(o.progressBar.message.textContent=t),e>=100&&setTimeout(()=>{o.progressBar&&(o.progressBar.container.remove(),o.progressBar=null)},500)}function s(){if(o.styleSheet&&o.styleSheet.remove(),o.header&&o.header.remove(),o.containerClass){let t=document.querySelector(e.MAIN_CONTAINER);t&&t.classList.remove("screenshot-container")}o.modal&&o.modal.remove(),o.progressBar&&o.progressBar.container.remove(),o={styleSheet:null,header:null,containerClass:!1,modal:null,progressBar:null}}if(!window.location.href.includes("claude.ai")){r("This bookmarklet only works on Claude chat pages");return}if(a){r("Export already in progress");return}function d(e){return new Promise((t,n)=>{let a=document.createElement("script");a.src=e,a.onload=t,a.onerror=()=>n(Error(`Unable to load ${e}`)),document.head.appendChild(a)})}async function c(e){a=!0;try{"undefined"==typeof html2canvas&&(l(10,"Loading html2canvas..."),await d(t.HTML2CANVAS_URL)),"pdf"===e&&"undefined"==typeof jspdf&&(l(30,"Loading jsPDF..."),await d(t.JSPDF_URL)),l(50,"Preparing content..."),a=!1,await p(e)}catch(n){a=!1,r(`Unable to load the required libraries: ${n.message}`,n)}}async function p(t){let n=document.querySelector(e.MAIN_CONTAINER);if(!n)throw Error("Unable to find the Claude chat container");let a=document.createElement("style");a.textContent=`
            .screenshot-container {
                background-color: white !important;
                color: black !important;
                font-family: Arial, sans-serif !important;
                line-height: 1.6 !important;
                padding: 20px !important;
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
        `,document.head.appendChild(a),o.styleSheet=a,n.classList.add("screenshot-container"),o.containerClass=!0;let r=document.querySelector(e.CHAT_TITLE),i=r?.textContent||"Claude Chat",l=i.trim().toLowerCase().replace(/^[^\w\d]+|[^\w\d]+$/g,"").replace(/[\s\W-]+/g,"-")||"claude",d=document.createElement("div");d.className="chat-title-container";let c=document.createElement("div");c.className="chat-title-text",c.textContent=i;let p=document.createElement("div");p.className="chat-timestamp",p.textContent=new Date().toLocaleString(),d.appendChild(c),d.appendChild(p),n.insertBefore(d,n.firstChild),o.header=d;try{"pdf"===t?await m(n,l):await g(n,l)}finally{s()}}async function m(e,t){i("Generating high-quality PDF..."),l(60,"Rendering content...");let a=await html2canvas(e,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:n.SCALE*(window.devicePixelRatio||1),allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.webkitFontSmoothing="antialiased",t.style.mozOsxFontSmoothing="grayscale")}});l(80,"Creating PDF...");let o=a.width,r=a.height,s=.75*o,d=.75*r,{jsPDF:c}=window.jspdf,p=new c("p","pt",[s,d]);p.setProperties({title:t,creator:"Claude Chat Export",subject:"Chat Conversation",keywords:"claude, chat, conversation",creationDate:new Date}),p.addImage(a.toDataURL("image/jpeg",n.IMAGE_QUALITY),"JPEG",0,0,s,d,void 0,"FAST"),l(100,"Saving PDF..."),p.save(`${t}-${Date.now()}.pdf`),i("High-quality PDF saved successfully (single page)")}async function g(e,t){i("Generating PNG..."),l(60,"Rendering content...");let n=await html2canvas(e,{logging:!1,letterRendering:!0,foreignObjectRendering:!1,useCORS:!0,scale:window.devicePixelRatio||1,allowTaint:!0,backgroundColor:"#ffffff",onclone(e){let t=e.querySelector(".screenshot-container");t&&(t.style.padding="20px")}});l(90,"Creating PNG image...");let a=n.toDataURL("image/png");l(100,"Saving PNG...");let o=document.createElement("a");o.download=`${t}-${Date.now()}.png`,o.href=a,o.click(),i("Screenshot saved successfully")}!function e(){let t=document.createElement("div");t.style.cssText=`
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
        `;let n=document.createElement("div");n.style.cssText=`
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        `;let a=document.createElement("h2");a.textContent="Export Claude Chat",a.style.margin="0 0 20px 0";let i=document.createElement("p");i.textContent="Choose the export format:",i.style.margin="0 0 25px 0";let s=document.createElement("div");s.style.cssText=`
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        `;let d=(e,n)=>{let a=document.createElement("button");return a.textContent=e,a.style.cssText=`
                padding: 12px 25px;
                background: #5A67D8;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: background 0.2s;
            `,a.addEventListener("mouseover",()=>{a.style.background="#4C51BF"}),a.addEventListener("mouseout",()=>{a.style.background="#5A67D8"}),a.addEventListener("click",async()=>{t.remove(),o.modal=null;try{l(0,`Initializing ${n.toUpperCase()} export...`),await c(n)}catch(e){r(`Error during export: ${e.message}`,e)}}),a},p=d("PDF","pdf"),m=d("PNG","png"),g=document.createElement("button");g.textContent="Cancel",g.style.cssText=`
            padding: 12px 25px;
            background: #E2E8F0;
            color: #4A5568;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.2s;
        `,g.addEventListener("mouseover",()=>{g.style.background="#CBD5E0"}),g.addEventListener("mouseout",()=>{g.style.background="#E2E8F0"}),g.addEventListener("click",()=>{t.remove(),o.modal=null}),s.appendChild(p),s.appendChild(m),s.appendChild(g),n.appendChild(a),n.appendChild(i),n.appendChild(s),t.appendChild(n),document.body.appendChild(t),o.modal=t}()}();
```

## How to Use

### Basic Usage

1. While in an active Claude chat conversation, click the "Claude Export" bookmark
2. Select your preferred format (PDF or PNG)
3. Wait for the export to complete (a progress bar will display)
4. The file will automatically download to your device

### Tips for Best Results

- **Before Export**: Make sure all content is fully loaded in the chat
- **Large Conversations**: For very long conversations, PDF format is recommended
- **Image Quality**: PNG format provides higher fidelity but creates larger files
- **Organization**: Files are automatically named based on the chat title with a timestamp

## Use Cases

1. **Documentation**: Save important instructions or explanations from Claude
2. **Knowledge Base**: Build a personal library of useful Claude interactions
3. **Sharing**: Send Claude's responses to colleagues or friends
4. **Archiving**: Keep a record of significant conversations for future reference
5. **Presentations**: Include Claude's insights in documents or presentations

## Troubleshooting

- **Bookmarklet Not Working**: Make sure you're on a Claude.ai chat page
- **Export Taking Too Long**: Very long conversations with many images may take longer to process
- **Format Issues**: If you notice formatting problems, try refreshing the page before exporting

## Technical Details

This bookmarklet uses the following libraries:
- html2canvas for rendering the chat content
- jsPDF for creating PDF documents (only loaded when needed)

The code applies custom styling to ensure the exported document looks clean and professional, with proper formatting for lists, code blocks, and other elements.

## Privacy & Security

This bookmarklet:
- Runs entirely in your browser
- Does not send any data to external servers
- Only processes the visible content of your Claude conversation
- Loads dependent libraries from trusted CDN sources

---
