# Claude Chat Exporter

A browser bookmarklet that allows you to easily export your Claude.ai conversations as PDF or PNG files.

## Features

- **Multiple Export Formats**: Save your conversations as either PDF or PNG
- **High-Quality Output**: Creates high-resolution exports with proper formatting
- **Multi-Page PDFs**: Automatically creates multiple PDF pages for longer conversations
- **Chat Metadata**: Includes chat title and timestamp in the exported document
- **Progress Indicators**: Shows progress during the export process
- **Proper Formatting**: Preserves formatting for lists, code blocks, and other content

## Installation

1. Create a new bookmark in your browser
2. Name it "Export Claude Chat" (or any name you prefer)
3. Copy the entire JavaScript code from the [bookmarklet.js](bookmarklet.js) file
4. Paste it as the bookmark URL (it should start with `javascript:`)

## Usage

1. Navigate to a Claude.ai chat conversation you want to export
2. Click on the "Export Claude Chat" bookmark
3. Choose your preferred export format (PDF or PNG) from the dialog
4. Wait for the export process to complete
5. The file will be automatically downloaded with a name based on the chat title

## Technical Details

The bookmarklet uses the following technologies:
- **html2canvas**: For rendering the chat content as an image
- **jsPDF**: For creating PDF documents
- **Pure JavaScript**: No external dependencies other than the CDN-loaded libraries

## Compatibility

This bookmarklet is designed to work with Claude.ai chat interface. It may need updates if the Claude interface changes significantly.

## Troubleshooting

If the export fails:
- Make sure you're on a Claude.ai chat page
- Check that you've correctly copied the entire bookmarklet code
- Try refreshing the page and attempting the export again
- For very long conversations, try exporting as PDF which handles large content better

## Privacy & Security

This bookmarklet:
- Runs entirely in your browser
- Does not send your data to any external servers
- Only loads two external libraries from trusted CDNs (html2canvas and jsPDF)
- Generates the export files locally on your device

## License

MIT License

## Acknowledgments

- [html2canvas](https://html2canvas.hertzen.com/) for HTML rendering
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
