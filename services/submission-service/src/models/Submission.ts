import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  actualOutput: { type: String, required: true },
  passed: { type: Boolean, required: true },
  runtime: { type: Number, required: true }
});

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'cpp'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded'],
    default: 'pending'
  },
  runtime: {
    type: Number,
    default: 0
  },
  memory: {
    type: Number,
    default: 0
  },
  testResults: [testResultSchema]
}, {
  timestamps: true
});

export default mongoose.model('Submission', submissionSchema);