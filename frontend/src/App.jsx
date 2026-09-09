import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000/api";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  // =========================
  // EQUIPOS
  // =========================

  const [equipos, setEquipos] = useState([]);

  const [mostrarFormularioEquipo, setMostrarFormularioEquipo] = useState(false);

  const [formularioEquipo, setFormularioEquipo] = useState({
    nombre: "",
    tipo: "",
    marca: "",
    modelo: "",
    numero_serie: "",
    estado: "activo",
    ubicacion: "",
  });

  const [guardandoEquipo, setGuardandoEquipo] = useState(false);

  // =========================
  // SOLICITUDES
  // =========================

  const [solicitudes, setSolicitudes] = useState([]);

  const [mostrarFormularioSolicitud, setMostrarFormularioSolicitud] =
    useState(false);

  const [formularioSolicitud, setFormularioSolicitud] = useState({
    equipo_id: "",
    titulo: "",
    descripcion: "",
    prioridad: "media",
    estado: "pendiente",
  });

  const [guardandoSolicitud, setGuardandoSolicitud] = useState(false);

  // =========================
  // MANTENIMIENTOS
  // =========================

  const [mantenimientos, setMantenimientos] = useState([]);

  const [mostrarFormularioMantenimiento, setMostrarFormularioMantenimiento] =
    useState(false);

  const [formularioMantenimiento, setFormularioMantenimiento] = useState({
    equipo_id: "",
    tecnico_id: "",
    tipo: "preventivo",
    fecha_mantenimiento: "",
    descripcion: "",
    estado: "programado",
  });

  const [guardandoMantenimiento, setGuardandoMantenimiento] = useState(false);
  const [, setMantenimientoEditando] = useState(null);
  // =========================
  // OBTENER EQUIPOS
  // =========================

  const obtenerEquipos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/equipos`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los equipos");
      }

      const datos = await respuesta.json();

      setEquipos(datos);
    } catch (error) {
      console.error("Error al obtener equipos:", error);
    }
  };

  // =========================
  // OBTENER SOLICITUDES
  // =========================

  const obtenerSolicitudes = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/solicitudes`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener las solicitudes");
      }

      const datos = await respuesta.json();

      setSolicitudes(datos);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    }
  };

  // =========================
  // OBTENER MANTENIMIENTOS
  // =========================

  const obtenerMantenimientos = async () => {
    try {
      const respuesta = await fetch(`${API_URL}/mantenimientos`);

      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los mantenimientos");
      }

      const datos = await respuesta.json();

      setMantenimientos(datos);
    } catch (error) {
      console.error("Error al obtener mantenimientos:", error);
    }
  };

  // =========================
  // CARGAR DATOS AL INICIAR
  // =========================abrirFormularioMantenimiento
  // Se hace mediante callbacks asíncronos
  // para evitar el error de setState dentro
  // del cuerpo directo del useEffect.

  useEffect(() => {
    let componenteActivo = true;

    const cargarDatosIniciales = async () => {
      try {
        const [
          respuestaEquipos,
          respuestaSolicitudes,
          respuestaMantenimientos,
        ] = await Promise.all([
          fetch(`${API_URL}/equipos`),
          fetch(`${API_URL}/solicitudes`),
          fetch(`${API_URL}/mantenimientos`),
        ]);

        if (!respuestaEquipos.ok) {
          throw new Error("No se pudieron obtener los equipos");
        }

        if (!respuestaSolicitudes.ok) {
          throw new Error("No se pudieron obtener las solicitudes");
        }

        if (!respuestaMantenimientos.ok) {
          throw new Error("No se pudieron obtener los mantenimientos");
        }

        const [datosEquipos, datosSolicitudes, datosMantenimientos] =
          await Promise.all([
            respuestaEquipos.json(),
            respuestaSolicitudes.json(),
            respuestaMantenimientos.json(),
          ]);

        if (componenteActivo) {
          setEquipos(datosEquipos);
          setSolicitudes(datosSolicitudes);
          setMantenimientos(datosMantenimientos);
        }
      } catch (error) {
        console.error("Error al cargar los datos iniciales:", error);
      }
    };

    cargarDatosIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  // =========================
  // FORMULARIO EQUIPO
  // =========================

  const abrirFormularioEquipo = () => {
    setFormularioEquipo({
      nombre: "",
      tipo: "",
      marca: "",
      modelo: "",
      numero_serie: "",
      estado: "activo",
      ubicacion: "",
    });

    setMostrarFormularioEquipo(true);
  };

  const cerrarFormularioEquipo = () => {
    if (!guardandoEquipo) {
      setMostrarFormularioEquipo(false);
    }
  };

  const manejarCambioEquipo = (evento) => {
    const { name, value } = evento.target;

    setFormularioEquipo((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }));
  };

  // =========================
  // CREAR EQUIPO
  // =========================

  const crearEquipo = async (evento) => {
    evento.preventDefault();

    if (!formularioEquipo.nombre.trim()) {
      alert("Por favor escribe el nombre del equipo.");
      return;
    }

    if (!formularioEquipo.tipo.trim()) {
      alert("Por favor escribe el tipo de equipo.");
      return;
    }

    try {
      setGuardandoEquipo(true);

      const respuesta = await fetch(`${API_URL}/equipos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formularioEquipo),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo registrar el equipo.");
      }

      alert("Equipo registrado correctamente.");

      setMostrarFormularioEquipo(false);

      await obtenerEquipos();

      setActiveSection("equipment");
    } catch (error) {
      console.error("Error al crear equipo:", error);

      alert(error.message || "Ocurrió un error al registrar el equipo.");
    } finally {
      setGuardandoEquipo(false);
    }
  };

  // =========================
  // FORMULARIO SOLICITUD
  // =========================

  const abrirFormularioSolicitud = () => {
    setFormularioSolicitud({
      equipo_id: "",
      titulo: "",
      descripcion: "",
      prioridad: "media",
      estado: "pendiente",
    });

    setMostrarFormularioSolicitud(true);
  };

  const cerrarFormularioSolicitud = () => {
    if (!guardandoSolicitud) {
      setMostrarFormularioSolicitud(false);
    }
  };

  const manejarCambioSolicitud = (evento) => {
    const { name, value } = evento.target;

    setFormularioSolicitud((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }));
  };

  // =========================
  // CREAR SOLICITUD
  // =========================

  const crearSolicitud = async (evento) => {
    evento.preventDefault();

    if (!formularioSolicitud.equipo_id) {
      alert("Por favor selecciona un equipo.");
      return;
    }

    if (!formularioSolicitud.titulo.trim()) {
      alert("Por favor escribe el título de la solicitud.");
      return;
    }

    if (!formularioSolicitud.descripcion.trim()) {
      alert("Por favor escribe una descripción.");
      return;
    }

    try {
      setGuardandoSolicitud(true);

      const respuesta = await fetch(`${API_URL}/solicitudes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipo_id: Number(formularioSolicitud.equipo_id),

          // Usuario administrador actual
          usuario_id: 1,

          titulo: formularioSolicitud.titulo,
          descripcion: formularioSolicitud.descripcion,
          prioridad: formularioSolicitud.prioridad,
          estado: formularioSolicitud.estado,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo crear la solicitud.");
      }

      alert("Solicitud creada correctamente.");

      setMostrarFormularioSolicitud(false);

      await obtenerSolicitudes();
    } catch (error) {
      console.error("Error al crear solicitud:", error);

      alert(error.message || "Ocurrió un error al crear la solicitud.");
    } finally {
      setGuardandoSolicitud(false);
    }
  };

  // =========================
  // FORMULARIO MANTENIMIENTO
  // =========================

  const abrirFormularioMantenimiento = () => {
    setFormularioMantenimiento({
      equipo_id: "",
      tecnico_id: "",
      tipo: "preventivo",
      fecha_mantenimiento: "",
      descripcion: "",
      estado: "programado",
    });

    setMostrarFormularioMantenimiento(true);
  };

  const cerrarFormularioMantenimiento = () => {
    if (!guardandoMantenimiento) {
      setMostrarFormularioMantenimiento(false);
    }
  };

  const editarMantenimiento = (mantenimiento) => {
    setMantenimientoEditando(mantenimiento);

    setFormularioMantenimiento({
      equipo_id: mantenimiento.equipo_id || "",
      tecnico_id: mantenimiento.tecnico_id || "",
      tipo: mantenimiento.tipo || "preventivo",
      fecha_mantenimiento: mantenimiento.fecha_mantenimiento || "",
      descripcion: mantenimiento.descripcion || "",
      estado: mantenimiento.estado || "programado",
    });

    setMostrarFormularioMantenimiento(true);
  };

  const manejarCambioMantenimiento = (evento) => {
    const { name, value } = evento.target;

    setFormularioMantenimiento((formularioAnterior) => ({
      ...formularioAnterior,
      [name]: value,
    }));
  };

  // =========================
  // CREAR MANTENIMIENTO
  // =========================

  const crearMantenimiento = async (evento) => {
    evento.preventDefault();

    if (!formularioMantenimiento.equipo_id) {
      alert("Por favor selecciona un equipo.");
      return;
    }

    if (!formularioMantenimiento.tecnico_id) {
      alert("Por favor escribe el ID del técnico.");
      return;
    }

    if (!formularioMantenimiento.fecha_mantenimiento) {
      alert("Por favor selecciona una fecha de mantenimiento.");
      return;
    }

    if (!formularioMantenimiento.descripcion.trim()) {
      alert("Por favor escribe una descripción.");
      return;
    }

    try {
      setGuardandoMantenimiento(true);

      const respuesta = await fetch(`${API_URL}/mantenimientos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipo_id: Number(formularioMantenimiento.equipo_id),
          tecnico_id: Number(formularioMantenimiento.tecnico_id),
          fecha_mantenimiento: formularioMantenimiento.fecha_mantenimiento,
          tipo: formularioMantenimiento.tipo,
          descripcion: formularioMantenimiento.descripcion,
          estado: formularioMantenimiento.estado,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo crear el mantenimiento.");
      }

      alert("Mantenimiento creado correctamente.");

      setMostrarFormularioMantenimiento(false);

      await obtenerMantenimientos();
    } catch (error) {
      console.error("Error al crear mantenimiento:", error);

      alert(error.message || "Ocurrió un error al crear el mantenimiento.");
    } finally {
      setGuardandoMantenimiento(false);
    }
  };

  // =========================
  // NAVEGACIÓN
  // =========================

  const cambiarSeccion = (seccion) => {
    setActiveSection(seccion);

    setMostrarFormularioEquipo(false);
    setMostrarFormularioSolicitud(false);
    setMostrarFormularioMantenimiento(false);
  };

  // =========================
  // MENÚ
  // =========================

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "▦",
    },
    {
      id: "equipment",
      label: "Equipos",
      icon: "⚙",
    },
    {
      id: "maintenance",
      label: "Mantenimientos",
      icon: "🔧",
    },
    {
      id: "requests",
      label: "Solicitudes",
      icon: "📋",
    },
    {
      id: "technicians",
      label: "Técnicos",
      icon: "👤",
    },
  ];

  // =========================
  // ESTADÍSTICAS
  // =========================

  const solicitudesPendientes = solicitudes.filter(
    (solicitud) =>
      solicitud.estado === "pendiente" || solicitud.estado === "abierta",
  ).length;

  const mantenimientosPendientes = mantenimientos.filter(
    (mantenimiento) =>
      mantenimiento.estado === "programado" ||
      mantenimiento.estado === "pendiente" ||
      mantenimiento.estado === "en_proceso",
  ).length;

  const stats = [
    {
      title: "Equipos registrados",
      value: equipos.length,
      description: "Total de equipos",
      icon: "◈",
    },
    {
      title: "Mantenimientos pendientes",
      value: mantenimientosPendientes,
      description: "Requieren atención",
      icon: "🔧",
    },
    {
      title: "Solicitudes abiertas",
      value: solicitudesPendientes,
      description: "Pendientes de gestión",
      icon: "📋",
    },
    {
      title: "Técnicos activos",
      value: "0",
      description: "Personal registrado",
      icon: "👤",
    },
  ];

  // =========================
  // RENDER EQUIPOS
  // =========================

  const renderEquipos = () => {
    return (
      <>
        <div className="page-header">
          <div>
            <p className="eyebrow">GESTIÓN DE EQUIPOS</p>

            <h1>Equipos registrados</h1>

            <p className="page-description">
              Consulta y administra los equipos registrados en el sistema.
            </p>
          </div>

          <button className="primary-button" onClick={abrirFormularioEquipo}>
            + Nuevo equipo
          </button>
        </div>

        <section className="panel equipment-panel">
          <div className="panel-header">
            <div>
              <h2>Listado de equipos</h2>

              <p>
                {equipos.length}{" "}
                {equipos.length === 1
                  ? "equipo registrado"
                  : "equipos registrados"}
              </p>
            </div>
          </div>

          {equipos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⚙</div>

              <h3>No hay equipos registrados</h3>

              <p>Cuando registres un equipo, aparecerá en este espacio.</p>

              <button
                className="secondary-button"
                onClick={abrirFormularioEquipo}
              >
                Registrar primer equipo
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>N.º serie</th>
                    <th>Estado</th>
                    <th>Ubicación</th>
                  </tr>
                </thead>

                <tbody>
                  {equipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td>
                        <strong>{equipo.nombre}</strong>
                      </td>

                      <td>{equipo.tipo}</td>

                      <td>{equipo.marca || "—"}</td>

                      <td>{equipo.modelo || "—"}</td>

                      <td>{equipo.numero_serie || "—"}</td>

                      <td>
                        <span
                          className={`status-badge ${
                            equipo.estado === "activo"
                              ? "status-active"
                              : "status-inactive"
                          }`}
                        >
                          {equipo.estado}
                        </span>
                      </td>

                      <td>{equipo.ubicacion || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  };

  // =========================
  // RENDER SOLICITUDES
  // =========================

  const renderSolicitudes = () => {
    return (
      <>
        <div className="page-header">
          <div>
            <p className="eyebrow">GESTIÓN DE SOLICITUDES</p>

            <h1>Solicitudes</h1>

            <p className="page-description">
              Registra y administra las solicitudes de mantenimiento.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={abrirFormularioSolicitud}
            disabled={equipos.length === 0}
          >
            + Nueva solicitud
          </button>
        </div>

        {equipos.length === 0 && (
          <div className="info-message">
            <strong>Primero registra un equipo.</strong>

            <span>
              Necesitas al menos un equipo registrado para crear una solicitud
              de mantenimiento.
            </span>

            <button
              className="secondary-button"
              onClick={() => {
                setActiveSection("equipment");
              }}
            >
              Ir a equipos
            </button>
          </div>
        )}

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Solicitudes registradas</h2>

              <p>
                {solicitudes.length}{" "}
                {solicitudes.length === 1
                  ? "solicitud registrada"
                  : "solicitudes registradas"}
              </p>
            </div>
          </div>

          {solicitudes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>

              <h3>No hay solicitudes registradas</h3>

              <p>Las nuevas solicitudes aparecerán en este espacio.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Equipo</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {solicitudes.map((solicitud) => {
                    const equipo = equipos.find(
                      (item) => Number(item.id) === Number(solicitud.equipo_id),
                    );

                    return (
                      <tr key={solicitud.id}>
                        <td>
                          <strong>{solicitud.titulo}</strong>
                        </td>

                        <td>
                          {equipo
                            ? equipo.nombre
                            : `Equipo #${solicitud.equipo_id}`}
                        </td>

                        <td>
                          <span className="priority-badge">
                            {solicitud.prioridad}
                          </span>
                        </td>

                        <td>
                          <span className="status-badge status-active">
                            {solicitud.estado}
                          </span>
                        </td>

                        <td>
                          {solicitud.fecha_solicitud
                            ? new Date(
                                solicitud.fecha_solicitud,
                              ).toLocaleDateString("es-CO")
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  };

  // =========================
  // RENDER MANTENIMIENTOS
  // =========================

  const renderMantenimientos = () => {
    return (
      <>
        <div className="page-header">
          <div>
            <p className="eyebrow">GESTIÓN DE MANTENIMIENTOS</p>

            <h1>Mantenimientos</h1>

            <p className="page-description">
              Consulta y administra los mantenimientos registrados en el
              sistema.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={abrirFormularioMantenimiento}
            disabled={equipos.length === 0}
          >
            + Nuevo mantenimiento
          </button>
        </div>

        {equipos.length === 0 && (
          <div className="info-message">
            <strong>Primero registra un equipo.</strong>

            <span>
              Necesitas al menos un equipo registrado para crear un
              mantenimiento.
            </span>

            <button
              className="secondary-button"
              onClick={() => setActiveSection("equipment")}
            >
              Ir a equipos
            </button>
          </div>
        )}

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Listado de mantenimientos</h2>

              <p>
                {mantenimientos.length}{" "}
                {mantenimientos.length === 1
                  ? "mantenimiento registrado"
                  : "mantenimientos registrados"}
              </p>
            </div>
          </div>

          {mantenimientos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔧</div>

              <h3>No hay mantenimientos registrados</h3>

              <p>
                Cuando registres un mantenimiento, aparecerá en este espacio.
              </p>

              {equipos.length > 0 && (
                <button
                  className="secondary-button"
                  onClick={abrirFormularioMantenimiento}
                >
                  Registrar mantenimiento
                </button>
              )}
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Técnico</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {mantenimientos.map((mantenimiento) => {
                    const equipo = equipos.find(
                      (item) =>
                        Number(item.id) === Number(mantenimiento.equipo_id),
                    );

                    return (
                      <tr key={mantenimiento.id}>
                        <td>
                          <strong>
                            {mantenimiento.equipo_nombre ||
                              (equipo
                                ? equipo.nombre
                                : `Equipo #${mantenimiento.equipo_id}`)}
                          </strong>
                        </td>

                        <td>
                          {mantenimiento.tecnico_id
                            ? `Técnico #${mantenimiento.tecnico_id}`
                            : "—"}
                        </td>

                        <td>{mantenimiento.tipo || "—"}</td>

                        <td>{mantenimiento.descripcion || "—"}</td>

                        <td>
                          {mantenimiento.fecha_mantenimiento
                            ? new Date(
                                mantenimiento.fecha_mantenimiento,
                              ).toLocaleDateString("es-CO")
                            : "—"}
                        </td>

                        <td>
                          <span className="status-badge status-active">
                            {mantenimiento.estado || "—"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="secondary-button"
                            onClick={() => editarMantenimiento(mantenimiento)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  };

  // =========================
  // DASHBOARD
  // =========================

  const renderDashboard = () => {
    return (
      <>
        <div className="welcome">
          <div>
            <p className="eyebrow">SISTEMA DE MANTENIMIENTO</p>

            <h1>Bienvenido al sistema de gestión</h1>

            <p>
              Administra equipos, mantenimientos, solicitudes y personal desde
              un solo lugar.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={abrirFormularioSolicitud}
            disabled={equipos.length === 0}
          >
            + Nueva solicitud
          </button>
        </div>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.title}>
              <div className="stat-header">
                <span>{stat.title}</span>

                <div className="stat-icon">{stat.icon}</div>
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
                <h2>Próximos mantenimientos</h2>

                <p>Programación de actividades</p>
              </div>

              <button
                className="text-button"
                onClick={() => cambiarSeccion("maintenance")}
              >
                Ver todos
              </button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">🔧</div>

              <h3>No hay mantenimientos programados</h3>

              <p>
                Cuando registres actividades de mantenimiento, aparecerán aquí.
              </p>
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <h2>Solicitudes recientes</h2>

                <p>Últimas solicitudes registradas</p>
              </div>

              <button
                className="text-button"
                onClick={() => cambiarSeccion("requests")}
              >
                Ver todas
              </button>
            </div>

            {solicitudes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>

                <h3>No hay solicitudes registradas</h3>

                <p>Las nuevas solicitudes aparecerán en este espacio.</p>
              </div>
            ) : (
              <div className="recent-list">
                {solicitudes.slice(0, 5).map((solicitud) => (
                  <div className="recent-item" key={solicitud.id}>
                    <div>
                      <strong>{solicitud.titulo}</strong>

                      <span>{solicitud.descripcion}</span>
                    </div>

                    <span className="priority-badge">
                      {solicitud.prioridad}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </>
    );
  };

  // =========================
  // CONTENIDO PRINCIPAL
  // =========================

  const renderContenido = () => {
    switch (activeSection) {
      case "equipment":
        return renderEquipos();

      case "requests":
        return renderSolicitudes();

      case "maintenance":
        return renderMantenimientos();

      case "technicians":
        return (
          <div className="page-header">
            <div>
              <p className="eyebrow">GESTIÓN DE PERSONAL</p>

              <h1>Técnicos</h1>

              <p className="page-description">
                Aquí gestionaremos los técnicos del sistema.
              </p>
            </div>
          </div>
        );

      default:
        return renderDashboard();
    }
  };

  const obtenerTituloSeccion = () => {
    const item = menuItems.find((menu) => menu.id === activeSection);

    return item ? item.label : "Dashboard";
  };

  return (
    <div className="app">
      {/* =========================
          SIDEBAR
      ========================= */}

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
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => cambiarSeccion(item.id)}
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

      {/* =========================
          CONTENIDO
      ========================= */}

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Inicio / {obtenerTituloSeccion()}</p>

            <h2>{obtenerTituloSeccion()}</h2>
          </div>

          <div className="user-info">
            <div className="user-avatar">Y</div>

            <div>
              <strong>Administrador</strong>

              <span>Usuario del sistema</span>
            </div>
          </div>
        </header>

        <section className="content">{renderContenido()}</section>
      </main>

      {/* =========================
          MODAL NUEVO EQUIPO
      ========================= */}

      {mostrarFormularioEquipo && (
        <div
          className="modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarFormularioEquipo();
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">GESTIÓN DE EQUIPOS</p>

                <h2>Registrar nuevo equipo</h2>

                <p>Ingresa la información del equipo.</p>
              </div>

              <button
                className="close-button"
                onClick={cerrarFormularioEquipo}
                disabled={guardandoEquipo}
              >
                ×
              </button>
            </div>

            <form className="form" onSubmit={crearEquipo}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre del equipo *</label>

                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    value={formularioEquipo.nombre}
                    onChange={manejarCambioEquipo}
                    placeholder="Ej. Computador administrativo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tipo">Tipo de equipo *</label>

                  <input
                    id="tipo"
                    name="tipo"
                    type="text"
                    value={formularioEquipo.tipo}
                    onChange={manejarCambioEquipo}
                    placeholder="Ej. Computador"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="marca">Marca</label>

                  <input
                    id="marca"
                    name="marca"
                    type="text"
                    value={formularioEquipo.marca}
                    onChange={manejarCambioEquipo}
                    placeholder="Ej. Lenovo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modelo">Modelo</label>

                  <input
                    id="modelo"
                    name="modelo"
                    type="text"
                    value={formularioEquipo.modelo}
                    onChange={manejarCambioEquipo}
                    placeholder="Ej. ThinkPad E14"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="numero_serie">Número de serie</label>

                  <input
                    id="numero_serie"
                    name="numero_serie"
                    type="text"
                    value={formularioEquipo.numero_serie}
                    onChange={manejarCambioEquipo}
                    placeholder="Ej. ABC123456"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="estado">Estado</label>

                  <select
                    id="estado"
                    name="estado"
                    value={formularioEquipo.estado}
                    onChange={manejarCambioEquipo}
                  >
                    <option value="activo">Activo</option>

                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="ubicacion">Ubicación</label>

                  <input
                    id="ubicacion"
                    name="ubicacion"
                    type="text"
                    value={formularioEquipo.ubicacion}
                    onChange={manejarCambioEquipo}
                    placeholder="Ej. Oficina administrativa"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={cerrarFormularioEquipo}
                  disabled={guardandoEquipo}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={guardandoEquipo}
                >
                  {guardandoEquipo ? "Guardando..." : "Registrar equipo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          MODAL NUEVA SOLICITUD
      ========================= */}

      {mostrarFormularioSolicitud && (
        <div
          className="modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarFormularioSolicitud();
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">GESTIÓN DE SOLICITUDES</p>

                <h2>Nueva solicitud</h2>

                <p>Registra una nueva solicitud de mantenimiento.</p>
              </div>

              <button
                className="close-button"
                onClick={cerrarFormularioSolicitud}
                disabled={guardandoSolicitud}
              >
                ×
              </button>
            </div>

            <form className="form" onSubmit={crearSolicitud}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label htmlFor="equipo_id">Equipo *</label>

                  <select
                    id="equipo_id"
                    name="equipo_id"
                    value={formularioSolicitud.equipo_id}
                    onChange={manejarCambioSolicitud}
                    required
                  >
                    <option value="">Selecciona un equipo</option>

                    {equipos.map((equipo) => (
                      <option key={equipo.id} value={equipo.id}>
                        {equipo.nombre} — {equipo.tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="titulo">Título de la solicitud *</label>

                  <input
                    id="titulo"
                    name="titulo"
                    type="text"
                    value={formularioSolicitud.titulo}
                    onChange={manejarCambioSolicitud}
                    placeholder="Ej. Equipo no enciende"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prioridad">Prioridad</label>

                  <select
                    id="prioridad"
                    name="prioridad"
                    value={formularioSolicitud.prioridad}
                    onChange={manejarCambioSolicitud}
                  >
                    <option value="baja">Baja</option>

                    <option value="media">Media</option>

                    <option value="alta">Alta</option>

                    <option value="critica">Crítica</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="estado">Estado</label>

                  <select
                    id="estado"
                    name="estado"
                    value={formularioSolicitud.estado}
                    onChange={manejarCambioSolicitud}
                  >
                    <option value="pendiente">Pendiente</option>

                    <option value="abierta">Abierta</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="descripcion">Descripción *</label>

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
              </div>

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
                  disabled={guardandoSolicitud}
                >
                  {guardandoSolicitud ? "Guardando..." : "Crear solicitud"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* =========================
          MODAL NUEVO MANTENIMIENTO
      ========================= */}

      {mostrarFormularioMantenimiento && (
        <div
          className="modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              cerrarFormularioMantenimiento();
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">GESTIÓN DE MANTENIMIENTOS</p>

                <h2>Nuevo mantenimiento</h2>

                <p>Registra una nueva actividad de mantenimiento.</p>
              </div>

              <button
                className="close-button"
                onClick={cerrarFormularioMantenimiento}
                disabled={guardandoMantenimiento}
              >
                ×
              </button>
            </div>

            <form className="form" onSubmit={crearMantenimiento}>
              <div className="form-grid">
                <div className="form-group form-group-full">
                  <label htmlFor="mantenimiento_equipo_id">Equipo *</label>

                  <select
                    id="mantenimiento_equipo_id"
                    name="equipo_id"
                    value={formularioMantenimiento.equipo_id}
                    onChange={manejarCambioMantenimiento}
                    required
                  >
                    <option value="">Selecciona un equipo</option>

                    {equipos.map((equipo) => (
                      <option key={equipo.id} value={equipo.id}>
                        {equipo.nombre} — {equipo.tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="mantenimiento_tecnico_id">
                    ID del técnico *
                  </label>

                  <input
                    id="mantenimiento_tecnico_id"
                    name="tecnico_id"
                    type="number"
                    min="1"
                    value={formularioMantenimiento.tecnico_id}
                    onChange={manejarCambioMantenimiento}
                    placeholder="Ej. 1"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mantenimiento_tipo">Tipo</label>

                  <select
                    id="mantenimiento_tipo"
                    name="tipo"
                    value={formularioMantenimiento.tipo}
                    onChange={manejarCambioMantenimiento}
                  >
                    <option value="preventivo">Preventivo</option>

                    <option value="correctivo">Correctivo</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="mantenimiento_fecha_mantenimiento">
                    Fecha de mantenimiento *
                  </label>

                  <input
                    id="mantenimiento_fecha_mantenimiento"
                    name="fecha_mantenimiento"
                    type="date"
                    value={formularioMantenimiento.fecha_mantenimiento}
                    onChange={manejarCambioMantenimiento}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mantenimiento_estado">Estado *</label>

                  <select
                    id="mantenimiento_estado"
                    name="estado"
                    value={formularioMantenimiento.estado}
                    onChange={manejarCambioMantenimiento}
                  >
                    <option value="programado">Programado</option>

                    <option value="pendiente">Pendiente</option>

                    <option value="en_proceso">En proceso</option>

                    <option value="completado">Completado</option>
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="mantenimiento_descripcion">
                    Descripción *
                  </label>

                  <textarea
                    id="mantenimiento_descripcion"
                    name="descripcion"
                    value={formularioMantenimiento.descripcion}
                    onChange={manejarCambioMantenimiento}
                    placeholder="Describe el mantenimiento que se realizará..."
                    rows="5"
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={cerrarFormularioMantenimiento}
                  disabled={guardandoMantenimiento}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={guardandoMantenimiento}
                >
                  {guardandoMantenimiento
                    ? "Guardando..."
                    : "Registrar mantenimiento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
