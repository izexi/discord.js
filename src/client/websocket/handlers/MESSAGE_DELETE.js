'use strict';

const { WSEvents } = require('../../../util/Constants');

module.exports = function(data) {
  const channel = this.getChannel(data);
  if (channel) {
    const message = this.getMessage(data, channel);
    if (message) {
      channel.messages.delete(message.id);
      message.deleted = true;
      /**
       * Emitted whenever a message is deleted.
       * @event Client#messageDelete
       * @param {Message} message The deleted message
       */
      return this.emit(message);
    }
  }

  return this.getHandled(`${WSEvents.MESSAGE_DELETE}_${data.id}`);
};
