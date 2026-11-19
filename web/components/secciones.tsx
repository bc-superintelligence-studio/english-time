/* eslint-disable @next/next/no-img-element -- los logos y la mascota ya están optimizados; se usan <img> para que el HTML quede igual a la landing original. */
import Link from 'next/link';
import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Cuenta, Icono, Medidor, Revelar, retraso } from './base';
import {
  CARPETA, CINTA, ESCENAS, FECHA_TRM, GARANTIA, HERMANOS, JUNIORS, MENSAJES, MISIONES, MODALIDADES, NIVELES, OBJETIVOS, OFERTAS_JUNIORS, PAISES, PASOS, PLANES, PREGUNTAS,
  PREGUNTAS_JUNIORS, PROMOS,
  RETO, TELEFONO, TELEFONO_VISIBLE, TRM, VERSUS, usd, wa,
} from '@/lib/contenido';
import type { IconoObjetivo } from '@/lib/contenido';
import { MAPA } from '@/lib/mapa';

const externo = { target: '_blank', rel: 'noopener' } as const;

/* ---------- barra fija de WhatsApp ----------
   Dos versiones: la de adultos (Black Friday) en el inicio y la de English Time Juniors en su página. */
export function BarraFija({ modo = 'adultos' }: { modo?: 'adultos' | 'juniors' }) {
  if (modo === 'juniors') {
    return (
      <div className="fija modo-juniors" id="fija" aria-hidden="true" inert>
        <div className="wrap fija-in fija-juniors">
          <img src="/assets/juniors-logo-280.webp" alt="" width={280} height={192} loading="lazy" />
          <p className="fija-cuenta"><span>Reto de 4 semanas</span><b>{OFERTAS_JUNIORS[0].precio}</b></p>
          <a className="btn btn-juniors" href={wa(JUNIORS.barraFija)} {...externo}><Icono id="wa" /><span>Valoración gratis<span className="solo-escritorio"> de 15 minutos</span></span></a>
        </div>
      </div>
    );
  }
  return (
    <div className="fija" id="fija" aria-hidden="true" inert>
      <div className="wrap fija-in fija-adultos">
        <img src="/assets/logo-claro.webp" alt="" width={260} height={188} />
        <p className="fija-cuenta"><span className="pill">Black Friday</span><span><span className="solo-escritorio">Las promociones terminan en</span><span className="solo-movil">Promos de Black Friday</span></span><b data-cuenta-corta="">22 días</b></p>
        <a className="btn btn-rojo btn-brillo" href={wa(MENSAJES.barraFija)} {...externo}><Icono id="wa" /><span>Escribirle a Luis<span className="solo-escritorio"> por WhatsApp</span></span></a>
      </div>
    </div>
  );
}

/* ---------- héroe ---------- */
function Cinta() {
  const items = [...CINTA, ...CINTA];
  return (
    <a className="cinta" href="#promociones" aria-label="Ver las cuatro promociones de Black Friday">
      <span className="cinta-pista" aria-hidden="true">
        {items.map((item, i) => (
          <span className="ci" key={i}>{item.texto}{item.destacado && <b>{item.destacado}</b>}<svg><use href="#reloj-logo" /></svg></span>
        ))}
      </span>
    </a>
  );
}

/* Sello de Black Friday: gira, cambia de promoción cada dos segundos, se inclina hacia el puntero y lleva a las promociones. */
const RAYOS = Array.from({ length: 48 }, (_, i) => {
  const a = (i / 48) * Math.PI * 2, r = i % 2 ? 90 : 99;
  return `${(100 + r * Math.sin(a)).toFixed(1)} ${(100 - r * Math.cos(a)).toFixed(1)}`;
}).join(' ');
const OFERTAS_SELLO: { grande: string; chica: string }[] = [
  { grande: '2×1', chica: 'paga 1 mes' },
  { grande: '15%', chica: 'menos, Plan 90' },
  { grande: '$49 mil', chica: 'Bootcamp' },
  { grande: '2026', chica: 'precio congelado' },
];

function Sello({ lugar }: { lugar: 'barra' | 'arte' }) {
  const anillo = `sello-anillo-${lugar}`;
  return (
    <a className={`sello sello-${lugar}`} href="#promociones" aria-label="Black Friday: ver las cuatro promociones, válidas hasta el 28 de noviembre">
      <span className="sello-cuerpo">
        {/* El anillo gira como capa propia (transform en el <svg>): el navegador no lo vuelve a pintar en cada cuadro. */}
        <svg className="sello-giro" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id={anillo} d="M100 100m-66 0a66 66 0 1 1 132 0a66 66 0 1 1-132 0" /></defs>
          <polygon points={RAYOS} fill="#000" />
          <text className="sello-texto">
            <textPath href={`#${anillo}`} textLength="408">{lugar === 'arte' ? 'BLACK FRIDAY ✦ HASTA EL 28 DE NOVIEMBRE ✦ ' : 'BLACK FRIDAY ✦ BLACK FRIDAY ✦ '}</textPath>
          </text>
        </svg>
        <svg className="sello-centro" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="54" fill="#D4111F" />
          <circle cx="100" cy="100" r="49" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2" strokeDasharray="2 4" />
        </svg>
        <span className="sello-ofertas" aria-hidden="true">
          {OFERTAS_SELLO.map((o, i) => (
            <span className={i === 0 ? 'sello-oferta on' : 'sello-oferta'} key={o.grande}><b>{o.grande}</b><small>{o.chica}</small></span>
          ))}
        </span>
      </span>
    </a>
  );
}

