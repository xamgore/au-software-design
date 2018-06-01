// Screen is shown, when player wants to pick up
// everything from a cell, and there is more than
// a one item there
Game.Screen.pickupScreen = new Game.Screen.Base({
  title: 'Select Items to Pick Up:',
  caption: '(Letter key to select, [Space] for all, \n[Enter] Confirm, [Esc] Cancel)',
  canSelect: true,
  canSelectMultiple: true,

  // pick selected items
  ok: function (selectedItems) {
    const itemKeys = Object.keys(selectedItems)
    if (!this.player.pickupItems(itemKeys))
      Game.log('warning', this.player, "Inventory is full")
    return true
  },

  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown') {
      const cmd = inputData.keyCode

      if (cmd === ROT.VK_ESCAPE ||
        (cmd === ROT.VK_RETURN && Object.keys(this.selectedIndices).length === 0)) {
        Game.Screen.playScreen.setSubScreen(undefined)
      }

      else if (cmd === ROT.VK_RETURN) {
        this.executeOkFunction()
      }

      else if (cmd >= ROT.VK_1 && cmd <= ROT.VK_9) {
        const index = cmd - ROT.VK_1
        if (this.items[index]) {
          if (this.selectedIndices[index]) {
            delete this.selectedIndices[index]
          } else {
            this.selectedIndices[index] = true
          }

          Game.refresh()
        }
      } else if (cmd === ROT.VK_SPACE) {
        for (let i in this.items) {
          if (this.items.hasOwnProperty(i)) {
            this.selectedIndices[i] = true
          }
        }

        Game.refresh()
      }
    }
  }
})
