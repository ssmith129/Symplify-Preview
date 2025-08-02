import React from 'react'
import './RecentActivity.css'

const activityData = [
  {
    id: 1,
    patientName: 'Roby Romio',
    location: 'Los Angeles, USA',
    condition: 'Insomnia',
    status: 'In Treatment',
    statusType: 'warning',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  },
  {
    id: 2,
    patientName: 'Sarah Johnson',
    location: 'New York, USA',
    condition: 'Diabetes',
    status: 'New Patient',
    statusType: 'primary',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  },
  {
    id: 3,
    patientName: 'Mike Chen',
    location: 'San Francisco, USA',
    condition: 'Covid-19',
    status: 'Recovered',
    statusType: 'success',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  }
]

const RecentActivity = () => {
  return (
    <div>
      <h3 className="section-title">Recent Patient Activity</h3>
      
      <div className="activity-list">
        {activityData.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="patient-info">
              <img 
                src={activity.image} 
                alt={activity.patientName}
                className="patient-avatar"
              />
              <div className="patient-details">
                <h4 className="patient-name">{activity.patientName}</h4>
                <p className="patient-location">{activity.location}</p>
              </div>
            </div>
            
            <div className="condition">
              <span className="condition-text">{activity.condition}</span>
            </div>
            
            <div className="status">
              <span className={`badge badge-${activity.statusType}`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity