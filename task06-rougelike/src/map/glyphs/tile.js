// Glyph with an interesting characteristics
Game.Tile = function (properties) {
  const defaults = {
    description: '',
    isWalkable: false,
    isBreakable: false,
    passesLight: false
  }

  properties = applyDefaults(properties, defaults)
  Game.Glyph.call(this, properties)
}

Game.Tile.extend(Game.Glyph)


// Empty title
Game.Tile.nullTile = new Game.Tile({description: '(unknown)'})
