'use strict';

module.exports = function(_, shard) {
  const replayed = shard.sequence - shard.closeSequence;
  /**
   * Emitted when a shard resumes successfully.
   * @event Client#shardResume
   * @param {number} id The shard ID that resumed
   * @param {number} replayedEvents The amount of replayed events
   */
  this.emit(shard.id, replayed);
};
