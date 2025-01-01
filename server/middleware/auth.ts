export default defineEventHandler((event) => {
  const config = useRuntimeConfig();

  // Skip auth for development environment
  if (process.dev) {
    return;
  }

  const apiKey = event.node.req.headers['x-api-key'];

  if (!apiKey || apiKey !== config.apiKey) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
});
