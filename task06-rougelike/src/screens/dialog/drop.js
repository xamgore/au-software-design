// Drop screen, which is used when the player wants to free the inventory
Game.Screen.dropScreen = new Game.Screen.Base({
  title: 'Select Item to Drop:',
  caption: '(letter key to drop item, [Esc] to cancel)',
  canSelect: true,
  canSelectMultiple: false,

  // drop the selected item
  ok: function (selectedItems) {
    this.player.dropItem(Object.keys(selectedItems)[0])
    return true
  },

  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown') {
      const keyCode = inputData.keyCode

      if (keyCode === ROT.VK_ESCAPE) {
        Game.Screen.playScreen.setSubScreen(undefined)
      } else if (keyCode >= ROT.VK_1 && keyCode <= ROT.VK_9) {
        const index = keyCode - ROT.VK_1

        if (this.items[index]) {
          this.selectedIndices[index] = true
          this.executeOkFunction()
        }
      }
    }
  }
})
