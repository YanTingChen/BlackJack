module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'jquery': true
    },
    'extends': 'airbnb-base',
    rules: {
        'no-console': 'off',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single' //backtick
        ],
        'semi': [
            'error',
            'always'
        ],
    }
};