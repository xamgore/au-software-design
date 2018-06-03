// a living (scripted) thing with action and behaviour
Game.Entity = function Entity(properties) {
  const defaults = {
    name: "entity",
    description: "",
    x: 0,
    y: 0,
    area: null,
    isAlive: true,
    speed: 1
  }

  properties = applyDefaults(properties, defaults)
  Game.DynamicGlyph.call(this, properties)
}

Game.Entity.extend(Game.DynamicGlyph)


// need for ROT.enginge.speed
Game.Entity.prototype.getSpeed = function () {
  return this.speed
}

// set position for entity, with checks of walls, etc
Game.Entity.prototype.setLocation = function (x, y, area) {
  let oldArea
  if (this.area) {
    oldArea = this.area
  } else {
    oldArea = area
  }

  if (!area) area = this.area

  if (area.map.isEmptyFloor(x, y)) {
    oldArea.updateEntityLocation(this, x, y, area)
    return
  }

  let foundEmptyTile = false
  let radius = 1
  let tilesToCheck, tile, len

  while (!foundEmptyTile) {
    tilesToCheck = area.map.getTilesWithinRadius(x, y, radius)
    len = tilesToCheck.length

    for (let i = 0; i < len; i++) {
      tile = tilesToCheck[i]

      if (area.map.isEmptyFloor(tile.x, tile.y)) {
        foundEmptyTile = true
        x = tile.x
        y = tile.y
        break
      }
    }

    radius++
  }
}

// remove entity (or kill the player and cancel the game)
Game.Entity.prototype.kill = function (message) {
  if (!this.isAlive) return
  this.isAlive = false

  Game.log('danger', this, message ? message : "Death")

  if (this === Game.player) {
    this.act()
  } else {
    this.area.removeEntity(this)
  }
}


