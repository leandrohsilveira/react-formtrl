const webpack         = require("webpack");
const {resolve}       = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');

module.exports = (env) => {

    var isDev = env.profile === 'dev';
    var isDocs = env.profile === 'docs';
    var isExample = isDev || isDocs;

    // Global configs
    var configs = {
        resolve: {
            extensions: [".webpack.js", ".web.js", ".js", ".jsx"],
            alias: {
                modules: path.resolve('./node_modules'),
            }
        },
        context: resolve(__dirname, "src"),
        entry: {
            'bundle': './app.jsx',
            'vendor': [
                'react',
                'react-dom', 
                'react-router-dom',
                'react-formctrl',
                'axios', 
                'prismjs',
                'prismjs/components/prism-jsx',
                'prismjs/components/prism-json',
                'prismjs/plugins/line-numbers/prism-line-numbers',
                'modules/prismjs/plugins/line-numbers/prism-line-numbers.css',
                'modules/prismjs/themes/prism-coy.css',
                'modules/bootstrap/dist/css/bootstrap-grid.min.css',
                'modules/bootstrap/dist/css/bootstrap.min.css',
                'modules/font-awesome/scss/font-awesome.scss'
            ]
        },
        output: {
            filename: "[name].js", 
            sourceMapFilename: '[name].map'
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: ["babel-loader"],
                    exclude: /node_modules/
                },
                {
                    test: /\.(css)$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(scss|sass)$/,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.(jpe?g|png|gif|svg|eot|woff|ttf|woff2)$/,
                    loader: "file-loader?name=[name].[ext]"
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                }
            ]
        },

        plugins: [
            // new StyleLintPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor'
            }),
            new HtmlWebpackPlugin({
                hash: true,
                template: 'index.html',
                filename: 'index.html',
                inject: 'body'
            }),
            new ExtractTextPlugin('bundle.css', { allChunks: true }),
            new webpack.DefinePlugin({
                gaId: env && env.gaId
            })
        ],
        performance: {
            hints: false
        }
    };
    if(isDev) {
        // DEV build configs
        configs.output.path = resolve(__dirname, "public");

        configs.devServer = {
            hot: true, // enable HMR on the server
            port: 9000,
            contentBase: resolve(__dirname, "public"), // match the output path
            publicPath: "/" // match the output `publicPath`
        };

        // configs.plugins.push(new webpack.HotModuleReplacementPlugin()); // enable HMR globally
        // configs.plugins.push(new webpack.NamedModulesPlugin()); // prints more readable module names in the browser console on HMR updates
    } else if(isDocs) {
        // DOCS build configs
        configs.output.path = resolve(__dirname, "../../docs");
        configs.plugins.push(new CleanWebpackPlugin(['docs/*'], {
            root:     resolve(__dirname, "../.."),
            verbose:  true,
            dry:      false
        }));
        configs.plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
    } else {
        throw "ERROR: Unknown webpack build profile: " + env.profile;
    }

    return configs;

}