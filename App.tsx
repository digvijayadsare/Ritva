
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CalendarView } from './pages/CalendarView';
import { TraditionDetails } from './pages/TraditionDetails';
import { CreateTradition } from './pages/CreateTradition';
import { Login } from './pages/Login';
import { AncestorManagement } from './pages/AncestorManagement';
import { FamilyManagement } from './pages/FamilyManagement';
import { FamilyTree } from './pages/FamilyTree';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/tradition/:id" element={<TraditionDetails />} />
          <Route path="/create" element={<CreateTradition />} />
          <Route path="/ancestors" element={<AncestorManagement />} />
          <Route path="/family" element={<FamilyManagement />} />
          <Route path="/tree" element={<FamilyTree />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
