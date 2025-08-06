import { Link } from 'react-router-dom'
import { Home, Plus } from 'lucide-react'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          NextStep Journal
        </Link>
        <div className="navbar-nav">
          <Link to="/" className="nav-link">
            <Home size={20} />
            Home
          </Link>
          <Link to="/create" className="nav-link btn btn-primary">
            <Plus size={20} />
            Share Experience
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 