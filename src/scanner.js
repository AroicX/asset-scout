import fg from "fast-glob";
import path from "path";
import fs from "fs";

const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "svg", "gif", "webp"];
const CODE_EXTENSIONS = ["js", "jsx", "ts", "tsx", "svelte", "html", "css", "vue"];

export async function scanAssets(baseDir = process.cwd()) {
  console.log("🔍 Scanning for assets...");

  // 1️⃣ Find all images
  const images = await fg(`**/*.{${IMAGE_EXTENSIONS.join(",")}}`, {
    cwd: baseDir,
    absolute: true,
    ignore: ["node_modules/**", "dist/**"],
  });

  // 2️⃣ Find all code files
  const codeFiles = await fg(`**/*.{${CODE_EXTENSIONS.join(",")}}`, {
    cwd: baseDir,
    absolute: true,
    ignore: ["node_modules/**", "dist/**"],
  });

  // 3️⃣ Initialize tracking object
  const imageUsage = {};
  let totalSize = 0;

  for (const image of images) {
    const imageName = path.basename(image);
    const relativeImagePath = path.relative(baseDir, image);
    const absoluteImagePath = path.resolve(baseDir, image);
    const fileSize = fs.statSync(image).size; // Get file size in bytes
    totalSize += fileSize;

    imageUsage[imageName] = {
      count: 0,
      locations: [],
      path: `/${relativeImagePath}`,
      absolutePath: absoluteImagePath,
      size: fileSize, // ✅ Store file size
    };

    for (const file of codeFiles) {
      const fileContent = fs.readFileSync(file, "utf-8");
      const fileLines = fileContent.split("\n"); // Split file into lines

      const regex = new RegExp(`\\b${imageName}\\b`, "g");
      let occurrences = 0;
      let lineNumbers = [];

      fileLines.forEach((line, index) => {
        if (line.includes(imageName)) {
          occurrences += (line.match(regex) || []).length;
          lineNumbers.push(index + 1); // Store line number (1-based index)
        }
      });

      if (occurrences > 0) {
        imageUsage[imageName].count += occurrences;
        imageUsage[imageName].locations.push({
          file: path.relative(baseDir, file),
          absolutePath: path.resolve(baseDir, file),
          occurrences,
          lineNumbers, // ✅ Include line numbers
        });
      }
    }
  }

  return { images, codeFiles, imageUsage, totalSize };
}
