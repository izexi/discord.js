'use strict';

module.exports = function({ cachedEmoji: newEmoji, emoji }) {
  const oldEmoji = newEmoji._update(emoji);
  /**
   * Emitted whenever a custom emoji is updated in a guild.
   * @event Client#emojiUpdate
   * @param {GuildEmoji} oldEmoji The old emoji
   * @param {GuildEmoji} newEmoji The new emoji
   */
  this.emit(oldEmoji, newEmoji);
  return newEmoji;
};
