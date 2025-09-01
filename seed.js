import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sonisahil9905:UEHHUSAUB6PIHePN@cluster0.ji9ju7m.mongodb.net/algocode-submissions';

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Problem Schema
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

const User = mongoose.model('User', userSchema);
const Problem = mongoose.model('Problem', problemSchema);

// Dummy data
const userData = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false
  }
];

const problemsData = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "Easy",
    constraints: `• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9  
• -10^9 <= target <= 10^9
• Only one valid answer exists.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    testCases: [
      {
        input: "[2,7,11,15]\n9",
        expectedOutput: "[0,1]",
        isHidden: false
      },
      {
        input: "[3,2,4]\n6",
        expectedOutput: "[1,2]",
        isHidden: false
      },
      {
        input: "[3,3]\n6",
        expectedOutput: "[0,1]",
        isHidden: true
      },
      {
        input: "[-1,-2,-3,-4,-5]\n-8",
        expectedOutput: "[2,4]",
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`
    }
  },
  {
    title: "Reverse String",
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    difficulty: "Easy",
    constraints: `• 1 <= s.length <= 10^5
• s[i] is a printable ascii character.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "The string is reversed in-place."
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
        explanation: "The string is reversed in-place."
      }
    ],
    testCases: [
      {
        input: '["h","e","l","l","o"]',
        expectedOutput: '["o","l","l","e","h"]',
        isHidden: false
      },
      {
        input: '["H","a","n","n","a","h"]',
        expectedOutput: '["h","a","n","n","a","H"]',
        isHidden: false
      },
      {
        input: '["a"]',
        expectedOutput: '["a"]',
        isHidden: true
      },
      {
        input: '["A"," ","m","a","n",","," ","a"," ","p","l","a","n",","," ","a"," ","c","a","n","a","l",":"," ","P","a","n","a","m","a"]',
        expectedOutput: '["a","m","a","n","a","P"," ",":","l","a","n","a","c"," ","a"," ",",","n","a","l","p"," ","a"," ",",","n","a","m"," ","A"]',
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function reverseString(s) {
    // Your code here
}`,
      cpp: `void reverseString(vector<char>& s) {
    // Your code here
}`
    }
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "Easy",
    constraints: `• 1 <= s.length <= 10^4
• s consists of parentheses only '()[]{}'.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: "The string contains valid parentheses."
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: "All brackets are properly matched and closed."
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: "The brackets are not properly matched."
      }
    ],
    testCases: [
      {
        input: '"()"',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        input: '"()[]{}"',
        expectedOutput: 'true',
        isHidden: false
      },
      {
        input: '"(]"',
        expectedOutput: 'false',
        isHidden: false
      },
      {
        input: '"([)]"',
        expectedOutput: 'false',
        isHidden: true
      },
      {
        input: '"{[]}"',
        expectedOutput: 'true',
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function isValid(s) {
    // Your code here
}`,
      cpp: `bool isValid(string s) {
    // Your code here
}`
    }
  },
  {
    title: "Maximum Subarray",
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    difficulty: "Medium",
    constraints: `• 1 <= nums.length <= 10^5
• -10^4 <= nums[i] <= 10^4`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.'
      },
      {
        input: 'nums = [1]',
        output: '1',
        explanation: 'The subarray [1] has the largest sum 1.'
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
        explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.'
      }
    ],
    testCases: [
      {
        input: '[-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
        isHidden: false
      },
      {
        input: '[1]',
        expectedOutput: '1',
        isHidden: false
      },
      {
        input: '[5,4,-1,7,8]',
        expectedOutput: '23',
        isHidden: false
      },
      {
        input: '[-1]',
        expectedOutput: '-1',
        isHidden: true
      },
      {
        input: '[-2,-1]',
        expectedOutput: '-1',
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function maxSubArray(nums) {
    // Your code here
}`,
      cpp: `int maxSubArray(vector<int>& nums) {
    // Your code here
}`
    }
  },
  {
    title: "Longest Palindromic Substring",
    description: `Given a string s, return the longest palindromic substring in s.

A palindrome is a string that reads the same forward and backward.`,
    difficulty: "Medium",
    constraints: `• 1 <= s.length <= 1000
• s consist of only digits and English letters.`,
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
        explanation: 'The longest palindromic substring is "bb".'
      }
    ],
    testCases: [
      {
        input: '"babad"',
        expectedOutput: '"bab"',
        isHidden: false
      },
      {
        input: '"cbbd"',
        expectedOutput: '"bb"',
        isHidden: false
      },
      {
        input: '"a"',
        expectedOutput: '"a"',
        isHidden: true
      },
      {
        input: '"ac"',
        expectedOutput: '"a"',
        isHidden: true
      },
      {
        input: '"racecar"',
        expectedOutput: '"racecar"',
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function longestPalindrome(s) {
    // Your code here
}`,
      cpp: `string longestPalindrome(string s) {
    // Your code here
}`
    }
  },
  {
    title: "Merge k Sorted Lists",
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    difficulty: "Hard",
    constraints: `• k == lists.length
• 0 <= k <= 10^4
• 0 <= lists[i].length <= 500
• -10^4 <= lists[i][j] <= 10^4
• lists[i] is sorted in ascending order.
• The sum of lists[i].length will not exceed 10^4.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'The linked-lists are:\n[\n  1->4->5,\n  1->3->4,\n  2->6\n]\nmerging them into one sorted list:\n1->1->2->3->4->4->5->6'
      },
      {
        input: 'lists = []',
        output: '[]',
        explanation: 'No lists to merge.'
      },
      {
        input: 'lists = [[]]',
        output: '[]',
        explanation: 'The only list is empty.'
      }
    ],
    testCases: [
      {
        input: '[[1,4,5],[1,3,4],[2,6]]',
        expectedOutput: '[1,1,2,3,4,4,5,6]',
        isHidden: false
      },
      {
        input: '[]',
        expectedOutput: '[]',
        isHidden: false
      },
      {
        input: '[[]]',
        expectedOutput: '[]',
        isHidden: false
      },
      {
        input: '[[1],[0]]',
        expectedOutput: '[0,1]',
        isHidden: true
      },
      {
        input: '[[-2,-1,-1,-1],[]]',
        expectedOutput: '[-2,-1,-1,-1]',
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function mergeKLists(lists) {
    // Your code here
    // ListNode definition:
    // function ListNode(val, next) {
    //     this.val = (val===undefined ? 0 : val)
    //     this.next = (next===undefined ? null : next)
    // }
}`,
      cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    // Your code here
    // ListNode definition:
    // struct ListNode {
    //     int val;
    //     ListNode *next;
    //     ListNode() : val(0), next(nullptr) {}
    //     ListNode(int x) : val(x), next(nullptr) {}
    //     ListNode(int x, ListNode *next) : val(x), next(next) {}
    // };
}`
    }
  },
  {
    title: "Binary Tree Maximum Path Sum",
    description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.`,
    difficulty: "Hard",
    constraints: `• The number of nodes in the tree is in the range [1, 3 * 10^4].
• -1000 <= Node.val <= 1000`,
    examples: [
      {
        input: 'root = [1,2,3]',
        output: '6',
        explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.'
      },
      {
        input: 'root = [-10,9,20,null,null,15,7]',
        output: '42',
        explanation: 'The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.'
      }
    ],
    testCases: [
      {
        input: '[1,2,3]',
        expectedOutput: '6',
        isHidden: false
      },
      {
        input: '[-10,9,20,null,null,15,7]',
        expectedOutput: '42',
        isHidden: false
      },
      {
        input: '[-3]',
        expectedOutput: '-3',
        isHidden: true
      },
      {
        input: '[2,-1]',
        expectedOutput: '2',
        isHidden: true
      },
      {
        input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]',
        expectedOutput: '48',
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function maxPathSum(root) {
    // Your code here
    // TreeNode definition:
    // function TreeNode(val, left, right) {
    //     this.val = (val===undefined ? 0 : val)
    //     this.left = (left===undefined ? null : left)
    //     this.right = (right===undefined ? null : right)
    // }
}`,
      cpp: `int maxPathSum(TreeNode* root) {
    // Your code here
    // TreeNode definition:
    // struct TreeNode {
    //     int val;
    //     TreeNode *left;
    //     TreeNode *right;
    //     TreeNode() : val(0), left(nullptr), right(nullptr) {}
    //     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    //     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
    // };
}`
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Problem.deleteMany({});
    console.log('Cleared existing data');

    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      userData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Get admin user for problem creation
    const adminUser = createdUsers.find(user => user.isAdmin);

    // Create problems
    const problemsWithCreator = problemsData.map(problem => ({
      ...problem,
      createdBy: adminUser._id
    }));

    const createdProblems = await Problem.insertMany(problemsWithCreator);
    console.log(`Created ${createdProblems.length} problems`);

    console.log('\n=== Seed Data Summary ===');
    console.log('Users created:');
    createdUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - ${user.isAdmin ? 'Admin' : 'User'}`);
    });

    console.log('\nProblems created:');
    createdProblems.forEach(problem => {
      console.log(`  - ${problem.title} (${problem.difficulty})`);
    });

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();

export { seedDatabase };
