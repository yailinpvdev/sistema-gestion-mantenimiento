import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [totalEquipos, setTotalEquipos] = useState(0)
  const [equipos, setEquipos] = useState([])

  // Formulario de nueva solicitud
  const [mostrarFormularioSolicitud, setMostrarFormularioSolicitud] =
    useState(false)

  const [formularioSolicitud, setFormularioSolicitud] = useState({
    equipo_id: '',
    prioridad: 'media',
    descripcion: '',
  })

  const [guardandoSolicitud, setGuardandoSolicitud] = useState(false)

  // Obtener los equipos desde el backend
  useEffect(() => {
    obtenerEquipos()
  }, [])

  const obtenerEquipos = () => {
    fetch('http://localhost:3000/api/equipos')
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setEquipos(datos)
        setTotalEquipos(datos.length)
      })
      .catch((error) => {
        console.error('Error al obtener equipos:', error)
      })
  }

  // Abrir formulario de solicitud
  const abrirFormularioSolicitud = () => {
    setFormularioSolicitud({
      equipo_id: '',
      prioridad: 'media',
      descripcion: '',
    })

    setMostrarFormularioSolicitud(true)
  }

  // Cerrar formulario
  const cerrarFormularioSolicitud = () => {
    if (!guardandoSolicitud) {
      setMostrarFormularioSolicitud(false)
    }
  }

  // Cambiar valores del formulario
  const manejarCambioSolicitud = (evento) => {
    const { name, value } = evento.target

    setFormularioSolicitud((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }))
  }

  // Crear solicitud
  const crearSolicitud = async (evento) => {
    evento.preventDefault()

    if (!formularioSolicitud.equipo_id) {
      alert('Por favor selecciona un equipo.')
      return
    }

    if (!formularioSolicitud.descripcion.trim()) {
      alert('Por favor escribe una descripción.')
      return
    }

    try {
      setGuardandoSolicitud(true)

      const respuesta = await fetch(
        'http://localhost:3000/api/solicitudes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            equipo_id: Number(formularioSolicitud.equipo_id),
            prioridad: formularioSolicitud.prioridad,
            descripcion: formularioSolicitud.descripcion,
          }),
        },
      )

      const datos = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje || 'No se pudo crear la solicitud',
        )
      }

      alert('Solicitud creada correctamente.')

      setMostrarFormularioSolicitud(false)

      setFormularioSolicitud({
        equipo_id: '',
        prioridad: 'media',
        descripcion: '',
      })
    } catch (error) {
      console.error('Error al crear solicitud:', error)
      alert(error.message)
    } finally {
      setGuardandoSolicitud(false)
    }
  }

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
      value: totalEquipos,
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

      {/* BARRA LATERAL */}
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">

        {/* ENCABEZADO */}
        <header className="topbar">
          <div>
            <p className="breadcrumb">
              Inicio /{' '}
              {activeSection === 'dashboard'
                ? 'Dashboard'
                : activeSection === 'equipment'
                  ? 'Equipos'
                  : activeSection === 'maintenance'
                    ? 'Mantenimientos'
                    : activeSection === 'requests'
                      ? 'Solicitudes'
                      : 'Técnicos'}
            </p>

            <h2>
              {activeSection === 'dashboard'
                ? 'Dashboard'
                : activeSection === 'equipment'
                  ? 'Equipos'
                  : activeSection === 'maintenance'
                    ? 'Mantenimientos'
                    : activeSection === 'requests'
                      ? 'Solicitudes'
                      : 'Técnicos'}
            </h2>
          </div>

          <div className="user-info">
            <div className="user-avatar">Y</div>

            <div>
              <strong>Administrador</strong>
              <span>Usuario del sistema</span>
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
        {activeSection === 'dashboard' && (
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

              <button
                className="primary-button"
                onClick={abrirFormularioSolicitud}
              >
                + Nueva solicitud
              </button>
            </div>

            {/* ESTADÍSTICAS */}
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

            {/* PANELES */}
            <section className="dashboard-grid">

              <article className="panel">
                <div className="panel-header">
                  <div>
                    <h3>Próximos mantenimientos</h3>
                    <p>Programación de actividades</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setActiveSection('maintenance')}
                  >
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

                  <button
                    className="text-button"
                    onClick={() => setActiveSection('requests')}
                  >
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
        )}

        {/* EQUIPOS */}
        {activeSection === 'equipment' && (
          <section className="content">

            <div className="welcome">
              <div>
                <p className="eyebrow">GESTIÓN DE EQUIPOS</p>

                <h3>
                  Equipos registrados
                </h3>

                <p>
                  Consulta y administra los equipos registrados en el sistema.
                </p>
              </div>

              <button className="primary-button">
                + Nuevo equipo
              </button>
            </div>

            <section className="panel">

              <div className="panel-header">
                <div>
                  <h3>Listado de equipos</h3>
                  <p>
                    {totalEquipos} equipo(s) registrado(s)
                  </p>
                </div>
              </div>

              {equipos.length === 0 ? (

                <div className="empty-state">
                  <div className="empty-icon">⚙</div>

                  <h4>No hay equipos registrados</h4>

                  <p>
                    Cuando registres un equipo, aparecerá en este espacio.
                  </p>
                </div>

              ) : (

                <div className="table-container">

                  <table className="equipment-table">

                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>N.º de serie</th>
                        <th>Estado</th>
                        <th>Ubicación</th>
                      </tr>
                    </thead>

                    <tbody>
                      {equipos.map((equipo) => (
                        <tr key={equipo.id}>

                          <td>{equipo.id}</td>

                          <td>
                            <strong>{equipo.nombre}</strong>
                          </td>

                          <td>{equipo.tipo}</td>

                          <td>{equipo.marca}</td>

                          <td>{equipo.modelo}</td>

                          <td>{equipo.numero_serie}</td>

                          <td>
                            <span
                              className={`status ${
                                equipo.estado === 'activo'
                                  ? 'status-active'
                                  : 'status-inactive'
                              }`}
                            >
                              {equipo.estado}
                            </span>
                          </td>

                          <td>{equipo.ubicacion}</td>

                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>
              )}

            </section>
          </section>
        )}

        {/* MANTENIMIENTOS */}
        {activeSection === 'maintenance' && (
          <section className="content">

            <div className="welcome">
              <div>
                <p className="eyebrow">GESTIÓN DE MANTENIMIENTO</p>

                <h3>
                  Mantenimientos
                </h3>

                <p>
                  Administra las actividades de mantenimiento de los equipos.
                </p>
              </div>

              <button className="primary-button">
                + Nuevo mantenimiento
              </button>
            </div>

            <section className="panel">
              <div className="empty-state">
                <div className="empty-icon">🔧</div>

                <h4>Módulo de mantenimientos</h4>

                <p>
                  Aquí mostraremos los mantenimientos registrados.
                </p>
              </div>
            </section>

          </section>
        )}

        {/* SOLICITUDES */}
        {activeSection === 'requests' && (
          <section className="content">

            <div className="welcome">
              <div>
                <p className="eyebrow">GESTIÓN DE SOLICITUDES</p>

                <h3>
                  Solicitudes
                </h3>

                <p>
                  Administra las solicitudes de mantenimiento.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={abrirFormularioSolicitud}
              >
                + Nueva solicitud
              </button>
            </div>

            <section className="panel">
              <div className="empty-state">
                <div className="empty-icon">📋</div>

                <h4>Módulo de solicitudes</h4>

                <p>
                  Aquí mostraremos las solicitudes registradas.
                </p>
              </div>
            </section>

          </section>
        )}

        {/* TÉCNICOS */}
        {activeSection === 'technicians' && (
          <section className="content">

            <div className="welcome">
              <div>
                <p className="eyebrow">GESTIÓN DE PERSONAL</p>

                <h3>
                  Técnicos
                </h3>

                <p>
                  Administra el personal técnico registrado en el sistema.
                </p>
              </div>

              <button className="primary-button">
                + Nuevo técnico
              </button>
            </div>

            <section className="panel">
              <div className="empty-state">
                <div className="empty-icon">👤</div>

                <h4>Módulo de técnicos</h4>

                <p>
                  Aquí mostraremos los técnicos registrados.
                </p>
              </div>
            </section>

          </section>
        )}

      </main>

      {/* ============================= */}
      {/* MODAL NUEVA SOLICITUD */}
      {/* ============================= */}

      {mostrarFormularioSolicitud && (
        <div
          className="modal-overlay"
          onClick={cerrarFormularioSolicitud}
        >
          <div
            className="modal"
            onClick={(evento) => evento.stopPropagation()}
          >

            <div className="modal-header">
              <div>
                <p className="eyebrow">GESTIÓN DE SOLICITUDES</p>

                <h3>Nueva solicitud</h3>

                <p>
                  Registra una nueva solicitud de mantenimiento.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={cerrarFormularioSolicitud}
                disabled={guardandoSolicitud}
              >
                ×
              </button>
            </div>

            <form onSubmit={crearSolicitud}>

              {/* EQUIPO */}
              <div className="form-group">
                <label htmlFor="equipo_id">
                  Equipo
                </label>

                <select
                  id="equipo_id"
                  name="equipo_id"
                  value={formularioSolicitud.equipo_id}
                  onChange={manejarCambioSolicitud}
                  required
                >
                  <option value="">
                    Selecciona un equipo
                  </option>

                  {equipos.map((equipo) => (
                    <option
                      key={equipo.id}
                      value={equipo.id}
                    >
                      {equipo.nombre} - {equipo.marca} {equipo.modelo}
                    </option>
                  ))}
                </select>

                {equipos.length === 0 && (
                  <small className="form-help">
                    Primero debes registrar al menos un equipo.
                  </small>
                )}
              </div>

              {/* PRIORIDAD */}
              <div className="form-group">
                <label htmlFor="prioridad">
                  Prioridad
                </label>

                <select
                  id="prioridad"
                  name="prioridad"
                  value={formularioSolicitud.prioridad}
                  onChange={manejarCambioSolicitud}
                >
                  <option value="baja">
                    Baja
                  </option>

                  <option value="media">
                    Media
                  </option>

                  <option value="alta">
                    Alta
                  </option>

                  <option value="urgente">
                    Urgente
                  </option>
                </select>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="form-group">
                <label htmlFor="descripcion">
                  Descripción
                </label>

                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formularioSolicitud.descripcion}
                  onChange={manejarCambioSolicitud}
                  placeholder="Describe el problema o mantenimiento que necesita el equipo..."
                  rows="5"
                  required
                />
              </div>

              {/* BOTONES */}
              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={cerrarFormularioSolicitud}
                  disabled={guardandoSolicitud}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    guardandoSolicitud ||
                    equipos.length === 0
                  }
                >
                  {guardandoSolicitud
                    ? 'Guardando...'
                    : 'Crear solicitud'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

export default App
