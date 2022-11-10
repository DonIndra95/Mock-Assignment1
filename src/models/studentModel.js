const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
    },
    teacherId: {
      type: objectId,
      required: true,
      ref:"teacher"
    },
    result: [
      {
        subject: { type: String, required: true },
        marks: { type: Number, default:0 },
        isDeleted: { type: Boolean, default: false },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("student", studentSchema);