/* Saludo según la hora de quien visita: el script del <head> marca <html data-saludo> antes de pintar. */
function Saludo() {
  return (
    <p className="saludo aparece" style={retraso('.1s')}>
      <span data-s="hola">Hola.</span>
      <span data-s="dia"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" /></svg>Buenos días.</span>
      <span data-s="tarde"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 16a6.5 6.5 0 0 1 13 0z" fill="currentColor" stroke="none" /><path d="M2.5 19.5h19M12 4.5v2.2M4.6 8.6l1.6 1.4M19.4 8.6l-1.6 1.4" /></svg>Buenas tardes.</span>
      <span data-s="noche"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z" fill="currentColor" stroke="none" /></svg>Buenas noches.</span>
    </p>
  );
}

/* Aviso para papás (Luis: "que gire y diga English Time Juniors, que gire y diga Black Friday o ¿es para tu niño?").
   El logo de Juniors va en un sello con un anillo de texto que gira, los mensajes cambian cada dos segundos
   (los mueve el mismo código del sello de Black Friday), el aviso salta de vez en cuando y lleva a /juniors. */
/** Colores del logo de Juniors, letra por letra (aviso del inicio y título del Club). */
const COLORES_LETRAS = ['#FFC400', '#2DBE4E', '#F0242C', '#FFC400', '#19A7E0', '#2DBE4E', '#F0242C'];
const MENSAJES_AVISO: { grande: string; chica: ReactNode }[] = [
  {
    grande: '¿Es para tu hijo?',
    chica: <>Conoce English Time <span className="ir-juniors-nombre">{Array.from('Juniors').map((l, i) => (
      <span style={{ '--i': i, '--c': COLORES_LETRAS[i % COLORES_LETRAS.length] } as CSSProperties} key={i}>{l}</span>
    ))}</span></>,
  },
  { grande: 'Black Friday Kids', chica: '4 clases particulares por el precio de 3' },
  { grande: 'Club de Adelantados', chica: 'Reto de 4 semanas en vacaciones' },
];

function AvisoJuniors() {
  return (
    <Link className="ir-juniors aparece" style={retraso('1.35s')} href={JUNIORS.ruta} data-rota="">
      <span className="ir-juniors-sello" aria-hidden="true">
        <svg className="aviso-anillo" viewBox="0 0 100 100">
          <defs><path id="aviso-anillo" d="M50 50m-41 0a41 41 0 1 1 82 0a41 41 0 1 1-82 0" /></defs>
          <text><textPath href="#aviso-anillo" textLength="252">ENGLISH TIME JUNIORS ✦ BLACK FRIDAY ✦ </textPath></text>
        </svg>
        <img src="/assets/juniors-logo-280.webp" alt="" width={280} height={192} />
      </span>
      <span className="ir-juniors-mensajes">
        {MENSAJES_AVISO.map((m, i) => (
          <span className={i === 0 ? 'aviso-msj on' : 'aviso-msj'} key={m.grande}><b>{m.grande}</b><span>{m.chica}</span></span>
        ))}
      </span>
    </Link>
  );
}

export function Heroe() {
  return (
    <header className="hero">
      <div className="wrap barra">
        <img className="logo-hero" src="/assets/logo-claro-hd.webp" srcSet="/assets/logo-claro.webp 260w, /assets/logo-claro-hd.webp 480w" sizes="(max-width: 700px) 106px, 160px"
          alt="English Time: easy, fast, fun!" width={480} height={346} fetchPriority="high" />
        <Sello lugar="barra" />
        <a className="btn btn-borde" href={wa(MENSAJES.general)} {...externo}>Escribir por WhatsApp</a>
      </div>

      <div className="wrap hero-grid">
        <div className="texto-hero">
          <Saludo />
          <Revelar as="h1" style={retraso('.25s')} tema="Clases de inglés en vivo por Zoom: particulares 1 a 1 y grupales">Imagina un día hablando inglés.</Revelar>
          <p className="lead aparece" style={retraso('.75s')}>Sin traductor, sin pena y sin quedarte callado. Baja y vívelo hora por hora: así cambia tu vida cuando por fin hablas inglés.</p>
          <div className="acciones aparece" style={retraso('.95s')} data-fija-desde="">
            <a className="btn btn-rojo btn-brillo" href={wa(MENSAJES.general)} {...externo}><Icono id="wa" />Escribirle a Luis por WhatsApp</a>
            <Cuenta />
          </div>
        </div>
        <div className="hero-arte">
          <Medidor />
          <Sello lugar="arte" />
        </div>
      </div>

      <div className="wrap hero-pie">
        <a className="bajar aparece" style={retraso('1.2s')} href="#dia">
          <svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" opacity=".5" /><path d="M11 14.5l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Tu día empieza a las 7:00 a.m.
        </a>
        {/* Luis (19 nov): primero se ve que es una página de inglés para adultos y, al bajar un poquito,
            aparece "también hay English Time Juniors". Por eso va al pie de la entrada y no junto al logo. */}
        <AvisoJuniors />
      </div>

      <Cinta />
    </header>
  );
}

/* ---------- un día en inglés ---------- */
const MARCAS = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

