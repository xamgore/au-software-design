// A squared area with dungeons
Game.Area = function (params) {
  const defaults = {
    id: 0,
    width: Game.playScreenWidth * 2,
    height: Game.playScreenHeight * 2,
    world: null,
    parentX: 0,
    parentY: 0,
    biome: null,
    map: null,                           // holds Game.Map object
    fov: null,
    sightRadiusMultiplier: 1,
    clevel: 1,              // average creature level
    lastVisit: 0,           // to simulate turns if player leaves & comes back later
    entities: {},           // table to hold entities in this area, stored by position
    items: {},              // table to hold items in this area
    parentLevel: {},
    subLevel: {}
  }

  params = applyDefaults(params, defaults)
  const props = Object.keys(params)
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    if (!this.hasOwnProperty(prop)) {
      this[prop] = params[prop]
    }
  }

  this.scheduler = new ROT.Scheduler.Simple()
  this.engine = new ROT.Engine(this.scheduler)
}

Game.Area.prototype.isDungeonArea = function () {
  return (this instanceof Game.DungeonArea)
}

Game.Area.prototype.populate = function (population) {
  if (!population) {
    const mapArea = this.width * this.height
    const areaPerPop = randomNormalInt(200, 50)
    population = Math.max(Math.round(mapArea / areaPerPop), 10)
  }

  for (let p = 0; p < population; p++) {
    const monster = Game.MonsterFactory.createRandom()
    this.placeEntityAtRandomPosition(monster)
  }
}

Game.Area.prototype.scatterItems = function (amount) {
  if (!amount) {
    const mapArea = this.width * this.height
    const areaPerItem = randomNormalInt(100, 20)
    amount = Math.max(Math.round(mapArea / areaPerItem), 10)
  }

  const itemPop = randomNormalInt(amount, 1)
  for (let i = 0; i < itemPop; i++) {
    const item = Game.ItemFactory.createRandom()
    this.addItemAtRandomPosition(item)
  }
}

// set up field-of-view for the area
Game.Area.prototype.setupFov = function () {
  const area = this
  area.fov = new ROT.FOV.RecursiveShadowcasting(function (x, y) {
    return (area.map.getTile(x, y).passesLight)
  })
}

Game.Area.prototype.addDungeon = function (options) {
  options = options || {}
  const depth = options['dungeonDepth'] || randomInt(5, 10)
  const dungeonLoc = this.map.getRandomFloorPosition()

  this.dungeon = new Game.Dungeon({
    parentArea: this,
    parentX: dungeonLoc.x,
    parentY: dungeonLoc.y,
    numLevels: depth
  })

  this.map.grid[dungeonLoc.x][dungeonLoc.y] = this.map.tileset.stairsDown

  const firstLevel = this.dungeon.levels[1]
  this.subLevel.area = firstLevel
  firstLevel.parentLevel.x = dungeonLoc.x
  firstLevel.parentLevel.y = dungeonLoc.y
  firstLevel.parentLevel.area = this

  const stairsUpRoom = firstLevel.rooms[firstLevel.rooms.length - 2]
  const stairsUpX = (stairsUpRoom.xStart + stairsUpRoom.xEnd) >> 1
  const stairsUpY = (stairsUpRoom.yStart + stairsUpRoom.yEnd) >> 1

  firstLevel.map.grid[stairsUpX][stairsUpY] = firstLevel.map.tileset.stairsUp

  this.subLevel.x = stairsUpX
  this.subLevel.y = stairsUpY
}

Game.Area.prototype.addEntity = function (entity) {
  if (entity.x < 0 || entity.x >= this.map.width ||
    entity.y < 0 || entity.y >= this.map.height) {
    throw new Error('addEntity: entity position out of bounds.')
  }

  entity.area = this
  const key = entity.x + ',' + entity.y
  this.entities[key] = entity

  if (entity.isActor)
    this.scheduler.add(entity, true)
}

Game.Area.prototype.placeEntityAtRandomPosition = function (entity) {
  const position = this.map.getRandomFloorPosition()
  this.updateEntityLocation(entity, position.x, position.y)
}

Game.Area.prototype.removeEntity = function (e) {
  if (e.isActor)
    this.scheduler.remove(e)

  const key = e.x + ',' + e.y
  if (this.entities[key] === e)
    delete this.entities[key]
}

Game.Area.prototype.getEntityAt = function (x, y) {
  return this.entities[x + ',' + y]
}

// the only method to use to update location of an entity
Game.Area.prototype.updateEntityLocation = function (e, newX, newY, newArea) {
  const oldX = e.x
  const oldY = e.y
  const oldArea = e.area

  if (oldArea && !newArea) newArea = oldArea

  if (!newArea) newArea = this

  if (newX < 0 || newX >= newArea.width ||
    newY < 0 || newY >= newArea.height) {
    throw new Error("updateEntityLocation: new position is out of bounds.")
  }

  const newKey = newX + ',' + newY
  if (newArea.entities[newKey] && newArea.entities[newKey] !== e) {
    throw new Error("updateEntityLocation: tried to add an entity at an occupied position.")
  }

  if (newArea === oldArea) {
    const oldKey = oldX + ',' + oldY
    if (oldArea.entities[oldKey] === e) {
      delete oldArea.entities[oldKey]
    }

    newArea.entities[newKey] = e
    e.x = newX
    e.y = newY
  } else {
    if (oldArea) oldArea.removeEntity(e)

    e.x = newX
    e.y = newY
    newArea.addEntity(e)
  }
}

// Get an array of items at location (x, y)
Game.Area.prototype.getItemsAt = function (x, y) {
  return this.items[x + ',' + y]
}

// Set items on to the location (x, y).
// If items parameter is empty, then all items on the map will be erased.
Game.Area.prototype.setItemsAt = function (x, y, items) {
  const key = x + ',' + y

  if (items.length === 0) {
    if (this.items[key])
      delete this.items[key]
  } else {
    this.items[key] = items
  }
}

// Method to put an item at the location (x, y)
Game.Area.prototype.addItem = function (x, y, item) {
  const key = x + ',' + y

  if (this.items[key])
    this.items[key].push(item)
  else
    this.items[key] = [item]
}


// Method to put an item at a random location (x, y)
Game.Area.prototype.addItemAtRandomPosition = function (item) {
  const position = this.map.getRandomFloorPosition()
  this.addItem(position.x, position.y, item)
}

// given an (x, y) location, return descriptions of the tile
// as well as a list of any items or creatures on the tile.
Game.Area.prototype.whatsHere = function (x, y) {
  const tile = this.map.getTile(x, y)
  const items = this.getItemsAt(x, y)
  const entity = this.getEntityAt(x, y)

  const list = {}
  list['tile'] = '%c{' + tile.foreground + '}' + tile.description

  if (entity && entity !== Game.player)
    list['entity'] = entity

  if (items) {
    list['items'] = []
    for (let i = items.length - 1; i >= 0; i--)
      list['items'].push(items[i])
  }

  return list
}
