import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseTest } from './components/DatabaseTest';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";
import { useState, useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  const [isConfigError, setIsConfigError] = useState(false);

  useEffect(() => {
    // Check if Supabase environment variables are set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setIsConfigError(true);
    }
  }, []);

  if (isConfigError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-yellow-400 mb-4">Configuration Error</h1>
          <p className="text-gray-300 mb-4">
            The application is missing required environment variables. Please create a <code className="bg-gray-700 px-2 py-1 rounded">.env</code> file with the following variables:
          </p>
          <pre className="bg-gray-700 p-4 rounded mb-4 overflow-x-auto">
            VITE_SUPABASE_URL=your_supabase_project_url{'\n'}
            VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
          </pre>
          <p className="text-gray-300">
            You can get these values from your Supabase project dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <div className="container mx-auto py-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/database-test" element={<DatabaseTest />} />
              <Route path="/test-agents" element={<TestPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
