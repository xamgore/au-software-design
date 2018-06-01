// weapon item, with which the player can attack / defence with it
Game.Weapon = function (template) {
  template = template || {}
  Game.Item.call(this, template)

  this.name = template['name'] || "weapon"
  this.description = template['description'] || " this is a weapon"
  this.wearable = template['wearable'] || false
  this.wieldable = template['wieldable'] || true
  this.isWeapon = template['isWeapon'] || true
  this.isArmor = template['isArmor'] || false
  this.stackLimit = template['stackLimit'] || 1
  this.durability = template['durability'] || 10
  this.attackTypes = template['attackTypes'] || {
    bash: {
      chance: 100,
      atkRange: {min: 1, max: 1},
      atkSpeed: 5,
      dmgType: 'blunt',
      dmgAmount: {n: 1, d: 3},
      modSTR: 0,
      modMove: 0
    }
  }
}

Game.Weapon.extend(Game.Item)
