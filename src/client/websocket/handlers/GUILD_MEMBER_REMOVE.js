'use strict';

const { Status } = require('../../util/Constants');

module.exports = function(data, shard) {
  const guild = this.client.guilds.get(data.guild_id);
  let member = null;
  if (guild) {
    member = this.getMember(data, guild);
    guild.memberCount--;
    guild.voiceStates.delete(data.user.id);
    if (member) {
      member.deleted = true;
      guild.members.remove(member.id);
      /**
       * Emitted whenever a member leaves a guild, or is kicked.
       * @event Client#guildMemberRemove
       * @param {GuildMember} member The member that has left/been kicked from the guild
       */
      if (shard.status === Status.READY) this.emit(member);
    }
  }
};
