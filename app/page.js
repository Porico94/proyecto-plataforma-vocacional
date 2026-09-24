export const metadata = {
  title: "Orientame.pe — Encuentra tu carrera con criterio",
  description: "Test vocacional completo + datos reales del mercado laboral peruano.",
};

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center px-6 py-6 sm:px-10">
        <span className="font-voz text-lg">Orientame<span className="text-amanecer">.pe</span></span>        
      </header>

      <main className="flex flex-1 flex-col">
        <section className="flex min-h-[80vh] w-full flex-col justify-center px-6 sm:px-10">
          <div className="max-w-7xl">
            <h1 className="font-voz text-3xl leading-snug sm:text-4xl">
              ¿No sabes qué carrera estudiar?
            <span className="mt-2 block text-xl font-normal text-texto-claro/80 sm:text-2xl">
              Te ayudaremos a descubrir qué carreras van mejor contigo.
            </span>
            </h1>
            <div className="mt-5 max-w-md text-base leading-relaxed text-texto-claro/75">
              <p>Analizamos:</p>
              <ul className="mt-2 space-y-1 list-disc pl-5">
                <li><span className="text-texto-claro">Quién eres:</span> tu personalidad y valores.</li>
                <li><span className="text-texto-claro">Lo que te mueve:</span> tus intereses y gustos.</li>
                <li><span className="text-texto-claro">En qué destacas:</span> tus habilidades y aptitudes.</li>
              </ul>
              <p className="mt-3">
                <span className="text-texto-claro">El resultado:</span> un filtro con carreras a tu medida.
              </p>
            </div>
            <a href="/test"
              className="relative isolate mt-8 inline-block rounded-md px-8 py-4 text-base font-semibold text-texto-oscuro before:absolute before:inset-0 before:-z-10 before:rounded-md before:bg-amanecer before:content-[''] before:transition-[transform,box-shadow] before:duration-150 before:ease-[ease] motion-safe:hover:before:scale-[1.04] hover:before:shadow-lg hover:before:shadow-amanecer/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amanecer focus-visible:ring-offset-2 focus-visible:ring-offset-noche"
            >
              Empieza tu test
            </a>

            <p className="mt-6 flex items-center gap-2 text-sm text-texto-claro/60">
              <span className="h-1.5 w-1.5 rounded-full bg-musgo" />
              Sin registro. Resultado descargable en PDF.
            </p>
          </div>
        </section>        
      </main>
    </div>
  );
}