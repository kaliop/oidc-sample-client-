const
  crypto = require('crypto'),
  config = require('../config');

const { getIdToken } = require('../helpers/jwt');

const { formatUserInfo } = require('../helpers/formatters');

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

  // if user is already authenticated, check directly user consents
  if (req.session.user) {
    return checkUserConsent(req, res);
  }

  // redirect to  login form
  return res.redirect('/login');
};

const loginRedirect = (req, res) => {
  const memoryStorage = req.app.get('memoryStorage');

  if (!req.session.user) {
    console.error('missing user');
    return res.setStatus(500);
  }

  if (!req.session.oidc_query) {
    console.error('missing oidc query data');
    return res.setStatus(500);
  }

  try {
    const
      {client_id, nonce, scope} = req.session.oidc_query,
      code = crypto.randomBytes(20).toString('hex'),
      access_token = crypto.randomBytes(20).toString('hex'),
      id_token = getIdToken(req.session.user.sub, client_id, nonce);

    memoryStorage.save('tokens', access_token, formatUserInfo(req.session.user, scope));

    memoryStorage.save('codes', code, {
      client_id,
      access_token,
      id_token,
    });

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
  const memoryStorage = req.app.get('memoryStorage');

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

  try {
    const data = memoryStorage.find('codes', code);
    if (!data) {
      console.error('Code mismatch');
      return res.sendStatus(400);
    }
    if (data.client_id !== client_id) {
      console.error('Client ID mismatch');
      return res.sendStatus(400);
    }

    memoryStorage.delete('codes', code);

    return res.json({
      access_token: data.access_token,
      token_type: 'Bearer',
      id_token: data.id_token,
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

const checkUserConsent = (req, res) => {
  const { client_id, scope } = req.session.oidc_query;
  if (hasConsent(client_id, scope, req.cookies.consent )) {
    return loginRedirect(req, res);
  }

  return res.render('consent', {
    user: formatUserInfo(req.session.user, scope),
    redirect_uri: req.session.oidc_query.redirect_uri
  });
};

const hasConsent = (client_id, scope, consent) => {
  if (! consent) {
    return false;
  }

  if (! consent[client_id]) {
    return false;
  }

  for (const item of scope.split(' ')) {
    if (! consent[client_id][item]) {
      return false;
    }
  }

  return true;
}

const setUserConsent = (req, res) => {
  const { redirect_uri, client_id, state, scope } = req.session.oidc_query;

  const consentOK = (req.body.consent === 'YES');

  // No Consent => redirect to the client without authentication
  if (!consentOK) {
    let redirectUri = `${redirect_uri}?error=consent_required`;
    if (state) {
      redirectUri += `&state=${state}`;
    }
    return res.redirect(redirectUri);
  }

  const consent = req.cookies.consent || {};
  if (! consent[client_id]) {
    consent[client_id] = {};
  }
  for (const item of scope.split(' ')) {
    consent[client_id][item] = true;
  }
  res.cookie('consent', consent, {maxAge: 360000});

  return loginRedirect(req, res);
};

const userInfo = (req, res) => {
  const memoryStorage = req.app.get('memoryStorage');

  if (! req.token) {
    console.error('Unauthorized: missing access Token');
    return res.sendStatus(401);
  }

  const data = memoryStorage.find('tokens', req.token);

  if (! data) {
    console.error('Unauthorized: no matching accessToken found');
    return res.sendStatus(403);
  }

  return res.json(data);
};

module.exports = {
  userAuthorize,
  userToken,
  userInfo,
  checkUserConsent,
  setUserConsent,
}