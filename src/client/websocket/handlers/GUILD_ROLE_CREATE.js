'use strict';

module.exports = function(data) {
  const guild = this.client.guilds.get(data.guild_id);
  if (guild) {
    const existing = guild.roles.get(data.role.id);
    if (!existing) {
      const role = guild.roles.add(data.role);
      /**
       * Emitted whenever a role is created.
       * @event Client#roleCreate
       * @param {Role} role The role that was created
       */
      return this.emit(role);
    }
    return existing;
  }
  return null;
};
