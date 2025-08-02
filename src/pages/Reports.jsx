import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import './Reports.css'

const revenueData = [
  { month: 'Jan', revenue: 600, expense: 400 },
  { month: 'Feb', revenue: 1500, expense: 1000 },
  { month: 'Mar', revenue: 1000, expense: 800 },
  { month: 'Apr', revenue: 800, expense: 300 },
  { month: 'May', revenue: 1500, expense: 600 },
  { month: 'Jun', revenue: 1200, expense: 1000 }
]

const progressData = [
  { category: 'Hospital Bill', percentage: 50, color: '#605BFF' },
  { category: 'Operation', percentage: 25, color: '#FF8F6B' },
  { category: 'Emergency Bill', percentage: 30, color: '#5DD971' },
  { category: 'Bed Service', percentage: 20, color: '#FFCC00' },
  { category: 'Due Collection', percentage: 25, color: '#FF6864' }
]

const expenseData = [
  { category: 'Salary', percentage: 50, color: '#605BFF' },
  { category: 'Equipment', percentage: 25, color: '#FF8F6B' },
  { category: 'Servicing', percentage: 30, color: '#5DD971' },
  { category: 'Referral Payment', percentage: 20, color: '#FFCC00' },
  { category: 'Others', percentage: 25, color: '#FF6864' }
]

const Reports = () => {
  return (
    <motion.div 
      className="reports-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div className="header-left">
          <h1>Financial Reports</h1>
          <p>Income Statement - January 2021</p>
        </div>
        
        <select className="month-selector">
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
        </select>
      </div>

      <div className="reports-summary">
        <motion.div 
          className="summary-card revenue"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="summary-header">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-info">
              <h3>Revenue</h3>
              <p className="summary-amount">$15,800</p>
            </div>
          </div>
          <div className="mini-chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={revenueData.slice(0, 4)}>
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#605BFF" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card expense"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="summary-header">
            <div className="summary-icon">
              <TrendingDown size={24} />
            </div>
            <div className="summary-info">
              <h3>Expense</h3>
              <p className="summary-amount">$12,400</p>
            </div>
          </div>
          <div className="mini-chart">
            <ResponsiveContainer width="100%" height={60}>
              <LineChart data={revenueData.slice(0, 4)}>
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#FF8F6B" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="reports-main">
        <div className="main-chart">
          <h3>Revenue vs Expense</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#C2C2DD', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#C2C2DD', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  background: 'white',
                  border: '1px solid #E0E7FE',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`$${value}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#605BFF" 
                strokeWidth={3}
                dot={{ fill: '#605BFF', strokeWidth: 2, r: 4 }}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#FF8F6B" 
                strokeWidth={3}
                dot={{ fill: '#FF8F6B', strokeWidth: 2, r: 4 }}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-column">
          <h3>Revenues</h3>
          <div className="progress-list">
            {progressData.map((item, index) => (
              <motion.div 
                key={item.category}
                className="progress-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="progress-header">
                  <span className="progress-label">{item.category}</span>
                  <span className="progress-value">{item.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="progress-column">
          <h3>Expenses</h3>
          <div className="progress-list">
            {expenseData.map((item, index) => (
              <motion.div 
                key={item.category}
                className="progress-item"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="progress-header">
                  <span className="progress-label">{item.category}</span>
                  <span className="progress-value">{item.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Reports