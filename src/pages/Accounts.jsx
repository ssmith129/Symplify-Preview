import React from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, TrendingDown, Star } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import './Accounts.css'

const accountsData = [
  {
    title: 'Profit this Week',
    amount: 25600,
    icon: TrendingUp,
    color: 'success',
    trend: '+12%'
  },
  {
    title: 'Expense this Week',
    amount: 15800,
    icon: TrendingDown,
    color: 'error',
    trend: '+8%'
  },
  {
    title: 'Income this Week',
    amount: 10200,
    icon: DollarSign,
    color: 'primary',
    trend: '+15%'
  }
]

const visitorsData = [
  { day: 'Sat', visitors: 5000 },
  { day: 'Sun', visitors: 3000 },
  { day: 'Mon', visitors: 18000 },
  { day: 'Tue', visitors: 14000 },
  { day: 'Wed', visitors: 25000 },
  { day: 'Thu', visitors: 10000 },
  { day: 'Fri', visitors: 28000 }
]

const expenseBreakdown = [
  { name: 'Salary', value: 30, color: '#F9BB01' },
  { name: 'Equipment', value: 30, color: '#FF6864' },
  { name: 'Rent Expense', value: 15, color: '#C532F9' },
  { name: 'Others', value: 25, color: '#00ACE2' }
]

const reviewsData = [
  {
    id: 1,
    name: 'Benjamin',
    review: 'Excellent visit. This was for a second opinion and an attempt.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  },
  {
    id: 2,
    name: 'Alexander',
    review: 'Great service and professional staff. Highly recommended.',
    rating: 5,
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  }
]

const Accounts = () => {
  return (
    <motion.div 
      className="accounts-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <h1>Accounts Overview</h1>
        <p>Financial summary and performance metrics</p>
      </div>

      <div className="accounts-summary">
        {accountsData.map((account, index) => {
          const Icon = account.icon
          return (
            <motion.div
              key={account.title}
              className={`account-card ${account.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="account-icon">
                <Icon size={24} />
              </div>
              <div className="account-content">
                <h3 className="account-title">{account.title}</h3>
                <div className="account-value-row">
                  <span className="account-value">${account.amount.toLocaleString()}</span>
                  <span className="account-trend">{account.trend}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="accounts-charts">
        <div className="visitors-chart">
          <h3>Weekly Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F5" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#C2C2DD', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#C2C2DD', fontSize: 12 }}
                tickFormatter={(value) => `${value/1000}K`}
              />
              <Tooltip 
                contentStyle={{
                  background: 'white',
                  border: '1px solid #E0E7FE',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`${value.toLocaleString()}`, 'Visitors']}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="url(#gradient)" 
                strokeWidth={3}
                dot={{ fill: '#00ACE2', strokeWidth: 2, r: 4 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00ACE2" />
                  <stop offset="100%" stopColor="#C532F9" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="expense-chart">
          <h3>Expense Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{
                  background: 'white',
                  border: '1px solid #E0E7FE',
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {expenseBreakdown.map((item) => (
              <div key={item.name} className="legend-item">
                <span 
                  className="legend-dot" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="legend-label">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-reviews">
        <h3>Recent Reviews</h3>
        <div className="reviews-list">
          {reviewsData.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-info">
                <img 
                  src={review.image} 
                  alt={review.name}
                  className="reviewer-avatar"
                />
                <div className="review-content">
                  <h4 className="reviewer-name">{review.name}</h4>
                  <p className="review-text">"{review.review}"</p>
                </div>
              </div>
              <div className="review-rating">
                <span className="rating-score">{review.rating}</span>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < review.rating ? '#FFCC00' : 'none'}
                      color={i < review.rating ? '#FFCC00' : '#E0E7FE'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default Accounts