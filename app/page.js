import ComoFunciona from "@/components/landing/ComoFunciona";
import CtaFinal from "@/components/landing/CtaFinal";

export const metadata = {
  title: "Oriéntame.pe — Encuentra tu carrera con criterio",
  description: "Test vocacional completo + datos reales del mercado laboral peruano.",
};

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-voz text-lg">Oriéntame<span className="text-amanecer">.pe</span></span>
        <a href="#como-funciona" className="text-sm text-texto-claro/70 hover:text-texto-claro">
          Cómo funciona
        </a>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex min-h-[80vh] w-full max-w-xl flex-col justify-center px-6 sm:px-10">
          <h1 className="font-voz text-3xl leading-snug sm:text-4xl">
            ¿Sin saber qué estudiar? Descubre las carreras que mejor van contigo.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-texto-claro/75">
            Analizamos tu personalidad, lo que te gusta y tus habilidades para compararlos con carreras reales en Perú. Cero floro: descubre dónde encajas antes de postular.
          </p>
          <a href="/test"
            className="mt-8 inline-block rounded-md bg-amanecer px-6 py-3 text-sm font-medium text-texto-oscuro hover:bg-amanecer/90"
          >
            Empieza tu test
          </a>

          <p className="mt-6 flex items-center gap-2 text-sm text-texto-claro/60">
            <span className="h-1.5 w-1.5 rounded-full bg-musgo" />
            Sin registro. Resultado descargable en PDF.
          </p>
        </section>
        <ComoFunciona />
        <CtaFinal />
      </main>
    </div>
  );
}