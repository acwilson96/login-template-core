/**
 * Device.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const crypto = require('crypto');

module.exports = {

  attributes: {
    
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id: { type: 'string', columnName: '_id', autoIncrement: true},

    authToken: {
      type: 'string',
      required: true
    },

    ip: {
      type: 'string',
      required: true
    },

    userAgent: {
      type: 'string'
    },

    owner: {
      model: 'User'
    },

  },

  // Called before a Device model is created.
  beforeCreate: (values, cb) => {
    // Generate random token.
    crypto.randomBytes(256, (err, buf) => {
      if (err) { return cb(err); };
      values.token = buf.toString('hex');
      cb();
    });
  },

};

