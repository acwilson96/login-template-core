/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id: { type: 'string', columnName: '_id', autoIncrement: true },

    username: {
      type: 'string',
      required: true,
      unique: true,
    },

    password: {
      type: 'string',
      required: true,
    },

    // A list of Devices this User is authenticated on.
    devices: {
      collection: 'Device',
      via: 'owner'
    }

  },

  customToJSON: () => {
    // Return a shallow copy of this record with the password removed.
    return _.omit(this, ['password']);
  },

  // Called before a User model is created, will hash the password; returns error if hashing fails.
  beforeCreate: (valuesToSet, proceed) => {
    // Hash password
    bcrypt.hash(valuesToSet.password, 10, (err, hash) => {
      if (err) { return cb(err); }
      valuesToSet.password = hash;
      return proceed();
    });
  },

  // After a User's credentials have been updated, de-auth all their devices.
  afterUpdate: (updatedRecord, cb) => {
    Device.destroy({ owner: updatedRecord.id }).exec(cb);
  },

  // Events to trigger when a User is destroyed.
  afterDestroy: (destroyedRecords, cb) => {
    var userID = _.pluck(destroyedRecords, 'id');
    // Destroy all this Users data. 
    Device.destroy({ owner: userID }).exec(cb);
  },

};

