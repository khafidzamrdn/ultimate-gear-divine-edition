import { world, system, ItemStack, EnchantmentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

// Define Armor and Tool enchantment registries
const ARMOR_ENCHANTMENTS = [
  "protection",
  "fire_protection",
  "blast_protection",
  "projectile_protection",
  "feather_falling",
  "thorns",
  "unbreaking",
  "mending"
];

const TOOL_ENCHANTMENTS = [
  "efficiency",
  "fortune",
  "silk_touch",
  "sharpness",
  "smite",
  "bane_of_arthropods",
  "unbreaking",
  "mending"
];

// Helper: Check if item is armor
function isArmor(item) {
  const id = item.typeId;
  return id.includes("helmet") || id.includes("chestplate") || id.includes("leggings") || id.includes("boots") || id.includes("turtle_shell") || id.includes("elytra");
}

// Helper: Check if item is tool/weapon
function isToolOrWeapon(item) {
  const id = item.typeId;
  return id.includes("pickaxe") || id.includes("axe") || id.includes("shovel") || id.includes("hoe") || id.includes("sword") || id.includes("bow") || id.includes("crossbow") || id.includes("shears") || id.includes("fishing_rod") || id.includes("trident");
}

// Helper: Get equipment type classification
function getEquipmentType(item) {
  if (isArmor(item)) return "§6Armor";
  if (isToolOrWeapon(item)) return "§bTool / Weapon";
  const enchantable = item.getComponent("enchantable");
  if (enchantable) return "§aEnchantable Item";
  return "§cNot Compatible (No Enchantments)";
}

// Helper: Get custom divine / celestial item name
function getDivineItemName(item) {
  const typeId = item.typeId;
  const cleanId = typeId.replace("minecraft:", "");
  const currentName = item.nameTag || "";

  if (currentName.includes("Divine ") || currentName.includes("Celestial ")) {
    return currentName;
  }

  const parts = cleanId.split("_");
  const formattedBase = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");

  if (cleanId.includes("netherite") || cleanId.includes("gold") || cleanId.includes("nether_star")) {
    return `§6Divine ${formattedBase}`;
  } else {
    return `§bCelestial ${formattedBase}`;
  }
}

// Helper: Read all installed enchantments safely
function getInstalledEnchantmentsText(item) {
  try {
    const enchantable = item.getComponent("enchantable");
    if (!enchantable) return "§8None (Not Enchantable)";

    const allPossible = [
      "protection", "fire_protection", "blast_protection", "projectile_protection",
      "feather_falling", "thorns", "respiration", "aqua_affinity", "depth_strider",
      "frost_walker", "soul_speed", "swift_sneak", "sharpness", "smite",
      "bane_of_arthropods", "knockback", "fire_aspect", "looting", "efficiency",
      "silk_touch", "unbreaking", "fortune", "power", "punch", "flame",
      "infinity", "luck_of_the_sea", "lure", "mending", "vanishing", "binding"
    ];

    const activeEnches = [];
    for (const id of allPossible) {
      try {
        const type = EnchantmentTypes.get(id);
        if (type) {
          const ench = enchantable.getEnchantment(type);
          if (ench) {
            activeEnches.push(`§5- ${id.replace("_", " ")} §6Lvl ${ench.level}`);
          }
        }
      } catch (e) {}
    }

    if (activeEnches.length === 0) {
      return "§7None installed";
    }
    return activeEnches.join("\n");
  } catch (e) {
    return "§cUnable to read enchantments";
  }
}

// 1. First-Join Detection & Divine Book Distribution
world.afterEvents.playerSpawn.subscribe((event) => {
  try {
    const player = event.player;
    const initialSpawn = event.initialSpawn;

    if (initialSpawn) {
      const hasReceived = player.getDynamicProperty("ultimate_gear_received_book");
      if (!hasReceived) {
        giveDivineBook(player);
        player.setDynamicProperty("ultimate_gear_received_book", true);
      }
    }
  } catch (error) {
    console.error("Error in playerSpawn event: " + error);
  }
});

function giveDivineBook(player) {
  try {
    const inventory = player.getComponent("inventory");
    if (!inventory) return;
    const container = inventory.container;

    let hasBook = false;
    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (item && item.typeId === "ultimate:divine_book") {
        hasBook = true;
        break;
      }
    }

    if (!hasBook) {
      const book = new ItemStack("ultimate:divine_book", 1);
      container.addItem(book);
      player.sendMessage("§6[Ultimate Gear] §fYou have received the §6Divine Book§f! Use it to open the configuration menu.");
    }
  } catch (error) {
    console.error("Error giving Divine Book: " + error);
  }
}

