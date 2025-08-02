import React from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, Bed, Activity } from 'lucide-react'
import './StatsCards.css'

const statsData = [
  {
    id: 1,
    title: "Today's Patients",
    value: 159,
    icon: Users,
    color: 'primary',
    trend: '+12%'
  },
  {
    id: 2,
    title: "Our Doctors",
    value: 18,
    icon: UserCheck,
    color: 'secondary',
    trend: '+2%'
  },
  {
    id: 3,
    title: "Available Beds",
    value: 42,
    icon: Bed,
    color: 'warning',
    trend: '-5%'
  },
  {
    id: 4,
    title: "Today's Operations",
    value: 10,
    icon: Activity,
    color: 'success',
    trend: '+8%'
  }
]

const StatsCards = () => {
  return (
    <div className="stats-grid">
      {statsData.map((stat, index) => {
        const Icon = stat.icon
        
        return (
          <motion.div
            key={stat.id}
            className={`stat-card ${stat.color}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="stat-icon">
              <Icon size={24} />
            </div>
            
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default StatsCards