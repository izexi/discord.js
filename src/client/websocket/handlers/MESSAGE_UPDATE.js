'use strict';

module.exports = function(data) {
  const channel = this.getChannel(data);
  if (channel) {
    const message = this.getMessage(data, channel);
    if (message) {
      message.patch(data);
      this.emit(message._edits[0], message);
    }
  }
};
