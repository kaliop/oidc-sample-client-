/**
 * Entry point of the service provider(FS) demo app.
 */
const
  express = require('express'),
  bearerToken = require('express-bearer-token'),
  session = require('express-session'),
  sessionstore = require('sessionstore'),
  bodyParser = require('body-parser');

const {
  localLogin,
  localLogout
} = require('./controllers/localAuthController');

const {
  userAuthorize,
  loginRedirect,
  userToken,
  userInfo,
} = require('./controllers/oidcProvider');

const memoryStorage = require('./services/memoryStorage');

const app = express();

// parse request headers and add the bearer token into `res.token` if present:
app.use(bearerToken());

// Note this enable to store user session in memory
// As a consequence, restarting the node process will wipe all sessions data
app.use(session({
  store: sessionstore.createSessionStore(),
  name: 'oidc_provider_session',
  secret: 'demo secret',
  cookie: {},
  saveUninitialized: true,
  resave: true,
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.set('memoryStorage', memoryStorage);

app.get('/', (req, res) => res.render('home', {
  user: req.session.user
}));

app.get('/login', (req, res) => res.render('login'));
app.post('/login', localLogin);

app.get('/logout', localLogout);

/**** OIDC End points ****/
app.get('/user/authorize', userAuthorize);
app.get('/user/loginRedirect', loginRedirect);
app.post('/user/token', userToken);
app.get('/api/user', userInfo);

/**** END OIDC End points ****/

// Setting app port
const port = process.env.PORT || '4000';

// Starting server
const server = app.listen(port, () => {
  console.log(`\x1b[32mServer listening on http://localhost:${port}\x1b[0m`);
});
