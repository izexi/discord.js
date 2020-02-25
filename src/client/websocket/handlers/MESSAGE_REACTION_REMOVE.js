'use strict';

module.exports = function(data) {
  if (!data.emoji) return;

  const user = this.getUser(data);
  if (!user) return;

  // Verify channel
  const channel = this.getChannel(data);
  if (!channel || channel.type === 'voice') return;

  // Verify message
  const message = this.getMessage(data, channel);
  if (!message) return;

  // Verify reaction
  const reaction = this.getReaction(data, message, user);
  if (!reaction) return;
  reaction._remove(user);
  /**
   * Emitted whenever a reaction is removed from a cached message.
   * @event Client#messageReactionRemove
   * @param {MessageReaction} messageReaction The reaction object
   * @param {User} user The user whose emoji or reaction emoji was removed
   */
  this.emit(reaction, user);
};
