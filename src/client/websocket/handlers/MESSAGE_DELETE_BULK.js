'use strict';

const Collection = require('../../../util/Collection');
const { WSEvents } = require('../../../util/Constants');


module.exports = function(data) {
  const channel = this.client.channels.get(data.channel_id);
  const handled = this.getHandled(`${WSEvents.MESSAGE_DELETE_BULK}_${data.channel_id}`);

  if (handled) {
    if (this.ws && handled.size > 0) return this.emit(handled);
    return handled;
  }

  if (channel) {
    const ids = data.ids;
    const messages = new Collection();
    for (const id of ids) {
      const message = this.getMessage({
        id,
        guild_id: data.guild_id,
      }, channel, false);
      if (message) {
        message.deleted = true;
        messages.set(message.id, message);
        channel.messages.delete(id);
      }
    }
    const handledKey = `${WSEvents.MESSAGE_DELETE_BULK}_${channel.id}`;
    this.handled.set(handledKey, messages);
    this.scheduleForDeletion(handledKey);
    /**
     * Emitted whenever messages are deleted in bulk.
     * @event Client#messageDeleteBulk
     * @param {Collection<Snowflake, Message>} messages The deleted messages, mapped by their ID
     */
    if (messages.size > 0) return this.emit(messages);
  }
  return null;
};
