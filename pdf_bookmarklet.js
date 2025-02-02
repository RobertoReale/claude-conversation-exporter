javascript:!function(){if("undefined"==typeof html2pdf){var e=document.createElement("script");e.src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js",e.onload=t,document.head.appendChild(e)}else t();function t(){
    // Get both Claude and user messages
    let claudeMessages = Array.from(document.getElementsByClassName("font-claude-message"));
    let userMessages = Array.from(document.getElementsByClassName("font-user-message"));
    
    // Combine and sort messages by their DOM position
    let allMessages = [...claudeMessages, ...userMessages].sort((a, b) => {
        return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });

    if(0 === allMessages.length) {
        alert("No messages found in the conversation.");
        return;
    }

    let container = document.createElement("div");
    container.style.padding = "20px";
    container.style.backgroundColor = "white";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.fontSize = "14px";
    container.style.color = "#2D3748";

    // Add title and timestamp
    let header = document.createElement("div");
    header.style.textAlign = "center";
    header.style.marginBottom = "30px";
    let title = document.createElement("h1");
    title.style.fontSize = "24px";
    title.style.marginBottom = "10px";
    title.textContent = document.querySelector("button[data-testid='chat-menu-trigger']")?.textContent || "Chat Conversation";
    let timestamp = document.createElement("div");
    timestamp.style.fontSize = "12px";
    timestamp.style.color = "#666";
    timestamp.textContent = new Date().toLocaleString();
    header.appendChild(title);
    header.appendChild(timestamp);
    container.appendChild(header);

    allMessages.forEach((msg, index) => {
        let messageDiv = document.createElement("div");
        messageDiv.style.marginBottom = "30px";
        messageDiv.style.padding = "20px";
        messageDiv.style.borderBottom = "1px solid #E2E8F0";
        messageDiv.style.breakInside = "avoid-page";
        messageDiv.style.pageBreakInside = "avoid";

        let messageHeader = document.createElement("div");
        messageHeader.style.fontSize = "16px";
        messageHeader.style.fontWeight = "bold";
        messageHeader.style.color = "#4A5568";
        messageHeader.style.marginBottom = "15px";
        messageHeader.style.backgroundColor = msg.classList.contains("font-user-message") ? "#F7FAFC" : "#EBF8FF";
        messageHeader.style.padding = "8px";
        messageHeader.style.borderRadius = "4px";
        messageHeader.textContent = msg.classList.contains("font-user-message") ? `User Message #${Math.floor(index/2 + 1)}` : `Claude Response #${Math.floor(index/2 + 1)}`;

        let content = msg.cloneNode(true);
        content = styleContent(content);

        messageDiv.appendChild(messageHeader);
        messageDiv.appendChild(content);
        container.appendChild(messageDiv);
    });

    function styleContent(element) {
        // Style lists
        element.querySelectorAll("ol, ul").forEach(list => {
            list.style.paddingLeft = "30px";
            list.style.marginLeft = "15px";
            list.style.listStylePosition = "outside";
            list.style.listStyleType = list.tagName === "OL" ? "decimal" : "disc";
            
            list.querySelectorAll("li").forEach(item => {
                item.style.marginBottom = "10px";
                item.style.paddingLeft = "10px";
                item.style.breakInside = "avoid";
                item.style.pageBreakInside = "avoid";
            });
        });

        // Style paragraphs
        element.querySelectorAll("p").forEach(p => {
            p.style.marginBottom = "15px";
            p.style.lineHeight = "1.5";
            p.style.breakInside = "avoid";
            p.style.pageBreakInside = "avoid";
        });

        // Style code blocks
        element.querySelectorAll("pre, code").forEach(code => {
            code.style.fontFamily = "monospace";
            code.style.backgroundColor = "#F7FAFC";
            code.style.padding = "8px";
            code.style.borderRadius = "4px";
            code.style.margin = "10px 0";
            code.style.overflowX = "auto";
        });

        return element;
    }

    let options = {
        margin: [20, 20, 20, 20],
        filename: "chat-conversation.pdf",
        image: { type: "jpeg", quality: 0.98 },
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
        pagebreak: { mode: ["avoid-all", "css", "legacy"] }
    };

    html2pdf().from(container).set(options).save()
        .then(() => console.log("PDF generated successfully!"))
        .catch(err => {
            console.error("Error generating PDF:", err);
            alert("Error generating PDF. Check console for details.");
        });
}}();
