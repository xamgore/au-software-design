// Mixin for player, to catch messages from environment
Game.Mixins.messageRecipient = {
  isMessageRecipient: true,
  messages: [],

  init: function (template) {
    this.messages = []
  },

  receiveMessage: function (message) {
    if (!this.isMessageRecipient)
      return

    this.messages.push(message)
    if (this.messages.length > Game.msgScreenHeight) {
      this.messages.shift()
    }
  },

  clearMessages: function () {
    this.messages.length = 0
    this.messages = []
  }
}
