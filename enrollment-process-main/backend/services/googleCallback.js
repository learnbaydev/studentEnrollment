const { findUserByEmail } = require("../services/userService");

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile?.emails?.[0]?.value;
    console.log("Google profile:", profile); // Add this for full profile debug    
    const existingUser = await findUserByEmail(email);
    if (!existingUser) return done(null, false);
    return done(null, existingUser);
  } catch (err) {
    return done(err, null);
  }
};

module.exports = googleCallback;
