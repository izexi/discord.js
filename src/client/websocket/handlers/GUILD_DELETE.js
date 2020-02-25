'use strict';

const { WSEvents } = require('../../../util/Constants');

/* eslint-disable consistent-return */
module.exports = function(data) {
  let guild = this.client.guilds.get(data.id);
  if (guild) {
    for (const channel of guild.channels.values()) {
      if (channel.type === 'text') channel.stopTyping(true);
    }

    if (guild.available && data.unavailable) {
      // Guild is unavailable
      guild.available = false;

      /**
       * Emitted whenever a guild becomes unavailable, likely due to a server outage.
       * @event Client#guildUnavailable
       * @param {Guild} guild The guild that has become unavailable
       */
      this.event = WSEvents.GUILD_UNAVAILABLE;
      this.emit(guild);

      // Stops the GuildDelete packet thinking a guild was actually deleted,
      // handles emitting of event itself
      return;
    }

    for (const channel of guild.channels.values()) this.client.channels.remove(channel.id);
    if (guild.voice && guild.voice.connection) guild.voice.connection.disconnect();

    // Delete guild
    this.client.guilds.remove(guild.id);
    guild.deleted = true;

    /**
     * Emitted whenever a guild kicks the client or the guild is deleted/left.
     * @event Client#guildDelete
     * @param {Guild} guild The guild that was deleted
     */
    return this.emit(guild);
  } else {
    return this.getHandled(`${WSEvents.GUILD_DELETE}_${data.id}`) || null;
  }
};
