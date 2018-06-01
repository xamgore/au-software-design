// Mixin allows the player to wear an armor
Game.Mixins.armorUser = {
  canWearArmor: true,
  init: function (template) {
    this.armor = template['startingArmor'] || null
  },
  wear: function (item) {
    this.armor = item
  },
  unwear: function () {
    this.armor = null
  }
}