// 2. Divine Book Usage & Main Menu (Divine Theme: Gold, Dark Purple, White)
world.afterEvents.itemUse.subscribe((event) => {
  try {
    const player = event.source;
    const item = event.itemStack;

    if (item && item.typeId === "ultimate:divine_book") {
      openMainMenu(player);
    }
  } catch (error) {
    console.error("Error in itemUse event: " + error);
  }
});

function openMainMenu(player) {
  try {
    const form = new ActionFormData()
      .title("§6§lUltimate Gear §8- §5Divine Edition")
      .body("§fWelcome to the Divine Edition configuration system.\n§7Select an option below:")
      .button("§6Select Equipment\n§8[Inventory Selector]", "textures/items/enchanted_book")
      .button("§5Enchantment Settings\n§8[Phase 3 Engine]", "textures/items/book_portfolio")
      .button("§6General Settings\n§8[Preferences]", "textures/items/comparator")
      .button("§5About Ultimate Gear\n§8[Info & Credits]", "textures/items/paper");

    form.show(player).then((response) => {
      if (response.canceled) return;

      switch (response.selection) {
        case 0:
          openInventorySelector(player, 0);
          break;
        case 1:
          openGeneralInfo(player, "Enchantment Settings", "Phase 3 Native Enchantment Engine is active. Select equipment to configure native enchantments up to level 255.");
          break;
        case 2:
          openGeneralInfo(player, "General Settings", "Ultimate Gear Divine Edition v1.0.5\nStable Script API mode active.");
          break;
        case 3:
          openGeneralInfo(player, "About Ultimate Gear", "Ultimate Gear: Divine Edition v1.0.5\nDeveloped for Minecraft Bedrock Android.\nFeatures Visual Glint, Custom Naming & Level 255 Engine.");
          break;
      }
    }).catch((err) => {
      console.error("Error showing main menu form: " + err);
    });
  } catch (error) {
    console.error("Error opening main menu: " + error);
  }
}

function openGeneralInfo(player, title, message) {
  try {
    const form = new ActionFormData()
      .title("§6" + title)
      .body("§f" + message)
      .button("§6Back to Menu");

    form.show(player).then((response) => {
      if (!response.canceled) {
        openMainMenu(player);
      }
    });
  } catch (error) {
    console.error("Error opening info form: " + error);
  }
}

