# Claude Conversation PDF Exporter

## Overview

A JavaScript bookmarklet that exports Claude conversations to a PDF directly from your browser.

## Installation

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Setup

1. Copy the minified bookmarklet code from `bookmarklet.min.js`
2. Create a new bookmark in your browser
3. Edit the bookmark and paste the minified code into the URL/Location field

### Development Setup

#### Requirements
- Node.js
- npm

#### Installation Steps
```bash
git clone https://github.com/yourusername/claude-pdf-exporter.git
cd claude-pdf-exporter
npm install
```

## Usage

1. Navigate to a Claude conversation
2. Click the bookmarklet you created
3. The PDF will automatically generate and download

## Development

### Minifying the Bookmarklet

To minify the bookmarklet:

```bash
npm run minify
```

This will create a minified version in `bookmarklet.min.js`

## Troubleshooting

- Ensure you're using the minified version
- Check browser console for any error messages
- Refresh the page and try again

## Dependencies

- Requires `html2pdf.js` (automatically loaded by the script)

## License

MIT License

## Contributing

Contributions are welcome! Please submit pull requests or open issues.
