import React, { useState } from 'react'
import { Search, Filter, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import './PatientList.css'

const patientsData = [
  {
    id: '#A-122014',
    name: 'Eddy Cusuma',
    checkIn: '26 Jan 2021',
    doctor: 'Charlotte',
    disease: 'Cold & Flu',
    status: 'New Patient',
    statusType: 'primary',
    room: 'D-105',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  },
  {
    id: '#A-122015',
    name: 'Charlene Reed',
    checkIn: '26 Jan 2021',
    doctor: 'Charlotte',
    disease: 'Diabetes',
    status: 'In Treatment',
    statusType: 'warning',
    room: 'D-106',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  },
  {
    id: '#A-122016',
    name: 'Victor Arnold',
    checkIn: '25 Jan 2021',
    doctor: 'Dr. Smith',
    disease: 'Hypertension',
    status: 'Recovered',
    statusType: 'success',
    room: 'D-107',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  },
  {
    id: '#A-122017',
    name: 'Sara Graham',
    checkIn: '24 Jan 2021',
    doctor: 'Dr. Johnson',
    disease: 'Migraine',
    status: 'New Patient',
    statusType: 'primary',
    room: 'D-108',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
  }
]

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatients, setSelectedPatients] = useState([])

  const filteredPatients = patientsData.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.disease.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectPatient = (patientId) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId)
        : [...prev, patientId]
    )
  }

  const handleSelectAll = () => {
    setSelectedPatients(
      selectedPatients.length === filteredPatients.length 
        ? [] 
        : filteredPatients.map(p => p.id)
    )
  }

  return (
    <motion.div 
      className="patient-list-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div className="header-left">
          <h1>Patient List</h1>
          <p>Manage and view all patient records</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-outline">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="search-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search patients by name, ID, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="patients-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                    onChange={handleSelectAll}
                  />
                  Patient ID
                </th>
                <th>Patient Name</th>
                <th>Date Check In</th>
                <th>Doctor Assigned</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Room No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="patient-row"
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={() => handleSelectPatient(patient.id)}
                    />
                    {patient.id}
                  </td>
                  <td>
                    <div className="patient-info">
                      <img 
                        src={patient.image} 
                        alt={patient.name}
                        className="patient-avatar"
                      />
                      <span className="patient-name">{patient.name}</span>
                    </div>
                  </td>
                  <td>{patient.checkIn}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.disease}</td>
                  <td>
                    <span className={`badge badge-${patient.statusType}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>{patient.room}</td>
                  <td>
                    <button className="action-btn">
                      <Eye size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <span className="pagination-info">
          Showing {filteredPatients.length} of {patientsData.length} patients
        </span>
        <div className="pagination-controls">
          <button className="btn btn-outline">Previous</button>
          <button className="btn btn-primary">1</button>
          <button className="btn btn-outline">2</button>
          <button className="btn btn-outline">3</button>
          <button className="btn btn-outline">Next</button>
        </div>
      </div>
    </motion.div>
  )
}

export default PatientList