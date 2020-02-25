'use strict';

module.exports = function(data) {
  // Verify channel
  const channel = this.getChannel(data);
  if (!channel || channel.type === 'voice') return;

  // Verify message
  const message = this.getMessage(data, channel);
  if (!message) return;

  message.reactions.clear();
  this.emit(message);
};
