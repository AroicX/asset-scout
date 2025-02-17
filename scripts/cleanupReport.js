
// WIP:
const { execSync } = require("child_process");

try {
  // Get deleted files
  const deletedFiles = execSync("git ls-files --deleted").toString().trim().split("\n");

  // Get staged files
  const stagedFiles = execSync("git diff --name-only --cached").toString().trim().split("\n");

  console.log("\n📌 Pre-Commit Cleanup Report:");

  if (deletedFiles.length > 0 && deletedFiles[0] !== "") {
    console.log("🗑️  Deleted Files:");
    deletedFiles.forEach((file) => console.log(`  ❌ ${file}`));
  }

  if (stagedFiles.length > 0 && stagedFiles[0] !== "") {
    console.log("📄 Staged Files:");
    stagedFiles.forEach((file) => console.log(`  ✅ ${file}`));
  }

  console.log("\n✅ All good! Proceeding with commit...\n");
} catch (error) {
  console.error("❌ Error generating cleanup report:", error.message);
}
