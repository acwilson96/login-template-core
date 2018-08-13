/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  let authToken;
  // Parse request for Device/User authToken.
  if (req.isSocket) {
    authToken = req.body[0];
  } else {
    authToken = req.param('authToken');
  }
  if (authToken === null || authToken === undefined) {
    return res.forbidden('You are not permitted to perform this action.');
  }

  /* TESTING */

  console.log('\n\n\n\n\n\n');

  User.find().populateAll().exec((err, users) => {
    if (err) {
      console.log('Error Finding Users');
    }
    users.forEach((user) => {
      console.log('\n\n\n\nSession Auth Users');
      console.log(user);
      console.log('\n\n' + user.username + ' devices:');
      console.log(user.devices);
    });
  });


  Device.find().exec((err, devs) => {
    if (err) {
      console.log('Error Finding Devices');
    }
    console.log('\n\nSession Auth Devices');
    console.log(devs);
  });

  /* TESTING */

  // Check the request is authenticted.
  Device.findOne({
    authToken: authToken
  }).exec((err, validDevice) => {
    if (err) { return res.serverError(err); }
    // If the device exists and is authenticated, find the User.
    if (validDevice !== undefined) {
      User.findOne({
        id: validDevice.owner
      }).populateAll().exec((err, deviceOwner) => {
        if (err) { return res.serverError(err); }
        req.options.user = deviceOwner;
        Device.update(
          { authToken: authToken },
          { lastUsed:  Math.round(+new Date()/1000) }
        )
        .fetch()
        .exec((err) => {
          if (err) {
            console.log('Error Updating lastUsed of Device');
          }
          else {
            return next();
          }
        });
      });
    } else {
      return res.forbidden('You are not permitted to perform this action.');
    }
  });

};
