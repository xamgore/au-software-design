// A collection of areas.
// In the constructor function, we should pre-generate the "overworld"
// and the starting area (including starting Dungeon).
// Other Areas will be generated only when they are first visited.
Game.World = function () {
  this.overworld = this
  this.worldAreas = {} // key [x,y]: WorldArea,
  let area = this.generateWorldArea(0, 0, {dungeonChance: 100, dungeonDepth: 1})
  this.currentArea = area.dungeon.levels[area.dungeonDepth]
}

Game.WorldArea = function (params = {}) {
  let ops = {
    sightRadiusMultiplier: 1,
    tileset: Game.Tilesets.tower,
    builder: Game.Generators.generateCave,
    dungeonChance: 100,
    ...params
  }

  if (!ops.map)
    ops.map = new Game.Map(ops.builder(ops.width, ops.height, ops.tileset), ops.tileset)

  Game.Area.call(this, ops)

  this.parentLevel.area = ops.world.overworld
  this.parentLevel.x = ops.parentX
  this.parentLevel.y = ops.parentY

  this.map.area = this
  this.map.wrap = false
  this.setupFov()

  if (randomPercent() <= ops.dungeonChance)
    this.addDungeon(ops)
}

Game.WorldArea.extend(Game.Area)


// A method to generate world areas in the global world
Game.World.prototype.generateWorldArea = function (x, y, params) {
  let options = {
    width: 256,
    height: 256,
    parentX: x,
    parentY: y,
    id: x + ',' + y,
    sightRadiusMultiplier: 1,
    world: this,
    ...params
  }

  return this.worldAreas[options.id] = new Game.WorldArea(options)
}
