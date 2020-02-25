'use strict';

module.exports = function(data) {
  const newUser = this.client.users.get(data.id);
  const oldUser = newUser._update(data);

  if (!oldUser.equals(newUser)) {
    /**
     * Emitted whenever a user's details (e.g. username) are changed.
     * @event Client#userUpdate
     * @param {User} oldUser The user before the update
     * @param {User} newUser The user after the update
     */
    this.emit(oldUser, newUser);
    return newUser;
  }
  return newUser;
};
