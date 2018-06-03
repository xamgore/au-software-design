// a glyph that handles mixins
Game.DynamicGlyph = function (template) {
  const defaults = {
    name: "thing",
    description: "",
    listeners: {} // event-listener pattern
  }

  template = applyDefaults(template, defaults)
  Game.Glyph.call(this, template)

  // take mixins and merge with defaults parameter
  const allMixins = Object.keys(Game.Mixins)
  const len = allMixins.length

  for (let idx = 0; idx < len; idx++) {
    const key = allMixins[idx]
    const mixin = Game.Mixins[key]

    if (template.hasOwnProperty(key) && (template[key] !== false)) {
      const mixinProps = Object.keys(mixin)

      for (let i = 0; i < mixinProps.length; i++) {
        const prop = mixinProps[i]

        if (prop !== 'init' && prop !== 'listeners' && !this.hasOwnProperty(prop))
          this[prop] = mixin[prop]
      }

      if (mixin.listeners) {
        const listenerEvents = Object.keys(mixin.listeners)
        const elen = listenerEvents.length

        for (let e = 0; e < elen; e++) {
          const event = listenerEvents[e]

          if (!this.listeners.hasOwnProperty(event))
            this.listeners[event] = []

          const listenerFunc = mixin.listeners[event]
          if (this.listeners[event].indexOf(listenerFunc) === -1)
            this.listeners[event].push(listenerFunc)
        }
      }

      if (mixin.init)
        mixin.init.call(this, template[key])

      delete this[key]
    }
  }

}

Game.DynamicGlyph.extend(Game.Glyph)


// used to alert "subscribed" listeners
Game.DynamicGlyph.prototype.raiseEvent = function (event) {
  if (!this.listeners[event])
    return

  const args = Array.prototype.slice.call(arguments, 1)

  const results = []
  for (let i = 0; i < this.listeners[event].length; i++)
    results.push(this.listeners[event][i].apply(this, args))

  return results
}


// Return capitalized name of the glyph
Game.DynamicGlyph.prototype.describe = function (capitalize) {
  let initial = this.name.charAt(0)

  if (capitalize)
    initial = initial.toUpperCase()

  return initial + this.name.slice(1)
}

// Return the glyph's name, prepended with the article a/an
Game.DynamicGlyph.prototype.describeA = function (capitalize) {
  const string = this.describe()
  const prefix = 'aeiou'.indexOf(string.charAt(0).toLowerCase()) >= 0 ? 1 : 0
  const prefixes = capitalize ? ['A', 'An'] : ['a', 'an']
  return prefixes[prefix] + ' ' + string
}
