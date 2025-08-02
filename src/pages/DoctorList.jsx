import React, { useState } from 'react'
import { Search, Star, Clock, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import './DoctorList.css'

const doctorsData = [
  {
    id: 1,
    name: 'Dr. Sara Graham',
    specialty: 'Medicine Specialist',
    rating: 5,
    reviews: 315,
    schedule: '04:00 PM - 09:00 PM',
    description: 'George A. Sample, MD, FCCP, is a Medical graduate George Washington University internal medicine.',
    image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Dr. Fillmore',
    specialty: 'Gynecologist',
    rating: 5,
    reviews: 290,
    schedule: '04:00 PM - 09:00 PM',
    description: 'Experienced gynecologist with over 15 years of practice in women\'s health and reproductive medicine.',
    image: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Dr. Swallow',
    specialty: 'Physical Therapy',
    rating: 5,
    reviews: 275,
    schedule: '08:00 AM - 02:00 PM',
    description: 'Specialized in rehabilitation and physical therapy with focus on sports medicine and injury recovery.',
    image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Dr. Crownover',
    specialty: 'Audiology',
    rating: 4,
    reviews: 198,
    schedule: '10:00 AM - 04:00 PM',
    description: 'Expert audiologist specializing in hearing disorders and advanced hearing aid technology.',
    image: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  }
]

const DoctorList = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredDoctors = doctorsData.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div 
      className="doctor-list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div className="header-left">
          <h1>All Doctors</h1>
          <p>Browse and manage doctor profiles</p>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="doctors-grid">
        {filteredDoctors.map((doctor, index) => (
          <motion.div
            key={doctor.id}
            className="doctor-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="doctor-image-section">
              <img 
                src={doctor.image} 
                alt={doctor.name}
                className="doctor-image"
              />
            </div>
            
            <div className="doctor-content">
              <div className="doctor-header">
                <h3 className="doctor-name">{doctor.name}</h3>
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
                  <span className="review-count">({doctor.reviews})</span>
                </div>
              </div>
              
              <p className="doctor-specialty">{doctor.specialty}</p>
              
              <div className="doctor-schedule">
                <Clock size={16} />
                <span>{doctor.schedule}</span>
              </div>
              
              <p className="doctor-description">{doctor.description}</p>
              
              <button className="btn btn-primary view-profile-btn">
                <Eye size={16} />
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default DoctorList