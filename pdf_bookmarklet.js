javascript:(function(){
    // Check if we're on a Claude page
    if (!window.location.href.includes('claude.ai')) {
        alert('This bookmarklet only works on Claude chat pages');
        return;
    }

    // Load required libraries if not already loaded
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Load both required libraries
    Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    ]).then(initPDF).catch(err => alert('Error loading required libraries: ' + err.message));

    function initPDF() {
        // Get main container
        const mainContainer = document.querySelector("div.flex-1.flex.flex-col.gap-3.px-4");
        if (!mainContainer) {
            alert('Could not find Claude chat container');
            return;
        }

        // Add stylesheet for proper list formatting and improved text rendering
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .pdf-container {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
            }
            .pdf-container ol {
                list-style-type: decimal !important;
                padding-left: 2.5em !important;
                margin-left: 0.5em !important;
                margin-top: 1em !important;
                margin-bottom: 1em !important;
            }
            .pdf-container ol li {
                padding-left: 0.5em !important;
                margin-bottom: 0.5em !important;
            }
            .pdf-container ul {
                list-style-type: disc !important;
                padding-left: 2.5em !important;
                margin-left: 0.5em !important;
                margin-top: 1em !important;
                margin-bottom: 1em !important;
            }
            .pdf-container ul li {
                padding-left: 0.5em !important;
                margin-bottom: 0.5em !important;
            }
            .pdf-container img {
                display: inline-block;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
            }
            .pdf-container pre, .pdf-container code {
                font-family: 'Courier New', Courier, monospace !important;
                font-smooth: never;
                -webkit-font-smoothing: none;
            }
            body > div:last-child img {
                display: inline-block;
            }
        `;
        document.head.appendChild(styleSheet);

        // Add container class for styling
        mainContainer.classList.add('pdf-container');

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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        `;

        const headerTitle = document.createElement("h1");
        headerTitle.textContent = title;
        headerTitle.style.fontSize = "18px";
        headerTitle.style.fontWeight = "600";

        const timestamp = document.createElement("p");
        timestamp.textContent = new Date().toLocaleString();
        timestamp.style.cssText = "font-size: 12px; opacity: 0.7;";

        header.appendChild(headerTitle);
        header.appendChild(timestamp);
        mainContainer.prepend(header);

        // Calculate optimal scale factor based on screen DPI
        const scaleFactor = Math.max(2, window.devicePixelRatio || 1);

        // Generate high-quality canvas
        html2canvas(mainContainer, {
            logging: false,
            letterRendering: true,
            foreignObjectRendering: false,
            useCORS: true,
            scale: scaleFactor,
            scrollY: -window.scrollY,
            windowWidth: document.documentElement.offsetWidth,
            windowHeight: document.documentElement.offsetHeight,
            onclone: (clonedDoc) => {
                const container = clonedDoc.querySelector('.pdf-container');
                container.style.padding = '20px';
                container.style.width = '100%';
                // Ensure all code blocks and pre elements are properly rendered
                container.querySelectorAll('pre, code').forEach(el => {
                    el.style.fontFamily = 'Courier New, Courier, monospace';
                    el.style.fontSize = '14px';
                    el.style.lineHeight = '1.4';
                });
            }
        })
        .then(canvas => {
            // Create PDF with higher quality settings
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width / scaleFactor, canvas.height / scaleFactor],
                hotfixes: ['px_scaling'],
                compress: true
            });

            // Add the canvas as a high-quality image to the PDF
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor, undefined, 'FAST');

            // Save the PDF with enhanced quality
            pdf.save(`${filename}.pdf`);
        })
        .then(() => {
            // Cleanup
            styleSheet.remove();
            header.remove();
            mainContainer.classList.remove('pdf-container');
        })
        .catch(error => {
            alert('Error generating PDF: ' + error.message);
            // Cleanup on error
            styleSheet?.remove();
            header?.remove();
            mainContainer.classList.remove('pdf-container');
        });
    }
})();
