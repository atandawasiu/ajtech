import app from "../artifacts/api-server/src/app";

/**
 * Vercel invokes this Express app from /api. Depending on the function
 * routing mode, the runtime can pass either the original /api path or the
 * path relative to the function. Normalize both forms before handing the
 * request to the existing /api router.
 */
export default function handler(
  req: Parameters<typeof app>[0],
  res: Parameters<typeof app>[1],
) {
  const requestUrl = req.url || "/";

  if (requestUrl === "/api/index") {
    req.url = "/api";
  } else if (!requestUrl.startsWith("/api")) {
    req.url = `/api${requestUrl === "/" ? "" : requestUrl}`;
  }

  return app(req, res);
}