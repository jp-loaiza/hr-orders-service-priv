import fetch from 'node-fetch';
import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';
import {
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

const projectKey = process.env.CT_PROJECT_KEY ?? ''
const oauthHost = process.env.CT_OAUTH_HOST ?? ''
const host = process.env.CT_HOST ?? ''
const clientId = process.env.CT_CLIENT_ID ?? ''
const clientSecret = process.env.CT_CLIENT_SECRET ?? ''

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: oauthHost,
  projectKey: projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes: [`manage_orders:${projectKey}`, `view_payments:${projectKey}`, `view_products:${projectKey}`],
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host,
  fetch,
};

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient)
  .withProjectKey({ projectKey });

