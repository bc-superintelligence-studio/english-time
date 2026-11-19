import { FIN_PROMOS, GARANTIA, HERMANOS, JUNIORS, NEGOCIO, NIVELES, OFERTAS_JUNIORS, PLANES, PREGUNTAS, PREGUNTAS_JUNIORS, RETO, SITIO, TELEFONO, WHATSAPP } from './contenido';

/* Palabras clave principales: guían títulos, descripciones y datos estructurados. */
export const SEO = {
  titulo: 'Clases de inglés online por Zoom: 1 a 1 y grupales | English Time',
  descripcion: 'Clases de inglés en vivo por Zoom, particulares 1 a 1 y grupales, desde cualquier país. Preparación para certificaciones y ciudadanía americana. Precios en COP y USD.',
  palabrasClave: [
    'clases de inglés', 'clases de inglés online', 'clases de inglés personalizadas', 'aprender inglés',
    'clases de inglés 1 a 1', 'clases particulares de inglés online', 'clases grupales de inglés', 'profesor de inglés', 'inglés por Zoom', 'clases de inglés online desde cualquier país', 'clases de inglés Colombia',
    'preparación examen de ciudadanía americana', 'clases de inglés para la ciudadanía', 'preparación para exámenes de certificación de inglés',
    'inglés conversacional', 'inglés para viajar', 'inglés para el trabajo', 'inglés desde cero',
    'curso de inglés online', 'clases particulares de inglés',
  ],
};

/** Palabras clave de la página de niños (/juniors). */
export const SEO_JUNIORS = {
  palabrasClave: [
    'clases de inglés para niños', 'inglés para niños por Zoom', 'clases de inglés online para niños', 'inglés para niños en vacaciones',
    'clases particulares de inglés para niños', 'curso de inglés para niños', 'English Time Juniors', 'Club de Adelantados',
  ],
};

const precio = (texto: string) => Number(texto.replace(/[^\d]/g, ''));
const id = (fragmento: string) => `${SITIO}/#${fragmento}`;

