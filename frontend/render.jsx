import React from "https://jspm.dev/react@16.13.1";
import ReactDOMServer from "https://jspm.dev/react-dom@16.13.1/server";
import { verify } from "https://deno.land/x/djwt@v1.9/mod.ts";
import { App } from "./components/app.jsx";

// omg ssr
export default async function render(req) {
  let session = await getSession(req);
  let clientID = Deno.env.get("SLACK_CLIENT_ID");
  let redirect = Deno.env.get("SLACK_REDIRECT");
  let props = session ? session : { clientID, redirect };
  let body = ReactDOMServer.renderToString(<App {...props} />);
  return `<!DOCTYPE html>
<html>
<body>
<main>${body}</main>
</body>
</html>
`;
}

async function getSession(req) {
  let finder = (c) => c.split("=")[0] === "mysession";
  if (req.cookies && req.cookies.find(finder)) {
    let raw = req.cookies.find(finder);
    try {
      let jwt = raw.split("=")[1];
      let secret = Deno.env.get("APP_SECRET") || "secr3t";
      let payload = await verify(jwt, secret, "HS512");
      return payload;
    } catch (e) {
      console.log(e);
    }
  }
  return false;
}
