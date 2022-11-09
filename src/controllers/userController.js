const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

////////////////////////////////----------------------CREATE USER DETAILS----------------------/////////////////////////////////
const userRegister = async (req, res) => {
  try {
    let data = req.body;
    let bcrpytPassword = await bcrypt.hash(data.password, 5);
    data.password = bcrpytPassword;

    let savedData = await userModel.create(data);

    res.status(201).send({
      status: true,
      message: "User created successfully",
      data: savedData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};
////////////////////////////////----------------------USER LOGIN----------------------/////////////////////////////////
const loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter email and password" });
    if (!isValidMail(email))
      return res
        .status(400)
        .send({ status: false, message: `'${email}' is not a valid email` });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid password " });

    let checkEmail = await userModel.findOne({ email: email });

    if (!checkEmail)
      return res
        .status(404)
        .send({ status: false, message: `'${email}' email not found ` });

    let checkPassword = bcrypt.compareSync(password, checkEmail.password);
    if (!checkPassword)
      return res.status(401).send({ status: false, message: "Wrong password" });

    const token = jwt.sign(
      {
        userId: checkEmail._id,
      },
      "mock-secret-key",
      { expiresIn: "24h" }
    );

    res.status(200).send({
      status: true,
      message: "User login successfull",
      data: { userId: checkEmail._id, token: token },
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { userRegister, loginUser };
