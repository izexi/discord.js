'use strict';

module.exports = function({ guild, emoji }) {
  guild.emojis.delete(emoji.id);
  emoji.deleted = true;
  /**
   * Emitted whenever a custom emoji is deleted in a guild.
   * @event Client#emojiDelete
   * @param {GuildEmoji} emoji The emoji that was deleted
   */
  return this.emit(emoji);
};
