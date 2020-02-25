'use strict';

const DMChannel = require('../../../structures/DMChannel');
const { WSEvents } = require('../../../util/Constants');

module.exports = function(data) {
  let channel = this.client.channels.get(data.id);

  if (channel) {
    this.client.channels.remove(channel.id);
    channel.deleted = true;
    if (channel.messages && !(channel instanceof DMChannel)) {
      for (const message of channel.messages.values()) {
        message.deleted = true;
      }
    }
    /**
     * Emitted whenever a channel is deleted.
     * @event Client#channelDelete
     * @param {DMChannel|GuildChannel} channel The channel that was deleted
     */
    return this.emit(channel);
  }
  return this.getHandled(`${WSEvents.CHANNEL_DELETE}_${data.id}`);
};
