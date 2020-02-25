'use strict';

module.exports = function(data) {
  const channel = this.client.channels.get(data.channel_id);
  if (channel) {
    const existing = channel.messages.get(data.id);
    if (existing) return existing;
    const message = channel.messages.add(data);
    const user = message.author;
    let member = message.member;
    channel.lastMessageID = data.id;
    if (user) {
      user.lastMessageID = data.id;
      user.lastMessageChannelID = channel.id;
    }
    if (member) {
      member.lastMessageID = data.id;
      member.lastMessageChannelID = channel.id;
    }

    /**
     * Emitted whenever a message is created.
     * @event Client#message
     * @param {Message} message The created message
     */
    this.emit(message);
    return message;
  }
  return null;
};
