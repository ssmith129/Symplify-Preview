import React from 'react'
import { motion } from 'framer-motion'
import StatsCards from '../components/StatsCards'
import PatientChart from '../components/PatientChart'
import TopDoctors from '../components/TopDoctors'
import RecentActivity from '../components/RecentActivity'
import RevenueChart from '../components/RevenueChart'
import './Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-header">
          <h1>Welcome Back!</h1>
          <p>Here's what's happening at your hospital today.</p>
        </div>

        <StatsCards />

        <div className="dashboard-grid">
          <div className="chart-section">
            <PatientChart />
          </div>
          
          <div className="doctors-section">
            <TopDoctors />
          </div>
          
          <div className="activity-section">
            <RecentActivity />
          </div>
          
          <div className="revenue-section">
            <RevenueChart />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard