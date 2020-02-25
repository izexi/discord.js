'use strict';

module.exports = function(data) {
  const guild = this.client.guilds.get(data.id);
  if (guild) {
    const old = guild._update(data);
    /**
     * Emitted whenever a guild is updated - e.g. name change.
     * @event Client#guildUpdate
     * @param {Guild} oldGuild The guild before the update
     * @param {Guild} newGuild The guild after the update
     */
    this.emit(old, guild);
    return guild;
  }
  return null;
};