/** Grafo JSON-LD con la academia, el sitio, la página, los cursos, las promociones y las preguntas frecuentes. */
export function datosEstructurados() {
  const organizacion = {
    '@type': ['EducationalOrganization', 'OnlineBusiness'],
    '@id': id('organizacion'),
    name: NEGOCIO.nombre,
    slogan: NEGOCIO.lema,
    description: NEGOCIO.descripcion,
    url: `${SITIO}/`,
    logo: { '@type': 'ImageObject', url: `${SITIO}/assets/logo-oscuro.png`, width: 867, height: 624 },
    image: `${SITIO}/opengraph-image.png`,
    telephone: TELEFONO,
    areaServed: 'Worldwide',
    availableLanguage: ['es', 'en'],
    knowsAbout: [
      'Inglés', 'Clases particulares de inglés', 'Clases grupales de inglés', 'Inglés conversacional', 'Inglés para viajar', 'Inglés para el trabajo', 'Inglés desde cero',
      'Preparación para el examen de ciudadanía de Estados Unidos', 'Preparación para exámenes de certificación de inglés',
      'Inglés para niños',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: TELEFONO,
      url: `https://wa.me/${WHATSAPP}`,
      availableLanguage: ['Spanish', 'English'],
    },
    makesOffer: [
      { nombre: 'Bootcamp Navideño de inglés para viajar', texto: '7 días de inglés para viajar con clases en vivo de 45 minutos en diciembre.', valor: '$49.000' },
      { nombre: 'Paga un mes, estudia dos', texto: 'Pack de 8 clases al mes: pagas un mes y el segundo es gratis. Solo 5 cupos.', valor: '$480.000' },
      { nombre: 'Plan 90: tres meses de clases con 15% de descuento', texto: 'Tres meses de clases 1 a 1 en un solo pago, desde $1.220.000.', valor: '$1.220.000' },
      { nombre: 'Congela tu precio 2026', texto: 'Inscríbete antes del 28 de noviembre y estudia todo 2027 con la tarifa de 2026.', valor: '$480.000' },
    ].map((o) => ({
      '@type': 'Offer',
      name: o.nombre,
      description: o.texto,
      price: precio(o.valor),
      priceCurrency: 'COP',
      validThrough: FIN_PROMOS,
      availability: 'https://schema.org/LimitedAvailability',
      url: `${SITIO}/#promociones`,
      seller: { '@id': id('organizacion') },
    })),
  };

  const sitio = {
    '@type': 'WebSite',
    '@id': id('sitio'),
    url: `${SITIO}/`,
    name: NEGOCIO.nombre,
    description: SEO.descripcion,
    inLanguage: 'es',
    publisher: { '@id': id('organizacion') },
  };

  const pagina = {
    '@type': 'WebPage',
    '@id': id('pagina'),
    url: `${SITIO}/`,
    name: SEO.titulo,
    description: SEO.descripcion,
    inLanguage: 'es',
    isPartOf: { '@id': id('sitio') },
    about: { '@id': id('organizacion') },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITIO}/opengraph-image.png`, width: 1200, height: 630 },
    mainEntity: { '@id': id('curso') },
  };

  const proveedor = { '@id': id('organizacion') };
  const curso = {
    '@type': 'Course',
    '@id': id('curso'),
    name: 'Clases de inglés personalizadas 1 a 1 por Zoom',
    description: `Clases de inglés online 1 a 1 con profesor, en vivo por Zoom, desde cualquier país. Empiezas en tu nivel, desde cero hasta avanzado, escoges tu horario y hablas desde la primera clase. ${GARANTIA.titulo} Si no puedes asistir, tu clase se reprograma.`,
    provider: proveedor,
    inLanguage: 'es',
    teaches: 'Inglés',
    educationalLevel: 'Desde principiante hasta avanzado',
    availableLanguage: ['es', 'en'],
    url: `${SITIO}/#planes`,
    offers: PLANES.map((p) => ({
      '@type': 'Offer',
      category: 'Paid',
      name: `Plan mensual: ${p.veces}`,
      description: `${p.clases}, ${p.porClase}.`,
      price: precio(p.precio),
      priceCurrency: 'COP',
      url: `${SITIO}/#planes`,
    })),
    hasCourseInstance: PLANES.map((p) => ({
      '@type': 'CourseInstance',
      name: `Clases de inglés 1 a 1: ${p.veces}`,
      courseMode: 'Online',
      location: { '@type': 'VirtualLocation', url: `${SITIO}/` },
      courseSchedule: { '@type': 'Schedule', repeatFrequency: 'Weekly', repeatCount: 4 },
      instructor: { '@type': 'Person', name: 'Luis' },
    })),
  };

  const bootcamp = {
    '@type': 'Course',
    '@id': id('bootcamp'),
    name: 'Bootcamp Navideño: inglés para viajar en 7 días',
    description: '7 días de inglés para viajar: aeropuerto, hotel y entrevista. Clases en vivo de 45 minutos por Zoom en diciembre.',
    provider: proveedor,
    teaches: 'Inglés para viajar',
    url: `${SITIO}/#promociones`,
    offers: { '@type': 'Offer', category: 'Paid', price: 49000, priceCurrency: 'COP', validThrough: FIN_PROMOS },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      location: { '@type': 'VirtualLocation', url: `${SITIO}/` },
      courseSchedule: { '@type': 'Schedule', duration: 'PT45M', repeatFrequency: 'Daily', repeatCount: 7 },
    },
  };

  // Preparaciones específicas: se toman con los mismos planes mensuales de clases 1 a 1.
  const preparacion = (fragmento: string, nombre: string, descripcion: string, ensena: string) => ({
    '@type': 'Course',
    '@id': id(fragmento),
    name: nombre,
    description: descripcion,
    provider: proveedor,
    teaches: ensena,
    url: `${SITIO}/#objetivos`,
    offers: { '@type': 'Offer', category: 'Paid', price: precio(PLANES[0].precio), priceCurrency: 'COP', description: 'Desde el plan mensual de 8 clases 1 a 1.' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      location: { '@type': 'VirtualLocation', url: `${SITIO}/` },
      courseSchedule: { '@type': 'Schedule', repeatFrequency: 'Weekly', repeatCount: 4 },
    },
  });
  const ciudadania = preparacion('ciudadania', 'Preparación para el examen de ciudadanía americana',
    'Clases 1 a 1 por Zoom para preparar la entrevista en inglés del proceso de naturalización de Estados Unidos: hablar con el oficial, leer, escribir y responder las preguntas.',
    'Inglés para el examen de ciudadanía de Estados Unidos');
  const certificacion = preparacion('certificacion', 'Preparación para exámenes de certificación de inglés',
    'Clases 1 a 1 por Zoom para preparar el formato, los tiempos y las cuatro habilidades del examen de certificación: hablar, escuchar, leer y escribir.',
    'Inglés para exámenes de certificación');

  const grupo = {
    '@type': 'Course',
    '@id': id('grupo'),
    name: 'Clases grupales de inglés por Zoom',
    description: 'Clases de inglés en vivo por Zoom con otros estudiantes, en un horario fijo y a un precio más bajo que las clases particulares.',
    provider: proveedor,
    inLanguage: 'es',
    teaches: 'Inglés',
    url: `${SITIO}/#planes`,
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'Online', location: { '@type': 'VirtualLocation', url: `${SITIO}/` } },
  };

  const preguntas = {
    '@type': 'FAQPage',
    '@id': id('preguntas'),
    mainEntity: PREGUNTAS.map((q) => ({
      '@type': 'Question',
      name: q.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: q.respuesta },
    })),
  };

  return { '@context': 'https://schema.org', '@graph': [organizacion, sitio, pagina, curso, grupo, ciudadania, certificacion, bootcamp, preguntas] };
}