function Reloj() {
  return (
    <svg className="reloj" viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="184" fill="none" stroke="currentColor" strokeWidth="3" opacity=".2" />
      <g stroke="currentColor" strokeLinecap="round">
        {MARCAS.map((g) => {
          const fuerte = g % 90 === 0;
          return (
            <line key={g} x1="200" y1="36" x2="200" y2={fuerte ? 62 : 52} strokeWidth={fuerte ? 9 : 6}
              opacity={fuerte ? undefined : '.55'} transform={g ? `rotate(${g} 200 200)` : undefined} />
          );
        })}
      </g>
      <path d="M42.4 109 A182 182 0 0 1 357.6 109" fill="none" stroke="#D4111F" strokeWidth="14" strokeLinecap="round" />
      <line className="mano mano-h" x1="200" y1="200" x2="200" y2="108" stroke="currentColor" strokeWidth="20" strokeLinecap="round" style={{ transform: 'rotate(210deg)' }} />
      <line className="mano mano-m" x1="200" y1="200" x2="200" y2="66" stroke="#D4111F" strokeWidth="13" strokeLinecap="round" style={{ transform: 'rotate(0deg)' }} />
      <circle cx="200" cy="200" r="15" fill="currentColor" />
    </svg>
  );
}

export function Dia() {
  return (
    <section className="dia" id="dia" data-momento="manana" aria-labelledby="t-dia">
      <h2 id="t-dia" className="oculto">Beneficios de hablar inglés: un día en tu vida, hora por hora</h2>
      <div className="dia-mini" aria-hidden="true">
        <svg className="reloj-mini" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="22" opacity=".25" />
          <path d="M42.4 109 A182 182 0 0 1 357.6 109" fill="none" stroke="#D4111F" strokeWidth="26" strokeLinecap="round" />
          <line className="mano mano-h" x1="200" y1="200" x2="200" y2="100" stroke="currentColor" strokeWidth="34" strokeLinecap="round" style={{ transform: 'rotate(210deg)' }} />
          <line className="mano mano-m" x1="200" y1="200" x2="200" y2="62" stroke="#D4111F" strokeWidth="24" strokeLinecap="round" style={{ transform: 'rotate(0deg)' }} />
          <circle cx="200" cy="200" r="24" fill="currentColor" />
        </svg>
        <span className="mini-hora">7:00 a.m.</span>
        <span className="mini-pasos">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} className={i === 0 ? 'on' : undefined} />)}</span>
      </div>
      <div className="wrap dia-grid">
        <div className="dia-reloj" aria-hidden="true"><Reloj /></div>

        <ol className="escenas">
          {ESCENAS.map((e) => (
            <li className="escena" data-min={e.min} data-momento={e.momento} key={e.min}>
              <p className="hora-grande">{e.hora}<small>{e.sufijo}</small></p>
              <h3>{e.titulo}</h3>
              <p>{e.texto}</p>
              <p className="gana">{e.gana}</p>
            </li>
          ))}
          <li className="escena ahora" data-min="" data-momento="ahora">
            <p className="previa" id="previa-ahora">Y ahora mismo son las</p>
            <p className="hora-grande" id="hora-ahora">tu hora</p>
            <h3>Es hora de hablar inglés.</h3>
            <p>Ese día que acabas de leer no es un sueño. Es un horario, y el tuyo lo escoges tú.</p>
            <a className="btn btn-rojo btn-brillo" href={wa(MENSAJES.horario)} {...externo}><Icono id="wa" />Escoger mi horario con Luis</a>
          </li>
        </ol>
      </div>
    </section>
  );
}

/* ---------- por qué no ha funcionado ---------- */
export function Clases() {
  return (
    <section className="seccion blanco" id="clases" aria-labelledby="t-clases">
      <div className="wrap">
        <div className="metodo-cab">
          <div className="encabezado">
            <Revelar id="t-clases">Si ya lo intentaste y no funcionó, no es tu culpa.</Revelar>
            <p className="aparece" style={retraso('.3s')}>A casi todos nos enseñaron inglés para pasar exámenes, no para hablarlo. En English Time las clases de inglés son personalizadas y 1 a 1: cada una está hecha para que hables.</p>
          </div>
          <img className="mascota" src="/assets/mascota.webp" srcSet="/assets/mascota-220.webp 220w, /assets/mascota.webp 296w" sizes="(max-width: 700px) 110px, (max-width: 900px) 130px, 200px" width={296} height={605} loading="lazy" alt="La mascota de English Time, un reloj despertador con la camiseta de la academia." />
        </div>

        <div className="versus" role="table" aria-label="Lo de siempre frente a English Time">
          <div className="versus-fila versus-cab" role="row"><span role="columnheader">Lo de siempre</span><span role="columnheader">En English Time</span></div>
          {VERSUS.map((v) => (
            <div className="versus-fila" role="row" key={v.antes}>
              <p className="antes" role="cell"><Icono id="no" /><span><span className="tachon">{v.antes}</span></span></p>
              <p className="despues" role="cell"><Icono id="si" />{v.despues}</p>
            </div>
          ))}
        </div>

        <h3 className="pasos-titulo">Empezar es así de simple</h3>
        <ol className="pasos">
          {PASOS.map((p) => <li key={p.titulo}><b>{p.titulo}</b><span>{p.texto}</span></li>)}
        </ol>
      </div>
    </section>
  );
}

