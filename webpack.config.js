const flowbiteReact = require("flowbite-react/plugin/webpack");

// webpack.config.js
module.exports = {
    // ... other webpack configurations
    // ...
    stats: {
    children: true, // This will show detailed stats for child compilations
    // You might also want to configure other stats options for verbosity, e.g.:
    // errors: true,
    // warnings: true,
    // colors: true,
    // modules: false,
    // chunks: false,
    // builtAt: false,
    },

    plugins: [flowbiteReact()]
};