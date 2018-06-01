Game.log = function (msgType, recipient, message, subs) {
  let color
  if (msgType === 'danger') {
    color = "%c{#f00}[DANGER] "
  } else if (msgType === 'warning') {
    color = "%c{#ff0}[WARN] "
  } else if (msgType === 'info') {
    color = "%c{#6cf}[INFO] "
  } else if (msgType === 'minor') {
    color = "%c{#aaa}[MINOR] "
  } else {
    color = "%c{#fff}"
  }

  if (recipient.isMessageRecipient) {
    if (subs) {
      const submsg = Array.prototype.slice.call(arguments, 2)
      message = String.format.apply(this, submsg)
    }
    recipient.receiveMessage(color + message)
  }
}



