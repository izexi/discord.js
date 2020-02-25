'use strict';

const { Events } = require('../../../util/Constants');

module.exports = function(data) {
  let user = this.client.users.get(data.user.id);
  if (!user && data.user.username) user = this.client.users.add(data.user);
  if (!user) return;

  if (data.user && data.user.username) {
    if (!user.equals(data.user)) this.handle(Events.USER_UPDATE, data.user);
  }

  const guild = this.client.guilds.get(data.guild_id);
  if (!guild) return;

  let oldPresence = guild.presences.get(user.id);
  if (oldPresence) oldPresence = oldPresence._clone();
  let member = guild.members.get(user.id);
  if (!member && data.status !== 'offline') {
    member = guild.members.add({
      user,
      roles: data.roles,
      deaf: false,
      mute: false,
    });
    /**
     * Emitted whenever an uncached guild member becomes available.
     * @event Client#guildMemberAvailable
     * @param {GuildMember} member The guild member that became available
     */
    this.client.emit(Events.GUILD_MEMBER_AVAILABLE, member);
  }
  guild.presences.add(Object.assign(data, { guild }));
  if (member) {
    /**
     * Emitted whenever a guild member's presence (e.g. status, activity) is changed.
     * @event Client#presenceUpdate
     * @param {?Presence} oldPresence The presence before the update, if one at all
     * @param {Presence} newPresence The presence after the update
     */
    this.emit(oldPresence, member.presence);
  }
};
