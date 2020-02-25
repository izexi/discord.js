'use strict';

module.exports = function(data) {
  const channel = this.client.channels.get(data.channel_id);
  const time = new Date(data.last_pin_timestamp);

  if (channel && time) {
    // Discord sends null for last_pin_timestamp if the last pinned message was removed
    channel.lastPinTimestamp = time.getTime() || null;

    /**
     * Emitted whenever the pins of a channel are updated. Due to the nature of the WebSocket event,
     * not much information can be provided easily here - you need to manually check the pins yourself.
     * @event Client#channelPinsUpdate
     * @param {DMChannel|TextChannel} channel The channel that the pins update occurred in
     * @param {Date} time The time of the pins update
     */
    this.emit(channel, time);
  }
  return null;
};
