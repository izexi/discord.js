'use strict';

module.exports = function(data) {
  const channel = this.client.channels.get(data.channel_id);
  /**
   * Emitted whenever a guild text channel has its webhooks changed.
   * @event Client#webhookUpdate
   * @param {TextChannel} channel The channel that had a webhook update
   */
  if (channel) this.emit(channel);
};
