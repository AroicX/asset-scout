import express from "express";
import { scanAssets } from "./scanner.js";
import fg from "fast-glob";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import getPort from "get-port";

// Function to scan files
export async function getFileTree(baseDir = path.resolve(__dirname)) {
    return await fg("**/*", {
        cwd: baseDir,
        onlyFiles: true,
        ignore: ["node_modules/**", "dist/**"]
    });
}
// Get `__dirname` equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function startServer(basePath = process.cwd()) {
    const app = express();
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((_, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
    });
    // Serve assets directory (supports both absolute and relative paths)
    const assetsPath = path.resolve(basePath, "assets");

    // 🔥 Serve assets from the correct directory
    app.use("/assets", express.static(assetsPath));
    // Serve static files from the public folder
    const publicDir = path.join(__dirname, "./public"); // Adjust if needed
    console.log(`📂 Serving files from: ${basePath}`);
    app.use(express.static(publicDir));

    // API route to get files
    app.get("/api/files", async (_, res) => {
        const files = await getFileTree();
        res.json(files);
    });

    // API route to get asset usage data
    app.get("/api/assets", async (req, res) => {
        const { imageUsage } = await scanAssets(basePath);
        res.json(imageUsage);
    });

    // Serve UI (ensure absolute path)
    app.get("/", (req, res) => {
        const htmlPath = path.join(__dirname, "../public", "index.html");
        if (fs.existsSync(htmlPath)) {
            res.sendFile(htmlPath);
        } else {
            res.status(404).send("UI not found");
        }
    });

    // Serve image files
    app.get("/image", (req, res) => {
        const imagePath = req.query.path;

        if (!imagePath || !fs.existsSync(imagePath)) {
            return res.status(404).send("Image not found");
        }

        res.sendFile(imagePath);
    });

    // DELETE API to remove a file
    app.delete("/api/delete", async (req, res) => {
        try {
            const { filename, absolutePath } = req.body;

            if (!filename || !absolutePath) {
                return res.status(400).json({ error: "Filename and absolutePath are required." });
            }
            // Delete the file using async/await
            await fsPromise.unlink(absolutePath);

            res.json({ success: true, message: `"${filename}" deleted successfully` });
        } catch (error) {
            console.error("Error deleting file:", error);
            res.status(500).json({ error: "Failed to delete the file." });
        }
    });
    // Start server with dynamic port selection
    (async () => {
        const PORT = await getPort({ port: 3000 }); // Try 3000, pick another if unavailable
        app.listen(PORT, () => {
            console.log(`🚀 Asset Tracker running at http://localhost:${PORT}`);
        });
    })();
}