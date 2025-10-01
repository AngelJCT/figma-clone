'use client';

interface EmptyStateProps {
  onCreateArtboard: () => void;
}

export default function EmptyState({ onCreateArtboard }: EmptyStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center pointer-events-auto">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 9h18M9 21V9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Create your first artboard</h2>
        <p className="text-gray-400 mb-6 max-w-md">
          Choose from preset device sizes or create a custom artboard to start designing
        </p>
        <button
          onClick={onCreateArtboard}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Create Artboard
        </button>
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">Quick tips:</p>
          <ul className="space-y-1">
            <li>Press <kbd className="px-2 py-1 bg-gray-800 rounded">V</kbd> for Select tool</li>
            <li>Press <kbd className="px-2 py-1 bg-gray-800 rounded">H</kbd> for Hand tool</li>
            <li>Hold <kbd className="px-2 py-1 bg-gray-800 rounded">Space</kbd> to pan</li>
            <li>
              <kbd className="px-2 py-1 bg-gray-800 rounded">Cmd/Ctrl</kbd> + scroll to zoom
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
