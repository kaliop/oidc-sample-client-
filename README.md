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
