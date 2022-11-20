const path = require('path');

module.exports = (env, argv) => {
  const mode = argv.mode ?? 'production'
  const config = {
    context: path.resolve(__dirname, 'src'),
    entry: './p5.buildGeometry.ts',
    mode,
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }]
    },
    output: {
      filename: 'p5.buildGeometry.js',
      path: path.resolve(__dirname, 'build'),
      libraryTarget: 'umd',
      library: 'GeometryBuilder',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
  }

  if (mode === 'development') {
    config.devtool = 'inline-source-map'
  }

  return config
};
