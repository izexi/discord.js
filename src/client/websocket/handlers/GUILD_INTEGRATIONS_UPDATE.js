'use strict';

module.exports = function(data) {
  const guild = this.client.guilds.get(data.guild_id);
  /**
   * Emitted whenever a guild integration is updated
   * @event Client#guildIntegrationsUpdate
   * @param {Guild} guild The guild whose integrations were updated
   */
  if (guild) this.emit(guild);
};
