const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const BearerStrategy = require("passport-azure-ad").BearerStrategy;

const keys = require("../config/keys");
// const { User } = require("../models");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

// array to hold logged in users
var users = [];

var findByOid = function(oid, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    // console.log("=============we are using user: ======================", user);
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

const BearerStrategyOptions = {
  identityMetadata: keys.creds.identityMetadata,
  clientID: keys.creds.clientID,
  validateIssuer: keys.creds.validateIssuer,
  issuer: keys.creds.issuer,
  passReqToCallback: keys.creds.passReqToCallback,
  allowMultiAudiencesInToken: keys.creds.allowMultiAudiencesInToken,
  audience: keys.creds.audience
};

const OIDCStrategyOptions = {
  identityMetadata: keys.creds.identityMetadata,
  clientID: keys.creds.clientID,
  responseType: keys.creds.responseType,
  responseMode: keys.creds.responseMode,
  redirectUrl: keys.creds.redirectUrl,
  allowHttpForRedirectUrl: keys.creds.allowHttpForRedirectUrl,
  clientSecret: keys.creds.clientSecret,
  validateIssuer: keys.creds.validateIssuer,
  isB2C: keys.creds.isB2C,
  issuer: keys.creds.issuer,
  passReqToCallback: keys.creds.passReqToCallback,
  scope: keys.creds.scope,
  nonceLifetime: keys.creds.nonceLifetime,
  nonceMaxAmount: keys.creds.nonceMaxAmount,
  useCookieInsteadOfSession: keys.creds.useCookieInsteadOfSession,
  cookieEncryptionKeys: keys.creds.cookieEncryptionKeys,
  clockSkew: keys.creds.clockSkew
};

const passportVerification = passport => {
  passport.serializeUser(function(user, done) {
    done(null, user.oid);
  });

  passport.deserializeUser(function(oid, done) {
    findByOid(oid, function(err, user) {
      done(err, user);
    });
  });

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log("------jwt_payload--------", jwt_payload);
      const { email } = jwt_payload;
      User.findOne({
        where: {
          email
        }
      })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );

  passport.use(
    new OIDCStrategy(OIDCStrategyOptions, function(
      iss,
      sub,
      profile,
      accessToken,
      refreshToken,
      done
    ) {
      if (!profile.oid) {
        return done(new Error("No oid found"), null);
      }
      // asynchronous verification, for effect...
      process.nextTick(function() {
        findByOid(profile.oid, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile);
            // console.log("---------profile----------", profile)
            return done(null, profile);
          }
          // console.log("-----------user---------", user)
          return done(null, user);
        });
      });
    })
  );

  passport.use(
    new BearerStrategy(BearerStrategyOptions, function(token, done) {
      console.log("verifying the user");
      console.log(token, "was the token retreived");
      findByOid(token.oid, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          console.log(
            "User was added automatically as they were new. Their oid is: ",
            token.oid
          );
          users.push(token);
          owner = token.oid;
          return done(null, token);
        }
        owner = token.oid;
        return done(null, user, token);
      });
    })
  );
};

module.exports = passportVerification;
