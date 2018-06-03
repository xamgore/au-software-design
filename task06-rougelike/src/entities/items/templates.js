// a list of all items
Game.Templates.Items = {
  corpse: {
    name: 'corpse',
    character: '…',
    noRandom: true
  },

  rock: {
    name: 'rock',
    character: '•',
    foreground: '#678',
    throwable: {
      thrownAttackValue: 1
    }
  },

  sword: {
    name: 'sword',
    character: '🗡',
    foreground: '#fff',
    equippable: {
      attackValue: 6,
      isWieldable: true
    }
  },

  bow: {
    name: 'bow',
    character: '⦄',
    foreground: "#940",
    equippable: {
      attackValue: 5,
      isWieldable: true
    }
  },

  shield: {
    name: 'shield',
    character: '🛡',
    foreground: '#999',
    equippable: {
      attackValue: 0,
      defenseValue: 2
    },
    noRandom: true
  },

  platearmor: {
    name: 'plate armor',
    character: 'Ѫ',
    foreground: "#aad",
    equippable: {
      defenseValue: 6,
      isWearable: true
    }
  },

  pumpkin: {
    name: 'pumpkin',
    character: 'ტ',
    foreground: "#f60",
    equippable: {
      defenseValue: 1,
      isWearable: true
    },
    throwable: {
      thrownAttackValue: 1
    }
  },
}

Game.ItemFactory = new Game.Factory('items', Game.Item, Game.Templates.Items)

