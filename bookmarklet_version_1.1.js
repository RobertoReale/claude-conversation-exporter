javascript:(function(){
    "use strict";
    
    // Configuration
    const CONFIG = {
        SELECTORS: {
            MAIN_CONTAINER: "div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",
            CHAT_TITLE: "button[data-testid='chat-menu-trigger']",
            USER_MESSAGES: "div.font-user-message",
            CLAUDE_MESSAGES: "div[data-testid='chat-message-content']",
            CODE_BLOCKS: "pre",
            INLINE_CODE: "code",
            MATH_ELEMENTS: ".katex, .katex-display, .math, .math-display",
            CHAT_MESSAGES: "[data-testid='chat-message']"
        },
        DEPENDENCIES: {
            HTML2CANVAS: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            JSPDF: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        },
        STYLES: {
            NOTIFICATION: {
                ERROR: '#ff4444',
                SUCCESS: '#44aa44'
            },
            PDF: {
                WIDTH: 800,
                SCALE_FACTOR: 1.5
            },
            PNG: {
                WIDTH: 800,
                SCALE_FACTOR: 2
            }
        }
    };
    
    // State management
    const state = {
        isProcessing: false,
        cleanup: {
            styleSheet: null,
            header: null,
            containerClass: false,
            modal: null,
            progressBar: null
        }
    };

    // Utility functions
    const utils = {
        /**
         * Displays an error notification and performs cleanup
         * @param {string} message - Error message to display
         * @param {Error} [error] - Optional error object for logging
         */
        handleError(message, error = null) {
            if (error) console.error(message, error);
            this.showNotification(message, 'error');
            this.performCleanup();
        },
        
        /**
         * Displays a notification to the user
         * @param {string} message - Message to display
         * @param {string} [type='info'] - Type of notification (info or error)
         */
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                background: ${type === 'error' ? CONFIG.STYLES.NOTIFICATION.ERROR : CONFIG.STYLES.NOTIFICATION.SUCCESS};
                color: white;
                border-radius: 5px;
                z-index: 10000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: opacity 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Auto-remove notification after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        },
        
        /**
         * Updates or creates a progress bar
         * @param {number} percent - Percentage of completion (0-100)
         * @param {string} [message='Processing...'] - Status message
         */
        showProgress(percent, message = 'Processing...') {
            // Create progress bar if it doesn't exist
            if (!state.cleanup.progressBar) {
                const container = document.createElement('div');
                container.style.cssText = `
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
                
                const percentText = document.createElement('div');
                percentText.style.marginTop = '5px';
                percentText.textContent = '0%';
                
                // Assemble components
                progressBar.appendChild(progressFill);
                container.appendChild(messageElement);
                container.appendChild(progressBar);
                container.appendChild(percentText);
                document.body.appendChild(container);
                
                // Store references for updates and cleanup
                state.cleanup.progressBar = {
                    container,
                    fill: progressFill,
                    text: percentText,
                    message: messageElement
                };
            }
            
            // Update progress
            const { fill, text, message: msgElement } = state.cleanup.progressBar;
            fill.style.width = `${percent}%`;
            text.textContent = `${Math.round(percent)}%`;
            
            // Update message if changed
            if (message !== msgElement.textContent) {
                msgElement.textContent = message;
            }
            
            // Auto-remove when complete
            if (percent >= 100) {
                setTimeout(() => {
                    if (state.cleanup.progressBar) {
                        state.cleanup.progressBar.container.remove();
                        state.cleanup.progressBar = null;
                    }
                }, 500);
            }
        },
        
        /**
         * Clean up all modifications to the page
         */
        performCleanup() {
            const { cleanup } = state;
            
            // Remove stylesheet
            if (cleanup.styleSheet) {
                cleanup.styleSheet.remove();
            }
            
            // Remove header
            if (cleanup.header) {
                cleanup.header.remove();
            }
            
            // Remove container class
            if (cleanup.containerClass) {
                const container = document.querySelector(CONFIG.SELECTORS.MAIN_CONTAINER);
                if (container) {
                    container.classList.remove('screenshot-container');
                }
            }
            
            // Remove modal
            if (cleanup.modal) {
                cleanup.modal.remove();
            }
            
            // Remove progress bar
            if (cleanup.progressBar) {
                cleanup.progressBar.container.remove();
            }
            
            // Reset cleanup state
            state.cleanup = {
                styleSheet: null,
                header: null,
                containerClass: false,
                modal: null,
                progressBar: null
            };
            
            // Reset processing state
            state.isProcessing = false;
        },
        
        /**
         * Load an external script
         * @param {string} url - URL of the script to load
         * @returns {Promise} - Resolves when script is loaded
         */
        loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = () => reject(new Error(`Unable to load ${url}`));
                document.head.appendChild(script);
            });
        },
        
        /**
         * Generate a clean filename from text
         * @param {string} text - Text to convert to filename
         * @returns {string} - Sanitized filename
         */
        generateFilename(text) {
            return text.trim()
                .toLowerCase()
                .replace(/^[^\w\d]+|[^\w\d]+$/g, "")
                .replace(/[\s\W-]+/g, "-") || "claude";
        },
        
        /**
         * Process code blocks for better rendering
         * @param {HTMLElement} container - Container element
         */
        processCodeFormatting(container) {
            // Optimize code blocks
            const codeBlocks = container.querySelectorAll(CONFIG.SELECTORS.CODE_BLOCKS);
            codeBlocks.forEach(block => {
                // Add language class if missing
                if (!block.classList.contains('language-')) {
                    const codeElement = block.querySelector('code');
                    if (codeElement?.className) {
                        const match = codeElement.className.match(/language-(\w+)/);
                        block.classList.add(match ? `language-${match[1]}` : 'language-plaintext');
                    } else {
                        block.classList.add('language-plaintext');
                    }
                }
                
                // Ensure styling is applied
                Object.assign(block.style, {
                    backgroundColor: '#282c34',
                    color: '#abb2bf',
                    fontFamily: "'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
                    fontSize: '0.875rem',
                    padding: '1em',
                    borderRadius: '0.5rem',
                    tabSize: '2',
                    overflow: 'auto',
                    whiteSpace: 'pre'
                });
            });
            
            // Process inline code
            const inlineCodes = container.querySelectorAll(`${CONFIG.SELECTORS.INLINE_CODE}:not(pre code)`);
            inlineCodes.forEach(code => {
                Object.assign(code.style, {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    color: 'hsl(var(--danger-000, #8B0000))',
                    padding: '0px 4px',
                    margin: '0 2px',
                    border: '0.5px solid hsl(var(--border-300, #DDD))',
                    borderRadius: '0.3rem',
                    fontSize: '0.9rem',
                    fontFamily: "'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
                    whiteSpace: 'pre-wrap'
                });
            });
        },
        
        /**
         * Process KaTeX elements for better rendering
         * @param {HTMLElement} container - Container element
         */
        processKaTeXFormatting(container) {
            // Style KaTeX elements
            const katexElements = container.querySelectorAll(CONFIG.SELECTORS.MATH_ELEMENTS);
            katexElements.forEach(element => {
                Object.assign(element.style, {
                    display: 'inline-block',
                    textRendering: 'auto',
                    fontSize: '1.1em',
                    fontFamily: 'KaTeX_Main, Times New Roman, serif'
                });
                
                // Fix fraction lines
                element.querySelectorAll('.frac-line').forEach(line => {
                    Object.assign(line.style, {
                        position: 'relative',
                        display: 'block',
                        margin: '0.1em 0',
                        borderBottom: '1px solid',
                        borderTop: '0'
                    });
                });
                
                // Fix numerators
                element.querySelectorAll('.num').forEach(num => {
                    Object.assign(num.style, {
                        display: 'block',
                        textAlign: 'center',
                        marginBottom: '0.15em'
                    });
                });
                
                // Fix denominators
                element.querySelectorAll('.den').forEach(den => {
                    Object.assign(den.style, {
                        display: 'block',
                        textAlign: 'center',
                        marginTop: '0.15em'
                    });
                });
            });
            
            // Fix display math
            container.querySelectorAll('.katex-display').forEach(display => {
                Object.assign(display.style, {
                    display: 'block',
                    margin: '1em 0',
                    textAlign: 'center',
                    overflow: 'visible'
                });
            });
        },
        
        /**
         * Enhance formatting of bold text
         * @param {HTMLElement} container - Container element
         */
        processBoldTextFormatting(container) {
            const boldElements = container.querySelectorAll('strong, b');
            boldElements.forEach(element => {
                Object.assign(element.style, {
                    fontWeight: '700',
                    verticalAlign: 'baseline',
                    position: 'static',
                    display: 'inline',
                    lineHeight: 'inherit',
                    padding: '0',
                    margin: '0',
                    transform: 'none',
                    float: 'none'
                });
            });
        },
        
        /**
         * Apply all text processing functions
         * @param {HTMLElement} container - Container to process
         */
        processAllFormatting(container) {
            this.processCodeFormatting(container);
            this.processKaTeXFormatting(container);
            this.processBoldTextFormatting(container);
        }
    };

    // UI components
    const ui = {
        /**
         * Creates the format selection modal
         * @returns {HTMLElement} The created modal element
         */
        createFormatSelectionModal() {
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
            
            // Button factory function
            const createButton = (text, format, isPrimary = true) => {
                const button = document.createElement('button');
                button.textContent = text;
                const bgColor = isPrimary ? '#5A67D8' : '#E2E8F0';
                const textColor = isPrimary ? 'white' : '#4A5568';
                const hoverColor = isPrimary ? '#4C51BF' : '#CBD5E0';
                
                button.style.cssText = `
                    padding: 12px 25px;
                    background: ${bgColor};
                    color: ${textColor};
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    transition: background 0.2s;
                `;
                
                // Add hover effects
                button.addEventListener('mouseover', () => {
                    button.style.background = hoverColor;
                });
                button.addEventListener('mouseout', () => {
                    button.style.background = bgColor;
                });
                
                // Add click handler for export formats
                if (format) {
                    button.addEventListener('click', async () => {
                        modal.remove();
                        state.cleanup.modal = null;
                        try {
                            utils.showProgress(0, `Initializing ${format.toUpperCase()} export...`);
                            await exportHandler.loadDependencies(format);
                        } catch (error) {
                            utils.handleError(`Error during export: ${error.message}`, error);
                        }
                    });
                } else {
                    // Cancel button handler
                    button.addEventListener('click', () => {
                        modal.remove();
                        state.cleanup.modal = null;
                    });
                }
                
                return button;
            };
            
            // Create buttons
            const pdfButton = createButton('PDF', 'pdf');
            const pngButton = createButton('PNG', 'png');
            const cancelButton = createButton('Cancel', null, false);
            
            // Assemble modal
            buttonContainer.append(pdfButton, pngButton, cancelButton);
            modalContent.append(title, subtitle, buttonContainer);
            modal.appendChild(modalContent);
            
            return modal;
        },
        
        /**
         * Creates the title header for the export
         * @param {string} title - Chat title
         * @returns {HTMLElement} Header element
         */
        createTitleHeader(title) {
            const titleContainer = document.createElement("div");
            titleContainer.className = "chat-title-container";
            
            const titleText = document.createElement("div");
            titleText.className = "chat-title-text";
            titleText.textContent = title;
            
            const timestamp = document.createElement("div");
            timestamp.className = "chat-timestamp";
            timestamp.textContent = new Date().toLocaleString();
            
            titleContainer.append(titleText, timestamp);
            return titleContainer;
        },
        
        /**
         * Creates the stylesheet for export formatting
         * @returns {HTMLStyleElement} The created stylesheet
         */
        createExportStylesheet() {
            const styleSheet = document.createElement("style");
            styleSheet.textContent = `
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
                    color: hsl(var(--text-100)) !important;
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
                
                /* User message parent container */
                .screenshot-container .group {
                    padding: 0.75rem !important;
                    margin-bottom: 1rem !important;
                    background-color: hsl(var(--bg-100)) !important;
                    border-radius: 0.5rem !important;
                }
                
                /* Claude messages style */
                .screenshot-container [data-testid="chat-message-content"] {
                    font-family: var(--font-serif, Georgia, serif) !important;
                    font-size: 1rem !important;
                    line-height: 1.65 !important;
                    color: hsl(var(--text-100)) !important;
                    letter-spacing: -0.015em !important;
                    margin-bottom: 1.5rem !important;
                    padding: 0.75rem !important;
                }
                
                /* Code block style */
                .screenshot-container pre {
                    font-family: "Fira Code", "Fira Mono", Menlo, Consolas, monospace !important;
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
                    font-family: "Fira Code", "Fira Mono", Menlo, Consolas, monospace !important;
                    font-size: 0.9rem !important;
                    background-color: rgba(0, 0, 0, 0.05) !important;
                    color: hsl(var(--danger-000)) !important;
                    padding: 0px 4px !important;
                    margin: 0 2px !important;
                    border: 0.5px solid hsl(var(--border-300)) !important;
                    border-radius: 0.3rem !important;
                    white-space: pre-wrap !important;
                }
                
                /* Bold text fixes */
                .screenshot-container strong, .screenshot-container b {
                    font-weight: 700 !important;
                    vertical-align: baseline !important;
                    position: static !important;
                    display: inline !important;
                    line-height: inherit !important;
                }
                
                /* KaTeX math formulas */
                .screenshot-container .katex-display {
                    display: block !important;
                    margin: 1em 0 !important;
                    text-align: center !important;
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
                
                /* Lists styling */
                .screenshot-container ol {
                    list-style-type: decimal !important;
                    padding-left: 2.5em !important;
                    margin: 1em 0.5em !important;
                }
                
                .screenshot-container ul {
                    list-style-type: disc !important;
                    padding-left: 2.5em !important;
                    margin: 1em 0.5em !important;
                }
                
                .screenshot-container li {
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
                
                /* Chat header */
                .chat-title-container {
                    margin: 1.5rem 0;
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
            `;
            return styleSheet;
        },
        
        /**
         * Shows the format selection modal
         */
        showFormatSelectionModal() {
            const modal = this.createFormatSelectionModal();
            document.body.appendChild(modal);
            state.cleanup.modal = modal;
        }
    };

    // Export handler
    const exportHandler = {
        /**
         * Loads required dependencies for export
         * @param {string} format - Export format (pdf or png)
         */
        async loadDependencies(format) {
            state.isProcessing = true;
            try {
                // Load html2canvas
                if (typeof html2canvas === 'undefined') {
                    utils.showProgress(10, 'Loading html2canvas...');
                    await utils.loadScript(CONFIG.DEPENDENCIES.HTML2CANVAS);
                }
                
                // Load jsPDF if needed
                if (format === 'pdf' && typeof jspdf === 'undefined') {
                    utils.showProgress(30, 'Loading jsPDF...');
                    await utils.loadScript(CONFIG.DEPENDENCIES.JSPDF);
                }
                
                utils.showProgress(50, 'Preparing content...');
                state.isProcessing = false;
                await this.initExport(format);
            } catch (error) {
                state.isProcessing = false;
                utils.handleError(`Unable to load the required libraries: ${error.message}`, error);
            }
        },
        
        /**
         * Prepares the page for export
         * @param {string} format - Export format (pdf or png)
         */
        async initExport(format) {
            const mainContainer = document.querySelector(CONFIG.SELECTORS.MAIN_CONTAINER);
            if (!mainContainer) {
                throw new Error('Unable to find the Claude chat container');
            }
    
            // Add styling
            const styleSheet = ui.createExportStylesheet();
            document.head.appendChild(styleSheet);
            state.cleanup.styleSheet = styleSheet;
    
            // Add screenshot class
            mainContainer.classList.add('screenshot-container');
            state.cleanup.containerClass = true;
    
            // Add role labels to messages
            this.addMessageRoleLabels(mainContainer);
    
            // Get chat title
            const titleElement = document.querySelector(CONFIG.SELECTORS.CHAT_TITLE);
            const title = titleElement?.textContent || 'Claude Chat';
            const filename = utils.generateFilename(title);
    
            // Add title header
            const titleHeader = ui.createTitleHeader(title);
            mainContainer.insertBefore(titleHeader, mainContainer.firstChild);
            state.cleanup.header = titleHeader;
    
            try {
                // Generate export based on format
                if (format === 'pdf') {
                    await this.generatePDF(mainContainer, filename);
                } else {
                    await this.generatePNG(mainContainer, filename);
                }
            } finally {
                utils.performCleanup();
            }
        },
        
        /**
         * Adds role labels to messages
         * @param {HTMLElement} container - Container with messages
         */
        addMessageRoleLabels(container) {
            const messages = container.querySelectorAll(CONFIG.SELECTORS.CHAT_MESSAGES);
            messages.forEach(message => {
                const isUser = message.querySelector(CONFIG.SELECTORS.USER_MESSAGES);
                const content = message.querySelector(CONFIG.SELECTORS.CLAUDE_MESSAGES);
                
                if (content && !content.querySelector('.message-role')) {
                    const roleLabel = document.createElement('div');
                    roleLabel.className = 'message-role';
                    roleLabel.textContent = isUser ? 'You:' : 'Claude:';
                    content.insertBefore(roleLabel, content.firstChild);
                }
            });
        },
        
        /**
         * Creates a clone of container for export
         * @param {HTMLElement} container - Container to clone
         * @param {number} width - Width for the clone
         * @returns {HTMLElement} - Prepared clone
         */
        prepareContainerClone(container, width) {
            // Create a clone for rendering
            const clone = container.cloneNode(true);
            clone.style.width = `${width}px`;
            clone.style.margin = '0 auto';
            
            // Process formatting
            utils.processAllFormatting(clone);
            
            // Position offscreen for rendering
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            document.body.appendChild(clone);
            
            return clone;
        },
        
        /**
         * Generates a PDF from the container
         * @param {HTMLElement} container - Container to export
         * @param {string} filename - Base filename for the PDF
         */
        async generatePDF(container, filename) {
            utils.showNotification('Generating optimized PDF...');
            utils.showProgress(60, 'Rendering content...');
            
            // Create clone for rendering
            const clone = this.prepareContainerClone(container, CONFIG.STYLES.PDF.WIDTH);
            
            try {
                // Calculate best scale factor
                const scaleFactor = Math.min(CONFIG.STYLES.PDF.SCALE_FACTOR, window.devicePixelRatio || 1);
                
                // Render with html2canvas
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
                
                utils.showProgress(80, 'Creating PDF...');
                
                // Create high-quality image data
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                
                // Initialize jsPDF
                const { jsPDF } = window.jspdf;
                
                // PDF options for better compression
                const pdfOptions = {
                    compress: true,
                    precision: 2
                };
                
                // Create PDF document
                const pdf = new jsPDF(pdfOptions);
                
                // Get page dimensions
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                
                // Calculate image dimensions to fit page width
                const imgWidth = pageWidth;
                const imgHeight = canvas.height * imgWidth / canvas.width;
                
                // Calculate number of pages needed
                const totalPages = Math.ceil(imgHeight / pageHeight);
                
                // Update progress for multiple pages
                if (totalPages > 1) {
                    utils.showProgress(85, `Creating ${totalPages} page PDF...`);
                }
                
                // Add first page
                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
                
                // Add remaining pages if needed
                let heightLeft = imgHeight - pageHeight;
                let pageNum = 1;
                
                while (heightLeft > 0) {
                    pageNum++;
                    utils.showProgress(85 + (pageNum / totalPages) * 10, `Adding page ${pageNum}/${totalPages}...`);
                    
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, -(pageHeight * (pageNum-1)), imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                
                utils.showProgress(95, 'Optimizing PDF...');
                
                // Add metadata
                pdf.setProperties({
                    title: `Claude Chat: ${filename}`,
                    subject: 'Chat conversation with Claude',
                    creator: 'Claude Chat Exporter',
                    author: 'Claude User',
                    keywords: 'claude, chat, conversation',
                    creationDate: new Date()
                });
                
                // Save the PDF
                utils.showProgress(100, 'Saving PDF...');
                pdf.save(`${filename}-${Date.now()}.pdf`);
                utils.showNotification('Optimized PDF saved successfully');
            } finally {
                // Clean up the clone
                if (clone.parentNode) {
                    clone.parentNode.removeChild(clone);
                }
            }
        },
        
        /**
         * Generates a PNG from the container
         * @param {HTMLElement} container - Container to export
         * @param {string} filename - Base filename for the PNG
         */
        async generatePNG(container, filename) {
            utils.showNotification('Generating PNG...');
            utils.showProgress(60, 'Rendering content...');
            
            // Create clone for rendering
            const clone = this.prepareContainerClone(container, CONFIG.STYLES.PNG.WIDTH);
            
            try {
                // Render with html2canvas at higher quality
                const canvas = await html2canvas(clone, {
                    logging: false,
                    letterRendering: true,
                    foreignObjectRendering: false,
                    useCORS: true,
                    scale: window.devicePixelRatio * CONFIG.STYLES.PNG.SCALE_FACTOR || CONFIG.STYLES.PNG.SCALE_FACTOR,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    onclone: (clonedDoc) => {
                        const clonedContainer = clonedDoc.querySelector('.screenshot-container');
                        if (clonedContainer) {
                            clonedContainer.style.padding = '20px';
                        }
                    }
                });
                
                utils.showProgress(90, 'Creating PNG image...');
                const dataUrl = canvas.toDataURL("image/png");
                
                // Save the PNG
                utils.showProgress(100, 'Saving PNG...');
                const downloadLink = document.createElement("a");
                downloadLink.download = `${filename}-${Date.now()}.png`;
                downloadLink.href = dataUrl;
                downloadLink.click();
                
                utils.showNotification('Screenshot saved successfully');
            } finally {
                // Clean up the clone
                if (clone.parentNode) {
                    clone.parentNode.removeChild(clone);
                }
            }
        }
    };

    // Main execution
    (function main() {
        // Check if we're on Claude.ai
        if (!window.location.href.includes('claude.ai')) {
            utils.handleError('This bookmarklet only works on Claude chat pages');
            return;
        }
        
        // Check if export is already in progress
        if (state.isProcessing) {
            utils.handleError('Export already in progress');
            return;
        }
        
        // Show format selection modal
        ui.showFormatSelectionModal();
    })();
})();
