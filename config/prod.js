// prod.js
module.exports = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: process.env.MONGO_URI,
    cookieKey: process.env.COOKIE_KEY,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeSeretKey: process.env.STRIPE_SECRET_KEY,
    sendInBlueKey: process.env.SIB_API_KEY,
    sendInBlueParentFolderId: process.env.SIB_PARENT_FOLDER_ID,
    redirectDomain: process.env.REDIRECT_DOMAIN
};