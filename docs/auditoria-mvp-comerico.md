# Auditoría del MVP ComeRICO: diagnóstico y propuesta de mejoras

**Fecha:** 25 de noviembre de 2026
**Alcance:** todo el código de la aplicación: `src/App.tsx` (6 577 líneas, 35 pantallas) y `src/index.css` (4 499 líneas).
**Estado:** solo análisis y propuesta. **No se modificó el código.**

**Cómo leer las referencias**
- `L1234` = línea de `src/App.tsx`. `css L1234` = línea de `src/index.css`.
- Estado de implementación: ✅ implementada · 🟡 parcial · 🎭 simulada (datos o acciones de demostración) · ❌ inexistente · ❔ no verificable.
- Severidad (Nielsen): 0 sin problema · 1 cosmético · 2 menor · 3 grave · 4 crítico.

**Limitaciones del método**
- Leí el código completo línea por línea.
- No pude ejecutar la app: el servidor de desarrollo no respondía en `localhost:8443` durante la auditoría. Los hallazgos visuales y responsive salen de leer el CSS y van marcados como **"a verificar visualmente"**.
- No hay backend, API ni base de datos. Todo lo que depende de servicios externos (pagos, push, GPS) se clasifica como 🎭 o ❌, no como ❔.

---

## 1. Diagnóstico general

### 1.1 Arquitectura y tecnologías

| Aspecto | Situación actual | Evidencia |
|---|---|---|
| Stack | React 19, Vite 8, TypeScript 5.7 (`strict`), Tailwind v4 | `package.json`, `tsconfig.json` |
| Estilos | Tailwind solo se importa. Ningún JSX usa clases utilitarias: las 619 `className` son clases semánticas propias en `index.css` | `src/index.css` L1-2 |
| Estructura | **Un solo archivo** con todas las pantallas, datos, reglas de negocio e iconos | `src/App.tsx` |
| Navegación | Sin router. Un `switch` sobre `type Screen` (35 valores) y una pila propia `stack` con `go`/`goBack`. No hay URLs ni historial del navegador | L3-37, L6234-6245, L6405-6516 |
| Estado | ~30 `useState` en `App()`, expuestos mediante `ShopContext` (más de 60 miembros) | L1066-1131, L6170-6233 |
| Datos | 100 % estáticos y en memoria: `offers`, `stores`, `initialOrders`, `initialUser`, `LEVELS`, `WHEEL` | L77, L222, L671, L727, L744, L915 |
| Persistencia | Ninguna (no usa `localStorage` ni API). Recargar reinicia todo | búsqueda sin resultados |
| Roles | Cliente y negocio (La Espiga) en la misma app, con login de demostración | L1672-1685 |
| Capa de prototipo | Panel lateral "FRAME · heurísticas" con salto a cualquier pantalla, y botón flotante "Frames" en móvil | L6539-6573, css L2143 |

### 1.2 Lo que funciona bien y conviene conservar
- **Compra unitaria corta y con confirmación explícita:** Detalle → Pago → modal "¿Confirmas tu pedido?" → Confirmación. Tiene stepper (L1486), etiqueta honesta "DEMO · PAGO SIMULADO" (L2600), estado "Procesando…" que evita doble envío (L2571-2581) y pantalla de pago rechazado (L2844).
- **Totales transparentes:** subtotal, envío, premio, cupón, créditos, total y vista previa de puntos y de nivel (L2554-2560, L2757-2806). Los descuentos de los 9 packs coinciden con sus precios (55 %, 56 %, 53 %, 53 %, 53 %, 52 %, 50 %, 52 %, 50 %).
- **Estados vacíos y de error bien resueltos:** sin cobertura (L2123), sin resultados (L2098), sin giros (L4614, L4657), formularios con conteo de errores (L5609).
- **Deshacer** en el plan (L4158), en "Ya lo recibí" (L3120) y en las ofertas publicadas (L5594).
- **Validaciones del negocio sólidas:** descuento mínimo del 30 %, hora límite al menos 30 min en el futuro y alérgenos obligatorios (L5531-5541).
- **Ayuda contextual:** los iconos ⓘ abren la FAQ en el tema exacto (L4885).

### 1.3 Principales debilidades

1. **Faltan reglas de negocio críticas.**
   - El stock nunca se descuenta.
   - Se puede pagar un pack cuya hora límite ya pasó.
   - Las cuentas regresivas son números fijos.
2. **"¿A qué hora recibo mi comida?" está mal resuelto.**
   - No existe ventana de recojo ni se elige franja.
   - El Detalle no muestra la hora límite.
   - El delivery promete siempre "30–45 min" y el seguimiento "12–18 min".
3. **Las recompensas se entregan al pagar, no al completar.**
   - Al cancelar se revierten los puntos.
   - Pero no se revierten los giros, los premios de la ruleta ni el premio por subir de nivel.
4. **El planificador ya es una suscripción recurrente** (cobro "cada domingo por adelantado"), pero:
   - no cobra ni genera pedidos;
   - no valida horarios ni cobertura;
   - inventa los precios de los tamaños.
5. **Cliente y negocio están desconectados.**
   - Los pedidos del negocio son ficticios y "Marcar listo" no cambia nada para el cliente.
   - Las ofertas publicadas no llegan al catálogo.
   - Los alérgenos que declara el negocio se descartan.
6. **Hay conceptos mezclados.**
   - El nivel "Plus" suena a membresía pagada.
   - El nivel Oro da "delivery gratis", que es el beneficio típico de una membresía premium.
   - "ComeRICO Pass" ya aparece en el perfil.
   - Hay cinco "monedas" de recompensa: puntos, créditos, cupones, platos gratis y giros.
7. **El pedido de recojo no tiene ciclo de vida.** Queda en "Reservado" indefinidamente y no existe un detalle de pedido para volver a ver el código o el QR.

**Veredicto.** Es un prototipo de alta fidelidad visual con buena base de interacción. Pero como MVP funcional hoy no garantiza coherencia en stock, horarios, pedidos, recompensas ni suscripción.

**No recomiendo reconstruirlo.** Basta con una capa mínima de reglas de dominio (estados tipados y funciones puras de disponibilidad, precio y puntos) que las pantallas existentes consulten.

---

## 2. Inventario de funcionalidades

| # | Funcionalidad | Componentes / líneas | Estado | Observaciones |
|---|---|---|---|---|
| 1 | Inicio de sesión | `Login` L1687, `demoUsers` L1672 | 🎭 | Credenciales demo precargadas (L1689-1690). Alterna entre cliente y negocio |
| 2 | Registro | `Signup` L5156 | 🟡 | Valida bien, pero **solo reemplaza `user`** (L5250-5257): la cuenta nueva hereda los pedidos, 1 180 pts, S/ 18 de créditos y favoritos de Valeria |
| 3 | Recuperar contraseña | `Forgot` L5095 | 🎭 | Solo muestra confirmación |
| 4 | Onboarding | `Onboarding` L4830, L6522 | ✅ | Aparece **después** del login. El paso 3 promociona la ruleta "en cada pedido" |
| 5 | Inicio / descubrimiento | `Home` L1788 | 🟡 | Destacados fijos (L1927). "Ofertas cerca de ti" es una lista fija no ordenada por distancia (L1975-1982) |
| 6 | Búsqueda, filtros, orden | `AllPacks` L2011 | ✅ sobre datos fijos | Filtros: ≤ S/ 10, < 400 m, cierra en 45 min. Sin preferencias alimentarias. El contador incluye packs agotados |
| 7 | Mapa | `MapScreen` L2172 | 🎭 | Pines en posiciones fijas. "Permitir ubicación" solo muestra un toast (L2198) |
| 8 | Direcciones y cobertura | `Locations` L4412, `hasCoverage` L838 | 🟡 | La cobertura **solo se comprueba en Inicio** (L1818). Pago y Plan la ignoran |
| 9 | Catálogo de tienda | `StoreScreen` L2286 | ✅ estático | Mezcla packs y productos sueltos. 4 productos son copias exactas de un pack |
| 10 | Detalle de pack | `Detail` L2366 | 🟡 | No muestra la hora de recojo (L2451) ni alérgenos |
| 11 | Agotado / vencido | `Detail` L2383, L2417 | 🟡 | "Agotado" solo si el dato fijo es 0. "Vencido" solo se alcanza desde el menú de frames, nunca por la hora real |
| 12 | Pago y modalidad | `Payment` L2536 | 🎭 | Recojo o delivery y 4 métodos (incluida "Tarjeta de prueba"). **No se elige franja horaria** |
| 13 | Descuentos en el pago | L2710-2756, `couponDiscount` L974 | ✅ | Premio, cupón y créditos se acumulan correctamente |
| 14 | Pago rechazado | `PaymentError` L2844 | 🎭 | Promete "reserva guardada 8 min", que no existe |
| 15 | Confirmación | `Confirmation` L2872 | 🟡 | QR decorativo. Dice "te espera en la tienda" con el estado en "Reservado" |
| 16 | Mis pedidos | `Orders` L3076, `OrderItem` L3164 | 🟡 | Sin pantalla de detalle. El propio usuario marca "Ya lo recogí" |
| 17 | Cancelación | L3131, L3033, `setOrderStatus` L6311 | 🟡 | Devuelve puntos, cupón, créditos y premio usado. No revierte giros, premios de la ruleta ni premio de nivel |
| 18 | Seguimiento delivery | `Tracking` L4732 | 🎭 | Botones "Simular…" (L4816) y repartidor en mapa sin integración |
| 19 | Seguimiento de recojo | — | ❌ | No hay estados entre "Reservado" y "Recogido" |
| 20 | Notificaciones | interruptor de Perfil L3351, `notify` (toast) | ❌ / 🎭 | Solo toasts efímeros. El interruptor no tiene efecto. No hay bandeja |
| 21 | Reseñas | `Review` L3239, `submitReview` L6397 | 🟡 | Suma 10 pts. Estrellas, etiquetas y comentario no se guardan |
| 22 | Favoritos | `Favorites` L4696 | ✅ | En memoria |
| 23 | Puntos y niveles | `LEVELS` L744, `addPoints` L6214, `Levels` L3669 | 🟡 | 4 niveles por puntos acumulados. **Se acreditan al pagar** |
| 24 | Beneficios por nivel | `LEVELS[].perks` | 🟡 | Implementados: delivery gratis (Oro) y 2 giros (Oro). No implementados: cupón S/ 3 mensual, acceso anticipado, packs exclusivos, soporte 24/7 |
| 25 | Premio al subir de nivel | `RewardChooser` L1543, `claimReward` L6380 | ✅ | Plato gratis o crédito. No se revierte si se cancela el pedido que provocó la subida |
| 26 | Ruleta | `Roulette` L4579, `spin` L6360, `WHEEL` L915 | ✅ | Giro al pagar. Botón "+1 giro (demo)" visible al usuario (L4687) |
| 27 | Impacto (kg, ahorro) | L3688-3691 | 🎭 | Bases fijas (9 packs, S/ 148) más pedidos no cancelados, incluidos los activos |
| 28 | Planificador semanal | `Planner` L3946, `PlanItem` L842 | 🎭 | Calendario y total semanal. No cobra, no crea pedidos, no suma puntos |
| 29 | Suscripción por establecimiento con duración | — | ❌ | No hay duración (3 o 6 meses), pausa ni "saltar entrega" |
| 30 | Membresía premium (ComeRICO Pass) | Perfil L3426-3431 | ❌ placeholder | Fila visible que dice "muy pronto" |
| 31 | Ayuda / FAQ | `Help` L4885, `HELP_TOPICS` L1023 | ✅ | Algunas respuestas describen reglas no implementadas |
| 32 | Legal y Libro de reclamaciones | `Legal` L4953 | 🎭 | Número de hoja aleatorio |
| 33 | Perfil y datos personales | `Profile` L3332, `EditProfile` L3555 | ✅ | Buenas validaciones. Foto fija. Métodos de pago y facturación "pronto" |
| 34 | Panel de negocio | `Dashboard` L5365 | 🎭 | Métricas fijas (S/ 286.40, 14.8 kg, "3 pendientes") |
| 35 | Publicar excedente / crear pack | `Publish` L5508, `PackForm` L5776 | 🟡 | Se guarda en `published` pero **solo lo ve el negocio**. Alérgenos y descripción se pierden |
| 36 | Pedidos recibidos (negocio) | `BusinessOrders` L5995 | 🎭 | 3 pedidos fijos, ordenados por nivel. No afectan los pedidos del cliente |
| 37 | Perfil de negocio | `BusinessProfile` L5273 | 🎭 | Acciones "pronto" |
| 38 | Panel de frames (prototipo) | L6539-6573 | ✅ herramienta | Salta a pantallas sin contexto: Confirmación sin pedido usa `orders[0]` (L2887) |
| 39 | Responsive | css L2122-2196 | 🟡 | Marco de 393 px. El botón fijo "Frames" probablemente tapa acciones del header (a verificar) |
| 40 | Persistencia | — | ❌ | Todo se pierde al recargar |

