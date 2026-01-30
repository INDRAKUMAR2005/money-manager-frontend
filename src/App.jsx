import React, { useState } from 'react';
import { GlobalProvider } from './context/GlobalContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddTransactionModal from './components/AddTransactionModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <GlobalProvider>
      <div className="min-h-screen bg-background text-slate-100 font-sans selection:bg-primary selection:text-white pb-20">
        <Header onAddClick={() => setIsModalOpen(true)} />
        <main className="container mx-auto px-4 py-8">
          <Dashboard />
        </main>
        <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <ToastContainer position="bottom-right" theme="dark" />
      </div>
    </GlobalProvider>
  );
}

export default App;
