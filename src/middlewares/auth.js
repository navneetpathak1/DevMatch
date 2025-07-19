const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
require("dotenv").config();

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if(!token) {
        throw new Error("Token not valid")
    }
    const decodedObj = await jwt.verify(token, process.env.JWT_TOKEN);

    const {_id} = decodedObj;

    const user = await User.findById(_id);

    if(!user) {
        throw new Error("user not found");
    } 

    next();

  } catch (e) {

    res.status(400).send("Error: " + e)
  }
};

module.exports = {
  userAuth,
};
