javascript:!function(){if("undefined"==typeof html2pdf){var e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",e.onload=t,document.head.appendChild(e)}else t();function t(){
    // Find the main chat container
    const mainContainer = document.querySelector("div.flex-1.flex.flex-col.gap-3.px-4");
    if (!mainContainer) {
        alert("Could not find Claude chat container");
        return;
    }

    // Create a clone of the container to avoid modifying the original
    let container = mainContainer.cloneNode(true);
    
    // Add styling
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .pdf-container {
            background-color: white;
            padding: 20px;
            font-family: system-ui, -apple-system, sans-serif;
            color: #2D3748;
        }
        .pdf-container ol {
            list-style-type: decimal !important;
            padding-left: 2.5em !important;
            margin-left: .5em !important;
            margin-top: 1em !important;
            margin-bottom: 1em !important;
        }
        .pdf-container ol li {
            padding-left: .5em !important;
            margin-bottom: .5em !important;
        }
        .pdf-container ul {
            list-style-type: disc !important;
            padding-left: 2.5em !important;
            margin-left: .5em !important;
            margin-top: 1em !important;
            margin-bottom: 1em !important;
        }
        .pdf-container ul li {
            padding-left: .5em !important;
            margin-bottom: .5em !important;
        }
        .pdf-container pre, .pdf-container code {
            background-color: #F7FAFC;
            padding: 8px;
            border-radius: 4px;
            margin: 10px 0;
            overflow-x: auto;
            font-family: monospace;
        }
        .pdf-container .font-user-message,
        .pdf-container .font-claude-message {
            background-color: white;
            border-radius: 8px;
            padding: 16px;
            margin: 8px 0;
        }
        .pdf-container p {
            margin-bottom: 1em;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Create wrapper with header
    let wrapper = document.createElement("div");
    wrapper.className = "pdf-container";
    
    // Add header with title and timestamp
    let header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "30px";
    let title = document.createElement("h1");
    title.style.fontSize = "18px";
    title.style.marginBottom = "10px";
    title.textContent = document.querySelector("button[data-testid='chat-menu-trigger']")?.textContent || "Chat Conversation";
    let timestamp = document.createElement("div");
    timestamp.style.fontSize = "12px";
    timestamp.style.color = "#666";
    timestamp.style.opacity = "0.7";
    timestamp.textContent = new Date().toLocaleString();
    header.appendChild(title);
    header.appendChild(timestamp);
    
    // Add content
    wrapper.appendChild(header);
    wrapper.appendChild(container);

    let options = {
        margin: [20, 20, 20, 20],
        filename: "claude-chat.pdf",
        image: { 
            type: "jpeg", 
            quality: 0.98 
        },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: -window.scrollY,
            windowHeight: document.documentElement.offsetHeight
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        },
        pagebreak: { 
            mode: ["avoid-all", "css", "legacy"]
        }
    };

    html2pdf().from(wrapper).set(options).save()
        .then(() => {
            console.log("PDF generated successfully!");
            styleSheet.remove();
        })
        .catch(err => {
            console.error("Error generating PDF:", err);
            alert("Error generating PDF. Check console for details.");
            styleSheet.remove();
        });
}}();
