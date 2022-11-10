const express = require("express");
const {
  createStudent,
  studentDetail,
  getStudent,
  editStudent,
  deleteStudent,
} = require("../controllers/studentController");
const {
  teacherRegister,
  loginTeacher,
} = require("../controllers/teacherController");
const { authentication } = require("../middlewares/auth");

const router = express.Router();

//user APIs
router.post("/register", teacherRegister);
router.post("/login", loginTeacher);

//Student APIs
router.post("/student/create", authentication, createStudent);
router.get("/student/:studentId", authentication, studentDetail);
router.get("/student", authentication, getStudent);
router.put("/student/:studentId", authentication, editStudent);
router.delete("/student/:studentId", authentication, deleteStudent);

module.exports = router;