### 2.1 Qué es MVP y qué es secundario

| Núcleo del MVP | Secundario (útil, no bloqueante) | Futuro |
|---|---|---|
| Descubrir y filtrar packs, detalle con condiciones, compra unitaria (recojo y delivery del local), pedidos con estados, notificaciones internas, niveles básicos, **una** suscripción simple por local | Ruleta, mapa, catálogo de productos sueltos, reseñas, favoritos, impacto ambiental, reclamaciones | Membresía premium, push reales, seguimiento GPS, delivery de terceros, pagos reales, facturación, repartidores |

---

## 3. Auditoría de las 10 heurísticas

**Resumen de hallazgos:** 55 en total.

| Severidad | Cantidad |
|---|---|
| 4 (crítico) | 6 |
| 3 (grave) | 12 |
| 2 (menor) | 29 |
| 1 (cosmético) | 8 |

Los hallazgos de severidad 4 se concentran en H5 y H1: stock, vigencia, horarios, recompensas y alérgenos.

### H1 · Visibilidad del estado del sistema

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H1-1 | `OfferCard`, `AllPacks` | La cuenta regresiva `minutes` es un dato fijo (L73) y no se calcula desde la hora actual. Los datos implican horas distintas a la vez: La Espiga dice "42 min" con recojo hasta 9:30 p. m., es decir, son las 8:48 p. m. (L88-89). Sabor Criollo dice "35 min" hasta las 4:00 p. m., es decir, son las 3:25 p. m. (L166-167). El filtro "Cierra en 45 min" usa ese dato (L2027) | El usuario puede ir a un local que cerró hace horas: la información de tiempo es falsa | **4** | Calcular `fin de ventana − ahora`. Si es ≤ 0, mostrar "Vencido" y bloquear la compra |
| H1-2 | `Detail` | La hora límite **desaparece en el Detalle**. Se ve en la tarjeta del listado y reaparece en Pago (L2608, L2637). Causa: `dist ? "A 250 m" : "Hasta 9:30"` (L2451), y todos los locales tienen distancia | Juan decide sin saber cuándo puede recoger | 3 | Bloque fijo "Recoge hoy de 8:00 a 9:30 p. m." junto al precio |
| H1-3 | `Confirmation`, `Orders` | El pedido de recojo nace "Reservado" (L6290) y nada lo hace avanzar. La confirmación dice "Tu pedido te espera en la tienda" (L2898) aunque el local no lo ha preparado | El usuario puede llegar antes de que el pedido esté listo | 3 | Estados por modalidad (§4.E) y mensaje "Te avisaremos cuando esté listo" |
| H1-4 | `Payment`, `Confirmation` | Los puntos se muestran como ganados ("+X pts · Ya tienes…", L2932-2939) y se acreditan al pagar, incluso con efectivo aún no pagado (L6292, L6300) | Confunde lo pendiente con lo completado y permite abusos (H5-5) | 3 | Mostrar "+X pts al recoger" y acreditar al completar |
| H1-5 | `Planner` | "✓ Guardado" solo serializa el plan (L6351). No hay próxima entrega, estado de cobro ni pedidos generados | El usuario cree tener entregas programadas que nunca ocurrirán | 3 | Mostrar las próximas entregas como pedidos "Programado" (§8.4) |
| H1-6 | `Profile` | El interruptor "Notificaciones" es estado local sin efecto (L3351, L3472-3479) | Falsa sensación de control | 2 | Conectarlo a las preferencias de la bandeja interna u ocultarlo |
| H1-7 | `AllPacks` | "9 packs disponibles hoy" cuenta el pack agotado de Cafetería Altura (L2083-2084; stock 0 en L152) | Contador inexacto | 1 | Contar solo los disponibles y mostrar "+1 agotado" |

### H2 · Correspondencia entre el sistema y el mundo real

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H2-1 | Datos `offers` / `stores` | 4 de los 9 "Packs Sorpresa" tienen contenido definido, idéntico y al mismo precio que un producto del catálogo: "Latte + alfajores" (L134 / L380), "Menú: entrada + lomo saltado" (L160 / L454), "Bowl saludable + refresco" (L173 / L491), "Sánguche de pollo + chicha" (L186 / L528). Su descripción dice "El contenido exacto es una sorpresa" (L618). Además, el pack de Cafetería Altura está agotado mientras su "Café americano" (mismo precio, S/ 7.90) sigue disponible (L152 / L417-423) | Contradice la propuesta de valor del pack sorpresa y confunde qué se compra | 3 | Los packs llevan nombre genérico y "puede incluir…". Lo que tiene contenido definido va al catálogo |
| H2-2 | `Detail`, `Payment` | El delivery promete "Llega en 30–45 min" (L609) para un excedente que se libera al cierre. Si Juan compra a las 11 a. m. un pack con recojo hasta 9:30 p. m., la app le promete recibirlo antes del mediodía | Promesa imposible de cumplir | 3 | La entrega se da dentro de la ventana del pack: "Llega entre 8:00 y 8:45 p. m." |
| H2-3 | `Tracking` | Repartidor animado en el mapa y "llega en 12–18 min" (L4752-4774, L4782) sin integración real | Promete seguimiento en tiempo real inexistente, algo que el profesor pidió evitar | 3 | Línea de tiempo con horas de cada cambio de estado, sin GPS |
| H2-4 | `LEVELS` | Un nivel se llama "Cliente" (todos lo son) y otro "Plus", nombre típico de membresías pagadas (L746, L753) | Se confunde fidelización con premium | 2 | Bronce, Plata, Oro (§4.C) |
| H2-5 | `Detail` | "Máximo {max} por persona" usa el stock: con 2 en stock dice "máximo 2 por persona" (L2390, L2489) | Mezcla dos conceptos | 1 | "Máximo 3 por persona · quedan 2" |
| H2-6 | `Detail` (agotado) | "Esta oferta se agotó hace 5 min" es un texto fijo (L2422) | Dato inventado | 1 | "Se agotó hoy" o la hora real |

### H3 · Control y libertad del usuario

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H3-1 | `Login` | La app arranca en el login (L6170): sin cuenta no se ve ninguna oferta | Barrera antes de demostrar valor | 2 | Modo invitado y pedir la cuenta al pagar |
| H3-2 | `Profile` → negocio | "Quiero ser aliado ComeRICO" lleva directo al panel de La Espiga sin autenticación (L3490). Ayuda y Legal abiertos desde el negocio muestran la barra del cliente (L4948, L5088) | El usuario cambia de rol sin querer y se desorienta | 2 | Pantalla informativa de aliados. Barra de navegación según el rol |
| H3-3 | `Planner` | No se pueden descartar los cambios sin guardar: solo existe "Deshacer" del último cambio durante 5 s (L3988-3991). El calendario muestra lo no guardado como si estuviera activo | No hay salida clara ante un error | 2 | Botón "Descartar cambios" que vuelve a `planSaved` |
| H3-4 | `Planner` | Solo se puede "Quitar" una entrada (L4326). No se puede pausar ni saltar una entrega puntual | Para faltar un día hay que destruir el plan | 2 | "Saltar esta entrega" y "Pausar" (§8.4) |

### H4 · Consistencia y estándares

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H4-1 | Flujo de compra | Cuatro términos para la misma acción: CTA "Reservar" (L2529), luego "Pagar S/ X" (L2813), luego "Pedido confirmado" (L2892), luego estado "Reservado" (L6290) | ¿Reservé o pagué? | 2 | Glosario único: "Continuar", "Pagar", "Pedido confirmado" |
| H4-2 | `Payment` vs. `Tracking` | Dos tiempos de entrega distintos: 30–45 min (L609) y 12–18 min (L4782) | Promesas contradictorias | 2 | Una sola fuente: la franja elegida |
| H4-3 | Taxonomía | El cliente usa Panadería / Café / Menú (L61). El negocio crea packs Panadería / Dulces / Mixto (L5858). En Inicio el chip "Pack Sorpresa" hace de "Todos" (L1890); en la lista se llama "Todos" (L2055) | Categorías que no encajan entre roles | 2 | Una sola lista de categorías y un chip "Todos" |
| H4-4 | Función recurrente | Tiene cuatro nombres: "Mi plan" (L1466), "Mi plan semanal" (L3449), "Planificador semanal" (L1179), "plan semanal" (FAQ). Además "Mi plan" se confunde con planes premium | Ambigüedad con la membresía | 2 | Nombre único: "Suscripciones" (§4.B) |
| H4-5 | Recojo cliente ↔ negocio | Dos actores confirman el mismo evento sin relación: el cliente pulsa "Ya lo recogí" (L3214) y el negocio valida el código (L6140-6154) sobre pedidos distintos | La verdad del pedido depende de quién pulse primero | 3 | El negocio valida y pasa el pedido a "Recogido". "Ya lo recogí" queda como respaldo |
| H4-6 | Toasts | Dos sistemas: el global `app-toast` (L6523) y uno local del planificador `toast-bar` (L4158), en posiciones distintas | Inconsistencia visual | 1 | Usar solo `notify` |
| H4-7 | `BottomNav` | Direcciones y Ruleta abiertos desde Inicio marcan "Perfil" como activo (L4494, L4691) | Orientación débil | 1 | Marcar la pestaña de origen |

### H5 · Prevención de errores

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H5-1 | `placeOrder`, `offers` | **El stock nunca se descuenta.** `offers` y `stores` son constantes y `placeOrder` (L6284-6310) no las toca. Se puede comprar sin límite un pack que dice "Quedan 2" (L113) | Sobreventa: pedidos que el local no puede cumplir | **4** | Stock en el estado: descontar al pagar, devolver al cancelar y revalidar en el modal de confirmación |
| H5-2 | `Detail`, `Payment` | **No se valida la vigencia.** El flujo del cliente no usa la hora actual (`nowMin` solo se usa en el plan y en el negocio: L899, L5539, L5802). A las 11 p. m. se puede pagar un pack "recoge hasta 9:30 p. m." y la confirmación dirá "Recoge hoy hasta las 9:30 p. m." (L2911) | Cobro por un pedido imposible de recoger | **4** | Estado `vencido` calculado y bloqueo en Detalle y Pago |
| H5-3 | `Planner` | Franjas de 08:00 a 21:30 para **cualquier** local (L852-861), sin validar su horario ni la ventana del pack. Se puede programar la cena a las 21:30 en Sabor Criollo (abre de 12:00 a 4:00 p. m., L449) o el desayuno a las 08:00 en Pastelería Dulce Lima (abre a las 9:00, L301). La hora por defecto es 12:00 (L3971) aunque el pack de La Espiga se recoge de noche | Entregas programadas en horarios imposibles | **4** | Ofrecer solo los días y franjas de la ventana del local y validar al guardar |
| H5-4 | `Payment`, `Planner` | Delivery a direcciones sin cobertura: los chips incluyen "Casa de playa, Punta Hermosa" (L836). Ni Pago (L2655-2668) ni Plan (L4284-4293) usan `hasCoverage` (solo Inicio, L1818). Pago solo exige 8 caracteres (L2563) | Pedido y cobro a una zona que no se atiende | 3 | Validar la cobertura y deshabilitar ese chip con su motivo |
| H5-5 | Recompensas | **Recompensas explotables.** Se sube de nivel al pagar y se elige el premio (S/ 10 de crédito o un plato de S/ 11). Al cancelar, `setOrderStatus` revierte los puntos (L6314), pero no el premio de nivel (`rewardedLevels`, L6184 y L6222), ni los giros (L6295), ni los premios ya ganados en la ruleta (L6370) | Valor monetario sin compra, y saldo inconsistente | **4** | Recompensas solo al completar e idempotentes por pedido (§8.5) |
| H5-6 | `Detail`, `Publish`, `PackForm` | **Los alérgenos no llegan al cliente.** El negocio debe declararlos (L5541, L5801), pero `PublishedOffer` no los guarda (L995-1004), `Offer` no los tiene (L63-75) y el Detalle no los muestra. Los términos prometen informarlos (L4980-4981) | Riesgo para la salud de personas con alergias | **4** | Campo `allergens` en la oferta, visible en el Detalle y en el resumen de pago |
| H5-7 | `Planner` (selector de local) | Se puede programar un local con el pack agotado: el selector lista todos los `offers` (L4178), incluida Altura con stock 0 | Expectativa que no se cumplirá | 2 | Mostrar "Hoy sin packs" y los días habituales del local |
| H5-8 | `Payment` | "Tarjeta de prueba ···· 0002" aparece entre los métodos del usuario (L623, L2689) | Elegir por error un método falso | 2 | Mover la simulación de rechazo al panel demo |

