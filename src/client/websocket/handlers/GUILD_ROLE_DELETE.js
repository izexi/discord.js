'use strict';

const { WSEvents } = require('../../../util/Constants');

module.exports = function(data) {
  const guild = this.client.guilds.get(data.guild_id);

  if (guild) {
    const role = guild.roles.get(data.role_id);
    if (role) {
      guild.roles.remove(data.role_id);
      role.deleted = true;
      /**
       * Emitted whenever a guild role is deleted.
       * @event Client#roleDelete
       * @param {Role} role The role that was deleted
       */
      return this.emit(role);
    }
  }
  return this.getHandled(`${WSEvents.GUILD_ROLE_DELETE}_${data.role_id}`);
};
