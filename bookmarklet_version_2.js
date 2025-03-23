javascript:(function(){
    // ---------------------------
    // Main Selectors
    // ---------------------------
    const SELECTORS = {
        MAIN_CONTAINER: "div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",
        CHAT_TITLE: "button[data-testid='chat-menu-trigger']",
        USER_MESSAGES: "div.font-user-message",
        CLAUDE_MESSAGES: "div[data-testid='chat-message-content']",

        // Documents/attachments
        DOCUMENT_CONTAINERS: "div.mx-0\\.5.mb-3.flex.flex-wrap.gap-2",
        DOCUMENT_ITEMS: ".font-styrene.transition-all.rounded-lg",

        // Disclaimer: "Claude può commettere errori..."
        DISCLAIMER_CONTAINER: "div.ml-1.mt-0\\.5.flex.items-center.transition-transform.duration-300.ease-out",
        
        // Code and math
        CODE_BLOCKS: "pre",
        INLINE_CODE: "code:not(pre code)",
        MATH_ELEMENTS: ".katex, .katex-display, .math, .math-display"
    };

    // ---------------------------
    // Dependencies
    // ---------------------------
    const DEPENDENCIES = {
        HTML2CANVAS_URL: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        JSPDF_URL: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    };

    // ---------------------------
    // State and cleanup
    // ---------------------------
    let isLoading = false;
    let cleanup = {
        styleSheet: null,
        modal: null,
        progressBar: null,
        tempElements: []
    };

    // Export options
    let exportOptions = {
        limit: null,
        order: 'start',
        removeDocuments: true, // Always active
        addMessageLabels: true  // Add "You:" and "Claude:" labels
    };

    // ---------------------------
    // Notification and cleanup utilities
    // ---------------------------
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
        cleanup.tempElements.push(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                    const index = cleanup.tempElements.indexOf(notification);
                    if (index > -1) {
                        cleanup.tempElements.splice(index, 1);
                    }
                }
            }, 300);
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
            cleanup.progressBar = { container: progressContainer, fill: progressFill, text: percentText, message: messageElement };
            cleanup.tempElements.push(progressContainer);
        }
        
        if (cleanup.progressBar) {
            cleanup.progressBar.fill.style.width = `${percent}%`;
            cleanup.progressBar.text.textContent = `${Math.round(percent)}%`;
            if (message !== cleanup.progressBar.message.textContent) {
                cleanup.progressBar.message.textContent = message;
            }
            if (percent >= 100) {
                setTimeout(() => {
                    if (cleanup.progressBar && cleanup.progressBar.container && cleanup.progressBar.container.parentNode) {
                        cleanup.progressBar.container.remove();
                        const index = cleanup.tempElements.indexOf(cleanup.progressBar.container);
                        if (index > -1) {
                            cleanup.tempElements.splice(index, 1);
                        }
                        cleanup.progressBar = null;
                    }
                }, 500);
            }
        }
    }

    function performCleanup() {
        if (cleanup.styleSheet && cleanup.styleSheet.parentNode) {
            cleanup.styleSheet.remove();
        }
        
        if (cleanup.modal && cleanup.modal.parentNode) {
            cleanup.modal.remove();
        }
        
        if (cleanup.progressBar && cleanup.progressBar.container && cleanup.progressBar.container.parentNode) {
            cleanup.progressBar.container.remove();
        }
        
        cleanup.tempElements.forEach(element => {
            if (element && element.parentNode) {
                element.remove();
            }
        });
        
        cleanup = { 
            styleSheet: null, 
            modal: null, 
            progressBar: null, 
            tempElements: [] 
        };
        
        isLoading = false;
    }

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Unable to load ${url}`));
            document.head.appendChild(script);
            cleanup.tempElements.push(script);
        });
    }

    // ---------------------------
    // Remove attachments and empty spaces
    // ---------------------------
    function removeDocumentAttachments(container) {
        try {
            const documentContainers = container.querySelectorAll(SELECTORS.DOCUMENT_CONTAINERS);
            documentContainers.forEach(docContainer => {
                const documentItems = docContainer.querySelectorAll(SELECTORS.DOCUMENT_ITEMS);
                if (documentItems.length > 0) {
                    if (documentItems.length === docContainer.children.length) {
                        docContainer.remove();
                    } else {
                        documentItems.forEach(item => item.remove());
                    }
                }
                // Remove any <img> / previews with object-cover class
                const objectCovers = docContainer.querySelectorAll('.object-cover');
                objectCovers.forEach(cover => {
                    const parentDiv = cover.closest('div:not(.group)');
                    if (parentDiv) {
                        parentDiv.remove();
                    } else {
                        cover.remove();
                    }
                });
            });
            
            // Other residuals
            const allObjectCovers = container.querySelectorAll('.object-cover');
            allObjectCovers.forEach(cover => {
                const parentDiv = cover.closest('div:not(.group)');
                if (parentDiv) {
                    parentDiv.remove();
                } else {
                    cover.remove();
                }
            });
        } catch (error) {
            console.error("Error removing document attachments:", error);
        }
    }

    function removeUnusedSpaces(container) {
        try {
            // Remove the "Claude può commettere errori..." section
            const disclaimers = container.querySelectorAll(SELECTORS.DISCLAIMER_CONTAINER);
            disclaimers.forEach(d => {
                const parent = d.parentNode;
                d.remove();
                if (parent && parent.childNodes.length === 0) {
                    parent.remove();
                }
            });
        } catch (error) {
            console.error("Error removing unused spaces:", error);
        }
    }

    // ---------------------------
    // Remove Tailwind margin/padding classes
    // ---------------------------
    function removeMarginPaddingClasses(container) {
        // Add spacing classes to remove
        const spacingClasses = [
            'm-1','m-2','m-3','m-4','m-5','m-6','m-7','m-8','m-9','m-10','m-11','m-12',
            'mb-1','mb-2','mb-3','mb-4','mb-5','mb-6','mb-7','mb-8','mb-9','mb-10','mb-11','mb-12',
            'mt-1','mt-2','mt-3','mt-4','mt-5','mt-6','mt-7','mt-8','mt-9','mt-10','mt-11','mt-12',
            'mr-1','mr-2','mr-3','mr-4','mr-5','mr-6','mr-7','mr-8','mr-9','mr-10','mr-11','mr-12',
            'ml-1','ml-2','ml-3','ml-4','ml-5','ml-6','ml-7','ml-8','ml-9','ml-10','ml-11','ml-12',
            'py-1','py-2','py-3','py-4','py-5','py-6','py-7','py-8','py-9','py-10','py-11','py-12',
            'px-1','px-2','px-3','px-4','px-5','px-6','px-7','px-8','px-9','px-10','px-11','px-12'
        ];

        spacingClasses.forEach(cls => {
            container.querySelectorAll('.' + cls).forEach(el => {
                el.classList.remove(cls);
            });
        });
    }

    // ---------------------------
    // Recursively remove empty containers
    // ---------------------------
    function removeAllEmptyContainers(container) {
        let repeat = true;
        while (repeat) {
            repeat = false;
            const allElements = container.querySelectorAll('*');
            allElements.forEach(el => {
                // Avoid removing the main container
                if (el === container) return;
                // If it has no children and no text
                if (!el.hasChildNodes() || el.textContent.trim() === '') {
                    el.remove();
                    repeat = true;
                }
            });
        }
    }

    // ---------------------------
    // Apply export options
    // ---------------------------
    function applyExportOptions(container, options) {
        try {
            // Message limit
            const allMessages = Array.from(container.querySelectorAll('.group'));
            if (options.limit && options.limit < allMessages.length) {
                let messagesToKeep;
                if (options.order === 'start') {
                    messagesToKeep = allMessages.slice(0, options.limit);
                } else if (options.order === 'end') {
                    messagesToKeep = allMessages.slice(-options.limit);
                } else {
                    messagesToKeep = allMessages;
                }
                
                allMessages.forEach(msg => {
                    if (msg.parentNode) {
                        msg.remove();
                    }
                });
                
                const header = container.querySelector('.chat-title-container');
                if (header) {
                    messagesToKeep.forEach(msg => header.parentNode.insertBefore(msg, header.nextSibling));
                } else {
                    messagesToKeep.forEach(msg => container.appendChild(msg));
                }
            }

            // Add message role labels if enabled
            if (options.addMessageLabels) {
                const messages = container.querySelectorAll('[data-testid="chat-message"]');
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
            }

            // Remove attachments, disclaimer, and similar
            removeDocumentAttachments(container);
            removeUnusedSpaces(container);

            // Remove spacing classes and empty containers
            removeMarginPaddingClasses(container);
            removeAllEmptyContainers(container);

        } catch (error) {
            console.error("Error applying export options:", error);
        }
    }

    // ---------------------------
    // Format selection popup
    // ---------------------------
    function showFormatSelectionModal() {
        if (isLoading) return;
        
        try {
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
            subtitle.textContent = 'Choose export format and message limit:';
            subtitle.style.margin = '0 0 25px 0';

            const optionsContainer = document.createElement('div');
            optionsContainer.style.margin = '20px 0';
            
            // Message limit input
            const limitLabel = document.createElement('label');
            limitLabel.textContent = 'Number of messages to export: ';
            limitLabel.style.marginRight = '10px';
            
            const limitInput = document.createElement('input');
            limitInput.type = 'number';
            limitInput.id = 'messageLimitInput';
            limitInput.min = '1';
            limitInput.placeholder = 'Leave empty for all';
            limitInput.style.padding = '5px';
            limitInput.style.borderRadius = '3px';
            limitInput.style.border = '1px solid #ccc';
            limitInput.style.width = '150px';
            limitLabel.appendChild(limitInput);
            optionsContainer.appendChild(limitLabel);

            // Message order
            const orderLabel = document.createElement('div');
            orderLabel.textContent = 'Message order:';
            orderLabel.style.marginTop = '15px';
            orderLabel.style.marginBottom = '5px';
            optionsContainer.appendChild(orderLabel);
            
            const radioContainer = document.createElement('div');
            radioContainer.style.display = 'flex';
            radioContainer.style.justifyContent = 'center';
            radioContainer.style.gap = '20px';
            radioContainer.style.margin = '5px 0 15px 0';

            const startRadio = document.createElement('input');
            startRadio.type = 'radio';
            startRadio.name = 'messageOrder';
            startRadio.value = 'start';
            startRadio.id = 'orderStart';
            startRadio.checked = true;
            
            const startRadioLabel = document.createElement('label');
            startRadioLabel.textContent = 'From beginning';
            startRadioLabel.setAttribute('for', 'orderStart');
            startRadioLabel.style.marginLeft = '5px';
            
            const endRadio = document.createElement('input');
            endRadio.type = 'radio';
            endRadio.name = 'messageOrder';
            endRadio.value = 'end';
            endRadio.id = 'orderEnd';
            
            const endRadioLabel = document.createElement('label');
            endRadioLabel.textContent = 'From end';
            endRadioLabel.setAttribute('for', 'orderEnd');
            endRadioLabel.style.marginLeft = '5px';

            const startContainer = document.createElement('div');
            startContainer.style.display = 'flex';
            startContainer.style.alignItems = 'center';
            startContainer.appendChild(startRadio);
            startContainer.appendChild(startRadioLabel);

            const endContainer = document.createElement('div');
            endContainer.style.display = 'flex';
            endContainer.style.alignItems = 'center';
            endContainer.appendChild(endRadio);
            endContainer.appendChild(endRadioLabel);

            radioContainer.appendChild(startContainer);
            radioContainer.appendChild(endContainer);
            optionsContainer.appendChild(radioContainer);
            
            // Add labels option
            const labelsContainer = document.createElement('div');
            labelsContainer.style.display = 'flex';
            labelsContainer.style.alignItems = 'center';
            labelsContainer.style.justifyContent = 'center';
            labelsContainer.style.margin = '15px 0';
            
            const labelsCheck = document.createElement('input');
            labelsCheck.type = 'checkbox';
            labelsCheck.id = 'addLabelsCheck';
            labelsCheck.checked = true;
            
            const labelsLabel = document.createElement('label');
            labelsLabel.textContent = 'Add "You:" and "Claude:" labels';
            labelsLabel.setAttribute('for', 'addLabelsCheck');
            labelsLabel.style.marginLeft = '8px';
            
            labelsContainer.appendChild(labelsCheck);
            labelsContainer.appendChild(labelsLabel);
            optionsContainer.appendChild(labelsContainer);

            modalContent.appendChild(title);
            modalContent.appendChild(subtitle);
            modalContent.appendChild(optionsContainer);
            
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; justify-content: space-around; margin-top: 20px;';

            const retrieveExportOptions = () => {
                const limitValue = parseInt(document.getElementById('messageLimitInput').value);
                return { 
                    limit: isNaN(limitValue) ? null : limitValue,
                    order: document.querySelector('input[name="messageOrder"]:checked').value,
                    removeDocuments: true,
                    addMessageLabels: document.getElementById('addLabelsCheck').checked
                };
            };

            const createButton = (text, format) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.style.cssText = 'padding: 12px 25px; background: #5A67D8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.2s;';
                button.addEventListener('mouseover', () => { button.style.background = '#4C51BF'; });
                button.addEventListener('mouseout', () => { button.style.background = '#5A67D8'; });
                button.addEventListener('click', async () => {
                    try {
                        exportOptions = retrieveExportOptions();
                        if (modal.parentNode) {
                            modal.remove();
                        }
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
            cancelButton.style.cssText = 'padding: 12px 25px; background: #E2E8F0; color: #4A5568; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background 0.2s;';
            cancelButton.addEventListener('mouseover', () => { cancelButton.style.background = '#CBD5E0'; });
            cancelButton.addEventListener('mouseout', () => { cancelButton.style.background = '#E2E8F0'; });
            cancelButton.addEventListener('click', () => { 
                if (modal.parentNode) {
                    modal.remove();
                }
                performCleanup();
            });
            
            buttonContainer.appendChild(pdfButton);
            buttonContainer.appendChild(pngButton);
            buttonContainer.appendChild(cancelButton);
            modalContent.appendChild(buttonContainer);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            cleanup.modal = modal;
            cleanup.tempElements.push(modal);
        } catch (error) {
            handleError(`Error showing modal: ${error.message}`, error);
        }
    }

    // ---------------------------
    // Load dependencies
    // ---------------------------
    async function loadDependencies(format) {
        if (isLoading) return;
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
            handleError(`Unable to load required libraries: ${error.message}`, error);
        }
    }

    // ---------------------------
    // Start export
    // ---------------------------
    async function initExport(format) {
        try {
            // Check if we're on Claude.ai
            if (!window.location.href.includes('claude.ai')) {
                throw new Error('This bookmarklet only works on Claude chat pages');
            }
            
            const mainContainer = document.querySelector(SELECTORS.MAIN_CONTAINER);
            if (!mainContainer) {
                throw new Error('Chat conversation container not found');
            }
            
            // Clone the container
            const exportContainer = mainContainer.cloneNode(true);
            
            // Apply the options
            if (exportOptions) {
                applyExportOptions(exportContainer, exportOptions);
            }
            
            // Add styling for export
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
                    color: hsl(var(--text-100, #333)) !important;
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
                
                /* Message container styles */
                .screenshot-container .group {
                    padding: 0.75rem !important;
                    margin-bottom: 1rem !important;
                    background-color: hsl(var(--bg-100, #f8f9fa)) !important;
                    border-radius: 0.5rem !important;
                }
                
                /* Claude messages style */
                .screenshot-container [data-testid="chat-message-content"] {
                    font-family: var(--font-serif, Georgia, serif) !important;
                    font-size: 1rem !important;
                    line-height: 1.65 !important;
                    color: hsl(var(--text-100, #333)) !important;
                    letter-spacing: -0.015em !important;
                    margin-bottom: 1.5rem !important;
                    padding: 0.75rem !important;
                }
                
                /* Code block style */
                .screenshot-container pre {
                    font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace !important;
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
                    font-family: 'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace !important;
                    font-size: 0.9rem !important;
                    background-color: rgba(0, 0, 0, 0.05) !important;
                    color: hsl(var(--danger-000, #8B0000)) !important;
                    padding: 0px 4px !important;
                    margin: 0 2px !important;
                    border: 0.5px solid hsl(var(--border-300, #DDD)) !important;
                    border-radius: 0.3rem !important;
                    white-space: pre-wrap !important;
                }
                
                /* Strong and bold text */
                .screenshot-container strong, .screenshot-container b {
                    font-weight: 700 !important;
                    vertical-align: baseline !important;
                    position: static !important;
                    display: inline !important;
                    line-height: inherit !important;
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    margin-top: 0 !important;
                    margin-bottom: 0 !important;
                    transform: none !important;
                    float: none !important;
                }
                
                /* KaTeX math formulas */
                .screenshot-container .katex-display {
                    display: block !important;
                    margin: 1em 0 !important;
                    text-align: center !important;
                    overflow: visible !important;
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
                
                .screenshot-container .katex .mfrac .num,
                .screenshot-container .katex .mfrac .den {
                    display: block !important;
                    text-align: center !important;
                }
                
                .screenshot-container .katex .mfrac .num {
                    margin-bottom: 0.15em !important;
                }
                
                .screenshot-container .katex .mfrac .den {
                    margin-top: 0.15em !important;
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
                
                /* Tables */
                .screenshot-container table {
                    border-collapse: collapse !important;
                    width: 100% !important;
                    margin: 1rem 0 !important;
                }
                
                .screenshot-container th {
                    background-color: hsl(var(--bg-300, #e9ecef)) !important;
                    color: hsl(var(--text-000, #212529)) !important;
                    font-weight: bold !important;
                    text-align: left !important;
                    padding: 0.75rem !important;
                    border: 1px solid hsl(var(--border-200, #dee2e6)) !important;
                }
                
                .screenshot-container td {
                    padding: 0.75rem !important;
                    border: 1px solid hsl(var(--border-200, #dee2e6)) !important;
                }
                
                .screenshot-container tr:nth-child(even) {
                    background-color: hsl(var(--bg-100, #f8f9fa)) !important;
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
                
                /* Message labels */
                .message-role {
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                    color: hsl(var(--text-200, #6c757d));
                }
            `;
            document.head.appendChild(styleSheet);
            cleanup.styleSheet = styleSheet;
            cleanup.tempElements.push(styleSheet);
            
            // Header (chat title)
            const titleElement = document.querySelector(SELECTORS.CHAT_TITLE);
            const titleText = titleElement ? titleElement.textContent : 'Claude Chat';
            
            const headerClone = document.createElement('div');
            headerClone.className = 'chat-title-container';
            headerClone.style.cssText = `
                padding: 15px 0;
                margin-bottom: 20px;
                border-bottom: 1px solid #eaeaea;
                text-align: center;
            `;
            
            const titleDiv = document.createElement('div');
            titleDiv.className = 'chat-title-text';
            titleDiv.style.cssText = `
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            `;
            titleDiv.textContent = titleText;
            
            const timestamp = document.createElement('div');
            timestamp.className = 'chat-timestamp';
            timestamp.style.cssText = `
                font-size: 14px;
                color: #666;
            `;
            timestamp.textContent = new Date().toLocaleString();
            
            headerClone.appendChild(titleDiv);
            headerClone.appendChild(timestamp);
            exportContainer.insertBefore(headerClone, exportContainer.firstChild);
            
            // Wrapper off-screen
            const exportWrapper = document.createElement('div');
            exportWrapper.classList.add('screenshot-container');
            exportWrapper.style.cssText = `
                width: 800px;
                margin: 0 auto;
                background-color: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.12);
                border-radius: 8px;
                padding: 0;
                position: absolute;
                left: -9999px;
                top: 0;
            `;
            
            exportWrapper.appendChild(exportContainer);
            document.body.appendChild(exportWrapper);
            cleanup.tempElements.push(exportWrapper);
            
            // Export
            if (format === 'pdf') {
                await generatePDF(exportWrapper, titleText);
            } else {
                await generatePNG(exportWrapper, titleText);
            }
            
            // Remove the clone
            if (exportWrapper.parentNode) {
                exportWrapper.remove();
                const index = cleanup.tempElements.indexOf(exportWrapper);
                if (index > -1) {
                    cleanup.tempElements.splice(index, 1);
                }
            }
        } catch (error) {
            handleError(`Error preparing export: ${error.message}`, error);
        }
    }

    // ---------------------------
    // PDF Generation
    // ---------------------------
    async function generatePDF(container, filename) {
        try {
            showNotification('Generating optimized PDF...');
            showProgress(60, 'Rendering content...');
            
            processCodeFormatting(container);
            processKaTeXFormatting(container);
            processBoldTextFormatting(container);
            
            const scaleFactor = Math.min(1.5, window.devicePixelRatio || 1);
            const canvas = await html2canvas(container, {
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
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const { jsPDF } = window.jspdf;
            const pdfOptions = { compress: true, precision: 2 };
            const pdf = new jsPDF(pdfOptions);
            
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            const totalPages = Math.ceil(imgHeight / pageHeight);
            
            if (totalPages > 1) {
                showProgress(85, `Creating ${totalPages} page PDF...`);
            }
            
            // First page
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            
            let heightLeft = imgHeight - pageHeight;
            let pageNum = 1;
            
            // Additional pages
            while (heightLeft > 0) {
                pageNum++;
                showProgress(85 + (pageNum / totalPages) * 10, `Adding page ${pageNum}/${totalPages}...`);
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, -(pageHeight * (pageNum - 1)), imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            showProgress(95, 'Optimizing PDF...');
            
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
            performCleanup();
        } catch (error) {
            handleError(`Error generating PDF: ${error.message}`, error);
        }
    }

    // ---------------------------
    // PNG Generation
    // ---------------------------
    async function generatePNG(container, filename) {
        try {
            showNotification('Generating PNG...');
            showProgress(60, 'Rendering content...');
            
            processCodeFormatting(container);
            processKaTeXFormatting(container);
            processBoldTextFormatting(container);
            
            const canvas = await html2canvas(container, {
                logging: false,
                letterRendering: true,
                foreignObjectRendering: false,
                useCORS: true,
                scale: window.devicePixelRatio * 2 || 2,
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
            performCleanup();
        } catch (error) {
            handleError(`Error generating PNG: ${error.message}`, error);
        }
    }

    // ---------------------------
    // Additional formatting
    // ---------------------------
    function processCodeFormatting(container) {
        try {
            const codeBlocks = container.querySelectorAll('pre');
            codeBlocks.forEach(block => {
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
                block.style.backgroundColor = '#282c34';
                block.style.color = '#abb2bf';
                block.style.padding = '15px';
                block.style.borderRadius = '8px';
                block.style.overflowX = 'auto';
                block.style.fontSize = '14px';
                block.style.fontFamily = "'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace";
            });
            
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
        } catch (error) {
            console.error("Error processing code formatting:", error);
        }
    }

    function processKaTeXFormatting(container) {
        try {
            const katexElements = container.querySelectorAll('.katex, .katex-display, .katex-html');
            katexElements.forEach(element => {
                element.style.display = 'inline-block';
                element.style.textRendering = 'auto';
                element.style.fontSize = '1.1em';
                element.style.fontFamily = 'KaTeX_Main, Times New Roman, serif';
                
                const fracLines = element.querySelectorAll('.frac-line');
                fracLines.forEach(line => {
                    line.style.position = 'relative';
                    line.style.display = 'block';
                    line.style.margin = '0.1em 0';
                    line.style.borderBottom = '1px solid';
                    line.style.borderTop = '0';
                });
                
                const nums = element.querySelectorAll('.num');
                nums.forEach(num => {
                    num.style.display = 'block';
                    num.style.textAlign = 'center';
                    num.style.marginBottom = '0.15em';
                });
                
                const dens = element.querySelectorAll('.den');
                dens.forEach(den => {
                    den.style.display = 'block';
                    den.style.textAlign = 'center';
                    den.style.marginTop = '0.15em';
                });
            });
            
            const katexDisplays = container.querySelectorAll('.katex-display');
            katexDisplays.forEach(display => {
                display.style.display = 'block';
                display.style.margin = '1em 0';
                display.style.textAlign = 'center';
                display.style.overflow = 'visible';
            });
        } catch (error) {
            console.error("Error processing KaTeX formatting:", error);
        }
    }

    function processBoldTextFormatting(container) {
        try {
            const boldElements = container.querySelectorAll('strong, b');
            boldElements.forEach(element => {
                element.style.fontWeight = '700';
                element.style.verticalAlign = 'baseline';
                element.style.position = 'static';
                element.style.display = 'inline';
                element.style.lineHeight = 'inherit';
                element.style.paddingTop = '0';
                element.style.paddingBottom = '0';
                element.style.marginTop = '0';
                element.style.marginBottom = '0';
                element.style.transform = 'none';
                element.style.float = 'none';
            });
        } catch (error) {
            console.error("Error processing bold text formatting:", error);
        }
    }

    // Check if we're on Claude.ai
    if (!window.location.href.includes('claude.ai')) {
        handleError('This bookmarklet only works on Claude chat pages');
        return;
    }

    // Start
    try {
        showFormatSelectionModal();
    } catch (error) {
        handleError(`Error initializing exporter: ${error.message}`, error);
    }
})();
