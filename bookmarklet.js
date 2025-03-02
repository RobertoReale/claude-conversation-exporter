javascript:(function(){
    // Constants
    const SELECTORS = {
        MAIN_CONTAINER: "div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",
        CHAT_TITLE: "button[data-testid='chat-menu-trigger']",
        USER_MESSAGES: "div.font-user-message"
    };
    
    const DEPENDENCIES = {
        HTML2CANVAS_URL: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        JSPDF_URL: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    };
    
    // Quality settings
    const QUALITY_SETTINGS = {
        SCALE: 2,               // Increased from 1 to 2 for better resolution
        IMAGE_QUALITY: 1,       // Maximum image quality (0-1)
        DPI: 300                // Higher DPI for better print quality
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
            // Create progress container
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
            
            // Add message
            const messageElement = document.createElement('div');
            messageElement.style.marginBottom = '10px';
            messageElement.textContent = message;
            progressContainer.appendChild(messageElement);
            
            // Add progress bar
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
            
            // Add percentage text
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
        
        // Update progress
        cleanup.progressBar.fill.style.width = `${percent}%`;
        cleanup.progressBar.text.textContent = `${Math.round(percent)}%`;
        
        if (message !== cleanup.progressBar.message.textContent) {
            cleanup.progressBar.message.textContent = message;
        }
        
        // Remove if completed
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

    // Check if export is already in progress
    if (isLoading) {
        handleError('Export already in progress');
        return;
    }

    // Load dependencies
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
            // Always load html2canvas
            if (typeof html2canvas === 'undefined') {
                showProgress(10, 'Loading html2canvas...');
                await loadScript(DEPENDENCIES.HTML2CANVAS_URL);
            }
            
            // Only load jsPDF for PDF format
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

        // Apply styling including additional Katex fixes
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
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
            /* Additional KaTeX fixes */
            .screenshot-container .katex-display {
                display: block !important;
                text-align: center !important;
                margin: 1em 0 !important;
            }
            .screenshot-container .katex {
                display: inline-block !important;
                white-space: nowrap !important;
                text-indent: 0 !important;
            }
            .screenshot-container .katex * {
                position: static !important;
            }
        `;
        document.head.appendChild(styleSheet);
        cleanup.styleSheet = styleSheet;

        mainContainer.classList.add('screenshot-container');
        cleanup.containerClass = true;

        // Get title information
        const titleElement = document.querySelector(SELECTORS.CHAT_TITLE);
        const title = titleElement?.textContent || 'Claude Chat';
        const filename = title.trim()
            .toLowerCase()
            .replace(/^[^\w\d]+|[^\w\d]+$/g, "")
            .replace(/[\s\W-]+/g, "-") || "claude";

        // Create title container
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
        
        // Insert title container as first child
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

    // Updated PDF generator with new html2canvas options
    async function generatePDF(container, filename) {
        showNotification('Generating high-quality PDF...');
        
        showProgress(60, 'Rendering content...');
        
        const canvas = await html2canvas(container, {
            logging: false,
            letterRendering: true,
            foreignObjectRendering: true, // Enables better capture of complex elements like KaTeX
            useCORS: true,
            scale: QUALITY_SETTINGS.SCALE * (window.devicePixelRatio || 1),
            allowTaint: true, // As suggested, enable tainting
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
        
        // Get canvas dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Adjust scale factor as desired (here, 75% of the canvas size)
        const scaleFactor = 0.75;
        const pdfWidth = canvasWidth * scaleFactor;
        const pdfHeight = canvasHeight * scaleFactor;
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeight]);
        
        pdf.setProperties({
            title: filename,
            creator: 'Claude Chat Export',
            subject: 'Chat Conversation',
            keywords: 'claude, chat, conversation',
            creationDate: new Date()
        });
        
        pdf.addImage(
            canvas.toDataURL('image/jpeg', QUALITY_SETTINGS.IMAGE_QUALITY),
            'JPEG',
            0,
            0,
            pdfWidth,
            pdfHeight,
            undefined,
            'FAST'
        );
        
        showProgress(100, 'Saving PDF...');
        pdf.save(`${filename}-${Date.now()}.pdf`);
        
        showNotification('High-quality PDF saved successfully (single page)');
    }

    async function generatePNG(container, filename) {
        showNotification('Generating PNG...');
        
        showProgress(60, 'Rendering content...');
        
        const canvas = await html2canvas(container, {
            logging: false,
            letterRendering: true,
            foreignObjectRendering: true,
            useCORS: true,
            scale: window.devicePixelRatio || 1,
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
    }

    // Start the process by showing the format selection modal
    showFormatSelectionModal();
})();
