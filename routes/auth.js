const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_KEY
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("該当メールは存在しません。");
      return;
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      res.status(401).json("パスワードが一致しません。");
      return;
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY,
      { expiresIn: "1d" }
    );

    const { password, ...other } = user._doc;
    res.status(200).json({ other, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
