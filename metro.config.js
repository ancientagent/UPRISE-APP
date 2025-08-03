const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg']
    },
    server: {
      port: 8081,
      enhanceMiddleware: (middleware, server) => {
        return (req, res, next) => {
          console.log(`[METRO] ${req.method} ${req.url}`);
          if (req.url.includes('bundle')) {
            console.log(`[METRO] Bundle request detected at ${new Date().toISOString()}`);
          }
          return middleware(req, res, next);
        };
      }
    },
    watchFolders: [],
    maxWorkers: 2,
    resetCache: true,
    cacheStores: [],
    reporter: {
      update: (event) => {
        if (event.type === 'bundle_build_done') {
          console.log(`[METRO] Bundle build completed at ${new Date().toISOString()}`);
        }
        if (event.type === 'bundle_build_failed') {
          console.error(`[METRO] Bundle build failed:`, event.error);
        }
      }
    }
  };
})();
