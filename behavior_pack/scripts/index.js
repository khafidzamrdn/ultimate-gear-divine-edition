import { world, system, ItemStack, EnchantmentTypes } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";

// Define Armor and Tool enchantment lists
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
  return id.includes("helmet") || id.includes("chestplate") || id.includes("leggings") || id.includes("boots") || id.includes("turtle_shell");
}

// Helper: Check if item is tool/weapon
function isToolOrWeapon(item) {
  const id = item.typeId;
  return id.includes("pickaxe") || id.includes("axe") || id.includes("shovel") || id.includes("hoe") || id.includes("sword") || id.includes("bow") || id.includes("crossbow") || id.includes("shears") || id.includes("fishing_rod") || id.includes("trident");
}

// 1. First-Join Detection & Divine Book Distribution
world.afterEvents.playerSpawn.subscribe((event) => {
  try {
    const player = event.player;
    const initialSpawn = event.initialSpawn;

    // Check if it's initial spawn and player hasn't received the book
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

    // Check if player already has divine book in inventory
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
      player.sendMessage("§6[Ultimate Gear] §aYou have received the Divine Book! Use it to open the configuration menu.");
    }
  } catch (error) {
    console.error("Error giving Divine Book: " + error);
  }
}

// 2. Divine Book Usage & Main Menu
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
      .title("§6Ultimate Gear - Divine Edition")
      .body("§7Welcome to the Divine Edition configuration system.\nSelect an option below:")
      .button("§bSelect Equipment\n§8[Manual Item Selector]", "textures/items/book_enchanted")
      .button("§eEnchantment Settings\n§8[Quick Info]", "textures/items/enchanted_book_normal")
      .button("§aGeneral Settings\n§8[Preferences]", "textures/items/comparator")
      .button("§cAbout Ultimate Gear\n§8[Info & Credits]", "textures/items/paper");

    form.show(player).then((response) => {
      if (response.canceled) return;

      switch (response.selection) {
        case 0:
          openInventorySelector(player);
          break;
        case 1:
          openGeneralInfo(player, "Enchantment Settings", "Use 'Select Equipment' to inspect and configure items in your inventory with native enchantments up to level 255.");
          break;
        case 2:
          openGeneralInfo(player, "General Settings", "Ultimate Gear Divine Edition v1.0.0\nStable Script API mode active.");
          break;
        case 3:
          openGeneralInfo(player, "About Ultimate Gear", "Ultimate Gear: Divine Edition\nDeveloped for Minecraft Bedrock Android.\nFeatures advanced manual item selection, level 255 native enchantments, and safe API validation.");
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
      .button("Back to Menu");

    form.show(player).then((response) => {
      if (!response.canceled) {
        openMainMenu(player);
      }
    });
  } catch (error) {
    console.error("Error opening info form: " + error);
  }
}

// 3. Manual Item Selector (Inventory Reader)
function openInventorySelector(player) {
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
      player.sendMessage("§c[Ultimate Gear] Your inventory is empty!");
      return;
    }

    const form = new ActionFormData()
      .title("§bSelect Equipment")
      .body("§7Select an item from your inventory to configure:");

    itemsList.forEach((entry) => {
      const displayName = entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
      form.button(`§f${displayName}\n§8Slot: ${entry.slot} | Qty: ${entry.amount}`);
    });

    form.show(player).then((response) => {
      if (response.canceled) {
        openMainMenu(player);
        return;
      }

      const selectedEntry = itemsList[response.selection];
      if (selectedEntry) {
        openItemConfigMenu(player, selectedEntry.slot);
      }
    }).catch((err) => {
      console.error("Error showing inventory selector: " + err);
    });
  } catch (error) {
    console.error("Error in openInventorySelector: " + error);
  }
}

