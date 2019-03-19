module.exports = {
    presets: [ '@babel/preset-react', '@babel/preset-env', '@babel/preset-typescript' ],
    plugins: [
        '@babel/plugin-proposal-export-default-from',
        [ 'import', { libraryName: 'antd', libraryDirectory: 'lib', style: true } ]
    ]
};
