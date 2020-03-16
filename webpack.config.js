/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
const path = require('path');

function DtsBundlePlugin() {}
DtsBundlePlugin.prototype.apply = function(compiler) {
    compiler.plugin('done', function() {
        const dts = require('dts-bundle');

        dts.bundle({
            name: 'react-redux-test-renderer',
            main: 'dist/index.d.ts',
            out: './index.d.ts',
            removeSource: true,
            outputAsModuleFolder: true,
        });
    });
};

module.exports = {
    mode: 'none',
    entry: './dist/index.js',
    output: {
        library: 'react-redux-test-renderer',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'transpiled'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [new DtsBundlePlugin()],
};
