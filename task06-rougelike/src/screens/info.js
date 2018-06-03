// Screen with a minimal information and statistics
Game.Screen.statsScreen = {
  enter: function (display) {
    display.setOptions({
        width: Game.statsScreenWidth,
        height: Game.statsScreenHeight,
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

    const player = Game.player

    const hpState = player.getHpState()
    display.drawText(0, 4, '%c{#fff}%b{#000}HP ' + hpState)
    display.drawText(0, 5, '%c{#fff}%b{#000}Attack %c{#f00}' + player.attackValue)
    display.drawText(0, 6, '%c{#fff}%b{#000}Defense %c{#0f0}' + player.getDefenseValue())

    let weaponChar = player.weapon ? player.weapon.character : ''
    let weaponColor = player.weapon ? player.weapon.foreground : '#000'
    let weaponName = player.weapon ? '%c{' + weaponColor + '}' + player.weapon.name : '%c{#aaa}nothing'
    let weaponLabel = '%c{#fff}%b{#000}Weapon: '
    let weaponLabelSize = ROT.Text.measure(weaponLabel).width

    display.drawText(0, 10, weaponLabel)
    display.draw(weaponLabelSize + 2, 10, weaponChar, weaponColor)
    display.drawText(weaponLabelSize + 4, 10, weaponName)

    // show current armor
    let armorName, armorColor, armorChar
    if (player.armor) {
      armorChar = player.armor.character
      armorColor = player.armor.foreground
      armorName = '%c{' + armorColor + '}' + player.armor.name
    } else {
      armorChar = ''
      armorColor = '#000'
      armorName = '%c{#aaa}nothing'
    }
    const armorLabel = '%c{#fff}%b{#000}Wear: '

    display.drawText(0, 11, armorLabel)
    display.draw(weaponLabelSize + 2, 11, armorChar, armorColor)
    display.drawText(weaponLabelSize + 4, 11, armorName)

    // const hereLine = Game.statsScreenHeight - 6
    // const hereList = Game.currentWorld.currentArea.whatsHere(player.x, player.y)

    // display.drawText(0, hereLine, '%c{#fff}%b{#000}Here:')
    // display.drawText(5, hereLine + 1, hereList.tile)
    //
    // if (hereList.items) {
    //   let item, itemChar, itemColor, itemName
    //   for (let i = 0; i < hereList.items.length; i++) {
    //     item = hereList.items[i]
    //     itemChar = item.character
    //     itemColor = item.foreground
    //     itemName = '%c{' + itemColor + '}' + item.describeA(true)
    //
    //     display.draw(3, hereLine + 2 + i, itemChar, itemColor)
    //     display.drawText(5, hereLine + 2 + i, itemName)
    //   }
    // }
  },

  handleInput: function (inputType, inputData) {
  }
}
