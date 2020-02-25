'use strict';

const { Events, PartialTypes, WSEvents } = require('../../../util/Constants');
const isHandled = [
  WSEvents.CHANNEL_CREATE,
  WSEvents.CHANNEL_DELETE,
  WSEvents.CHANNEL_UPDATE,
  WSEvents.GUILD_DELETE,
  WSEvents.GUILD_UPDATE,
  WSEvents.GUILD_ROLE_CREATE,
  WSEvents.GUILD_ROLE_DELETE,
  WSEvents.GUILD_ROLE_UPDATE,
  WSEvents.MESSAGE_DELETE,
  // The custom d.js emoji events needs to be handled
  'GUILD_EMOJI_CREATE',
  'GUILD_EMOJI_DELETE',
  'GUILD_EMOJI_UPDATE',
];

class PacketHandler {
  constructor(client) {
    Object.defineProperty(this, 'client', { value: client });
    this.handled = new Map();
    this.handlers = Object.keys(WSEvents).reduce((handlers, event) => {
      this.load(event, handlers);
      return handlers;
    }, {});
    // Add custom d.js emoji events to the handlers
    this.load('GUILD_EMOJI_CREATE');
    this.load('GUILD_EMOJI_DELETE');
  }

  load(event, handlers = this.handlers) {
    try {
      handlers[event] = require(`./${event}.js`).bind(this);
    } catch (error) {
      this.client.emit(Events.DEBUG, `Failed to load handler for ${event}: ${error}\n${error.stack}`);
    }
    return handlers;
  }

  handle(event, data, shard, ws = false) {
    this.event = event;
    this.ws = ws;
    const handler = this.handlers[event];
    if (!handler) {
      return this.client.emit(Events.DEBUG, `Failed to find a handler for ${event}.`);
    }
    const bulkDelete = event === WSEvents.MESSAGE_DELETE_BULK;
    const handled = this.getHandled(`${this.event}_${bulkDelete ? data.channel_id : data.id}`);
    if (handled) {
      if (this.ws) {
        return bulkDelete && !handled.size ? null : this.emit(handled);
      }
      return handled;
    }
    return handler(data, shard);
  }

  emit(...args) {
    const clientEvent = Events[this.event];
    if (isHandled.includes(this.event)) {
      const handled = args[Number(this.event.endsWith('UPDATE'))];
      return this.setHandled(handled);
    }
    if (this.ws && this.client.listenerCount(clientEvent)) {
      this.client.emit(clientEvent, ...args);
    }
    return null;
  }

  scheduleForDeletion(id) {
    this.client.setTimeout(() => this.handled.delete(id), this.client.options.restWsBridgeTimeout);
  }

  setHandled(data) {
    const handledKey = `${this.event}_${this.event === WSEvents.MESSAGE_DELETE_BULK ? data.channel_id : data.id}`;
    this.handled.set(handledKey, data);
    this.scheduleForDeletion(handledKey);
    return data;
  }

  getHandled(handledKey) {
    const structure = this.handled.get(handledKey);
    if (structure) {
      this.handled.delete(handledKey);
      return structure;
    }
    return null;
  }

  getPayload(data, store, id, partialType, cache) {
    const existing = store.get(id);
    if (!existing && this.client.options.partials.includes(partialType)) {
      return store.load(data, cache);
    }
    return existing;
  }

  getChannel(data) {
    const id = data.channel_id || data.id;
    return data.channel || this.getPayload({
      id,
      guild_id: data.guild_id,
    }, this.client.channels, id, PartialTypes.CHANNEL);
  }

  getMessage(data, channel, cache) {
    const id = data.message_id || data.id;
    return data.message || this.getPayload({
      id,
      channel_id: channel.id,
      guild_id: data.guild_id || (channel.guild ? channel.guild.id : null),
    }, channel.messages, id, PartialTypes.MESSAGE, cache);
  }

  getReaction(data, message, user) {
    const id = data.emoji.id || decodeURIComponent(data.emoji.name);
    return this.getPayload({
      emoji: data.emoji,
      count: 0,
      me: user.id === this.client.user.id,
    }, message.reactions, id, PartialTypes.MESSAGE);
  }

  getMember(data, guild) {
    const id = data.user.id;
    return this.getPayload({
      user: {
        id,
      },
    }, guild.members, id, PartialTypes.GUILD_MEMBER);
  }

  getUser(data) {
    const id = data.user_id;
    return data.user || this.getPayload({ id }, this.client.users, id, PartialTypes.USER);
  }
}


module.exports = PacketHandler;
