// Allows an item to be equiped in the inventory
Game.Mixins.equippable = {
  isEquippable: true,

  init: function (template) {
    this.attackValue = template['attackValue'] || 0
    this.rangedAttackValue = template['rangedAttackValue'] || 0
    this.defenseValue = template['defenseValue'] || 0
    this.isWieldable = template['isWieldable'] || false
    this.isWearable = template['isWearable'] || false
  },

  listeners: {
    details: function () {
      const results = []
      if (this.attackValue)
        results.push({key: 'attack', value: this.attackValue})
      if (this.rangedAttackValue)
        results.push({key: 'ranged', value: this.rangedAttackValue})
      if (this.defenseValue)
        results.push({key: 'defense', value: this.defenseValue})
      return results
    }
  }
}
