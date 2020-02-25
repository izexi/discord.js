'use strict';

const { Status } = require('../../util/Constants');

module.exports = function(data, shard) {
  const guild = this.guilds.get(data.guild_id);
  if (guild) {
    const member = guild.members.get(data.user.id);
    if (member) {
      const old = member._update(data);
      if (shard.status === Status.READY) {
        /**
         * Emitted whenever a guild member changes - i.e. new role, removed role, nickname.
         * @event Client#guildMemberUpdate
         * @param {GuildMember} oldMember The member before the update
         * @param {GuildMember} newMember The member after the update
         */
        this.emit(old, member);
      }
    }
  }
};