/** Grafo JSON-LD de la página de English Time Juniors: la academia, la página con sus migas, el curso de niños y sus preguntas. */
export function datosJuniors() {
  const url = `${SITIO}${JUNIORS.ruta}`;
  const organizacion = {
    '@type': ['EducationalOrganization', 'OnlineBusiness'],
    '@id': id('organizacion'),
    name: NEGOCIO.nombre,
    url: `${SITIO}/`,
    logo: { '@type': 'ImageObject', url: `${SITIO}/assets/logo-oscuro.png`, width: 867, height: 624 },
    telephone: TELEFONO,
    areaServed: 'Worldwide',
  };
  const pagina = {
    '@type': 'WebPage',
    '@id': `${url}#pagina`,
    url,
    name: JUNIORS.tituloPagina,
    description: JUNIORS.descripcionPagina,
    inLanguage: 'es',
    isPartOf: { '@id': id('sitio') },
    about: { '@id': `${url}#curso` },
    mainEntity: { '@id': `${url}#curso` },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: NEGOCIO.nombre, item: `${SITIO}/` },
        { '@type': 'ListItem', position: 2, name: 'English Time Juniors', item: url },
      ],
    },
  };
  const [reto, vip] = OFERTAS_JUNIORS;
  const juniors = {
    '@type': 'Course',
    '@id': `${SITIO}${JUNIORS.ruta}#curso`,
    name: `English Time Juniors: ${JUNIORS.club}`,
    description: `${JUNIORS.texto} Grupos por nivel de inglés: ${NIVELES.map((n) => n.nombre).join(', ')}.`,
    provider: { '@id': id('organizacion') },
    inLanguage: 'es',
    teaches: 'Inglés para niños',
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 8, suggestedMaxAge: 15 },
    url: `${SITIO}${JUNIORS.ruta}`,
    offers: [
      { '@type': 'Offer', category: 'Paid', name: reto.titulo, description: `${reto.incluye.join(' ')} ${reto.ahorro}`, price: precio(reto.precio), priceCurrency: 'COP', validThrough: FIN_PROMOS, url: `${SITIO}${JUNIORS.ruta}` },
      { '@type': 'Offer', category: 'Paid', name: `${reto.titulo}, tarifa de hermanos o amigos (2 niños)`, price: precio(HERMANOS.precio), priceCurrency: 'COP', validThrough: FIN_PROMOS, url: `${SITIO}${JUNIORS.ruta}` },
      { '@type': 'Offer', category: 'Paid', name: vip.titulo, description: `${vip.incluye.join(' ')} ${vip.ahorro}`, price: precio(vip.precio), priceCurrency: 'COP', validThrough: FIN_PROMOS, url: `${SITIO}${JUNIORS.ruta}` },
    ],
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      location: { '@type': 'VirtualLocation', url: `${SITIO}/` },
      startDate: RETO.inicio,
      endDate: RETO.fin,
      courseSchedule: {
        '@type': 'Schedule', duration: `PT${RETO.minutos}M`, repeatFrequency: 'Weekly', byDay: ['https://schema.org/Monday', 'https://schema.org/Wednesday'],
        startDate: RETO.inicio, endDate: RETO.fin,
      },
    },
  };

  const preguntas = {
    '@type': 'FAQPage',
    '@id': `${url}#preguntas`,
    mainEntity: PREGUNTAS_JUNIORS.map((q) => ({ '@type': 'Question', name: q.pregunta, acceptedAnswer: { '@type': 'Answer', text: q.respuesta } })),
  };
  return { '@context': 'https://schema.org', '@graph': [organizacion, pagina, juniors, preguntas] };
}

/** JSON listo para <script type="application/ld+json">, sin "<" que pueda cerrar la etiqueta. */
export function jsonLd(datos: unknown) {
  return JSON.stringify(datos).replace(/</g, '\\u003c');
}
