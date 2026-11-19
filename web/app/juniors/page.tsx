import type { Metadata } from 'next';
import { Sprite } from '@/components/base';
import { BarraFija, CabeceraJuniors, CierreJuniors, Juniors, PiePagina, PreguntasJuniors } from '@/components/secciones';
import Interacciones from '@/components/Interacciones';
import { JUNIORS } from '@/lib/contenido';
import { SEO_JUNIORS, datosJuniors, jsonLd } from '@/lib/seo';

/* Página propia de English Time Juniors: Luis pidió que los papás vean solo lo de niños,
   sin mezclarlo con las clases y promociones de adultos. */
export const metadata: Metadata = {
  title: { absolute: JUNIORS.tituloPagina },
  description: JUNIORS.descripcionPagina,
  keywords: SEO_JUNIORS.palabrasClave,
  alternates: { canonical: JUNIORS.ruta, languages: { es: JUNIORS.ruta, 'x-default': JUNIORS.ruta } },
  openGraph: {
    type: 'website',
    locale: 'es_LA',
    url: JUNIORS.ruta,
    siteName: 'English Time',
    title: 'English Time Juniors: Club de Adelantados',
    description: 'Inglés sin miedo al colegio. Un reto de 4 semanas en vacaciones, por Zoom y en grupos por nivel. Valoración gratis de 15 minutos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'English Time Juniors: Club de Adelantados',
    description: 'Inglés sin miedo al colegio: reto de 4 semanas por Zoom, en grupos por nivel de inglés.',
  },
};

export default function PaginaJuniors() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datosJuniors()) }} />
      <Sprite />
      <BarraFija modo="juniors" />
      <CabeceraJuniors />
      <main>
        <Juniors />
        <PreguntasJuniors />
        <CierreJuniors />
      </main>
      <PiePagina juniors />
      <Interacciones />
    </>
  );
}
