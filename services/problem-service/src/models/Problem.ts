import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  testCases: [testCaseSchema],
  constraints: {
    type: String,
    required: true
  },
  examples: [exampleSchema],
  functionSignatures: {
    javascript: { type: String, required: true },
    cpp: { type: String, required: true }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Problem', problemSchema);