// 4 & 5. Enchantment Configuration & Apply Engine
function openItemConfigMenu(player, slotIndex) {
  try {
    const inventory = player.getComponent("inventory");
    if (!inventory) return;
    const container = inventory.container;
    const item = container.getItem(slotIndex);

    if (!item) {
      player.sendMessage("§c[Ultimate Gear] Item no longer exists in that slot.");
      openInventorySelector(player);
      return;
    }

    const enchantable = item.getComponent("enchantable");
    if (!enchantable) {
      player.sendMessage("§c[Ultimate Gear] This item cannot be enchanted.");
      openInventorySelector(player);
      return;
    }

    // Determine applicable enchantment list
    let allowedEnchantments = [];
    if (isArmor(item)) {
      allowedEnchantments = ARMOR_ENCHANTMENTS;
    } else if (isToolOrWeapon(item)) {
      allowedEnchantments = TOOL_ENCHANTMENTS;
    } else {
      // General fallback or common enchantments (unbreaking, mending)
      allowedEnchantments = ["unbreaking", "mending"];
    }

    // Build Modal Form for Enchantment Configuration
    const modal = new ModalFormData()
      .title("§eConfigure: " + item.typeId.replace("minecraft:", ""));

    const currentEnchantments = {};
    allowedEnchantments.forEach((enchId) => {
      try {
        const enchType = EnchantmentTypes.get(enchId);
        if (enchType) {
          const existingEnch = enchantable.getEnchantment(enchType);
          const currentLevel = existingEnch ? existingEnch.level : 0;
          currentEnchantments[enchId] = currentLevel;
          
          // Add slider for level (0 to 255, where 0 means disabled)
          modal.slider(`${enchId.replace("_", " ").toUpperCase()} (0 = Off)`, 0, 255, 1, currentLevel);
        }
      } catch (e) {
        // Skip unsupported enchantment for this item type
      }
    });

    modal.show(player).then((response) => {
      if (response.canceled) {
        openInventorySelector(player);
        return;
      }

      const values = response.formValues;
      let valIndex = 0;
      const appliedChanges = [];

      // Re-fetch item to ensure safety
      const freshItem = container.getItem(slotIndex);
      if (!freshItem) {
        player.sendMessage("§c[Ultimate Gear] Item changed or removed during configuration.");
        return;
      }

      const freshEnchantable = freshItem.getComponent("enchantable");
      if (!freshEnchantable) {
        player.sendMessage("§c[Ultimate Gear] Enchantment component lost.");
        return;
      }

      allowedEnchantments.forEach((enchId) => {
        try {
          const enchType = EnchantmentTypes.get(enchId);
          if (!enchType) return;

          const targetLevel = values[valIndex++];
          if (targetLevel === undefined) return;

          if (targetLevel > 0) {
            // Validate via canAddEnchantment or direct creation
            try {
              const newEnch = { type: enchType, level: targetLevel };
              if (freshEnchantable.canAddEnchantment(newEnch)) {
                freshEnchantable.addEnchantment(newEnch);
                appliedChanges.push(`${enchId} Lvl ${targetLevel}`);
              } else {
                // Try forcing or add warning if native rules strict
                // For level 255 experimental, some items might require bypassing or handling errors
                try {
                  freshEnchantable.addEnchantment(newEnch);
                  appliedChanges.push(`${enchId} Lvl ${targetLevel} (Forced)`);
                } catch (errOverride) {
                  player.sendMessage(`§c[Ultimate Gear] Incompatible or limit reached for ${enchId}`);
                }
              }
            } catch (errLevel) {
              console.error(`Error applying enchantment ${enchId}: ` + errLevel);
            }
          } else {
            // Remove enchantment if level is 0
            try {
              freshEnchantable.removeEnchantment(enchType);
            } catch (e) {
              // Ignore if not present
            }
          }
        } catch (e) {
          // skip
        }
      });

      // Save back updated item to container slot
      container.setItem(slotIndex, freshItem);
      player.sendMessage("§a[Ultimate Gear] Successfully updated item enchantments!");

    }).catch((err) => {
      console.error("Error showing enchantment modal form: " + err);
    });

  } catch (error) {
    console.error("Error in openItemConfigMenu: " + error);
  }
}
