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
    mode: 'production',
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                options: { allowTsInNodeModules: true },
            },
        ],
    },
    plugins: [new DtsBundlePlugin()],
};
