// Inventory screen, where the player can see his items
Game.Screen.inventoryScreen = new Game.Screen.Base({
  title: 'Inventory:',
  caption: '(press any key to close)',
  canSelect: false,
  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown' && inputData.keyCode)
      Game.Screen.playScreen.setSubScreen(undefined)
  }
})
