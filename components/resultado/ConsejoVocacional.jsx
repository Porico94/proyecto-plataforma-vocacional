function Icono({ children, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

const consejos = [
  {
    titulo: 'No te compares con el ritmo de los demás:',
    texto: 'Cada quien tiene tiempos distintos: algunos ingresan a la primera, otros cambian de carrera o se toman un año para ubicarse. Avanzar a tu ritmo no es quedarse atrás; es construir algo que sí tenga sentido para ti.',
    icono: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    titulo: 'Investiga el día a día real de la carrera, no solo el nombre:',
    texto: 'A veces el nombre de una carrera suena increíble, pero el trabajo que se realiza en la vida real es muy distinto. Puedes buscar en internet, preguntar a la IA, o conversar con alguien que ya esté trabajando en ese rubro para ver si el día a día te convence.',
    icono: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    titulo: 'No es solo estudiar:',
    texto: 'Hay estudiantes que saben un montón, pero les cuesta conseguir trabajo porque no saben comunicarse ni desenvolverse con otras personas. Aprender a hablar con confianza, hacer amistades y conectar con gente de tu rubro te abrirá muchas puertas laborales.',
    icono: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <circle cx="17.5" cy="9" r="2.5" />
        <path d="M17.5 14c2.5 0 4 1.7 4 4.5" />
      </>
    ),
  },
  {
    titulo: 'Define tu propio éxito:',
    texto: 'El verdadero éxito no es solo ganar mucho dinero; hay quienes ganan bien pero detestan su trabajo. Define qué significa el éxito para ti, no para los demás: si lo que haces te motiva y te permite vivir tranquilo, ya ganaste.',
    icono: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1" />
      </>
    ),
  },
  {
    titulo: 'Busca un equilibrio por tu salud mental:',
    texto: 'Durante y después de terminar tus estudios superiores, cuida el balance entre tu estudio, tu trabajo y tu vida personal. No todo es trabajar o estudiar; también es importante disfrutar, descansar y compartir tiempo con tu familia y amigos.',
    icono: (
      <>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
      </>
    ),
  },
  {
    titulo: 'Aprende a usar herramientas actuales:',
    texto: 'En institutos y universidades a veces los sílabos van muy atrasados. Dominar herramientas digitales desde la universidad marca una diferencia enorme cuando buscas prácticas o trabajo. Por ejemplo, aprende a usar la IA es una herramienta potente para aprender y practicar sobre cualquier tema.',
    icono: (
      <>
        <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
      </>
    ),
  },
];

export default function ConsejoVocacional() {
  return (
    <section className="mt-12 flex flex-col gap-4 text-texto-claro">
      <div className="flex items-center gap-2.5 text-musgo">
        <Icono className="size-7 shrink-0">
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </Icono>
        <h2 className="font-voz text-xl font-medium text-pretty text-texto-claro sm:text-2xl">Lo que nadie te dice al elegir una carrera</h2>
      </div>

      <p>
        Si llegaste hasta aquí es porque te tomas en serio esta nueva etapa. Para empezar con el pie derecho, ten presente estos consejos:
      </p>      

      <ul className="flex flex-col gap-4">
        {consejos.map((consejo) => (
          <li key={consejo.titulo} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-musgo/18 text-musgo"
            >
              <Icono className="size-6">{consejo.icono}</Icono>
            </span>
            <p>
              <strong className="block">{consejo.titulo}</strong>
              {consejo.texto}
            </p>
          </li>
        ))}
      </ul>

      <p>
        Elegir una carrera no es firmar una sentencia para toda la vida; es elegir tu punto de partida. Ya tienes la información sobre la mesa y sabes en qué carreras encajas mejor. Ahora te toca investigar cada carrera, cuáles son sus áreas de trabajo, qué se hace en el día a día y así elegir tu carrera con criterio.
      </p>
    </section>
  );
}