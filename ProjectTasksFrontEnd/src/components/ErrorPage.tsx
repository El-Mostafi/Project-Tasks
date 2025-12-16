import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  statusCode: number;
  title: string;
  message: string;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

export default function ErrorPage({
  statusCode,
  title,
  message,
  showHomeButton = true,
  showBackButton = true
}: ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8 text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-blue-600 mb-2">{statusCode}</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 mb-8">{message}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showBackButton && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={() => navigate('/projects')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Home className="w-5 h-5" />
              <span>Go to Projects</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

