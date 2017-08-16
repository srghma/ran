import ApolloClient, { createNetworkInterface } from 'apollo-client'
import persist from './persist'

console.log(GRAPHQL_ENDPOINT)
const initNetworkInterface = token => {
  const networkInterface = createNetworkInterface({
    uri: GRAPHQL_ENDPOINT,
    opts: {
      credentials: 'same-origin'
    }
  })

  networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {}
        }
        (async () => {
          // eslint-disable-next-line no-param-reassign
          token = token || (await persist.willGetAccessToken())
          req.options.headers.authorization = token ? `Bearer ${token}` : null
          next()
        })()
      }
    }
  ])

  return networkInterface
}

let apolloClient = null

const createClient = (headers, token) =>
  new ApolloClient({
    ssrMode: !process.browser,
    ssrForceFetchDelay: 100,
    headers,
    networkInterface: initNetworkInterface(token)
  })

export default (headers, token) => {
  if (!process.browser) {
    return createClient(headers, token)
  }
  if (!apolloClient) {
    apolloClient = createClient(headers, token)
  }
  return apolloClient
}