### H6 · Reconocimiento antes que recuerdo

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H6-1 | `Orders` | El código y el QR solo se ven en la Confirmación inmediata. `OrderItem` no abre ningún detalle (L3182-3236) y el ID se pierde en la meta (L3200). La FAQ pide "muestra el código o QR de la confirmación" (L1032) | Al llegar al local, el usuario no encuentra su código | 3 | Pantalla de detalle de pedido que reutilice el ticket de la Confirmación |
| H6-2 | Editor del plan | El editor no muestra el horario del local ni la ventana del pack (L4208-4306): hay que recordarlos | Errores de horario (H5-3) | 2 | "La Espiga entrega packs de 8:00 a 9:30 p. m." sobre las franjas |
| H6-3 | `Detail`, `AllPacks` | Las distancias son fijas ("A 250 m de tu dirección", L2451-2452; `storeDistance` L988) aunque se cambie la dirección activa (p. ej., Oficina en Surco). Si Juan agrega "Universidad", nada cambia | "Cerca de la universidad" no se puede resolver | 2 | Tabla de distancias por dirección guardada, simulada pero coherente |

### H7 · Flexibilidad y eficiencia de uso

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H7-1 | `AllPacks` | No hay filtros de preferencias (vegetariano, sin gluten, sin lácteos) ni de franja horaria ("puedo recoger a las 7 p. m."). "Hasta S/ 10" es fijo (L2025) | Juan no puede filtrar por lo que le importa | 2 | Chips de preferencia (requieren etiquetas en los datos) y filtro "Disponible a las…" |
| H7-2 | `Home` | "Ofertas cerca de ti" no está ordenada por distancia: Sanguchería (500 m) aparece antes que Sabor Criollo (300 m) (L1975-1982) | El título promete otra cosa | 2 | Ordenar por la distancia de la dirección activa |
| H7-3 | `Orders` / `Home` | "Volver a pedir" abre el Detalle y obliga a elegir de nuevo modalidad y método (L1963, L3116) | Más pasos para el usuario frecuente | 1 | Recordar la última modalidad y el último método |

### H8 · Diseño estético y minimalista

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H8-1 | `Home` | Un usuario nuevo ve, antes de entender la propuesta: nivel, barra de puntos, chip de giros, búsqueda, mapa, 5 chips, destacados, "Tus locales de siempre" y la lista (L1837-1996) | Sobrecarga en el primer contacto | 2 | Revelar por etapas: nivel y giros recién tras el primer pedido completado |
| H8-2 | Recompensas | Cinco "monedas": puntos, créditos (L6181), cupones (L6192), platos gratis (L6182) y giros (L6191). "Premios y créditos" del pago puede mostrar tres tipos a la vez (L2710-2756) | Sistema difícil de entender | 2 | Consolidar créditos y platos gratis en cupones (§8.5) |
| H8-3 | `Detail` | "Agregar a mi plan semanal" (L2509-2520) compite con "Reservar" en la primera compra | Ofrece la suscripción antes de probar | 2 | Mostrarlo tras el primer pedido completado en ese local |
| H8-4 | Varias | Controles demo mezclados con la interfaz: "+1 giro (demo)" (L4687), "Simular salida del repartidor" (L4816), "Ver estado sin permiso" (L2277), "Demo: el código es…" (L6139), "Tarjeta de prueba" | Simulaciones que parecen funciones reales | 2 | Un panel demo único fuera del teléfono (§8.9) |
| H8-5 | `Confirmation` | El modal de subida de nivel, con confeti y elección de premio, tapa la información de recojo (L2974-3032) | Distrae del dato clave: cuándo y dónde recoger | 2 | Celebrar la subida al completar el pedido |

### H9 · Reconocer, diagnosticar y recuperarse de errores

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H9-1 | `PaymentError`, FAQ | Promete "La reserva sigue guardada por 8 minutos más" (L2857-2858, L1062), pero no hay reserva ni temporizador | Expectativa falsa | 2 | Reservar stock de verdad (P0-1) o quitar la promesa |
| H9-2 | Pedidos y suscripción | No existen los casos "el local canceló" ni "hoy no hubo pack", ni sus mensajes y reembolsos | El usuario no sabe qué pasó ni si le cobraron | 3 | Estado `Cancelado por el local` con motivo, aviso y reembolso |
| H9-3 | Pedidos de recojo | Si pasa la hora límite, el pedido sigue "activo" para siempre. `Status` ya prevé un caso "Venc" (L3063) que nunca se asigna | Pedidos fantasma y reglas de "no recogido" sin definir | 3 | Estado `No recogido` al cerrar la ventana, con política por decidir (§10) |

### H10 · Ayuda y documentación

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| H10-1 | `HELP_TOPICS` | La FAQ documenta reglas no implementadas o contradictorias: "Puedes seguir al repartidor" (L1037); "Se cobra cada domingo… con tu método principal" (L1052) frente a "con Yape / Plin" (L4362); "Cada entrega suma puntos" (L4369); "Cupón de S/ 3 cada mes" (L757) | La ayuda pierde credibilidad | 2 | Alinear el texto con lo implementado en cada fase |
| H10-2 | `Detail`, `Payment` | La política de cancelación y lo que pasa si no recoges a tiempo solo aparecen al cancelar o en la FAQ | Se descubren tarde | 2 | Resumen de condiciones antes de pagar |

### Transversal · Accesibilidad y responsive (H4 · estándares de plataforma)

| ID | Pantalla / componente | Problema y evidencia | Consecuencia | Sev. | Propuesta |
|---|---|---|---|---|---|
| A-1 | `OfferCard` | `span role="button"` (favorito) dentro de un `<button>` (L1611, L1625-1646): elementos interactivos anidados, HTML inválido | Lectores de pantalla y foco erráticos | 2 | Envolver en un `div` con dos botones hermanos |
| A-2 | Interruptores | `<i class="switch" aria-hidden>` sin `role="switch"` ni `aria-checked` (L2721, L2740, L2751, L3478) | El estado on/off no se anuncia | 2 | `role="switch"` y `aria-checked` en el botón |
| A-3 | 12 modales y hojas | Ninguno tiene `role="dialog"`, `aria-modal`, foco inicial ni cierre con Escape | Inaccesibles con teclado o lector | 2 | Componente `Modal` reutilizable |
| A-4 | `Detail` | El botón "atrás" no tiene `aria-label` (L2396). El de `StoreScreen` sí (L2294) | Botón sin nombre accesible | 1 | Añadir `aria-label="Volver"` |
| A-5 | `index.css` | 86 declaraciones con fuente ≤ 11 px; por ejemplo, las etiquetas de la barra inferior (css L190) | Legibilidad baja en móvil | 2 | Mínimo 12 px en texto informativo |
| A-6 | Ruleta y confeti | Sin `prefers-reduced-motion`. El giro dura 4,3 s (L4603) | Incomodidad para usuarios sensibles al movimiento | 1 | Reducir o anular la animación |
| A-7 | Responsive ≤ 760 px | El botón fijo "Frames" (css L2143-2154: `top: 8px; right: 9px`) cae sobre la zona de acciones del header (44 × 44 px, css L141-152), por ejemplo "Editar" o "?", y junto al avatar de Inicio. **A verificar visualmente** | Toques sobre el control equivocado durante las pruebas | 2 | Llevarlo abajo a la izquierda o dentro de un gesto |

---

## 4. Evaluación de las recomendaciones del profesor

### A. Simplificar la compra de packs sorpresa

| Paso esperado | Dónde ocurre hoy | Estado | Qué falta |
|---|---|---|---|
| Explorar packs | `Home`, `AllPacks`, `MapScreen` | ✅ | Cercanía real y filtros de preferencia |
| Seleccionar establecimiento | `StoreScreen` (desde el mapa) o directo al `Detail` | ✅ | — |
| Revisar condiciones | `Detail` | 🟡 | Ventana de recojo, alérgenos, contenido coherente y política |
| Elegir modalidad y horario | `Payment` | 🟡 | Modalidad sí; **franja horaria no**; cobertura no validada |
| Pagar | `Payment` y modal | 🎭 | Bien etiquetado como demo |
| Confirmar pedido | `Confirmation` | ✅ | Ventana coherente y acceso posterior al ticket |
| Recoger o recibir | `Orders` / `Tracking` | 🟡 | Ciclo de estados; el negocio no está conectado |

Respuestas a los puntos pedidos:

- **¿Pantallas conectadas?** Sí. `openProduct`, `returnTo` y la pila permiten ir y volver sin cortes.
- **¿Precios y descuentos coherentes?** Los de la compra unitaria sí (verificados los 9). Dos excepciones:
  - El planificador inventa tamaños con recargo fijo de +S/ 5 y +S/ 10 (L862-866) que ningún local define (`PackForm` no tiene tamaños).
  - Los puntos se calculan también sobre el costo de envío (L2798).
- **¿Conoce el contenido aproximado?** Parcialmente. Hay "¿Qué puede traer?" y "Valor aproximado" (L2456-2467), pero 4 packs tienen contenido fijo (H2-1).
- **¿Horarios y disponibilidad?** No son fiables: el stock es fijo, la cuenta regresiva es fija y el Detalle no muestra la ventana (H1-1, H1-2, H5-1, H5-2).
- **¿Hay confirmación?** Sí: modal más pantalla de confirmación.
- **¿Se distingue pendiente de completado?** Sí visualmente (pestañas Activos / Historial). No en la lógica: puntos, giros y nivel se otorgan como si estuviera completado.

**Simplificación propuesta.** Se mantienen los tres pasos del stepper, sin pantallas nuevas en la compra:
1. **Detalle:** todas las condiciones (ventana, stock real, alérgenos, qué puede traer, política de cancelación) y el CTA "Continuar · S/ X". Sin CTA de suscripción en la primera compra.
2. **Pago:** modalidad → **franja** (chips dentro de la ventana) → dirección con cobertura (solo delivery) → método → descuentos colapsados en una fila, con el mejor aplicado automáticamente → total → "Pagar".
3. **Modal de confirmación** (ya existe) → **Confirmación** con enlace al nuevo **Detalle de pedido**.

### B. Suscripción a packs por establecimiento

**¿El planificador ya es una suscripción recurrente?** Sí, de hecho. `PlanItem` = local + tamaño + días + hora + lugar (L842-849). "Se repite cada semana" (L4065) y "Se cobra cada domingo por adelantado" (L4362). Es una suscripción semanal sin fecha de fin.

**¿Hay duplicidad?** Si se creara una "Suscripción" aparte del planificador, sí: dos funciones harían lo mismo. **Recomendación: una sola entidad.**
- *Suscripción a un local* es lo que se crea, se paga y se gestiona.
- *Mi semana* (el calendario actual del `Planner`) es solo una **vista** de las entregas que generan todas las suscripciones.

