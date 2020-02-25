'use strict';

const { Status } = require('../../../util/Constants');

module.exports = function(data, shard) {
  const guild = this.client.guilds.get(data.guild_id);
  if (guild) {
    guild.memberCount++;
    const member = guild.members.add(data);
    if (shard.status === Status.READY) {
    /**
     * Emitted whenever a user joins a guild.
     * @event Client#guildMemberAdd
     * @param {GuildMember} member The member that has joined a guild
     */
      this.emit(member);
    }
  }
};
