import { NavLink } from "react-router-dom";

function Sidebar() {
  const navigation = [
    {
      section: "MAIN",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "▦",
        },
      ],
    },
    {
      section: "CATALOGUING",
      items: [
        {
          name: "Books",
          path: "/books",
          icon: "📚",
        },
        {
          name: "Authors",
          path: "/authors",
          icon: "✍",
        },
        {
          name: "Publishers",
          path: "/publishers",
          icon: "🏢",
        },
        {
          name: "Subjects",
          path: "/subjects",
          icon: "📖",
        },
        {
          name: "Items",
          path: "/items",
          icon: "📦",
        },
      ],
    },
    {
      section: "LIBRARY SERVICES",
      items: [
        {
          name: "Patrons",
          path: "/patrons",
          icon: "👥",
        },
        {
          name: "Circulation",
          path: "/circulation",
          icon: "🔄",
        },
        {
          name: "Holds",
          path: "/holds",
          icon: "⏳",
        },
      ],
    },
    {
      section: "REPORTING",
      items: [
        {
          name: "Reports",
          path: "/reports",
          icon: "📊",
        },
        {
          name: "Notifications",
          path: "/notifications",
          icon: "🔔",
        },
      ],
    },
    {
      section: "ADMINISTRATION",
      items: [
        {
          name: "Users",
          path: "/users",
          icon: "👤",
        },
        {
          name: "Audit Logs",
          path: "/audit",
          icon: "📝",
        },
        {
          name: "System",
          path: "/system",
          icon: "⚙",
        },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo">🦉</div>

        <div>
          <h1>OWL ILMS</h1>
          <span>Integrated Library</span>
        </div>
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((group) => (
          <div className="nav-section" key={group.section}>
            <div className="nav-section-title">
              {group.section}
            </div>

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="library-status">
          <span className="status-dot"></span>
          <div>
            <strong>System Online</strong>
            <small>Library system is running</small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;