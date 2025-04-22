import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlInlineScriptPlugin from 'html-inline-script-webpack-plugin';

export default {
    entry: './src/index.ts',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(import.meta.dirname, 'dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        }),
        new HtmlInlineScriptPlugin()
    ]
};
