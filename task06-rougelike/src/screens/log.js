Game.Screen.logScreen = {
  enter: function (display) {
    display.setOptions({
        width: Game.msgScreenWidth,
        height: Game.msgScreenHeight,
        forceSquareRatio: false,
        bg: "#000"
      }
    )
  },

  exit: function () {
  },

  render: function (display) {
    // Get the messages in the queue and render them
    if (!Game.player || (Game.player === null))
      return

    let messageOut = 0
    for (let m of  Game.player.messages)
      messageOut += display.drawText(0, messageOut, '%c{#fff}%b{#000}' + m)
  },

  handleInput: function (inputType, inputData) {
  }
}
