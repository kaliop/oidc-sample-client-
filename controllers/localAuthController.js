const { authenticate } = require('../services/userManagerService');

const localLogin = async (req, res, next) => {
  try {
    const user = await authenticate(req.body.login, req.body.password);
    // Store the user in session so it is available for future requests
    req.session.user = user;

    // Redirect to client's loginCallback if we are in oidc context:
    if (req.session.oidc_query) {
      return res.redirect('/user/consent');
    }

    return res.redirect('/');
  } catch (error) {
    return next(error);
  }
};

const localLogout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

module.exports = {
  localLogin,
  localLogout
};
