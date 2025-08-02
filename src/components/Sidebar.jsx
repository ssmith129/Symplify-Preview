import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Scissors, 
  FileText, 
  CreditCard, 
  DollarSign 
} from 'lucide-react'
import './Sidebar.css'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { 
    id: 'patient', 
    label: 'Patient', 
    icon: Users,
    submenu: [
      { id: 'patient-list', label: 'Patient List' },
      { id: 'patient-profile', label: 'Patient Profile' },
      { id: 'add-patient', label: 'Add New Patient' }
    ]
  },
  { 
    id: 'doctor', 
    label: 'Doctor', 
    icon: UserCheck,
    submenu: [
      { id: 'doctor-list', label: 'All Doctors' },
      { id: 'doctor-profile', label: 'Doctor Profile' },
      { id: 'add-doctor', label: 'Add New Doctor' },
      { id: 'appointment', label: 'Appointment' }
    ]
  },
  { 
    id: 'emergency', 
    label: 'Emergency', 
    icon: AlertTriangle,
    submenu: [
      { id: 'emergency-form', label: 'Emergency Form' },
      { id: 'emergency-list', label: 'Emergency List' }
    ]
  },
  { id: 'operation', label: 'Operation', icon: Scissors },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'accounts', label: 'Accounts', icon: CreditCard },
  { 
    id: 'expense', 
    label: 'Expense', 
    icon: DollarSign,
    submenu: [
      { id: 'expense-list', label: 'Expense List' },
      { id: 'add-expense', label: 'Add Expense' }
    ]
  }
]

const Sidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const [expandedMenu, setExpandedMenu] = useState(null)

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id)
    } else {
      setCurrentPage(item.id)
      setIsOpen(false)
    }
  }

  const handleSubmenuClick = (submenuId) => {
    setCurrentPage(submenuId)
    setIsOpen(false)
  }

  return (
    <>
      <motion.aside 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="sidebar-header">
          <div className="logo">
            <img src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop" alt="Medico" />
            <span>Medico</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id || 
              (item.submenu && item.submenu.some(sub => sub.id === currentPage))
            const isExpanded = expandedMenu === item.id

            return (
              <div key={item.id} className="menu-item">
                <button
                  className={`menu-button ${isActive ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {item.submenu && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="chevron"
                    >
                      ▼
                    </motion.div>
                  )}
                </button>

                {item.submenu && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="submenu"
                      >
                        {item.submenu.map((subItem) => (
                          <button
                            key={subItem.id}
                            className={`submenu-button ${currentPage === subItem.id ? 'active' : ''}`}
                            onClick={() => handleSubmenuClick(subItem.id)}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </nav>
      </motion.aside>
    </>
  )
}

export default Sidebar