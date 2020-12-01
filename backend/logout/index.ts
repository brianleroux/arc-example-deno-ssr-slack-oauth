import { Response } from "https://deno.land/std@0.79.0/http/server.ts";
import { deleteCookie } from "https://deno.land/std@0.79.0/http/cookie.ts";

/** expires the mysession cookie */
export async function handler() {
  let res: Response = {};
  deleteCookie(res, "mysession");
  let cookie = res.headers!.get("set-cookie");
  return {
    headers: {
      "set-cookie": cookie,
      "location": "/",
    },
    statusCode: 303,
  };
}
