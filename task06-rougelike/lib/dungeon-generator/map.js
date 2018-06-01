// A grid (2D array) on which to place and manipulate tiles
Game.Map = function (grid, tileset) {
  this.grid = grid
  this.tileset = tileset
  this.area = null       // should be set by the Area that owns it
  this.wrap = false      // should also be set by the Area that owns it

  // cache width and height based on the dimensions of the grid array
  this.width = grid.length
  this.height = grid[0].length

  // setup array to store whether a tile has been explored
  // so that we can render it in the future
  this.explored = new Array(this.width)

  for (let x = 0; x < this.width; x++) {
    this.explored[x] = new Array(this.height)
    for (let y = 0; y < this.height; y++)
      this.explored[x][y] = false
  }
}

Game.Map.prototype.getWrappedX = function (x) {
  if (!this.wrap) x = this.getConstrainedX(x)
  return (x < 0) ? x + this.width : x >= (this.width) ? x % this.width : x
}

Game.Map.prototype.getConstrainedX = function (x) {
  return (x < 0) ? 0 : (x >= this.width) ? this.width - 1 : x
}

Game.Map.prototype.getTile = function (x, y) {
  if (this.wrap) x = this.getWrappedX(x)
  return this.checkX(x) && this.checkY(y)
    ? this.grid[x][y] || Game.Tile.nullTile
    : Game.Tile.nullTile
}

Game.Map.prototype.checkX = function (x) {
  return x >= 0 && x < this.width
}

Game.Map.prototype.checkY = function (y) {
  return y >= 0 && y < this.height
}

Game.Map.prototype.getNeighborTiles = function (x, y) {
  const tiles = []

  for (let dX = -1; dX < 2; dX++) {
    for (let dY = -1; dY < 2; dY++) {
      if (dX === 0 && dY === 0) continue
      tiles.push({x: x + dX, y: y + dY})
    }
  }

  return tiles.randomize()
}

Game.Map.prototype.getTilesWithinRadius = function (centerX, centerY, radius) {
  const results = []
  const leftX = centerX - radius
  const rightX = centerX + radius
  const topY = centerY - radius
  const bottomY = centerY + radius

  for (let x = leftX; x <= rightX; x++) {
    for (let y = topY; y <= bottomY; y++) {
      if (x === centerX && y === centerX)
        continue

      results.push({x: x, y: y})
    }
  }

  return results.randomize()
}

// starting at (startX, startY), search in dir until we reach tile return tile (x, y)
Game.Map.prototype.searchInDirection = function (startX, startY, dir, tile, maxDistance) {
  maxDistance = maxDistance || Math.max(this.width, this.height)

  let dx = 0, dy = 0
  if (dir === 0 || dir === 'N' || dir === 'n') dy = -1
  if (dir === 1 || dir === 'E' || dir === 'e') dx = 1
  if (dir === 2 || dir === 'S' || dir === 's') dy = 1
  if (dir === 3 || dir === 'W' || dir === 'w') dx = -1

  let x = startX + dx, y = startY + dy
  let distance = 1
  let foundTile

  while (!foundTile && distance <= maxDistance) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height)
      break

    if (this.getTile(x, y) === tile) {
      foundTile = {}
      foundTile.x = x
      foundTile.y = y
      break
    }

    x += dx
    y += dy
    distance++
  }

  return foundTile
}

Game.Map.prototype.isAdjacent = function (x, y, tile) {
  const neighbors = this.getNeighborTiles(x, y)
  const len = neighbors.length

  for (let i = 0; i < len; i++)
    if (neighbors[i] === tile)
      return true

  return false
}

// check whether a rectangular region is entirely tiled with 'tile'
// (most useful for checking for an unused area (tile == nullTile) in
//  dungeon-building routines)
Game.Map.prototype.isAreaTiled = function (xStart, yStart, xEnd, yEnd, tile) {
  if (!this.checkX(xStart) || !this.checkX(xEnd) || !this.checkY(yStart) || !this.checkY(yEnd))
    return false

  if ((xStart > xEnd) || (yStart > yEnd))
    return false

  for (let x = xStart; x <= xEnd; x++)
    for (let y = yStart; y <= yEnd; y++)
      if (this.getTile(x, y) !== tile)
        return false

  return true
}

Game.Map.prototype.tileArea = function (xStart, yStart, xEnd, yEnd, tile) {
  if (!this.checkX(xStart) || !this.checkX(xEnd) || !this.checkY(yStart) || !this.checkY(yEnd))
    return false

  if ((xStart > xEnd) || (yStart > yEnd))
    return false

  for (let x = xStart; x <= xEnd; x++)
    for (let y = yStart; y <= yEnd; y++)
      this.grid[x][y] = tile
}

// Check if the tile is floor and unoccupied
Game.Map.prototype.isEmptyFloor = function (x, y) {
  return this.getTile(x, y).isWalkable && !this.area.getEntityAt(x, y)
}

// Get coordinates of a random unoccupied floor tile
Game.Map.prototype.getRandomFloorPosition = function () {
  let x, y
  do {
    x = Math.floor(Math.random() * this.width)
    y = Math.floor(Math.random() * this.height)
  } while (!this.isEmptyFloor(x, y))
  return {x: x, y: y}
}

// Map-changing abilities
// If the tile is breakable, update it to a floor
Game.Map.prototype.breakTile = function (x, y) {
  if (this.getTile(x, y).isBreakable)
    this.grid[x][y] = this.tileset.floor
}

Game.Map.prototype.isExplored = function (x, y) {
  return this.getTile(x, y) !== Game.Tile.nullTile
    ? this.explored[x][y] : false
}

Game.Map.prototype.setExplored = function (x, y, state) {
  if (this.getTile(x, y) !== Game.Tile.nullTile)
    this.explored[x][y] = state
}
