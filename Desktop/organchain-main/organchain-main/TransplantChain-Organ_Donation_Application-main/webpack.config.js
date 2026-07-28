const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin({
    patterns: [
      { from: "./public", to: "" },
      ...[ 
        "index", "login", "dashboard", "about", "hospitals",
        "faqs", "faqs-general", "download-forms", "awareness",
        "awareness-general", "about-general", "register",
        "node-registry", "audit-ledger", "match-archive",
        "security-logs", "profile", "pledge-verification",
        "admin-dashboard"
      ].map(name => ({ from: `./src/${name}.html`, to: `${name}.html` })),
    ]
  }),   
  ],
  devServer: { 
    contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "src")], 
    compress: true, 
    port: 3001,
    proxy: {
      '/api': 'http://localhost:8080',
      '/flask': {
         target: 'http://localhost:5000',
         pathRewrite: { '^/flask': '' }
      }
    }
  },
};