import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export interface ToastData {
  id: string;
  type: "success" | "error" | "warning";
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps extends ToastData {
  onClose: (id: string) => void;
}

function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
    }
  };

  return (
    <div
      className={`${getBgColor()} border rounded-lg p-4 shadow-lg animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h4 className={`font-medium ${getTextColor()}`}>{title}</h4>
          <p className={`text-sm ${getTextColor()} opacity-90`}>{message}</p>
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ${getTextColor()} hover:opacity-75`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
}

function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

export { Toast, ToastContainer };
