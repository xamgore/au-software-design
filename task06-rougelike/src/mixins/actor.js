// Mixin for a simple AI.
// just goes through a list of behaviours
// and executes each of them
Game.Mixins.actor = {
  isActor: true,
  act: function () {
    if (!this.isActor) {
      return false
    }

    if (this.behaviors && (this.behaviors !== [])) {
      for (let i = 0; i < this.behaviors.length; i++) {
        const behavior = this.behaviors[i]
        const success = Game.Behaviors[behavior](this)
        if (success) return true
      }
    }

    return false
  }
}
