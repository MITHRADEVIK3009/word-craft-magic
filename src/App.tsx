
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DatabaseTest } from './components/DatabaseTest';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPage";

const queryClient = new QueryClient();

function App() {
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
