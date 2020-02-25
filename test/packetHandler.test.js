'use strict';

/* eslint-disable no-undef, no-unused-expressions, no-unused-vars, prefer-arrow-callback, max-len */
const { Client, TextChannel, Message, User, Emoji, Guild, Role, MessageReaction, Constants: { Events } } = require('../src');
const { token } = require('./auth');
const client = new Client();
const assert = require('assert');
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
let testGuild, guild_id;

const mockWSEvent = (event, data) => {
  client.ws.handlePacket({
    t: event,
    d: data,
  });
};
const mockRESTCall = (event, data) => client.handler.handle(event, data);

chai.use(require('sinon-chai'));

before(async () => {
  client.login(token);
  await new Promise(resolve => client.on('ready', async () => {
    testGuild = await client.guilds.create('test');
    guild_id = testGuild.id;
    resolve();
  }));
});

describe('Client events', function() {
  describe('CHANNEL_CREATE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(channel => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(channel, 'channel was not returned in the event');
        assert(channel instanceof TextChannel, 'invalid channel was returned in the event');
        assert(client.channels.has(channel.id), 'channel was not added to the ChannelStore in the event');
      });
      client.on(Events.CHANNEL_CREATE, cb);
      const channel = await testGuild.channels.create('foo');
      assert(channel, 'channel was not returned from the handler');
      assert(channel instanceof TextChannel, 'invalid channel was returned from the handler');
      assert(client.channels.has(channel.id), 'channel was not added to the ChannelStore from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(channel => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(channel, 'channel was not returned in the event');
        assert(channel instanceof TextChannel, 'invalid channel was returned in the event');
        assert(client.channels.has(channel.id), 'channel was not added to the ChannelStore in the event');
      });
      client.on(Events.CHANNEL_CREATE, cb);
      mockWSEvent('CHANNEL_CREATE', {
        guild_id,
        type: 0,
        topic: null,
        rate_limit_per_user: 0,
        position: 7,
        permission_overwrites: [],
        parent_id: null,
        nsfw: false,
        name: 'bar',
        last_message_id: null,
        id: '667774584333926401',
      });
    });
  });

  describe('MESSAGE_CREATE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(message => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(message, 'message was not returned in the event');
        assert(message instanceof Message, 'invalid message was returned in the event');
        assert(message.channel.messages.has(message.id), 'message was not added to the MessageStore in the event');
      });
      client.on(Events.MESSAGE_CREATE, cb);
      const message = await testGuild.channels.find(c => c.name === 'foo').send('bar');
      assert(message, 'message was not returned from the handler');
      assert(message instanceof Message, 'invalid message was returned from the handler');
      assert(message.channel.messages.has(message.id), 'message was not added to the MessageStore from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(message => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(message, 'message was not returned in the event');
        assert(message instanceof Message, 'invalid message was returned in the event');
        assert(message.channel.messages.has(message.id), 'message was not added to the MessageStore in the event');
      });
      client.on(Events.MESSAGE_CREATE, cb);
      mockWSEvent('MESSAGE_CREATE', {
        guild_id,
        type: 0,
        tts: false,
        timestamp: '2020-01-17T17:18:51.790000+00:00',
        pinned: false,
        nonce: '667779885808222208',
        mentions: [],
        mention_roles: [],
        mention_everyone: false,
        member: {
          roles: [],
          mute: false,
          joined_at: '2020-01-15T00:06:13.086000+00:00',
          hoisted_role: null,
          deaf: false,
        },
        id: '667779886911324180',
        flags: 0,
        embeds: [],
        edited_timestamp: null,
        content: ':POGGERS:',
        channel_id: '667774584333926401',
        author: {
          username: 'Havoc',
          id: '191615925336670208',
          discriminator: '7078',
          avatar: 'a_dde53f5afa943f4a2628d47045ef92c3',
        },
        attachments: [],
      });
    });
  });

  describe('MESSAGE_REACTION_ADD', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(reaction => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(reaction, 'reaction was not returned in the event');
        assert(reaction instanceof MessageReaction, 'invalid reaction was returned in the event');
        assert(message.reactions.has(reaction.emoji.id || reaction.emoji.name), 'reaction was not added to the MessageReactionStore in the event');
      });
      client.on(Events.MESSAGE_REACTION_ADD, cb);
      const message = await testGuild.channels.find(c => c.name === 'foo').messages.fetch({ limit: 1 }).then(m => m.first());
      const reaction = await message.react('🤔');
      assert(reaction, 'reaction was not returned from the handler');
      assert(reaction instanceof MessageReaction, 'invalid message was returned from the handler');
      assert(message.reactions.has(reaction.emoji.id || reaction.emoji.name), 'reaction was not added to the MessageReactionStore from the event');
    });
    it('should handle the WS event', () => {
      const channel = testGuild.channels.find(c => c.name === 'foo');
      const cb = sinon.spy(reaction => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(reaction, 'reaction was not returned in the event');
        assert(reaction instanceof MessageReaction, 'invalid reaction was returned in the event');
        assert(channel.messages.get('667779886911324180').reactions.has(reaction.emoji.id || reaction.emoji.name), 'reaction was not added to the MessageReactionStore in the event');
      });
      client.on(Events.MESSAGE_REACTION_ADD, cb);
      mockWSEvent('MESSAGE_REACTION_ADD', {
        guild_id,
        user_id: client.user.id,
        channel_id: channel.id,
        message_id: '667779886911324180',
        emoji: {
          animated: false,
          name: '🤔',
          id: null,
        },
      });
    });
  });

  describe('MESSAGE_DELETE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(message => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(message, 'message was not returned in the event');
        assert(message instanceof Message, 'invalid message was returned in the event');
        assert(testChannel.messages.has(message.id) === false, 'message was not removed from the MessageStore in the event');
        assert(message.deleted, 'message was not marked as deleted in the event');
      });
      const testChannel = testGuild.channels.find(c => c.name === 'foo');
      client.on(Events.MESSAGE_DELETE, cb);
      const message = await testChannel.bulkDelete(1).then(m => m.first());
      assert(message, 'message was not returned from the handler');
      assert(message instanceof Message, 'invalid message was returned from the handler');
      assert(testChannel.messages.has(message.id) === false, 'message was not removed from the MessageStore from the handler');
      assert(message.deleted, 'messages were not marked as deleted from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(message => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(message, 'message was not returned in the event');
        assert(message instanceof Message, 'invalid message was returned in the event');
        assert(testChannel.messages.has(message.id) === false, 'message was not removed from the MessageStore in the event');
        assert(message.deleted, 'message was not marked as deleted in the event');
      });
      const testChannel = testGuild.channels.find(c => c.name === 'foo');
      client.on(Events.MESSAGE_DELETE, cb);
      mockWSEvent('MESSAGE_DELETE', {
        guild_id,
        id: '667779886911324180',
        channel_id: testChannel.id,
      });
    });
  });

  describe('CHANNEL_DELETE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(channel => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(channel, 'channel was not returned in the event');
        assert(channel instanceof TextChannel, 'invalid channel was returned in the event');
        assert(client.channels.has(channel.id) === false, 'channel was not removed from the ChannelStore in the event');
        assert(channel.deleted, 'channel was not marked as deleted in the event');
      });
      client.on(Events.CHANNEL_DELETE, cb);
      const channel = await testGuild.channels.find(c => c.name === 'foo').delete();
      assert(channel, 'channel was not returned from the handler');
      assert(channel instanceof TextChannel, 'invalid channel was returned from the handler');
      assert(client.channels.has(channel.id) === false, 'channel was not removed from the ChannelStore from the handler');
      assert(channel.deleted, 'channel was not marked as deleted from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(channel => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(channel, 'channel was not returned in the event');
        assert(channel instanceof TextChannel, 'invalid channel was returned in the event');
        assert(client.channels.has(channel.id) === false, 'channel was not removed from the ChannelStore in the event');
        assert(channel.messages.first().deleted, 'messages were not marked as deleted in the event');
        client.on(Events.CHANNEL_DELETE, cb);
        mockWSEvent('CHANNEL_DELETE', { id: '667774584333926401' });
      });
    });
  });

  /* Describe('USER_UPDATE', function() {
    it('should handle the REST call', async function() {
      const cb = sinon.spy((oldUser, newUser) => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(oldUser && newUser, 'users were not returned in the event');
        assert(oldUser instanceof User && newUser instanceof User, 'invalid users were returned in the event');
        assert(client.user.equals(newUser), 'updated user was not returned in the event');
        assert(oldClientUser.equals(oldUser), 'old user was not returned in the event');
      });
      client.on(Events.USER_UPDATE, cb);
      const oldClientUser = client.user._clone();
      // eslint-disable-next-line no-invalid-this
      const user = await client.user.setUsername(new Date().getTime());
      assert(user, 'user was not returned from the handler');
      assert(user instanceof User, 'invalid user was returned from the handler');
      assert(client.user.equals(user), 'updated user was not returned from the handler');
    });
  }); */

  describe('GUILD_EMOJI_CREATE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(emoji => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(emoji, 'emoji was not returned in the event');
        assert(emoji instanceof Emoji, 'invalid emoji was returned in the event');
        assert(testGuild.emojis.has(emoji.id), 'emoji was not added to the GuildEmojiStore in the event');
      });
      client.on(Events.GUILD_EMOJI_CREATE, cb);
      const emoji = await testGuild.emojis.create('https://cdn.discordapp.com/emojis/440658615880253440.png?v=1', 'POGGERS');
      assert(emoji, 'emoji was not returned from the handler');
      assert(emoji instanceof Emoji, 'invalid emoji was returned from the handler');
      assert(testGuild.emojis.has(emoji.id), 'emoji was not added to the ChannelStore from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(emoji => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(emoji, 'emoji was not returned in the event');
        assert(emoji instanceof Emoji, 'invalid emoji was returned in the event');
        assert(testGuild.emojis.has(emoji.id), 'emoji was not added to the GuildEmojiStore in the event');
      });
      mockWSEvent('GUILD_EMOJIS_UPDATE', {
        guild_id,
        emojis: testGuild.emojis.keyArray().map(id => ({ id })).concat({
          roles: [],
          require_colons: true,
          name: 'POGGERS',
          managed: false,
          id: '667817666605613072',
          available: true,
          animated: false,
        }),
      });
      client.on(Events.GUILD_EMOJI_CREATE, cb);
    });
  });

  describe('GUILD_EMOJI_DELETE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(emoji => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(emoji, 'emoji was not returned in the event');
        assert(emoji instanceof Emoji, 'invalid emoji was returned in the event');
        assert(testGuild.emojis.has(emoji.id) === false, 'emoji was not removed from the GuildEmojiStore in the event');
        assert(emoji.deleted, 'emoji was not marked as deleted in the event');
      });
      client.on(Events.GUILD_EMOJI_DELETE, cb);
      const emoji = await testGuild.emojis.find(e => e.name === 'POGGERS').delete();
      assert(emoji, 'emoji was not returned from the handler');
      assert(emoji instanceof Emoji, 'invalid emoji was returned from the handler');
      assert(testGuild.emojis.has(emoji.id) === false, 'emoji was not removed from the GuildEmojiStore from the handler');
      assert(emoji.deleted, 'emoji was not marked as deleted from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(emoji => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(emoji, 'emoji was not returned in the event');
        assert(emoji instanceof Emoji, 'invalid emoji was returned in the event');
        assert(testGuild.emojis.has(emoji.id) === false, 'emoji was not removed from the GuildEmojiStore in the event');
        assert(emoji.deleted, 'emoji was not marked as deleted in the event');
      });
      mockWSEvent('GUILD_EMOJIS_UPDATE', {
        guild_id,
        emojis: testGuild.emojis.keyArray()
          .map(id => ({ id })).filter(({ id }) => id === '667817666605613072'),
      });
      client.on(Events.GUILD_EMOJI_CREATE, cb);
    });
  });

  describe('GUILD_UPDATE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy((oldGuild, newGuild) => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(oldGuild && newGuild, 'guilds were not returned in the event');
        assert(oldGuild instanceof Guild && newGuild instanceof Guild, 'guilds users were returned in the event');
        assert(testGuild.equals(newGuild), 'updated guild was not returned in the event');
        assert(oldTestGuild.equals(oldGuild), 'old guild was not returned in the event');
      });
      const oldTestGuild = client.guilds.get(guild_id)._clone();
      client.on(Events.GUILD_UPDATE, cb);
      testGuild = await testGuild.setName('foo');
      assert(testGuild, 'guild was not returned from the handler');
      assert(testGuild instanceof Guild, 'invalid guild was returned from the handler');
      assert(testGuild.name === 'foo', 'updated guild was not returned from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy((oldGuild, newGuild) => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(oldGuild && newGuild, 'guilds were not returned in the event');
        assert(oldGuild instanceof Guild && newGuild instanceof Guild, 'invalid users were returned in the event');
        assert(testGuild.equals(newGuild), 'updated guild was not returned in the event');
        assert(oldTestGuild.equals(oldGuild), 'old guild was not returned in the event');
      });
      const oldTestGuild = client.guilds.get(guild_id)._clone();
      client.on(Events.GUILD_UPDATE, cb);
      mockWSEvent('GUILD_UPDATE', {
        id: guild_id,
        verification_level: 0,
        roles: [
          {
            position: 0,
            permissions: 104324673,
            name: '@everyone',
            mentionable: false,
            managed: false,
            id: guild_id,
            hoist: false,
            color: 0,
          },
        ],
        embed_channel_id: null,
        splash: null,
        afk_timeout: 300,
        vanity_url_code: null,
        icon: null,
        emojis: [],
        preferred_locale: 'en-US',
        region: 'europe',
        explicit_content_filter: 0,
        rules_channel_id: null,
        default_message_notifications: 0,
        name: 'bar',
        max_members: 250000,
        widget_enabled: false,
        description: null,
        embed_enabled: false,
        premium_subscription_count: 0,
        mfa_level: 0,
        afk_channel_id: null,
        max_presences: null,
      });
    });
  });

  describe('CHANNEL_UPDATE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy((oldChannel, newChannel) => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(oldChannel && newChannel, 'channels were not returned in the event');
        assert(oldChannel instanceof TextChannel && newChannel instanceof TextChannel, 'invalid channels were returned in the event');
        assert(oldTestChannel.equals(oldChannel), 'old channel was not returned in the event');
      });
      client.on(Events.CHANNEL_UPDATE, cb);
      const channel = testGuild.channels.filter(c => c.type === 'text').first();
      const oldTestChannel = channel._clone();
      const newTestChannel = await channel.setName('foo');
      assert(newTestChannel, 'channel was not returned from the handler');
      assert(newTestChannel instanceof TextChannel, 'invalid channel was returned from the handler');
      assert(newTestChannel.name === 'foo', 'updated channel was not returned from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy((oldChannel, newChannel) => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(oldChannel && newChannel, 'channels were not returned in the event');
        assert(oldChannel instanceof TextChannel && newChannel instanceof TextChannel, 'invalid channels were returned in the event');
        assert(oldTestChannel.equals(oldChannel), 'old channel was not returned in the event');
      });
      const oldTestChannel = testGuild.channels.filter(c => c.type === 'text').first()._clone();
      mockWSEvent('CHANNEL_UPDATE', {
        guild_id,
        id: testGuild.channels.filter(c => c.type === 'text').first(),
        type: 0,
        topic: '',
        rate_limit_per_user: 0,
        position: 0,
        permission_overwrites: [],
        parent_id: null,
        nsfw: false,
        name: 'bar',
        last_message_id: null,
      });
      client.on(Events.CHANNEL_UPDATE, cb);
    });
  });

  describe('GUILD_ROLE_CREATE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(role => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(role, 'role was not returned in the event');
        assert(role instanceof Role, 'invalid role was returned in the event');
        assert(testGuild.roles.has(role.id), 'role was not added to the RoleStore in the event');
      });
      client.on(Events.GUILD_ROLE_CREATE, cb);
      const role = await testGuild.roles.create('foo');
      assert(role, 'role was not returned from the handler');
      assert(role instanceof Role, 'invalid role was returned from the handler');
      assert(testGuild.roles.has(role.id), 'role was not added to the RoleStore from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(role => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(role, 'role was not returned in the event');
        assert(role instanceof Role, 'invalid role was returned in the event');
        assert(testGuild.roles.has(role.id), 'role was not added to the RoleStore in the event');
      });
      client.on(Events.GUILD_ROLE_CREATE, cb);
      mockWSEvent('GUILD_ROLE_CREATE', {
        guild_id,
        role: {
          position: 2,
          permissions: 104324673,
          name: 'new role',
          mentionable: false,
          managed: false,
          id: '123456789101112131',
          hoist: false,
          color: 0,
        },
      });
    });
  });

  describe('GUILD_ROLE_UPDATE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy((oldRole, newRole) => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(oldRole && newRole, 'roles were not returned in the event');
        assert(oldRole instanceof Role && newRole instanceof Role, 'invalid roles were returned in the event');
        assert(oldRole.name === oldTestRole.name, 'old role was not returned in the event');
        assert(newRole.name === 'foo', 'new role position was not updated in the event');
      });
      client.on(Events.GUILD_ROLE_UPDATE, cb);
      const role = testGuild.roles.find(r => r.name === 'new role');
      const oldTestRole = role._clone();
      const newTestRole = await role.setName('foo');
      assert(newTestRole, 'role were not returned from the handler');
      assert(newTestRole instanceof Role, 'invalid role were returned from the handler');
      assert(newTestRole.name === 'foo', 'new role position was not updated from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy((oldRole, newRole) => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(oldRole && newRole, 'roles were not returned in the event');
        assert(oldRole instanceof Role && newRole instanceof Role, 'invalid roles were returned in the event');
        assert(oldRole.name === 'new role', 'old role was not returned in the event');
        assert(newRole.name === 'bar', 'new role position was not updated in the event');
      });
      mockWSEvent('GUILD_ROLE_UPDATE', {
        guild_id,
        role: {
          position: 2,
          permissions: 104324673,
          name: 'bar',
          mentionable: false,
          managed: false,
          id: '123456789101112131',
          hoist: false,
          color: 0,
        },
      });
      client.on(Events.CHANNEL_UPDATE, cb);
    });
  });

  describe('GUILD_ROLE_DELETE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(role => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(role, 'role was not returned in the event');
        assert(role instanceof Role, 'invalid role was returned in the event');
        assert(testGuild.roles.has(role.id) === false, 'role was not removed from the RoleStore in the event');
        assert(role.deleted, 'role was not marked as deleted in the event');
      });
      client.on(Events.GUILD_ROLE_DELETE, cb);
      const role = await testGuild.roles.find(r => r.name === 'foo').delete();
      assert(role, 'role was not returned from the handler');
      assert(role instanceof Role, 'invalid role was returned from the handler');
      assert(testGuild.roles.has(role.id) === false, 'role was not removed from the RoleStore from the handler');
      assert(role.deleted, 'messages were not marked as deleted from the handler');
    });
    it('should handle the WS event', () => {
      const cb = sinon.spy(role => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(role, 'role was not returned in the event');
        assert(role instanceof Role, 'invalid role was returned in the event');
        assert(testGuild.roles.has(role.id) === false, 'role was not removed from the RoleStore in the event');
        assert(role.deleted, 'role was not marked as deleted in the event');
      });
      client.on(Events.GUILD_ROLE_DELETE, cb);
      mockWSEvent('GUILD_ROLE_DELETE', {
        guild_id,
        role_id: '123456789101112131',
      });
    });
  });
  describe('GUILD_DELETE', () => {
    it('should handle the REST call', async () => {
      const cb = sinon.spy(guild => {
        expect(cb, 'event was called more than once').to.have.been.calledOnce;
        assert(guild, 'guild was not returned in the event');
        assert(guild instanceof Guild, 'invalid role was returned in the event');
        assert(client.guilds.has(guild.id), 'guild was not removed from the GuildStore in the event');
        assert(guild.deleted, 'guild was not marked as deleted in the event');
      });
      client.on(Events.GUILD_DELETE, cb);
      const guild = await testGuild.delete();
      assert(guild, 'guild was not returned from the handler');
      assert(guild instanceof Guild, 'invalid guild was returned from the handler');
      assert(guild.deleted, 'guild were not marked as deleted from the handler');
    });
  });
});

afterEach(() => Object.values(Events).forEach(event => client.removeAllListeners(event)));
