// Equipment screen with all items, that can be worn
Game.Screen.equipScreen = new Game.Screen.Base({
  title: 'Choose Item to Equip or Unequip:',
  caption: '(letter key to Equip/Unequip item, [Esc] to cancel)',
  canSelect: true,
  canSelectMultiple: false,

  // Take on / put off the weapon / shirt
  ok: function (selectedItems) {
    const key = Object.keys(selectedItems)[0]
    const item = selectedItems[key]

    if (item === this.player.armor) {
      Game.log('warning', this.player, "%s is removed", item.name)
      this.player.unwear()
    } else if (item === this.player.weapon) {
      Game.log('warning', this.player, "%s is removed", item.name)
      this.player.unwield()
    } else if (item.isWearable) {
      this.player.unequip(item)
      this.player.wear(item)
      Game.log('minor', this.player, "%s is on", item.describeA())
    } else if (item.isWieldable) {
      this.player.unequip(item)
      this.player.wield(item)
      Game.log('minor', this.player, "%s is on", item.describeA())
    }

    return true
  },

  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown') {
      const keyCode = inputData.keyCode

      if (keyCode === ROT.VK_ESCAPE) {
        Game.Screen.playScreen.setSubScreen(undefined)
      }

      else if (keyCode >= ROT.VK_1 && keyCode <= ROT.VK_9) {
        const index = keyCode - ROT.VK_1
        if (this.items[index]) {
          this.selectedIndices[index] = true
          this.executeOkFunction()
        }
      }
    }
  }
})
