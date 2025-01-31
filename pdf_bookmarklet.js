// Claude Conversation PDF Exporter
(function() {
    // Check if html2pdf is loaded, if not, dynamically load the script
    if (typeof html2pdf === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = initPDFExport;
        document.head.appendChild(script);
    } else {
        initPDFExport();
    }

    // Process list elements to improve PDF formatting
    function processListElements(element) {
        // Process all ordered and unordered lists
        element.querySelectorAll('ol, ul').forEach(list => {
            list.style.paddingLeft = '30px';
            list.style.marginLeft = '15px';
            list.style.listStylePosition = 'outside';
            
            // Set proper list style based on list type
            if (list.tagName === 'OL') {
                list.style.listStyleType = 'decimal';
            } else {
                list.style.listStyleType = 'disc';
            }
            
            // Process list items
            list.querySelectorAll('li').forEach(li => {
                li.style.marginBottom = '10px';
                li.style.paddingLeft = '10px';
                // Ensure content doesn't get cut off
                li.style.breakInside = 'avoid';
                li.style.pageBreakInside = 'avoid';
            });
        });
        
        // Fix paragraph spacing and prevent orphans
        element.querySelectorAll('p').forEach(p => {
            p.style.marginBottom = '15px';
            p.style.lineHeight = '1.5';
            p.style.breakInside = 'avoid';
            p.style.pageBreakInside = 'avoid';
        });
        
        return element;
    }

    // Main function to export PDF
    function initPDFExport() {
        // Find all Claude messages
        const claudeMessages = Array.from(document.getElementsByClassName('font-claude-message'));
        
        // Check if any messages exist
        if (claudeMessages.length === 0) {
            alert('No Claude responses found in the conversation.');
            return;
        }

        // Create container for PDF
        const container = document.createElement('div');
        container.style.padding = '20px';
        container.style.backgroundColor = 'white';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';
        container.style.color = '#2D3748';
        
        // Process each message
        claudeMessages.forEach((message, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '30px';
            wrapper.style.padding = '20px';
            wrapper.style.borderBottom = '1px solid #E2E8F0';
            // Prevent message splits across pages
            wrapper.style.breakInside = 'avoid-page';
            wrapper.style.pageBreakInside = 'avoid';
            
            // Add response number
            const messageNumber = document.createElement('div');
            messageNumber.style.fontSize = '16px';
            messageNumber.style.fontWeight = 'bold';
            messageNumber.style.color = '#4A5568';
            messageNumber.style.marginBottom = '15px';
            messageNumber.textContent = `Response #${index + 1}`;
            
            // Clone and process the message
            const messageClone = message.cloneNode(true);
            const processedMessage = processListElements(messageClone);
            
            wrapper.appendChild(messageNumber);
            wrapper.appendChild(processedMessage);
            container.appendChild(wrapper);
        });

        // PDF export options
        const opt = {
            margin: [20, 20, 20, 20],
            filename: 'claude-responses.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: -window.scrollY, // Fix for scrolled content
                windowHeight: document.documentElement.offsetHeight
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait'
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Generate PDF
        html2pdf().from(container).set(opt).save()
            .then(() => console.log('PDF generated successfully!'))
            .catch(err => {
                console.error('Error generating PDF:', err);
                alert('Error generating PDF. Check console for details.');
            });
    }
})();
