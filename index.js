var path = require('path');
var dir = require('node-dir');
var vow = require('vow');
var fs = require('fs');

function DirTransferPlugin(patterns, srcBasePath, destBasePath) {
    this.patterns = patterns || [];
    this.srcBasePath = srcBasePath;
    this.destBasePath = destBasePath;
}

DirTransferPlugin.prototype.apply = function(compiler) {
    var _this = this;
    var srcBasePath = this.srcBasePath || compiler.options.context || null;
    var destBasePath = this.destBasePath || compiler.options.context || null;

    compiler.plugin('emit', function(compilation, cb) {
        if (!srcBasePath) {
            compilation.errors.push(new Error('DirTransferPlugin: no srcBasePath provided'));
            cb();
        }
        if (!destBasePath) {
            compilation.errors.push(new Error('DirTransferPlugin: no destBasePath provided'));
            cb();
        }

        var promises = [];

        _this.patterns.forEach(function(pattern) {
            promises.push(_this.processDir(path.resolve(srcBasePath, pattern.src), path.resolve(destBasePath, pattern.dest), compilation));
        });

        vow.all(promises).then(function() {
            cb();
        }).fail(function(text) {
            compilation.errors.push(new Error(text));
            cb();
        });
    });
};

DirTransferPlugin.prototype.processDir = function(from, to, compilation) {
    var defer = vow.defer();

    dir.files(from, function(err, files) {
        if (err) {
            defer.reject('DirTransferPlugin: ' + err);
            return;
        }

        var allFiles = files.map(function(fullPath) {
            var fileName = fullPath.replace(from, '');
            var distName = to ? path.join(to, fileName) : fileName;

            compilation.assets[distName] = {
                size: function() {
                    return fs.statSync(fullPath).size;
                },
                source: function() {
                    return fs.readFileSync(fullPath);
                },
            };
        });

        defer.resolve(vow.all(allFiles));
    });

    return defer.promise();
};

module.exports = DirTransferPlugin;
