// Mock implementation of the pkginfo library to avoid filesystem traversal failures in Webpack bundle.
var pkginfo = module.exports = function (pmodule, options) {
  var args = [].slice.call(arguments, 2).filter(function (arg) {
    return typeof arg === 'string';
  });

  if (Array.isArray(options)) {
    options = { include: options };
  } else if (typeof options === 'string') {
    options = { include: [options] };
  }

  options = options || {};
  options.include = options.include || [];

  if (args.length > 0) {
    options.include = options.include.concat(args);
  }

  var pkg = { version: '1.0.0' };

  Object.keys(pkg).forEach(function (key) {
    if (options.include.length > 0 && !~options.include.indexOf(key)) {
      return;
    }

    if (pmodule && pmodule.exports && !pmodule.exports[key]) {
      pmodule.exports[key] = pkg[key];
    }
  });

  return pkginfo;
};

pkginfo.find = function (pmodule, dir) {
  return { version: '1.0.0' };
};

pkginfo.read = function (pmodule, dir) {
  return {
    dir: dir || '',
    package: { version: '1.0.0' },
  };
};

pkginfo.version = '1.0.0';
