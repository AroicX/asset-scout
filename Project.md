# Asset Tracker

## Overview
The **Asset Tracker** is a command-line and web-based tool designed to scan and track asset usage within a project. It provides a user-friendly UI to visualize the assets and their usage frequency, helping developers identify unused or misplaced files.

## Features
- **CLI-based asset scanning** to analyze project assets.
- **Web UI for asset visualization** with an intuitive interface.
- **Filtering by file type and usage status** (PNG, JPG, SVG, etc.).
- **Dark mode support** for better accessibility.
- **Directly open asset locations in VS Code** for quick access.
- **Delete unused assets** to clean up your project.

## File Structure
The project follows a modular structure:

```
📂 asset-scout
│── 📂 bin
│   │── 📜 cli.js           # CLI entry point
│── 📂 src
│   │── 📜 scanner.js       # Scans and retrieves asset details
│   │── 📜 index.js         # Express server to serve the UI & API endpoints
│── 📂 public
│   │── 📜 index.html       # Main frontend UI file
│── 📜 package.json         # Project metadata & dependencies
│── 📜 README.md            # Documentation
```

## Installation
To install the package globally:
```sh
npm install -g asset-scout
```

To install it in a specific project:
```sh
npm install asset-scout
```

## Usage

### CLI Commands
#### 1. Scan Assets
To scan and display asset usage:
```sh
asset-scout --scan
```
This will return a JSON output of the detected assets and their usage.

#### 2. Launch Web UI
To start the web UI:
```sh
asset-scout --ui
```
The UI will be accessible at `http://localhost:3000`.

#### 3. Show Detailed Asset Scan Results
To display detailed information about asset usage:
```sh
asset-scout --details
```

#### 4. Specify a Directory for Scanning
To scan a specific directory:
```sh
asset-scout -p /path/to/project
```

## Web UI Overview
When the UI is launched, you can:
- **View all detected assets** in an organized table.
- **Filter assets by type** (PNG, JPG, SVG, etc.).
- **See how often an asset is used** and where it appears.
- **Open asset locations directly in VS Code** with one click.
- **Delete unused assets** to optimize your project.

### Open File in VS Code
Each asset includes a clickable link to open the file directly in VS Code:
```html
<a href="vscode://file/{file-path}" target="_blank">Open in VS Code</a>
```

## API Endpoints
The following API endpoints are available:

### 1. Get All Assets
```http
GET /api/assets
```
Response:
```json
{
  "icon.png": { "count": 3, "absolutePath": "/Users/PC/project/static/icon.png", "locations": [...] }
}
```

### 2. Delete an Asset
```http
DELETE /api/delete
```
Request Body:
```json
{ "filename": "icon.png", "absolutePath": "/Users/PC/project/static/icon.png" }
```

## Troubleshooting
### 1. UI Not Loading on `localhost:3000`
- Ensure you have run `asset-scout --ui`.
- Check if another service is using port 3000.
- Try running on a different port if needed.

### 2. Images Not Showing in UI
- Ensure asset paths are correctly resolved.
- Use relative paths when applicable.
- Verify that the scanning process has completed successfully.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.

## License
This project is licensed under the **MIT License**.

