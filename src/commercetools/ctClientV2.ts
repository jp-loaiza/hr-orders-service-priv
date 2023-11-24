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
const ctScopes = process.env.CT_SCOPE ? process.env.CT_SCOPE.split(',') : []
const DEBUG = process.env.DEBUG === 'true' ?? false


// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: oauthHost,
  projectKey: projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes: ctScopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host,
  fetch,
};

// Export the ClientBuilder
const ctpClientBuilder = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)

if (DEBUG) {
  ctpClientBuilder.withLoggerMiddleware()
}

export const ctpClient = ctpClientBuilder.build()

export const apiRoot = createApiBuilderFromCtpClient(ctpClient)
  .withProjectKey({ projectKey });

