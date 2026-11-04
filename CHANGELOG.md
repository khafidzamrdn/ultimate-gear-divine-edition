# Changelog

All notable changes to **Ultimate Gear: Divine Edition** will be documented in this file.

## [1.0.6] - 2026-11-04
### Fixed
- **Divine Book Texture**: Regenerated `resource_pack/textures/items/divine_book.png` as a valid 16x16 enchanted book PNG (previous file was truncated and corrupted).
- **Visual Glint**: Processed equipment now reliably displays the Minecraft enchanted glint. Existing enchantments are preserved and a cosmetic level-1 Unbreaking is added only when the item has none.
- **Processed State Persistence**: Items are marked with an item-stack dynamic property so processed status survives inventory moves, storage, and logout/login.

## [1.0.5] - 2026-03-06
### Added
- **Visual Enchantment (Glint)**: Minecraft enchanted glint effect applied to items successfully processed through the Divine Book without altering base stats or capabilities.
- **Custom Item Naming**: Consistent naming convention assigning `Divine` (Netherite/Gold) and `Celestial` (Diamond/others) prefixes to processed equipment (e.g., `Divine Netherite Sword`, `Celestial Diamond Sword`), preventing duplicate names and preserving material identity.
- **Pack Identity Icon**: Vanilla enchanted book representation (`textures/items/book_enchanted`) generated as `pack_icon.png` for both Behavior Pack and Resource Pack.

## [1.0.4] - 2026-03-06
### Added
- **Quality Assurance Audit (Phase 5)**: Comprehensive audit report (`QA_REPORT.md`) covering source code validation, functional testing, texture verification, error handling, performance optimization, and packaging checks.

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
