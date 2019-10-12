const config = require('../config');

// local helper
const findClient = client_id => config.clients.find(item => item.client_id === client_id);

const userAuthorize = (req, res) => {
  // check the required parameters
  for (const field of ['scope', 'response_type', 'client_id', 'redirect_uri']) {
    if (!req.query[field]) {
      console.error(`missing "${field}" parameter`);
      return res.sendStatus(400);
    }
  }
  if (! req.query.scope.includes('openid')) {
    console.error('missing "openid" scope');
    return res.sendStatus(400);
  }
  if (req.query.response_type !== 'code') {
    console.error('only Authorization Code supported: response_type MUST be equal to "code"');
    return res.sendStatus(400);
  }

  // check client config:
  const client = findClient(req.query.client_id);
  if (! client) {
    console.error('Client ID not found');
    return res.sendStatus(400);
  }
  if (client.redirect_uri !== req.query.redirect_uri) {
    console.error('Mismatch redirect_uri');
    return res.sendStatus(400);
  }

  // store input request parameters into session to be used after authentification
  req.session.oidc_query = req.query;

  // redirect to  login form
  return res.redirect('/login');
};

module.exports = {
  userAuthorize,
}