const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const ROOT_PATH = process.cwd();
const CONTAINERS_PATH = path.join(ROOT_PATH, 'src/containers');
const FILES_IN_CONTAINER = fs.readdirSync(CONTAINERS_PATH);

module.exports = (env, argv) => {
    const isProdMode = argv.mode === 'production';

    const config = {
        mode: argv.mode,
        entry: {},
        output: {
            filename: isProdMode ? '[name].[chunkhash].js' : '[name].js',
            publicPath: '/static/',
            path: path.resolve(__dirname, `../server/app/public`)
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].[hash].css',
                chunkFilename: '[name].[hash].css'
            })
        ],
        resolve: {
            extensions: [ '.ts', '.tsx', '.js', '.json', '.jsx', '.css', '.less', '.json', '.yml' ],
            alias: {
                '~components': path.resolve(__dirname, './src/components'),
                '~containers': path.resolve(__dirname, './src/containers'),
                '~static': path.resolve(__dirname, './src/static'),
                '~util': path.resolve(__dirname, './src/util'),
                '~server': path.resolve(__dirname, '../server'),
                static: path.resolve(__dirname, './src/static')
            }
        },
        devtool: isProdMode ? undefined : 'eval-source-map',
        module: {
            rules: [
                {
                    test: /\.(jsx?|tsx?)$/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: path.resolve(__dirname, 'postcss.config.js')
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.less$/i,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                modifyVars: {
                                    'primary-color': '#FA541C',
                                    'link-color': '#FA541C'
                                },
                                javascriptEnabled: true
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g|gif|eot|svg|ttf|woff|woff2|mp4)\??.*$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: '[name]_[hash:8].[ext]'
                            }
                        }
                    ],
                    exclude: /node_modules/
                }
            ]
        },
        performance: {
            hints: false
        },
        optimization: {
            runtimeChunk: {
                name: 'manifest'
            },
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom|core-js|regenerator-runtime)[\\/]/,
                        name: 'vendor',
                        chunks: 'all'
                    }
                }
            }
        }
    };

    if (env && env.analyzer) {
        config.plugins.push(new BundleAnalyzerPlugin());
    }

    FILES_IN_CONTAINER.forEach(filename => {
        const name = filename.match(/(.*)\.[^.]+$/i)[1];
        config.entry[name] = [ '@babel/polyfill', path.join(ROOT_PATH, 'src/containers', filename) ];
        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, `../server/app/view/${name}.html`),
                template: `templates/${name}.html`,
                name: name,
                inject: true,
                chunks: [ name, 'vendor', 'manifest' ]
            })
        );
    });

    return config;
};
