#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";
import path from "path";
import { startServer } from "../src/index.js";
import { scanAssets } from "../src/scanner.js";

const program = new Command();

program
  .name("asset-scout")
  .version("1.0.0", "-v, --version", "Display the current version")
  .description("A CLI tool to scan and serve assets from a specified directory.")
  .helpOption("-h, --help", "Show help information");

program
  .option("--scan", "Scan and display asset usage")
  .option("--ui", "Start the asset tracker UI")
  .option("--details", "Start the asset tracker UI")
  .option("-p, --path <path>", "Specify the directory to scan")

program.parse(process.argv);
const options = program.opts();

if (options.scan) {
  (async () => {
    console.log(chalk.blue("\n🚀 Starting asset scan...\n"));
    const { images, codeFiles, imageUsage } = await scanAssets();
    console.log(chalk.green(`📸 Found ${images.length} images:`));
    console.log(chalk.green(`📝 Found ${codeFiles.length} code files:`));
    console.log(chalk.magenta("\n🔍 Image Usage Report:\n"));
    for (const [image, data] of Object.entries(imageUsage)) {
      if (data.count) {
        console.log(chalk.yellow(`📂 ${image}: used ${data.count} times`));
      }

      data.locations.forEach((loc) => {
        console.log(chalk.cyan(` - ${path.relative(process.cwd(), loc.absolutePath)} (${loc.occurrences} times)`));
      });
    }

    console.log(chalk.blue("\n✅ Scan complete!\n"));
    process.exit(0);
  })();
}
if (options.details) {
  (async () => {
    const result = await scanAssets();
    console.log(JSON.stringify(result.imageUsage, null, 2));
    process.exit(0);
  })();
}

if (options.path) {
  const folderPath = path.resolve(options.path);
  if (!folderPath) {
    console.error("❌ Error: You must provide a folder path using --path");
    process.exit(0);
  }
  startServer(folderPath);
}

if (options.ui) {
  startServer();
}