| Tema | Situación actual | Propuesta para el MVP |
|---|---|---|
| Selección de local | Selector con todos los locales (L4178), también desde el Detalle | Desde el local o tras un pedido completado allí ("¿Te gustó? Recíbelo cada semana") |
| Días | Los 7 días para cualquier local | Solo los días en que el local publica packs (dato nuevo `days`) |
| Horario | 08:00–21:30 para todos (L858) | Solo franjas dentro de la ventana del pack del local |
| Tamaño | 3 tamaños con recargo inventado (L862-866) | Un solo tamaño en el MVP. Tamaños solo si el local los define con su precio |
| Modalidad | Solo delivery: siempre cobra envío por entrega (L3998-4000) | Recojo (por defecto) o delivery con cobertura validada |
| Duración | Indefinida | "Sin fecha de fin", 4 semanas, 3 meses o 6 meses como **fecha de término**, sin prepago |
| Costo | Total semanal = (precio + extra) × días + envío (L3994-4000) | Precio por entrega × entregas por semana, más un estimado del periodo ("≈ S/ 154.80 en 12 semanas"), etiquetado como estimación |
| Pago | Texto "cada domingo por adelantado"; no se ejecuta nada | Ver alternativas abajo |
| Modificar y cancelar | Editar o quitar; regla de "2 h antes" (L898-899) | Editar, **saltar una entrega**, **pausar** o cancelar; los cambios aplican a entregas aún no confirmadas por el local |
| Local sin packs | No contemplado | La entrega pasa a "No disponible hoy", **no se cobra** y se avisa, con sugerencia de un pack cercano |
| Horarios no disponibles | Se aceptan | Imposibles de elegir y revalidados al guardar |
| Relación con pedidos | Ninguna | Cada entrega crea un pedido "Programado" que sigue el ciclo normal (estados, puntos, reseña) |

**Alternativas de cobro.** Es una decisión comercial: no la doy por definitiva.

| Opción | Ventajas | Desventajas |
|---|---|---|
| a) Prepago del periodo completo (3 o 6 meses) | Asegura ingresos y compromiso | Desembolso alto para un estudiante; reembolsos complejos cuando el local no tiene excedente, que es frecuente por naturaleza |
| b) Cobro semanal anticipado (lo que dice la UI hoy) | Simple de explicar | Requiere reembolsos o créditos semanales por las entregas no cumplidas |
| c) **Cobro por entrega cuando el local confirma el pack** (el mismo día, antes de la franja) | Nunca se cobra lo que no se entrega; coherente con la incertidumbre del excedente; elimina reembolsos | Más transacciones (irrelevante mientras sea simulado) |

**Recomendación para el MVP:** opción **c**, con la duración como fecha de término y sin prepago. Las opciones a y b (con descuento por permanencia) quedan para el futuro.

**Cuándo mostrarla:** solo después del primer pedido completado con ese local, o desde la ficha del local. La pestaña se mantiene, con un estado vacío que explica la función y lleva a explorar.

### C. Sistema de puntos y niveles

**Situación actual:**
- 4 niveles por puntos acumulados: Cliente 0, Plus 500, Oro 1 500, Diamante 3 000 (L744-773).
- Se ganan 5 pts por S/ 1 (incluido el envío) y 10 pts por reseña (L775-777). La ruleta también da puntos (L950-965).
- Se acreditan **al pagar** (L6300). El nivel se calcula del saldo, que baja al cancelar (L778, L6215).

**Inconsistencias de saldo detectadas:**
- El historial inicial suma 175 pts, pero el saldo es 1 180 (L812-828 frente a L6177).
- "Subiste a Plus · +100 bono" (L822-826) es una regla que el código no aplica.
- El historial muestra una reseña de La Espiga del 12 de mayo, pero el pedido RICO-4630 (La Espiga, 12 de mayo) sigue calificable (no tiene `reviewed`, L695-704). Posible doble reseña.
- `Math.max(0, …)` (L6215) recorta el saldo pero registra el movimiento completo, así que historial y saldo pueden divergir.
- Premios de nivel y giros no se revierten al cancelar (H5-5).

**Propuesta para el MVP.** Los umbrales y valores exactos quedan en §10.

| Elemento | Propuesta |
|---|---|
| Niveles | **Bronce** (desde el registro), **Plata** y **Oro**. Se eliminan "Cliente", "Plus" y "Diamante" |
| Cómo se ganan puntos | Solo cuando el pedido pasa a **Recogido o Entregado**: 5 pts por S/ 1 del **subtotal de productos** (sin envío), más 10 pts por reseña de un pedido completado (una por pedido). Las entregas de suscripción cuentan igual |
| Cómo se sube | Por puntos acumulados de actividad completada. Referencia con un ticket promedio de S/ 12 (≈ 70 pts por pedido con reseña): Plata ≈ 5 pedidos (≈ 350 pts) y Oro ≈ 15 pedidos (≈ 1 000 pts). Sin caducidad en el MVP |
| Beneficios Bronce | Acceso completo y 1 giro por pedido completado |
| Beneficios Plata | Cupón de bienvenida al nivel (por ejemplo, S/ 3) que se suma a la billetera de cupones |
| Beneficios Oro | 2 giros por pedido completado (ya implementado) y un beneficio de envío **acotado** (p. ej., 1 envío gratis por semana). El envío gratis ilimitado se reserva para la futura membresía premium (§4.F) |
| Se elimina | "Prioridad en la fila de recojo" (L764). Ordenar la fila por nivel (L6029) obliga al local a preparar por estatus y no por hora de recojo: es injusto y operativamente incorrecto. También "Packs exclusivos" y "Soporte 24/7", que no están implementados |
| Mostrar el progreso | Barra existente (`LevelBar`) más un texto en pedidos: "≈ 3 pedidos para Plata". En cada pedido activo: "+65 pts al recoger" |
| Evitar inconsistencias | **Libro de movimientos**: cada movimiento lleva `orderId` y tipo (`gana`, `revierte`, `bono`), el saldo es la suma del historial y la acreditación es idempotente por pedido |
| Relación con pedidos | Los puntos nacen del pedido completado. Cancelado o no recogido no da puntos. Deshacer "Ya lo recibí" revierte |

**Nivel de fidelización frente a membresía premium:**

| | Nivel de fidelización | Membresía premium |
|---|---|---|
| Cómo se obtiene | Usando la app (pedidos completados) | Pagando una cuota |
| Costo | Gratis | Mensual |
| Puede bajar | No, en el MVP | Al dejar de pagar |
| Beneficio típico | Reconocimiento, cupones, giros extra | Envío gratis ilimitado, descuentos extra |
| Momento | Desde el primer pedido | Cuando el usuario ya es frecuente |

### D. Ruleta y recompensas

| Criterio | Opción 1: giros tras pedidos completados | Opción 2: giros al abrir la app |
|---|---|---|
| Motivación | Refuerza la conducta deseada (comprar y recoger) | Refuerza abrir la app, no comprar |
| UX | Sorpresa al cierre de una experiencia positiva | Repetitiva; tiende a ignorarse o a sentirse como apuesta |
| Costo y abuso | Acotado: un giro por pedido real | Premios sin compra; abrir la app no cuesta nada |
| Simplicidad | Ya casi implementada: basta mover el momento de la entrega | Requiere controlar frecuencia, días y límites |

**Recomendación:** **Opción 1** como mecánica principal, más **un único giro de bienvenida**, que de hecho ya existe (`spins = 1`, L6191).

- **Cuándo se obtiene:** cuando el pedido pasa a Recogido o Entregado. Uno por pedido (dos en Oro), registrado con `sourceOrderId`.
- **Cuándo se usa:** en cualquier momento; el giro no vence. El cupón ganado vence a los 7 días (hoy 48 h, L6366; para un usuario semanal es corto: decisión en §10).
- **Cómo se informa el premio:** el mensaje y el modal actuales (L4606-4614, L4650-4656), más un aviso en la bandeja de notificaciones.
- **Cómo se aplica al siguiente pedido:** un cupón por pedido. En Pago se preselecciona el mejor aplicable y se explica por qué otro "aún no aplica" (ya existe, L2733-2737).
- **Cómo evitar duplicados:**
  - Cada giro solo se otorga una vez por pedido completado.
  - Cancelar antes de completar nunca otorga nada.
  - El cupón se reserva al pagar y se libera al cancelar (ya existe, L6321-6322).
- **Sin giros:** "Completa un pedido para ganar un giro" con CTA "Ver packs" (ya existe; ajustar el texto, L4614).
- **Fuera de la interfaz del usuario:** "+1 giro (demo)" (L4687) se mueve al panel demo.

### E. Seguimiento y notificaciones de pedidos

**Situación actual:**
- Solo el delivery tiene seguimiento, con 4 pasos y botones "Simular" (L4730-4828).
- El recojo no tiene ninguno.
- No existen notificaciones (solo toasts).
- El "Marcar listo" del negocio avisa a un cliente ficticio (L6083).

**Máquina de estados propuesta.** Una por modalidad, con tipo `OrderStatus` en lugar de `string` libre (L597).

| Modalidad | Secuencia | Quién la avanza |
|---|---|---|
| Recojo en local | Confirmado → En preparación → **Listo para recoger** → Recogido · (No recogido) · (Cancelado) | El negocio marca "En preparación" y "Listo" y valida el código. El sistema marca "No recogido" al cerrar la ventana. El cliente puede cancelar según la política |
| Delivery del establecimiento | Confirmado → En preparación → **En camino** (despachado por el local) → Entregado · (Cancelado) | El negocio. Sin mapa: se muestra la hora de despacho y la franja |
| Delivery por terceros | Confirmado → En preparación → Entregado al repartidor externo → (seguimiento en la app del tercero) → Entregado | **Futuro.** No ofrecer en el MVP: no hay integración que dé esa información |

**Promesas de tiempo honestas:**
- Mostrar siempre la **franja** elegida ("Recoge entre 8:00 y 9:30 p. m." / "Llega entre 8:00 y 8:45 p. m.") y la hora real de cada cambio de estado.
- Eliminar el repartidor que se mueve por el mapa y el "12–18 min".

**Notificaciones internas.** Reutilizan `notify` y añaden una bandeja con campana en Inicio y un contador en la pestaña Pedidos.

| Evento | Mensaje ejemplo |
|---|---|
| Pedido confirmado | "Pedido RICO-4831 confirmado · recoge hoy de 8:00 a 9:30 p. m." |
| En preparación / listo | "Tu pack de La Espiga está listo. Muestra el código RICO-4831" |
| Recordatorio | "Quedan 30 min para recoger tu pack en La Espiga" |
| En camino | "La Espiga despachó tu pedido a las 8:05 p. m." |
| Completado | "¡Gracias por rescatar comida! +65 pts y 1 giro" |
| Cancelado o no disponible | "La Espiga no tuvo pack hoy: no se te cobró" |
| Suscripción | "Mañana: pack de La Espiga de 8:00 a 9:30 p. m. ¿Saltar?" |
| Cupón por vencer | "Tu cupón de S/ 3 vence mañana" |

**¿Basta para el MVP?** Sí: notificaciones internas y estados simulados son suficientes, con tres condiciones:
1. Los estados los avanza el **panel del negocio** (conectado) o un **panel demo** claramente etiquetado.
2. Cliente y negocio leen la **misma fuente de verdad** (`orders`).
3. Ningún texto promete tiempo real.

Las notificaciones push reales quedan para el futuro.

### F. Membresía premium (ComeRICO Pass)

**Situación:** solo existe una fila en "Mi cuenta" que muestra "estará disponible muy pronto" (L3426-3431).

**¿Es necesaria para el MVP? No → FUTURO.** Razones:
1. El MVP debe validar primero la compra y la recompra de packs. Una membresía sin usuarios frecuentes no tiene a quién ofrecerse.
2. Hoy su beneficio principal (envíos gratis) **ya lo regala el nivel Oro** (L764): Pass no tendría valor diferencial.
3. Añade cobro recurrente, cancelación y prorrateo: complejidad sin aprendizaje para el MVP.
4. El profesor indicó que no debe ser lo primero que vea el usuario.

**Acción en el MVP:**
- Ocultar la fila del Pass.
- Renombrar el nivel "Plus".

**A futuro:** ofrecer el Pass solo a usuarios con 4 o más pedidos completados en 30 días, con un cálculo personal ("Habrías ahorrado S/ 19.60 en envíos este mes").

**Los cuatro conceptos, separados:**

