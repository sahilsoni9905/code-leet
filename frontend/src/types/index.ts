export interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  testCases: TestCase[];
  constraints: string;
  examples: Example[];
  functionSignatures: {
    javascript: string;
    cpp: string;
  };
  createdBy: string;
  createdAt: Date;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Submission {
  _id: string;
  userId: string;
  problemId: string;
  code: string;
  language: 'cpp';
  status: 'pending' | 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded';
  runtime?: number;
  memory?: number;
  testResults?: TestResult[];
  createdAt: Date;
}

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}