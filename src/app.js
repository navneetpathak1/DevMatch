const express = require("express");
require("dotenv").config();
const { connectDB } = require("./config/db");
const User = require("./models/user.model")
const bcrypt = require("bcrypt");   

const app = express();


app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await newUser.save();
    res.send("User added successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("User not added");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Error: " + err.message);
  }
});

// Find user by email
app.get("/user/filter", async (req, res) => {
  const userEmail = req.query.emailID;

  try {
    const users = await User.find({ emailID: userEmail });
    if (users.length === 0) {
      res.status(404).send("No user");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Get all users
app.get("/user/allUser", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No user");
    } else {
      res.send(users);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Update information of a user by email
app.patch("/user/update", async (req, res) => {
  const { emailID, updates } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { emailID: emailID },
      { $set: updates },
      { new: true }
    );

    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

// Delete user by email and password
app.delete("/user/delete", async (req, res) => {
  const { emailID, password } = req.body;

  try {
    const user = await User.findOneAndDelete({ emailID, password });

    if (!user) {
      res.status(404).send("User not found or incorrect credentials");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

const PORT = process.env.PORT || 3000;
connectDB()
 .then(()=>{
    app.listen(PORT, () =>{
    console.log(`server is running on port no ${PORT}`)
    })
})