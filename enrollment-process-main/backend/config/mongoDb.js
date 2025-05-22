const User = require("../models/User");

const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error("Error while finding user:", error); // Add this
    throw new Error("Error while finding user");
  }
};

module.exports = { findUserByEmail };
