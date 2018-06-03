const Game = {

  // definitions, from the screens/ folder
  Screen: {},

  // definitions, from the mixins/ folder
  Mixins: {},

  // definitions, from the enitities folder
  Templates: {
    Monsters: null,
    Items: null,
    Biomes: null
  },


  // layout displays, attached to markup
  displays: {title: null, main: null, msg: null, help: null, stats: null},
  currentScreens: {title: null, main: null, msg: null, help: null, stats: null},

  windowWidth: 1280,
  windowHeight: 768,
  playDivWidth: 800,
  statsDivWidth: 480,
  playDivHeight: 0,
  playScreenWidth: 60,
  playScreenHeight: 40,
  statsScreenWidth: 20,
  statsScreenHeight: 40,
  msgScreenWidth: 80,
  msgScreenHeight: 10,
  helpScreenWidth: 80,
  helpScreenHeight: 1,
  titleScreenWidth: 80,
  titleScreenHeight: 50,

  /** @type Player the current player character */
  player: null,

  /** @type World the generated world */
  currentWorld: null,

  gameOver: false,

  init: function () {
    this.calcInitDisplaySize()

    const game = this
    const bindEventToScreen = function (event) {
      window.addEventListener(event, function (e) {
        if (game.currentScreens.main !== null)
          game.currentScreens.main.handleInput(event, e)
        else if (game.currentScreens.title !== null)
          game.currentScreens.title.handleInput(event, e)
        e.stopPropagation()
      })
    }

    bindEventToScreen('keydown')
  },

  startNewGame: function () {
    this.player = new Game.Player(Game.HeroTemplates.default)
    const world = new Game.World()
    Game.currentWorld = world

    const playerStartRoom = world.currentArea.rooms[world.currentArea.rooms.length - 1]
    const playerStartX = (playerStartRoom.xStart + playerStartRoom.xEnd) >> 1
    const playerStartY = (playerStartRoom.yStart + playerStartRoom.yEnd) >> 1
    this.player.setLocation(playerStartX, playerStartY, world.currentArea)

    world.currentArea.engine.start()
  },

  setGameOver: function (gameLost) {
    this.gameOver = gameLost
  },

  refresh: function () {
    const displays = Object.keys(this.displays)
    for (let d = 0; d < displays.length; d++) {
      const dispkey = displays[d]

      if (this.displays[dispkey] !== null)
        this.displays[dispkey].clear()

      if (this.currentScreens[dispkey] !== null)
        this.currentScreens[dispkey].render(this.displays[dispkey])
    }
  },

  switchScreen: function (screen, display) {
    if (!display) display = 'main'

    if (this.currentScreens[display] !== null)
      this.currentScreens[display].exit()

    this.displays[display].clear()
    this.currentScreens[display] = screen
    if (!this.currentScreens[display] !== null) {
      this.currentScreens[display].enter(this.displays[display])
      this.refresh()
    }
  },

  calcInitDisplaySize: function () {
    let availSize, playWidth, playHeight

    this.windowWidth =
      (window.innerWidth < this.windowWidth) ? Math.floor(window.innerWidth * 0.9) : this.windowWidth
    this.windowHeight =
      (window.innerHeight < this.windowHeight) ? Math.floor(window.innerHeight * 0.9) : this.windowHeight

    this.statsDivWidth = Math.floor(this.windowWidth * (1 / 3))
    this.playDivWidth = this.windowWidth - this.statsDivWidth

    this.displays.main = new ROT.Display({forceSquareRatio: true, spacing: 1})
    this.displays.msg = new ROT.Display({forceSquareRatio: false})
    this.displays.help = new ROT.Display({forceSquareRatio: false})
    this.displays.stats = new ROT.Display({forceSquareRatio: false})
    this.displays.title = new ROT.Display({forceSquareRatio: false, spacing: 1})

    availSize = this.displays.main.computeSize(this.playDivWidth, this.windowHeight)

    playHeight = availSize[1] - this.msgScreenHeight - this.helpScreenHeight
    if (playHeight % 2 !== 0) playHeight -= 1

    playWidth = availSize[0]
    if (playWidth % 2 !== 0) playWidth -= 1

    this.playScreenWidth = playWidth
    this.playScreenHeight = playHeight
    this.displays.main.setOptions({width: this.playScreenWidth, height: this.playScreenHeight})

    availSize = this.displays.stats.computeSize(this.statsDivWidth, this.windowHeight)
    this.statsScreenWidth = availSize[0]
    this.statsScreenHeight =
      Math.min((availSize[1] - this.msgScreenHeight - this.helpScreenHeight), this.playScreenHeight)
    this.displays.stats.setOptions({width: this.statsScreenWidth, height: this.statsScreenHeight})

    availSize = this.displays.msg.computeSize(this.windowWidth, this.windowHeight)
    this.msgScreenWidth = availSize[0]
    this.displays.msg.setOptions({width: this.msgScreenWidth, height: this.msgScreenHeight})

    availSize = this.displays.help.computeSize(this.windowWidth, this.windowHeight)
    this.helpScreenWidth = availSize[0]
    this.displays.help.setOptions({width: this.helpScreenWidth, height: 1})

    availSize = this.displays.title.computeSize(this.windowWidth, this.windowHeight)
    this.titleScreenWidth = availSize[0]
    this.titleScreenHeight = availSize[1]
    this.displays.title.setOptions({width: this.titleScreenWidth, height: this.titleScreenHeight})
  },

  recalcDisplaySize: function () {
    if (!this.displays.main || this.displays.main === null) return

    let availSize, playWidth, playHeight
    availSize = this.displays.main.computeSize(this.playDivWidth, this.playDivHeight)  // returns [numCellsX, numCellsY]

    playHeight = availSize[1]
    if (playHeight % 2 !== 0) playHeight -= 1
    playWidth = availSize[0]
    if (playWidth % 2 !== 0) playWidth -= 1

    if (playWidth === this.playScreenWidth && playHeight === this.playScreenHeight) return false

    this.playScreenWidth = playWidth
    this.playScreenHeight = playHeight
    this.displays.main.setOptions({width: this.playScreenWidth, height: this.playScreenHeight})

    return true
  }
}
