const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports= {
    plugins: [
        new NodePolyfillPlugin()
    ],
    target: 'node',
    resolve:{
        fallback: {
            "url": false,
            "buffer": false,
            "timers": false
        }
    },
}
