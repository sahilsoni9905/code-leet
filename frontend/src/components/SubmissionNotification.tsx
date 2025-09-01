import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

interface NotificationProps {
  show: boolean;
  status: "accepted" | "wrong_answer" | "runtime_error" | "pending";
  message: string;
  onClose: () => void;
}

const statusConfig = {
  accepted: {
    icon: CheckCircle,
    className: "bg-green-500 text-white",
    iconColor: "text-green-200",
  },
  wrong_answer: {
    icon: XCircle,
    className: "bg-red-500 text-white",
    iconColor: "text-red-200",
  },
  runtime_error: {
    icon: AlertCircle,
    className: "bg-orange-500 text-white",
    iconColor: "text-orange-200",
  },
  pending: {
    icon: Clock,
    className: "bg-blue-500 text-white",
    iconColor: "text-blue-200",
  },
};

function SubmissionNotification({
  show,
  status,
  message,
  onClose,
}: NotificationProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${config.className} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in`}
    >
      <Icon className={`w-5 h-5 ${config.iconColor}`} />
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

export default SubmissionNotification;
