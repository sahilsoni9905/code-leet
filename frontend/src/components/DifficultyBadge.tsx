import React from 'react';

interface DifficultyBadgeProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const getColorClasses = () => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-success-100 text-success-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Hard':
        return 'bg-error-100 text-error-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColorClasses()}`}>
      {difficulty}
    </span>
  );
}

export default DifficultyBadge;