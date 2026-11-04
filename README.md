# Ultimate Gear: Divine Edition

![Ultimate Gear Banner](https://img.shields.io/badge/Minecraft-Bedrock%2026.4-blue?style=for-the-badge&logo=minecraft)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![GitHub Release](https://img.shields.io/github/v/release/khafidzamrdn/ultimate-gear-divine-edition?style=for-the-badge)

**Ultimate Gear: Divine Edition v1.0.6** is a powerful Minecraft Bedrock Edition addon designed for Android and other supported platforms. It introduces advanced item management, manual inventory inspection (Phase 2), Native Enchantment Engine supporting custom enchantment levels up to 255 (Phase 3), Divine Visual Identity with custom textures (Phase 4), Visual Glint & Custom Item Naming (v1.0.5), plus texture and glint bug fixes (v1.0.6).

---

## ✨ Features

- 📖 **Divine Book**: Automatically received upon first join. Reusable item that opens the main configuration interface.
- 🎛️ **Main Menu (`ActionFormData`)**: Clean UI providing access to Equipment Selection, Enchantment Settings, General Settings, and About.
- 🎒 **Manual Item Selector**: Scans all inventory slots, showing item names, types, and slot indices with interactive selection.
- ⚡ **Native Enchantment Engine**: Supports armor and tools with compatibility detection, reading existing enchantments, toggle states, and custom levels up to **255**.
- ✨ **Visual Enchantment & Custom Naming**: Applies Minecraft enchanted glint and custom naming (`Divine` / `Celestial`) to processed items automatically.
- 🛡️ **Safe Apply Engine**: Utilizes `ItemEnchantableComponent` with robust error handling and notifications.
- 🤖 **Automated CI/CD**: GitHub Actions workflow to build and package `.mcaddon` files automatically on release tags.

---

## 📱 Requirements

- **Minecraft Bedrock Edition**: v1.20.50+ / Stable Android release supporting Script API.
- **Experimental / Script API**: Behavior Pack with `@minecraft/server` (`1.16.0`) and `@minecraft/server-ui` (`1.3.0`).

---

## 📥 Installation Guide (Android)

1. Download the latest `Ultimate-Gear-Divine-vX.X.X.mcaddon` from the [GitHub Releases](https://github.com/khafidzamrdn/ultimate-gear-divine-edition/releases) page.
2. Tap on the downloaded `.mcaddon` file and open it with **Minecraft**.
3. Minecraft will automatically import both the Behavior Pack and Resource Pack.
4. Create or edit a world, and in world settings, enable **Behavior Packs** and **Resource Packs** for *Ultimate Gear: Divine Edition*.
5. Enable **Beta APIs** / **Script API** experimental toggle if required by your Minecraft version.

---

## 📖 How to Use the Divine Book

- Upon joining your world for the first time, you will receive the **Divine Book** in your inventory.
- Right-click / use the item in hand to open the **Main Menu**.
- Select **Select Equipment** to inspect your inventory and customize enchantments on any armor piece or tool.

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes and version updates.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 👥 Credits & Authors

Developed by **khafidzamrdn** for the Minecraft Bedrock community.
