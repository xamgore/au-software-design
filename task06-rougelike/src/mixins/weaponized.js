// Mixin allows the player to wear weapon
Game.Mixins.weaponUser = {
  canWieldWeapons: true,
  init: function (template) {
    this.weapon = template['startingWeapon'] || null
  },
  wield: function (item) {
    this.weapon = item
  },
  unwield: function () {
    this.weapon = null
  }
}
