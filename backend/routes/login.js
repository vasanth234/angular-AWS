const express = require("express");
const router = express.Router();

const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const bcrypt = require("bcrypt"); // ✅ add this

router.post("/", async (req, res) => {
  try {
    const db = req.app.get("db");
    const { email, password } = req.body;

    const params = {
      TableName: "users",
      Key: { email }
    };

    const result = await db.send(new GetCommand(params));

    if (!result.Item) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ compare hashed password
    const isMatch = await bcrypt.compare(password, result.Item.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      user: {
        email: result.Item.email,
        name: result.Item.name
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;