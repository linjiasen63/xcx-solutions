import promise from './es6-promise.auto.min.js';

export const promisify = function (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        args[0] = args[0] || {};
        const fnConfig = args[0];
        return new Promise(function (resolve) {
            fnConfig.success = function (result) {
                resolve(result);
            };
            fnConfig.fail = function (reseaon) {
                reject(reseaon);
            };
            fn.apply(null, args);
        });
    };
};
