// A mixin for the player, that has a logic about
// power ups and healing.
Game.Mixins.destructible = {
  isDestructible: true,

  init: function (template) {
    this.maxHP = template['maxHP'] || 10
    this.hp = template['hp'] || this.maxHP
    this.defense = template['baseDefenseValue'] || 0
  },

  listeners: {
    details: function () {
      return [
        {key: 'defense', value: this.getDefenseValue()},
        {key: 'hp', value: this.hp}
      ]
    },

    onGainLevel: function () {
      this.setHp(this.maxHP)
    }
  },

  setHp: function (hp) {
    this.hp = hp
  },

  increaseDefenseValue: function (amount) {
    // if no amount was passed, default to +1
    amount = amount || 1
    this.defense += amount
    Game.log('info', this, "increase defence")
  },

  increaseMaxHp: function (amount) {
    // if no amount was passed, default to +5
    amount = amount || 5
    // add to both current (hp) and maxHP
    this.maxHP += amount
    this.hp += amount
    Game.log('info', this, "increase maxhp")
  },

  getDefenseValue: function () {
    let modifier = 0
    if (this.canWearArmor || this.canWieldWeapons) {
      if (this.weapon && this.weapon.defenseValue) {
        modifier += this.weapon.defenseValue
      }
      if (this.armor && this.armor.defenseValue) {
        modifier += this.armor.defenseValue
      }
    }
    return this.defense + modifier
  },

  takeDamage: function (attacker, damageType, damageAmount) {
    if (!this.isDestructible)
      return

    this.hp -= damageAmount
    this.raiseEvent('onTakeDamage', damageAmount)

    if (this.hp <= 0) {
      Game.log('warning', attacker, "%s is killed", this.name)
      const message = String.format("player is killed by %s", attacker.name)
      this.raiseEvent('onDeath', attacker)
      attacker.raiseEvent('onKill', this)
      this.kill(message)
    }
  },

  getHpState: function () {
    if (!this.isDestructible) {
      return '%c{#0ff}Indestructible!'
    }

    const hpPct = (this.hp / this.maxHP) * 100

    let color
    if (hpPct <= 25) {
      color = '#f00'
    } else if (hpPct <= 50) {
      color = '#f80'
    } else if (hpPct <= 75) {
      color = '#ff0'
    } else {
      color = '#0a0'
    }

    return '%c{' + color + '}' + this.hp + '/' + this.maxHP + '%c{}'
  }
}