// 3. Inventory Scanner & Item Selection Menu (Phase 2 with Pagination)
function openInventorySelector(player, page = 0) {
  try {
    const inventory = player.getComponent("inventory");
    if (!inventory) {
      player.sendMessage("§c[Ultimate Gear] Inventory component not found.");
      return;
    }

    const container = inventory.container;
    const itemsList = [];

    for (let i = 0; i < container.size; i++) {
      const item = container.getItem(i);
      if (item) {
        itemsList.push({
          slot: i,
          item: item,
          name: item.nameTag || item.typeId.replace("minecraft:", ""),
          typeId: item.typeId,
          amount: item.amount
        });
      }
    }

    if (itemsList.length === 0) {
      player.sendMessage("§c[Ultimate Gear] §fYour inventory is empty!");
      openMainMenu(player);
      return;
    }

    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil(itemsList.length / ITEMS_PER_PAGE);
    if (page < 0) page = 0;
    if (page >= totalPages) page = totalPages - 1;

    const startIdx = page * ITEMS_PER_PAGE;
    const pageItems = itemsList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const form = new ActionFormData()
      .title(`§6Select Equipment §8(Page ${page + 1}/${totalPages})`)
      .body("§fSelect an item from your inventory to inspect:");

    pageItems.forEach((entry) => {
      const displayName = entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
      const typeInfo = getEquipmentType(entry.item);
      form.button(`§f${displayName}\n§8Slot: ${entry.slot} | ${typeInfo}`);
    });

    if (page > 0) {
      form.button("§e<- Previous Page");
    }
    if (page < totalPages - 1) {
      form.button("§eNext Page ->");
    }
    form.button("§cBack to Main Menu");

    form.show(player).then((response) => {
      if (response.canceled) {
        openMainMenu(player);
        return;
      }

      const selection = response.selection;
      const hasPrev = page > 0;
      const hasNext = page < totalPages - 1;
      
      if (selection < pageItems.length) {
        const selectedEntry = pageItems[selection];
        if (selectedEntry) {
          openItemInfoMenu(player, selectedEntry.slot, page);
        }
      } else {
        let btnIdx = selection - pageItems.length;
        if (hasPrev && btnIdx === 0) {
          openInventorySelector(player, page - 1);
          return;
        }
        if (hasPrev) btnIdx--;

        if (hasNext && btnIdx === 0) {
          openInventorySelector(player, page + 1);
          return;
        }
        if (hasNext) btnIdx--;

        openMainMenu(player);
      }
    }).catch((err) => {
      console.error("Error showing inventory selector: " + err);
    });
  } catch (error) {
    console.error("Error in openInventorySelector: " + error);
  }
}

// 4. Item Information Menu (Phase 2 & 3)
function openItemInfoMenu(player, slotIndex, page) {
  try {
    const inventory = player.getComponent("inventory");
    if (!inventory) return;
    const container = inventory.container;
    const item = container.getItem(slotIndex);

    if (!item) {
      player.sendMessage("§c[Ultimate Gear] §fItem no longer exists in that slot.");
      openInventorySelector(player, page);
      return;
    }

    const itemName = item.nameTag || item.typeId.replace("minecraft:", "");
    const formattedName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    const equipType = getEquipmentType(item);
    const enchesText = getInstalledEnchantmentsText(item);

    const bodyText = `§6Item Name: §f${formattedName}\n` +
                     `§6Item ID: §7${item.typeId}\n` +
                     `§6Inventory Slot: §e${slotIndex}\n` +
                     `§6Equipment Type: ${equipType}\n\n` +
                     `§5Installed Enchantments:\n${enchesText}`;

    const form = new ActionFormData()
      .title("§6§lItem Information")
      .body(bodyText)
      .button("§6Configure Enchantments\n§8[Phase 3 Engine]", "textures/items/enchanted_book")
      .button("§cBack to Inventory", "textures/items/barrier");

    form.show(player).then((response) => {
      if (response.canceled || response.selection === 1) {
        openInventorySelector(player, page);
        return;
      }

      if (response.selection === 0) {
        const enchantable = item.getComponent("enchantable");
        if (!enchantable) {
          player.sendMessage("§c[Ultimate Gear] §fThis item does not support enchantments.");
          openItemInfoMenu(player, slotIndex, page);
          return;
        }
        
        openItemConfigMenu(player, slotIndex, page);
      }
    }).catch((err) => {
      console.error("Error showing item info menu: " + err);
    });

  } catch (error) {
    console.error("Error in openItemInfoMenu: " + error);
  }
}

