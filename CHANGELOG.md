# Changelog

All notable changes to **Ultimate Gear: Divine Edition** will be documented in this file.

## [1.0.3] - 2026-03-06
### Added
- **Divine Visual Identity (Phase 4)**: Celestial Fantasy color theme (Gold `§6`, Dark Purple `§5`, White `§f`) consistently applied across all menus and UI headers.
- **Custom Divine Book Texture**: Added dedicated PNG texture asset (`divine_book.png`) and `item_texture.json` mapping to eliminate all missing texture issues.

## [1.0.2] - 2026-03-06
### Added
- **Native Enchantment Engine (Phase 3)**: Fully integrated `ItemEnchantableComponent` with `addEnchantment`, `removeEnchantment`, `getEnchantment`, and `canAddEnchantment`.
- **Enchantment Configuration UI**: Dedicated configuration menu displaying ON/OFF status, current levels, and adjustable levels up to 255.
- **Item Safety & Validation**: Slot re-verification, preservation of unselected enchantments, error handling for incompatible items, and safe save back to inventory slot.

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
