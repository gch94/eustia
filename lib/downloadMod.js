var request = require('request'),
    fs = require('fs'),
    util = require('./util');

var logger = require('./logger');

var DOWNLOAD_URL_PREFIX = 'https://raw.githubusercontent.com/liriliri/licia/master/';

module.exports = function (modName, dest, options, cb)
{
    var src = getSrc(modName);

    logger.tpl({
        modName: modName,
        src: src
    }, 'DOWNLOAD {{#cyan}}{{{modName}}}{{/cyan}} FROM {{{src}}}');

    var reqOpts = {
        url: src,
        method: 'GET'
    };
    if (options.proxy) {
        reqOpts.proxy = options.proxy;
        if (util.startWith(options.proxy, 'http:')) src = src.replace('https:', 'http:');
    }

    request(reqOpts, function (err, res, body)
    {
        if (err) return cb(err);

        switch (res.statusCode)
        {
            case 200:
                break;
            case 404:
                return cb(new Error('There is no module named "' + modName + '"'));
            default:
                return cb(new Error('Error Downloading ' + modName));
        }

        fs.writeFile(dest, body, 'utf8', function (err)
        {
            cb(err);
        });
    });
};

function getSrc(modName)
{
    return DOWNLOAD_URL_PREFIX + modName[0].toLowerCase() + '/' + modName + '.js'
}