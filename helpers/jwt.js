const
  njwt = require('njwt'),
  config = require('../config');

const getIdToken = (sub, client_id, nonce) => {
  const payload = {
    sub,
    nonce,
    iss: config.issuer,
    aud: client_id,
  };

  const jwt = njwt.create(payload, config.jwt.key, config.jwt.algo);
  jwt.setExpiration(Date.now() + config.jwt.ttl);

  return jwt.compact();
};

module.exports = {
  getIdToken,
};
