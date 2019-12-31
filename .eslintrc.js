module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "airbnb",
        "plugin:@typescript-eslint/recommended",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        "max-classes-per-file": ["error", 1],
        "no-eval": ["error"],
        "no-plusplus": "off",
        "no-undef": "off",
        "no-underscore-dangle": "off",
        "no-empty-function": "warn",
        "no-param-reassign": ["error", { "props": false }],
        "spaced-comment": "off",
        "dot-notation" : "off",
        "import/no-unresolved": "off",
        "class-methods-use-this": "off",
        "import/prefer-default-export": "off",
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
        "@typescript-eslint/explicit-member-accessibility": "warn",
        "@typescript-eslint/prefer-interface": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true }],
        "require-jsdoc": [
            "error",
            {
                "require": {
                    "FunctionDeclaration": true,
                    "MethodDefinition": false,
                    "ClassDeclaration": true,
                    "ArrowFunctionExpression": false,
                    "FunctionExpression": false,
                },
            },
        ],
    },
    settings: {},
};