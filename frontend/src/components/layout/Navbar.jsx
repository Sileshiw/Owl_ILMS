function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-button">
          ☰
        </button>

        <div className="page-title">
          <span>Integrated Library Management System</span>
        </div>
      </div>

      <div className="navbar-right">
        <button className="notification-button">
          🔔
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            W
          </div>

          <div className="user-info">
            <strong>Worku</strong>
            <span>Librarian</span>
          </div>

          <span className="dropdown-arrow">⌄</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;