Game.Mixins.inventoryHolder = {
  holdsInventory: true,

  init: function (template) {
    this.inventorySlots = template['inventorySlots'] || 10
    this.inventory = new Array(this.inventorySlots)
  },

  getInventory: function () {
    return this.holdsInventory ? this.inventory : null
  },

  getItem: function (i) {
    return this.holdsInventory ? this.inventory[i] : null
  },

  addItem: function (item) {
    if (!this.holdsInventory) {
      return false
    }
    // try to find a free inventory slot, return true only if
    // the item was successfully added
    for (let i = 0; i < this.inventory.length; i++) {
      if (!this.inventory[i]) {
        this.inventory[i] = item
        return true
      }
    }
    return false
  },

  removeItem: function (i) {
    if (!this.holdsInventory) {
      return
    }
    // if we can equip items, we want to make sure we unequip
    // the item we are removing if we need to
    if (this.inventory[i] && (this.canWearArmor || this.canWieldWeapons)) {
      this.unequip(this.inventory[i])
    }

    // simply clear the inventory slot
    this.inventory[i] = null
  },

  canAddItem: function () {
    if (!this.holdsInventory) {
      return false
    }
    // check if we have an empty slot
    for (let i = 0; i < this.inventory.length; i++) {
      if (!this.inventory[i]) {
        return true
      }
    }
    return false
  },

  pickupItems: function (indices) {
    if (!this.holdsInventory) {
      return false
    }
    // allows the user to pick up items from the map, where indices
    // is the indices for the array returned by area.getItemsAt
    const mapItems = this.area.getItemsAt(this.x, this.y)
    let added = 0
    let itemAdd
    // iterate through all indices
    for (let i = 0; i < indices.length; i++) {
      // try to add the item. If our inventory is not full, then splice
      // the item out of the list of items. In order to fetch the right
      // item, we have to offset the number of items already added.
      itemAdd = mapItems[indices[i] - added]
      if (this.addItem(itemAdd)) {
        mapItems.splice(indices[i] - added, 1)
        added++
      } else {
        // inventory is full
        break
      }
    }
    // update the map items
    this.area.setItemsAt(this.x, this.y, mapItems)

    // message the player about the items added
    if (this === Game.player) {
      if (added === 1) {
        Game.log('minor', this, "Pick up %s", itemAdd.describeA() + ".")
      }
      else if (added > 1) {
        Game.log('minor', this, "Pick up things")
      }
    }

    // return true only if we added all items
    return (added === indices.length)
  },

  dropItem: function (i) {
    if (!this.holdsInventory) {
      return
    }
    // drops an item to the current map tile
    if (this.inventory[i]) {
      if (this.area) {
        this.area.addItem(this.x, this.y, this.inventory[i])
      }
      Game.log('minor', this, "Drop %s", this.inventory[i].name)
      this.removeItem(i)
    }
  },

  unequip: function (item) {
    if (this.weapon === item) {
      this.unwield()
    }
    if (this.armor === item) {
      this.unwear()
    }
  }
}
