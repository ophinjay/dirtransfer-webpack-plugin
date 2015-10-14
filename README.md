## Transfer Webpack Plugin

Transfer files to the build directory

### Getting started

Install the plugin:

```
npm install --save-dev dirtransfer-webpack-plugin
```


### API
```javascript
new DirTransferPlugin(patterns: array, [basePaths: object])
```

* `patterns` – array of patterns `{ src: 'path', dest: 'path' }`, `src` – relative to `src` property of `basePaths` object or to `context` of your config (if the former is missing), `dest` – relative to `dest` property of `basePaths` object or to `context` of your config (if the former is missing)
* `basePaths` (optional) – object `{ src: 'base path for src pattern', dest: 'base path for src pattern' }`, `src` - individual `src` path patterns in `patterns` array will be resolved relative to this base path, `dest` - individual `dest` path patterns in `patterns` array will be resolved relative to this base path, 

### Usage

```javascript
var DirTransferPlugin = require('transfer-webpack-plugin');

module.exports = {
    context: path.join(__dirname, 'app'),
    plugins: [
        new DirTransferPlugin([
            { src: 'cred_dev', dest: 'cred' },
            { src: 'logger_dev' }
        ])
    ]
};

module.exports = {
    plugins: [
        new DirTransferPlugin([
            { src: 'cred_dev', dest: 'cred' },
            { src: 'logger_dev' }
        ], {
            src: path.join(__dirname, 'app'),
            dest: path.join('/Users/test/Documents/project')
        })
    ]
};
```
