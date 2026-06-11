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
    new CopyWebpackPlugin([{ from: "./public", to: "" }]),
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/login.html", to: "login.html" }]),
    new CopyWebpackPlugin([{ from: "./src/dashboard.html", to: "dashboard.html" }]),
    new CopyWebpackPlugin([{ from: "./src/about.html", to: "about.html" }]),
    new CopyWebpackPlugin([{ from: "./src/hospitals.html", to: "hospitals.html" }]),
    new CopyWebpackPlugin([{ from: "./src/faqs.html", to: "faqs.html" }]),
    new CopyWebpackPlugin([{ from: "./src/faqs-general.html", to: "faqs-general.html" }]),
    new CopyWebpackPlugin([{ from: "./src/download-forms.html", to: "download-forms.html" }]),
    new CopyWebpackPlugin([{ from: "./src/awareness.html", to: "awareness.html" }]),
    new CopyWebpackPlugin([{ from: "./src/awareness-general.html", to: "awareness-general.html" }]),
    new CopyWebpackPlugin([{ from: "./src/about-general.html", to: "about-general.html" }]),
    new CopyWebpackPlugin([{ from: "./src/register.html", to: "register.html" }]),
    new CopyWebpackPlugin([{ from: "./src/node-registry.html", to: "node-registry.html" }]),
    new CopyWebpackPlugin([{ from: "./src/audit-ledger.html", to: "audit-ledger.html" }]),
    new CopyWebpackPlugin([{ from: "./src/match-archive.html", to: "match-archive.html" }]),
    new CopyWebpackPlugin([{ from: "./src/security-logs.html", to: "security-logs.html" }]),
    new CopyWebpackPlugin([{ from: "./src/profile.html", to: "profile.html" }]),
    new CopyWebpackPlugin([{ from: "./src/pledge-verification.html", to: "pledge-verification.html" }]),
    new CopyWebpackPlugin([{ from: "./src/admin-dashboard.html", to: "admin-dashboard.html" }]),
    new CopyWebpackPlugin([{ from: "./src/admin-dashboard-script.js", to: "admin-dashboard-script.js" }]),
    new CopyWebpackPlugin([{ from: "./src/dark-mode.css", to: "dark-mode.css" }]),
    new CopyWebpackPlugin([{ from: "./src/theme.js", to: "theme.js" }]),
    // forms directory served directly via contentBase (not copied, to preserve binary PDF integrity)


    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-logo.svg", to: "images/organ-donation-logo.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-logo-new.svg", to: "images/organ-donation-logo-new.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/center_1.png", to: "images/center_1.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/center_2.png", to: "images/center_2.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/center_3.png", to: "images/center_3.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/card_slide_1.png", to: "images/card_slide_1.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/card_slide_2.png", to: "images/card_slide_2.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/card_slide_3.png", to: "images/card_slide_3.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/logo-new-final.svg", to: "images/logo-new-final.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/logo-final-1.svg", to: "images/logo-final-1.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/logo-final-2.svg", to: "images/logo-final-2.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/header-image-new.png", to: "images/header-image-new.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-platform-logo.svg", to: "images/organ-donation-platform-logo.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-platform-logo-1.svg", to: "images/organ-donation-platform-logo-1.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/organ-donation-platform-logo-white.svg", to: "images/organ-donation-platform-logo-white.svg"}]),
    new CopyWebpackPlugin([{ from: "./src/images/donation-icon.svg", to: "images/donation-icon.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/transplant-icon.svg", to: "images/transplant-icon.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/waiting-list-icon.svg", to: "images/waiting-list-icon.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/mail-icon.svg", to: "images/mail-icon.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/images/Gummadi.png", to: "images/Gummadi.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/Boini.png", to: "images/Boini.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/Rahul Sabinkar.png", to: "images/Rahul Sabinkar.png" }]),
    new CopyWebpackPlugin([{ from: "./src/images/Sai Manikanta.png", to: "images/Sai Manikanta.png" }]),    
  ],
  devServer: { 
    contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "src")], 
    compress: true, 
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
      '/flask': {
         target: 'http://localhost:5000',
         pathRewrite: { '^/flask': '' }
      }
    }
  },
};