// Mixin to give a behaviour for each NPC
Game.Behaviors = {

  randomMoving: function (owner) {
    if (!owner.canMove) {
      return false
    }
    const moveOffset = (Math.round(Math.random()) === 1) ? 1 : -1
    if (Math.round(Math.random()) === 1) {
      return owner.tryMove(owner.x + moveOffset, owner.y)
    } else {
      return owner.tryMove(owner.x, owner.y + moveOffset)
    }
  },

  // hunt after player, if he is near to npc
  hunting: function (owner) {
    const player = Game.player
    if (!(owner.hasSight && owner.canSee(player))) {
      return false
    }

    const offsets = Math.abs(player.x - owner.x) + Math.abs(player.y - owner.y)
    if (offsets === 1 && owner.isAttacker) {
      owner.attack(player)
      return true
    }

    const path = new ROT.Path.AStar(player.x, player.y, function (x, y) {
      const entity = owner.area.getEntityAt(x, y)
      return entity && entity !== player && entity !== owner
        ? false
        : owner.area.map.getTile(x, y).isWalkable
    }, {topology: 4})

    let count = 0
    let succeeded = false
    path.compute(owner.x, owner.y, function (x, y) {
      if (count === 1) succeeded = owner.tryMove(x, y)
      count++
    })

    return succeeded
  },

  // increase attack on a random chance
  growMoreArms: function (owner) {
    if (owner.hasGrown || (owner.hp / owner.maxHP) > 0.5)
      return false

    owner.hasGrown = true
    owner.increaseAttackValue(5)
    owner.hp += 10
    return true
  },

  // spawn more NPC's
  spawning: function (owner) {
    if (ROT.RNG.getPercentage() > 10) {
      return false
    }

    const area = owner.area

    const xOffset = Math.floor(Math.random() * 3) - 1
    const yOffset = Math.floor(Math.random() * 3) - 1

    const xTarget = xOffset + owner.x
    const yTarget = yOffset + owner.y

    if (!area.map.isEmptyFloor(xTarget, yTarget)) {
      return false
    }

    const slime = Game.MonsterFactory.create('slime')
    slime.setLocation(xTarget, yTarget, area)

    return true
  },

  // increase number of mushrooms
  rapidGrowth: function (owner) {
    const area = owner.area
    if (owner.growthRemaining <= 0 || ROT.RNG.getPercentage() > owner.growPctChance) {
      return false
    }

    const xOffset = Math.floor(Math.random() * 3) - 1
    const yOffset = Math.floor(Math.random() * 3) - 1

    if (xOffset === 0 && yOffset === 0)
      return false

    const xTarget = owner.x + xOffset
    const yTarget = owner.y + yOffset

    if (!area.map.isEmptyFloor(xTarget, yTarget))
      return false

    const newGrowth = Game.MonsterFactory.create(owner.name)
    newGrowth.setLocation(xTarget, yTarget, area)
    owner.growthRemaining--
    return true
  }
}

