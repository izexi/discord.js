'use strict';

let ClientUser;

module.exports = function(data, shard) {
  const { client } = this;
  if (client.user) {
    client.user._patch(data.user);
  } else {
    if (!ClientUser) ClientUser = require('../../../structures/ClientUser');
    const clientUser = new ClientUser(client, data.user);
    client.user = clientUser;
    client.users.set(clientUser.id, clientUser);
  }

  for (const guild of data.guilds) {
    guild.shardID = shard.id;
    client.guilds.add(guild);
  }

  shard.checkReady();
};
