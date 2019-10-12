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

*checkout [step-04](https://github.com/kaliop/oidc-sample-provider/commit/764102de1df30a524380b74479d4b4f9ccd0bb90)*

* use a dummy key/value in-memory storage service (use it only for tutorial purpose !) to share some data between the user session and the Access Token Endpoint.
* generate a random "access_token" value and store it as key with UserInfo as value.
* generate a random "code" value and store it as key with {access_token, id_token} as value.

## Step 5: generate a valid ID Token

*checkout [step-05](https://github.com/kaliop/oidc-sample-provider/commit/483a6a731fd31e0192c6055726bf8968c2b93825)*

The ID Token must be a valid JWT that follows [OIDC ID Token specifications](https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation).
We use [nJwt](https://github.com/jwtk/njwt) library to generate it.

## Step 6: UserInfo Endpoint

*checkout [step-06](https://github.com/kaliop/oidc-sample-provider/commit/5db78081f019a4ab059041e7fb0a160bb155e545)*

Fetch the user info that are stored within the in-memory storage, related to the request's access_token header.

## Step 7: Consent form

*checkout [step-07](https://github.com/kaliop/oidc-sample-provider/commit/0b916119ee98a71003222899d8463cbd1984a132)*

## Step 8: update consents

*checkout [step-08](https://github.com/kaliop/oidc-sample-provider/commit/ea196750ff863173ce9d8a458c94d50fc78fa868)*

## Step 9: Logout propagation

*checkout [step-09](https://github.com/kaliop/oidc-sample-provider/commit/aed56286f3b4edda90db8869f1f484cf07a39d7d)*

Implement the logout propagation (see [RP-Initiated Logout](https://openid.net/specs/openid-connect-session-1_0.html#RPLogout)):

# Resources

* [Demo OpenID Connect identity client](https://github.com/kaliop/oidc-sample-client)
* [OpenID Connect Official Specifications](https://openid.net/specs/)
* [OpenID Connect Official Basic Guide](https://openid.net/specs/openid-connect-basic-1_0.html)
* [JSON Web Tokens](https://jwt.io/)
* [Unofficial documentation](https://developer.orange.com/tech_guide/openid-connect-1-0/)
* [List of certified OpenID Connect libraries](https://openid.net/developers/certified/)
