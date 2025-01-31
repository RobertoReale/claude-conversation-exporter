javascript:(function(){
    // Check if we're on a Claude page
    if (!window.location.href.includes('claude.ai')) {
        alert('This bookmarklet only works on Claude chat pages');
        return;
    }

    // Load html2canvas if not already loaded
    if (typeof html2canvas === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = initScreenshot;
        document.head.appendChild(script);
    } else {
        initScreenshot();
    }

    function initScreenshot() {
        // Get main container
        const mainContainer = document.querySelector("div.flex-1.flex.flex-col.gap-3.px-4");
        if (!mainContainer) {
            alert('Could not find Claude chat container');
            return;
        }

        // Add stylesheet for proper list formatting
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
            }
            body > div:last-child img {
                display: inline-block;
            }
        `;
        document.head.appendChild(styleSheet);

        // Add container class for styling
        mainContainer.classList.add('screenshot-container');

        // Setup styles for user messages
        document.querySelectorAll("div.font-user-message").forEach(msg => {
            msg.style.position = "relative";
        });

        // Get title and create filename
        const title = document.querySelector("button[data-testid='chat-menu-trigger']")?.textContent || '';
        const filename = title.trim()
            .toLowerCase()
            .replace(/^[^\w\d]+|[^\w\d]+$/g, "")
            .replace(/[\s\W-]+/g, "-") || "claude";

        // Create header with title and timestamp
        const header = document.createElement("div");
        header.style.cssText = `
            position: absolute;
            left: 0;
            right: 0;
            top: 8px;
            text-align: center;
            margin-bottom: 2em;
        `;

        const headerTitle = document.createElement("h1");
        headerTitle.textContent = title;
        headerTitle.style.fontSize = "18px";

        const timestamp = document.createElement("p");
        timestamp.textContent = new Date().toLocaleString();
        timestamp.style.cssText = "font-size: 12px; opacity: 0.7;";

        header.appendChild(headerTitle);
        header.appendChild(timestamp);
        mainContainer.prepend(header);

        // Generate and download image
        html2canvas(mainContainer, {
            logging: true,
            letterRendering: 1,
            foreignObjectRendering: false,
            useCORS: true,
            scale: window.devicePixelRatio || 1,
            onclone: (clonedDoc) => {
                // Ensure styles are applied to cloned document
                clonedDoc.querySelector('.screenshot-container').style.padding = '20px';
            }
        })
        .then(canvas => {
            canvas.style.display = "none";
            document.body.appendChild(canvas);
            return canvas;
        })
        .then(canvas => {
            const dataUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `${filename}.png`;
            downloadLink.href = dataUrl;
            downloadLink.click();
            canvas.remove();
        })
        .then(() => {
            // Cleanup
            styleSheet.remove();
            header.remove();
            mainContainer.classList.remove('screenshot-container');
        })
        .catch(error => {
            alert('Error generating screenshot: ' + error.message);
            // Cleanup on error
            styleSheet?.remove();
            header?.remove();
            mainContainer.classList.remove('screenshot-container');
        });
    }
})();
