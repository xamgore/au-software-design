// NPC with such mixin will leave a corpse after death
Game.Mixins.corpseDropper = {
  dropsCorpse: true,

  init: function (template) {
    this.corpseDropChance = template['corpseDropChance'] || 100
  },

  listeners: {
    onDeath: function (attacker) {
      if (!this.dropsCorpse) return
      if (ROT.RNG.getPercentage() > this.corpseDropChance) return

      const deadThing = this
      const corpse = Game.ItemFactory.create('corpse', {
        name: deadThing.name + ' corpse',
        foreground: deadThing.foreground
      })
      this.area.addItem(this.x, this.y, corpse)
    }
  }
}
