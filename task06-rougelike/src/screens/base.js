// The base screen, is used for dialog screens
Game.Screen.Base = function (template) {
  this.player = Game.player
  this.title = template['title'] || "Some Items"
  this.caption = template['caption'] || "(Press [Enter] or [Esc] to close.)"
  this.okFunction = template['ok'] || null
  this.canSelect = template['canSelect'] || false
  this.canSelectMultiple = template['canSelectMultiple'] || false
  this.filterFunction = template['filter'] || function (x) {
    return x
  }

  this.handleInput = template['handleInput']
}

// called on creation
Game.Screen.Base.prototype.setup = function (player, items) {
  this.player = player
  let count = 0
  const that = this

  this.items = items.map(function (item) {
    if (that.filterFunction(item)) {
      count++
      return item
    } else {
      return null
    }
  })

  this.selectedIndices = {}
  return count
}

Game.Screen.Base.prototype.render = function (display) {
  display.setOptions({
    fontSize: 16,
    forceSquareRatio: false
  })

  const availSize = display.computeSize(Game.playDivWidth, Game.playDivHeight)
  display.setOptions({width: availSize[0], height: availSize[1]})

  const letters = '123456789'
  display.drawText(1, 1, this.title)

  let row = 0
  for (let i = 0; i < this.items.length; i++) {
    if (this.items[i]) {
      const letter = letters.substring(i, i + 1)
      const selectionState = (this.canSelect && this.canSelectMultiple &&
        this.selectedIndices[i]) ? '+' : '-'
      let suffix
      if (this.items[i] === this.player.armor) {
        suffix = ' (wearing)'
      } else if (this.items[i] === this.player.weapon) {
        suffix = ' (wielding)'
      } else {
        suffix = ''
      }

      display.draw(1, 3 + row, letter)
      display.draw(3, 3 + row, selectionState)
      display.draw(5, 3 + row, this.items[i].character, this.items[i].foreground, this.items[i].background)
      display.drawText(7, 3 + row, this.items[i].describeA() + suffix)
      row++
    }
  }

  display.drawText(1, 5 + row, this.caption)
}

// is called when user presses "ok" button
Game.Screen.Base.prototype.executeOkFunction = function () {
  const selectedItems = {}
  for (let key in this.selectedIndices) {
    if (this.selectedIndices.hasOwnProperty(key)) {
      selectedItems[key] = this.items[key]
    }
  }

  Game.Screen.playScreen.setSubScreen(undefined)
  if (this.okFunction(selectedItems)) {
    this.player.area.engine.unlock()
  }
}

Game.Screen.Base.prototype.handleInput = function (inputType, inputData) {
  if (inputType === 'keydown') {
    const keyCode = inputData.keyCode

    if (keyCode === ROT.VK_ESCAPE || (keyCode === ROT.VK_RETURN &&
      (!this.canSelect || Object.keys(this.selectedIndices).length === 0))) {
      Game.Screen.playScreen.setSubScreen(undefined)
    }

    else if (keyCode === ROT.VK_RETURN) {
      this.executeOkFunction()
    }

    else if (this.canSelect && keyCode >= ROT.VK_1 && keyCode <= ROT.VK_9) {
      const index = keyCode - ROT.VK_1

      if (this.items[index]) {
        if (this.canSelectMultiple) {
          if (this.selectedIndices[index]) {
            delete this.selectedIndices[index]
          } else {
            this.selectedIndices[index] = true
          }

          Game.refresh()
        } else {
          this.selectedIndices[index] = true
          this.executeOkFunction()
        }
      }
    } else if (this.canSelectMultiple && keyCode === ROT.VK_SPACE) {
      for (let i in this.items) {
        if (this.items.hasOwnProperty(i)) {
          this.selectedIndices[i] = true
        }
      }
    }
  }
}