// 5. Phase 3: Native Enchantment Configuration & Apply Engine (Up to Level 255)
function openItemConfigMenu(player, slotIndex, page) {
  try {
    const inventory = player.getComponent("inventory");
    if (!inventory) return;
    const container = inventory.container;
    const item = container.getItem(slotIndex);

    if (!item) {
      player.sendMessage("§c[Ultimate Gear] §fItem no longer exists.");
      openInventorySelector(player, page);
      return;
    }

    const enchantable = item.getComponent("enchantable");
    if (!enchantable) {
      player.sendMessage("§c[Ultimate Gear] §fItem cannot be enchanted.");
      openItemInfoMenu(player, slotIndex, page);
      return;
    }

    // Determine applicable enchantment registry based on item type
    let allowedEnchantments = [];
    if (isArmor(item)) {
      allowedEnchantments = ARMOR_ENCHANTMENTS;
    } else if (isToolOrWeapon(item)) {
      allowedEnchantments = TOOL_ENCHANTMENTS;
    } else {
      allowedEnchantments = ["unbreaking", "mending"];
    }

    const modal = new ModalFormData()
      .title("§6Configure: " + item.typeId.replace("minecraft:", ""));

    const activeEnchIds = [];
    allowedEnchantments.forEach((enchId) => {
      try {
        const enchType = EnchantmentTypes.get(enchId);
        if (enchType) {
          const existingEnch = enchantable.getEnchantment(enchType);
          const currentLevel = existingEnch ? existingEnch.level : 0;
          activeEnchIds.push(enchId);
          modal.slider(`§f${enchId.toUpperCase().replace("_", " ")} (0-255)`, 0, 255, 1, currentLevel);
        }
      } catch (e) {}
    });

    modal.show(player).then((response) => {
      if (response.canceled) {
        openItemInfoMenu(player, slotIndex, page);
        return;
      }

      const values = response.formValues;
      
      // Item safety re-verification
      const freshItem = container.getItem(slotIndex);
      if (!freshItem || freshItem.typeId !== item.typeId) {
        player.sendMessage("§c[Ultimate Gear] §fOperation cancelled: Item in slot changed or removed.");
        return;
      }

      const freshEnchantable = freshItem.getComponent("enchantable");
      if (!freshEnchantable) {
        player.sendMessage("§c[Ultimate Gear] §fEnchantment component lost on item.");
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      activeEnchIds.forEach((enchId, idx) => {
        try {
          const enchType = EnchantmentTypes.get(enchId);
          if (!enchType) return;

          const targetLevel = values[idx];
          if (targetLevel === undefined) return;

          if (targetLevel > 0) {
            const newEnch = { type: enchType, level: targetLevel };
            try {
              if (freshEnchantable.canAddEnchantment(newEnch)) {
                freshEnchantable.addEnchantment(newEnch);
                successCount++;
              } else {
                // Attempt direct application with native level 255 handling
                freshEnchantable.addEnchantment(newEnch);
                successCount++;
              }
            } catch (errLevel) {
              errorCount++;
              console.error(`Level out of bounds or error for ${enchId}: ${errLevel}`);
            }
          } else {
            // Remove enchantment if level is set to 0
            try {
              freshEnchantable.removeEnchantment(enchType);
            } catch (e) {}
          }
        } catch (e) {
          errorCount++;
        }
      });

      // Apply custom divine/celestial naming and save back updated item securely to original slot
      freshItem.nameTag = getDivineItemName(freshItem);
      container.setItem(slotIndex, freshItem);
      
      if (errorCount === 0) {
        player.sendMessage("§6[Ultimate Gear] §aEnchantments successfully applied (Level up to 255 engine)!");
      } else {
        player.sendMessage("§6[Ultimate Gear] §eApplied with some limitations or incompatible checks.");
      }

      openItemInfoMenu(player, slotIndex, page);

    }).catch((err) => {
      console.error("Error in config modal: " + err);
    });

  } catch (error) {
    console.error("Error in openItemConfigMenu: " + error);
  }
}
