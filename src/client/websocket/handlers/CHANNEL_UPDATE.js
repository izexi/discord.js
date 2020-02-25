'use strict';

const { ChannelTypes } = require('../../../util/Constants');
const Channel = require('../../../structures/Channel');

module.exports = function(data) {
  const { client } = this;
  let updated = client.channels.get(data.id);

  if (updated) {
    const old = updated._update(data);

    if (ChannelTypes[updated.type.toUpperCase()] !== data.type) {
      const newChannel = Channel.create(client, data, updated.guild);
      for (const [id, message] of updated.messages) newChannel.messages.set(id, message);
      newChannel._typing = new Map(updated._typing);
      updated = newChannel;
      client.channels.set(updated.id, updated);
    }

    const guild = client.guilds.get(data.guild_id);
    if (guild && data.channels) {
      for (const partialChannel of data.channels) {
        const channel = guild.channels.get(partialChannel.id);
        if (channel) channel.rawPosition = partialChannel.position;
      }
      return guild;
    }

    if (old && updated) {
      /**
       * Emitted whenever a channel is updated - e.g. name change, topic change, channel type change.
       * @event Client#channelUpdate
       * @param {DMChannel|GuildChannel} oldChannel The channel before the update
       * @param {DMChannel|GuildChannel} newChannel The channel after the update
       */
      this.emit(old, updated);
    }
    return updated;
  }
  return null;
};

