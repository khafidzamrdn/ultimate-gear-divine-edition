# Changelog

All notable changes to **Ultimate Gear: Divine Edition** will be documented in this file.

## [1.0.1] - 2026-03-06
### Added
- **Inventory Scanner (Phase 2)**: Scans all inventory slots, ignores empty slots, identifies items, and supports pagination/navigation.
- **Item Information View**: Displays item name, ID, slot index, equipment type, and installed enchantments.
- **Compatibility Detection**: Distinguishes Armor, Tools/Weapons, and Incompatible items.
### Fixed
- Fixed missing texture (purple-black block) bug on Divine Book by mapping to vanilla `enchanted_book` texture.

## [1.0.0] - 2026-03-06
### Added
- **Divine Book**: Custom item given once on first join, reusable to open the configuration menu.
- **Main Menu**: ActionFormData interface providing access to Equipment Selection, Enchantment Settings, General Settings, and About.
- **Manual Item Selector**: Inventory reader that scans all inventory slots, displaying item names, types, and slot numbers with interactive selection.
- **Enchantment Configuration Engine**: Native enchantment registry supporting armor and tools with compatibility checks, actual enchantment reading, ON/OFF toggles, and level adjustments up to level 255.
- **Apply Engine**: Safe application of enchantments using `ItemEnchantableComponent` with robust error handling and notifications.
- **GitHub Actions Build Pipeline**: Automated `.mcpack` and `.mcaddon` packaging for GitHub Releases.
