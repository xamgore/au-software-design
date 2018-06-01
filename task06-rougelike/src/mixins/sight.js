// Sight mixin, to make the game more interesting
// A* is used for path searching between NPC and player
// but the maximum length of path is restricted by sight.
// For user this parameter means that he can see more blocks.
Game.Mixins.sight = {
  hasSight: true,
  init: function (template) {
    this.sightRadius = template['sightRadius'] || 5
  },

  increaseSightRadius: function (amount) {
    // if no amount passed default to 1
    amount = amount || 1
    this.sightRadius += amount
    Game.log('info', this, "Sight is increased")
  },

  getAreaSightRadius: function () {
    const area = this.area
    return this.sightRadius * area.sightRadiusMultiplier
  },

  canSee: function (entity) {
    // if not in the same area, then exit early
    if (!entity || this.area !== entity.area) {
      return false
    }

    const sightRadius = this.getAreaSightRadius()

    // if we're not in a square field of view, then we won't be in a real
    // field of view either (this is to save FOV computation if it's not needed)
    const squareX = (entity.x - this.x) * (entity.x - this.x)
    const squareY = (entity.y - this.y) * (entity.y - this.y)
    if ((squareX + squareY) > (sightRadius * sightRadius)) {
      return false
    }

    // compute the FOV and check if coordinates are within
    let found = false
    this.area.fov.compute(
      this.x, this.y,
      sightRadius,
      function (x, y, radius, visibility) {
        if (x === entity.x && y === entity.y) {
          found = true
        }
      })

    return found
  }
}
