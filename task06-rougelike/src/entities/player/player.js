// Player character, which is controlled by user
Game.Player = function (template) {
  const defaults = {
    name: "professor fortran",
    description: "",
    character: '@',
    foreground: '#fff',
    background: '#000',
    isHostile: false,
    isActor: true,
    speed: 5,
    movable: true,
    destructible: {
      maxHP: 10,
      baseDefenseValue: 0
    },
    attacker: {
      baseAttackValue: 1,
      isRangedAttacker: true,
      canThrowItems: true
    },
    sight: {
      sightRadius: 5
    },
    messageRecipient: true,
    inventoryHolder: {
      inventorySlots: 22
    },
    armorUser: true,
    weaponUser: true,
    experienceGainer: true,
    tokens: {}
  }

  template = applyDefaults(template, defaults)
  Game.Entity.call(this, template)
}

Game.Player.extend(Game.Entity)


// one step -- action of the player
// called by the ROT engine methods
Game.Player.prototype.act = function () {
  if (this.acting)
    return false

  this.acting = true

  if (!this.isAlive) {
    Game.setGameOver(true)
    Game.log('danger', this, 'Player died, [Enter] to continue.')
  }

  Game.refresh()
  this.area.engine.lock()
  this.acting = false
}


// set location, and populate the area, if it wasn't visited before
Game.Player.prototype.setLocation = function (x, y, area) {
  const oldArea = this.area
  let newArea = area

  if (oldArea && !newArea)
    newArea = oldArea

  if (oldArea !== newArea) {
    if (!newArea.lastVisit) {
      newArea.populate()
      if (newArea.isDungeonArea())
        newArea.scatterItems()
    }

    Game.currentWorld.currentArea = newArea
  }

  Game.Entity.prototype.setLocation.call(this, x, y, newArea)
}

// make a move, and check the cell is walkable
Game.Player.prototype.move = function (newX, newY) {
  const player = this
  const area = player.area
  const tile = area.map.getTile(newX, newY)

  if (tile.isWalkable) {
    player.setLocation(newX, newY)

    if (tile === area.map.tileset.stairsUp) {
      Game.log('info', player, "To go up the stairs press [Space]")
    } else if (tile === area.map.tileset.stairsDown) {
      Game.log('info', player, "To go down the stairs press [Space]")
    }

    return true
  } else if (tile.isBreakable) {
    area.map.breakTile(newX, newY)
    return true
  } else {
    return false
  }
}

Game.Player.prototype.changeAreas = function (x, y) {
  const player = this
  const currentArea = player.area
  const tile = currentArea.map.getTile(x, y)

  let newX, newY, newArea
  if (tile === currentArea.map.tileset.stairsUp) {
    newArea = currentArea.parentLevel.area
    newX = currentArea.parentLevel.x
    newY = currentArea.parentLevel.y
    player.setLocation(newX, newY, newArea)
    return true
  } else if (tile === currentArea.map.tileset.stairsDown) {
    newArea = currentArea.subLevel.area
    newX = currentArea.subLevel.x
    newY = currentArea.subLevel.y
    player.setLocation(newX, newY, newArea)
    return true
  }

  return false
}
