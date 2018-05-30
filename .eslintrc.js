'use strict';

module.exports = {
    // "parser": "babel-eslint",
    "env": {
        "node": true,
        "jest": true,
    },
    "extends": [
        "eslint:recommended"
    ],
/*
    "ecmaFeatures": {
        "arrowFunctions": true,
        "blockBindings": true,
        "classes": true,
        "destructuring": true,
        "defaultParams": true,
        "modules": true,
        "restParams": true,
        "spread": true
    }, */
    "globals": {
        "exports": false,
        "module": false,
        "require": false
    },
    "parserOptions": {
        "sourceType": "module"
    }, /*
    "plugins": [
        "babel",
        "async-await"
    ], */
    "rules": {
        // "babel/no-await-in-loop": 1,
        "indent": [
            "error", 2
        ],
        "no-console":0,
        "no-unused-vars":0,
        // "async-await/space-after-async": 2,
        // "async-await/space-after-await": 2,
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"]
    }
};
