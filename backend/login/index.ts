import { create } from "https://deno.land/x/djwt@v1.9/mod.ts";
import { Response } from "https://deno.land/std@0.79.0/http/server.ts";
import { Cookie, setCookie } from "https://deno.land/std@0.79.0/http/cookie.ts";

interface Req {
  cookies: string[];
  queryStringParameters?: { code?: string };
}

interface Account {
  name: string;
  email: string;
  avatar: string;
}

export async function handler(req: Req) {
  // we only care if there is a code to work with
  let code = req!.queryStringParameters!.code;
  if (!code) {
    return {
      statusCode: 303,
      headers: { "location": "/?error=code_not_found" },
    };
  }

  try {
    // trade the code for an access_token
    let token = await getAccessToken(code);

    // trade the access token for the account info
    let account: Account = await getAccount(token);

    // encode account into jwt cookie response
    let cookie = await getCookie(account);
    return {
      statusCode: 303,
      headers: {
        "location": "/?success",
        "set-cookie": cookie,
      },
    };
  } catch (err) {
    return {
      statusCode: 303,
      headers: { "location": "/?error=" + err.message },
    };
  }
}

/** gets an access token for the given code */
async function getAccessToken(code: string) {
  let clientID = Deno.env.get("SLACK_CLIENT_ID");
  let secret = Deno.env.get("SLACK_CLIENT_SECRET");
  let url = "https://slack.com/api/oauth.v2.access";
  url += `?client_id=${clientID}&client_secret=${secret}&code=${code}`;
  let raw = await fetch(url);
  let token = await raw.json();
  if (token && token.ok) {
    return token.authed_user.access_token;
  } else {
    throw Error(token.error);
  }
}

/** get account info */
async function getAccount(token: string): Account {
  let url = "https://slack.com/api/users.identity";
  url += `?token=${token}`;
  let raw = await fetch(url);
  let res = await raw.json();
  if (res && res.ok) {
    return {
      name: res.user.name,
      email: res.user.email,
      avatar: res.user.image_72,
    };
  } else {
    throw Error(res.error);
  }
}

/** get a set-cookie string from an account payload */
async function getCookie(user: Account) {
  // encode the account into a jwt
  let secret = Deno.env.get("APP_SECRET") || "secr3t";
  let jwt = await create({ alg: "HS512", typ: "JWT" }, user, secret);
  // encode the jwt into a cookie
  let res: Response = {};
  let cookie: Cookie = { name: "mysession", value: jwt };
  setCookie(res, cookie);
  //@ts-ignore
  return res.headers.get("set-cookie");
}