| Concepto | Qué es | Cómo se paga | Dónde vive en la app | Ejemplo con Juan |
|---|---|---|---|---|
| Compra unitaria | Un pedido de un pack | Una vez, al confirmar | Inicio → Detalle → Pago | Compra hoy un pack de La Espiga |
| Suscripción a un local | Entregas recurrentes de un local, días y franja fijos | Por entrega confirmada (recomendado) | Pestaña Suscripciones | Recibe el pack de La Espiga lunes y jueves durante 3 meses |
| Nivel de fidelización | Reconocimiento por actividad | Gratis | Perfil → Mis beneficios | Llega a Plata tras ~5 pedidos |
| Membresía premium (futuro) | Plan pagado con beneficios extra | Cuota mensual | Perfil, solo para frecuentes | Paga el Pass por envíos gratis |

---

## 5. Arquitectura de información propuesta

Se mantienen las cuatro pestañas actuales. Solo se reordenan y se renombra una. `BottomNav` L1464-1469.

```
CLIENTE
├─ Inicio (Explorar)
│   ├─ Buscar · filtros · orden ............ AllPacks (existente)
│   ├─ Mapa ................................ MapScreen (existente)
│   ├─ Local ............................... StoreScreen (existente)
│   │    └─ [Suscribirme] ................... visible tras 1 pedido completado en ese local
│   ├─ Detalle de pack ..................... Detail (modificado: condiciones completas)
│   │    └─ Pago → Confirmación ............ Payment / Confirmation (modificados: franja)
│   └─ 🔔 Bandeja de notificaciones ........ NUEVA (ligera)
├─ Pedidos
│   ├─ Activos (incluye entregas programadas de hoy)
│   ├─ Programados (próximas entregas de suscripciones) ... NUEVO segmento
│   ├─ Historial (calificar · volver a pedir)
│   └─ Detalle de pedido ................... NUEVA (reutiliza ticket de Confirmation
│                                             + línea de tiempo de Tracking)
├─ Suscripciones (antes "Mi plan")
│   ├─ Mi semana (vista calendario) ........ Planner (existente)
│   ├─ Mis suscripciones (por local: editar · saltar · pausar · cancelar)
│   └─ Editor de suscripción ............... hoja existente + modalidad + duración
└─ Perfil
    ├─ Mis beneficios: nivel y puntos · cupones · ruleta ... Levels / Roulette (existentes)
    ├─ Direcciones · favoritos · datos · métodos de pago
    ├─ Preferencias de notificaciones
    └─ Ayuda · legal

NEGOCIO: Panel · Publicar · Pedidos (conectados a `orders`) · Mi negocio
         (+ ventana de recojo y días con pack; cupos de suscripción = futuro)

FUERA DEL TELÉFONO: Panel de prototipo (aside existente)
         = saltar a frames + CONTROLES DEMO (avanzar estado, +1 giro,
           rechazar pago, quitar permiso de ubicación, "local sin pack hoy")
```

**Relaciones entre funcionalidades (una sola fuente de verdad):**

```
Oferta (stock, ventana, alérgenos, días)
   │  compra unitaria                 suscripción ──genera──┐
   ▼                                                        ▼
Pedido (estado tipado, modalidad, franja) ◄──────── Pedido "Programado"
   │ al completar (Recogido/Entregado), una sola vez
   ├──► Puntos (libro de movimientos) ──► Nivel (Bronce/Plata/Oro)
   └──► Giro ──► Cupón ──► se aplica al siguiente Pedido
Membresía premium: independiente (futuro)
```

**Cambios de navegación:**

| Hoy | Propuesta | Motivo |
|---|---|---|
| Inicio · Mi plan · Mis pedidos · Perfil | Inicio · **Pedidos** · **Suscripciones** · Perfil | Pedidos se usa más; nombre único para la recurrencia (H4-4) |
| `Tracking` como pantalla aparte | Dentro del Detalle de pedido | Un solo lugar para "¿cuándo llega?" |
| Ruleta, cupones y premios en tres lugares | Perfil → Mis beneficios (pestañas existentes) | Menos dispersión (H8-2) |
| "Quiero ser aliado" cambia de rol | Página informativa o formulario de interés | H3-2 |

---

## 6. Recorrido optimizado de Juan

**Diagnóstico del recorrido actual:**
- Juan no puede completarlo sin contradicciones.
- Si se registra, hereda los pedidos y el nivel Plus de Valeria (L5250-5257).
- Si agrega "Universidad", las distancias no cambian (H6-3).
- No ve la hora de recojo en el Detalle (H1-2).
- Puede pagar un pack vencido (H5-2).
- El pedido queda "Reservado" para siempre (H1-3).
- No puede volver a ver su código (H6-1).
- Recibe puntos y giros antes de recoger (H5-5).
- Su "plan" no genera ninguna entrega (H1-5).

### 6.1 Primera compra puntual

| # | Paso | Pantalla | Qué ve y hace Juan | Regla que lo sostiene |
|---|---|---|---|---|
| 1 | Descubre el propósito | Onboarding (antes del login) | 3 pasos: "Comida de hoy a mitad de precio", "Reserva y recoge en tu horario", "Ahorra y evita desperdicio". El gancho de la ruleta se elimina | Mostrar valor antes de pedir datos |
| 2 | Explora | Inicio (modo invitado) | Indica "Universidad" o permite ubicación. Lista ordenada por distancia con "Hoy 8:00–9:30 p. m. · cierra en 42 min" | Distancia por dirección y tiempo calculado |
| 3 | Filtra | Todos los packs | "Hasta S/ 10" · "Cerca" · "Puedo recoger a las 7 p. m." · "Vegetariano" | Filtros por franja y preferencia |
| 4 | Elige un pack | Detalle | Precio y ahorro, ventana, "Quedan 2" real, qué puede traer, **alérgenos**, política de cancelación. CTA "Continuar" | Sin CTA de suscripción en el primer uso |
| 5 | Una vez o recurrente | — | En la primera compra solo existe la compra puntual | La suscripción aparece después |
| 6 | Fecha y horario | Pago | Recojo o delivery. Franja dentro de la ventana; las horas imposibles no se ofrecen | Validación de ventana |
| 7 | Recojo o delivery | Pago | Si elige delivery: dirección con verificación de cobertura y costo | `hasCoverage` en el pago |
| 8 | Costo y condiciones | Pago | Total, cupón de bienvenida aplicado, "+60 pts al recoger", resumen de política | Puntos pendientes |
| 9 | Confirma | Modal + Confirmación | Si es invitado, crea su cuenta aquí (con estado limpio). Código y QR, "Recoge hoy de 8:00 a 9:30 p. m.", "Te avisaremos cuando esté listo" | Stock y vigencia revalidados al confirmar |
| 10 | Consulta el estado | Pedidos → Detalle de pedido | Línea de tiempo: Confirmado → En preparación → Listo | Estados tipados por modalidad |
| 11 | Recoge | Detalle de pedido + local | Recibe "Tu pack está listo" y "Quedan 30 min". Muestra el código; el local lo valida y el pedido pasa a Recogido | Negocio conectado |
| 12 | Puntos y recompensas | Confirmación de recogida → Ruleta | +60 pts acreditados, 1 giro, invitación a calificar (+10). Gana un cupón para la próxima compra | Recompensas al completar, idempotentes |
| 13 | Vuelve | Inicio: "Tus locales de siempre" | Recompra con la última modalidad recordada | Atajo |

### 6.2 Suscripción a un local frecuente (después de 1 o más pedidos completados)

| # | Paso | Pantalla | Qué ve y hace Juan |
|---|---|---|---|
| 1 | Invitación contextual | Tras calificar, o en la ficha del local | "¿Te gustó La Espiga? Recíbelo cada semana" |
| 2 | Configura | Editor de suscripción | Días **disponibles** del local (p. ej., L–V), franja dentro de 8:00–9:30 p. m., recojo o delivery, duración "3 meses" |
| 3 | Revisa el costo | Editor | "S/ 12.90 por entrega · 2 por semana · ≈ S/ 309.60 en 12 semanas (estimado)". "Se cobra cada entrega cuando el local confirma tu pack" |
| 4 | Confirma | Modal existente | Resumen con la regla de cobro y de cancelación |
| 5 | Ve sus entregas | Pedidos → Programados / Suscripciones → Mi semana | Próximas entregas con fecha y franja |
| 6 | Semana a semana | Notificaciones | "Mañana: pack de La Espiga 8:00–9:30 p. m. ¿Saltar?" · "Hoy no hubo pack: no se te cobró" |
| 7 | Gestiona | Mis suscripciones | Saltar una, pausar o cancelar |
| 8 | Fidelización | Mis beneficios | Sube a Plata u Oro por actividad. Más adelante (futuro) se le ofrece el Pass con su ahorro calculado |

### 6.3 Lo que sobra, falta o llega a destiempo

**Pasos faltantes:**
- Elegir la franja.
- Ver las condiciones antes de pagar.
- El detalle del pedido.
- El estado "Listo para recoger".
- Las notificaciones.
- La validación de cobertura.
- Duración, pausa y "saltar" en la suscripción.

**Pantallas redundantes:**
- `Tracking`, que conviene fusionar en el Detalle de pedido.
- Los productos del catálogo duplicados de un pack (H2-1).
- Las variantes `soldout`, `expired`, `map-denied`, `publish-errors`, `orders-empty` y `empty-home` son estados de otras pantallas, no pantallas. Conviene que solo existan en el panel de frames.

**Acciones confusas:**
- "Ya lo recogí" autodeclarado.
- "Quiero ser aliado", que cambia de rol.
- "Reservar" frente a "Pagar".
- El chip "Pack Sorpresa", que funciona como "Todos".

**Decisiones innecesarias:**
- Combinar hasta cuatro tipos de descuento.
- Elegir entre plato o crédito en medio de la Confirmación.
- La "Tarjeta de prueba" como método.

**Información demasiado pronto:**
- Nivel, puntos y giros en Inicio y en el onboarding.
- La suscripción en el Detalle de la primera compra.
- ComeRICO Pass en el perfil.
- La celebración de nivel antes de recoger.

**Información demasiado tarde:**
- La hora límite (recién en Pago).
- Los alérgenos (nunca).
- La política de cancelación (recién al cancelar).
- La falta de cobertura (nunca).

**Debe aparecer solo después de la primera compra completada:**
- La invitación a suscribirse.
- La tira de nivel en Inicio.
- La ruleta, con el giro ganado.
- Más adelante, la membresía.

---

## 7. Propuestas de mejora UX/UI por pantalla y componente

Se conserva la identidad visual: tipografías Bricolage Grotesque e Inter, naranja `#c2410c`, tarjetas y chips actuales.

