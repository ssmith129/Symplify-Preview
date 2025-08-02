import React from 'react'
import { Star } from 'lucide-react'
import './TopDoctors.css'

const doctorsData = [
  {
    id: 1,
    name: 'Dr. Charlotte',
    specialty: 'Gynecologist',
    rating: 5,
    reviews: 315,
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: 2,
    name: 'Dr. Isabella Ava',
    specialty: 'Medicine Specialist',
    rating: 5,
    reviews: 290,
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: 3,
    name: 'Dr. Olivia Amma',
    specialty: 'Gynecologist',
    rating: 5,
    reviews: 290,
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
]

const TopDoctors = () => {
  return (
    <div>
      <h3 className="section-title">Top Doctors</h3>
      
      <div className="doctors-list">
        {doctorsData.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <div className="doctor-info">
              <img 
                src={doctor.image} 
                alt={doctor.name}
                className="doctor-avatar"
              />
              <div className="doctor-details">
                <h4 className="doctor-name">{doctor.name}</h4>
                <p className="doctor-specialty">{doctor.specialty}</p>
              </div>
            </div>
            
            <div className="doctor-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    fill={i < doctor.rating ? '#FFCC00' : 'none'}
                    color={i < doctor.rating ? '#FFCC00' : '#E0E7FE'}
                  />
                ))}
              </div>
              <span className="review-count">{doctor.reviews} reviews</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopDoctors