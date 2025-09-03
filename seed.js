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
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`
    }
  },
  {
    title: "Palindrome Number",
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same backward as forward.`,
    difficulty: "Easy",
    constraints: `• -2^31 <= x <= 2^31 - 1`,
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left."
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome."
      }
    ],
    testCases: [
      {
        input: "121",
        expectedOutput: "true",
        isHidden: false
      },
      {
        input: "-121",
        expectedOutput: "false",
        isHidden: false
      },
      {
        input: "10",
        expectedOutput: "false",
        isHidden: false
      },
      {
        input: "0",
        expectedOutput: "true",
        isHidden: true
      },
      {
        input: "1221",
        expectedOutput: "true",
        isHidden: true
      }
    ],
    functionSignatures: {
      cpp: `bool isPalindrome(int x) {
    // Your code here
}`
    }
  },
  {
    title: "Roman to Integer",
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

Symbol       Value
I             1
V             5
X             10
L             50
C             100
D             500
M             1000

For example, 2 is written as II in Roman numeral, just two ones added together. 12 is written as XII, which is simply X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX. There are six instances where subtraction is used:

• I can be placed before V (5) and X (10) to make 4 and 9.
• X can be placed before L (50) and C (100) to make 40 and 90.
• C can be placed before D (500) and M (1000) to make 400 and 900.

Given a roman numeral, convert it to an integer.`,
    difficulty: "Easy",
    constraints: `• 1 <= s.length <= 15
• s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').
• It is guaranteed that s is a valid roman numeral in the range [1, 3999].`,
    examples: [
      {
        input: 's = "III"',
        output: "3",
        explanation: "III = 3."
      },
      {
        input: 's = "LVIII"',
        output: "58",
        explanation: "L = 50, V= 5, III = 3."
      },
      {
        input: 's = "MCMXC"',
        output: "1994",
        explanation: "M = 1000, CM = 900, XC = 90."
      }
    ],
    testCases: [
      {
        input: '"III"',
        expectedOutput: "3",
        isHidden: false
      },
      {
        input: '"LVIII"',
        expectedOutput: "58",
        isHidden: false
      },
      {
        input: '"MCMXC"',
        expectedOutput: "1994",
        isHidden: false
      },
      {
        input: '"IV"',
        expectedOutput: "4",
        isHidden: true
      },
      {
        input: '"IX"',
        expectedOutput: "9",
        isHidden: true
      }
    ],
    functionSignatures: {
      cpp: `int romanToInt(string s) {
    // Your code here
}`
    }
  },
  {
    title: "Longest Common Prefix",
    description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".`,
    difficulty: "Easy",
    constraints: `• 1 <= strs.length <= 200
• 0 <= strs[i].length <= 200
• strs[i] consists of only lowercase English letters.`,
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: "The longest common prefix is 'fl'."
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
        explanation: "There is no common prefix among the input strings."
      }
    ],
    testCases: [
      {
        input: '["flower","flow","flight"]',
        expectedOutput: '"fl"',
        isHidden: false
      },
      {
        input: '["dog","racecar","car"]',
        expectedOutput: '""',
        isHidden: false
      },
      {
        input: '["ab", "a"]',
        expectedOutput: '"a"',
        isHidden: true
      },
      {
        input: '[""]',
        expectedOutput: '""',
        isHidden: true
      },
      {
        input: '["a"]',
        expectedOutput: '"a"',
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function longestCommonPrefix(strs) {
    // Your code here
}`,
      cpp: `string longestCommonPrefix(vector<string>& strs) {
    // Your code here
}`
    }
  },
  {
    title: "Remove Duplicates from Sorted Array",
    description: `Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.

Consider the number of unique elements of nums to be k, to get accepted, you need to do the following things:

• Change the array nums such that the first k elements of nums contain the unique elements in the order they were present in nums initially. The remaining elements of nums are not important as well as the size of nums.
• Return k.`,
    difficulty: "Easy",
    constraints: `• 1 <= nums.length <= 3 * 10^4
• -100 <= nums[i] <= 100
• nums is sorted in non-decreasing order.`,
    examples: [
      {
        input: "nums = [1,1,2]",
        output: "2",
        explanation: "Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively."
      },
      {
        input: "nums = [0,0,1,1,1,2,2,3,3,4]",
        output: "5",
        explanation: "Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively."
      }
    ],
    testCases: [
      {
        input: "[1,1,2]",
        expectedOutput: "2",
        isHidden: false
      },
      {
        input: "[0,0,1,1,1,2,2,3,3,4]",
        expectedOutput: "5",
        isHidden: false
      },
      {
        input: "[1,2,3]",
        expectedOutput: "3",
        isHidden: true
      },
      {
        input: "[1]",
        expectedOutput: "1",
        isHidden: true
      },
      {
        input: "[1,1,1,1]",
        expectedOutput: "1",
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function removeDuplicates(nums) {
    // Your code here
}`,
      cpp: `int removeDuplicates(vector<int>& nums) {
    // Your code here
}`
    }
  },
  {
    title: "Search Insert Position",
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with O(log n) runtime complexity.`,
    difficulty: "Easy",
    constraints: `• 1 <= nums.length <= 10^4
• -10^4 <= nums[i] <= 10^4
• nums contains distinct values sorted in ascending order.
• -10^4 <= target <= 10^4`,
    examples: [
      {
        input: "nums = [1,3,5,6], target = 5",
        output: "2",
        explanation: "Target 5 is found at index 2."
      },
      {
        input: "nums = [1,3,5,6], target = 2",
        output: "1",
        explanation: "Target 2 should be inserted at index 1."
      },
      {
        input: "nums = [1,3,5,6], target = 7",
        output: "4",
        explanation: "Target 7 should be inserted at index 4."
      }
    ],
    testCases: [
      {
        input: "[1,3,5,6]\n5",
        expectedOutput: "2",
        isHidden: false
      },
      {
        input: "[1,3,5,6]\n2",
        expectedOutput: "1",
        isHidden: false
      },
      {
        input: "[1,3,5,6]\n7",
        expectedOutput: "4",
        isHidden: false
      },
      {
        input: "[1,3,5,6]\n0",
        expectedOutput: "0",
        isHidden: true
      },
      {
        input: "[1]\n1",
        expectedOutput: "0",
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function searchInsert(nums, target) {
    // Your code here
}`,
      cpp: `int searchInsert(vector<int>& nums, int target) {
    // Your code here
}`
    }
  },
  {
    title: "Length of Last Word",
    description: `Given a string s consisting of words and spaces, return the length of the last word in the string.

A word is a maximal substring consisting of non-space characters only.`,
    difficulty: "Easy",
    constraints: `• 1 <= s.length <= 10^4
• s consists of only English letters and spaces ' '.
• There is at least one word in s.`,
    examples: [
      {
        input: 's = "Hello World"',
        output: "5",
        explanation: "The last word is 'World' with length 5."
      },
      {
        input: 's = "   fly me   to   the moon  "',
        output: "4",
        explanation: "The last word is 'moon' with length 4."
      },
      {
        input: 's = "luffy is still joyboy"',
        output: "6",
        explanation: "The last word is 'joyboy' with length 6."
      }
    ],
    testCases: [
      {
        input: '"Hello World"',
        expectedOutput: "5",
        isHidden: false
      },
      {
        input: '"   fly me   to   the moon  "',
        expectedOutput: "4",
        isHidden: false
      },
      {
        input: '"luffy is still joyboy"',
        expectedOutput: "6",
        isHidden: false
      },
      {
        input: '"a"',
        expectedOutput: "1",
        isHidden: true
      },
      {
        input: '"   a   "',
        expectedOutput: "1",
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function lengthOfLastWord(s) {
    // Your code here
}`,
      cpp: `int lengthOfLastWord(string s) {
    // Your code here
}`
    }
  },
  {
    title: "Plus One",
    description: `You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading zeros.

Increment the large integer by one and return the resulting array of digits.`,
    difficulty: "Easy",
    constraints: `• 1 <= digits.length <= 100
• 0 <= digits[i] <= 9
• digits does not contain any leading zeros.`,
    examples: [
      {
        input: "digits = [1,2,3]",
        output: "[1,2,4]",
        explanation: "The array represents the integer 123. Incrementing by one gives 123 + 1 = 124."
      },
      {
        input: "digits = [4,3,2,1]",
        output: "[4,3,2,2]",
        explanation: "The array represents the integer 4321. Incrementing by one gives 4321 + 1 = 4322."
      },
      {
        input: "digits = [9]",
        output: "[1,0]",
        explanation: "The array represents the integer 9. Incrementing by one gives 9 + 1 = 10."
      }
    ],
    testCases: [
      {
        input: "[1,2,3]",
        expectedOutput: "[1,2,4]",
        isHidden: false
      },
      {
        input: "[4,3,2,1]",
        expectedOutput: "[4,3,2,2]",
        isHidden: false
      },
      {
        input: "[9]",
        expectedOutput: "[1,0]",
        isHidden: false
      },
      {
        input: "[9,9,9]",
        expectedOutput: "[1,0,0,0]",
        isHidden: true
      },
      {
        input: "[0]",
        expectedOutput: "[1]",
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function plusOne(digits) {
    // Your code here
}`,
      cpp: `vector<int> plusOne(vector<int>& digits) {
    // Your code here
}`
    }
  },
  {
    title: "Sqrt(x)",
    description: `Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.

You must not use any built-in exponent function or operator.

For example, do not use pow(x, 0.5) in c++ or x ** 0.5 in python.`,
    difficulty: "Easy",
    constraints: `• 0 <= x <= 2^31 - 1`,
    examples: [
      {
        input: "x = 4",
        output: "2",
        explanation: "The square root of 4 is 2, so we return 2."
      },
      {
        input: "x = 8",
        output: "2",
        explanation: "The square root of 8 is 2.828..., and since we round it down to the nearest integer, 2 is returned."
      }
    ],
    testCases: [
      {
        input: "4",
        expectedOutput: "2",
        isHidden: false
      },
      {
        input: "8",
        expectedOutput: "2",
        isHidden: false
      },
      {
        input: "0",
        expectedOutput: "0",
        isHidden: true
      },
      {
        input: "1",
        expectedOutput: "1",
        isHidden: true
      },
      {
        input: "2147395600",
        expectedOutput: "46340",
        isHidden: true
      }
    ],
    functionSignatures: {
      javascript: `function mySqrt(x) {
    // Your code here
}`,
      cpp: `int mySqrt(int x) {
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
