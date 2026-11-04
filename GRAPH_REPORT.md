# Code Knowledge Graph Report (GRAPH_REPORT.md)

**Project**: Ultimate Gear: Divine Edition  
**Version**: v1.0.5  
**Environment**: Termux / OpenCode  
**Output Directory**: `graphify-out/`  

---

## 1. Executive Summary
This report details the architectural code knowledge graph generated for **Ultimate Gear: Divine Edition**. The graph maps the relationships between Behavior Pack components, Resource Pack assets, Script API modules, UI subsystems, and CI/CD automation workflows.

---

## 2. Graph Nodes & Modules
The codebase is structured into the following primary module nodes:

1. **Behavior Pack Manifest (`BP_Manifest`)**:
   - Path: `behavior_pack/manifest.json`
   - Role: Defines script entry point and dependencies (`@minecraft/server`, `@minecraft/server-ui`).
2. **Resource Pack Manifest (`RP_Manifest`)**:
   - Path: `resource_pack/manifest.json`
   - Role: Defines texture and localization resource containers.
3. **Divine Book Custom Item (`Divine_Book_Item`)**:
   - Path: `behavior_pack/items/divine_book.json`
   - Role: Defines custom item identifier `ultimate:divine_book` and UI display components.
4. **Script Engine Core (`Script_Index`)**:
   - Path: `behavior_pack/scripts/index.js`
   - Role: Implements first-join detection, event subscriptions (`playerSpawn`, `itemUse`), Inventory Scanner, Main Menu (`ActionFormData`), Item Info view, and Native Enchantment Engine (`ItemEnchantableComponent` up to level 255).
5. **Texture Mapping & Assets (`Texture_Mapping`, `Texture_PNG`)**:
   - Paths: `resource_pack/textures/item_texture.json`, `resource_pack/textures/items/divine_book.png`
   - Role: Maps item icon references and provides custom PNG artwork.
6. **Localization (`Localization`)**:
   - Path: `resource_pack/texts/en_US.lang`
   - Role: Provides translation string for `ultimate:divine_book`.
7. **CI/CD Automation (`Workflow`)**:
   - Path: `.github/workflows/build.yml`
   - Role: Automatically packages `.mcpack` and `.mcaddon` artifacts on GitHub release tags.

---

## 3. Inter-Module Relationships (Edges)
- `BP_Manifest` $\rightarrow$ `Script_Index`: Loads JavaScript execution entry.
- `BP_Manifest` $\rightarrow$ `Divine_Book_Item`: Registers custom item definitions.
- `Script_Index` $\rightarrow$ `Divine_Book_Item`: Intercepts `itemUse` events for `ultimate:divine_book`.
- `RP_Manifest` $\rightarrow$ `Texture_Mapping`: Includes item texture atlas configuration.
- `Texture_Mapping` $\rightarrow$ `Texture_PNG`: Links `divine_book_icon` to raw PNG graphics.
- `Divine_Book_Item` $\rightarrow$ `Texture_Mapping`: References texture key for rendering.
- `Workflow` $\rightarrow$ `BP_Manifest` & `RP_Manifest`: Packages both packs into `.mcaddon`.

---

## 4. Change Analysis & Impact Guidance
When making code modifications:
- **Modifying Script Logic (`index.js`)**: Isolated to runtime behavior; does not affect resource textures or manifest UUIDs unless new modules or dependencies are introduced.
- **Modifying Item Definitions (`divine_book.json`)**: Must maintain alignment with `item_texture.json` texture keys to prevent missing texture errors.
- **Modifying Manifests**: Ensure module UUIDs remain unique and dependencies are compatible with target Minecraft Bedrock versions.