/* ---------- clases según el objetivo ---------- */
const TRAZOS: Record<IconoObjetivo, ReactNode> = {
  trabajo: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12.5h18M11 12.5v2h2v-2" /></>,
  ciudadania: <><path d="M5 21V3.5" /><path d="M5 4h13l-2.5 4.25L18 12.5H5" /><path d="M3 21h5" /></>,
  examen: <><path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21H12" /><path d="M14 3l5 5h-5z" /><path d="M8 11h6M8 14.5h3.5" /><circle cx="17" cy="16" r="2.8" /><path d="M15.6 18.5 15 22l2-1.1 2 1.1-.6-3.5" /></>,
  viajar: <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />,
  conversar: <><path d="M20.5 11.5a7.5 7.5 0 0 1-10.9 6.7L4 19.5l1.4-4.6A7.5 7.5 0 1 1 20.5 11.5z" /><path d="M9 11.5h.01M13 11.5h.01M17 11.5h.01" strokeWidth="2.6" /></>,
  cero: <><path d="M12 21v-8.5" /><path d="M12 12.5C12 8.4 9 5.5 4 5.5c0 4.1 3 7 8 7z" /><path d="M12 14.5c0-3.3 2.5-6 7-6 0 3.4-2.5 6-7 6z" /></>,
};

export function Objetivos() {
  return (
    <section className="seccion objetivos" id="objetivos" aria-labelledby="t-objetivos">
      <div className="wrap">
        <div className="encabezado">
          <Revelar id="t-objetivos">Clases de inglés personalizadas para lo que tú necesitas.</Revelar>
          <p className="aparece" style={retraso('.3s')}>Cuéntale a Luis para qué quieres el inglés y tus clases 1 a 1 se enfocan en eso, a tu ritmo y en tu horario.</p>
        </div>
        <ul className="objetivos-lista">
          {OBJETIVOS.map((o, i) => (
            <li className="objetivo" style={i % 3 ? { transitionDelay: `${(i % 3) * 0.12}s` } : undefined} key={o.titulo}>
              <span className="objetivo-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{TRAZOS[o.icono]}</svg>
              </span>
              <h3>{o.titulo}</h3>
              <p>{o.texto}</p>
              <a className="enlace-wa" href={wa(o.mensaje)} {...externo}><Icono id="wa" />{o.boton}</a>
            </li>
          ))}
        </ul>
        <p className="objetivos-pista" aria-hidden="true">Desliza para ver los {OBJETIVOS.length} objetivos</p>
      </div>
    </section>
  );
}

/* ---------- mapa: desde Colombia hacia los países donde ya hay estudiantes ----------
   Un punto de luz recorre cada ruta (Luis pidió quitar el avión: "no somos una aerolínea"). */
