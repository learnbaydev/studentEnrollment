const { findUserByEmail } = require("../services/userService");

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile?.emails?.[0]?.value;
    console.log("Google profile:", profile);    
    const existingUser = await findUserByEmail(email);
    
    if (!existingUser) {
      console.log("User not found or inactive:", email);
      return done(null, false, { message: "User not found or account is inactive" });
    }
    
    return done(null, existingUser);
  } catch (err) {
    console.error("Error in Google callback:", err);
    return done(err, null);
  }
};

module.exports = googleCallback;
