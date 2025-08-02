import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/PatientList'
import DoctorList from './pages/DoctorList'
import Reports from './pages/Reports'
import Accounts from './pages/Accounts'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'patient-list':
        return <PatientList />
      case 'doctor-list':
        return <DoctorList />
      case 'reports':
        return <Reports />
      case 'accounts':
        return <Accounts />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app">
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="main-content">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default App