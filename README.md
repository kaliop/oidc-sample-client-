# oidc-sample-provider
Demo OpenID Connect identity provider in NodeJS (tutorial mode)

# Tutoral

## Requirements

NodeJS >= 8.16

## Init

Clone the sources:
```bash
git clone https://github.com/kaliop/oidc-sample-provider.git && cd oidc-sample-provider
```

Fetch the `start` tag to get the boostrap:
```bash
git checkout start
```

Install main depencencies:
```bash
npm install
```

Start the application:
```bash
npm start
```

Go to http://localhost:4000

## Step 1: init userAuthorize endpoint

*checkout [step-01](https://github.com/kaliop/oidc-sample-provider/commit/2b6bc99dd6f934a077b55a7dab843da887bf61b9)*

Check if all the [required request parameters](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) are present with good values:

* `response_type`: must be equal to "code".

* `scope`: specifies which user data the service requires. <br>
[Space delimited list of keywords](https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims) ('openid', 'profile', 'email', 'address', 'phone'). At least "openid" is required. The other are optional.

* `client_id`: must be found in the knwon allowed clients list (see [default config file](./config.js))

* `redirect_uri`: must match the configured redirect_uri for the client.

## Step 2: Redirect to loginCallback

*checkout [step-02](https://github.com/kaliop/oidc-sample-provider/commit/63c1966ec2ec7b4af8d08a77e116af041e8c9f4e)*

Generate a callback redirection with following parameters, according to [specifications](https://openid.net/specs/openid-connect-core-1_0.html#AuthResponse):

* `code`: random value
* `state`: value of `state` parameter from input request, if present.

## Step 3: init Token Endpoint

*checkout [step-03](https://github.com/kaliop/oidc-sample-provider/commit/d5e06f35cd40819f95bde9d8ab36f9359b30d812)*

Initiate the [Token Endpoint](https://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint):
* check the mandatory parameters
* return a JSON object

## Step 4: Token Endpoint - validate code and return token data

*checkout [step-04](https://github.com/kaliop/oidc-sample-provider/commit/fa8ba4a2dc496ac34bb85346b18a05c12c188508)*

* use a dummy key/value in-memory storage service (use it only for tutorial purpose !) to share some data between the user session and the Access Token Endpoint.
* generate a random "access_token" value and store it as key with UserInfo as value.
* generate a random "code" value and store it as key with {access_token, id_token} as value.

## Step 5: generate a valid ID Token

*checkout [step-05](https://github.com/kaliop/oidc-sample-provider/commit/707000a7d4f0f3f3b73d50461ab4a51c984dfa4f)*

The ID Token must be a valid JWT that follows [OIDC ID Token specifications](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation).
We use [nJwt](https://github.com/jwtk/njwt) library to generate it.

## Step 6: UserInfo Endpoint

*checkout [step-06](https://github.com/kaliop/oidc-sample-provider/commit/378e25bbd832a358f7d43b989a1c4f16e122c4a7)*

Fetch the user info that are stored within the in-memory storage, related to the request's access_token header.

## Step 7: Consent form

*checkout [step-07](https://github.com/kaliop/oidc-sample-provider/commit/e0577fee0e610c8a791494d43171dab77653cf8f)*

## Step 8: update consents

*checkout [step-08](https://github.com/kaliop/oidc-sample-provider/commit/ffb9b84914122780f4c6ac8239c0043be8378b46)*

## Step 9: Logout propagation

*checkout [step-09](https://github.com/kaliop/oidc-sample-provider/commit/a6fbc237055504bfc65d49c40f4d09fc8a506fb1)*

Implement the logout propagation (see [RP-Initiated Logout](https://openid.net/specs/openid-connect-session-1_0.html#RPLogout)):
