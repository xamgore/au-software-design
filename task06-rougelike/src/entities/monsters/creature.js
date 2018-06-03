// A base class for NPC
Game.NPC = function (template) {
  const defaults = {
    name: "существо",
    description: "какой-то живой чудик",
    isHostile: true,
    speed: 5,
    movable: true,
    actor: true,
    destructible: {
      maxHP: 10,
      baseDefenseValue: 0
    },
    attacker: {
      baseAttackValue: 1
    },
    sight: {
      sightRadius: 5
    },
    corpseDropper: {
      corpseDropChance: 100
    }
  }

  template = applyDefaults(template, defaults)
  Game.Entity.call(this, template)

  if (template['behaviors'] && template['behaviors'] !== {}) {
    this.behaviors = template['behaviors']
  }
}

Game.NPC.extend(Game.Entity)
