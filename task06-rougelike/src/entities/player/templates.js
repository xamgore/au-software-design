// player character template
Game.HeroTemplates = {
  default: {
    character: '🚹',
    foreground: '#fff',
    background: '#000',

    destructible: {
      maxHP: 20
    },

    attacker: {
      baseAttackValue: 3
    },

    sight: {
      sightRadius: 5
    },

    holdsInventory: {
      inventorySlots: 5
    }
  }
}
