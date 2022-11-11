const studentModel = require("../models/studentModel");

/////////////////---------------ADD STUDENT----------///////////////

const createStudent = async (req, res) => {
  try {
    const data = req.body;

    data.teacherId = req.decodeToken.teacherId;

    if (!data)
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty" });

    const studentPresent = await studentModel.findOne({ name: data.name });
    if (studentPresent) {
      const update = {};
      const resultArray = studentPresent.result;
      let flag = false;
      for (var i = 0; i < resultArray.length; i++) {
        if (resultArray[i].subject == data.result.subject) {
          flag = true;
          break;
        }
      }
      if (flag == true)
        update[`result.${i}.marks`] =
          studentPresent.result[i].marks + data.result.marks;
      else
        update["$push"] = {
          result: { subject: data.result.subject, marks: data.result.marks },
        };

      const updateStudent = await studentModel.findOneAndUpdate(
        { name: req.body.name },
        update,
        { new: true }
      );
      return res.status(201).send({ status: true, data: updateStudent });
    } else {
      const newStudent = await studentModel.create(data);
      return res.status(201).send({ status: true, data: newStudent });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: err.message });
  }
};

///////////////////////--------EDIT STUDENT----------///////////////////

const editStudent = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty " });
    const studentId = req.params.studentId;
    const studentDetail = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });
    if (Object.keys(studentDetail).length < 1)
      return res
        .status(404)
        .send({ status: false, message: "No student found or is deleted" });

    if (studentDetail.teacherId != req.decodeToken.teacherId)
      return res.status(403).send({
        status: false,
        message: "You are not authorized to access this data",
      });

    const updatedStudent = await studentModel.findOneAndUpdate(
      { _id: studentId, isDeleted: false },
      req.body,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updatedStudent });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: err.message });
  }
};

///////////////////-------------VIEW Student list------------///////////////////////

const getStudent = async (req, res) => {
  try {
    let findObj = { isDeleted: false, teacherId: req.decodeToken.teacherId };
    if (req.query.name) findObj.name = req.query.name;
    if (req.query.subject) findObj["result.subject"] = req.query.subject;

    const studentList = await studentModel.find(findObj);
    if (studentList.length < 1)
      return res.status(404).send({
        status: false,
        message: "no students found",
      });
    return res.status(200).send({ status: true, data: studentList });
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: false, message: err.message });
  }
};

/////////////------------studentDetail---------------------///////////////

const studentDetail = async (req, res) => {
  try {
    const studentDetail = await studentModel.findById(req.params.studentId);
    return res.status(200).send({ status: true, data: studentDetail });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

////////////////////-----------Delete Student-----------//////////////////
const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const studentDetail = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });
    if (Object.keys(studentDetail).length < 1)
      return res
        .status(404)
        .send({ status: false, message: "No student found or is deleted" });

    if (studentDetail.teacherId != req.decodeToken.teacherId)
      return res.status(403).send({
        status: false,
        message: "You are not authorized to access this data",
      });
    const updatedStudent = await studentModel.findOneAndUpdate(
      { _id: studentId, isDeleted: false },
      { isDeleted: true }
    );
    return res.status(204).send({ status: true, message: "Student Deleted" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createStudent,
  editStudent,
  getStudent,
  studentDetail,
  deleteStudent,
};
