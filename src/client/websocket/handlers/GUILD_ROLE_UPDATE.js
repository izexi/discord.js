'use strict';

module.exports = function(data) {
  const guild = this.client.guilds.get(data.guild_id);

  if (guild) {
    if (data.roles) {
      for (const partialRole of data.roles) {
        const role = guild.roles.get(partialRole.id);
        if (role) role.rawPosition = partialRole.position;
      }
      return guild;
    }

    const role = guild.roles.get(data.role.id);
    if (role) {
      const old = role._update(data.role);
      /**
       * Emitted whenever a guild role is updated.
       * @event Client#roleUpdate
       * @param {Role} oldRole The role before the update
       * @param {Role} newRole The role after the update
       */
      this.emit(old, role);
      return role;
    }
  }
  return null;
};
