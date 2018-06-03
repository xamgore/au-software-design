// Mixin for all kinds of aggressive NPCs
Game.Mixins.attacker = {
  isAttacker: true,

  init: function (template) {
    this.attackValue = template['baseAttackValue'] || 1

    this.isRangedAttacker = template['isRangedAttacker'] || false
    this.rangedAttackValue = template['rangedAttackValue'] || (this.isRangedAttacker ? 1 : 0)

    this.canThrowItems = template['canThrowItems'] || false
    this.thrownAttackValue = template['thrownAttackValue'] || (this.canThrowItems ? 1 : 0)
  },

  listeners: {
    details: function () {
      const results = []
      results.push({key: 'attack', value: this.getAttackValue()})

      if (this.isRangedAttacker) {
        results.push({key: 'ranged attack', value: this.getRangedAttackValue()})
      }
      if (this.canThrowItems) {
        results.push({key: 'thrown attack', value: this.getThrownAttackValue()})
      }
      return results
    }
  },

  getAttackValue: function () {
    let modifier = 0
    if (this.canWearArmor || this.canWieldWeapons) {
      if (this.weapon && this.weapon.attackValue) {
        modifier += this.weapon.attackValue
      }
      if (this.armor && this.armor.attackValue) {
        modifier += this.armor.attackValue
      }
    }
    return this.attackValue + modifier
  },

  getRangedAttackValue: function () {
    let modifier = 0
    if ((this.canWearArmor || this.canWieldWeapons) && this.isRangedAttacker) {
      if (this.weapon && this.weapon.rangedAttackValue) {
        modifier += this.weapon.rangedAttackValue
      }
      if (this.armor && this.armor.rangedAttackValue) {
        modifier += this.armor.rangedAttackValue
      }
    }
    return this.rangedAttackValue + modifier
  },

  getThrownAttackValue: function () {
    let modifier = 0
    if ((this.canWearArmor || this.canWieldWeapons) && this.canThrowItems) {
      if (this.weapon && this.weapon.thrownAttackValue) {
        modifier += this.weapon.thrownAttackValue
      }
      if (this.armor && this.armor.thrownAttackValue) {
        modifier += this.armor.thrownAttackValue
      }
    }
    return this.thrownAttackValue + modifier
  },

  increaseAttackValue: function (amount) {
    amount = amount || 1
    this.attackValue += amount
  },

  willAttack: function (target) {
    return this.isAttacker && !this.isHostile
  },

  attack: function (target) {
    if (!this.isAttacker) return
    if (target.isDestructible) {
      const attack = this.getAttackValue()
      const defense = target.getDefenseValue()
      const maxDmg = Math.max(0, attack - defense)
      const damage = 1 + Math.floor(Math.random() * maxDmg)

      Game.log('default', this, "Player hit %s, %s damage!", target.name, damage)
      Game.log('warning', target, "%s hit, %s damage!", this.name, damage)

      target.takeDamage(this, 'blunt', damage)
      this.raiseEvent('onDealDamage', damage)
    }
  }
}
