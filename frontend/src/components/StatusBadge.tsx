import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'accepted':
        return {
          icon: CheckCircle,
          text: 'Accepted',
          classes: 'bg-success-100 text-success-700'
        };
      case 'wrong_answer':
        return {
          icon: XCircle,
          text: 'Wrong Answer',
          classes: 'bg-error-100 text-error-700'
        };
      case 'runtime_error':
        return {
          icon: AlertCircle,
          text: 'Runtime Error',
          classes: 'bg-error-100 text-error-700'
        };
      case 'time_limit_exceeded':
        return {
          icon: Clock,
          text: 'Time Limit Exceeded',
          classes: 'bg-yellow-100 text-yellow-700'
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          text: 'Pending',
          classes: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const { icon: Icon, text, classes } = getStatusInfo();

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
      <Icon className="w-3 h-3" />
      {text}
    </span>
  );
}

export default StatusBadge;