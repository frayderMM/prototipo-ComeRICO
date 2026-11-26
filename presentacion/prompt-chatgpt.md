# Prompt para generar la presentación de ComeRICO en ChatGPT

## Antes de pegar el prompt

1. Comprime la carpeta `presentacion/` (logo, ícono y la carpeta `capturas/`, unos 7 MB) y súbela a ChatGPT junto con el prompt.
2. Si también subes el proyecto completo, **excluye** `node_modules/`, `dist/` y `.backup-auditoria/`. `node_modules` pesa cientos de MB y ChatGPT no lo necesita.
3. Copia todo el bloque de la sección «Prompt» y pégalo en el mismo mensaje.
4. Antes de presentar, cambia `[Nombres del equipo]`, `[Curso]` y `[Fecha]` en la portada.

---

## Prompt

```text
Actúa como diseñador de presentaciones de startups y redactor de pitch comercial.
Crea una presentación en PowerPoint (.pptx, formato 16:9) para ComeRICO, una app móvil
de comida. Genera el archivo con python-pptx, incrustando las imágenes que te adjunto,
y entrégame el .pptx descargable.

=== QUÉ ES COMERICO (contexto para ti, no lo copies tal cual) ===
ComeRICO es una app para comer rico a mitad de precio en los locales de tu zona
(panaderías, cafeterías y restaurantes de menú). Los locales publican cada día
"Packs Sorpresa" con su comida del día a precio especial; el cliente ve qué puede
traer el pack, elige una franja de 30 minutos y lo recoge o lo recibe por delivery.
Sus tres funciones estrella, que la diferencian de las apps de comida que ya existen:
1) Packs Sorpresa a mitad de precio.
2) Suscripción a tu local favorito: recibes su pack los días que elijas.
3) Niveles Bronce, Plata y Oro gratis por uso, con cupones, giros de ruleta y envío gratis.
También tiene un panel para el negocio: publica ofertas, gestiona pedidos y valida
el código del cliente.

=== TONO OBLIGATORIO ===
- Vendedor, seguro y orientado a negocio: como un pitch ante inversionistas.
- Habla de ahorro, conveniencia, fidelización, ventas e ingresos.
- PROHIBIDO presentar el proyecto como causa social, caridad, ONG o sostenibilidad.
  NO uses estas palabras ni ideas: desperdicio, desperdiciar, excedente, sobrante,
  rescatar, salvar comida, impacto ambiental, planeta, sostenible, donación.
  Usa en su lugar: "comida del día", "packs del día", "precio especial", "mitad de precio".
- Textos muy breves: títulos de máximo 8 palabras, máximo 4 viñetas por slide
  y máximo 12 palabras por viñeta.
- No inventes estadísticas. Usa SOLO las cifras de este prompt.

=== IDENTIDAD VISUAL ===
- Colores: verde marca #0F5226 (títulos y fondos fuertes), naranja marca #CB6E02
  (acentos y cifras), naranja botón #C2410C, verde hoja #94C450 (detalles),
  menta claro #EEF6E4 (fondos suaves), blanco hueso #FAFAF8 (fondo general),
  texto gris oscuro #1C1917.
- Tipografía: títulos en "Bricolage Grotesque" (si no está, usa Montserrat ExtraBold);
  textos en "Inter" (si no está, usa Calibri).
- Logo: logo-comerico.png (fondo transparente). Úsalo grande en la portada y
  pequeño en una esquina del resto de slides. icono-chef.png sirve como sello.
- Capturas: la carpeta capturas/ trae pantallas reales del prototipo, ya recortadas
  con la forma del teléfono y esquinas transparentes (786 x 1704 px).
  Colócalas tal cual: no las recortes, no las deformes (mantén la proporción)
  y no les pongas otro marco de teléfono. Una sombra suave está bien.
  Usa como máximo 4 capturas por slide, con una etiqueta corta debajo de cada una.
- Estilo limpio y moderno, con mucho espacio en blanco, tipo app de comida premium.
  Destaca las cifras grandes en naranja.
- Agrega notas del orador en cada slide con lo que se dice en voz alta (2 a 4 frases).

=== CONTENIDO SLIDE POR SLIDE ===

SLIDE 1 — PORTADA
- Logo grande al centro o a la izquierda.
- Título: "ComeRICO"
- Subtítulo: "Comida rica de tu barrio, a mitad de precio."
- Tres etiquetas tipo píldora: "Packs Sorpresa" · "Suscripciones a tu local" · "Niveles con beneficios"
- Pie: "[Nombres del equipo] · [Curso] · [Fecha]"
- Imagen de apoyo: capturas/03-inicio.png a la derecha.
- Notas: "ComeRICO es la app para comer rico todos los días pagando la mitad, en los
  locales de tu zona, y con beneficios por ser cliente frecuente."

SLIDE 2 — EL CASO: LA OPORTUNIDAD (motivación comercial e impacto)
- Título: "Una oportunidad de dos lados"
- Columna izquierda, "El cliente quiere comer fuera, pero gastando menos":
  · "3 de cada 10 hogares peruanos redujeron sus salidas a comer"
  · "En Lima, 33% de hogares comen menos fuera de casa"
  · Fuente en letra pequeña: "Kantar Worldpanel, 2023"
- Columna derecha, "El local quiere vender más y tener clientes fijos":
  · "Cada día tiene comida lista que puede convertir en ventas"
  · "Necesita demanda recurrente y predecible"
- Franja inferior, "Impacto", con 3 cifras grandes:
  · "50–56%" → "de ahorro por pack para el cliente"
  · "S/ 503" → "por cliente suscrito en 3 meses para el local (L-M-V)"
  · "3 fuentes" → "de ingreso para ComeRICO: comisión, delivery y suscripciones"
- Notas: "Hay demanda: la gente quiere seguir comiendo fuera, pero le cuesta. Del otro
  lado, los locales pueden vender más al cierre del día. ComeRICO conecta ambos lados
  y cobra en cada transacción."

SLIDE 3 — EL CASO: PROBLEMA IDENTIFICADO
- Título: "Comer rico todos los días sigue siendo caro"
- 4 tarjetas con ícono:
  · "Comer fuera a precio completo pesa en el bolsillo"
  · "Las apps de delivery suman tarifas al precio del plato"
  · "No puedes abonarte a tu panadería o café favorito"
  · "Ser cliente frecuente no te da beneficios reales"
- Notas: "El cliente paga precio completo y encima tarifas. No existe una forma simple
  de comprarle seguido a su local favorito ni de ser premiado por su fidelidad. Y el
  local no tiene un canal para vender más al cierre del día."

SLIDE 4 — LA SOLUCIÓN
- Título: "ComeRICO: come rico pagando la mitad"
- Frase: "Una app que conecta a clientes con locales de su zona que publican packs
  del día a precio especial."
- Flujo de 4 pasos con íconos: "Explora cerca de ti" → "Elige tu franja de 30 min"
  → "Paga con Yape, tarjeta o efectivo" → "Recoge o recibe tu pack"
- Debajo, dos bloques: "App para clientes" y "Panel para negocios".
- Imagen de apoyo: capturas/05-mapa.png o capturas/01-onboarding.png
- Notas: "El cliente descubre packs cerca, elige a qué hora recogerlos y paga en la
  app. El local publica en minutos y gestiona sus pedidos desde su panel."

SLIDE 5 — FUNCIONALIDADES CLAVE (lo que otras apps no tienen)
- Título: "Lo que nos hace diferentes"
- 3 tarjetas grandes:
  1. "Packs Sorpresa" — "Comida del día desde S/ 7.90, con valor de hasta S/ 32.
     Ves qué puede traer, sus alérgenos y su horario."
  2. "Suscripción a tu local" — "Elige días, franja y duración: 4 semanas, 3 o 6 meses.
     Solo se cobra cuando el local confirma tu pack."
  3. "Niveles Bronce, Plata y Oro" — "Gratis por usar la app: cupones al subir de nivel,
     giros de ruleta y envío gratis semanal en Oro."
- Tabla comparativa pequeña (genérica, sin nombrar marcas):
  | Función                              | Apps de delivery          | ComeRICO |
  | Descuentos de ~50% todos los días    | Promociones puntuales     | Sí       |
  | Suscripción a un local específico    | No                        | Sí       |
  | Beneficios por nivel, sin pagar      | Membresías pagadas        | Sí       |
- Notas: "Estas tres funciones generan ahorro para el cliente, recurrencia para el
  local e ingresos predecibles para ComeRICO."

SLIDE 6 — PANTALLAS: DESCUBRE Y COMPRA
- Título: "Comprar toma menos de un minuto"
- Opción boceto (recomendada para la sección Pantallas): usa wireframes/lamina-compra.png
  como imagen completa debajo del título (fondo transparente, 16:9). Si la usas,
  omite las 4 capturas de abajo.
- Opción flujo completo: wireframes/flujo-pantallas.png muestra las 12 pantallas
  conectadas (estilo boceto). Úsala en una slide propia titulada "Mapa de pantallas".
- 4 capturas en fila con su etiqueta:
  capturas/03-inicio.png ("Inicio: ofertas cerca de ti"),
  capturas/07-detalle-pack.png ("Detalle del pack"),
  capturas/09-pago-franja.png ("Eliges tu franja y pagas"),
  capturas/11-confirmacion.png ("Código y hora de recojo")
- Nota pequeña: "Prototipo funcional · pantallas reales"
- Notas: "Del inicio al pago en pocos toques. El usuario siempre sabe a qué hora recoge."

SLIDE 7 — PANTALLAS: SUSCRIPCIONES Y NIVELES
- Título: "Clientes que vuelven cada semana"
- Opción boceto (recomendada): usa wireframes/lamina-suscripcion.png como imagen
  completa debajo del título. Si la usas, omite las 4 capturas de abajo.
- 4 capturas:
  capturas/15-suscripcion-editor.png ("Suscríbete a tu local"),
  capturas/17-suscripciones-semana.png ("Tu semana de entregas"),
  capturas/18-beneficios-niveles.png ("Niveles Bronce, Plata y Oro"),
  capturas/13-subida-nivel.png ("Premio al subir de nivel")
- Notas: "Aquí está nuestro diferencial: la suscripción asegura ventas recurrentes al
  local y los niveles premian al cliente frecuente."

SLIDE 8 — PANTALLAS: SEGUIMIENTO Y PANEL DEL NEGOCIO
- Título: "Cliente y local, siempre conectados"
- 4 capturas:
  capturas/12-seguimiento-pedido.png ("Estado del pedido paso a paso"),
  capturas/20-notificaciones.png ("Avisos: tu pack está listo"),
  capturas/22-negocio-panel.png ("Panel de ventas del local"),
  capturas/23-negocio-pedidos.png ("Pedidos del día y validación")
- Notas: "Cuando el local marca el pedido como listo, el cliente recibe el aviso al
  instante. El negocio ve sus ventas y entrega validando un código."

SLIDE 9 — DEMO EN VIVO: UN DÍA CON JUAN
- Título: "Demo: un día con Juan"
- Ficha de personaje a la izquierda (tarjeta con ícono de persona):
  "Juan, 21 años · Estudiante universitario · Trabaja medio tiempo"
  "Presupuesto ajustado · Poco tiempo para cocinar"
- 5 pasos numerados a la derecha (texto corto):
  1. "Busca comida cerca de la universidad"
  2. "Filtra por su horario y elige su cena"
  3. "Crea su cuenta y paga en segundos"
  4. "El local le avisa: su pack está listo"
  5. "Le gustó: se suscribe y suma puntos"
- Fondo con color verde marca #0F5226 y texto blanco; el logo o el ícono del chef como sello.
- Notas: "Les presentamos a Juan. Sale de clases con hambre, poco tiempo y un
  presupuesto ajustado. Veamos cómo ComeRICO le resuelve la cena."

SLIDE 10 — CONCLUSIONES
- Título: "Por qué ComeRICO gana"
- 3 viñetas:
  · "El cliente ahorra la mitad en cada pack"
  · "El local vende más y asegura clientes con suscripciones"
  · "ComeRICO cobra en cada pedido, entrega y suscripción"
- Bloque "Próximos pasos": "Piloto con locales de [zona]" · "Pagos reales con Yape y tarjeta" · "App nativa iOS y Android"
- Cierre grande: "¡Gracias!" con el logo.
- Notas: "ComeRICO resuelve el precio para el cliente y las ventas para el local, con
  un modelo de ingresos recurrente."

=== CAPTURAS DE RESPALDO (opcional, para un anexo) ===
01-onboarding, 02-login, 04-explorar-filtros, 06-ficha-local, 08-detalle-condiciones,
10-pago-total-puntos, 14-mis-pedidos, 16-suscripcion-confirmar, 19-ruleta,
21-perfil, 24-negocio-publicar.

Al terminar, revisa que ningún texto supere el espacio de su caja, que no aparezca
ninguna palabra prohibida y que las capturas no estén deformadas. Luego entrégame el .pptx.
```

