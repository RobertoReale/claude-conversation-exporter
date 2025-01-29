# Claude Conversation PDF Exporter

## Overview

This is a JavaScript bookmarklet that allows you to export Claude conversations to a PDF directly from your browser. It uses the `html2pdf.js` library to convert the conversation messages into a cleanly formatted PDF document.

## Features

- Extracts all Claude messages from the current conversation
- Preserves formatting of lists and paragraphs
- Adds page breaks to prevent content splitting
- Generates a clean, readable PDF

## Installation

### Quick Start

1. Create a new bookmark in your browser
2. Edit the bookmark
3. Replace the URL with the contents of the `bookmarklet.js` file

### Detailed Steps

1. Open your browser's bookmarks manager
2. Click "Add New Bookmark"
3. Give it a name like "Export Claude PDF"
4. In the URL/Location field, paste the entire contents of the `bookmarklet.js` file
5. Save the bookmark

## Usage

1. Navigate to a Claude conversation
2. Click the bookmarklet you created
3. The PDF will automatically generate and download

## Dependencies

- Requires `html2pdf.js` (automatically loaded by the script)
- Works best in modern browsers (Chrome, Firefox, Safari, Edge)

## Troubleshooting

- If no PDF generates, ensure you're on a page with Claude messages
- Check the browser console for any error messages
- Refresh the page and try again

## License

[Choose an appropriate open-source license, e.g., MIT License]

## Contributing

Contributions are welcome! Please submit pull requests or open issues on the GitHub repository.
