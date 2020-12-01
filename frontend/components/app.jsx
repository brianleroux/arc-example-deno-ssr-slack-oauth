// @deno-types="../types/react.d.ts"
import React from "https://jspm.dev/react@16.13.1";

export function App(props) {
  return props.avatar? <Protected {...props} /> : <Unprotected {...props} />;
}

function Protected(props) {
  return <div>
    <h1>hello</h1>
    <p>Behold the protec ssr. <a href="/logout">Logout</a></p>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>;
}

function Unprotected({ clientID, redirect }) {
  let scopes = "identity.basic,identity.email,identity.team,identity.avatar";
  let base = "https://slack.com/oauth/v2/authorize";
  let url =
    `${base}?user_scope=${scopes}&client_id=${clientID}&redirect_uri=${redirect}`;
  return <div>
    <a href={url}>
      <img
        alt="Sign in with Slack"
        height="40"
        width="172"
        src="https://platform.slack-edge.com/img/sign_in_with_slack.png"
        srcSet="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x"
      />
    </a>
  </div>;
}
