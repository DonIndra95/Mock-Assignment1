const studentModel = require("../models/studentModel");

//CREATE OR ADD STUDENT

const createStudent = async (req, res) => {
  try {
    const data = req.body;

    const studentData = await studentModel.findOneAndUpdate(
      { name: data.name, subject: data.subject, isDeleted: false },
      { $inc: { marks: data.marks } },
      { new: true, upsert: true }
    );
    return res.status(201).send({ status: true, data: studentData });
    // const studentPresent=await studentModel.findOne({name:req.body.name,subject:req.body.subject})
    // if(studentPresent){
    //     studentPresent.marks=studentPresent.marks+data.marks
    //     await studentPresent.save()
    //     return res.status(200).send({status:true,message:"Marks updated"})

    // }else{
    //     const newStudent=await studentModel.create(data).lean()
    //     return res.status(201).send({status:true,data:newStudent})
    // }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//EDIT STUDENT

const editStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const updatedStudent = await studentModel.findOneAndUpdate(
      { _id: studentId, isDeleted: false },
      req.body,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updatedStudent });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//VIEW Student list

const getStudent = async (req, res) => {
  try {
    let findObj={isDeleted:false}
    if(req.query.name)findObj.name=req.query.name
    if(req.query.subject)findObj.subject=req.query.subject

    const studentList = await studentModel.find(findObj);
    return res.status(200).send({ status: true, data: studentList });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//studentDeatail

const studentDetail = async (req, res) => {
  try {
    const studentDetail = await studentModel.findById(req.params.studentId);
    return res.status(200).send({ status: true, data: studentDetail });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//Delete Student
const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const updatedStudent = await studentModel.findOneAndUpdate(
      { _id: studentId, isDeleted: false },
      { isDeleted: true }
    );
    return res.status(200).send({ status: true, message: "Student Deleted" });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createStudent, editStudent, getStudent, studentDetail,deleteStudent };