---

## Datos usados y su fuente

**Cifra de mercado (slide 2):**
- 3 de cada 10 hogares peruanos (29%) redujeron sus salidas a comer fuera por la situación económica.
- En Lima la cifra es 33%.
- Fuente: Kantar Worldpanel (2023), citado también por Gestión y Forbes Perú.
- [Kantar: 3 de cada 10 hogares peruanos han reducido sus salidas a comer a la calle](https://www.kantar.com/latin-america/inspiracion/consumidor/2023-peru-salidas-a-comer-a-la-calle)
- [Gestión: Kantar, tres de cada 10 hogares peruanos han reducido sus salidas a comer fuera](https://gestion.pe/economia/kantar-tres-de-cada-10-hogares-peruanos-han-reducido-sus-salidas-a-comer-fuera-del-hogar-noticia/)

**Cifras del producto** (salen del prototipo, no son de mercado):
- Packs de S/ 7.90 a S/ 14.90, con valor normal de S/ 16.50 a S/ 32.00 (50% a 56% de ahorro).
- Delivery a S/ 4.90.
- Suscripción de ejemplo: lunes, miércoles y viernes durante 3 meses, a S/ 12.90 por entrega = S/ 503.10.

**Lo que conviene validar antes de presentar:**
- La tabla comparativa con las apps de delivery es genérica. Confirmen que la describen bien.
- El modelo de ingresos (comisión, delivery y suscripciones) es una propuesta: el prototipo no fija porcentajes.

---

## Guion de la demo en vivo: «Un día con Juan» (para quienes presentan)

**Idea.** La demo cuenta la historia de una persona, Juan (el caso del profesor), desde que abre la app por primera vez hasta que se vuelve cliente fijo de un local. Dura unos 4 minutos.

**Roles (2 personas)**
- **Narrador / Juan:** cuenta la historia y maneja la app.
- **El local:** pulsa los botones de «Controles de demo» (panel derecho), como si fuera La Espiga atendiendo desde su celular.

**Antes de empezar**
1. Abre http://localhost:8443 y pulsa «Reiniciar demo» en el panel derecho. La app queda en la introducción, sobre el login.
2. Ten a mano los datos de Juan: **Juan · Pérez · juan.perez@uni.edu.pe · 912345678 · comerico123**.
3. No ocultes el panel: «el local» lo necesita en la escena 5.

| # | Escena | Qué dice el narrador | Qué se toca en la app |
|---|---|---|---|
| 1 | Conozcan a Juan (20 s) | «Juan estudia, trabaja medio tiempo y sale de clases con hambre, poco tiempo y un presupuesto ajustado. Hoy descarga ComeRICO.» | Muestra el primer paso de la introducción → «Saltar». |
| 2 | Descubre sin registrarse (40 s) | «Sin crear cuenta ya ve packs cerca, a mitad de precio y a qué hora puede recogerlos.» | «o explora sin cuenta» → en Inicio, muestra las tarjetas → «Cerca de mí» → en «Recoger» elige **«Puedo a las 8:00 p. m.»** (sale de clases a esa hora). |
| 3 | Elige su cena (40 s) | «Por S/ 12.90 se lleva algo que vale S/ 28.90. Sabe qué puede traer, los alérgenos y hasta qué hora lo guardan.» | Toca «Pack Sorpresa panadero» (La Espiga) → baja hasta «Condiciones» → «Continuar». |
| 4 | Crea su cuenta al pagar (40 s) | «Solo le pedimos la cuenta cuando decide comprar. Elige su franja y paga con Yape.» | «Crear cuenta para pagar» → llena los datos de Juan → acepta términos → «Crear cuenta» → vuelve al pago → elige **8:30 – 9:00 p. m.** → «Pagar» → «Sí, confirmar». |
| 5 | El local entra en escena (40 s) | «Juan sigue en clase. La panadería prepara su pedido… y le avisa cuando está listo. Juan pasa, muestra su código y lo recoge.» | «Ver detalle del pedido». **El local**, en el panel, junto a «Juan P.»: «→ En preparación» → «→ Listo para recoger» (aparece el aviso) → «→ Recogido» (aviso: +65 pts y 1 giro). |
| 6 | Le gustó y vuelve (50 s) | «A Juan le encantó. La app le propone recibir este pack cada semana, para organizar sus cenas. Solo se cobra cuando el local confirma.» | En el detalle: «Calificar · +10 pts» → «Publicar reseña» → «Suscribirme a Panadería La Espiga» → hoy (jueves) ya viene marcado, agrega **lunes** → «Revisar y confirmar» → «Confirmar suscripción» → muestra su semana. |
| 7 | Sus beneficios (20 s) | «Cada pedido le suma puntos: ya está en Bronce y va camino a Plata. Y gira la ruleta.» | Perfil (nivel Bronce, 75 pts) → «Gira y gana» → «GIRAR». |
| 8 | Del otro lado: el local (30 s, opcional) | «Y para La Espiga, Juan ya es un cliente fijo: hoy le toca su pack y lo confirma con un toque.» | Perfil → «Cerrar sesión» → toca el botón pequeñito dentro del campo de correo (cambia a Negocio) → «Iniciar sesión» → pestaña Pedidos → «Suscripciones de hoy: Juan P.» → «Confirmar pack». **Termina aquí.** |
| 9 | Cierre (10 s) | «Juan come rico pagando la mitad, el local vende más y ComeRICO gana en cada pedido.» | Vuelve a la presentación (slide de conclusiones). |

**Consejos**
- Si tienen poco tiempo, salten las escenas 7 y 8 (bajan a unos 3 minutos).
- Ensayen una vez completa con «Reiniciar demo» antes de presentar.
- Después de la escena 8 no pulsen «Cambiar a modo cliente»: carga la cuenta demo de Valeria, no la de Juan.
- No toquen los botones del reloj. Si presentan antes de las 8 p. m., el pack dirá «Desde 8:00 p. m.»; úsenlo en la historia: «Juan reserva temprano su cena».
- **Plan B:** si algo falla, pulsen «Reiniciar demo» e ingresen como Valeria (cuenta precargada). Está a 60 pts de Oro, así que al recoger un pack sube de nivel en vivo.
