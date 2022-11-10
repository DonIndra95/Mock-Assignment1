const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const teacherModel = require("../models/teacherModel");

////////////////////////////////----------------------CREATE TEACHER ----------------------/////////////////////////////////
const teacherRegister = async (req, res) => {
  try {
    const data = req.body;

    if (!data)
      return res
        .status(400)
        .send({ status: false, message: "Request body cannot be empty" });

    const { name, email, password } = data;

    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "Enter Teacher's name" });

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Enter Teacher's email" });

    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Enter Teacher's password" });

    let bcrpytPassword = await bcrypt.hash(data.password, 5);
    data.password = bcrpytPassword;

    const checkEmail=await teacherModel.findOne({email:email})
    if(checkEmail)
    return res
        .status(409)
        .send({ status: false, message: "Email is already in use" });

    let savedData = await teacherModel.create(data);

    res.status(201).send({
      status: true,
      message: "Teacher created successfully",
      data: savedData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, message: err.message });
  }
};
////////////////////////////////----------------------TEACHER LOGIN----------------------/////////////////////////////////
const loginTeacher = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter email and password" });

    let checkEmail = await teacherModel.findOne({ email: email });

    if (!checkEmail)
      return res
        .status(404)
        .send({ status: false, message: `'${email}' email not found ` });

    let checkPassword = bcrypt.compareSync(password, checkEmail.password);
    if (!checkPassword)
      return res.status(401).send({ status: false, message: "Wrong password" });

    const token = jwt.sign(
      {
        teacherId: checkEmail._id,
      },
      "mock-secret-key",
      { expiresIn: "24h" }
    );

    res.status(200).send({
      status: true,
      message: "Teacher login successfull",
      data: { teacherId: checkEmail._id, token: token },
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { teacherRegister, loginTeacher };