| Pantalla / componente | Cambios concretos |
|---|---|
| `Login` / `Onboarding` | Onboarding **antes** del login, con un paso 3 enfocado en ahorro e impacto. Botón "Explorar sin cuenta". El acceso demo se mantiene, etiquetado |
| `Home` | Usuario nuevo: dirección, búsqueda, chips y lista. La tira de nivel y el chip de giros aparecen tras el primer pedido completado. Chip "Todos" en lugar de "Pack Sorpresa". "Cerca de ti" ordenada por la distancia real a la dirección activa. Campana de notificaciones. Corregir el `alt` fijo "Valeria Aquino" (L1851) |
| `OfferCard` | Una sola línea de tiempo: "Hoy 8:00–9:30 p. m. · cierra en 42 min" (calculado). Estados Agotado y Vencido calculados. Favorito como botón hermano, no anidado (A-1) |
| `AllPacks` | El contador excluye los no disponibles. Filtros "Disponible a las…" y de preferencias. Los agotados se muestran al final y atenuados |
| `MapScreen` | Pines atenuados para locales sin pack. "Ver estado sin permiso" se mueve al panel demo |
| `StoreScreen` | "Packs: lun–sáb, 8:00–9:30 p. m." CTA "Suscribirme" condicionado. Catálogo sin duplicados del pack |
| `Detail` | Bloque **Condiciones**: ventana, stock real, alérgenos, "puede incluir…" y política. Sin CTA de plan en la primera compra. "Máximo 3 por persona · quedan 2". `aria-label` en el botón atrás. CTA "Continuar · S/ X" |
| `Payment` | Nueva sección "¿Cuándo?" con chips de franja. Cobertura validada con mensaje ("Aún no hacemos delivery en Punta Hermosa"). Métodos sin la tarjeta de prueba. Descuentos en una fila "Cupones y créditos (2)" con el mejor preaplicado. "+X pts al recoger". Resumen de política |
| `Confirmation` | Ventana y franja exactas, "Te avisaremos cuando esté listo", "Ver detalle del pedido". La celebración de nivel se traslada al completar. "Cancelar" pasa a texto secundario dentro del Detalle de pedido |
| `Orders` / `OrderItem` | La tarjeta completa abre el Detalle de pedido. Segmento "Programados". Chip de estado consistente. "+X pts al recoger". "Ya lo recogí" queda como respaldo ("¿El local no lo marcó?") |
| **Detalle de pedido** (nuevo) | Reutiliza `ticket` (L2899-2931) y `track-steps` (L4796-4803): código y QR, línea de tiempo con horas, ventana o franja, dirección, pago, cancelación según el estado, ayuda o reclamo vinculado al pedido |
| `Tracking` | Se fusiona en el Detalle de pedido. Sin repartidor animado. Botones "Simular" al panel demo o al negocio |
| `Review` | Guardar estrellas y etiquetas en el pedido. "Calificado ✓ 5★" en el historial |
| `Planner` → Suscripciones | Lista por local más vista semanal. El editor añade modalidad, días y franjas limitados al local, y duración. Etiquetas Activa, Pausada o Saltada. Botón "Descartar cambios". Un solo sistema de toast |
| `Levels` | Niveles Bronce, Plata y Oro. Movimientos reconciliados con el saldo. Impacto calculado solo con pedidos completados |
| `Roulette` | Texto: "1 giro por cada pedido completado". Sin botón demo. `prefers-reduced-motion` |
| `Profile` | Ocultar ComeRICO Pass. Notificaciones como preferencias reales de la bandeja. "Quiero ser aliado" como página informativa |
| Negocio | `BusinessOrders` alimentado por los pedidos reales de La Espiga y **ordenado por hora de recojo**, con acciones "En preparación", "Listo" y "Validar código" que cambian el pedido del cliente. `Publish` y `PackForm` guardan alérgenos y descripción, y se ven en el catálogo. Categorías alineadas. Acción "Hoy no hay pack" para suscripciones. Ayuda y Legal con la barra del negocio |
| Global | Componente `Modal` accesible (A-3). Interruptores con `role="switch"` (A-2). Mínimo 12 px (A-5). Botón "Frames" reubicado (A-7) |

---

## 8. Propuestas de mejora funcional

### 8.1 Modelo de datos

Son ampliaciones de los tipos existentes, no reemplazos.

| Tipo | Hoy | Agregar o cambiar |
|---|---|---|
| `Offer` (L63) | `pickup: string`, `minutes`, `stock` fijo | `pickupStart`, `pickupEnd` (en lugar de `pickup` y `minutes`), `allergens: string[]`, `days: number[]` (días con pack), `tags` (vegetariano, etc.). El stock pasa a vivir en el **estado** |
| `Order` (L589) | `status: string` | `status: OrderStatus` (unión tipada), `slot`, `pointsAwarded: boolean`, `spinGranted: boolean`, `source: "unitaria" \| subscriptionId`, `timeline: {estado, hora}[]` |
| `PlanItem` (L842) → `Subscription` | local, tamaño, días, hora, lugar | `mode` (recojo o delivery), `startDate`, `endDate` o duración, `status` (activa, pausada, finalizada), `skipped: fecha[]` |
| `PointsEntry` (L789) | Etiqueta y puntos | `orderId?` y `kind` (`gana`, `revierte`, `bono`). El saldo se deriva del historial |
| `Notification` (nuevo) | — | `{id, orderId?, texto, hora, leída}` |

### 8.2 Compras, stock y vigencia
- **Disponibilidad:** una función pura `disponibilidad(oferta, ahora)` devuelve `disponible`, `agotado` o `vencido`, y los minutos restantes. Todas las tarjetas, el Detalle y el Pago la usan.
- **Stock:** se descuenta en `placeOrder`, se devuelve al cancelar y se revalida en el modal de confirmación ("Se agotó mientras pagabas").
- **Vigencia:** el Pago revalida al confirmar. Si venció, no se cobra y se muestran alternativas (ya existe el bloque "similares", L2428-2438).
- **Franja:** se calculan intervalos de 30 min entre `max(ahora + preparación, pickupStart)` y `pickupEnd`. El delivery usa la misma ventana con margen.

### 8.3 Pedidos
- **Tabla de transiciones permitidas** por modalidad (§4.E). Por ejemplo, de "Listo" solo se puede pasar a "Recogido", "No recogido" o "Cancelado".
- **Efectos de cada transición, centralizados en `setOrderStatus` (L6311):**
  - *Completado*: acredita puntos y otorga el giro, una sola vez.
  - *Cancelado*: devuelve stock, cupón, créditos y premio; y los puntos, solo si se habían acreditado.
  - *No recogido*: sin puntos; el reembolso se decide en §10.
- **Política de cancelación** como dato visible: por defecto, cancelar mientras el pedido esté en "Confirmado". Decisión en §10.

### 8.4 Suscripción (evolución del planificador)
- **Reutilizar el editor actual** (L4208-4336), añadiendo modalidad, duración y restricciones de días y franjas.
- **Entregas como pedidos:** cada entrega futura aparece como "Programado". El día de la entrega, cuando el local confirma (en la demo, desde el negocio o el panel demo), pasa a "Confirmado" y **se cobra** (simulado). Si el local marca "Hoy no hay pack", pasa a "No disponible", sin cobro y con aviso.
- **Gestión:**
  - Saltar una entrega.
  - Pausar.
  - Cancelar.
  - Los cambios aplican a entregas aún no confirmadas, lo que reemplaza la regla fija de 2 h (L898-899).
- **Precio:** el precio de la oferta del local. Sin tamaños inventados hasta que el local los defina.
- **Visibilidad:** solo tras un pedido completado con ese local, o desde la ficha del local.

### 8.5 Puntos, niveles y billetera
- **Puntos:** se acreditan al completar, con 5 pts por S/ 1 del subtotal de productos y 10 por reseña. Son idempotentes por `orderId`.
- **Niveles:** Bronce, Plata y Oro sobre los puntos acumulados (umbrales en §10).
- **Billetera:** consolidar *créditos* y *platos gratis* en **cupones**, porque ya existe la infraestructura `Coupon` y `couponDiscount`. El premio de nivel pasa a ser un cupón y así se reducen cinco monedas a tres: puntos, giros y cupones. Si se prefiere conservar los créditos, al menos deben revertirse cuando se cancela el pedido que los originó.

### 8.6 Ruleta
- `spinsPerOrder` (L986) se aplica al completar, no al pagar (L6293-6295).
- El giro de bienvenida se mantiene.
- El vencimiento del cupón se configura (§10).
- El botón demo pasa al panel.

### 8.7 Notificaciones
- Una función `pushNotice(texto, orderId?)` que hace dos cosas: guarda en la bandeja y muestra un toast, reutilizando `notify` (L6247).
- Se dispara desde cada transición de pedido y de suscripción.
- El interruptor de Perfil filtra por categorías.

### 8.8 Negocio
- `BusinessOrders` se alimenta de `orders.filter(o => o.product.store === "Panadería La Espiga")` y se ordena por franja.
- Las acciones del negocio llaman a `setOrderStatus`.
- `published` se suma al catálogo del cliente para ese local, con alérgenos y descripción.
- Las métricas del panel se calculan con esos pedidos, o se etiquetan como "datos de ejemplo".

### 8.9 Panel demo
- **Reutilizar el `aside.annotation`** (L6539) y su hoja móvil (L6560).
- **Mover allí:** avanzar el estado de un pedido, "+1 giro", "Simular pago rechazado", "Quitar permiso de ubicación", "Hoy no hay pack" y "Adelantar reloj", este último útil para probar la vigencia.
- **Regla:** ninguna simulación vive dentro de la interfaz del usuario sin la etiqueta "Demo".

### 8.10 Cuentas
- `Signup` crea un estado limpio: 0 pts (Bronce), sin pedidos, créditos ni favoritos, con 1 giro de bienvenida.
- `Cerrar sesión` restablece el estado de la sesión.
- Esto es imprescindible para probar el recorrido de Juan con usuarios reales.

---

## 9. Plan de implementación priorizado

**Verificación después de cada fase** (sin dependencias nuevas):
- `npx tsc --noEmit` (TypeScript ya está instalado) y `pnpm build`.
- Lista de regresión manual: compra con recojo, compra con delivery, cancelación con cupón y créditos, ruleta, suscripción, negocio, ayuda, legal y vista móvil a 360 × 640 y 393 × 852.
- Opcional: Vitest solo para las funciones puras del dominio. Sería la única dependencia nueva y no es imprescindible.

### P0 · Críticas

**P0-0 · Capa mínima de dominio (habilitador)**
- Problema: estados como texto libre (L597) y reglas repartidas por las pantallas.
- Solución: tipo `OrderStatus`, tabla de transiciones y funciones puras `disponibilidad`, `franjas`, `puntosDe` y `puedeCancelar`, en `App.tsx` o en un archivo nuevo `src/domain.ts`.
- Beneficio: base de todas las correcciones siguientes.
- Heurísticas: H1, H4, H5.
- Afecta: `Order`, `setOrderStatus`, `Status`, `Orders`, `Tracking`.
- Complejidad: media.
- Dependencias: ninguna.
- Criterios de aceptación:
  - No queda ningún `status` de tipo `string`.
  - `tsc` pasa.
  - Los flujos actuales funcionan igual.

**P0-1 · Stock real**
- Problema: H5-1.
- Solución: el stock vive en el estado, se descuenta al pagar, se devuelve al cancelar y se revalida al confirmar.
- Beneficio: evita la sobreventa.
- Heurísticas: H1, H5.
- Afecta: `offers` / `stores` → estado, `placeOrder`, `setOrderStatus`, `Detail`, `Payment`, `OfferCard`.
- Complejidad: media.
- Dependencias: P0-0.
- Criterios de aceptación:
  - Comprar 2 de Pastelería Dulce Lima (stock 2) la deja "Agotado" en tarjeta, Detalle y mapa.
  - Al cancelar, vuelve a "Quedan 2".
  - No se puede elegir una cantidad mayor que el stock.

**P0-2 · Vigencia y ventana de recojo calculadas**
- Problema: H1-1, H1-2, H5-2.
- Solución: `pickupStart` / `pickupEnd` por oferta; minutos restantes y estado "Vencido" calculados; ventana visible en el Detalle.
- Beneficio: información de tiempo veraz.
- Heurísticas: H1, H2, H5.
- Afecta: `Offer`, `OfferCard`, `AllPacks` (filtro "cierra en 45 min"), `Detail`, `Payment`.
- Complejidad: media.
- Dependencias: P0-0.
- Criterios de aceptación:
  - El contador de cada tarjeta es igual a `fin − ahora`.
  - Con el reloj del panel demo a las 9:45 p. m., La Espiga aparece "Vencido" y el botón de pagar está deshabilitado.
  - El Detalle muestra "Recoge hoy de X a Y".

**P0-3 · Franja horaria y promesas de tiempo coherentes**
- Problema: H2-2, H4-2.
- Solución: chips de franja en el Pago; delivery dentro de la ventana; se eliminan `DELIVERY_TIME` fijo (L609) y "12–18 min" (L4782).
- Beneficio: Juan sabe a qué hora recibe su comida.
- Heurísticas: H1, H2, H4.
- Afecta: `Payment`, `Order.slot`, `Confirmation`, `OrderItem`, `Tracking`.
- Complejidad: media.
- Dependencias: P0-2.
- Criterios de aceptación:
  - No se ofrece ninguna franja fuera de la ventana.
  - Confirmación, pedido y notificación muestran la misma franja.
  - No queda ningún texto de minutos fijos.

