javascript:(function(){
    // Constants
    const SELECTORS = {
        MAIN_CONTAINER: "div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",
        CHAT_TITLE: "button[data-testid='chat-menu-trigger']",
        USER_MESSAGES: "div.font-user-message"
    };
    
    const HTML2CANVAS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    const JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    
    // Quality settings
    const QUALITY_SETTINGS = {
        SCALE: 2,              // Increased from 1 to 2 for better resolution
        IMAGE_QUALITY: 1,      // Maximum image quality (0-1)
        DPI: 300              // Higher DPI for better print quality
    };
    
    // State tracking
    let isLoading = false;
    let cleanup = {
        styleSheet: null,
        header: null,
        containerClass: false
    };

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
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
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
        cleanup = {
            styleSheet: null,
            header: null,
            containerClass: false
        };
    }

    if (!window.location.href.includes('claude.ai')) {
        handleError('This bookmarklet only works on Claude chat pages');
        return;
    }

    if (isLoading) {
        handleError('PDF generation already in progress');
        return;
    }

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
        });
    }

    async function loadDependencies() {
        isLoading = true;
        try {
            if (typeof html2canvas === 'undefined') {
                await loadScript(HTML2CANVAS_URL);
            }
            if (typeof jspdf === 'undefined') {
                await loadScript(JSPDF_URL);
            }
            isLoading = false;
            await initPDF();
        } catch (error) {
            isLoading = false;
            handleError('Failed to load required libraries', error);
        }
    }

    async function initPDF() {
        const mainContainer = document.querySelector(SELECTORS.MAIN_CONTAINER);
        if (!mainContainer) {
            throw new Error('Could not find Claude chat container');
        }

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
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
        `;
        document.head.appendChild(styleSheet);
        cleanup.styleSheet = styleSheet;

        mainContainer.classList.add('screenshot-container');
        cleanup.containerClass = true;

        const titleElement = document.querySelector(SELECTORS.CHAT_TITLE);
        const title = titleElement?.textContent || 'Claude Chat';
        const filename = title.trim()
            .toLowerCase()
            .replace(/^[^\w\d]+|[^\w\d]+$/g, "")
            .replace(/[\s\W-]+/g, "-") || "claude";

        // Create title container with proper structure
        const titleContainer = document.createElement("div");
        const titleInnerContainer = document.createElement("div");
        titleInnerContainer.className = "mb-1 mt-1";
        
        const titleText = document.createElement("div");
        titleText.className = "chat-title-text";
        titleText.textContent = title;
        
        const timestamp = document.createElement("div");
        timestamp.className = "chat-timestamp";
        timestamp.textContent = new Date().toLocaleString();
        
        titleInnerContainer.appendChild(titleText);
        titleInnerContainer.appendChild(timestamp);
        titleContainer.appendChild(titleInnerContainer);
        
        // Insert title container as first child
        mainContainer.insertBefore(titleContainer, mainContainer.firstChild);
        cleanup.header = titleContainer;

        try {
            showNotification('Generating high-quality PDF...');
            
            const canvas = await html2canvas(mainContainer, {
                logging: false,
                letterRendering: true,
                foreignObjectRendering: false,
                useCORS: true,
                scale: QUALITY_SETTINGS.SCALE * (window.devicePixelRatio || 1),
                allowTaint: false,
                backgroundColor: '#ffffff',
                imageTimeout: 0,
                onclone: (clonedDoc) => {
                    const clonedContainer = clonedDoc.querySelector('.screenshot-container');
                    if (clonedContainer) {
                        clonedContainer.style.padding = '40px';
                        // Ensure all text is rendered crisply
                        clonedContainer.style.webkitFontSmoothing = 'antialiased';
                        clonedContainer.style.mozOsxFontSmoothing = 'grayscale';
                    }
                }
            });

            // Create PDF with jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height],
                hotfixes: ['px_scaling'],
                compress: true
            });

            // Set PDF properties for better quality
            pdf.setProperties({
                title: title,
                creator: 'Claude Chat Export',
                subject: 'Chat Conversation',
                keywords: 'claude, chat, conversation',
                creationDate: new Date()
            });

            // Add the canvas as an image to the PDF with high quality
            pdf.addImage(
                canvas.toDataURL('image/jpeg', QUALITY_SETTINGS.IMAGE_QUALITY),
                'JPEG',
                0,
                0,
                canvas.width,
                canvas.height,
                undefined,
                'FAST',
                0
            );

            // Save the PDF with improved compression
            pdf.save(`${filename}-${Date.now()}.pdf`);

            showNotification('High-quality PDF saved successfully');
        } finally {
            performCleanup();
        }
    }

    loadDependencies().catch(error => handleError('PDF generation failed', error));
})();
