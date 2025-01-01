import { H3Event } from "h3";

export async function validateBookingAccess(event: H3Event): Promise<void> {
  const nuxtConfig = useRuntimeConfig();

  // Skip validation in development
  if (process.dev) {
    return;
  }

  const apiToken = event.node.req.headers["token"];

  if (!apiToken) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized - Missing API token",
    });
  }

  try {
    // Verify API token
    if (apiToken !== nuxtConfig.token) {
      throw new Error("Invalid API token");
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: "Invalid API token",
    });
  }
}
