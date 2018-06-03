// a list of all known monsters
Game.Templates.Monsters = {
  fungus: {
    name: 'fungus',
    character: '*',
    foreground: '#91c736',
    destructible: {
      maxHP: 1,
      baseDefenseValue: 2
    },
    attacker: false,
    sight: false,
    corpseDropper: false,
    growthRemaining: 5,
    growPctChance: 1,
    speed: 1,
    behaviors: ['rapidGrowth']
  },

  bat: {
    name: 'bat',
    character: '><',
    foreground: '#431',
    destructible: {
      maxHP: 5
    },
    attacker: {
      baseAttackValue: 2
    },
    sight: false,
    speed: 10,
    behaviors: ['randomMoving']
  },

  butterfly: {
    name: 'butterfly',
    character: '}{',
    foreground: '#ff27ec',
    destructible: {
      maxHP: 3
    },
    attacker: {
      baseAttackValue: 1
    },
    sight: {
      sightRadius: 3
    },
    speed: 8,
    behaviors: ['randomMoving']
  },

  snake: {
    name: 'snake',
    character: 's',
    foreground: '#75dd12',
    destructible: {
      maxHP: 8,
      baseDefenseValue: 1
    },
    attacker: {
      baseAttackValue: 3
    },
    sight: {
      sightRadius: 5
    },
    speed: 7,
    behaviors: ['hunting', 'randomMoving']
  },

  giantZombie: {
    name: 'giantZombie',
    character: 'З',
    foreground: '#088',
    worldBoss: false,
    destructible: {
      maxHP: 30,
      baseDefenseValue: 2
    },
    attacker: {
      baseAttackValue: 5
    },
    sight: {
      sightRadius: 7
    },
    expLevel: 5,
    speed: 3,
    hasGrown: false,
    behaviors: ['growMoreArms', 'spawning', 'randomMoving']
  },

  slime: {
    name: 'slime',
    character: 'o',
    foreground: '#9f9',
    destructible: {
      maxHP: 5,
      baseDefenseValue: 2
    },
    attacker: {
      baseAttackValue: 5
    },
    sight: {
      sightRadius: 3
    },
    speed: 5,
    behaviors: ['hunting', 'randomMoving']
  }
}

Game.MonsterFactory = new Game.Factory('monsters', Game.NPC, Game.Templates.Monsters)
