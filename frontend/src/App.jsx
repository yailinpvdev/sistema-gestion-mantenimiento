import { useState } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'equipment', label: 'Equipos', icon: '⚙' },
    { id: 'maintenance', label: 'Mantenimientos', icon: '🔧' },
    { id: 'requests', label: 'Solicitudes', icon: '📋' },
    { id: 'technicians', label: 'Técnicos', icon: '👤' },
  ]

  const stats = [
    {
      title: 'Equipos registrados',
      value: '0',
      description: 'Total de equipos',
    },
    {
      title: 'Mantenimientos pendientes',
      value: '0',
      description: 'Requieren atención',
    },
    {
      title: 'Solicitudes abiertas',
      value: '0',
      description: 'Pendientes de gestión',
    },
    {
      title: 'Técnicos activos',
      value: '0',
      description: 'Personal registrado',
    },
  ]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">M</div>

          <div>
            <h1>ManteniPro</h1>
            <span>Gestión de mantenimiento</span>
          </div>
        </div>

        <nav className="navigation">
          <p className="menu-title">MENÚ PRINCIPAL</p>

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? 'active' : ''
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Sistema de Gestión</p>
          <span>Versión 1.0.0</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Inicio / Dashboard</p>
            <h2>Dashboard</h2>
          </div>

          <div className="user-info">
            <div className="user-avatar">Y</div>

            <div>
              <strong>Administrador</strong>
              <span>Usuario del sistema</span>
            </div>
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <div>
              <p className="eyebrow">SISTEMA DE MANTENIMIENTO</p>

              <h3>
                Bienvenido al sistema de gestión
              </h3>

              <p>
                Administra equipos, mantenimientos, solicitudes y personal
                desde un solo lugar.
              </p>
            </div>

            <button className="primary-button">
              + Nueva solicitud
            </button>
          </div>

          <section className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.title}>
                <div className="stat-header">
                  <span>{stat.title}</span>
                  <div className="stat-icon">◈</div>
                </div>

                <strong>{stat.value}</strong>

                <p>{stat.description}</p>
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="panel">
              <div className="panel-header">
                <div>
                  <h3>Próximos mantenimientos</h3>
                  <p>Programación de actividades</p>
                </div>

                <button className="text-button">
                  Ver todos
                </button>
              </div>

              <div className="empty-state">
                <div className="empty-icon">🔧</div>

                <h4>No hay mantenimientos programados</h4>

                <p>
                  Cuando registres actividades de mantenimiento,
                  aparecerán aquí.
                </p>
              </div>
            </article>

            <article className="panel">
              <div className="panel-header">
                <div>
                  <h3>Solicitudes recientes</h3>
                  <p>Últimas solicitudes registradas</p>
                </div>

                <button className="text-button">
                  Ver todas
                </button>
              </div>

              <div className="empty-state">
                <div className="empty-icon">📋</div>

                <h4>No hay solicitudes registradas</h4>

                <p>
                  Las nuevas solicitudes aparecerán en este espacio.
                </p>
              </div>
            </article>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
