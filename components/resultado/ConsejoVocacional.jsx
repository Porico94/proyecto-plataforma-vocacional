export default function ConsejoVocacional() {
  return (
    <section className="mt-12 flex flex-col gap-4 text-texto-claro">
      <p>
        Las carreras que ves aquí son las que mejor calzan con quién eres: tus intereses, tus habilidades y tu forma de pensar.
      </p>
      <p>
        Eso sí, ten claro algo: ninguna carrera garantiza por sí sola estabilidad económica. Eso depende de varios factores, por ejemplo:
      </p>

      <ul className="flex list-disc flex-col gap-2 pl-5">
        <li>
          <strong>Tu formación profesional:</strong> demuestra lo que sabes hacer, no te quedes solo con el título.
        </li>
        <li>
          <strong>Las oportunidades que busques:</strong> nunca dejes de moverte, no siempre llegan solas.
        </li>
        <li>
          <strong>Tu red de contactos:</strong> conectar con personas de tu rubro te abrirá muchas puertas.
        </li>
      </ul>

      <p>
        Lo que sí puede darte esta lista es algo que pocos tienen al elegir
        carrera, <strong>la certeza de que vas en la dirección correcta</strong>, lo demás lo
        construyes <strong>tú</strong>.
      </p>
    </section>
  );
}