// item that can be stored in inventory
Game.Item = function (template) {
  const defaults = {
    name: "item",
    description: "unknown item"
  }

  template = applyDefaults(template, defaults)
  Game.DynamicGlyph.call(this, template)
}

Game.Item.extend(Game.DynamicGlyph)
