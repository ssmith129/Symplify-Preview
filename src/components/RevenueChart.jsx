import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { month: 'Jan', income: 1000, expense: 500 },
  { month: 'Feb', income: 1400, expense: 800 },
  { month: 'Mar', income: 1000, expense: 300 },
  { month: 'Apr', income: 1900, expense: 800 },
  { month: 'May', income: 1200, expense: 600 },
  { month: 'Jun', income: 1300, expense: 800 }
]

const RevenueChart = () => {
  return (
    <div>
      <h3 className="section-title">Revenue Overview</h3>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barCategoryGap="20%">
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
          <Bar 
            dataKey="income" 
            fill="#605BFF" 
            radius={[4, 4, 0, 0]}
            name="Income"
          />
          <Bar 
            dataKey="expense" 
            fill="#FF8F6B" 
            radius={[4, 4, 0, 0]}
            name="Expense"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart