"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "proxy";
exports.ids = ["proxy"];
exports.modules = {

/***/ "(middleware)/../../node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb%5Csrc%5Cproxy.ts&page=%2Fproxy&rootDir=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb&matchers=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb%5Csrc%5Cproxy.ts&page=%2Fproxy&rootDir=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb&matchers=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   handler: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_dist_build_adapter_setup_node_env_external__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/build/adapter/setup-node-env.external */ \"next/dist/build/adapter/setup-node-env.external\");\n/* harmony import */ var next_dist_build_adapter_setup_node_env_external__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_build_adapter_setup_node_env_external__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/web/globals */ \"(middleware)/../../node_modules/next/dist/server/web/globals.js\");\n/* harmony import */ var next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/web/adapter */ \"(middleware)/../../node_modules/next/dist/server/web/adapter.js\");\n/* harmony import */ var next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/lib/incremental-cache */ \"(middleware)/../../node_modules/next/dist/server/lib/incremental-cache/index.js\");\n/* harmony import */ var next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _src_proxy_ts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./src/proxy.ts */ \"(middleware)/./src/proxy.ts\");\n/* harmony import */ var next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/client/components/is-next-router-error */ \"(middleware)/../../node_modules/next/dist/client/components/is-next-router-error.js\");\n/* harmony import */ var next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(middleware)/../../node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\nconst incrementalCacheHandler = null\n// Import the userland code.\n;\n\n\n\nconst mod = {\n    ..._src_proxy_ts__WEBPACK_IMPORTED_MODULE_4__\n};\nconst page = \"/proxy\";\nconst isProxy = page === '/proxy' || page === '/src/proxy';\nconst handlerUserland = (isProxy ? mod.proxy : mod.middleware) || mod.default;\nclass ProxyMissingExportError extends Error {\n    constructor(message){\n        super(message);\n        // Stack isn't useful here, remove it considering it spams logs during development.\n        this.stack = '';\n    }\n}\n// TODO: This spams logs during development. Find a better way to handle this.\n// Removing this will spam \"fn is not a function\" logs which is worse.\nif (typeof handlerUserland !== 'function') {\n    throw new ProxyMissingExportError(`The ${isProxy ? 'Proxy' : 'Middleware'} file \"${page}\" must export a function named \\`${isProxy ? 'proxy' : 'middleware'}\\` or a default function.`);\n}\n// Proxy will only sent out the FetchEvent to next server,\n// so load instrumentation module here and track the error inside proxy module.\nfunction errorHandledHandler(fn) {\n    return async (...args)=>{\n        try {\n            return await fn(...args);\n        } catch (err) {\n            // In development, error the navigation API usage in runtime,\n            // since it's not allowed to be used in proxy as it's outside of react component tree.\n            if (true) {\n                if ((0,next_dist_client_components_is_next_router_error__WEBPACK_IMPORTED_MODULE_5__.isNextRouterError)(err)) {\n                    err.message = `Next.js navigation API is not allowed to be used in ${isProxy ? 'Proxy' : 'Middleware'}.`;\n                    throw err;\n                }\n            }\n            const req = args[0];\n            const url = new URL(req.url);\n            const resource = url.pathname + url.search;\n            await (0,next_dist_server_web_globals__WEBPACK_IMPORTED_MODULE_1__.edgeInstrumentationOnRequestError)(err, {\n                path: resource,\n                method: req.method,\n                headers: Object.fromEntries(req.headers.entries())\n            }, {\n                routerKind: 'Pages Router',\n                routePath: '/proxy',\n                routeType: 'proxy',\n                revalidateReason: undefined\n            });\n            throw err;\n        }\n    };\n}\nconst internalHandler = (opts)=>{\n    return (0,next_dist_server_web_adapter__WEBPACK_IMPORTED_MODULE_2__.adapter)({\n        ...opts,\n        IncrementalCache: next_dist_server_lib_incremental_cache__WEBPACK_IMPORTED_MODULE_3__.IncrementalCache,\n        incrementalCacheHandler,\n        page,\n        handler: errorHandledHandler(handlerUserland)\n    });\n};\nasync function handler(request, ctx) {\n    const result = await internalHandler({\n        request: {\n            url: request.url,\n            method: request.method,\n            headers: (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_6__.toNodeOutgoingHttpHeaders)(request.headers),\n            nextConfig: {\n                basePath: \"\",\n                i18n: \"\",\n                trailingSlash: Boolean(false),\n                experimental: {\n                    cacheLife: {\"default\":{\"stale\":300,\"revalidate\":900,\"expire\":4294967294},\"seconds\":{\"stale\":30,\"revalidate\":1,\"expire\":60},\"minutes\":{\"stale\":300,\"revalidate\":60,\"expire\":3600},\"hours\":{\"stale\":300,\"revalidate\":3600,\"expire\":86400},\"days\":{\"stale\":300,\"revalidate\":86400,\"expire\":604800},\"weeks\":{\"stale\":300,\"revalidate\":604800,\"expire\":2592000},\"max\":{\"stale\":300,\"revalidate\":2592000,\"expire\":31536000}},\n                    authInterrupts: Boolean(false),\n                    clientParamParsingOrigins: []\n                }\n            },\n            page: {\n                name: page\n            },\n            body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body ?? undefined : undefined,\n            waitUntil: ctx.waitUntil,\n            requestMeta: ctx.requestMeta,\n            signal: ctx.signal || new AbortController().signal\n        }\n    });\n    ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, result.waitUntil);\n    return result.response;\n}\n// backwards compat\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (internalHandler);\n\n//# sourceMappingURL=middleware.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4uLy4uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtbWlkZGxld2FyZS1sb2FkZXIuanM/YWJzb2x1dGVQYWdlUGF0aD1EJTNBJTVDT3JnYW5pemF0aW9uJTVDTWFuTWFkaGFuJTVDUHJvamVjdHMlNUNSZWZyZWUtUHJvJTVDYXBwcyU1Q3dlYiU1Q3NyYyU1Q3Byb3h5LnRzJnBhZ2U9JTJGcHJveHkmcm9vdERpcj1EJTNBJTVDT3JnYW5pemF0aW9uJTVDTWFuTWFkaGFuJTVDUHJvamVjdHMlNUNSZWZyZWUtUHJvJTVDYXBwcyU1Q3dlYiZtYXRjaGVycz0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXlEO0FBQ25CO0FBQ2lCO0FBQ21CO0FBQzFFO0FBQ0E7QUFDQSxDQUF1QztBQUMwQztBQUNJO0FBQ2Q7QUFDdkU7QUFDQSxPQUFPLDBDQUFJO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxrQ0FBa0MsUUFBUSxLQUFLLG1DQUFtQyxpQ0FBaUM7QUFDaEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLGdCQUFnQixJQUFxQztBQUNyRCxvQkFBb0IsbUdBQWlCO0FBQ3JDLHlGQUF5RixpQ0FBaUM7QUFDMUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLCtGQUFpQztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcscUVBQU87QUFDbEI7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixxRkFBeUI7QUFDOUM7QUFDQSwwQkFBMEIsRUFBNEI7QUFDdEQsc0JBQXNCLEVBQThCO0FBQ3BELHVDQUF1QyxLQUFpQztBQUN4RTtBQUNBLCtCQUErQiwyWUFBNkI7QUFDNUQsNENBQTRDLEtBQStDO0FBQzNGLCtDQUErQyxFQUErQztBQUM5RjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpRUFBZSxlQUFlLEVBQUM7O0FBRS9CIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwibmV4dC9kaXN0L2J1aWxkL2FkYXB0ZXIvc2V0dXAtbm9kZS1lbnYuZXh0ZXJuYWxcIjtcbmltcG9ydCBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL2dsb2JhbHNcIjtcbmltcG9ydCB7IGFkYXB0ZXIgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci93ZWIvYWRhcHRlclwiO1xuaW1wb3J0IHsgSW5jcmVtZW50YWxDYWNoZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9pbmNyZW1lbnRhbC1jYWNoZVwiO1xuY29uc3QgaW5jcmVtZW50YWxDYWNoZUhhbmRsZXIgPSBudWxsXG4vLyBJbXBvcnQgdGhlIHVzZXJsYW5kIGNvZGUuXG5pbXBvcnQgKiBhcyBfbW9kIGZyb20gXCIuL3NyYy9wcm94eS50c1wiO1xuaW1wb3J0IHsgZWRnZUluc3RydW1lbnRhdGlvbk9uUmVxdWVzdEVycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL2dsb2JhbHNcIjtcbmltcG9ydCB7IGlzTmV4dFJvdXRlckVycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9jbGllbnQvY29tcG9uZW50cy9pcy1uZXh0LXJvdXRlci1lcnJvclwiO1xuaW1wb3J0IHsgdG9Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3dlYi91dGlsc1wiO1xuY29uc3QgbW9kID0ge1xuICAgIC4uLl9tb2Rcbn07XG5jb25zdCBwYWdlID0gXCIvcHJveHlcIjtcbmNvbnN0IGlzUHJveHkgPSBwYWdlID09PSAnL3Byb3h5JyB8fCBwYWdlID09PSAnL3NyYy9wcm94eSc7XG5jb25zdCBoYW5kbGVyVXNlcmxhbmQgPSAoaXNQcm94eSA/IG1vZC5wcm94eSA6IG1vZC5taWRkbGV3YXJlKSB8fCBtb2QuZGVmYXVsdDtcbmNsYXNzIFByb3h5TWlzc2luZ0V4cG9ydEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2Upe1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgLy8gU3RhY2sgaXNuJ3QgdXNlZnVsIGhlcmUsIHJlbW92ZSBpdCBjb25zaWRlcmluZyBpdCBzcGFtcyBsb2dzIGR1cmluZyBkZXZlbG9wbWVudC5cbiAgICAgICAgdGhpcy5zdGFjayA9ICcnO1xuICAgIH1cbn1cbi8vIFRPRE86IFRoaXMgc3BhbXMgbG9ncyBkdXJpbmcgZGV2ZWxvcG1lbnQuIEZpbmQgYSBiZXR0ZXIgd2F5IHRvIGhhbmRsZSB0aGlzLlxuLy8gUmVtb3ZpbmcgdGhpcyB3aWxsIHNwYW0gXCJmbiBpcyBub3QgYSBmdW5jdGlvblwiIGxvZ3Mgd2hpY2ggaXMgd29yc2UuXG5pZiAodHlwZW9mIGhhbmRsZXJVc2VybGFuZCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBQcm94eU1pc3NpbmdFeHBvcnRFcnJvcihgVGhlICR7aXNQcm94eSA/ICdQcm94eScgOiAnTWlkZGxld2FyZSd9IGZpbGUgXCIke3BhZ2V9XCIgbXVzdCBleHBvcnQgYSBmdW5jdGlvbiBuYW1lZCBcXGAke2lzUHJveHkgPyAncHJveHknIDogJ21pZGRsZXdhcmUnfVxcYCBvciBhIGRlZmF1bHQgZnVuY3Rpb24uYCk7XG59XG4vLyBQcm94eSB3aWxsIG9ubHkgc2VudCBvdXQgdGhlIEZldGNoRXZlbnQgdG8gbmV4dCBzZXJ2ZXIsXG4vLyBzbyBsb2FkIGluc3RydW1lbnRhdGlvbiBtb2R1bGUgaGVyZSBhbmQgdHJhY2sgdGhlIGVycm9yIGluc2lkZSBwcm94eSBtb2R1bGUuXG5mdW5jdGlvbiBlcnJvckhhbmRsZWRIYW5kbGVyKGZuKSB7XG4gICAgcmV0dXJuIGFzeW5jICguLi5hcmdzKT0+e1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGZuKC4uLmFyZ3MpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIEluIGRldmVsb3BtZW50LCBlcnJvciB0aGUgbmF2aWdhdGlvbiBBUEkgdXNhZ2UgaW4gcnVudGltZSxcbiAgICAgICAgICAgIC8vIHNpbmNlIGl0J3Mgbm90IGFsbG93ZWQgdG8gYmUgdXNlZCBpbiBwcm94eSBhcyBpdCdzIG91dHNpZGUgb2YgcmVhY3QgY29tcG9uZW50IHRyZWUuXG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmIChpc05leHRSb3V0ZXJFcnJvcihlcnIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVyci5tZXNzYWdlID0gYE5leHQuanMgbmF2aWdhdGlvbiBBUEkgaXMgbm90IGFsbG93ZWQgdG8gYmUgdXNlZCBpbiAke2lzUHJveHkgPyAnUHJveHknIDogJ01pZGRsZXdhcmUnfS5gO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVxID0gYXJnc1swXTtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxLnVybCk7XG4gICAgICAgICAgICBjb25zdCByZXNvdXJjZSA9IHVybC5wYXRobmFtZSArIHVybC5zZWFyY2g7XG4gICAgICAgICAgICBhd2FpdCBlZGdlSW5zdHJ1bWVudGF0aW9uT25SZXF1ZXN0RXJyb3IoZXJyLCB7XG4gICAgICAgICAgICAgICAgcGF0aDogcmVzb3VyY2UsXG4gICAgICAgICAgICAgICAgbWV0aG9kOiByZXEubWV0aG9kLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IE9iamVjdC5mcm9tRW50cmllcyhyZXEuaGVhZGVycy5lbnRyaWVzKCkpXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgcm91dGVyS2luZDogJ1BhZ2VzIFJvdXRlcicsXG4gICAgICAgICAgICAgICAgcm91dGVQYXRoOiAnL3Byb3h5JyxcbiAgICAgICAgICAgICAgICByb3V0ZVR5cGU6ICdwcm94eScsXG4gICAgICAgICAgICAgICAgcmV2YWxpZGF0ZVJlYXNvbjogdW5kZWZpbmVkXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH07XG59XG5jb25zdCBpbnRlcm5hbEhhbmRsZXIgPSAob3B0cyk9PntcbiAgICByZXR1cm4gYWRhcHRlcih7XG4gICAgICAgIC4uLm9wdHMsXG4gICAgICAgIEluY3JlbWVudGFsQ2FjaGUsXG4gICAgICAgIGluY3JlbWVudGFsQ2FjaGVIYW5kbGVyLFxuICAgICAgICBwYWdlLFxuICAgICAgICBoYW5kbGVyOiBlcnJvckhhbmRsZWRIYW5kbGVyKGhhbmRsZXJVc2VybGFuZClcbiAgICB9KTtcbn07XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihyZXF1ZXN0LCBjdHgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBpbnRlcm5hbEhhbmRsZXIoe1xuICAgICAgICByZXF1ZXN0OiB7XG4gICAgICAgICAgICB1cmw6IHJlcXVlc3QudXJsLFxuICAgICAgICAgICAgbWV0aG9kOiByZXF1ZXN0Lm1ldGhvZCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHRvTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMocmVxdWVzdC5oZWFkZXJzKSxcbiAgICAgICAgICAgIG5leHRDb25maWc6IHtcbiAgICAgICAgICAgICAgICBiYXNlUGF0aDogcHJvY2Vzcy5lbnYuX19ORVhUX0JBU0VfUEFUSCxcbiAgICAgICAgICAgICAgICBpMThuOiBwcm9jZXNzLmVudi5fX05FWFRfSTE4Tl9DT05GSUcsXG4gICAgICAgICAgICAgICAgdHJhaWxpbmdTbGFzaDogQm9vbGVhbihwcm9jZXNzLmVudi5fX05FWFRfVFJBSUxJTkdfU0xBU0gpLFxuICAgICAgICAgICAgICAgIGV4cGVyaW1lbnRhbDoge1xuICAgICAgICAgICAgICAgICAgICBjYWNoZUxpZmU6IHByb2Nlc3MuZW52Ll9fTkVYVF9DQUNIRV9MSUZFLFxuICAgICAgICAgICAgICAgICAgICBhdXRoSW50ZXJydXB0czogQm9vbGVhbihwcm9jZXNzLmVudi5fX05FWFRfRVhQRVJJTUVOVEFMX0FVVEhfSU5URVJSVVBUUyksXG4gICAgICAgICAgICAgICAgICAgIGNsaWVudFBhcmFtUGFyc2luZ09yaWdpbnM6IHByb2Nlc3MuZW52Ll9fTkVYVF9DTElFTlRfUEFSQU1fUEFSU0lOR19PUklHSU5TXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhZ2U6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBwYWdlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogcmVxdWVzdC5tZXRob2QgIT09ICdHRVQnICYmIHJlcXVlc3QubWV0aG9kICE9PSAnSEVBRCcgPyByZXF1ZXN0LmJvZHkgPz8gdW5kZWZpbmVkIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgd2FpdFVudGlsOiBjdHgud2FpdFVudGlsLFxuICAgICAgICAgICAgcmVxdWVzdE1ldGE6IGN0eC5yZXF1ZXN0TWV0YSxcbiAgICAgICAgICAgIHNpZ25hbDogY3R4LnNpZ25hbCB8fCBuZXcgQWJvcnRDb250cm9sbGVyKCkuc2lnbmFsXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjdHgud2FpdFVudGlsID09IG51bGwgPyB2b2lkIDAgOiBjdHgud2FpdFVudGlsLmNhbGwoY3R4LCByZXN1bHQud2FpdFVudGlsKTtcbiAgICByZXR1cm4gcmVzdWx0LnJlc3BvbnNlO1xufVxuLy8gYmFja3dhcmRzIGNvbXBhdFxuZXhwb3J0IGRlZmF1bHQgaW50ZXJuYWxIYW5kbGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1taWRkbGV3YXJlLmpzLm1hcFxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(middleware)/../../node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb%5Csrc%5Cproxy.ts&page=%2Fproxy&rootDir=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb&matchers=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(middleware)/./src/proxy.ts":
/*!**********************!*\
  !*** ./src/proxy.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   proxy: () => (/* binding */ proxy)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(middleware)/../../node_modules/next/dist/api/server.js\");\n\nfunction proxy(request) {\n    const response = next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.next();\n    // Check if device_id cookie exists\n    let deviceId = request.cookies.get('device_id')?.value;\n    if (!deviceId) {\n        // Generate a new UUID for this device\n        deviceId = crypto.randomUUID();\n        // Set the cookie on the response so the browser saves it\n        // Using a 10 year expiry to make it virtually permanent for this device\n        response.cookies.set('device_id', deviceId, {\n            httpOnly: true,\n            secure: \"development\" === 'production',\n            sameSite: 'lax',\n            path: '/',\n            maxAge: 60 * 60 * 24 * 365 * 10\n        });\n    }\n    // Attach device_id to the response headers so the client can read it\n    response.headers.set('X-Device-Id', deviceId);\n    return response;\n}\nconst config = {\n    matcher: [\n        /*\r\n     * Match all request paths except for the ones starting with:\r\n     * - _next/static (static files)\r\n     * - _next/image (image optimization files)\r\n     * - favicon.ico, sitemap.xml, robots.txt (metadata files)\r\n     */ '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|icon.*|.*\\\\.png|.*\\\\.jpg).*)'\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vc3JjL3Byb3h5LnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUdwQyxTQUFTQyxNQUFNQyxPQUFvQjtJQUN4QyxNQUFNQyxXQUFXSCxxREFBWUEsQ0FBQ0ksSUFBSTtJQUVsQyxtQ0FBbUM7SUFDbkMsSUFBSUMsV0FBV0gsUUFBUUksT0FBTyxDQUFDQyxHQUFHLENBQUMsY0FBY0M7SUFFakQsSUFBSSxDQUFDSCxVQUFVO1FBQ2Isc0NBQXNDO1FBQ3RDQSxXQUFXSSxPQUFPQyxVQUFVO1FBRTVCLHlEQUF5RDtRQUN6RCx3RUFBd0U7UUFDeEVQLFNBQVNHLE9BQU8sQ0FBQ0ssR0FBRyxDQUFDLGFBQWFOLFVBQVU7WUFDMUNPLFVBQVU7WUFDVkMsUUFBUUMsa0JBQXlCO1lBQ2pDQyxVQUFVO1lBQ1ZDLE1BQU07WUFDTkMsUUFBUSxLQUFLLEtBQUssS0FBSyxNQUFNO1FBQy9CO0lBQ0Y7SUFFQSxxRUFBcUU7SUFDckVkLFNBQVNlLE9BQU8sQ0FBQ1AsR0FBRyxDQUFDLGVBQWVOO0lBRXBDLE9BQU9GO0FBQ1Q7QUFFTyxNQUFNZ0IsU0FBUztJQUNwQkMsU0FBUztRQUNQOzs7OztLQUtDLEdBQ0Q7S0FDRDtBQUNILEVBQUUiLCJzb3VyY2VzIjpbIkQ6XFxPcmdhbml6YXRpb25cXE1hbk1hZGhhblxcUHJvamVjdHNcXFJlZnJlZS1Qcm9cXGFwcHNcXHdlYlxcc3JjXFxwcm94eS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcbmltcG9ydCB0eXBlIHsgTmV4dFJlcXVlc3QgfSBmcm9tICduZXh0L3NlcnZlcic7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcHJveHkocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICBjb25zdCByZXNwb25zZSA9IE5leHRSZXNwb25zZS5uZXh0KCk7XHJcblxyXG4gIC8vIENoZWNrIGlmIGRldmljZV9pZCBjb29raWUgZXhpc3RzXHJcbiAgbGV0IGRldmljZUlkID0gcmVxdWVzdC5jb29raWVzLmdldCgnZGV2aWNlX2lkJyk/LnZhbHVlO1xyXG5cclxuICBpZiAoIWRldmljZUlkKSB7XHJcbiAgICAvLyBHZW5lcmF0ZSBhIG5ldyBVVUlEIGZvciB0aGlzIGRldmljZVxyXG4gICAgZGV2aWNlSWQgPSBjcnlwdG8ucmFuZG9tVVVJRCgpO1xyXG5cclxuICAgIC8vIFNldCB0aGUgY29va2llIG9uIHRoZSByZXNwb25zZSBzbyB0aGUgYnJvd3NlciBzYXZlcyBpdFxyXG4gICAgLy8gVXNpbmcgYSAxMCB5ZWFyIGV4cGlyeSB0byBtYWtlIGl0IHZpcnR1YWxseSBwZXJtYW5lbnQgZm9yIHRoaXMgZGV2aWNlXHJcbiAgICByZXNwb25zZS5jb29raWVzLnNldCgnZGV2aWNlX2lkJywgZGV2aWNlSWQsIHtcclxuICAgICAgaHR0cE9ubHk6IHRydWUsXHJcbiAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyxcclxuICAgICAgc2FtZVNpdGU6ICdsYXgnLFxyXG4gICAgICBwYXRoOiAnLycsXHJcbiAgICAgIG1heEFnZTogNjAgKiA2MCAqIDI0ICogMzY1ICogMTAsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIEF0dGFjaCBkZXZpY2VfaWQgdG8gdGhlIHJlc3BvbnNlIGhlYWRlcnMgc28gdGhlIGNsaWVudCBjYW4gcmVhZCBpdFxyXG4gIHJlc3BvbnNlLmhlYWRlcnMuc2V0KCdYLURldmljZS1JZCcsIGRldmljZUlkKTtcclxuXHJcbiAgcmV0dXJuIHJlc3BvbnNlO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xyXG4gIG1hdGNoZXI6IFtcclxuICAgIC8qXHJcbiAgICAgKiBNYXRjaCBhbGwgcmVxdWVzdCBwYXRocyBleGNlcHQgZm9yIHRoZSBvbmVzIHN0YXJ0aW5nIHdpdGg6XHJcbiAgICAgKiAtIF9uZXh0L3N0YXRpYyAoc3RhdGljIGZpbGVzKVxyXG4gICAgICogLSBfbmV4dC9pbWFnZSAoaW1hZ2Ugb3B0aW1pemF0aW9uIGZpbGVzKVxyXG4gICAgICogLSBmYXZpY29uLmljbywgc2l0ZW1hcC54bWwsIHJvYm90cy50eHQgKG1ldGFkYXRhIGZpbGVzKVxyXG4gICAgICovXHJcbiAgICAnLygoPyFfbmV4dC9zdGF0aWN8X25leHQvaW1hZ2V8ZmF2aWNvbi5pY298c2l0ZW1hcC54bWx8cm9ib3RzLnR4dHxtYW5pZmVzdC5qc29ufGljb24uKnwuKlxcXFwucG5nfC4qXFxcXC5qcGcpLiopJyxcclxuICBdLFxyXG59O1xyXG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwicHJveHkiLCJyZXF1ZXN0IiwicmVzcG9uc2UiLCJuZXh0IiwiZGV2aWNlSWQiLCJjb29raWVzIiwiZ2V0IiwidmFsdWUiLCJjcnlwdG8iLCJyYW5kb21VVUlEIiwic2V0IiwiaHR0cE9ubHkiLCJzZWN1cmUiLCJwcm9jZXNzIiwic2FtZVNpdGUiLCJwYXRoIiwibWF4QWdlIiwiaGVhZGVycyIsImNvbmZpZyIsIm1hdGNoZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(middleware)/./src/proxy.ts\n");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "./memory-cache.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/lib/incremental-cache/memory-cache.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/lib/incremental-cache/memory-cache.external.js");

/***/ }),

/***/ "./shared-cache-controls.external":
/*!*******************************************************************************************!*\
  !*** external "next/dist/server/lib/incremental-cache/shared-cache-controls.external.js" ***!
  \*******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js");

/***/ }),

/***/ "./tags-manifest.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/lib/incremental-cache/tags-manifest.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/server/lib/incremental-cache/tags-manifest.external.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "next/dist/build/adapter/setup-node-env.external":
/*!******************************************************************!*\
  !*** external "next/dist/build/adapter/setup-node-env.external" ***!
  \******************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/build/adapter/setup-node-env.external");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "node:async_hooks":
/*!***********************************!*\
  !*** external "node:async_hooks" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("node:async_hooks");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("./webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(middleware)/../../node_modules/next/dist/build/webpack/loaders/next-middleware-loader.js?absolutePagePath=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb%5Csrc%5Cproxy.ts&page=%2Fproxy&rootDir=D%3A%5COrganization%5CManMadhan%5CProjects%5CRefree-Pro%5Capps%5Cweb&matchers=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();