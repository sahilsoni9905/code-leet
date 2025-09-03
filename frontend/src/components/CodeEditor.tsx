import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'cpp';
  placeholder?: string;
}

function CodeEditor({ value, onChange, language, placeholder }: CodeEditorProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
        <span className="text-sm font-medium text-gray-700">
          C++
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-96 p-4 font-mono text-sm resize-none border-none outline-none focus:ring-0"
        style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
      />
    </div>
  );
}

export default CodeEditor;