# Claude Conversation PDF Exporter

## Overview
This is a bookmarklet that allows you to export Claude conversations to a PDF directly from your browser.

## Features
- Converts Claude conversation messages to a nicely formatted PDF
- Uses html2pdf.js for PDF generation
- Handles lists, paragraphs, and page breaks
- Dynamically loads required library if not already present

## Installation

### Method 1: Bookmarklet
1. Create a new bookmark in your browser
2. Edit the bookmark
3. Replace the URL with the minified version of the code (see below)

### Method 2: Browser Extension (Coming Soon)

## Usage
1. Open a conversation in Claude
2. Click the bookmarklet
3. A PDF will be generated and downloaded automatically

## Bookmarklet Code
Copy the minified version of the code below and create a new bookmark with this as the URL:

```javascript
javascript:(function(){if(typeof html2pdf==='undefined'){var script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';script.onload=initPDFExport;document.head.appendChild(script)}else{initPDFExport()}function processListElements(e){return e.querySelectorAll('ol, ul').forEach(list=>{list.style.paddingLeft='30px',list.style.marginLeft='15px',list.style.listStylePosition='outside','OL'===list.tagName?list.style.listStyleType='decimal':list.style.listStyleType='disc',list.querySelectorAll('li').forEach(li=>{li.style.marginBottom='10px',li.style.paddingLeft='10px',li.style.breakInside='avoid',li.style.pageBreakInside='avoid'})}),e.querySelectorAll('p').forEach(p=>{p.style.marginBottom='15px',p.style.lineHeight='1.5',p.style.breakInside='avoid',p.style.pageBreakInside='avoid'}),e}function initPDFExport(){const claudeMessages=Array.from(document.getElementsByClassName('font-claude-message'));if(0===claudeMessages.length)return void alert('No Claude responses found in the conversation.');const container=document.createElement('div');container.style.padding='20px',container.style.backgroundColor='white',container.style.fontFamily='Arial, sans-serif',container.style.fontSize='14px',container.style.color='#2D3748',claudeMessages.forEach((message,index)=>{const wrapper=document.createElement('div');wrapper.style.marginBottom='30px',wrapper.style.padding='20px',wrapper.style.borderBottom='1px solid #E2E8F0',wrapper.style.breakInside='avoid-page',wrapper.style.pageBreakInside='avoid';const messageNumber=document.createElement('div');messageNumber.style.fontSize='16px',messageNumber.style.fontWeight='bold',messageNumber.style.color='#4A5568',messageNumber.style.marginBottom='15px',messageNumber.textContent=`Response #${index+1}`;const messageClone=message.cloneNode(!0),processedMessage=processListElements(messageClone);wrapper.appendChild(messageNumber),wrapper.appendChild(processedMessage),container.appendChild(wrapper)});const opt={margin:[20,20,20,20],filename:'claude-responses.pdf',image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:!0,logging:!1,scrollY:-window.scrollY,windowHeight:document.documentElement.offsetHeight},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['avoid-all','css','legacy']}};html2pdf().from(container).set(opt).save().then(()=>console.log('PDF generated successfully!')).catch(err=>{console.error('Error generating PDF:',err),alert('Error generating PDF. Check console for details.')})}})()
```

## Development
1. Clone the repository
2. Open `bookmarklet.js`
3. Make changes
4. Use a JavaScript minifier to create the bookmarklet version

## Dependencies
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js/)

## License
MIT License
