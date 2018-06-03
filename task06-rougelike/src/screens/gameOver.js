// Define the losing screen
Game.Screen.gameOverScreen = {
  enter: function () {
  },

  exit: function () {
    Game.player.clearMessages()
    Game.displays.msg.clear()
  },

  render: function (display) {
  },

  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN)
      Game.switchScreen(Game.Screen.startScreen, 'main')
  }
}
