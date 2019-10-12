module.exports = {
  issuer: `${process.env.ISSUER || 'http://localhost:4000'}`,
  clients: [
    {
      client_id: '09a1a257648c1742c74d6a3d84b31943',
      client_secret: '7ae4fef2aab63fb78d777fe657b7536f',
      redirect_uri: 'http://localhost:3000/login-callback',
      redirect_logout_uri: 'http://localhost:3000/logout-callback',
    },
  ],
};
