import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Problem } from '../types';
import { getProblems } from '../services/problemApi';
import DifficultyBadge from '../components/DifficultyBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    filterProblems();
  }, [problems, searchTerm, difficultyFilter]);

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

  const filterProblems = () => {
    let filtered = problems;

    if (searchTerm) {
      filtered = filtered.filter(problem =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === difficultyFilter);
    }

    setFilteredProblems(filtered);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Problems</h1>
        <p className="text-gray-600">Practice coding problems and improve your skills</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No problems found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProblems.map((problem) => (
              <Link
                key={problem._id}
                to={`/problems/${problem._id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {problem.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {problem.description.substring(0, 150)}...
                      </p>
                      <div className="flex items-center gap-3">
                        <DifficultyBadge difficulty={problem.difficulty} />
                        <span className="text-xs text-gray-500">
                          {problem.examples?.length || 0} examples
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemsPage;