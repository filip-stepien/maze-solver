import { merge } from 'webpack-merge';
import TerserPlugin from 'terser-webpack-plugin';
import defaultConfig from './webpack.config.js';

export default merge(defaultConfig, {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false
                    }
                }
            })
        ]
    }
});
