const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

console.log("=== Ultimate Gear: Divine Edition - Automated Build Script ===");

// 1. Validate JSON Files
const jsonFiles = [
  'behavior_pack/manifest.json',
  'behavior_pack/items/divine_book.json',
  'resource_pack/manifest.json',
  'resource_pack/textures/item_texture.json'
];

console.log("\n[1/5] Validating JSON files...");
jsonFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    JSON.parse(content);
    console.log(`  [OK] ${file}`);
  } catch (err) {
    console.error(`  [ERROR] Invalid JSON in ${file}: ${err.message}`);
    process.exit(1);
  }
});

// 2. Validate JavaScript Syntax
console.log("\n[2/5] Validating JavaScript syntax...");
try {
  execSync('node --check behavior_pack/scripts/index.js', { stdio: 'inherit' });
  console.log("  [OK] behavior_pack/scripts/index.js syntax is valid.");
} catch (err) {
  console.error("  [ERROR] JavaScript syntax validation failed.");
  process.exit(1);
}

// 3. Verify Texture and Asset Files
console.log("\n[3/5] Verifying textures and assets...");
const assetFiles = [
  'resource_pack/textures/items/divine_book.png',
  'resource_pack/texts/en_US.lang'
];
assetFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  [OK] Asset exists: ${file}`);
  } else {
    console.error(`  [ERROR] Missing asset: ${file}`);
    process.exit(1);
  }
});

// 4. Build .mcpack and .mcaddon Packages
console.log("\n[4/5] Building packages (.mcpack & .mcaddon)...");
const releaseDir = path.join(__dirname, 'release');
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

const addonFilename = 'Ultimate-Gear-Divine-v1.0.7.mcaddon';
const addonPath = path.join(releaseDir, addonFilename);

// Create .mcaddon containing both behavior_pack and resource_pack directories
try {
  // Remove existing if any
  if (fs.existsSync(addonPath)) {
    fs.unlinkSync(addonPath);
  }

  // Use zip to package behavior_pack and resource_pack into .mcaddon
  execSync(`zip -r "${addonPath}" behavior_pack resource_pack`, { stdio: 'inherit' });
  console.log(`  [OK] Created package: release/${addonFilename}`);
} catch (err) {
  console.error(`  [ERROR] Failed to create package: ${err.message}`);
  process.exit(1);
}

// 5. Generate SHA256 Checksum and Release Notes
console.log("\n[5/5] Generating SHA256 checksum and release notes...");
const addonBuffer = fs.readFileSync(addonPath);
const hashSum = crypto.createHash('sha256');
hashSum.update(addonBuffer);
const sha256 = hashSum.digest('hex');
const fileSizeMB = (addonBuffer.length / (1024 * 1024)).toFixed(2);

const sha256Content = `${sha256}  ${addonFilename}\n`;
fs.writeFileSync(path.join(releaseDir, 'SHA256SUMS.txt'), sha256Content);
console.log(`  [OK] SHA256: ${sha256}`);

const releaseNotesContent = `# Ultimate Gear: Divine Edition v1.0.7 Release Notes

## Overview
- **Addon Name**: Ultimate Gear: Divine Edition
- **Version**: v1.0.7
- **Target Platform**: Minecraft Bedrock Edition (Android / Windows)
- **File Name**: \`${addonFilename}\`
- **File Size**: \`${fileSizeMB} MB\`
- **SHA256 Checksum**: \`${sha256}\`

## Features & Highlights
1. **Divine Book**: Automatically received on first join; reusable UI trigger.
2. **Inventory Selector**: Scans all inventory slots, ignores empty slots, features pagination and item info view.
3. **Native Enchantment Engine**: Supports Armor and Tools with custom enchantment levels up to 255 using stable Script API.
4. **Visual Enchantment & Custom Naming**: Minecraft enchanted glint and custom naming (\`Divine\` / \`Celestial\`) for processed equipment.
5. **Pack Identity Icon**: Vanilla enchanted book representation for behavior and resource pack icons.

## Bug Fixes
1. **Divine Book Texture**: Regenerated a valid 16x16 enchanted book PNG (the previous file was truncated/corrupt).
2. **Visual Glint**: Processed equipment now reliably renders the Minecraft enchantment glint (existing enchantments preserved; cosmetic fallback added only when none are present).
3. **Processed State**: Item stack marker keeps the processed status across inventory moves, storage, and logout/login.
4. **Version Labels**: Pack names and descriptions now include the version so the correct pack is easy to identify in-game.

## Installation Instructions (Android)
1. Download \`${addonFilename}\`.
2. Tap the file to import into Minecraft Bedrock.
3. Enable Behavior Pack and Resource Pack in world settings.
`;

fs.writeFileSync(path.join(releaseDir, 'RELEASE_NOTES.md'), releaseNotesContent);
console.log("  [OK] Generated release/RELEASE_NOTES.md");

console.log("\n=== Build Completed Successfully! ===");
console.log(`Output Location: ${releaseDir}`);
