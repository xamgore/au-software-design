// An abstract factory pattern, to create concrete factories.
// Check out items/item.js and npc/monsters.js
Game.Factory = function (name, constructor, collection) {
  this._name = name
  this._templates = {}
  this._randomTemplates = {}
  this._constructor = constructor

  if (!collection) return

  const coll = Object.keys(collection)
  for (let k = 0; k < coll.length; k++) {
    const template = coll[k]
    this._templates[template] = collection[template]
    if (!collection[template]['noRandom'])
      this._randomTemplates[template] = collection[template]
  }
}

// add a new named template
Game.Factory.prototype.define = function (name, template) {
  this._templates[name] = template
  if (!template['noRandom']) {
    this._randomTemplates[name] = template
  }
}

// create an object based on a template
Game.Factory.prototype.create = function (name, extraProperties) {
  if (!this._templates[name]) {
    throw new Error("No template named '" + name + "' in factory '" + this._name + "'")
  }

  let template
  if (extraProperties) {
    template = copyWithChanges(this._templates[name], extraProperties)
  } else {
    template = this._templates[name]
  }

  return new this._constructor(template)
}

// create an object based on a random template
Game.Factory.prototype.createRandom = function randObj() {
  let templates = Object.keys(this._randomTemplates)
  templates = templates.randomize()
  const obj = templates.random()
  return this.create(obj)
}
