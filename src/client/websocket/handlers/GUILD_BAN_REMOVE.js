'use strict';

module.exports = function(data) {
  const guild = this.client.guilds.get(data.guild_id);
  const user = this.client.users.add(data.user);
  /**
   * Emitted whenever a member is unbanned from a guild.
   * @event Client#guildBanRemove
   * @param {Guild} guild The guild that the unban occurred in
   * @param {User} user The user that was unbanned
   */
  if (guild && user) this.emit(guild, user);
};
