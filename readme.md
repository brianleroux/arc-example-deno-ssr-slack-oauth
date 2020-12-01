# arc-example-deno-ssr-slack-oauth

Implementing `Sign in with Slack` oAuth flow with Deno, React and Architect.

- Deno for the backend logic and React SSR
- Architect for local dev sandbox and deployment to AWS
- Slack API for the identity and auth

## Setup

Run `npm i` and create `.env` with the following values:

- `SLACK_CLIENT_ID`
- `SLACK_CLIENT_SECRET`
- `SLACK_REDIRECT`

Start the local sandbox by running `npm start`.

## Implementation notes

Infra as Code (IaC) is implemented in `package.json` under the `architect` key. Equiv `app.arc` file would read:

```
@app
myapp

@http
# create session
/login 
  method get
  src backend/login

# destroy session
/logout 
  method any
  src backend/logout

# ssr handler
/* 
  method any
  src frontend
```
