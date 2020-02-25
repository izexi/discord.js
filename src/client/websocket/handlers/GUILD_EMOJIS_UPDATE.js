'use strict';

/* eslint-disable consistent-return */
module.exports = function(data) {
  const { client } = this;
  const guild = client.guilds.get(data.guild_id);
  if (!guild || !guild.emojis) return;

  const deletions = new Map(guild.emojis);

  for (const emoji of data.emojis) {
    const cachedEmoji = guild.emojis.get(emoji.id);
    // Determine type of emoji event
    if (cachedEmoji) {
      deletions.delete(emoji.id);
      if (!cachedEmoji.equals(emoji)) {
        // Emoji updated
        return this.handle('GUILD_EMOJI_UPDATE', { cachedEmoji, emoji }, true);
      }
    } else {
      // Emoji added
      return this.handle('GUILD_EMOJI_CREATE', { guild, emoji }, true);
    }
  }


  for (const emoji of deletions.values()) {
    // Emoji deleted
    return this.handle('GUILD_EMOJI_DELETE', { guild, emoji }, true);
  }
};
