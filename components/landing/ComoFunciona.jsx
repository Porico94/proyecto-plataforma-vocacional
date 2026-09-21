const pasos = [
  {
    numero: "01",
    titulo: "Rinde el test",
    descripcion: "Responde preguntas sobre tu personalidad, intereses y aptitudes.",
  },
  {
    numero: "02",
    titulo: "Generamos tu perfil",
    descripcion: "Combinamos tus respuestas en 5 dimensiones distintas de evaluación.",
  },
  {
    numero: "03",
    titulo: "Comparamos carreras",
    descripcion: "Tu perfil se compara contra un catálogo real de carreras peruanas.",
  },
  {
    numero: "04",
    titulo: "Descarga tu resultado",
    descripcion: "Recibe tu top de carreras compatibles en PDF, sin registro.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-papel px-6 py-20 text-texto-oscuro sm:px-10">
      <div className="mx-auto max-w-xl">
        <h2 className="font-voz text-2xl">Cómo funciona</h2>

        <ol className="mt-10 flex flex-col gap-8">
          {pasos.map((paso) => (
            <li key={paso.numero} className="flex gap-4">
              <span className="font-voz text-lg text-texto-oscuro/35">{paso.numero}</span>
              <div>
                <h3 className="text-sm font-medium">{paso.titulo}</h3>
                <p className="mt-1 text-sm text-texto-oscuro/65">{paso.descripcion}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}