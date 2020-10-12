'use strict';

const Base = require('./Base');

/**
 * Represents the template for a guild.
 * @extends {Base}
 */
class GuildTemplate extends Base {
  /**
   * @param {Client} client The instantiating client
   * @param {Object} data The raw data for the template
   */
  constructor(client, data) {
    super(client);
    this._patch(data);
  }

  /**
   * Builds or updates the template with the provided data.
   * @param {Object} data The raw data for the template
   * @returns {GuildTemplate}
   * @private
   */
  _patch(data) {
    /**
     * The unique code of this template
     * @type {string}
     */
    this.code = data.code;

    /**
     * The name of this template
     * @type {string}
     */
    this.name = data.name;

    /**
     * The description of this template
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The amount of times this template has been used
     * @type {number}
     */
    this.usage_count = data.usage_count;

    /**
     * The ID of the user that created this template
     * @type {string}
     */
    this.creatorID = data.creator_id;

    /**
     * The user that created this template
     * @type {User}
     */
    this.creator = this.client.users.add(data.creator);

    /**
     * The time of when this template was created at
     * @type {Date}
     */
    this.createdAt = new Date(data.created_at);

    /**
     * The time of when this template was last synced to the guild
     * @type {Date}
     */
    this.updatedAt = new Date(data.updated_at);

    /**
     * The ID of the guild that this template belongs to
     * @type {string}
     */
    this.guildID = data.source_guild_id;

    /**
     * The guild that this template belongs to
     * @type {Guild}
     */
    this.guild = this.client.guilds.add(data.serialized_source_guild, false);

    /**
     * Whether this template has unsynced changes
     * @type {?boolean}
     */
    this.unSynced = 'is_dirty' in data ? Boolean(data.is_dirty) : null;

    return this;
  }

  /**
   * The URL of this template
   * @type {string}
   * @readonly
   */
  get url() {
    return `${this.client.options.http.template}/${this.code}`;
  }

  /**
   * Updates the metadata on this template.
   * @param {string} [name=this.name] The name of this template
   * @param {?string} [description] The description of this template
   * @returns {Promise<GuildTemplate>}
   */
  // The name must be provided as of this commit's date, the default value can be removed after this has been changed
  // (https://github.com/discord/discord-api-docs/pull/2144#discussion_r502952362)
  edit(name = this.name, description) {
    return this.api
      .guilds(this.guildID)
      .templates(this.code)
      .patch({ data: { name, description } })
      .then(data => this._patch(data));
  }

  /**
   * Deletes this template.
   * @returns {Promise<GuildTemplate>}
   */
  delete() {
    return this.api
      .guilds(this.guildID)
      .templates(this.code)
      .delete()
      .then(() => this);
  }

  /**
   * Syncs this template to the current state of the guild.
   * @returns {Promise<GuildTemplate>}
   */
  sync() {
    return this.api
      .guilds(this.guildID)
      .templates(this.code)
      .put()
      .then(data => this._patch(data));
  }

  /**
   * When concatenated with a string, this automatically returns the templates's code instead of the template object.
   * @returns {string}
   * @example
   * // Logs: Template: FKvmczH2HyUf
   * console.log(`Template: ${guildTemplate}!`);
   */
  toString() {
    return this.code;
  }
}

module.exports = GuildTemplate;
