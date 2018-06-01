// Define a small screen-line helper, to show control buttons
Game.Screen.helpLine = {
  enter: function (display) {
    display.setOptions({
        width: Game.helpScreenWidth,
        height: Game.helpScreenHeight,
        forceSquareRatio: false,
        bg: "#000"
      }
    )
  },

  exit: function () {
  },

  render: function (display) {
    if (!Game.player || Game.player === null || Game.gameOver) {
      display.clear()
      return
    }

    display.drawText(0, 0,
      "%c{#777}%b{#000}[←↑↓→] to move and attack, " +
      "[space] to pick up items. [W] to wear, [D] to drop, [I] inventory")
  },

  handleInput: function (inputType, inputData) {
  }
}
