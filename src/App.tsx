
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { CompanyDataProvider } from './contexts/CompanyDataContext';
import { LandingConfigProvider } from './contexts/LandingConfigContext';
import AppRoutes from './components/Routes/AppRoutes';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <DataProvider>
            <CompanyDataProvider>
              <LandingConfigProvider>
                <div className="App">
                  <AppRoutes />
                  <Toaster position="top-right" richColors />
                </div>
              </LandingConfigProvider>
            </CompanyDataProvider>
          </DataProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
