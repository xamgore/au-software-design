// a simple cell on the display, with character
// and foreground + background colors
Game.Glyph = function (properties) {
  const defaults = {
    character: ' ',
    foreground: '#fff',
    background: ''
  }

  properties = applyDefaults(properties, defaults)

  const props = Object.keys(properties)
  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    if (!this.hasOwnProperty(prop))
      this[prop] = properties[prop]
  }
}

// get a colored symbol
Game.Glyph.prototype.getGlyph = function () {
  return "%c{" + this.foreground + "}%b{" + this.background + "}" + this.character + "%c{}%b{}"
}

// return the darkened color of the glyph
Game.Glyph.prototype.darken = function () {
  const fg = ROT.Color.fromString(this.foreground)
  const bg = ROT.Color.fromString(this.background)
  const dfg = ROT.Color.toHex(ROT.Color.interpolate(fg, [0, 0, 0]))
  const dbg = ROT.Color.toHex(ROT.Color.interpolate(bg, [0, 0, 0]))
  return {foreground: dfg, background: dbg}
}

// return the darkened color of the glyph
Game.Glyph.prototype.lighten = function () {
  const fg = ROT.Color.fromString(this.foreground)
  const bg = ROT.Color.fromString(this.background)
  const lfg = ROT.Color.toHex(ROT.Color.interpolate(fg, [255, 255, 255]))
  const lbg = ROT.Color.toHex(ROT.Color.interpolate(bg, [255, 255, 255]))
  return {foreground: lfg, background: lbg}
}
