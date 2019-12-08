const path = require('path');
const fs = require('fs')

const srcFileNames = fs.readdirSync('./src/')
const srcFilePaths = srcFileNames.map(name => `./src/${name}`)
const entry = {}
srcFileNames.map((name, i) => {
    entry[name] = srcFilePaths[i]
})


module.exports = {
    mode: 'development',
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: '[name]',
        libraryTarget: "umd",
        globalObject: 'this'
    },
    entry: entry,

    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { modules: false }]]
                    }
                },
                exclude: /(node_modules|dist)/
            }
        ]
    },

    plugins: []
}
