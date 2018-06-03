// Mixin to give a level up on a good attack
Game.Mixins.experienceGainer = {
  gainsExperience: true,

  init: function (template) {
    this.expLevel = template['expLevel'] || 1
    this.experience = template['experience'] || 0
    this.statPointsPerLevel = template['statPointsPerLevel'] || 1
    this.statPoints = 0
    this.statOptions = []

    if (this.isAttacker)
      this.statOptions.push(['Attack value', this.increaseAttackValue])

    if (this.isDestructible) {
      this.statOptions.push(['Defense value', this.increaseDefenseValue])
      this.statOptions.push(['Max health', this.increaseMaxHp])
    }

    if (this.hasSight)
      this.statOptions.push(['Sight radius', this.increaseSightRadius])
  },

  listeners: {
    details: function () {
      return [{key: 'level', value: this.expLevel}]
    },

    onKill: function (victim) {
      let exp = victim.maxHP + victim.getDefenseValue()

      if (victim.isAttacker)
        exp += victim.getAttackValue()
      if (victim.gainsExperience)
        exp -= (this.expLevel - victim.expLevel) * 3
      if (exp > 0)
        this.giveExperience(exp)
    },

    onGainLevel: function () {
      if (this === Game.player) {
        Game.Screen.levelUp.setup(this)
        Game.Screen.playScreen.setSubScreen(Game.Screen.levelUp)
      } else {
        while (this.statPoints > 0) {
          const statOption = this.statOptions.random()
          statOption[1].call(this)
          this.statPoints -= 1
        }
      }
    }
  },

  getNextLevelExperience: function () {
    return (this.expLevel * this.expLevel) * 10
  },

  giveExperience: function (points) {
    let statPointsGained = 0
    let levelsGained = 0

    while (points > 0) {
      if (this.experience + points >= this.getNextLevelExperience()) {
        const usedPoints = this.getNextLevelExperience() - this.experience
        points -= usedPoints
        this.experience += usedPoints

        this.expLevel++
        levelsGained++
        this.statPoints += this.statPointsPerLevel
        statPointsGained += this.statPointsPerLevel
      } else {
        this.experience += points
        points = 0
      }
    }

    if (levelsGained > 0) {
      Game.log('info', this, "level up")
      this.raiseEvent('onGainLevel')
    }

  }
}

