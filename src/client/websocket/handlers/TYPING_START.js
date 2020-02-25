'use strict';

module.exports = function(data) {
  const channel = this.client.channels.get(data.channel_id);
  const user = this.client.users.get(data.user_id);

  if (channel && user) {
  /**
   * Emitted whenever a user starts typing in a channel.
   * @event Client#typingStart
   * @param {Channel} channel The channel the user started typing in
   * @param {User} user The user that started typing
   */
    this.emit(channel, user);
  }
};