export function Mundo() {
  const { ancho, alto, origen, destinos } = MAPA;
  return (
    <section className="seccion mundo" id="paises" aria-labelledby="t-paises">
      <div className="wrap">
        <div className="mundo-cab">
          <Revelar id="t-paises">Desde Colombia hasta Japón.</Revelar>
          <p className="aparece" style={retraso('.3s')}>English Time ya tiene estudiantes en {PAISES.length + 1} países. Tomas tus clases por Zoom donde estés, y el horario se acuerda según tu zona horaria.</p>
        </div>

        <div className="mapa" id="mapa">
          <img className="mapa-fondo" src="/assets/mapa-mundo.svg" alt="" width={ancho} height={alto} loading="lazy" />
          <svg className="mapa-capa" viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label={`Mapa con rutas desde Colombia hacia ${PAISES.join(', ')}.`}>
            <use className="mapa-colombia" href={`/assets/mapa-paises.svg#${origen.puntos}`} />
            {destinos.map((d, i) => (
              <g className="mapa-destino" data-i={i} key={d.pais}>
                <use className="mapa-pais" href={`/assets/mapa-paises.svg#${d.puntos}`} />
                <path className="mapa-ruta" d={d.ruta} />
                <circle className="mapa-onda" cx={d.x} cy={d.y} r="4" />
                <circle className="mapa-pin" cx={d.x} cy={d.y} r="4" />
                <text className="mapa-nombre" x={d.x + d.etiqueta.dx} y={d.y + d.etiqueta.dy} textAnchor={d.etiqueta.ancla}>{d.pais}</text>
                <g className="mapa-punto"><circle className="mapa-punto-halo" r="7" /><circle className="mapa-punto-luz" r="3.4" /></g>
              </g>
            ))}
            <circle className="mapa-origen-onda" cx={origen.x} cy={origen.y} r="6" />
            <circle className="mapa-origen" cx={origen.x} cy={origen.y} r="5.5" />
            <text className="mapa-nombre mapa-nombre-origen" x={origen.x + 10} y={origen.y + 16}>Colombia</text>
          </svg>
        </div>

        <ul className="mapa-paises" aria-label="Hora local en cada país">
          <li className="mapa-chip origen"><b>Colombia</b><span data-zona={origen.zona} /></li>
          {destinos.map((d, i) => (
            <li key={d.pais}>
              <button type="button" className="mapa-chip" data-i={i}><b>{d.pais}</b><span data-zona={d.zona} /></button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- promociones: mazo de tarjetas ---------- */
export function Promociones() {
  return (
    <section className="seccion" id="promociones" aria-labelledby="t-promos">
      <div className="wrap">
        <div className="encabezado">
          <Revelar id="t-promos">Empieza antes del 28 de noviembre y paga menos.</Revelar>
          <p className="aparece" style={retraso('.3s')}>Cuatro promociones de Black Friday, cada una para un momento distinto. Pasa las tarjetas, escoge la tuya y escríbele a Luis con un toque: el mensaje ya va escrito.</p>
        </div>

        <div className="deck" id="deck">
          <div className="deck-tabs" role="tablist" aria-label="Promociones de Black Friday">
            {PROMOS.map((p, i) => (
              <button className="deck-tab" role="tab" id={`tab-${i}`} aria-controls={`panel-${i}`} aria-selected={i === 0} tabIndex={i === 0 ? undefined : -1} key={p.pieza}>
                <span className="progreso"><i /></span><b>{p.tab}</b><span className="tab-precio">{p.tabDetalle}</span>
              </button>
            ))}
          </div>

          <div className="deck-cuerpo">
            <div className="deck-zona">
              <div className="deck-mesa">
                {PROMOS.map((p, i) => (
                  <figure className="carta" data-o={i} style={{ '--fondo': p.fondo } as CSSProperties} key={p.pieza}>
                    <iframe src={`/piezas/piezas.html?p=${p.pieza}`} title={p.tituloPieza} loading="lazy" scrolling="no" tabIndex={-1} aria-hidden="true" />
                  </figure>
                ))}
              </div>
              <div className="deck-controles">
                <button className="deck-flecha" data-dir="-1" aria-label="Promoción anterior"><Icono id="izq" /></button>
                <span className="deck-num" aria-hidden="true">1 / 4</span>
                <button className="deck-flecha" data-dir="1" aria-label="Siguiente promoción"><Icono id="der" /></button>
                <span className="deck-pista">Desliza las tarjetas</span>
              </div>
            </div>

            <div className="deck-paneles">
              {PROMOS.map((p, i) => (
                <div className={i === 0 ? 'deck-panel activo' : 'deck-panel'} role="tabpanel" id={`panel-${i}`} aria-labelledby={`tab-${i}`}
                  aria-hidden={i === 0 ? undefined : true} inert={i === 0 ? undefined : true} key={p.pieza}>
                  <span className="chip">{p.chip}</span>
                  <h3>{p.titulo}</h3>
                  <p className="precio">{p.precio}<small>COP {p.precioNota}</small></p>
                  <p className="precio-usd">≈ {usd(p.precio)}</p>
                  <p className="texto">{p.texto}</p>
                  <a className="btn btn-rojo btn-brillo" href={wa(p.mensaje)} {...externo}><Icono id="wa" />{p.boton}</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="regalo aparece">
          <div>
            <h3>¿Es para regalar?</h3>
            <p>El Bootcamp y cualquier plan se pueden regalar esta Navidad.</p>
          </div>
          <a className="btn btn-noche" href={wa(MENSAJES.regalo)} {...externo}><Icono id="wa" />Regalar clases</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- garantía: las clases personalizadas se reprograman ---------- */
function Garantia() {
  return (
    <div className="garantia aparece">
      <svg className="garantia-reloj" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="5" />
        <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".6">
          <path d="M60 28v6M92 60h-6M60 92v-6M28 60h6" />
        </g>
        <path className="garantia-flecha" d="M60 9 A51 51 0 1 0 111 60" fill="none" stroke="#FF4D5A" strokeWidth="6" strokeLinecap="round" pathLength="100" />
        <path d="M104 66.5 111 57.5 118 66.5" fill="none" stroke="#FF4D5A" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="garantia-punta" />
        <g className="garantia-manos" stroke="currentColor" strokeLinecap="round">
          <line className="mano-hora" x1="60" y1="60" x2="60" y2="42" strokeWidth="6" />
          <line className="mano-minuto" x1="60" y1="60" x2="76" y2="60" strokeWidth="4.5" />
        </g>
        <circle cx="60" cy="60" r="5" fill="currentColor" />
      </svg>
      <div>
        <h3>{GARANTIA.titulo}</h3>
        <p>{GARANTIA.texto}</p>
        <p className="garantia-nota">{GARANTIA.nota}</p>
      </div>
    </div>
  );
}

/* ---------- modalidades y planes mensuales ---------- */
export function Planes() {
  return (
    <section className="seccion blanco" id="planes" aria-labelledby="t-planes">
      <div className="wrap">
        <div className="encabezado">
          <Revelar id="t-planes">Clases particulares o grupales, siempre por Zoom.</Revelar>
        </div>

        <ul className="modalidades">
          {MODALIDADES.map((m) => (
            <li className={`modalidad modalidad-${m.id}`} key={m.id}>
              <span className="modalidad-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {m.id === 'particulares'
                    ? <><circle cx="8" cy="8" r="3" /><path d="M2.5 19a5.5 5.5 0 0 1 11 0" /><rect x="14.5" y="6" width="7" height="5.5" rx="1.2" /><path d="M16 15.5h4" /></>
                    : <><circle cx="12" cy="7.5" r="2.8" /><circle cx="5" cy="9.5" r="2.2" /><circle cx="19" cy="9.5" r="2.2" /><path d="M7 19a5 5 0 0 1 10 0M1.5 18a3.6 3.6 0 0 1 5.4-3.1M22.5 18a3.6 3.6 0 0 0-5.4-3.1" /></>}
                </svg>
              </span>
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
              <p className="modalidad-precio"><span>Desde</span> <b>{m.precio}</b> <span>{m.detalle}</span> <span className="usd">≈ {usd(m.precio)}</span></p>
              {m.mensaje
                ? <a className="enlace-wa" href={wa(m.mensaje)} {...externo}><Icono id="wa" />{m.boton}</a>
                : <a className="enlace-wa" href="#planes-particulares">{m.boton}</a>}
            </li>
          ))}
        </ul>

        <h3 className="planes-titulo" id="planes-particulares">Planes mensuales de clases particulares</h3>
        <div className="planes">
          {PLANES.map((p, i) => (
            <div className="plan" style={i ? { transitionDelay: `.${i}s` } : undefined} key={p.veces}>
              <div><h3>{p.veces}</h3><p className="detalle">{p.clases}, {p.porClase}{p.etiqueta && <span className="etiqueta">{p.etiqueta}</span>}</p></div>
              <div className="precio"><b>{p.precio}<small> COP</small></b><span>≈ {usd(p.precio)} al mes</span></div>
              <a className="btn btn-noche btn-chico" href={wa(p.mensaje)} {...externo}><Icono id="wa" />Elegir</a>
            </div>
          ))}
        </div>
        <Garantia />
        <p className="nota">Precios en pesos colombianos (COP). Los valores en dólares son aproximados, con la TRM del {FECHA_TRM} (${Math.round(TRM).toLocaleString('es-CO')} por dólar). Pagas por Nequi, Daviplata, Davivienda o Bold; si estás fuera de Colombia, Luis te indica cómo pagar desde tu país.</p>
      </div>
    </section>
  );
}

/* ---------- English Time Juniors: la sección de niños ----------
   Luis pidió que se reconozca sola al bajar: un ambiente propio (cuaderno cuadriculado, colores del logo
   de Juniors, figuras que flotan) y letras que dan vueltas. */

/** Título hecho letra por letra: cada letra entra girando, da vueltas de vez en cuando y gira al tocarla. */
function LetrasQueGiran({ texto }: { texto: string }) {
  let n = 0;
  return (
    <>
      {texto.split(' ').map((palabra, p) => (
        <Fragment key={p}>
          <span className="jt-palabra" aria-hidden="true">
            {Array.from(palabra).map((letra) => {
              const i = n++;
              return (
                <span className="jt-l" style={{ '--i': i, '--c': COLORES_LETRAS[i % COLORES_LETRAS.length] } as CSSProperties} key={i}>
                  <span className="jt-v"><span className="jt-g">{letra}</span></span>
                </span>
              );
            })}
          </span>{' '}
        </Fragment>
      ))}
    </>
  );
}

const ICONOS_MISION: Record<(typeof MISIONES)[number]['id'], ReactNode> = {
  blindamos: <><path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.6z" /><path d="m8.6 12 2.4 2.4 4.6-4.8" /></>,
  adelantamos: <><path d="M5 17.5c-1.3 1.3-1.6 3.6-1.6 3.6s2.3-.3 3.6-1.6" /><path d="M14.5 4.2c2.6-1.3 5.3-1.1 5.3-1.1s.2 2.7-1.1 5.3c-1.2 2.4-4.4 5.4-7.3 7.2l-2.9-2.9c1.8-2.9 4.8-6.1 7.2-7.3z" /><path d="m8.6 10.5-3.3.3-2.1 2.6 3.7.9M13.5 15.4l-.3 3.3-2.6 2.1-.9-3.7" /><circle cx="15.6" cy="8.4" r="1.4" /></>,
  nivelamos: <><rect x="3" y="14" width="6" height="6" rx="1" /><rect x="9" y="8" width="6" height="12" rx="1" /><rect x="15" y="3" width="6" height="17" rx="1" /></>,
};

/** Regla de grados: los tres niveles se cruzan a propósito. En 6.° caben los tres; lo que decide es el inglés que sabe. */
const GRADOS = [3, 4, 5, 6, 7, 8, 9];
function ReglaDeGrados() {
  const primero = GRADOS[0];
  return (
    <figure className="regla">
      <div className="regla-tabla" aria-hidden="true">
        <span className="regla-foco" style={{ gridColumn: 6 - primero + 1 }} />
        {GRADOS.map((g) => <span className="regla-grado" style={{ gridColumn: g - primero + 1 }} key={g}>{g}.°</span>)}
        {NIVELES.map((n, i) => (
          <span className={`regla-barra nivel-${n.id}`} key={n.id}
            style={{ gridColumn: `${n.desde - primero + 1} / ${n.hasta - primero + 2}`, gridRow: i + 2, '--d': `${0.25 + i * 0.18}s` } as CSSProperties}>
            {n.nombre}
          </span>
        ))}
      </div>
      <figcaption>Un niño de 6.° puede quedar en cualquiera de los tres grupos. Lo que decide es cuánto inglés sabe.</figcaption>
    </figure>
  );
}

export function Juniors() {
  return (
    <section className="juniors" id="juniors" aria-labelledby="t-juniors">
      {/* Figuras que flotan y giran: solo decoran. */}
      <div className="juniors-deco" aria-hidden="true">
        <svg className="jd jd-estrella" viewBox="0 0 40 40"><path d="M20 3.5l4.9 10 11 1.6-8 7.8 1.9 11L20 28.7l-9.8 5.2 1.9-11-8-7.8 11-1.6z" /></svg>
        <svg className="jd jd-aro" viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" /></svg>
        <svg className="jd jd-triangulo" viewBox="0 0 40 40"><path d="M20 6 35 32H5z" /></svg>
        <svg className="jd jd-mas" viewBox="0 0 40 40"><path d="M20 7v26M7 20h26" /></svg>
        <svg className="jd jd-onda" viewBox="0 0 60 24"><path d="M3 12c6-9 12-9 18 0s12 9 18 0 12-9 18 0" /></svg>
        <span className="jd jd-letra jd-a">A</span>
        <span className="jd jd-letra jd-b">b</span>
        <span className="jd jd-letra jd-c">C</span>
      </div>

      <div className="wrap">
        <div className="juniors-cab">
          <div className="juniors-intro">
            <img className="juniors-logo" src="/assets/juniors-logo.webp" srcSet="/assets/juniors-logo-280.webp 280w, /assets/juniors-logo.webp 520w"
              sizes="(max-width: 700px) 190px, 250px" width={520} height={357} loading="lazy" alt="English Time Juniors" />
            <h1 id="t-juniors" className="jt" aria-label={`English Time Juniors: ${JUNIORS.club}. ${JUNIORS.lema}`}>
              <LetrasQueGiran texto={JUNIORS.club} />
            </h1>
            <p className="juniors-lema" aria-hidden="true">{JUNIORS.lema}</p>
            <p className="juniors-texto aparece">{JUNIORS.texto}</p>
            <p className="juniors-atajos aparece" style={retraso('.1s')}>
              {OFERTAS_JUNIORS.map((o) => (
                <a href="#ofertas" key={o.id} className={`atajo-${o.id}`}>{o.id === 'reto' ? 'Reto de 4 semanas' : 'Kids VIP, 4 por 3'}: <b>{o.precio}</b></a>
              ))}
            </p>
            <a className="btn btn-juniors aparece" style={retraso('.2s')} href={wa(JUNIORS.valoracion)} {...externo} data-fija-desde=""><Icono id="wa" />Agendar la valoración gratis de 15 minutos</a>
          </div>

          <div className="misiones-caja">
            <h2 className="juniors-h3">Un mes, tres misiones</h2>
            <ul className="misiones">
              {MISIONES.map((m, i) => (
                <li className={`mision mision-${m.id}`} style={retraso(`${i * 0.12}s`)} key={m.id}>
                  <span className="mision-icono" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONOS_MISION[m.id]}</svg>
                  </span>
                  <div><h3>{m.titulo}</h3><p>{m.texto}</p></div>
                </li>
              ))}
            </ul>
            <p className="juniors-resultado">{JUNIORS.resultado}</p>
          </div>
        </div>

        {/* Las ofertas van justo después de la presentación: Luis pidió que el papá encuentre rápido lo que se le ofrece. */}
        <div className="juniors-pie" id="ofertas">
          <div className="carpeta">
            <svg className="carpeta-icono" viewBox="0 0 64 52" aria-hidden="true">
              <path d="M4 10a4 4 0 0 1 4-4h14l6 6h28a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#FFC400" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M4 20h56" stroke="currentColor" strokeWidth="2.5" />
              <path className="carpeta-estrella" d="m32 25 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="#F0242C" />
            </svg>
            <h2 className="juniors-h3">La carpeta de logros</h2>
            <p>{RETO.entregaCarpeta}</p>
            <ul>{CARPETA.map((c) => <li key={c}>{c}</li>)}</ul>
            <p className="carpeta-nota">No pagas horas de clase: te llevas resultados que puedes ver.</p>
          </div>

          {/* En el celular las ofertas son un mazo de cartas apiladas (como las promociones de adultos): se deslizan, se tocan o se pasan con las flechas. */}
          <div className="ofertas-zona" id="mazo-juniors">
            <h2 className="oculto">Ofertas de English Time Juniors</h2>
            <ul className="ofertas-juniors">
              {OFERTAS_JUNIORS.map((o, i) => {
                const [numero, ...resto] = o.sello.split(' ');
                return (
                  <li className={`oferta-junior oferta-${o.id}`} data-o={i} key={o.id}>
                    <span className="oferta-sello" aria-hidden="true"><b>{numero}</b>{resto.join(' ')}</span>
                    <span className="chip-junior">{o.chip}</span>
                    <h3>{o.titulo}</h3>
                    <p className="oferta-precio">
                      <b>{o.precio}<small> COP</small></b>
                      {o.tachado && <s><span className="oculto">Antes </span>{o.tachado}</s>}
                    </p>
                    <p className="oferta-nota">≈ {usd(o.precio)} {o.precioNota}. {o.ahorro}</p>
                    <ul className="oferta-incluye">{o.incluye.map((t) => <li key={t}>{t}</li>)}</ul>
                    <p className="oferta-cupos">
                      <span className="asientos" aria-hidden="true">
                        {Array.from({ length: o.cupos }, (_, i) => <i style={{ '--i': i } as CSSProperties} key={i} />)}
                      </span>
                      {o.cuposTexto}
                    </p>
                    {o.id === 'reto' && (
                      <a className="oferta-hermanos" href={wa(HERMANOS.mensaje)} {...externo}>
                        <Icono id="wa" /><span><b>¿Son dos?</b> {HERMANOS.texto}</span>
                      </a>
                    )}
                    <a className="btn btn-juniors" href={wa(o.mensaje)} {...externo}><Icono id="wa" />{o.boton}</a>
                  </li>
                );
              })}
            </ul>
            <div className="deck-controles mazo-controles">
              <button className="deck-flecha" data-dir="-1" aria-label="Oferta anterior"><Icono id="izq" /></button>
              <span className="deck-num" aria-hidden="true">1 / {OFERTAS_JUNIORS.length}</span>
              <button className="deck-flecha" data-dir="1" aria-label="Siguiente oferta"><Icono id="der" /></button>
              <span className="deck-pista">Desliza las tarjetas</span>
            </div>
          </div>
        </div>

        <div className="niveles" id="niveles">
          <div className="niveles-pregunta">
            <h2 className="juniors-h3">¿En qué grupo quedaría tu hijo?</h2>
            <p>No los agrupamos por grado del colegio sino por lo que de verdad saben de inglés.</p>
            <ReglaDeGrados />
            <p className="niveles-q" id="niveles-q"><span className="oculto">Responde esta pregunta: </span>¿Tu hijo ya puede presentarse solo en inglés durante 30 segundos?</p>
            <div className="niveles-opciones" role="group" aria-labelledby="niveles-q">
              {NIVELES.map((n) => (
                <button type="button" className={`nivel-opcion nivel-${n.id}`} data-nivel={n.id} aria-pressed="false" aria-controls={`nivel-${n.id}`} key={n.id}>{n.respuesta}</button>
              ))}
            </div>
          </div>
          <ul className="niveles-lista" aria-live="polite">
            {NIVELES.map((n) => (
              <li className={`nivel nivel-${n.id}`} id={`nivel-${n.id}`} key={n.id}>
                <p className="nivel-numero">{n.numero}<span>{n.grados}</span></p>
                <h3>{n.nombre}</h3>
                <p>{n.perfil}</p>
                <p className="nivel-temas"><b>Ve:</b> {n.temas}</p>
                <a className="enlace-wa" href={wa(n.mensaje)} {...externo}><Icono id="wa" />Quiero un cupo en {n.nombre}</a>
              </li>
            ))}
          </ul>
          <p className="niveles-nota">Mismo tema, distinto reto: con <i lang="en">My Daily Routine</i>, el de 4.° escribe tres oraciones y el de 7.°, seis. Por eso hay solo {JUNIORS.cuposPorNivel} cupos por nivel.</p>
        </div>

      </div>
    </section>
  );
}

/* ---------- preguntas frecuentes ---------- */
export function Preguntas() {
  return (
    <section className="seccion" id="preguntas" aria-labelledby="t-preguntas">
      <div className="wrap">
        <Revelar id="t-preguntas">Preguntas frecuentes</Revelar>
        <div className="preguntas">
          {PREGUNTAS.map((q) => (
            <details key={q.pregunta}>
              <summary>{q.pregunta}</summary>
              <p>{q.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- cierre y pie ---------- */
export function Cierre() {
  return (
    <section className="seccion cierre" id="cierre" aria-labelledby="t-cierre" data-fija-hasta="">
      <Medidor decorativo />
      <div className="wrap">
        <Revelar id="t-cierre">Dentro de un año vas a desear haber empezado hoy.</Revelar>
        <p className="aparece" style={retraso('.4s')}>Escríbele a Luis y empieza esta semana. Te responde él mismo, por WhatsApp.</p>
        <Cuenta className="aparece" style={retraso('.55s')} />
        <a className="btn btn-rojo btn-brillo aparece" style={retraso('.7s')} href={wa(MENSAJES.general)} {...externo}><Icono id="wa" />Escribirle a Luis por WhatsApp</a>
        <p className="numero">O guarda el número: <a href={`tel:${TELEFONO}`}>{TELEFONO_VISIBLE}</a></p>
      </div>
    </section>
  );
}

export function PiePagina({ juniors = false }: { juniors?: boolean }) {
  return (
    <footer>
      <div className="wrap">
        <img src="/assets/logo-blanco.webp" alt="English Time" width={200} height={144} loading="lazy" />
        <span>© 2026 English Time. Clases de inglés por Zoom, particulares 1 a 1 y grupales, desde cualquier país.</span>
        {juniors
          ? <Link className="pie-enlace" href="/">Clases de inglés para adultos</Link>
          : <Link className="pie-enlace" href={JUNIORS.ruta}>English Time Juniors: inglés para niños</Link>}
      </div>
    </footer>
  );
}

/* ---------- página de English Time Juniors ---------- */

/** Cabecera de la página de niños: vuelve al inicio de English Time y abre WhatsApp. */
export function CabeceraJuniors() {
  return (
    <header className="cabecera-juniors">
      <div className="wrap">
        <Link href="/" className="cabecera-logo" aria-label="English Time: clases de inglés para adultos">
          <img src="/assets/logo-claro.webp" alt="English Time" width={260} height={188} />
        </Link>
        <nav className="cabecera-enlaces" aria-label="English Time">
          <Link href="/">Clases para adultos</Link>
          <a className="btn btn-borde" href={wa(JUNIORS.barraFija)} {...externo}><Icono id="wa" />Escribirle a Luis</a>
        </nav>
      </div>
    </header>
  );
}

export function PreguntasJuniors() {
  return (
    <section className="seccion juniors-preguntas" id="preguntas-juniors" aria-labelledby="t-preguntas-juniors">
      <div className="wrap">
        <h2 id="t-preguntas-juniors" className="juniors-h3">Lo que preguntan los papás</h2>
        <div className="preguntas">
          {PREGUNTAS_JUNIORS.map((q) => (
            <details key={q.pregunta}>
              <summary>{q.pregunta}</summary>
              <p>{q.respuesta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CierreJuniors() {
  return (
    <section className="seccion cierre-juniors" id="cierre-juniors" aria-labelledby="t-cierre-juniors" data-fija-hasta="">
      <div className="wrap">
        <img className="juniors-logo visto" src="/assets/juniors-logo-280.webp" alt="" width={280} height={192} loading="lazy" />
        <h2 id="t-cierre-juniors">Que vuelva al colegio adelantado.</h2>
        <p>Agenda la valoración gratis de 15 minutos y te decimos en qué grupo queda tu hijo.</p>
        <a className="btn btn-juniors" href={wa(JUNIORS.valoracion)} {...externo}><Icono id="wa" />Agendar la valoración gratis</a>
        <p className="numero">O guarda el número: <a href={`tel:${TELEFONO}`}>{TELEFONO_VISIBLE}</a></p>
      </div>
    </section>
  );
}
