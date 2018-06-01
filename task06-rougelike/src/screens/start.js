Game.Screen.startScreen = {
  enter: function () {
  },

  exit: function () {
  },

  render: function (display) {
    let [width, height] = display.computeSize(Game.windowWidth, Game.windowHeight)

    display.setOptions({
      width,
      height,
      forceSquareRatio: false,
      spacing: 1,
      fg: '#ccc',
      bg: '#000'
    })

    const welcome = "%c{#fff}Press [Enter] to start"
    const textSize = ROT.Text.measure(welcome)
    const cx = Math.floor((width - textSize.width) / 2)
    const cy = Math.floor(height / 2)
    display.drawText(cx, cy, welcome)
  },

  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.VK_RETURN) {
        document.getElementById("titleDiv").style.display = "none"

        document.getElementById("helpDiv").style.display =
          document.getElementById("playDiv").style.display =
            document.getElementById("statsDiv").style.display =
              document.getElementById("msgDiv").style.display =
                document.getElementById("inputDiv").style.display = "block"

        Game.switchScreen(Game.Screen.helpLine, 'help')
        Game.switchScreen(Game.Screen.statsScreen, 'stats')
        Game.switchScreen(Game.Screen.logScreen, 'msg')
        Game.switchScreen(Game.Screen.playScreen, 'main')
      }
    }
  }
}
