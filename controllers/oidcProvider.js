const
  crypto = require('crypto'),
  config = require('../config');

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

  // if user is already authenticated, redirect directly to client's redirect_uri
  if (req.session.user) {
    return loginRedirect(req, res);
  }

  // redirect to  login form
  return res.redirect('/login');
};

const loginRedirect = (req, res) => {
  if (!req.session.user) {
    console.error('missing user');
    return res.setStatus(500);
  }

  if (!req.session.oidc_query) {
    console.error('missing oidc query data');
    return res.setStatus(500);
  }

  try {
    const code = crypto.randomBytes(20).toString('hex');

    let redirectUri = `${req.session.oidc_query.redirect_uri}?code=${code}`;
    if (req.session.oidc_query.state) {
      redirectUri += `&state=${req.session.oidc_query.state}`;
    }

    return res.redirect(redirectUri);

  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

const userToken = (req, res) => {
  console.log('USER TOKEN', req.body);

  // check the required parameters
  for (const field of ['client_id', 'client_secret', 'code']) {
    if (!req.body[field]) {
      console.error(`missing "${field}" parameter`);
      return res.sendStatus(400);
    }
  }

  // check client config:
  const
    {client_id, client_secret, code} = req.body,
    client = findClient(client_id);
  if (! client) {
    console.error('Client ID not found');
    return res.sendStatus(400);
  }
  if (client_secret !== client.client_secret) {
    console.error('Client Secret mismatch');
    return res.sendStatus(400);
  }

  const tokenData = {}; //@TODO: populate with idToken and AccessToken

  return res.json(tokenData);
};


module.exports = {
  userAuthorize,
  loginRedirect,
  userToken,
}