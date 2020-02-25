'use strict';

module.exports = function({ guild, emoji }) {
  const existing = guild.emojis.get(emoji.id);
  if (existing) return existing;
  const createdEmoji = guild.emojis.add(emoji);
  /**
   * Emitted whenever a custom emoji is created in a guild.
   * @event Client#emojiCreate
   * @param {GuildEmoji} emoji The emoji that was created
   */
  return this.emit(createdEmoji);
};
