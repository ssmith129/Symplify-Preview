import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const data = [
  { month: 'Jan', newPatients: 1000, oldPatients: 500 },
  { month: 'Feb', newPatients: 1400, oldPatients: 800 },
  { month: 'Mar', newPatients: 1000, oldPatients: 300 },
  { month: 'Apr', newPatients: 1900, oldPatients: 800 },
  { month: 'May', newPatients: 1200, oldPatients: 600 },
  { month: 'Jun', newPatients: 1300, oldPatients: 800 },
  { month: 'Jul', newPatients: 1000, oldPatients: 600 },
  { month: 'Aug', newPatients: 1600, oldPatients: 500 },
  { month: 'Sep', newPatients: 1000, oldPatients: 900 },
  { month: 'Oct', newPatients: 1700, oldPatients: 600 },
  { month: 'Nov', newPatients: 1000, oldPatients: 700 },
  { month: 'Dec', newPatients: 600, oldPatients: 200 }
]

const PatientChart = () => {
  return (
    <div>
      <div className="chart-header">
        <h3>Patient History</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot new"></span>
            New Patient
          </div>
          <div className="legend-item">
            <span className="legend-dot old"></span>
            Old Patient
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
          />
          <Line 
            type="monotone" 
            dataKey="newPatients" 
            stroke="#FF55BF" 
            strokeWidth={3}
            dot={{ fill: '#FF55BF', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#FF55BF', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="oldPatients" 
            stroke="#605BFF" 
            strokeWidth={3}
            dot={{ fill: '#605BFF', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#605BFF', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PatientChart