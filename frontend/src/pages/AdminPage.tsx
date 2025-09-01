import React, { useState, useEffect } from 'react';
import { Problem } from '../types';
import { getProblems, createProblem, deleteProblem } from '../services/problemApi';
import DifficultyBadge from '../components/DifficultyBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, Trash2, Edit } from 'lucide-react';

function AdminPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '' }],
    testCases: [{ input: '', expectedOutput: '', isHidden: false }],
    functionSignatures: {
      javascript: '',
      cpp: ''
    }
  });

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const response = await getProblems();
      if (response.success) {
        setProblems(response.data);
      }
    } catch (error) {
      console.error('Failed to load problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createProblem(formData);
      if (response.success) {
        setProblems([response.data, ...problems]);
        setShowCreateForm(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create problem:', error);
    }
  };

  const handleDeleteProblem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;

    try {
      const response = await deleteProblem(id);
      if (response.success) {
        setProblems(problems.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete problem:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'Easy',
      constraints: '',
      examples: [{ input: '', output: '', explanation: '' }],
      testCases: [{ input: '', expectedOutput: '', isHidden: false }],
      functionSignatures: {
        javascript: '',
        cpp: ''
      }
    });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: '', output: '', explanation: '' }]
    });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expectedOutput: '', isHidden: false }]
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage problems and platform content</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Problem
        </button>
      </div>

      {/* Create Problem Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Problem</h2>
              
              <form onSubmit={handleCreateProblem} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Two Sum"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the problem..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Constraints
                  </label>
                  <textarea
                    required
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="1 <= nums.length <= 10^4..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      JavaScript Function Signature
                    </label>
                    <textarea
                      required
                      value={formData.functionSignatures.javascript}
                      onChange={(e) => setFormData({
                        ...formData,
                        functionSignatures: {
                          ...formData.functionSignatures,
                          javascript: e.target.value
                        }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                      placeholder="function solution(nums, target) {&#10;    // Your code here&#10;}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      C++ Function Signature
                    </label>
                    <textarea
                      required
                      value={formData.functionSignatures.cpp}
                      onChange={(e) => setFormData({
                        ...formData,
                        functionSignatures: {
                          ...formData.functionSignatures,
                          cpp: e.target.value
                        }
                      })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                      placeholder="vector<int> solution(vector<int>& nums, int target) {&#10;    // Your code here&#10;}"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Create Problem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Problems List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {problems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No problems created yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Problem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {problems.map((problem) => (
                  <tr key={problem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/problems/${problem._id}`}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-primary-600 hover:text-primary-800"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProblem(problem._id)}
                          className="text-error-600 hover:text-error-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;