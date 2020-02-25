'use strict';

module.exports = function(data) {
  const existing = this.client.channels.get(data.id);
  if (existing) return existing;
  const channel = this.client.channels.add(data);
  /**
   * Emitted whenever a channel is created.
   * @event Client#channelCreate
   * @param {DMChannel|GuildChannel} channel The channel that was created
   */
  return this.emit(channel);
};
