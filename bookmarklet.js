javascript:(function(){
    // Constants
    const SELECTORS = {
        MAIN_CONTAINER: "div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",
        CHAT_TITLE: "button[data-testid='chat-menu-trigger']",
        USER_MESSAGES: "div.font-user-message",
        CLAUDE_MESSAGES: "div[data-testid='chat-message-content']",
        CODE_BLOCKS: "pre",
        INLINE_CODE: "code"
    };
    
    const DEPENDENCIES = {
        HTML2CANVAS_URL: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        JSPDF_URL: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    };
        
    // State tracking
    let isLoading = false;
    let cleanup = {
        styleSheet: null,
        header: null,
        containerClass: false,
        modal: null,
        progressBar: null
    };

    // Helper functions
    function handleError(message, error = null) {
        console.error(message, error);
        showNotification(message, 'error');
        performCleanup();
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'error' ? '#ff4444' : '#44aa44'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: opacity 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function showProgress(percent, message = 'Processing...') {
        if (!cleanup.progressBar) {
            const progressContainer = document.createElement('div');
            progressContainer.style.cssText = `
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
            `;
            
            const messageElement = document.createElement('div');
            messageElement.style.marginBottom = '10px';
            messageElement.textContent = message;
            progressContainer.appendChild(messageElement);
            
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                width: 100%;
                height: 10px;
                background: #333;
                border-radius: 5px;
                overflow: hidden;
            `;
            
            const progressFill = document.createElement('div');
            progressFill.style.cssText = `
                height: 100%;
                background: #44aa44;
                width: 0%;
                transition: width 0.3s ease;
            `;
            
            progressBar.appendChild(progressFill);
            progressContainer.appendChild(progressBar);
            
            const percentText = document.createElement('div');
            percentText.style.marginTop = '5px';
            percentText.textContent = '0%';
            progressContainer.appendChild(percentText);
            
            document.body.appendChild(progressContainer);
            
            cleanup.progressBar = {
                container: progressContainer,
                fill: progressFill,
                text: percentText,
                message: messageElement
            };
        }
        
        cleanup.progressBar.fill.style.width = `${percent}%`;
        cleanup.progressBar.text.textContent = `${Math.round(percent)}%`;
        if (message !== cleanup.progressBar.message.textContent) {
            cleanup.progressBar.message.textContent = message;
        }
        
        if (percent >= 100) {
            setTimeout(() => {
                if (cleanup.progressBar) {
                    cleanup.progressBar.container.remove();
                    cleanup.progressBar = null;
                }
            }, 500);
        }
    }

    function performCleanup() {
        if (cleanup.styleSheet) {
            cleanup.styleSheet.remove();
        }
        if (cleanup.header) {
            cleanup.header.remove();
        }
        if (cleanup.containerClass) {
            const container = document.querySelector(SELECTORS.MAIN_CONTAINER);
            if (container) {
                container.classList.remove('screenshot-container');
            }
        }
        if (cleanup.modal) {
            cleanup.modal.remove();
        }
        if (cleanup.progressBar) {
            cleanup.progressBar.container.remove();
        }
        cleanup = {
            styleSheet: null,
            header: null,
            containerClass: false,
            modal: null,
            progressBar: null
        };
    }

    // Check if we're on Claude.ai
    if (!window.location.href.includes('claude.ai')) {
        handleError('This bookmarklet only works on Claude chat pages');
        return;
    }

    if (isLoading) {
        handleError('Export already in progress');
        return;
    }

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Unable to load ${url}`));
            document.head.appendChild(script);
        });
    }

    function showFormatSelectionModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
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
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Export Claude Chat';
        title.style.margin = '0 0 20px 0';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Choose the export format:';
        subtitle.style.margin = '0 0 25px 0';
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
        `;
        
        const createButton = (text, format) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                padding: 12px 25px;
                background: #5A67D8;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: background 0.2s;
            `;
            button.addEventListener('mouseover', () => {
                button.style.background = '#4C51BF';
            });
            button.addEventListener('mouseout', () => {
                button.style.background = '#5A67D8';
            });
            button.addEventListener('click', async () => {
                modal.remove();
                cleanup.modal = null;
                try {
                    showProgress(0, `Initializing ${format.toUpperCase()} export...`);
                    await loadDependencies(format);
                } catch (error) {
                    handleError(`Error during export: ${error.message}`, error);
                }
            });
            return button;
        };
        
        const pdfButton = createButton('PDF', 'pdf');
        const pngButton = createButton('PNG', 'png');
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.cssText = `
            padding: 12px 25px;
            background: #E2E8F0;
            color: #4A5568;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: background 0.2s;
        `;
        cancelButton.addEventListener('mouseover', () => {
            cancelButton.style.background = '#CBD5E0';
        });
        cancelButton.addEventListener('mouseout', () => {
            cancelButton.style.background = '#E2E8F0';
        });
        cancelButton.addEventListener('click', () => {
            modal.remove();
            cleanup.modal = null;
        });
        
        buttonContainer.appendChild(pdfButton);
        buttonContainer.appendChild(pngButton);
        buttonContainer.appendChild(cancelButton);
        
        modalContent.appendChild(title);
        modalContent.appendChild(subtitle);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        cleanup.modal = modal;
    }

    async function loadDependencies(format) {
        isLoading = true;
        try {
            if (typeof html2canvas === 'undefined') {
                showProgress(10, 'Loading html2canvas...');
                await loadScript(DEPENDENCIES.HTML2CANVAS_URL);
            }
            if (format === 'pdf' && typeof jspdf === 'undefined') {
                showProgress(30, 'Loading jsPDF...');
                await loadScript(DEPENDENCIES.JSPDF_URL);
            }
            showProgress(50, 'Preparing content...');
            isLoading = false;
            await initExport(format);
        } catch (error) {
            isLoading = false;
            handleError(`Unable to load the required libraries: ${error.message}`, error);
        }
    }

    async function initExport(format) {
        const mainContainer = document.querySelector(SELECTORS.MAIN_CONTAINER);
        if (!mainContainer) {
            throw new Error('Unable to find the Claude chat container');
        }

        // Extract computed styles from the DOM
        const userMessages = document.querySelectorAll(SELECTORS.USER_MESSAGES);
        const claudeMessages = document.querySelectorAll(SELECTORS.CLAUDE_MESSAGES);
        const codeBlocks = document.querySelectorAll(SELECTORS.CODE_BLOCKS);
        const inlineCodes = document.querySelectorAll(SELECTORS.INLINE_CODE);
        
        // Get computed styles for better replication
        let userMessageStyle = {};
        let claudeMessageStyle = {};
        let codeBlockStyle = {};
        let inlineCodeStyle = {};
        
        if (userMessages.length > 0) {
            const computedStyle = window.getComputedStyle(userMessages[0]);
            userMessageStyle = {
                fontFamily: computedStyle.fontFamily,
                fontSize: computedStyle.fontSize,
                lineHeight: computedStyle.lineHeight,
                color: computedStyle.color,
                backgroundColor: computedStyle.backgroundColor
            };
        }
        
        if (claudeMessages.length > 0) {
            const computedStyle = window.getComputedStyle(claudeMessages[0]);
            claudeMessageStyle = {
                fontFamily: computedStyle.fontFamily,
                fontSize: computedStyle.fontSize,
                lineHeight: computedStyle.lineHeight,
                color: computedStyle.color,
                backgroundColor: computedStyle.backgroundColor,
                letterSpacing: computedStyle.letterSpacing
            };
        }
        
        if (codeBlocks.length > 0) {
            const computedStyle = window.getComputedStyle(codeBlocks[0]);
            codeBlockStyle = {
                fontFamily: computedStyle.fontFamily,
                fontSize: computedStyle.fontSize,
                lineHeight: computedStyle.lineHeight,
                color: computedStyle.color,
                backgroundColor: computedStyle.backgroundColor,
                padding: computedStyle.padding,
                borderRadius: computedStyle.borderRadius,
                tabSize: computedStyle.tabSize
            };
        }
        
        if (inlineCodes.length > 0) {
            const computedStyle = window.getComputedStyle(inlineCodes[0]);
            inlineCodeStyle = {
                fontFamily: computedStyle.fontFamily,
                fontSize: computedStyle.fontSize,
                backgroundColor: computedStyle.backgroundColor,
                padding: computedStyle.padding,
                borderRadius: computedStyle.borderRadius
            };
        }

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .screenshot-container {
                background-color: white !important;
                color: black !important;
                padding: 20px !important;
            }
            
            /* User messages style */
            .screenshot-container .font-user-message {
                font-family: ${userMessageStyle.fontFamily || 'var(--font-sans-serif), Arial, sans-serif'} !important;
                font-size: ${userMessageStyle.fontSize || '1rem'} !important;
                line-height: ${userMessageStyle.lineHeight || '1.6'} !important;
                color: ${userMessageStyle.color || 'hsl(var(--text-100))'} !important;
                margin-bottom: 1.5rem !important;
                padding: 0.75rem !important;
                background-color: ${userMessageStyle.backgroundColor || 'hsl(var(--bg-100))'} !important;
                border-radius: 0.5rem !important;
            }
            
            /* Claude messages style */
            .screenshot-container [data-testid="chat-message-content"] {
                font-family: ${claudeMessageStyle.fontFamily || 'var(--font-serif), Georgia, serif'} !important;
                font-size: ${claudeMessageStyle.fontSize || '1rem'} !important;
                line-height: ${claudeMessageStyle.lineHeight || '1.65'} !important;
                color: ${claudeMessageStyle.color || 'hsl(var(--text-100))'} !important;
                letter-spacing: ${claudeMessageStyle.letterSpacing || '-0.015em'} !important;
                margin-bottom: 1.5rem !important;
                padding: 0.75rem !important;
            }
            
            /* Code block style */
            .screenshot-container pre {
                font-family: ${codeBlockStyle.fontFamily || "'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"} !important;
                font-size: ${codeBlockStyle.fontSize || '0.875rem'} !important;
                line-height: ${codeBlockStyle.lineHeight || '1.625'} !important;
                color: ${codeBlockStyle.color || '#abb2bf'} !important;
                background-color: ${codeBlockStyle.backgroundColor || '#282c34'} !important;
                padding: ${codeBlockStyle.padding || '1em'} !important;
                border-radius: ${codeBlockStyle.borderRadius || '0.5rem'} !important;
                tab-size: ${codeBlockStyle.tabSize || '2'} !important;
                overflow-x: auto !important;
                margin: 1em 0 !important;
                text-shadow: 0 1px rgba(0,0,0,.3) !important;
                white-space: pre !important;
                word-spacing: normal !important;
                word-break: normal !important;
            }
            
            /* Inline code style */
            .screenshot-container code:not(pre code) {
                font-family: ${inlineCodeStyle.fontFamily || "'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"} !important;
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
        `;
        document.head.appendChild(styleSheet);
        cleanup.styleSheet = styleSheet;

        mainContainer.classList.add('screenshot-container');
        cleanup.containerClass = true;

        // Add message role labels to better distinguish between user and assistant
        const messages = mainContainer.querySelectorAll('[data-testid="chat-message"]');
        messages.forEach(message => {
            const isUser = message.querySelector('.font-user-message');
            const content = message.querySelector('[data-testid="chat-message-content"]');
            
            if (content && !content.querySelector('.message-role')) {
                const roleLabel = document.createElement('div');
                roleLabel.className = 'message-role';
                roleLabel.textContent = isUser ? 'You:' : 'Claude:';
                content.insertBefore(roleLabel, content.firstChild);
            }
        });

        const titleElement = document.querySelector(SELECTORS.CHAT_TITLE);
        const title = titleElement?.textContent || 'Claude Chat';
        const filename = title.trim()
            .toLowerCase()
            .replace(/^[^\w\d]+|[^\w\d]+$/g, "")
            .replace(/[\s\W-]+/g, "-") || "claude";

        const titleContainer = document.createElement("div");
        titleContainer.className = "chat-title-container";
        
        const titleText = document.createElement("div");
        titleText.className = "chat-title-text";
        titleText.textContent = title;
        
        const timestamp = document.createElement("div");
        timestamp.className = "chat-timestamp";
        timestamp.textContent = new Date().toLocaleString();
        
        titleContainer.appendChild(titleText);
        titleContainer.appendChild(timestamp);
        mainContainer.insertBefore(titleContainer, mainContainer.firstChild);
        cleanup.header = titleContainer;

        try {
            if (format === 'pdf') {
                await generatePDF(mainContainer, filename);
            } else {
                await generatePNG(mainContainer, filename);
            }
        } finally {
            performCleanup();
        }
    }

    async function generatePDF(container, filename) {
        showNotification('Generating optimized PDF...');
        showProgress(60, 'Rendering content...');
        
        // Create clone of container for better rendering
        const clone = container.cloneNode(true);
        clone.style.width = '800px'; // Fixed width for better PDF layout
        clone.style.margin = '0 auto';
        
        // Apply any post-processing on the clone
        processCodeFormatting(clone);
        
        // Move clone offscreen temporarily for capturing
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);
        
        try {
            // Use a more moderate scale factor for better file size
            const scaleFactor = Math.min(1.5, window.devicePixelRatio || 1);
            
            const canvas = await html2canvas(clone, {
                logging: false,
                letterRendering: true,
                foreignObjectRendering: false,
                useCORS: true,
                scale: scaleFactor,
                allowTaint: true,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    const clonedContainer = clonedDoc.querySelector('.screenshot-container');
                    if (clonedContainer) {
                        clonedContainer.style.webkitFontSmoothing = 'antialiased';
                        clonedContainer.style.mozOsxFontSmoothing = 'grayscale';
                    }
                }
            });
            
            showProgress(80, 'Creating PDF...');
            
            // Use a high quality JPEG for better image quality
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            const { jsPDF } = window.jspdf;
            
            // Add PDF compression options
            const pdfOptions = {
                compress: true,
                precision: 2,  // Reduce precision for better compression
            };
            
            // Create an A4 PDF in portrait with compression options
            const pdf = new jsPDF(pdfOptions);
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Scale the image to fit the PDF width while maintaining aspect ratio
            const imgWidth = pageWidth;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            // Calculate the number of pages needed
            const totalPages = Math.ceil(imgHeight / pageHeight);
            
            // Add page splitting notification if multiple pages
            if (totalPages > 1) {
                showProgress(85, `Creating ${totalPages} page PDF...`);
            }
            
            // Add first page
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            let heightLeft = imgHeight - pageHeight;
            
            // Add remaining pages if needed
            let pageNum = 1;
            while (heightLeft > 0) {
                pageNum++;
                showProgress(85 + (pageNum / totalPages) * 10, `Adding page ${pageNum}/${totalPages}...`);
                
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, -(pageHeight * (pageNum-1)), imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            showProgress(95, 'Optimizing PDF...');
            
            // Set PDF metadata for better organization
            pdf.setProperties({
                title: `Claude Chat: ${filename}`,
                subject: 'Chat conversation with Claude',
                creator: 'Claude Chat Exporter',
                author: 'Claude User',
                keywords: 'claude, chat, conversation',
                creationDate: new Date()
            });
            
            showProgress(100, 'Saving PDF...');
            pdf.save(`${filename}-${Date.now()}.pdf`);
            showNotification('Optimized PDF saved successfully');
        } finally {
            // Clean up the clone
            if (clone && clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
        }
    }

    async function generatePNG(container, filename) {
        showNotification('Generating PNG...');
        showProgress(60, 'Rendering content...');
        
        // Create clone of container for better rendering
        const clone = container.cloneNode(true);
        clone.style.width = '800px'; // Fixed width for better PNG layout
        clone.style.margin = '0 auto';
        
        // Apply any post-processing on the clone
        processCodeFormatting(clone);
        
        // Move clone offscreen temporarily for capturing
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);
        
        try {
            const canvas = await html2canvas(clone, {
                logging: false,
                letterRendering: true,
                foreignObjectRendering: false,
                useCORS: true,
                scale: window.devicePixelRatio * 2 || 2, // Higher scale for better quality
                allowTaint: true,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc) => {
                    const clonedContainer = clonedDoc.querySelector('.screenshot-container');
                    if (clonedContainer) {
                        clonedContainer.style.padding = '20px';
                    }
                }
            });
            
            showProgress(90, 'Creating PNG image...');
            const dataUrl = canvas.toDataURL("image/png");
            
            showProgress(100, 'Saving PNG...');
            const downloadLink = document.createElement("a");
            downloadLink.download = `${filename}-${Date.now()}.png`;
            downloadLink.href = dataUrl;
            downloadLink.click();
            
            showNotification('Screenshot saved successfully');
        } finally {
            // Clean up the clone
            if (clone && clone.parentNode) {
                clone.parentNode.removeChild(clone);
            }
        }
    }
    
    // Helper function to process and optimize code formatting
    function processCodeFormatting(container) {
        // Ensure syntax highlighting is preserved
        const codeBlocks = container.querySelectorAll('pre');
        codeBlocks.forEach(block => {
            // Add explicit syntax highlighting class if needed
            if (!block.classList.contains('language-')) {
                const codeElement = block.querySelector('code');
                if (codeElement && codeElement.className) {
                    const match = codeElement.className.match(/language-(\w+)/);
                    if (match) {
                        block.classList.add(`language-${match[1]}`);
                    } else {
                        block.classList.add('language-plaintext');
                    }
                } else {
                    block.classList.add('language-plaintext');
                }
            }
            
            // Ensure background color is applied
            block.style.backgroundColor = '#282c34';
            block.style.color = '#abb2bf';
        });
        
        // Process inline code elements
        const inlineCodes = container.querySelectorAll('code:not(pre code)');
        inlineCodes.forEach(code => {
            code.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            code.style.color = 'var(--danger-000, #8B0000)';
            code.style.padding = '0px 4px';
            code.style.margin = '0 2px';
            code.style.border = '0.5px solid var(--border-300, #DDD)';
            code.style.borderRadius = '0.3rem';
            code.style.fontSize = '0.9rem';
            code.style.fontFamily = "'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace";
            code.style.whiteSpace = 'pre-wrap';
        });
    }

    showFormatSelectionModal();
})();
