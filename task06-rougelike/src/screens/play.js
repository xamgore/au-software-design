// Game session screen
Game.Screen.playScreen = {
  subScreen: null,

  enter: function (display) {
    Game.currentScreens.title = null

    if (Game.gameOver) {
      Game.gameOver = false
    }

    display.setOptions({
      width: Game.playScreenWidth,
      height: Game.playScreenHeight + 1,
      forceSquareRatio: true,
      spacing: 1,
      bg: "#111"
    })

    Game.startNewGame()
  },

  exit: function () {
  },

  render: function (display) {
    if (this.subScreen) {
      this.subScreen.render(display)
      return
    }

    const player = Game.player
    const area = player.area

    const screenWidth = Game.playScreenWidth
    const screenHeight = Game.playScreenHeight

    const fontSize = 13
    const spacing = 1
    const forceSquare = true

    display.setOptions({
      width: screenWidth,
      height: screenHeight,
      fontSize: fontSize,
      forceSquareRatio: forceSquare,
      spacing: spacing
    })

    if (Game.recalcDisplaySize()) {
      Game.refresh()
    }

    this.renderMap(display)
  },

  handleInput: function (inputType, inputData) {
    if (Game.gameOver) {
      if (inputType === 'keydown' && inputData.keyCode === ROT.VK_RETURN) {
        Game.switchScreen(Game.Screen.gameOverScreen, 'main')
      }
      return
    }

    if (this.subScreen) {
      this.subScreen.handleInput(inputType, inputData)
      return
    }

    if (inputType === 'keydown') {
      const cmd = inputData.keyCode
      const player = Game.player

      if (cmd === ROT.VK_LEFT) {
        this.move(-1, 0)
      }
      else if (cmd === ROT.VK_RIGHT) {
        this.move(1, 0)
      }
      else if (cmd === ROT.VK_UP) {
        this.move(0, -1)
      }
      else if (cmd === ROT.VK_DOWN) {
        this.move(0, 1)
      }
      else if (cmd === ROT.VK_I) {          // inventory screen
        this.showItemsSubScreen(Game.Screen.inventoryScreen, player.inventory)
        return
      }
      else if (cmd === ROT.VK_D) {          // drop screen
        this.showItemsSubScreen(Game.Screen.dropScreen, player.inventory)
        return
      }
      else if (cmd === ROT.VK_W) {      // wear/wield screen
        if (player.canWearArmor || player.canWieldWeapons) {
          this.showItemsSubScreen(Game.Screen.equipScreen, player.inventory)
        }
      }
      else if (cmd === ROT.VK_SPACE) {
        this.activateTile()
      }
      else {
        // not a valid key
        return
      }
      // Unlock the engine
      //this.player.trackers.turnsTaken++;
      player.raiseEvent('onTurnTaken')
      player.area.engine.unlock()
    }
  },

  getMapCoordinates: function (screenX, screenY) {
    // takes ScreenX, ScreenY coordinates and
    // returns correct mapX, mapY coordinates
    const playerX = Game.player.x
    const playerY = Game.player.y
    const area = Game.currentWorld.currentArea
    const mapWidth = area.map.width
    const mapHeight = area.map.height
    const screenWidth = Game.playScreenWidth
    const screenHeight = Game.playScreenHeight

    let mapLeftBound, mapTopBound, mapX, mapY

    // wrap the x-coordinates if needed
    if (area.map.wrap) {
      // find the left bound (screenX = 0) of the rendered map,
      // based on player map position
      mapLeftBound = playerX - (screenWidth / 2)
      // adjust if needed
      if (mapLeftBound < 0) {
        mapLeftBound += mapWidth
      }
      mapX = mapLeftBound + screenX
      if (mapX >= mapWidth) {
        mapX %= mapWidth
      }
    } else {
      mapLeftBound = Math.max(0, playerX - (screenWidth / 2))
      mapLeftBound = Math.min(mapLeftBound, Math.abs(mapWidth - screenWidth))
      mapX = mapLeftBound + screenX
    }

    // we don't wrap the y-coordinates in any case
    mapTopBound = Math.max(0, playerY - (screenHeight / 2))
    mapTopBound = Math.min(mapTopBound, Math.abs(mapHeight - screenHeight))
    mapY = mapTopBound + screenY

    return {x: mapX, y: mapY}
  },

  renderMap: function (display) {
    const player = Game.player
    const area = player.area
    const map = area.map

    const screenWidth = Game.playScreenWidth
    const screenHeight = Game.playScreenHeight

    const mapWidth = area.width
    const mapHeight = area.height

    const playerX = player.x
    const playerY = player.y

    // Find all visible map cells based on FOV or previous visit
    const visibleCells = {}
    const sightRadius = player.sightRadius * area.sightRadiusMultiplier
    area.fov.compute(
      playerX, playerY, sightRadius,
      function (x, y, radius, visibility) {
        x = map.getWrappedX(x)
        visibleCells[x + "," + y] = true
        // mark cell as explored
        map.setExplored(x, y, true)
      }
    )

    // calculate the map coordinates at the top left of the screen
    // (based on centering the view on the player and
    //  wrapping the map if needed)
    const topLeft = this.getMapCoordinates(0, 0)

    // Render visible and explored map cells
    var x, y, sx, sy
    for (sx = 0, x = topLeft.x; sx < screenWidth; sx++, x++) {
      for (sy = 0, y = topLeft.y; sy < screenHeight; sy++, y++) {

        // if our x has gone past the mapWidth, recalculate and reset
        if (x >= mapWidth) {
          x = this.getMapCoordinates(sx, sy).x
        }

        if (map.isExplored(x, y)) {
          // fetch the glyph for the tile and render it
          // to the screen at the offset position
          let glyph, char, fg, bg
          // if we are at a cell within the fov, check if
          // there are visible items or entities
          if (visibleCells[x + ',' + y]) {
            // render map tile first, then items, then entities
            // TODO: refactor based on proper stacking order for future tile graphics

            glyph = map.getTile(x, y)
            bg = glyph.background          // get the map background

            if (area.getItemsAt(x, y)) {
              // if we have items, get the glyph of the topmost one
              const items = area.getItemsAt(x, y)
              glyph = items[items.length - 1]
            }
            if (area.getEntityAt(x, y)) {
              glyph = area.getEntityAt(x, y)
            }

            char = glyph.character
            fg = glyph.foreground
            // if the item or creature doesn't explicitly set its own background,
            // use the map background to render.
            bg = glyph.background || bg
          } else {
            // tile was previously explored but is not currently
            // within the fov; render it darker
            // TODO: colors/params based on map type
            glyph = map.getTile(x, y)
            char = glyph.character
            fg = glyph.darken().foreground
            bg = glyph.darken().background
          }
          display.draw(sx, sy, char, fg, bg)
        }
      }
    }
  },

  move: function (dX, dY) {
    const player = Game.player
    const area = Game.currentWorld.currentArea
    const mapWidth = area.map.width
    let newX = player.x + dX
    // check if we need to wrap around
    if (area.map.wrap) {
      if (newX < 0) {
        newX += mapWidth
      } else if (newX >= mapWidth) {
        newX %= mapWidth
      }
    }
    const newY = player.y + dY
    // Try to move to the new cell
    player.tryMove(newX, newY)
  },

  activateTile: function () {
    const player = Game.player
    const area = Game.currentWorld.currentArea
    const x = player.x
    const y = player.y

    // check for items that player wants to pick up
    const items = area.getItemsAt(x, y)
    if (items) {
      if (items.length === 1) {
        // if only one item, don't show a screen, just try to pick it up
        const item = items[0]
        if (player.pickupItems([0])) {
          //Game.log('minor', player, "You pick up %s", item.describeA() + ".");
        } else {
          Game.log('warning', player, "Inventory is full")
        }
      } else {
        // show the pickup screen if there are > 1 item
        this.showItemsSubScreen(Game.Screen.pickupScreen, items,
          "There is nothing here to pick up.")
      }
    } else {
      // if no items, check for other functions

      // check for special tiles for area changes
      /*
      if (player.changeAreas(x, y)) {
          Game.refresh();
      }
      */
      if (player.changeAreas(x, y)) {
        Game.currentWorld.currentArea = player.area
      }
    }
  },

  setSubScreen: function (subScreen) {
    // TODO: move subscreens to separate display
    this.subScreen = subScreen
    // refresh screen on changing the subscreen
    Game.refresh()
  },

  showItemsSubScreen: function (subScreen, items, emptyMessage = "") {
    const player = Game.player
    if (items && subScreen.setup(player, items) > 0) {
      this.setSubScreen(subScreen)
    } else {
      Game.log('warning', player, emptyMessage)
      Game.refresh()
    }
  },

  showTargetSubScreen: function (subScreen, extraOptions) {
    const offsets = this.getMapCoordinates(0, 0)
    const player = Game.player
    subScreen.setup(player, player.x, player.y, offsets.x, offsets.y)

    // if we have extra options, pass them along
    if (extraOptions) {
      subScreen.passOptions(extraOptions)
    }

    this.setSubScreen(subScreen)
  }
}
