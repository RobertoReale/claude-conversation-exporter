javascript:(function(){
    // Constants
    const SELECTORS = {
        MAIN_CONTAINER: "div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-1",
        CHAT_TITLE: "button[data-testid='chat-menu-trigger']",
        USER_MESSAGES: "div.font-user-message"
    };
    
    const HTML2CANVAS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    
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
        handleError('Screenshot generation already in progress');
        return;
    }

    if (typeof html2canvas === 'undefined') {
        isLoading = true;
        const script = document.createElement('script');
        script.src = HTML2CANVAS_URL;
        script.onload = () => {
            isLoading = false;
            initScreenshot().catch(error => handleError('Screenshot generation failed', error));
        };
        script.onerror = () => {
            isLoading = false;
            handleError('Failed to load html2canvas library');
        };
        document.head.appendChild(script);
    } else {
        initScreenshot().catch(error => handleError('Screenshot generation failed', error));
    }

    async function initScreenshot() {
        const mainContainer = document.querySelector(SELECTORS.MAIN_CONTAINER);
        if (!mainContainer) {
            throw new Error('Could not find Claude chat container');
        }

        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
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
        timestamp.textContent = new Date().toLocaleTimeString();
        
        titleInnerContainer.appendChild(titleText);
        titleInnerContainer.appendChild(timestamp);
        titleContainer.appendChild(titleInnerContainer);
        
        // Insert title container as first child
        mainContainer.insertBefore(titleContainer, mainContainer.firstChild);
        cleanup.header = titleContainer;

        try {
            const canvas = await html2canvas(mainContainer, {
                logging: false,
                letterRendering: 1,
                foreignObjectRendering: false,
                useCORS: true,
                scale: window.devicePixelRatio || 1,
                onclone: (clonedDoc) => {
                    const clonedContainer = clonedDoc.querySelector('.screenshot-container');
                    if (clonedContainer) {
                        clonedContainer.style.padding = '20px';
                    }
                }
            });

            const dataUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${filename}-${Date.now()}.png`;
            downloadLink.href = dataUrl;
            downloadLink.click();

            showNotification('Screenshot saved successfully');
        } finally {
            performCleanup();
        }
    }
})();