**P0-4 · Recompensas solo al completar, y reversión completa**
- Problema: H1-4, H5-5.
- Solución: puntos, giros, subida de nivel y premio de nivel se otorgan en la transición a Recogido o Entregado, una sola vez; deshacer revierte.
- Beneficio: saldo íntegro y sin abusos.
- Heurísticas: H1, H5.
- Afecta: `placeOrder` (L6284-6310), `setOrderStatus`, `addPoints`, `spin`, `Confirmation`, `Payment` (texto "+X pts al recoger").
- Complejidad: media.
- Dependencias: P0-0.
- Criterios de aceptación:
  - Pagar y luego cancelar deja puntos, giros, nivel, créditos y cupones exactamente como estaban.
  - Completar otorga una vez; volver a completar tras deshacer no duplica.
  - El saldo es igual a la suma del historial.

**P0-5 · Contención del planificador**
- Problema: H5-3, H5-7, H1-5, H10-1.
- Solución: hasta que exista P1-4, validar días y franjas contra el local, bloquear locales sin pack, quitar los recargos de tamaño inventados y etiquetar "Simulación: aún no se generan entregas ni cobros".
- Beneficio: no promete cobros ni entregas falsas.
- Heurísticas: H1, H5, H10.
- Afecta: `Planner`, `PLAN_SLOTS`, `PACK_SIZES`, modal de confirmación (L4338-4389), FAQ "plan".
- Complejidad: baja.
- Dependencias: P0-2 (ventanas).
- Criterios de aceptación:
  - No se puede guardar 21:30 en Sabor Criollo ni 08:00 en Dulce Lima.
  - No queda ninguna frase de cobro sin la etiqueta demo.

**P0-6 · Cobertura de delivery validada**
- Problema: H5-4.
- Solución: `hasCoverage` en el Pago y en el Plan; chip deshabilitado con su motivo.
- Beneficio: evita pedidos imposibles.
- Heurísticas: H5, H9.
- Afecta: `Payment` (L2563, L2655-2668), `Planner` (L4284-4293).
- Complejidad: baja.
- Dependencias: ninguna.
- Criterios de aceptación: con "Casa de playa", el delivery muestra "Sin cobertura en Punta Hermosa", no deja pagar y el recojo sigue disponible.

**P0-7 · Alérgenos visibles**
- Problema: H5-6.
- Solución: `allergens` en `Offer` y en `PublishedOffer`; visibles en el Detalle y en el resumen de pago.
- Beneficio: seguridad alimentaria.
- Heurísticas: H2, H5.
- Afecta: `offers`, `Detail`, `Payment`, `Publish`, `PackForm`.
- Complejidad: baja.
- Dependencias: ninguna.
- Criterios de aceptación:
  - Los 9 packs muestran alérgenos.
  - Una oferta publicada con "Trigo" lo muestra al cliente.

### P1 · Altas

**P1-1 · Ciclo de vida por modalidad y Detalle de pedido**
- Problema: H1-3, H6-1, H9-3, H2-3.
- Solución: estados de §4.E, nueva pantalla de detalle que reutiliza el ticket y la línea de tiempo, y `Tracking` fusionado en ella.
- Heurísticas: H1, H3, H6, H9.
- Afecta: `Orders`, `OrderItem`, `Confirmation`, `Tracking`, `Screen`.
- Complejidad: media.
- Dependencias: P0-0 y P0-3.
- Criterios de aceptación:
  - Desde cualquier pedido se ve su código y QR.
  - Un pedido de recojo pasa por los 4 estados.
  - Al cerrar la ventana, queda "No recogido".

**P1-2 · Negocio conectado al cliente**
- Problema: H4-5 y el inventario #35-36.
- Solución: pedidos del negocio derivados de `orders`, acciones que cambian el estado del cliente y publicaciones visibles en el catálogo.
- Heurísticas: H1, H4.
- Afecta: `BusinessOrders`, `Dashboard`, `Publish`, `PackForm`, `StoreScreen`, `Home`.
- Complejidad: media.
- Dependencias: P1-1.
- Criterios de aceptación:
  - El pedido que Valeria hace en La Espiga aparece en el negocio.
  - "Listo" en el negocio cambia el pedido del cliente y genera su aviso.
  - Una oferta publicada aparece en la ficha del local.

**P1-3 · Notificaciones internas**
- Problema: H1-6 y §4.E.
- Solución: bandeja con campana, contador en Pedidos, eventos de pedido y suscripción, y preferencias reales.
- Heurísticas: H1, H10.
- Afecta: `Shop`, `notify`, `Home`, `BottomNav`, `Profile`.
- Complejidad: media.
- Dependencias: P1-1.
- Criterios de aceptación:
  - Cada transición genera un aviso con hora.
  - El contador baja al leer.
  - Desactivar una categoría la silencia.

**P1-4 · Suscripción unificada (evolución del Planner)**
- Problema: §4.B, H3-4, H9-2.
- Solución: entidad `Subscription`, duración, modalidad, cobro por entrega confirmada (simulado y etiquetado), pedidos "Programado", saltar, pausar y "sin pack hoy".
- Heurísticas: H1, H3, H5, H9.
- Afecta: `Planner`, `PlanItem`, `Orders`, el negocio y el panel demo.
- Complejidad: alta.
- Dependencias: P0-5, P1-1 y P1-2.
- Criterios de aceptación:
  - Una suscripción L–J genera 2 pedidos "Programado" por semana.
  - "Saltar" la del jueves no la cobra.
  - "Hoy no hay pack" la marca "No disponible", sin cobro y con aviso.
  - No existe otra función que duplique esto.

**P1-5 · Suscripción después de la primera compra**
- Problema: H8-3 y la recomendación del profesor.
- Solución: quitar el CTA del Detalle sin historial; invitar tras completar o calificar, o desde la ficha del local.
- Heurísticas: H8.
- Afecta: `Detail`, `Review`, `StoreScreen`.
- Complejidad: baja.
- Dependencias: P0-4.
- Criterios de aceptación:
  - Una cuenta nueva no ve el CTA en el Detalle.
  - Tras completar un pedido de La Espiga, sí ve la invitación.

**P1-6 · Estado limpio para cuentas nuevas y cierre de sesión**
- Problema: inventario #2.
- Solución: `Signup` y `Cerrar sesión` restablecen el estado.
- Heurísticas: H1, H2.
- Afecta: `Signup`, `Profile`, `App`.
- Complejidad: baja.
- Dependencias: ninguna.
- Criterios de aceptación: una cuenta nueva tiene 0 pts (Bronce), 0 pedidos, S/ 0 de créditos y 1 giro de bienvenida.

**P1-7 · Separar los conceptos**
- Problema: H2-4, H4-7 y §4.F.
- Solución:
  - Niveles Bronce, Plata y Oro.
  - Ocultar la fila del Pass.
  - Eliminar "prioridad en la fila" y Diamante.
  - Beneficio de envío de Oro acotado (según §10).
- Heurísticas: H2, H4, H8.
- Afecta: `LEVELS`, `LEVEL_REWARDS`, `Profile`, `BusinessOrders` (orden por hora), FAQ.
- Complejidad: baja.
- Dependencias: decisiones de §10.
- Criterios de aceptación:
  - No queda ningún nivel con nombre de suscripción.
  - El Pass no es visible.
  - El negocio ordena por franja.

**P1-8 · Integridad de los packs**
- Problema: H2-1.
- Solución: nombres y descripciones de pack genéricos ("puede incluir…"); catálogo sin duplicados del pack.
- Heurísticas: H2.
- Afecta: datos `offers` y `stores`.
- Complejidad: baja.
- Dependencias: ninguna.
- Criterios de aceptación: ningún "Pack Sorpresa" comparte nombre y precio con un producto del catálogo.

**P1-9 · Panel demo único**
- Problema: H8-4, H5-8, H9-1.
- Solución: mover todas las simulaciones al panel de prototipo existente, incluido el reloj simulado.
- Heurísticas: H5, H8.
- Afecta: `aside.annotation`, `Roulette`, `Tracking`, `Payment`, `MapScreen`, `BusinessOrders`.
- Complejidad: media.
- Dependencias: P1-1.
- Criterios de aceptación: dentro del teléfono no queda ningún control con "demo", "simular" o "prueba" fuera de la etiqueta "DEMO · PAGO SIMULADO".

### P2 · Medias

| ID | Propuesta | Hallazgos | Afecta | Compl. | Criterio de aceptación |
|---|---|---|---|---|---|
| P2-1 | Inicio progresivo y cercanía real por dirección | H8-1, H7-2, H6-3, H4-3 | `Home`, `storeDistance` | media | Cambiar a "Oficina" reordena "Cerca de ti". Un usuario nuevo no ve nivel ni giros |
| P2-2 | Filtros de preferencia y de franja; contador correcto | H7-1, H1-7 | `AllPacks`, datos `tags` | media | "Vegetariano" y "Disponible a las 7 p. m." filtran bien. El contador excluye agotados |
| P2-3 | Glosario único de términos | H4-1, H4-4 | Textos de todas las pantallas | baja | Un solo término por concepto en toda la app |
| P2-4 | Accesibilidad | A-1…A-6 | `OfferCard`, interruptores, `Modal`, CSS | media | Navegación completa con teclado. Modales con Escape y foco. Ningún texto informativo < 12 px |
| P2-5 | Responsive verificado | A-7 | css L2122-2196 | baja | Sin solapes a 360 × 640, 393 × 852 y 414 × 896 |
| P2-6 | Pago más claro | H10-2, H8-2 | `Payment` | baja | Política visible antes de pagar. Un solo control de descuentos con el mejor preaplicado |
| P2-7 | Billetera unificada en cupones | H8-2 | `credits`, `rewards`, `RewardChooser`, `Levels` | media | Tres monedas en total. Los totales del pago no cambian para casos equivalentes |
| P2-8 | Navegación coherente por rol | H3-2, H4-7 | `Help`, `Legal`, `BottomNav`, `Profile` | baja | El negocio nunca ve la barra del cliente. "Quiero ser aliado" no cambia de rol |
| P2-9 | Puntos como libro de movimientos | §4.C | `history`, `addPoints` | baja | El saldo es igual a la suma de los movimientos, también con los datos iniciales |
| P2-10 | Modo invitado y onboarding antes del login | H3-1 | `App`, `Login`, `Onboarding`, `Payment` | media | Se puede explorar sin cuenta. La cuenta se pide al pagar |
| P2-11 | Descartar cambios del plan | H3-3 | `Planner` | baja | "Descartar" vuelve exactamente a lo guardado |

### P3 · Bajas

| ID | Propuesta | Afecta | Compl. | Criterio de aceptación |
|---|---|---|---|---|
| P3-1 | Ruleta: textos, vencimiento configurable, movimiento reducido | `Roulette`, `WHEEL` | baja | El texto dice "por pedido completado". Respeta `prefers-reduced-motion` |
| P3-2 | Reseñas persistidas (estrellas y etiquetas) | `Review`, `Order` | baja | El historial muestra la calificación dada |
| P3-3 | Impacto calculado con pedidos completados | `Levels` L3688-3691 | baja | Sin constantes de base (9, 148) |
| P3-4 | Recompra en un toque | `Home`, `OrderItem` | baja | Recuerda la última modalidad y el último método |
| P3-5 | Persistencia local para pruebas de usuario | `App` (`localStorage` con try/catch) | baja | Recargar conserva la sesión de prueba |
| P3-6 | Celebración de nivel y confeti al completar el pedido | `Confirmation` → Detalle de pedido | baja | Aparece solo al pasar a Recogido o Entregado |

### FUTURO (no necesario para validar el MVP)

| ID | Funcionalidad | Por qué no ahora |
|---|---|---|
| F-1 | Membresía premium (ComeRICO Pass) | Requiere usuarios frecuentes y cobro recurrente; hoy se solapa con los beneficios de nivel (§4.F) |
| F-2 | Notificaciones push reales | Requieren backend y servicios de push |
| F-3 | Delivery por terceros con seguimiento real | Requiere integración. Sin ella no se debe prometer tiempo real |
| F-4 | Pagos reales (pasarela, Yape), métodos guardados, facturación con RUC | Fuera del alcance de un prototipo |
| F-5 | Prepago de 3 o 6 meses con descuento por permanencia | Validar primero la suscripción simple |
| F-6 | Acceso anticipado para Plata, cupos de suscripción por local, métricas reales del negocio | Dependen de datos reales |
| F-7 | Backend, autenticación real, "Cerrar todas las sesiones" real | Infraestructura |
| F-8 | Postulación de repartidores | No forma parte de la propuesta de valor del MVP |

