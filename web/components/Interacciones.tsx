'use client';

import { useEffect } from 'react';
import { FIN_PROMOS } from '@/lib/contenido';

/* Toda la vida de la página: entradas al hacer scroll, cuenta regresiva, el día que cambia de color,
   la barra fija de WhatsApp, el mazo de promociones y la sección de niños. Es la misma lógica de la landing original;
   trabaja sobre el HTML que ya pintó el servidor y no renderiza nada. */
export default function Interacciones() {
  useEffect(() => {
    const limpiar: Array<() => void> = [];
    const escuchar = (el: EventTarget, tipo: string, fn: EventListener, opciones?: AddEventListenerOptions) => {
      el.addEventListener(tipo, fn, opciones);
      limpiar.push(() => el.removeEventListener(tipo, fn, opciones));
    };
    const temporizadores: number[] = [];
    const despues = (fn: () => void, ms: number) => { temporizadores.push(window.setTimeout(fn, ms)); };

    const movimiento = document.documentElement.classList.contains('anim');
    const dos = (n: number) => (n < 10 ? '0' : '') + n;
    const todos = <T extends Element = HTMLElement>(sel: string, raiz: ParentNode = document) => Array.from(raiz.querySelectorAll<T>(sel));

    /* 1. Entradas al hacer scroll: cada bloque se marca una sola vez cuando aparece. */
    const deck = document.getElementById('deck');
    const revelables = todos('.revelar, .aparece, .escena, .versus-fila, .pasos, .plan, .objetivo, .modalidad, .cierre, .deck, .juniors-logo, .jt, .mision, .nivel, .carpeta, .oferta-junior, .regla');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('visto');
          if (deck && e.target === deck) { deck.classList.add('repartir'); despues(() => deck.classList.remove('repartir'), 1300); }
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
      revelables.forEach((el) => io.observe(el));
      limpiar.push(() => io.disconnect());
    } else {
      revelables.forEach((el) => el.classList.add('visto'));
    }

    /* 2. Cuenta regresiva hasta el cierre de las promociones. */
    const fin = new Date(FIN_PROMOS).getTime();
    let intervalo = 0;
    const tic = () => {
      const ms = fin - Date.now();
      if (ms <= 0) {
        todos('[data-cuenta]').forEach((c) => { c.innerHTML = '<p class="cuenta-tit">Las promociones de Black Friday terminaron. Escríbele a Luis para conocer las de diciembre.</p>'; });
        todos('[data-cuenta-corta]').forEach((c) => { c.textContent = 'ya terminaron'; });
        return false;
      }
      const t: Record<string, number> = { d: Math.floor(ms / 864e5), h: Math.floor(ms % 864e5 / 36e5), m: Math.floor(ms % 36e5 / 6e4), s: Math.floor(ms % 6e4 / 1e3) };
      todos('[data-cuenta] [data-u]').forEach((b) => {
        const v = dos(t[b.dataset.u as string]);
        if (b.textContent === v) return;
        b.textContent = v;
        if (movimiento) { b.classList.remove('tic'); void b.offsetWidth; b.classList.add('tic'); }
      });
      todos('[data-cuenta-corta]').forEach((c) => { c.textContent = t.d + 'd ' + dos(t.h) + 'h ' + dos(t.m) + 'm ' + dos(t.s) + 's'; });
      return true;
    };
    if (tic()) intervalo = window.setInterval(() => { if (!tic()) window.clearInterval(intervalo); }, 1000);
    limpiar.push(() => window.clearInterval(intervalo));

    /* 3. Un día en inglés: cada escena cambia el color de la sección y mueve los relojes a su hora. */
    const dia = document.getElementById('dia');
    let revisarDia = () => {};
    if (dia) {
      const escenas = todos('.escena', dia);
      const ahora = escenas[escenas.length - 1];
      const miniHora = dia.querySelector('.mini-hora') as HTMLElement;
      const miniPasos = todos('.mini-pasos i', dia);
      let activa: HTMLElement | null = null;
      let minActual = 420, girado = 0;
      const etiqueta = (min: number) => { const h = Math.floor(min / 60) % 24; return (h % 12 || 12) + ':' + dos(min % 60) + ' ' + (h < 12 ? 'a.m.' : 'p.m.'); };
      // Las manecillas giran por el camino más corto (hasta 6 horas hacia adelante o hacia atrás).
      const mover = (min: number) => {
        let d = ((min - minActual) % 720 + 720) % 720;
        if (d > 360) d -= 720;
        girado += d; minActual = min;
        todos<SVGElement>('.mano-h', dia).forEach((x) => { x.style.transform = 'rotate(' + (210 + girado * 0.5) + 'deg)'; });
        todos<SVGElement>('.mano-m', dia).forEach((x) => { x.style.transform = 'rotate(' + (girado * 6) + 'deg)'; });
      };
      // La última escena es la hora real de quien visita: saludo y colores según el momento del día.
      const momentoDe = (h: number) => (h < 5 || h >= 19 ? 'noche' : h < 10 ? 'manana' : h < 14 ? 'mediodia' : h < 17 ? 'tarde' : 'atardecer');
      const saludoDe = (h: number) => (h >= 5 && h < 12 ? 'Buenos días' : h >= 12 && h < 19 ? 'Buenas tardes' : 'Buenas noches');
      const pintarAhora = () => {
        const d = new Date(), h = d.getHours(), m = d.getMinutes(), min = h * 60 + m;
        (document.getElementById('previa-ahora') as HTMLElement).textContent = saludoDe(h) + '. ' + ((h % 12 || 12) === 1 ? 'Ahora mismo es la' : 'Ahora mismo son las');
        (document.getElementById('hora-ahora') as HTMLElement).innerHTML = (h % 12 || 12) + ':' + dos(m) + '<small>' + (h < 12 ? 'a.m.' : 'p.m.') + '</small>';
        ahora.dataset.min = String(min);
        ahora.dataset.momento = momentoDe(h);
        if (activa === ahora) { mover(min); miniHora.textContent = etiqueta(min); dia.dataset.momento = ahora.dataset.momento; }
      };
      pintarAhora();
      const relojAhora = window.setInterval(pintarAhora, 30000);
      limpiar.push(() => window.clearInterval(relojAhora));
      revisarDia = () => {
        const mitad = innerHeight / 2;
        let nueva: HTMLElement | null = null;
        for (const e of escenas) {
          const r = e.getBoundingClientRect();
          if (r.top <= mitad && r.bottom > mitad) { nueva = e; break; }
        }
        if (!nueva) nueva = escenas[0].getBoundingClientRect().top > mitad ? escenas[0] : ahora;
        if (nueva === activa) return;
        activa = nueva;
        const idx = escenas.indexOf(nueva);
        dia.dataset.momento = nueva.dataset.momento;
        mover(Number(nueva.dataset.min));
        miniHora.textContent = etiqueta(Number(nueva.dataset.min));
        miniPasos.forEach((p, i) => p.classList.toggle('on', i <= idx));
      };
    }

    /* Hora local de cada país del mapa. */
    const zonas = todos('[data-zona]');
    const pintarZonas = () => {
      const fecha = new Date();
      zonas.forEach((z) => {
        try {
          const p = new Intl.DateTimeFormat('en-US', { timeZone: z.dataset.zona, hour: 'numeric', minute: '2-digit', hour12: true }).formatToParts(fecha);
          const v = (t: string) => p.find((x) => x.type === t)?.value ?? '';
          z.textContent = v('hour') + ':' + v('minute') + ' ' + (v('dayPeriod').toUpperCase() === 'AM' ? 'a.m.' : 'p.m.');
        } catch { /* zona horaria no soportada: se queda sin hora */ }
      });
    };
    if (zonas.length) {
      pintarZonas();
      const relojZonas = window.setInterval(pintarZonas, 30000);
      limpiar.push(() => window.clearInterval(relojZonas));
    }

    /* 4. Barra fija de WhatsApp: aparece cuando el primer botón de la página ([data-fija-desde]) sale de la pantalla
       y se esconde al llegar al cierre ([data-fija-hasta]). En la página de Juniors es la versión de niños. */
    const fija = document.getElementById('fija');
    const desde = document.querySelector('[data-fija-desde]');
    const hasta = document.querySelector('[data-fija-hasta]');
    let fijaVisible = false;
    const revisarFija = () => {
      if (!fija || !desde) return;
      const ver = desde.getBoundingClientRect().bottom < 0 && (!hasta || hasta.getBoundingClientRect().top > innerHeight * 0.55);
      if (ver === fijaVisible) return;
      fijaVisible = ver;
      fija.classList.toggle('visible', ver);
      fija.setAttribute('aria-hidden', String(!ver));
      if (ver) fija.removeAttribute('inert'); else fija.setAttribute('inert', '');
    };

    let pendiente = false, cuadro = 0;
    const alScroll = () => { pendiente = false; revisarDia(); revisarFija(); };
    const pedir = () => { if (!pendiente) { pendiente = true; cuadro = requestAnimationFrame(alScroll); } };
    escuchar(window, 'scroll', pedir, { passive: true });
    escuchar(window, 'resize', pedir);
    escuchar(window, 'load', pedir);
    limpiar.push(() => cancelAnimationFrame(cuadro));
    alScroll();

    /* Cartas de los mazos (promociones de adultos y ofertas de Juniors). */
    type Carta = HTMLElement & { _t?: number };
    const sinTransicion = (el: HTMLElement, fn: () => void) => { el.style.transition = 'none'; fn(); void el.offsetWidth; el.style.transition = ''; };
    /** Mueve un mazo: hacia adelante, la carta de adelante sale volando a la izquierda y vuelve al fondo;
        hacia atrás, la carta anterior entra desde la izquierda. */
    const volarCarta = (vieja: Carta, entra: Carta, dir: number) => {
      if (!movimiento) return;
      if (dir > 0) {
        window.clearTimeout(vieja._t);
        vieja.classList.add('sale');
        vieja._t = window.setTimeout(() => sinTransicion(vieja, () => vieja.classList.remove('sale')), 460);
      } else {
        window.clearTimeout(entra._t);
        sinTransicion(entra, () => entra.classList.add('sale'));
        requestAnimationFrame(() => requestAnimationFrame(() => entra.classList.remove('sale')));
      }
    };

    /* 5. Mazo de promociones: avanza solo como historias, se puede deslizar, tocar o usar con las flechas. */
    if (deck) {
      const cartas = todos<Carta>('.carta', deck);
      const tabs = todos('.deck-tab', deck);
      const paneles = todos('.deck-panel', deck);
      const num = deck.querySelector('.deck-num') as HTMLElement;
      const mesa = deck.querySelector('.deck-mesa') as HTMLElement;
      const n = cartas.length;
      let act = 0, auto = movimiento, enVista = false, encima = false;

      const pintarDeck = () => {
        cartas.forEach((c, i) => { c.dataset.o = String((i - act + n) % n); });
        tabs.forEach((t, i) => { t.setAttribute('aria-selected', String(i === act)); t.tabIndex = i === act ? 0 : -1; });
        paneles.forEach((p, i) => {
          const on = i === act;
          p.classList.toggle('activo', on);
          p.setAttribute('aria-hidden', String(!on));
          if (on) p.removeAttribute('inert'); else p.setAttribute('inert', '');
        });
        num.textContent = (act + 1) + ' / ' + n;
      };
      const ir = (destino: number, dir: number) => {
        const nueva = (destino + n) % n;
        if (nueva === act) return;
        volarCarta(cartas[act], cartas[nueva], dir);
        act = nueva;
        pintarDeck();
      };
      limpiar.push(() => cartas.forEach((c) => window.clearTimeout(c._t)));
      const estadoAuto = () => {
        deck.classList.toggle('auto', auto);
        deck.classList.toggle('pausa', !enVista || encima || document.hidden);
      };
      const parar = () => { if (auto) { auto = false; estadoAuto(); } };

      escuchar(deck, 'animationend', ((e: AnimationEvent) => {
        if (auto && e.animationName === 'llenar' && (e.target as Element).closest('.deck-tab') === tabs[act]) ir(act + 1, 1);
      }) as EventListener);
      escuchar(deck, 'mouseenter', () => { encima = true; estadoAuto(); });
      escuchar(deck, 'mouseleave', () => { encima = false; estadoAuto(); });
      escuchar(document, 'visibilitychange', estadoAuto);
      if ('IntersectionObserver' in window) {
        const vista = new IntersectionObserver((es) => { enVista = es[0].isIntersecting; estadoAuto(); }, { threshold: 0.35 });
        vista.observe(deck);
        limpiar.push(() => vista.disconnect());
      }

      tabs.forEach((t, i) => {
        escuchar(t, 'click', () => { parar(); ir(i, i > act ? 1 : -1); });
        escuchar(t, 'keydown', ((e: KeyboardEvent) => {
          const k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
          if (!k) return;
          e.preventDefault(); parar(); ir(act + k, k); tabs[act].focus();
        }) as EventListener);
      });
      todos('.deck-flecha', deck).forEach((b) => {
        escuchar(b, 'click', () => { parar(); const d = Number(b.dataset.dir); ir(act + d, d); });
      });

      // Arrastrar con el dedo o el mouse; un toque en la carta de adelante abre el WhatsApp de esa promo.
      let x0: number | null = null, dx = 0, arrastra = false, puntero: number | null = null, objetivo: Carta | null = null;
      escuchar(mesa, 'pointerdown', ((e: PointerEvent) => {
        if (e.button) return;
        x0 = e.clientX; dx = 0; arrastra = false; puntero = e.pointerId; objetivo = (e.target as Element).closest('.carta');
      }) as EventListener);
      escuchar(mesa, 'pointermove', ((e: PointerEvent) => {
        if (x0 === null || e.pointerId !== puntero) return;
        dx = e.clientX - x0;
        if (!arrastra && Math.abs(dx) > 8) {
          arrastra = true; parar();
          try { mesa.setPointerCapture(puntero); } catch { /* el puntero ya se soltó */ }
          cartas[act].style.transition = 'none';
        }
        if (arrastra) cartas[act].style.transform = 'translateX(' + dx + 'px) rotate(' + (dx / 18) + 'deg)';
      }) as EventListener);
      const soltar = ((e: PointerEvent) => {
        if (x0 === null) return;
        x0 = null;
        const frente = cartas[act];
        if (!arrastra) {
          if (e.type !== 'pointerup' || !objetivo) return;
          const i = cartas.indexOf(objetivo);
          if (i === act) (paneles[act].querySelector('a.btn') as HTMLAnchorElement).click();
          else { parar(); ir(i, 1); }
          return;
        }
        frente.style.transition = ''; frente.style.transform = '';
        if (dx < -60) ir(act + 1, 1);
        else if (dx > 60) ir(act - 1, -1);
      }) as EventListener;
      escuchar(mesa, 'pointerup', soltar);
      escuchar(mesa, 'pointercancel', soltar);

      pintarDeck();
      estadoAuto();
    }

    /* 6. Sello de Black Friday (y aviso de Juniors): cambia de mensaje, gira más rápido al pasar el mouse y se inclina hacia el puntero. */
    const sellos = todos('.sello, [data-rota]');
    if (movimiento) {
      let k = 0;
      const cambiarOferta = window.setInterval(() => {
        if (document.hidden) return;
        k++;
        sellos.forEach((s) => {
          const ofertas = todos('.sello-oferta, .aviso-msj', s), n = ofertas.length;
          ofertas.forEach((o, i) => { o.classList.toggle('on', i === k % n); o.classList.toggle('sale', i === (k - 1) % n); });
        });
      }, 2000);
      limpiar.push(() => window.clearInterval(cambiarOferta));
      sellos.forEach((s) => {
        const giro = s.querySelector('.sello-giro, .aviso-anillo');
        const velocidad = (v: number) => giro?.getAnimations().forEach((a) => a.updatePlaybackRate(v));
        escuchar(s, 'pointerenter', () => velocidad(5));
        escuchar(s, 'pointerleave', () => velocidad(1));
      });
      const arte = document.querySelector('.sello-arte .sello-cuerpo') as HTMLElement | null;
      const heroe = document.querySelector('.hero') as HTMLElement;
      if (arte && matchMedia('(pointer: fine)').matches) {
        escuchar(heroe, 'pointermove', ((e: PointerEvent) => {
          const r = arte.getBoundingClientRect();
          const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 500));
          const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 500));
          arte.style.setProperty('--ry', (x * 18).toFixed(1) + 'deg');
          arte.style.setProperty('--rx', (-y * 18).toFixed(1) + 'deg');
        }) as EventListener);
        escuchar(heroe, 'pointerleave', () => { arte.style.removeProperty('--rx'); arte.style.removeProperty('--ry'); });
      }
    }

    /* 7. Mapa: un punto de luz sale de Colombia hacia cada país, y después vuelve a salir de vez en cuando. */
    const mapa = document.getElementById('mapa');
    if (mapa) {
      const grupos = todos<SVGGElement>('.mapa-destino', mapa);
      const rutas = grupos.map((g) => g.querySelector('.mapa-ruta') as SVGPathElement);
      const puntos = grupos.map((g) => g.querySelector('.mapa-punto') as SVGGElement);
      const chips = todos<HTMLButtonElement>('.mapa-chip[data-i]');
      const largos = rutas.map((r) => r.getTotalLength());
      const vuelos: number[] = [];
      const suave = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      let escala = 1;
      const medir = () => { escala = Math.min(2.6, Math.max(1, 900 / (mapa.clientWidth || 900))); };
      medir();
      escuchar(window, 'resize', medir);
      limpiar.push(() => vuelos.forEach((v) => cancelAnimationFrame(v)));

      const llegar = (i: number) => {
        const g = grupos[i];
        g.classList.add('llego');
        g.classList.remove('pulso'); void g.getBoundingClientRect(); g.classList.add('pulso');
      };
      const volar = (i: number, ms: number, dibujar: boolean) => {
        const ruta = rutas[i], punto = puntos[i], largo = largos[i], g = grupos[i];
        cancelAnimationFrame(vuelos[i]);
        g.classList.add('volando');
        const t0 = performance.now();
        const paso = (ahoraMs: number) => {
          const t = Math.min(1, (ahoraMs - t0) / ms), e = suave(t), l = e * largo;
          const p = ruta.getPointAtLength(l);
          punto.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${escala.toFixed(2)})`);
          if (dibujar) ruta.style.strokeDashoffset = String(largo * (1 - e));
          if (t < 1) { vuelos[i] = requestAnimationFrame(paso); return; }
          g.classList.remove('volando');
          llegar(i);
        };
        vuelos[i] = requestAnimationFrame(paso);
      };

      let armado = !movimiento, enVistaMapa = false, foco = -1;
      if (!movimiento) grupos.forEach((g) => g.classList.add('llego'));
      const despegar = () => {
        rutas.forEach((r, i) => { r.style.strokeDasharray = largos[i] + ' ' + largos[i]; r.style.strokeDashoffset = String(largos[i]); });
        mapa.classList.add('armado');
        grupos.forEach((_, i) => despues(() => volar(i, 1400 + largos[i] * 1.1, true), 300 + i * 280));
        // Después de la primera salida, cada pocos segundos sale otro punto por una ruta ya trazada.
        let siguiente = 0;
        despues(() => {
          const bucle = window.setInterval(() => {
            if (document.hidden || !enVistaMapa || foco >= 0) return;
            const i = siguiente++ % grupos.length;
            volar(i, 1600 + largos[i] * 1.6, false);
          }, 1900);
          limpiar.push(() => window.clearInterval(bucle));
        }, 300 + grupos.length * 280 + 2600);
      };
      if ('IntersectionObserver' in window) {
        const vistaMapa = new IntersectionObserver((es) => {
          enVistaMapa = es[0].isIntersecting;
          mapa.classList.toggle('en-vista', enVistaMapa);
          if (enVistaMapa && !armado) { armado = true; despegar(); }
        }, { threshold: 0.3 });
        vistaMapa.observe(mapa);
        limpiar.push(() => vistaMapa.disconnect());
      } else if (!armado) { armado = true; despegar(); }

      // Al pasar por (o tocar) un país de la lista, su ruta se destaca y sale un punto hacia allá.
      const enfocar = (i: number) => {
        foco = i;
        mapa.classList.toggle('con-foco', i >= 0);
        grupos.forEach((g, j) => g.classList.toggle('foco', j === i));
        chips.forEach((c, j) => c.classList.toggle('foco', j === i));
        if (i >= 0 && mapa.classList.contains('armado') && movimiento) volar(i, 1500 + largos[i] * 1.2, false);
      };
      let soltarFoco = 0;
      chips.forEach((c) => {
        const i = Number(c.dataset.i);
        escuchar(c, 'pointerenter', ((e: PointerEvent) => { if (e.pointerType === 'mouse') enfocar(i); }) as EventListener);
        escuchar(c, 'pointerleave', ((e: PointerEvent) => { if (e.pointerType === 'mouse') enfocar(-1); }) as EventListener);
        escuchar(c, 'focus', () => enfocar(i));
        escuchar(c, 'blur', () => enfocar(-1));
        escuchar(c, 'click', () => {
          enfocar(i);
          window.clearTimeout(soltarFoco);
          soltarFoco = window.setTimeout(() => { if (document.activeElement !== c) enfocar(-1); }, 2600);
        });
      });
      limpiar.push(() => window.clearTimeout(soltarFoco));
    }

    /* 8. English Time Juniors: las letras del título giran al tocarlas, las figuras flotan solo
       mientras la sección se ve, y la pregunta de "30 segundos en inglés" señala el grupo del niño. */
    const juniors = document.getElementById('juniors');
    if (juniors) {
      if ('IntersectionObserver' in window) {
        const vistaJuniors = new IntersectionObserver((es) => { juniors.classList.toggle('en-vista', es[0].isIntersecting); }, { threshold: 0.05 });
        vistaJuniors.observe(juniors);
        limpiar.push(() => vistaJuniors.disconnect());
      }
      if (movimiento) {
        const girar = (e: Event) => {
          const g = (e.target as Element).closest('.jt-l')?.querySelector('.jt-g');
          if (!g || g.classList.contains('gira')) return;
          g.classList.add('gira');
          g.addEventListener('animationend', () => g.classList.remove('gira'), { once: true });
        };
        const titulo = juniors.querySelector('.jt');
        if (titulo) { escuchar(titulo, 'pointerover', girar); escuchar(titulo, 'pointerdown', girar); }
      }
      const opciones = todos<HTMLButtonElement>('.nivel-opcion', juniors);
      const niveles = todos('.nivel', juniors);
      const lista = juniors.querySelector('.niveles-lista') as HTMLElement | null;
      opciones.forEach((b) => {
        escuchar(b, 'click', () => {
          const id = b.dataset.nivel;
          opciones.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
          niveles.forEach((n) => n.classList.toggle('elegido', n.id === 'nivel-' + id));
          lista?.classList.add('con-eleccion');
          const elegido = document.getElementById('nivel-' + id);
          // Si la tarjeta no se ve, se lleva a la vista: de lado dentro de la fila (celular) y, si hace falta, hacia abajo.
          // (Sin scrollIntoView, que en el celular también corría la página de lado.)
          if (elegido && lista) {
            const comportamiento: ScrollBehavior = movimiento ? 'smooth' : 'auto';
            if (lista.scrollWidth > lista.clientWidth) {
              const izquierda = lista.scrollLeft + elegido.getBoundingClientRect().left - lista.getBoundingClientRect().left - 16;
              lista.scrollTo({ left: izquierda, behavior: comportamiento });
            }
            const r = elegido.getBoundingClientRect();
            if (r.top < 0 || r.bottom > innerHeight) window.scrollBy({ top: r.top - Math.max(16, (innerHeight - r.height) / 2), behavior: comportamiento });
          }
        });
      });
    }

    /* 9. Ofertas de Juniors en el celular: un mazo como el de las promociones de adultos.
       Se pasa deslizando, tocando la carta de atrás o con las flechas; en escritorio las tarjetas van lado a lado. */
    const mazoJ = document.getElementById('mazo-juniors');
    if (mazoJ) {
      const listaJ = mazoJ.querySelector('.ofertas-juniors') as HTMLElement;
      const cartasJ = todos<Carta>('.oferta-junior', mazoJ);
      const numJ = mazoJ.querySelector('.deck-num') as HTMLElement;
      const celular = matchMedia('(max-width: 700px)');
      const nJ = cartasJ.length;
      let actJ = 0;
      const pintarJ = () => {
        cartasJ.forEach((c, i) => { c.dataset.o = String((i - actJ + nJ) % nJ); });
        numJ.textContent = (actJ + 1) + ' / ' + nJ;
      };
      const irJ = (destino: number, dir: number) => {
        const nueva = (destino + nJ) % nJ;
        if (nueva === actJ) return;
        volarCarta(cartasJ[actJ], cartasJ[nueva], dir);
        actJ = nueva;
        pintarJ();
      };
      limpiar.push(() => cartasJ.forEach((c) => window.clearTimeout(c._t)));
      todos('.deck-flecha', mazoJ).forEach((b) => {
        escuchar(b, 'click', () => { const d = Number(b.dataset.dir); irJ(actJ + d, d); });
      });
      // Con el teclado: si el foco entra a la carta de atrás, esa carta pasa adelante.
      escuchar(listaJ, 'focusin', ((e: FocusEvent) => {
        if (!celular.matches) return;
        const i = cartasJ.indexOf((e.target as Element).closest('.oferta-junior') as Carta);
        if (i >= 0 && i !== actJ) irJ(i, 1);
      }) as EventListener);

      // Arrastrar de lado mueve la carta de adelante; un toque en la de atrás la trae. Los botones de adentro siguen funcionando.
      let jx0: number | null = null, jy0 = 0, jdx = 0, jArrastra = false, jPuntero: number | null = null, jObjetivo: Carta | null = null, recienArrastro = false;
      escuchar(listaJ, 'pointerdown', ((e: PointerEvent) => {
        if (!celular.matches || e.button) return;
        jx0 = e.clientX; jy0 = e.clientY; jdx = 0; jArrastra = false; jPuntero = e.pointerId;
        jObjetivo = (e.target as Element).closest('.oferta-junior');
      }) as EventListener);
      escuchar(listaJ, 'pointermove', ((e: PointerEvent) => {
        if (jx0 === null || e.pointerId !== jPuntero) return;
        jdx = e.clientX - jx0;
        if (!jArrastra && Math.abs(jdx) > 10 && Math.abs(jdx) > Math.abs(e.clientY - jy0)) {
          jArrastra = true;
          try { listaJ.setPointerCapture(jPuntero); } catch { /* el puntero ya se soltó */ }
          cartasJ[actJ].style.transition = 'none';
        }
        if (jArrastra) cartasJ[actJ].style.transform = 'translateX(' + jdx + 'px) rotate(' + (jdx / 18) + 'deg)';
      }) as EventListener);
      const soltarJ = ((e: PointerEvent) => {
        if (jx0 === null) return;
        jx0 = null;
        if (!jArrastra) {
          if (e.type === 'pointerup' && jObjetivo && jObjetivo !== cartasJ[actJ]) irJ(cartasJ.indexOf(jObjetivo), 1);
          return;
        }
        recienArrastro = true;
        despues(() => { recienArrastro = false; }, 60);
        const frente = cartasJ[actJ];
        frente.style.transition = ''; frente.style.transform = '';
        if (jdx < -60) irJ(actJ + 1, 1);
        else if (jdx > 60) irJ(actJ - 1, -1);
      }) as EventListener;
      escuchar(listaJ, 'pointerup', soltarJ);
      escuchar(listaJ, 'pointercancel', soltarJ);
      // Si se arrastró, el clic que llega al soltar no abre WhatsApp.
      escuchar(listaJ, 'click', ((e: MouseEvent) => { if (recienArrastro) { e.preventDefault(); e.stopPropagation(); } }) as EventListener, { capture: true });

      // La primera vez que el mazo aparece en el celular, la carta de atrás asoma para mostrar que se puede pasar.
      if (movimiento && 'IntersectionObserver' in window) {
        const vistaMazo = new IntersectionObserver((es) => {
          if (!es[0].isIntersecting || !celular.matches) return;
          vistaMazo.disconnect();
          despues(() => mazoJ.classList.add('asoma'), 1100);
          despues(() => mazoJ.classList.remove('asoma'), 2500);
        }, { threshold: 0.45 });
        vistaMazo.observe(mazoJ);
        limpiar.push(() => vistaMazo.disconnect());
      }
      pintarJ();
    }

    return () => {
      temporizadores.forEach((t) => window.clearTimeout(t));
      limpiar.forEach((fn) => fn());
    };
  }, []);

  return null;
}
