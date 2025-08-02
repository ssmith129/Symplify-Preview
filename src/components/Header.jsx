import React, { useState } from 'react'
import { Search, Bell, Menu, Plus } from 'lucide-react'
import './Header.css'

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search patients, doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="btn btn-primary add-patient-btn">
          <Plus size={18} />
          Add Patient
        </button>
        
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-profile">
          <img 
            src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop" 
            alt="User" 
            className="user-avatar"
          />
        </div>
      </div>
    </header>
  )
}

export default Header