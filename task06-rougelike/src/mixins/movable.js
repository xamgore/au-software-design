// Mixin for movable things, like doors or enemies
Game.Mixins.movable = {
  canMove: true,
  tryMove: function (x, y) {
    if (!this.canMove)
      return false

    const area = this.area
    const tile = area.map.getTile(x, y)
    const target = area.getEntityAt(x, y)

    if (target) {
      if (this.isAttacker && this.willAttack(target)) {
        this.attack(target)
        return true
      } else {
        return false
      }
    } else if (tile === area.map.tileset.closedDoor) {
      area.map.grid[x][y] = area.map.tileset.openDoor
      return true
    } else if (this === Game.player) {
      return !!this.move(x, y);
    } else if (tile.isWalkable) {
      this.setLocation(x, y)
      return true
    } else {
      return false
    }
  }
}
