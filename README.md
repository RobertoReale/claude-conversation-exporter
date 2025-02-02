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

### Method 2: Browser Extension (Coming Soon)

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
javascript:!function(){if("undefined"==typeof html2pdf){var e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",e.onload=t,document.head.appendChild(e)}else t();function t(){let e=document.querySelector("div.flex-1.flex.flex-col.gap-3.px-4");if(!e){alert("Could not find Claude chat container");return}let t=e.cloneNode(!0),n=document.createElement("style");n.textContent=`
        .pdf-container {
            background-color: white;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            color: #2D3748;
        }
        .pdf-container ol {
            list-style-type: decimal !important;
            padding-left: 2.5em !important;
            margin-left: .5em !important;
            margin-top: 1em !important;
            margin-bottom: 1em !important;
        }
        .pdf-container ol li {
            padding-left: .5em !important;
            margin-bottom: .5em !important;
        }
        .pdf-container ul {
            list-style-type: disc !important;
            padding-left: 2.5em !important;
            margin-left: .5em !important;
            margin-top: 1em !important;
            margin-bottom: 1em !important;
        }
        .pdf-container ul li {
            padding-left: .5em !important;
            margin-bottom: .5em !important;
        }
        .pdf-container pre, .pdf-container code {
            background-color: #F7FAFC;
            padding: 8px;
            border-radius: 4px;
            margin: 10px 0;
            overflow-x: auto;
            font-family: monospace;
        }
        .pdf-container .font-user-message,
        .pdf-container .font-claude-message {
            background-color: white;
            border-radius: 8px;
            padding: 16px;
            margin: 8px 0;
        }
        .pdf-container p {
            margin-bottom: 1em;
        }
    `,document.head.appendChild(n);let o=document.createElement("div");o.className="pdf-container";let a=document.createElement("div");a.style.textAlign="center",a.style.marginBottom="30px";let i=document.createElement("h1");i.style.fontSize="18px",i.style.marginBottom="10px",i.textContent=document.querySelector("button[data-testid='chat-menu-trigger']")?.textContent||"Chat Conversation";let r=document.createElement("div");r.style.fontSize="12px",r.style.color="#666",r.style.opacity="0.7",r.textContent=new Date().toLocaleString(),a.appendChild(i),a.appendChild(r),o.appendChild(a),o.appendChild(t);let l={margin:[20,20,20,20],filename:"claude-chat.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,logging:!1,scrollY:-window.scrollY,windowHeight:document.documentElement.offsetHeight},jsPDF:{unit:"mm",format:"a4",orientation:"portrait"},pagebreak:{mode:["avoid-all","css","legacy"]}};html2pdf().from(o).set(l).save().then(()=>{console.log("PDF generated successfully!"),n.remove()}).catch(e=>{console.error("Error generating PDF:",e),alert("Error generating PDF. Check console for details."),n.remove()})}}();
```

IMG:
```javascript
javascript:(function()%7Bif(!window.location.href.includes(%27claude.ai%27))%7Balert(%27This bookmarklet only works on Claude chat pages%27)%3Breturn%7Dif(typeof html2canvas%3D%3D%3D%27undefined%27)%7Bvar script%3Ddocument.createElement(%27script%27)%3Bscript.src%3D%27https%3A%2F%2Fcdnjs.cloudflare.com%2Fajax%2Flibs%2Fhtml2canvas%2F1.4.1%2Fhtml2canvas.min.js%27%3Bscript.onload%3DinitScreenshot%3Bdocument.head.appendChild(script)%7Delse%7BinitScreenshot()%7Dfunction initScreenshot()%7Bconst mainContainer%3Ddocument.querySelector("div.flex-1.flex.flex-col.gap-3.px-4")%3Bif(!mainContainer)%7Balert(%27Could not find Claude chat container%27)%3Breturn%7Dconst styleSheet%3Ddocument.createElement("style")%3BstyleSheet.textContent%3D%60.screenshot-container ol%7Blist-style-type%3Adecimal!important%3Bpadding-left%3A2.5em!important%3Bmargin-left%3A.5em!important%3Bmargin-top%3A1em!important%3Bmargin-bottom%3A1em!important%7D.screenshot-container ol li%7Bpadding-left%3A.5em!important%3Bmargin-bottom%3A.5em!important%7D.screenshot-container ul%7Blist-style-type%3Adisc!important%3Bpadding-left%3A2.5em!important%3Bmargin-left%3A.5em!important%3Bmargin-top%3A1em!important%3Bmargin-bottom%3A1em!important%7D.screenshot-container ul li%7Bpadding-left%3A.5em!important%3Bmargin-bottom%3A.5em!important%7D.screenshot-container img%7Bdisplay%3Ainline-block%7Dbody>div%3Alast-child img%7Bdisplay%3Ainline-block%7D%60%3Bdocument.head.appendChild(styleSheet)%3BmainContainer.classList.add(%27screenshot-container%27)%3Bdocument.querySelectorAll("div.font-user-message").forEach(msg%3D>%7Bmsg.style.position%3D"relative"%7D)%3Bconst title%3Ddocument.querySelector("button%5Bdata-testid%3D%27chat-menu-trigger%27%5D")%3F.textContent%7C%7C%27%27%3Bconst filename%3Dtitle.trim().toLowerCase().replace(%2F%5E%5B%5E%5Cw%5Cd%5D%2B%7C%5B%5E%5Cw%5Cd%5D%2B%24%2Fg%2C"").replace(%2F%5B%5Cs%5CW-%5D%2B%2Fg%2C"-")%7C%7C"claude"%3Bconst header%3Ddocument.createElement("div")%3Bheader.style.cssText%3D%60position%3Aabsolute%3Bleft%3A0%3Bright%3A0%3Btop%3A8px%3Btext-align%3Acenter%3Bmargin-bottom%3A2em%60%3Bconst headerTitle%3Ddocument.createElement("h1")%3BheaderTitle.textContent%3Dtitle%3BheaderTitle.style.fontSize%3D"18px"%3Bconst timestamp%3Ddocument.createElement("p")%3Btimestamp.textContent%3Dnew Date().toLocaleString()%3Btimestamp.style.cssText%3D"font-size%3A12px%3Bopacity%3A.7"%3Bheader.appendChild(headerTitle)%3Bheader.appendChild(timestamp)%3BmainContainer.prepend(header)%3Bhtml2canvas(mainContainer%2C%7Blogging%3A!0%2CletterRendering%3A1%2CforeignObjectRendering%3A!1%2CuseCORS%3A!0%2Cscale%3Awindow.devicePixelRatio%7C%7C1%2Conclone%3A(clonedDoc)%3D>%7BclonedDoc.querySelector(%27.screenshot-container%27).style.padding%3D%2720px%27%7D%7D).then(canvas%3D>%7Bcanvas.style.display%3D"none"%3Bdocument.body.appendChild(canvas)%3Breturn canvas%7D).then(canvas%3D>%7Bconst dataUrl%3Dcanvas.toDataURL("image%2Fpng")%3Bconst downloadLink%3Ddocument.createElement("a")%3BdownloadLink.download%3D%60%24%7Bfilename%7D.png%60%3BdownloadLink.href%3DdataUrl%3BdownloadLink.click()%3Bcanvas.remove()%7D).then(()%3D>%7BstyleSheet.remove()%3Bheader.remove()%3BmainContainer.classList.remove(%27screenshot-container%27)%7D).catch(error%3D>%7Balert(%27Error generating screenshot%3A %27%2Berror.message)%3BstyleSheet%3F.remove()%3Bheader%3F.remove()%3BmainContainer.classList.remove(%27screenshot-container%27)%7D)%7D%7D)()
```

## Development

1. Clone the repository
2. Open `bookmarklet.js`
3. Make changes
4. Use a JavaScript minifier to create the bookmarklet version

## Dependencies

* html2pdf.js
* html2canvas

## License

MIT License
