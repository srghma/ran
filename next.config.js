const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { IgnorePlugin, DefinePlugin } = require('webpack')
const OfflinePlugin = require('offline-plugin')
const { getGraphQLProjectConfig } = require('graphql-config')

// make pretty-error handle all errors
var PrettyError = require('pretty-error')
var pe = new PrettyError()

// To render exceptions thrown in non-promies code:
process.on('uncaughtException', function(error) {
  console.log(pe.render(error))
})

// To render unhandled rejections created in BlueBird:
process.on('unhandledRejection', function(reason) {
  console.log('Unhandled rejection')
  console.log(pe.render(reason))
})

// helpers
function getGraphqlEndpoint() {
  const config = getGraphQLProjectConfig()
  const endpointsExt = config.endpointsExtension

  // get endpoint names (it will always have at least one item 'default')
  const endpointNames = Object.keys(endpointsExt.getRawEndpointsMap())

  const chosenEndpointName = process.env.NODE_ENV || 'development'
  if (!endpointNames.includes(chosenEndpointName)) {
    throw new Error(`Can't find endpoint name ${chosenEndpointName} in .graphqlconfig, \
      available endpoint names: ${endpointNames}`)
  }

  // TODO: fill envs, https://github.com/graphcool/graphql-config/blob/master/docs/README.md#graphqlendpointsextension
  const filledEnvs = {}
  let endpoint = endpointsExt.getEndpoint(chosenEndpointName, filledEnvs)

  if (typeof endpoint !== 'string') {
    endpoint = endpoint['url']
  }

  if (typeof endpoint !== 'string') {
    throw new Error(`Endpoint url ${endpoint} must be string`)
  }

  return endpoint
}

// TODO: use https://github.com/zeit/next.js/blob/v3-beta/examples/with-universal-configuration/env-config.js
module.exports = {
  webpack: (config, { dev }) => {
    const prod = !dev

    config.plugins.push(new IgnorePlugin(/^\.\/locale$/, /moment$/))

    config.plugins.push(
      new DefinePlugin({
        __GRAPHQL_ENDPOINT__: JSON.stringify(getGraphqlEndpoint())
      })
    )

    // FIXME: not fixing gql and graphql files, but fixing js files
    if (dev) {
      config.module.rules.push({
        test: /\.(jsx?|gql|graphql)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre',
        options: {
          fix: true
        }
      })
    }

    if (process.env.ANALYZE_BUILD) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true
        })
      )
    }

    if (prod && process.env.OFFLINE_SUPPORT) {
      config.plugins.push(
        new OfflinePlugin({
          publicPath: '/',
          relativePaths: false,
          externals: ['/', '/manifest.html'],
          excludes: ['.htaccess'],
          safeToUseOptionalCaches: true,
          caches: 'all',
          rewrites: function rewrites(asset) {
            if (
              asset.indexOf('.hot-update.js') > -1 ||
              asset.indexOf('build-stats.json') > -1 ||
              asset === 'BUILD_ID' ||
              asset.indexOf('dist/') === 0
            ) {
              return null
            }

            if (asset[0] === '/') {
              return asset
            }

            if (asset.indexOf('bundles/pages/') === 0) {
              return `/_next/-/${asset
                .replace('bundles/pages', 'page')
                .replace('index.js', '')
                .replace(/\.js$/, '')}`
            }

            return `/_next/-/${asset}`
          },
          autoUpdate: 1000 * 60 * 5,
          __tests: dev ? { ignoreRuntime: true } : {},
          ServiceWorker: {
            events: true,
            navigateFallbackURL: '/'
          },
          AppCache: {
            directory: './',
            events: true
          }
        })
      )
    }

    return config
  }
}
