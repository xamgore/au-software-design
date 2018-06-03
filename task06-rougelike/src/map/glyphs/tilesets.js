// A set of tiles, that describes the current location
Game.Tileset = function (catalog) {
  const defaults = {
    floor: {
      description: 'A stone floor',
      character: ' ',
      foreground: '#777',
      background: '#000',
      isWalkable: true,
      isBreakable: false,
      passesLight: true
    },

    wall: {
      description: 'A stone wall',
      character: '▓',
      foreground: '#976',
      background: '#643',
      isWalkable: false,
      isBreakable: true,
      passesLight: false
    },

    ground: {
      description: "The ground",
      character: ' ',
      foreground: '#777',
      background: '#000',
      isWalkable: true,
      isBreakable: false,
      passesLight: true
    },

    terrain: {
      description: "Rough terrain",
      character: '^',
      foreground: '#777',
      background: '#000',
      isWalkable: false,
      isBreakable: false,
      passesLight: true
    },

    blocked: {
      description: 'A stone wall',
      character: '▓',
      foreground: '#222',
      background: '#333',
      isWalkable: false,
      isBreakable: false,
      passesLight: false
    },

    stairsUp: {
      description: 'A staircase leading upwards',
      character: '^\n^',
      foreground: '#ca6',
      isWalkable: true,
      isBreakable: false,
      passesLight: true
    },

    stairsDown: {
      description: 'A staircase leading downwards',
      character: 'v\nv',
      foreground: '#ca6',
      isWalkable: true,
      isBreakable: false,
      passesLight: true
    },

    corridor: {
      description: 'A stone floor',
      character: '.',
      foreground: '#777',
      isWalkable: true,
      isBreakable: false,
      passesLight: true
    },

    closedDoor: {
      description: 'A closed wooden door',
      character: '+',
      foreground: '#941',
      isWalkable: false,
      isBreakable: false,
      passesLight: false
    },

    openDoor: {
      description: 'An open wooden door',
      character: '/',
      foreground: '#941',
      isWalkable: true,
      isBreakable: false,
      passesLight: true
    },

    secretDoor: {
      description: 'A stone wall... or is it?',
      character: '#',
      foreground: '#976',
      background: '#643',
      isWalkable: false,
      isBreakable: true,
      passesLight: false
    },

    water: {
      description: 'Murky water',
      character: '≈',
      foreground: '#08c',
      isWalkable: false,
      isBreakable: false,
      passesLight: true
    }
  }

  catalog = applyDefaults(catalog, defaults)
  const templates = Object.keys(catalog)
  const len = templates.length

  for (let i = 0; i < len; i++) {
    let key = templates[i]
    catalog[key] = applyDefaults(catalog[key], defaults[key])
    this[key] = new Game.Tile(catalog[key])
  }

}


// A catalog of tilesets
Game.Tilesets = {
  cave: new Game.Tileset({}),

  tower: new Game.Tileset({
    floor: {character: ' ', foreground: '#755', background: '#000'},
    wall: {character: '▓', foreground: '#533', background: '#644', isBreakable: false},
    blocked: {character: '▓', foreground: '#533', background: '#644', isBreakable: false},
    stairsUp: {character: '<', foreground: '#577'},
    stairsDown: {character: '>', foreground: '#577'},
    corridor: {character: ',', foreground: '#755'},
    closedDoor: {character: '+', foreground: '#577'},
    openDoor: {character: '/', foreground: '#577'},
    secretDoor: {character: '#', foreground: '#533', background: '#644'},
    water: {character: '≈', foreground: '#800'}
  }),

  ice: new Game.Tileset({
    floor: {character: '.', foreground: '#BCE', background: '#549'},
    wall: {character: '#', foreground: '#BCE', background: '#87CEFA'},
    blocked: {character: '▓', foreground: '#549', background: '#033'},
    stairsUp: {character: '<', foreground: '#BCE', background: '#549'},
    stairsDown: {character: '>', foreground: '#BCE', background: '#549'},
    corridor: {character: '.', foreground: '#BCE', background: '#549'},
    closedDoor: {character: '+', foreground: '#789'},
    openDoor: {character: '/', foreground: '#789'},
    secretDoor: {character: '#', foreground: '#BCE', background: '#87CEFA'},
    water: {character: '-', foreground: '#87CEFA', background: '#549'}
  }),
}
