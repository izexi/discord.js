'use strict';

module.exports = function(data) {
  const guild = this.client.guilds.get(data.guild_id);
  const user = this.client.users.get(data.user.id);

  /**
   * Emitted whenever a member is banned from a guild.
   * @event Client#guildBanAdd
   * @param {Guild} guild The guild that the ban occurred in
   * @param {User} user The user that was banned
   */
  if (guild && user) this.emit(guild, user);
};
