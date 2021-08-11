"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loader;
exports.pitch = pitch;

var _path = _interopRequireDefault(require("path"));

var _loaderUtils = require("loader-utils");

var _schemaUtils = require("schema-utils");

var _NodeTargetPlugin = _interopRequireDefault(require("webpack/lib/node/NodeTargetPlugin"));

var _SingleEntryPlugin = _interopRequireDefault(require("webpack/lib/SingleEntryPlugin"));

var _WebWorkerTemplatePlugin = _interopRequireDefault(require("webpack/lib/webworker/WebWorkerTemplatePlugin"));

var _ExternalsPlugin = _interopRequireDefault(require("webpack/lib/ExternalsPlugin"));

var _options = _interopRequireDefault(require("./options.json"));

var _supportWebpack = _interopRequireDefault(require("./supportWebpack5"));

var _supportWebpack2 = _interopRequireDefault(require("./supportWebpack4"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let FetchCompileWasmPlugin;
let FetchCompileAsyncWasmPlugin; // determine the version of webpack peer dependency
// eslint-disable-next-line global-require, import/no-unresolved

const useWebpack5 = require("webpack/package.json").version.startsWith("5.");

if (useWebpack5) {
  // eslint-disable-next-line global-require, import/no-unresolved
  FetchCompileWasmPlugin = require("webpack/lib/web/FetchCompileWasmPlugin"); // eslint-disable-next-line global-require, import/no-unresolved

  FetchCompileAsyncWasmPlugin = require("webpack/lib/web/FetchCompileAsyncWasmPlugin");
} else {
  // eslint-disable-next-line global-require, import/no-unresolved
  FetchCompileWasmPlugin = require("webpack/lib/web/FetchCompileWasmTemplatePlugin");
}

function loader() {}

function pitch(request) {
  this.cacheable(false);
  const options = (0, _loaderUtils.getOptions)(this);
  (0, _schemaUtils.validate)(_options.default, options, {
    name: "Worker Loader",
    baseDataPath: "options"
  });
  const workerContext = {};
  const compilerOptions = this._compiler.options || {};
  const filename = options.filename ? options.filename : (0, _utils.getDefaultFilename)(compilerOptions.output.filename);
  const chunkFilename = options.chunkFilename ? options.chunkFilename : (0, _utils.getDefaultChunkFilename)(compilerOptions.output.chunkFilename);
  const publicPath = options.publicPath ? options.publicPath : compilerOptions.output.publicPath;
  workerContext.options = {
    filename,
    chunkFilename,
    publicPath,
    globalObject: "self"
  };
  workerContext.compiler = this._compilation.createChildCompiler(`worker-loader ${request}`, workerContext.options);
  new _WebWorkerTemplatePlugin.default().apply(workerContext.compiler);

  if (this.target !== "webworker" && this.target !== "web") {
    new _NodeTargetPlugin.default().apply(workerContext.compiler);
  }

  if (FetchCompileWasmPlugin) {
    new FetchCompileWasmPlugin({
      mangleImports: compilerOptions.optimization.mangleWasmImports
    }).apply(workerContext.compiler);
  }

  if (FetchCompileAsyncWasmPlugin) {
    new FetchCompileAsyncWasmPlugin().apply(workerContext.compiler);
  }

  if (compilerOptions.externals) {
    new _ExternalsPlugin.default((0, _utils.getExternalsType)(compilerOptions), compilerOptions.externals).apply(workerContext.compiler);
  }

  new _SingleEntryPlugin.default(this.context, `!!${request}`, _path.default.parse(this.resourcePath).name).apply(workerContext.compiler);
  workerContext.request = request;
  const cb = this.async();

  if (workerContext.compiler.cache && typeof workerContext.compiler.cache.get === "function") {
    (0, _supportWebpack.default)(this, workerContext, options, cb);
  } else {
    (0, _supportWebpack2.default)(this, workerContext, options, cb);
  }
}