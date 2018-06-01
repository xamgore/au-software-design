Game.Screen.levelUp = {
  setup: function (entity) {
    this.entity = entity
    this.options = entity.statOptions
  },

  render: function (display) {
    display.setOptions({
      forceSquareRatio: false
    })

    const availSize = display.computeSize(Game.playDivWidth, Game.playDivHeight)
    display.setOptions({width: availSize[0], height: availSize[1]})

    const letters = '1234'
    display.drawText(0, 1, 'Level up! Choose, what to increase?')

    for (let i = 0; i < this.options.length; i++)
      display.drawText(0, 3 + i, letters.substring(i, i + 1) + '. ' + this.options[i][0])
  },

  handleInput: function (inputType, inputData) {
    if (inputType === 'keydown') {
      const cmd = inputData.keyCode

      if ([ROT.VK_1, ROT.VK_2, ROT.VK_3, ROT.VK_4].indexOf(cmd) === -1)
        return

      const index = cmd - ROT.VK_1
      if (this.options[index]) {
        this.options[index][1].call(this.entity)

        this.entity.statPoints -= 1
        this.entity.statPoints === 0
          ? Game.Screen.playScreen.setSubScreen(undefined)
          : Game.refresh()
      }
    }
  }
}