---

## 10. Decisiones pendientes

Requieren definición de negocio **antes** de implementar. Doy una recomendación para el MVP, no una regla definitiva.

| # | Decisión | Opciones | Recomendación para el MVP | Bloquea |
|---|---|---|---|---|
| D1 | Ventana de recojo | Fija por local / definida en cada publicación | Definida en cada publicación, con un valor por defecto por local | P0-2, P0-3 |
| D2 | Política de cancelación | Hasta "Confirmado" / hasta "Listo" / sin cancelación | Hasta que el local marque "En preparación". Después, solo por incidencia | P1-1 |
| D3 | No recogido | Se cobra sin reembolso / reembolso parcial / crédito | Se cobra (la comida se preparó), sin puntos, con aviso previo de 30 min | P1-1 |
| D4 | Delivery en el MVP | Solo recojo / delivery del local / terceros | Recojo como principal y delivery del local en zonas con cobertura. Terceros a futuro | P0-3, P0-6 |
| D5 | Costo de delivery | Fijo S/ 4.90 / por distancia / lo define el local | Fijo, como hoy, solo en zonas con cobertura | P0-6 |
| D6 | Tamaños de pack | Un tamaño / tamaños definidos por el local | Un solo tamaño en el MVP | P0-5 |
| D7 | Cobro de la suscripción | Prepago / semanal / por entrega confirmada | Por entrega confirmada (§4.B) | P1-4 |
| D8 | Duración de la suscripción | Sin fin / 4 semanas / 3 meses / 6 meses | Las cuatro, como fecha de término, sin permanencia ni descuento | P1-4 |
| D9 | Límite de cambios | 2 h antes / hasta que el local confirme | Hasta que el local confirme la entrega del día | P1-4 |
| D10 | Base de los puntos | Por S/ (con o sin envío) / fijo por pedido | 5 pts por S/ 1 del subtotal de productos, sin envío | P0-4 |
| D11 | Umbrales de nivel | 500 / 1 500 (actual) / ~350 / ~1 000 (≈ 5 y 15 pedidos) | ≈ 5 y ≈ 15 pedidos, sin caducidad | P1-7 |
| D12 | Beneficio de envío por nivel | Oro con envío gratis ilimitado (actual) / acotado / ninguno | Acotado (1 por semana); el ilimitado se reserva para el Pass | P1-7, F-1 |
| D13 | Premios y probabilidades de la ruleta | Pesos actuales 25/10/10/15/25/15 (L967) | Mantener, y definir quién financia cada descuento (ComeRICO o el local) | P3-1 |
| D14 | Vencimiento de cupones | 48 h (actual) / 7 días | 7 días | P3-1 |
| D15 | Acumulación de descuentos | Premio + cupón + créditos (actual) / uno por pedido | Un cupón más créditos; nunca bajar de S/ 0 (ya se cumple, L2560) | P2-6, P2-7 |
| D16 | Créditos y platos gratis | Mantener / consolidar en cupones | Consolidar | P2-7 |
| D17 | Prioridad por nivel en la fila de recojo | Mantener / eliminar | Eliminar | P1-7 |
| D18 | Compra como invitado | Cuenta al pagar / sin cuenta | Cuenta al pagar (hace falta para el pedido y el reclamo) | P2-10 |
| D19 | Membresía premium | Precio, beneficios, momento de la oferta | Fuera del MVP (F-1) | — |

---

## 11. Resumen ejecutivo: las 10 mejoras más importantes

1. **Stock real (P0-1).** Hoy se puede vender infinitamente un pack que dice "Quedan 2".
2. **Vigencia y ventana de recojo calculadas (P0-2).** La cuenta regresiva es fija y contradice las horas límite, y se pueden pagar packs vencidos.
3. **Franja horaria y promesas de tiempo honestas (P0-3).** Responde la duda principal del usuario, "¿a qué hora recibo mi comida?", y elimina "30–45 min" y "12–18 min" fijos.
4. **Recompensas solo al completar, con reversión completa (P0-4).** Cierra el abuso de subir de nivel, cobrar el premio y cancelar, y deja el saldo coherente.
5. **Alérgenos visibles y cobertura de delivery validada (P0-7, P0-6).** Seguridad del usuario y pedidos posibles.
6. **Un solo concepto de suscripción por local, construido sobre el planificador (P0-5 → P1-4).** Horarios válidos, duración, cobro por entrega confirmada y entregas como pedidos, sin duplicar funciones.
7. **Ciclo de vida del pedido y Detalle de pedido con código y QR (P1-1).** El recojo deja de quedar "Reservado" para siempre.
8. **Negocio conectado y notificaciones internas (P1-2, P1-3).** "Marcar listo" llega al cliente; las ofertas publicadas y los alérgenos aparecen en el catálogo.
9. **Separar los conceptos (P1-7, P1-5).** Niveles Bronce, Plata y Oro por actividad; la suscripción se ofrece tras la primera compra; ComeRICO Pass pasa a futuro.
10. **Panel demo único y cuentas nuevas limpias (P1-9, P1-6).** Ninguna simulación parece una transacción real, y el recorrido de Juan se puede probar de verdad.

**Siguiente paso propuesto:**
1. Revisa y ajusta las decisiones D1-D19, especialmente D2, D3, D4, D7, D10, D11 y D12.
2. Con tu aprobación, implemento por fases: primero P0 y su verificación, luego P1, y así sucesivamente, conservando las funcionalidades existentes y comprobando en cada fase que los demás flujos no se rompan.

---

## 12. Implementación realizada (25 de noviembre de 2026)

Se implementaron las fases **P0, P1, P2 y P3**. Las funcionalidades marcadas como **FUTURO** (F-1 a F-8) no se implementaron. Se conservó la identidad visual y no se añadieron dependencias.

**Copia de seguridad:** el código anterior está en `.backup-auditoria/` (`App.tsx` e `index.css`). Puedes borrar esa carpeta cuando ya no la necesites.

### 12.1 Decisiones de negocio aplicadas

No se recibieron otras indicaciones, así que se aplicaron las recomendaciones de la sección 10. Todas se pueden cambiar.

| Decisión | Valor aplicado |
|---|---|
| D1 Ventana de recojo | Por local (p. ej., La Espiga de 8:00 a 9:30 p. m.). Al publicar, el negocio define la hora límite |
| D2 Cancelación | Sin costo mientras el pedido está «Confirmado». El local puede cancelar por incidencia, con motivo |
| D3 No recogido | Pasa a «No recogido» al cerrar la ventana: sin reembolso y sin puntos. Aviso 30 min antes |
| D4–D5 Delivery | Lo hace el propio local, dentro de la ventana y en franjas de 30 min, por S/ 4.90 fijos. Solo en zonas con cobertura |
| D6 Tamaños | Un solo tamaño. Se eliminaron los recargos inventados (+S/ 5 y +S/ 10) |
| D7–D9 Suscripción | Cobro por entrega cuando el local la confirma. Duración: sin fin, 4 semanas, 3 o 6 meses. Saltar, pausar o cancelar en cualquier momento |
| D10–D11 Puntos | 5 pts por S/ 1 del subtotal de productos al completar, más 10 por reseña. Bronce 0, Plata 350 y Oro 1 000 pts |
| D12 Envío Oro | 1 envío gratis por semana. El envío ilimitado se reserva para la membresía premium futura |
| D13–D15 Cupones | Mismos premios y pesos de la ruleta. Los cupones vencen en 7 días y se usa uno por pedido |
| D16 Billetera | Créditos y platos gratis consolidados en cupones; al subir de nivel se recibe un cupón |
| D17 Prioridad por nivel | Eliminada. El negocio ordena los pedidos por franja de recojo |
| D18 Invitado | Se explora sin cuenta; la cuenta se pide al pagar y luego vuelve al pago |
| D19 Premium | Fuera del MVP: se quitó la fila «ComeRICO Pass» |

### 12.2 Qué cambió

- **P0:**
  - Stock real: se descuenta, se devuelve al cancelar y se revalida al confirmar.
  - Vigencia y cuenta regresiva calculadas con un reloj: ningún pack vencido se puede pagar.
  - Franja horaria en el pago.
  - Recompensas solo al completar, idempotentes y reversibles.
  - Suscripción con días y franjas validados contra el local.
  - Cobertura de delivery validada.
  - Alérgenos visibles en el detalle.
- **P1:**
  - Estados tipados por modalidad, con línea de tiempo y la nueva pantalla **Detalle de pedido** (código, QR, cancelación y reclamo).
  - Negocio conectado a los pedidos reales: preparar, listo, despachar, validar código y cancelar con motivo.
  - Las ofertas publicadas aparecen en la ficha del local.
  - **Bandeja de notificaciones** con preferencias por categoría.
  - Las suscripciones generan pedidos.
  - La invitación a suscribirse aparece solo tras un pedido completado.
  - Las cuentas nuevas empiezan con estado limpio.
  - Niveles Bronce, Plata y Oro.
  - Packs con contenido «puede incluir…».
  - **Panel de controles de demo** fuera del teléfono.
- **P2:**
  - Inicio progresivo, con «Cerca de ti» ordenado por la distancia a la dirección activa.
  - Filtros de preferencias (vegetariano, sin gluten, sin lácteos) y de hora de recojo.
  - Terminología única.
  - Accesibilidad: modales con `role="dialog"`, foco y Escape; interruptores con `role="switch"`; favorito sin botón anidado; texto mínimo de 12 px.
  - Botón «Demo» en móvil que no tapa la interfaz.
  - Política visible antes de pagar.
  - Libro de puntos que cuadra con el saldo.
  - Modo invitado y onboarding antes del login.
  - Navegación «atrás» por historial (corrige un bucle detalle ↔ tienda que venía del código original).
- **P3:**
  - Ruleta con giro por pedido completado y `prefers-reduced-motion`.
  - Reseñas guardadas en el pedido.
  - Impacto del mes calculado.
  - Recuerdo de la última modalidad y método.
  - Persistencia local de la demo, que se reinicia cada día.
  - Celebración de nivel al completar el pedido.

### 12.3 Cómo probarlo

- **Cliente:** usuario demo Valeria, con nivel Plata y 940 pts (le faltan 60 para Oro).
- **Negocio:** usuario La Espiga.
- **Invitado:** «Explorar sin cuenta».
- **Panel «Controles de demo»** (a la derecha en escritorio, pestaña «Demo» en móvil). Permite:
  - mover el reloj;
  - avanzar el estado de cualquier pedido;
  - hacer que el local confirme o no tenga pack para las suscripciones de hoy;
  - sumar un giro;
  - rechazar el próximo pago;
  - ver el mapa sin permiso de ubicación;
  - reiniciar la demo.
- **Reloj:** usa la hora real entre 7:00 a. m. y 8:30 p. m. Fuera de ese horario arranca a las 4:30 p. m. (simulado) para que haya packs disponibles.

### 12.4 Verificación

- `tsc --noEmit` sin errores y `vite build` correcto.
- Se hicieron cuatro recorridos automatizados en Chrome sin interfaz (escritorio y móvil a 393 × 852), **sin errores de consola**. Comprobaron:
  - compra de recojo de punta a punta;
  - avance por estados;
  - subida a Oro solo al recoger;
  - suscripción con domingo bloqueado;
  - stock agotado y devuelto al cancelar;
  - pagar y cancelar sin dejar puntos ni giros;
  - negocio que avisa al cliente;
  - pedido «No recogido» al cerrar la ventana;
  - dirección sin cobertura;
  - invitado que crea cuenta y vuelve al pago;
  - oferta publicada con alérgenos visible al cliente;
  - cupón de la ruleta preaplicado;
  - sin scroll horizontal en móvil.

### 12.5 Limitaciones que se mantienen (por diseño del MVP)

- Pagos, cobros de suscripción y avisos siguen **simulados** y etiquetados como demo.
- No hay backend: los datos viven en el navegador.
- El negocio de la demo es un solo local (La Espiga).
- La vista de suscripciones muestra los próximos 7 días.
- No hay push, seguimiento GPS ni delivery de terceros: quedan como funcionalidades futuras.
