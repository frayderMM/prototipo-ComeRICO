import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import logoUrl from "./assets/comerico-logo.webp";
import mascotUrl from "./assets/comerico-mascota.webp";
import juanPhotoUrl from "./assets/juan-perfil.webp";

type Screen =
  | "login"
  | "home"
  | "all-packs"
  | "empty-home"
  | "map"
  | "planner"
  | "locations"
  | "roulette"
  | "favorites"
  | "order"
  | "notifications"
  | "store"
  | "map-denied"
  | "detail"
  | "soldout"
  | "expired"
  | "payment"
  | "payment-error"
  | "confirmation"
  | "orders"
  | "orders-empty"
  | "review"
  | "profile"
  | "edit-profile"
  | "levels"
  | "help"
  | "legal"
  | "forgot"
  | "signup"
  | "business-profile"
  | "dashboard"
  | "publish"
  | "publish-errors"
  | "pack"
  | "business-orders";

const profilePhoto = juanPhotoUrl;

const photos = {
  bread:
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  coffee:
    "https://images.unsplash.com/photo-1564327367919-cb377ea6a88f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  sandwich:
    "https://images.unsplash.com/photo-1709689156424-16fe0e05b47b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  croissant:
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  latte:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  espresso:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  plate:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
  bowl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=900",
};

type Category = "Panadería" | "Café" | "Menú";

/** Hora del día expresada en minutos desde las 00:00. */
const at = (h: number, m = 0) => h * 60 + m;

/* Pack Sorpresa del día de cada local. La ventana de recojo (from–to) es la
   franja en la que el local entrega sus excedentes; `days` son los días en
   que el local publica packs con regularidad (se usan en las suscripciones). */
type Offer = {
  category: Category;
  photo: string;
  name: string;
  pack: string;
  content: string;
  rating: string;
  price: string;
  oldPrice: string;
  discount: string;
  stock: number;
  from: number;
  to: number;
  allergens: string[];
  tags: string[];
  days: number[];
};

const offers: Offer[] = [
  {
    category: "Panadería",
    photo: photos.bread,
    name: "Panadería La Espiga",
    pack: "Pack Sorpresa panadero",
    content: "Puede incluir pan francés, empanadas y pan dulce horneados hoy.",
    rating: "4.8",
    price: "S/ 12.90",
    oldPrice: "S/ 28.90",
    discount: "-55%",
    stock: 3,
    from: at(20),
    to: at(21, 30),
    allergens: ["Trigo", "Leche", "Huevo"],
    tags: ["Vegetariano"],
    days: [0, 1, 2, 3, 4, 5],
  },
  {
    category: "Panadería",
    photo: photos.croissant,
    name: "Boulangerie del Centro",
    pack: "Pack Sorpresa de masa madre",
    content: "Puede incluir croissants, pan de masa madre y bollería del día.",
    rating: "4.7",
    price: "S/ 10.50",
    oldPrice: "S/ 24.00",
    discount: "-56%",
    stock: 5,
    from: at(18, 30),
    to: at(20),
    allergens: ["Trigo", "Leche", "Huevo"],
    tags: ["Vegetariano"],
    days: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    category: "Panadería",
    photo: photos.cake,
    name: "Pastelería Dulce Lima",
    pack: "Pack Sorpresa de pastelería",
    content: "Puede incluir tajadas de torta y postres individuales del día.",
    rating: "4.9",
    price: "S/ 14.90",
    oldPrice: "S/ 32.00",
    discount: "-53%",
    stock: 2,
    from: at(19, 30),
    to: at(21),
    allergens: ["Trigo", "Leche", "Huevo", "Frutos secos"],
    tags: ["Vegetariano"],
    days: [1, 2, 3, 4, 5, 6],
  },
  {
    category: "Café",
    photo: photos.coffee,
    name: "Café Tostado",
    pack: "Pack Sorpresa café y dulce",
    content: "Puede incluir un café para llevar y uno o dos dulces del día.",
    rating: "4.8",
    price: "S/ 9.90",
    oldPrice: "S/ 21.00",
    discount: "-53%",
    stock: 4,
    from: at(19),
    to: at(20, 30),
    allergens: ["Leche", "Trigo", "Huevo"],
    tags: ["Vegetariano"],
    days: [0, 1, 2, 3, 4],
  },
  {
    category: "Café",
    photo: photos.latte,
    name: "Barista Molina",
    pack: "Pack Sorpresa barista",
    content: "Puede incluir una bebida de café y alfajores o galletas del día.",
    rating: "4.6",
    price: "S/ 8.50",
    oldPrice: "S/ 18.00",
    discount: "-53%",
    stock: 6,
    from: at(19, 30),
    to: at(21),
    allergens: ["Leche", "Trigo"],
    tags: ["Vegetariano"],
    days: [0, 1, 2, 3, 4, 5],
  },
  {
    category: "Café",
    photo: photos.espresso,
    name: "Cafetería Altura",
    pack: "Pack Sorpresa de cafetería",
    content: "Puede incluir un café y una empanada o un sánguche del día.",
    rating: "4.7",
    price: "S/ 7.90",
    oldPrice: "S/ 16.50",
    discount: "-52%",
    stock: 0,
    from: at(18),
    to: at(19, 30),
    allergens: ["Trigo", "Huevo"],
    tags: [],
    days: [0, 1, 2, 3, 4],
  },
  {
    category: "Menú",
    photo: photos.plate,
    name: "Restaurante Sabor Criollo",
    pack: "Pack Sorpresa criollo",
    content: "Puede incluir un plato de fondo del día con entrada o refresco.",
    rating: "4.8",
    price: "S/ 11.00",
    oldPrice: "S/ 22.00",
    discount: "-50%",
    stock: 4,
    from: at(15),
    to: at(16),
    allergens: ["Trigo"],
    tags: [],
    days: [0, 1, 2, 3, 4, 5],
  },
  {
    category: "Menú",
    photo: photos.bowl,
    name: "Verde Bowl",
    pack: "Pack Sorpresa saludable",
    content: "Puede incluir un bowl o una ensalada del día y una bebida.",
    rating: "4.7",
    price: "S/ 12.50",
    oldPrice: "S/ 26.00",
    discount: "-52%",
    stock: 5,
    from: at(16),
    to: at(17),
    allergens: ["Sin alérgenos"],
    tags: ["Saludable"],
    days: [0, 1, 2, 3, 4],
  },
  {
    category: "Menú",
    photo: photos.sandwich,
    name: "Sanguchería Don Lucho",
    pack: "Pack Sorpresa sanguchero",
    content: "Puede incluir sánguches del día y una bebida.",
    rating: "4.6",
    price: "S/ 9.50",
    oldPrice: "S/ 19.00",
    discount: "-50%",
    stock: 7,
    from: at(17),
    to: at(18),
    allergens: ["Trigo", "Huevo"],
    tags: [],
    days: [0, 1, 2, 3, 4, 5],
  },
];

type CatalogItem = {
  name: string;
  desc: string;
  photo: string;
  price: string;
  oldPrice: string;
  stock: number;
};

type Store = {
  name: string;
  address: string;
  distance: string;
  hours: string;
  x: number;
  y: number;
  items: CatalogItem[];
};

const categoryColor: Record<Category, string> = {
  Panadería: "#c2410c",
  Café: "#7c4a1e",
  Menú: "#15803d",
};

const stores: Store[] = [
  {
    name: "Panadería La Espiga",
    address: "Jr. Alonso de Molina 1120",
    distance: "250 m",
    hours: "7:00 a. m. – 9:30 p. m.",
    x: 22,
    y: 24,
    items: [
      {
        name: "Pan francés x10",
        desc: "Horneado esta tarde",
        photo:
          "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 2.50",
        oldPrice: "S/ 5.00",
        stock: 8,
      },
      {
        name: "Bolsa de pan dulce surtido",
        desc: "Panes y bollos del día",
        photo:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 7.90",
        oldPrice: "S/ 15.00",
        stock: 4,
      },
      {
        name: "Galletas con chispas x6",
        desc: "Horneadas hoy",
        photo:
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 6.00",
        oldPrice: "S/ 12.00",
        stock: 5,
      },
    ],
  },
  {
    name: "Boulangerie del Centro",
    address: "Av. Primavera 1450",
    distance: "600 m",
    hours: "7:30 a. m. – 8:00 p. m.",
    x: 72,
    y: 20,
    items: [
      {
        name: "Croissants de mantequilla x4",
        desc: "Hojaldre del día",
        photo:
          "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 8.00",
        oldPrice: "S/ 16.00",
        stock: 6,
      },
      {
        name: "Pan de masa madre",
        desc: "Hogaza de 800 g",
        photo:
          "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 9.50",
        oldPrice: "S/ 18.00",
        stock: 3,
      },
      {
        name: "Pan de centeno en tajadas",
        desc: "Integral, 600 g",
        photo:
          "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 6.50",
        oldPrice: "S/ 12.00",
        stock: 4,
      },
    ],
  },
  {
    name: "Pastelería Dulce Lima",
    address: "Jr. Monte Rosa 255",
    distance: "450 m",
    hours: "9:00 a. m. – 9:00 p. m.",
    x: 48,
    y: 33,
    items: [
      {
        name: "Tiramisú",
        desc: "Porción individual",
        photo:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 5.90",
        oldPrice: "S/ 11.00",
        stock: 5,
      },
      {
        name: "Torta de frambuesa",
        desc: "Tajada con frutos rojos",
        photo:
          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 4.90",
        oldPrice: "S/ 9.50",
        stock: 3,
      },
      {
        name: "Donas glaseadas x4",
        desc: "Con chocolate y grageas",
        photo:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 9.90",
        oldPrice: "S/ 20.00",
        stock: 2,
      },
    ],
  },
  {
    name: "Café Tostado",
    address: "Jr. Alonso de Molina 980",
    distance: "180 m",
    hours: "8:00 a. m. – 8:30 p. m.",
    x: 16,
    y: 45,
    items: [
      {
        name: "Americano + muffin",
        desc: "Muffin de arándanos",
        photo:
          "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 7.50",
        oldPrice: "S/ 15.00",
        stock: 6,
      },
      {
        name: "Cappuccino + brownie",
        desc: "Brownie del día",
        photo:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 8.90",
        oldPrice: "S/ 17.50",
        stock: 4,
      },
      {
        name: "Café en grano 250 g",
        desc: "Tueste medio, Cusco",
        photo:
          "https://images.unsplash.com/photo-1511920170033-f8396924c348?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 19.90",
        oldPrice: "S/ 32.00",
        stock: 3,
      },
    ],
  },
  {
    name: "Barista Molina",
    address: "Calle Los Pinos 310",
    distance: "350 m",
    hours: "7:00 a. m. – 9:00 p. m.",
    x: 78,
    y: 42,
    items: [
      {
        name: "Latte + alfajores",
        desc: "Dos alfajores de manjar",
        photo:
          "https://images.unsplash.com/photo-1572442388796-11668a67e53d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 8.50",
        oldPrice: "S/ 18.00",
        stock: 6,
      },
      {
        name: "Flat white",
        desc: "Doble shot de espresso",
        photo:
          "https://images.unsplash.com/photo-1534778101976-62847782c213?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 10.90",
        oldPrice: "S/ 21.00",
        stock: 3,
      },
      {
        name: "Iced latte 500 ml",
        desc: "Preparado esta mañana",
        photo:
          "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 6.90",
        oldPrice: "S/ 13.00",
        stock: 5,
      },
    ],
  },
  {
    name: "Cafetería Altura",
    address: "Av. Caminos del Inca 2010",
    distance: "800 m",
    hours: "7:30 a. m. – 7:30 p. m.",
    x: 42,
    y: 56,
    items: [
      {
        name: "Café americano",
        desc: "Grano de Cusco",
        photo:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 7.90",
        oldPrice: "S/ 16.50",
        stock: 3,
      },
      {
        name: "Frappé de chocolate",
        desc: "Con crema y salsa de chocolate",
        photo:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 9.50",
        oldPrice: "S/ 19.00",
        stock: 4,
      },
      {
        name: "Galletas de avena x6",
        desc: "Caseras",
        photo:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 4.50",
        oldPrice: "S/ 9.00",
        stock: 7,
      },
    ],
  },
  {
    name: "Restaurante Sabor Criollo",
    address: "Jr. Alonso de Molina 1305",
    distance: "300 m",
    hours: "12:00 p. m. – 4:00 p. m.",
    x: 74,
    y: 63,
    items: [
      {
        name: "Menú: entrada + lomo saltado",
        desc: "Incluye refresco",
        photo:
          "https://images.unsplash.com/photo-1600891964092-4316c288032e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 11.00",
        oldPrice: "S/ 22.00",
        stock: 4,
      },
      {
        name: "Pollo guisado con verduras",
        desc: "Con arroz blanco",
        photo:
          "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 9.00",
        oldPrice: "S/ 18.00",
        stock: 5,
      },
      {
        name: "Tallarines rojos",
        desc: "Con queso parmesano",
        photo:
          "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 8.50",
        oldPrice: "S/ 17.00",
        stock: 6,
      },
    ],
  },
  {
    name: "Verde Bowl",
    address: "Av. Velasco Astete 1620",
    distance: "700 m",
    hours: "11:00 a. m. – 5:00 p. m.",
    x: 20,
    y: 69,
    items: [
      {
        name: "Bowl saludable + refresco",
        desc: "Quinua, pollo y verduras",
        photo:
          "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 12.50",
        oldPrice: "S/ 26.00",
        stock: 5,
      },
      {
        name: "Ensalada fresca de la casa",
        desc: "Palta, garbanzos y verduras",
        photo:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 10.00",
        oldPrice: "S/ 20.00",
        stock: 3,
      },
      {
        name: "Wrap de pollo",
        desc: "Con verduras frescas",
        photo:
          "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 8.90",
        oldPrice: "S/ 17.50",
        stock: 4,
      },
    ],
  },
  {
    name: "Sanguchería Don Lucho",
    address: "Calle Monterrey 140",
    distance: "500 m",
    hours: "10:00 a. m. – 6:00 p. m.",
    x: 50,
    y: 79,
    items: [
      {
        name: "Sánguche de pollo + chicha",
        desc: "Chicha morada 500 ml",
        photo:
          "https://images.unsplash.com/photo-1709689156424-16fe0e05b47b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 9.50",
        oldPrice: "S/ 19.00",
        stock: 7,
      },
      {
        name: "Sánguche a la plancha",
        desc: "Jamón y queso",
        photo:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 7.50",
        oldPrice: "S/ 15.00",
        stock: 5,
      },
      {
        name: "Pollo broaster x2",
        desc: "Con papas fritas",
        photo:
          "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=300&h=300",
        price: "S/ 10.50",
        oldPrice: "S/ 21.00",
        stock: 3,
      },
    ],
  },
];

const offerFor = (name: string) => offers.find((o) => o.name === name)!;
const REVIEWS: Record<string, number> = {
  "Panadería La Espiga": 126,
  "Boulangerie del Centro": 88,
  "Pastelería Dulce Lima": 142,
  "Café Tostado": 97,
  "Barista Molina": 64,
  "Cafetería Altura": 51,
  "Restaurante Sabor Criollo": 113,
  "Verde Bowl": 72,
  "Sanguchería Don Lucho": 59,
};

/* ===================== Reglas de dominio =====================
   Toda la lógica de disponibilidad, horarios, estados, puntos y cupones vive
   aquí para que las pantallas muestren siempre la misma información. */

const MAX_QTY = 3;
const DELIVERY_FEE = 4.9;
const HOME_ADDRESS = "Jr. Alonso De Molina 1150, Lima";
const BUSINESS_STORE = "Panadería La Espiga";
const DEMO_EMAIL = "juan.a@gmail.com";

const money = (n: number) => `S/ ${n.toFixed(2)}`;
const toNum = (s: string) => parseFloat(s.replace(/[^\d.]/g, ""));
const capitalize = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
/** Cierra una frase con punto sin duplicarlo ("9:30 p. m." ya termina en punto). */
const sentence = (t: string) => (t.trim().endsWith(".") ? t.trim() : `${t.trim()}.`);

const minLabel = (m: number) => {
  const h = Math.floor(m / 60) % 24;
  const mm = String(m % 60).padStart(2, "0");
  return `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? "a. m." : "p. m."}`;
};
/** "8:00 – 9:30 p. m." (une el sufijo cuando ambas horas lo comparten). */
const windowLabel = (from: number, to: number) => {
  const a = minLabel(from);
  const b = minLabel(to);
  return a.slice(-5) === b.slice(-5) ? `${a.slice(0, -6)} – ${b}` : `${a} – ${b}`;
};

/* Reloj de la demo. Usa la hora real mientras los locales atienden (7:00 a. m.
   a 8:30 p. m.); fuera de ese horario arranca a las 4:30 p. m. para que la demo
   tenga packs disponibles. El panel demo permite moverlo. */
const realMin = () => new Date().getHours() * 60 + new Date().getMinutes();
const clock = { base: 0, at: 0, simulated: false };
const resetClock = () => {
  const r = realMin();
  const open = r >= at(7) && r <= at(20, 30);
  clock.base = open ? r : at(16, 30);
  clock.at = Date.now();
  clock.simulated = !open;
};
resetClock();
const setClock = (m: number) => {
  clock.base = Math.max(0, Math.min(at(23, 59), m));
  clock.at = Date.now();
  clock.simulated = true;
};
const nowMin = () => Math.min(at(23, 59), clock.base + Math.floor((Date.now() - clock.at) / 60000));

const pad2 = (n: number) => String(n).padStart(2, "0");
const dateKey = (offset = 0) => {
  const d = new Date(Date.now() + offset * 86400000);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};
const addDaysKey = (key: string, days: number) => {
  const [y, m, d] = key.split("-").map(Number);
  const t = new Date(y, m - 1, d + days);
  return `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())}`;
};
const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const keyLabel = (key: string) => {
  const [y, m, d] = key.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}${y !== new Date().getFullYear() ? ` ${y}` : ""}`;
};
const dayLabel = (key: string) =>
  key === dateKey(0) ? "Hoy" : key === dateKey(1) ? "Mañana" : keyLabel(key);
const todayIndex = () => (new Date().getDay() + 6) % 7;
const dayNumber = (offset: number) => new Date(Date.now() + offset * 86400000).getDate();
const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const SHORT_DAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
const daysShort = (days: number[]) => {
  const d = [...days].sort((a, b) => a - b);
  if (d.length === 7) return "todos los días";
  const run = d.every((x, i) => x === d[0] + i);
  return run && d.length >= 3
    ? `${SHORT_DAYS[d[0]]}–${SHORT_DAYS[d[d.length - 1]]}`
    : d.map((x) => SHORT_DAYS[x]).join(", ");
};
const daysPhrase = (days: number[]) => {
  const d = [...days].sort((a, b) => a - b);
  if (d.length === 7) return "todos los días";
  if (d.join() === "0,1,2,3,4") return "de lunes a viernes";
  if (d.join() === "5,6") return "los fines de semana";
  const names = d.map((x) => WEEKDAYS[x].toLowerCase());
  return (
    "cada " + (names.length > 1 ? names.slice(0, -1).join(", ") + " y " + names.at(-1) : names[0])
  );
};

type Slot = { from: number; to: number };
type Avail = "available" | "soldout" | "expired";
/** Disponibilidad real: sin stock = agotado; pasada la ventana = vencido. */
const availOf = (w: { to: number }, stock: number): Avail =>
  stock <= 0 ? "soldout" : nowMin() >= w.to ? "expired" : "available";
const timeBadge = (w: Slot, a: Avail) => {
  if (a === "soldout") return "Agotado";
  if (a === "expired") return "Vencido";
  const now = nowMin();
  if (now < w.from) return `Desde ${minLabel(w.from)}`;
  const left = w.to - now;
  if (left < 60) return `Cierra en ${left} min`;
  return `Cierra en ${Math.floor(left / 60)} h${left % 60 ? ` ${left % 60} min` : ""}`;
};
const PICKUP_MARGIN = 10;
const DELIVERY_MARGIN = 30;
/** Franjas de 30 min dentro de la ventana que todavía se pueden cumplir. */
const slotsFor = (w: Slot, mode: "pickup" | "delivery"): Slot[] => {
  const now = nowMin();
  const out: Slot[] = [];
  for (let s = w.from; s + 30 <= w.to; s += 30) {
    const ok = mode === "pickup" ? s + 30 > now + PICKUP_MARGIN : s >= now + DELIVERY_MARGIN;
    if (ok) out.push({ from: s, to: s + 30 });
  }
  if (mode === "pickup" && !out.length && now < w.to - PICKUP_MARGIN)
    out.push({ from: now, to: w.to });
  return out;
};
const slotLabel = (s: Slot) => windowLabel(s.from, s.to);

/* Direcciones y distancias simuladas: cada lugar tiene una posición en el mismo
   plano que el mapa, así las distancias cambian con la dirección activa. */
type SavedPlace = { name: string; address: string; x: number; y: number };
const initialPlaces: SavedPlace[] = [
  { name: "Casa", address: HOME_ADDRESS, x: 28, y: 50 },
  { name: "Oficina", address: "Av. Javier Prado Este 4200, Surco", x: 150, y: -40 },
  { name: "Gimnasio", address: "Av. Primavera 1050, Surco", x: 66, y: 14 },
  { name: "Casa de playa", address: "Av. Bolognesi 120, Punta Hermosa", x: 0, y: 900 },
];
const NO_COVERAGE = ["Punta Hermosa", "Punta Negra", "Asia", "Cieneguilla"];
const zoneOf = (address: string) =>
  NO_COVERAGE.find((z) => address.toLowerCase().includes(z.toLowerCase()));
const hasCoverage = (address: string) => !zoneOf(address);
const pointFor = (address: string) => {
  let h = 0;
  for (const ch of address) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return { x: 8 + (h % 84), y: 8 + ((h >>> 8) % 84) };
};
const distanceM = (store: string, p: { x: number; y: number }) => {
  const st = stores.find((x) => x.name === store);
  if (!st) return 9999;
  return Math.round(Math.hypot(st.x - p.x, st.y - p.y)) * 10;
};
const distLabel = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`);

/* Productos y stock */
type Product = {
  key: string;
  store: string;
  name: string;
  desc: string;
  photo: string;
  category: Category;
  price: number;
  oldPrice: number;
  from: number;
  to: number;
  address: string;
  rating: string;
  isPack: boolean;
  allergens: string[];
};
const packKey = (store: string) => `pack:${store}`;
const itemKey = (store: string, item: string) => `item:${store}:${item}`;

function productFromOffer(o: Offer): Product {
  const st = stores.find((x) => x.name === o.name);
  return {
    key: packKey(o.name),
    store: o.name,
    name: o.pack,
    desc: o.content,
    photo: o.photo,
    category: o.category,
    price: toNum(o.price),
    oldPrice: toNum(o.oldPrice),
    from: o.from,
    to: o.to,
    address: st?.address ?? "",
    rating: o.rating,
    isPack: true,
    allergens: o.allergens,
  };
}

function productFromItem(st: Store, it: CatalogItem): Product {
  const o = offerFor(st.name);
  return {
    key: itemKey(st.name, it.name),
    store: st.name,
    name: it.name,
    desc: it.desc,
    photo: it.photo,
    category: o.category,
    price: toNum(it.price),
    oldPrice: toNum(it.oldPrice),
    from: o.from,
    to: o.to,
    address: st.address,
    rating: o.rating,
    isPack: false,
    allergens: o.allergens,
  };
}

type PublishedOffer = {
  id: string;
  kind: "oferta" | "pack";
  name: string;
  desc: string;
  qty: number;
  price: number;
  oldPrice: number;
  from: number;
  to: number;
  photo: string;
  allergens: string[];
  category: Category;
};

function productFromPublished(p: PublishedOffer): Product {
  const st = stores.find((x) => x.name === BUSINESS_STORE);
  return {
    key: `pub:${p.id}`,
    store: BUSINESS_STORE,
    name: p.name,
    desc:
      p.desc ||
      (p.kind === "pack"
        ? "Contenido sorpresa armado por el local con productos de hoy."
        : "Producto del día con descuento."),
    photo: p.photo,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice,
    from: p.from,
    to: p.to,
    address: st?.address ?? "",
    rating: offerFor(BUSINESS_STORE).rating,
    isPack: p.kind === "pack",
    allergens: p.allergens,
  };
}

const initialStock = () => {
  const s: Record<string, number> = {};
  offers.forEach((o) => (s[packKey(o.name)] = o.stock));
  stores.forEach((st) => st.items.forEach((it) => (s[itemKey(st.name, it.name)] = it.stock)));
  return s;
};

/* Pedidos: estados tipados y transiciones permitidas por modalidad */
type DeliveryMode = "pickup" | "delivery";
type PayMethod = "yape" | "card" | "cash";
type OrderStatus =
  | "Confirmado"
  | "En preparación"
  | "Listo para recoger"
  | "En camino"
  | "Recogido"
  | "Entregado"
  | "No recogido"
  | "No disponible"
  | "Cancelado";
type StatusLabel = OrderStatus | "Programada" | "Saltada" | "Pausada" | "Activa" | "Sin confirmar";

type Order = {
  id: string;
  customer: string;
  customerName: string;
  product: Product;
  qty: number;
  mode: DeliveryMode;
  address: string;
  method: PayMethod;
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  day: string;
  slot: Slot;
  timeline: { status: OrderStatus; at: number }[];
  points: number;
  pointsAwarded?: boolean;
  spinsGranted?: number;
  reminded?: boolean;
  reviewed?: boolean;
  rating?: number;
  reviewTags?: string[];
  couponId?: string;
  freeShip?: boolean;
  subscriptionId?: string;
  note?: string;
};

const FLOW: Record<DeliveryMode, OrderStatus[]> = {
  pickup: ["Confirmado", "En preparación", "Listo para recoger", "Recogido"],
  delivery: ["Confirmado", "En preparación", "En camino", "Entregado"],
};
const FINAL: OrderStatus[] = ["Recogido", "Entregado", "No recogido", "No disponible", "Cancelado"];
const isActiveOrder = (o: Order) => !FINAL.includes(o.status);
const isCompleted = (o: Order) => o.status === "Recogido" || o.status === "Entregado";
const nextStatus = (o: Order): OrderStatus | null => {
  const f = FLOW[o.mode];
  const i = f.indexOf(o.status);
  return i >= 0 && i < f.length - 1 ? f[i + 1] : null;
};
/** Política de cancelación: sin costo mientras el local no empiece a prepararlo. */
const canCancel = (o: Order) => o.status === "Confirmado";
const canTransition = (o: Order, to: OrderStatus) => {
  if (!isActiveOrder(o)) return false;
  if (to === "Cancelado") return true;
  if (to === "No recogido") return o.mode === "pickup";
  return nextStatus(o) === to;
};

const methodLabel = (m: PayMethod, mode: DeliveryMode) =>
  m === "yape"
    ? "Yape / Plin"
    : m === "card"
      ? "Tarjeta ···· 4821"
      : mode === "pickup"
        ? "Efectivo al recoger"
        : "Efectivo contra entrega";

/* Niveles de fidelización: dependen solo de la actividad completada. */
type Level = { name: string; min: number; color: string; bg: string; perks: string[] };
const LEVELS: Level[] = [
  {
    name: "Bronce",
    min: 0,
    color: "#9a3412",
    bg: "#ffedd5",
    perks: [
      "5 puntos por cada S/ 1 en pedidos completados",
      "1 giro de ruleta por pedido completado",
    ],
  },
  {
    name: "Plata",
    min: 350,
    color: "#475569",
    bg: "#e2e8f0",
    perks: ["Cupón de S/ 3 al subir de nivel", "1 giro de ruleta por pedido completado"],
  },
  {
    name: "Oro",
    min: 1000,
    color: "#a16207",
    bg: "#fef3c7",
    perks: [
      "Cupón de S/ 5 al subir de nivel",
      "2 giros de ruleta por pedido completado",
      "1 envío gratis por semana",
    ],
  },
];
const LEVEL_COUPON: Record<string, number> = { Plata: 3, Oro: 5 };
const POINTS_PER_SOL = 5;
const REVIEW_POINTS = 10;
const AVG_ORDER_POINTS = 70;
const pointsFor = (subtotal: number) => Math.round(subtotal * POINTS_PER_SOL);
const levelIndex = (pts: number) => LEVELS.reduce((acc, l, i) => (pts >= l.min ? i : acc), 0);
const levelOf = (pts: number) => LEVELS[levelIndex(pts)];
const nextLevel = (pts: number) => LEVELS[levelIndex(pts) + 1] ?? null;
const levelProgress = (pts: number) => {
  const cur = levelOf(pts);
  const nx = nextLevel(pts);
  if (!nx) return 100;
  return Math.min(100, Math.round(((pts - cur.min) / (nx.min - cur.min)) * 100));
};
const ordersToNext = (pts: number) => {
  const nx = nextLevel(pts);
  return nx ? Math.max(1, Math.ceil((nx.min - pts) / AVG_ORDER_POINTS)) : 0;
};
const fmtPts = (n: number) => n.toLocaleString("en-US");
const spinsPerOrder = (pts: number) => (levelIndex(pts) >= 2 ? 2 : 1);

/** Libro de movimientos de puntos: el saldo es siempre la suma de esta lista. */
type PointsEntry = {
  id: string;
  label: string;
  detail: string;
  pts: number;
  date: string;
  orderId?: string;
  kind: "gana" | "revierte" | "bono";
};

/* Cupones (ruleta y premios de nivel) */
type CouponKind = "percent" | "fixed" | "shipping" | "points";
type Coupon = {
  id: string;
  label: string;
  name: string;
  kind: CouponKind;
  value: number;
  min: number;
  cap?: number;
  detail: string;
  used: boolean;
  expiresAt: number;
  source: "ruleta" | "nivel";
  orderId?: string;
};
const COUPON_DAYS = 7;
const WHEEL: Omit<Coupon, "id" | "used" | "expiresAt" | "source">[] = [
  {
    label: "5%",
    name: "5% de descuento",
    kind: "percent",
    value: 5,
    min: 15,
    cap: 3,
    detail: "Desde S/ 15 · ahorro máximo S/ 3",
  },
  {
    label: "10%",
    name: "10% de descuento",
    kind: "percent",
    value: 10,
    min: 25,
    cap: 5,
    detail: "Desde S/ 25 · ahorro máximo S/ 5",
  },
  {
    label: "S/ 3",
    name: "S/ 3 de descuento",
    kind: "fixed",
    value: 3,
    min: 20,
    detail: "En compras desde S/ 20",
  },
  {
    label: "Envío",
    name: "Envío gratis",
    kind: "shipping",
    value: DELIVERY_FEE,
    min: 15,
    detail: "Delivery desde S/ 15 · ahorras S/ 4.90",
  },
  {
    label: "+25",
    name: "25 puntos",
    kind: "points",
    value: 25,
    min: 0,
    detail: "Se suman a tu cuenta al instante",
  },
  {
    label: "+50",
    name: "50 puntos",
    kind: "points",
    value: 50,
    min: 0,
    detail: "Se suman a tu cuenta al instante",
  },
];
const PRIZE_WEIGHTS = [25, 10, 10, 15, 25, 15];
const pickPrize = () => {
  let r = Math.random() * PRIZE_WEIGHTS.reduce((a, b) => a + b, 0);
  for (let i = 0; i < PRIZE_WEIGHTS.length; i++) if ((r -= PRIZE_WEIGHTS[i]) < 0) return i;
  return 0;
};
const couponUsable = (c: Coupon) => !c.used && c.kind !== "points" && c.expiresAt > Date.now();
const couponDiscount = (c: Coupon | undefined, subtotal: number, fee: number) => {
  if (!c || subtotal < c.min) return 0;
  const v =
    c.kind === "percent"
      ? Math.min((subtotal * c.value) / 100, c.cap ?? Infinity)
      : c.kind === "fixed"
        ? Math.min(subtotal, c.value)
        : c.kind === "shipping"
          ? fee
          : 0;
  return Math.round(v * 100) / 100;
};
const bestCoupon = (list: Coupon[], subtotal: number, fee: number) =>
  list
    .map((c) => ({ c, off: couponDiscount(c, subtotal, fee) }))
    .filter((x) => x.off > 0)
    .sort((a, b) => b.off - a.off)[0]?.c;
const levelCoupon = (level: string, orderId?: string): Coupon => ({
  id: `lvl-${level}-${Date.now()}`,
  label: `S/ ${LEVEL_COUPON[level]}`,
  name: `Cupón nivel ${level}: S/ ${LEVEL_COUPON[level]}`,
  kind: "fixed",
  value: LEVEL_COUPON[level],
  min: 10,
  detail: `Premio por subir a ${level} · en compras desde S/ 10`,
  used: false,
  expiresAt: Date.now() + 30 * 86400000,
  source: "nivel",
  orderId,
});

/* Suscripción a un local: una sola entidad. "Mi semana" es solo la vista de
   las entregas que generan todas las suscripciones activas. */
type Duration = "1w" | "open" | "4w" | "3m" | "6m";
const DURATIONS: [Duration, string][] = [
  ["1w", "Semanal · 1 semana"],
  ["4w", "Mensual · 4 semanas · −10 %"],
];
const DURATION_WEEKS: Record<Duration, number> = { "1w": 1, open: 0, "4w": 4, "3m": 13, "6m": 26 };
type Subscription = {
  uid: string;
  store: string;
  days: number[];
  slot: number;
  mode: DeliveryMode;
  place: string;
  duration: Duration;
  start: string;
  paused: boolean;
  skipped: string[];
};
const subEnd = (s: Subscription) =>
  s.duration === "open" ? null : addDaysKey(s.start, DURATION_WEEKS[s.duration] * 7 - 1);
const subSlots = (o: Offer) => {
  const r: number[] = [];
  for (let s = o.from; s + 30 <= o.to; s += 30) r.push(s);
  return r;
};
const subDiscount = (s: Pick<Subscription, "store" | "duration">) =>
  s.duration === "4w" ? +(toNum(offerFor(s.store).price) * 0.1).toFixed(2) : 0;
const subPrice = (s: Pick<Subscription, "store" | "mode" | "duration">) =>
  +(toNum(offerFor(s.store).price) - subDiscount(s) + (s.mode === "delivery" ? DELIVERY_FEE : 0)).toFixed(2);
type Occurrence = { sub: Subscription; key: string; offset: number; day: number };
const upcoming = (subs: Subscription[], horizon = 7): Occurrence[] => {
  const out: Occurrence[] = [];
  for (let off = 0; off < horizon; off++) {
    const key = dateKey(off);
    const day = (todayIndex() + off) % 7;
    subs.forEach((s) => {
      const end = subEnd(s);
      if (!s.paused && s.days.includes(day) && key >= s.start && (!end || key <= end))
        out.push({ sub: s, key, offset: off, day });
    });
  }
  return out.sort((a, b) => a.offset - b.offset || a.sub.slot - b.sub.slot);
};

/* Avisos internos (bandeja de notificaciones) */
type NoticeKind = "pedidos" | "suscripciones" | "premios";
type Notice = {
  id: string;
  text: string;
  at: number;
  day: string;
  read: boolean;
  kind: NoticeKind;
  orderId?: string;
};
type NoticePrefs = Record<NoticeKind, boolean>;

type User = {
  nickname: string;
  first: string;
  last: string;
  dni: string;
  phone: string;
  email: string;
};
const demoUser: User = {
  nickname: "Juan",
  first: "Juan",
  last: "Aquino",
  dni: "",
  phone: "987654321",
  email: DEMO_EMAIL,
};
const guestUser: User = {
  nickname: "",
  first: "Invitado",
  last: "",
  dni: "",
  phone: "",
  email: "",
};
type Role = "client" | "business" | "guest";

/* Datos de demostración. El historial de puntos suma exactamente el saldo. */
const initialHistory: PointsEntry[] = [
  {
    id: "h6",
    label: "Reseña publicada",
    detail: "Panadería La Espiga · RICO-4630",
    pts: 10,
    date: "12 nov",
    orderId: "RICO-4630",
    kind: "gana",
  },
  {
    id: "h5",
    label: "Pedido RICO-4630",
    detail: "Pack Sorpresa panadero",
    pts: 65,
    date: "12 nov",
    orderId: "RICO-4630",
    kind: "gana",
  },
  {
    id: "h4",
    label: "Reseña publicada",
    detail: "Verde Bowl · RICO-4602",
    pts: 10,
    date: "10 nov",
    orderId: "RICO-4602",
    kind: "gana",
  },
  {
    id: "h3",
    label: "Pedido RICO-4602",
    detail: "Pack Sorpresa saludable",
    pts: 63,
    date: "10 nov",
    orderId: "RICO-4602",
    kind: "gana",
  },
  {
    id: "h2",
    label: "Pedido RICO-4571",
    detail: "Pack Sorpresa café y dulce",
    pts: 50,
    date: "6 nov",
    orderId: "RICO-4571",
    kind: "gana",
  },
  {
    id: "h1",
    label: "Puntos de pedidos anteriores",
    detail: "Septiembre y octubre · 11 pedidos completados",
    pts: 742,
    date: "31 oct",
    kind: "gana",
  },
];

function makeOrder(p: {
  id: string;
  customer: string;
  customerName: string;
  store: string;
  qty?: number;
  mode: DeliveryMode;
  address?: string;
  method: PayMethod;
  status: OrderStatus;
  day: string;
  slot: Slot;
  awarded?: boolean;
  rating?: number;
  note?: string;
}): Order {
  const product = productFromOffer(offerFor(p.store));
  const qty = p.qty ?? 1;
  const subtotal = +(product.price * qty).toFixed(2);
  const fee = p.mode === "delivery" ? DELIVERY_FEE : 0;
  const placedAt = p.day === dateKey(0) ? Math.max(0, nowMin() - 40) : p.slot.from - 120;
  return {
    id: p.id,
    customer: p.customer,
    customerName: p.customerName,
    product,
    qty,
    mode: p.mode,
    address: p.address ?? "",
    method: p.method,
    subtotal,
    fee,
    discount: 0,
    total: +(subtotal + fee).toFixed(2),
    status: p.status,
    day: p.day,
    slot: p.slot,
    timeline: [
      { status: "Confirmado", at: placedAt },
      ...(p.status !== "Confirmado" ? [{ status: p.status, at: p.slot.from + 10 }] : []),
    ],
    points: pointsFor(subtotal),
    pointsAwarded: p.awarded,
    spinsGranted: p.awarded ? 1 : 0,
    reviewed: p.rating !== undefined,
    rating: p.rating,
    note: p.note,
  };
}

const initialOrders = (): Order[] => {
  const today = dateKey(0);
  const val = { customer: DEMO_EMAIL, customerName: "Juan A." };
  return [
    makeOrder({
      ...val,
      id: "RICO-4810",
      store: "Panadería La Espiga",
      mode: "pickup",
      method: "yape",
      status: "Confirmado",
      day: today,
      slot: { from: at(20), to: at(20, 30) },
    }),
    makeOrder({
      ...val,
      id: "RICO-4805",
      store: "Café Tostado",
      mode: "delivery",
      address: HOME_ADDRESS,
      method: "card",
      status: "Confirmado",
      day: today,
      slot: { from: at(19, 30), to: at(20) },
    }),
    makeOrder({
      customer: "jose.mendoza@gmail.com",
      customerName: "José M.",
      id: "RICO-4819",
      store: "Panadería La Espiga",
      mode: "pickup",
      method: "cash",
      status: "Confirmado",
      day: today,
      slot: { from: at(20, 30), to: at(21) },
    }),
    makeOrder({
      customer: "lucia.campos@gmail.com",
      customerName: "Lucía C.",
      id: "RICO-4812",
      store: "Panadería La Espiga",
      qty: 2,
      mode: "pickup",
      method: "yape",
      status: "Confirmado",
      day: today,
      slot: { from: at(21), to: at(21, 30) },
    }),
    makeOrder({
      ...val,
      id: "RICO-4630",
      store: "Panadería La Espiga",
      mode: "pickup",
      method: "yape",
      status: "Recogido",
      day: "2026-11-12",
      slot: { from: at(20, 30), to: at(21) },
      awarded: true,
      rating: 5,
    }),
    makeOrder({
      ...val,
      id: "RICO-4602",
      store: "Verde Bowl",
      mode: "pickup",
      method: "card",
      status: "Recogido",
      day: "2026-11-10",
      slot: { from: at(16), to: at(16, 30) },
      awarded: true,
      rating: 4,
    }),
    makeOrder({
      ...val,
      id: "RICO-4588",
      store: "Café Tostado",
      mode: "pickup",
      method: "card",
      status: "Cancelado",
      day: "2026-11-08",
      slot: { from: at(19), to: at(19, 30) },
      note: "Cancelaste el pedido antes de que el local empezara a prepararlo.",
    }),
    makeOrder({
      ...val,
      id: "RICO-4571",
      store: "Café Tostado",
      mode: "delivery",
      address: HOME_ADDRESS,
      method: "card",
      status: "Entregado",
      day: "2026-11-06",
      slot: { from: at(19, 30), to: at(20) },
      awarded: true,
    }),
  ];
};

type ClientProfile = {
  user: User;
  history: PointsEntry[];
  coupons: Coupon[];
  spins: number;
  rewardedLevels: string[];
  favorites: string[];
  places: SavedPlace[];
  activePlace: string;
  subs: Subscription[];
  notices: Notice[];
  lastPrefs: { mode: DeliveryMode; method: PayMethod };
};
const demoProfile = (): ClientProfile => ({
  user: demoUser,
  history: initialHistory,
  coupons: [],
  spins: 1,
  rewardedLevels: ["Plata"],
  favorites: ["Panadería La Espiga"],
  places: initialPlaces,
  activePlace: "Casa",
  subs: [],
  notices: [],
  lastPrefs: { mode: "pickup", method: "yape" },
});
const freshProfile = (u: User): ClientProfile => ({
  user: u,
  history: [],
  coupons: [],
  spins: 1,
  rewardedLevels: [],
  favorites: [],
  places: [{ name: "Ubicación actual", address: HOME_ADDRESS, x: 28, y: 50 }],
  activePlace: "Ubicación actual",
  subs: [],
  notices: [],
  lastPrefs: { mode: "pickup", method: "yape" },
});

type PacksPreset = { focus?: boolean; near?: boolean };
type LegalDoc = "terms" | "privacy" | "claims";
const DEADLINES = Array.from({ length: 29 }, (_, i) => at(8) + i * 30);
const ALLERGENS = ["Trigo", "Leche", "Huevo", "Frutos secos", "Sin alérgenos"];
const PHOTO_OPTIONS = [photos.bread, photos.croissant, photos.cake];
const parseMoney = (v: string) => Number(v.replace(",", ".").replace(/[^\d.]/g, ""));
type BenefitsTab = "nivel" | "cupones";
type AppToast = { id: number; text: string; undo?: () => void };

const HELP_TOPICS: { id: string; q: string; a: string }[] = [
  {
    id: "pack",
    q: "¿Qué es un Pack Sorpresa?",
    a: "Es una bolsa con comida rica del día de un local de tu zona, a menos de la mitad de precio. Sabes el tipo de comida, lo que puede incluir y su valor aproximado, pero el contenido exacto es sorpresa. Así ahorras en cada pedido.",
  },
  {
    id: "pickup",
    q: "¿Cómo y cuándo recojo mi pedido?",
    a: "Cada pack tiene una ventana de recojo (por ejemplo, de 8:00 a 9:30 p. m.). Al pagar eliges una franja de 30 minutos y te avisamos cuando el local lo tenga listo. Muestra tu código o QR en el local: lo guardamos hasta el final de la ventana.",
  },
  {
    id: "delivery",
    q: "¿Cómo funciona el delivery?",
    a: "El propio local lleva tu pedido dentro de la ventana del pack, en la franja que elijas al pagar. Cuesta S/ 4.90 y en nivel Oro tienes 1 envío gratis por semana. Solo está disponible en zonas con cobertura. Por ahora no mostramos al repartidor en tiempo real: te avisamos cuando el local despacha tu pedido.",
  },
  {
    id: "cancel",
    q: "¿Puedo cancelar un pedido?",
    a: "Sí, sin costo mientras tu pedido esté «Confirmado», antes de que el local empiece a prepararlo. Si pagaste con Yape o tarjeta, el reembolso tarda hasta 5 días y tu cupón vuelve a tu cuenta. Si no recoges el pedido antes del final de la ventana, pasa a «No recogido» y no hay reembolso, porque el local ya lo preparó.",
  },
  {
    id: "levels",
    q: "¿Cómo funcionan los puntos y niveles?",
    a: "Ganas 5 puntos por cada S/ 1 de productos y 10 por cada reseña, siempre cuando el pedido se completa (recogido o entregado). Con tus puntos subes de Bronce a Plata (350 pts, unos 5 pedidos) y a Oro (1 000 pts, unos 15 pedidos). Al subir recibes un cupón. El nivel es gratis: no se paga ni vence.",
  },
  {
    id: "subscription",
    q: "¿Cómo funcionan las suscripciones?",
    a: "Puedes suscribirte a cualquier local sin compras previas, con un plan semanal (1 semana) o mensual (4 semanas, 10 % de descuento en packs, sin descontar el envío): eliges los días (solo los que el local ofrece), una franja dentro de su ventana, recojo o delivery y una duración. Cada entrega se cobra recién cuando el local confirma tu pack ese día; si no hubo pack, no se cobra y te avisamos. Puedes saltar una entrega, pausar o cancelar cuando quieras.",
  },
  {
    id: "roulette",
    q: "¿Cómo funciona la ruleta?",
    a: "Cada pedido completado te da 1 giro (2 en nivel Oro), y tu cuenta incluye 1 giro de bienvenida. Puedes ganar descuentos, envío gratis o puntos. Los cupones vencen en 7 días y puedes usar uno por pedido.",
  },
  {
    id: "allergens",
    q: "¿Cómo sé si un pack tiene alérgenos?",
    a: "Cada pack muestra los alérgenos que declara el local. Como el contenido es sorpresa, si tienes una alergia severa consulta al local antes de recoger.",
  },
  {
    id: "payment",
    q: "¿Qué hago si mi pago es rechazado?",
    a: "No se realiza ningún cobro y el pedido no se crea. Revisa los datos o elige otro método, como Yape / Plin o efectivo.",
  },
];

type Shop = {
  role: Role | null;
  user: User;
  setUser: (u: User) => void;
  isDemoUser: boolean;
  login: (r: "client" | "business") => void;
  enterGuest: () => void;
  signup: (u: User) => void;
  logout: () => void;
  requireAccount: () => void;
  goBack: () => void;
  lastTab: Screen;
  product: Product;
  openProduct: (p: Product) => void;
  returnTo: Screen;
  qty: number;
  setQty: (n: number) => void;
  stockOf: (key: string) => number;
  orders: Order[];
  myOrders: Order[];
  lastOrderId: string | null;
  placeOrder: (d: {
    mode: DeliveryMode;
    address: string;
    method: PayMethod;
    slot: Slot;
    subtotal: number;
    fee: number;
    discount: number;
    total: number;
    couponId?: string;
    freeShip?: boolean;
  }) => { ok: true; order: Order } | { ok: false; reason: string };
  setOrderStatus: (
    id: string,
    status: OrderStatus,
    opts?: { note?: string; by?: "cliente" | "local" | "sistema" },
  ) => void;
  undoCompletion: (id: string, prev: OrderStatus) => void;
  orderId: string | null;
  openOrder: (id: string) => void;
  completedWith: (store: string) => boolean;
  points: number;
  history: PointsEntry[];
  levelUp: Level | null;
  clearLevelUp: () => void;
  reviewId: string | null;
  startReview: (id: string) => void;
  submitReview: (id: string, rating: number, tags: string[]) => void;
  places: SavedPlace[];
  activePlace: string;
  activeAddress: string;
  activePoint: { x: number; y: number };
  setActivePlace: (name: string) => void;
  addPlace: (p: SavedPlace) => void;
  distanceTo: (store: string) => number;
  favorites: string[];
  toggleFavorite: (store: string) => void;
  subs: Subscription[];
  saveSub: (s: Subscription) => void;
  removeSub: (uid: string) => void;
  toggleSkip: (uid: string, key: string) => void;
  setPaused: (uid: string, paused: boolean) => void;
  subDraft: string | null;
  openSubFor: (store: string) => void;
  clearSubDraft: () => void;
  confirmSubDelivery: (oc: Occurrence) => void;
  noPackSubDelivery: (oc: Occurrence) => void;
  spins: number;
  addDemoSpin: () => void;
  coupons: Coupon[];
  selectedCouponId: string;
  selectCoupon: (id: string) => void;
  spin: (index: number) => Coupon;
  freeShipAvailable: boolean;
  lastPrefs: { mode: DeliveryMode; method: PayMethod };
  notices: Notice[];
  markNoticesRead: () => void;
  noticePrefs: NoticePrefs;
  setNoticePrefs: (p: NoticePrefs) => void;
  packsPreset: PacksPreset;
  openAllPacks: (preset: PacksPreset) => void;
  notify: (text: string, undo?: () => void) => void;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  helpTopic: string;
  openHelp: (topic?: string) => void;
  legalDoc: LegalDoc;
  claimOrderId: string;
  openLegal: (doc: LegalDoc, orderId?: string) => void;
  benefitsTab: BenefitsTab;
  openBenefits: (tab: BenefitsTab) => void;
  published: PublishedOffer[];
  publishOffer: (o: PublishedOffer) => void;
  removePublished: (id: string) => void;
  failNextPayment: boolean;
  setFailNextPayment: (v: boolean) => void;
  consumeFailure: () => boolean;
  moveClock: (m: number | null) => void;
  resetDemo: () => void;
};

const ShopContext = createContext<Shop | null>(null);
const useShop = () => useContext(ShopContext)!;

const heuristics: Record<Screen, string> = {
  login: "H1 · H3 · H5 · H9",
  home: "H1 · H2 · H6 · H7 · H8",
  "all-packs": "H3 · H6 · H7 · H8",
  "empty-home": "H8 · H9",
  map: "H2 · H4 · H6",
  planner: "H1 · H3 · H5 · H6 · H7",
  locations: "H3 · H5 · H6",
  roulette: "H1 · H2 · H8",
  favorites: "H6 · H7",
  order: "H1 · H3 · H6 · H9",
  notifications: "H1 · H3 · H10",
  store: "H2 · H4 · H6 · H8",
  "map-denied": "H3 · H6 · H9",
  detail: "H1 · H2 · H5 · H6 · H10",
  soldout: "H1 · H5 · H9",
  expired: "H1 · H5 · H9",
  payment: "H1 · H5 · H6 · H10",
  "payment-error": "H3 · H9",
  confirmation: "H1 · H2 · H4",
  orders: "H1 · H4 · H6 · H7",
  "orders-empty": "H8 · H9",
  review: "H2 · H6",
  profile: "H1 · H3 · H10",
  "edit-profile": "H3 · H5 · H9",
  levels: "H1 · H2 · H6 · H10",
  help: "H10 · H2 · H6",
  legal: "H5 · H9 · H10",
  forgot: "H3 · H9",
  signup: "H5 · H9 · H10",
  "business-profile": "H3 · H4",
  dashboard: "H1 · H4 · H7 · H8",
  publish: "H5 · H6 · H7 · H10",
  "publish-errors": "H5 · H9",
  pack: "H2 · H5 · H6",
  "business-orders": "H1 · H2 · H4 · H7",
};

const screenNames: Record<Screen, string> = {
  login: "Iniciar sesión",
  home: "Inicio cliente",
  "all-packs": "Todos los Packs",
  "empty-home": "Inicio sin cobertura",
  map: "Mapa",
  planner: "Suscripciones",
  locations: "Mis direcciones",
  roulette: "Ruleta de premios",
  favorites: "Favoritos",
  order: "Detalle de pedido",
  notifications: "Notificaciones",
  store: "Catálogo de tienda",
  "map-denied": "Mapa sin permiso",
  detail: "Detalle de Pack",
  soldout: "Oferta agotada",
  expired: "Oferta vencida",
  payment: "Pago",
  "payment-error": "Pago rechazado",
  confirmation: "Confirmación",
  orders: "Mis pedidos",
  "orders-empty": "Pedidos vacíos",
  review: "Reseña",
  profile: "Perfil y nivel",
  "edit-profile": "Editar perfil",
  levels: "Mis beneficios",
  help: "Ayuda y preguntas frecuentes",
  legal: "Términos, privacidad y reclamos",
  forgot: "Recuperar contraseña",
  signup: "Crear cuenta",
  "business-profile": "Perfil del negocio",
  dashboard: "Panel negocio",
  publish: "Publicar oferta",
  "publish-errors": "Formulario con errores",
  pack: "Crear Pack Sorpresa",
  "business-orders": "Pedidos recibidos",
};

function Icon({ name, size = 21 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9M9 20v-6h6v6" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    bag: (
      <>
        <path d="M5 8h14l-1 13H6z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    back: (
      <>
        <path d="m15 18-6-6 6-6" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    alert: (
      <>
        <path d="M12 4 3 20h18z" />
        <path d="M12 9v5M12 17h.01" />
      </>
    ),
    store: (
      <>
        <path d="M4 10v11h16V10M3 10l2-6h14l2 6" />
        <path d="M8 21v-6h8v6" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20V7" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4-.8L19 8l-3-3L4.8 16z" />
        <path d="m14 7 3 3" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.8 9a2.5 2.5 0 1 1 3.6 2.3c-1 .5-1.4 1-1.4 2.2M12 17h.01" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
    heart: (
      <path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z" />
    ),
    gift: (
      <>
        <rect x="3" y="9" width="18" height="4" rx="1" />
        <path d="M5 13v8h14v-8M12 9v12M12 9S10.5 4 8 5s0 4 4 4c4 0 6.5-3 4-4s-4 4-4 4" />
      </>
    ),
    undo: <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />,
    trophy: (
      <>
        <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
        <path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 20h8M10 17h4" />
      </>
    ),
    leaf: (
      <>
        <path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" />
        <path d="M5 19 13 11" />
      </>
    ),
    bell: (
      <>
        <path d="M6 9a6 6 0 0 1 12 0c0 6 2 8 2 8H4s2-2 2-8" />
        <path d="M10 21h4" />
      </>
    ),
    ticket: (
      <>
        <path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" />
        <path d="M14 8v2M14 14v2" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M14.5 9.5a3.2 3.2 0 1 0 0 5" />
      </>
    ),
    crown: <path d="m3 8 4.5 4L12 6l4.5 6L21 8l-2 11H5z" />,
    card: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </>
    ),
    receipt: (
      <>
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
        <path d="M9 8h6M9 12h6" />
      </>
    ),
    headset: (
      <>
        <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
      </>
    ),
    book: (
      <>
        <path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z" />
        <path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5" />
        <path d="m15 8 4 4-4 4M19 12H9" />
      </>
    ),
    bike: (
      <>
        <circle cx="6" cy="17" r="3" />
        <circle cx="18" cy="17" r="3" />
        <path d="m6 17 4-8h5l3 8M9 9h3" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
    x: <path d="M7 7l10 10M17 7 7 17" />,
    camera: (
      <>
        <path d="M4 8h4l1.5-2h5L16 8h4v11H4z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name] || paths.info}
    </svg>
  );
}

function Header({
  title,
  onBack,
  action,
}: {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
}) {
  return (
    <header className="header">
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="Atrás">
          <Icon name="back" />
        </button>
      ) : (
        <div className="brand-small">
          <img src={mascotUrl} alt="ComeRICO" />
        </div>
      )}
      <h1>{title}</h1>
      <div className="header-action">{action}</div>
    </header>
  );
}

const CLIENT_TABS: [Screen, string, string][] = [
  ["home", "home", "Inicio"],
  ["orders", "bag", "Pedidos"],
  ["planner", "calendar", "Suscripciones"],
  ["profile", "user", "Perfil"],
];
const BUSINESS_TABS: [Screen, string, string][] = [
  ["dashboard", "chart", "Panel"],
  ["publish", "plus", "Publicar"],
  ["business-orders", "bag", "Pedidos"],
  ["business-profile", "store", "Mi negocio"],
];
const TAB_SCREENS: Screen[] = [...CLIENT_TABS, ...BUSINESS_TABS].map(([s]) => s);

/** Barra inferior. Sin `active`, marca la última pestaña desde la que se llegó. */
function BottomNav({
  business,
  active,
  go,
}: {
  business?: boolean;
  active?: string;
  go: (s: Screen) => void;
}) {
  const { role, lastTab, myOrders } = useShop();
  const biz = business ?? role === "business";
  const items = biz ? BUSINESS_TABS : CLIENT_TABS;
  const current = active ?? lastTab;
  const activeCount = myOrders.filter(isActiveOrder).length;
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map(([route, icon, label]) => (
        <button
          key={route}
          className={current === route ? "active" : ""}
          aria-current={current === route ? "page" : undefined}
          onClick={() => go(route)}
        >
          <Icon name={icon} size={20} />
          <span>{label}</span>
          {route === "orders" && activeCount > 0 && (
            <b className="nav-badge" aria-label={`${activeCount} pedidos activos`}>
              {activeCount}
            </b>
          )}
        </button>
      ))}
    </nav>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <div className="stepper">
      {["Detalle", "Pago", "Confirmación"].map((s, i) => (
        <div key={s} className={i <= current ? "done" : ""}>
          <span>{i < current ? "✓" : i + 1}</span>
          <small>{s}</small>
        </div>
      ))}
    </div>
  );
}

function LevelBadge({ level, small }: { level: Level; small?: boolean }) {
  return (
    <span
      className={`lvl-badge ${small ? "small" : ""}`}
      style={{ background: level.bg, color: level.color }}
    >
      <Icon name="star" size={small ? 12 : 15} />
      {level.name.toUpperCase()}
    </span>
  );
}

function LevelBar({ pts, extra = 0 }: { pts: number; extra?: number }) {
  const cur = levelOf(pts);
  const nx = nextLevel(pts);
  const base = levelProgress(pts);
  const after = levelProgress(pts + extra);
  const sameLevel = levelOf(pts + extra).name === cur.name;
  return (
    <div className="lvl-bar">
      <div className="progress">
        <i style={{ width: `${base}%`, background: cur.color }} />
        {extra > 0 && (
          <i
            className="gain"
            style={{
              left: `${base}%`,
              width: `${(sameLevel ? after : 100) - base}%`,
              background: cur.color,
            }}
          />
        )}
      </div>
      <div className="progress-label">
        <span>{cur.name}</span>
        <b>
          {nx
            ? extra > 0 && pts + extra >= nx.min
              ? `¡Llegas a ${nx.name}!`
              : `${fmtPts(nx.min - pts - extra)} pts para ${nx.name}`
            : "Nivel máximo"}
        </b>
        <span>{nx ? nx.name : "★"}</span>
      </div>
    </div>
  );
}

/** Diálogo accesible: role="dialog", foco inicial, Tab contenido y Escape para cerrar. */
function Modal({
  children,
  label,
  onClose,
  className = "",
  backdropClass = "",
}: {
  children: ReactNode;
  label: string;
  onClose?: () => void;
  className?: string;
  backdropClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const before = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
    (focusables()[0] ?? el).focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeRef.current) {
        e.stopPropagation();
        closeRef.current();
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("keydown", onKey);
      before?.focus?.();
    };
  }, []);
  return (
    <div className={`modal-backdrop ${backdropClass}`} onClick={() => closeRef.current?.()}>
      <div
        ref={ref}
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function SwitchRow({
  icon,
  label,
  hint,
  on,
  onToggle,
}: {
  icon: string;
  label: string;
  hint?: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button role="switch" aria-checked={on} onClick={onToggle}>
      <Icon name={icon} />
      <span>
        <b className="row-label">{label}</b>
        {hint && <small>{hint}</small>}
      </span>
      <i className={`switch ${on ? "on" : ""}`} aria-hidden />
    </button>
  );
}

function UserAvatar({ big }: { big?: boolean }) {
  const { user, isDemoUser, role } = useShop();
  const initials = `${user.first.charAt(0)}${user.last.charAt(0)}`.toUpperCase();
  if (isDemoUser)
    return (
      <div className={`avatar ${big ? "big" : ""} photo`}>
        <img src={profilePhoto} alt={`${user.first} ${user.last}`} />
      </div>
    );
  return (
    <div className={`avatar ${big ? "big" : ""}`} aria-label={user.first}>
      {role === "guest" || !initials.trim() ? <Icon name="user" /> : initials}
    </div>
  );
}

function OfferCard({
  offer,
  onClick,
  compact,
  eyebrow,
  hideFav,
  preview,
}: {
  offer: Offer;
  onClick?: () => void;
  compact?: boolean;
  eyebrow?: string;
  hideFav?: boolean;
  preview?: boolean;
}) {
  const { favorites, toggleFavorite, stockOf, distanceTo } = useShop();
  const left = preview ? offer.stock : stockOf(packKey(offer.name));
  const av: Avail = preview ? "available" : availOf(offer, left);
  const fav = favorites.includes(offer.name);
  const label = eyebrow ?? `PACK SORPRESA · ${offer.category.toUpperCase()}`;
  const badge = timeBadge(offer, av);
  return (
    <div className={`offer-wrap ${compact ? "compact" : ""}`}>
      <button
        className={`offer-card ${compact ? "compact" : ""} ${av !== "available" ? "sold-out" : ""}`}
        onClick={onClick}
      >
        <div className="offer-photo">
          <img
            src={offer.photo}
            alt={offer.pack}
            onError={(e) => {
              if (e.currentTarget.src !== photos.bread) e.currentTarget.src = photos.bread;
            }}
          />
          <span className="discount">{offer.discount}</span>
          {av !== "available" && <span className="sold-badge">{badge}</span>}
          {av === "available" && (
            <span className="countdown">
              <Icon name="clock" size={13} /> {badge}
            </span>
          )}
        </div>
        <div className="offer-body">
          <div className="eyebrow">{label}</div>
          <h3>{offer.pack}</h3>
          <div className="merchant">
            {offer.name}{" "}
            <span>
              ★ {offer.rating}
              {!preview && ` · ${distLabel(distanceTo(offer.name))}`}
            </span>
          </div>
          <div className="price-row">
            <strong>{offer.price}</strong>
            <del>{offer.oldPrice}</del>
            <span className="stock">{av === "available" ? `Quedan ${left}` : badge}</span>
          </div>
          <div className="pickup">
            <Icon name="clock" size={15} /> Hoy {windowLabel(offer.from, offer.to)}
            {compact && av === "available" && <small> · {badge}</small>}
          </div>
        </div>
      </button>
      {!hideFav && (
        <button
          className={`fav-btn ${fav ? "on" : ""}`}
          aria-label={
            fav ? `Quitar ${offer.name} de favoritos` : `Guardar ${offer.name} en favoritos`
          }
          aria-pressed={fav}
          onClick={() => toggleFavorite(offer.name)}
        >
          <Icon name="heart" size={17} />
        </button>
      )}
    </div>
  );
}

type DemoRole = "client" | "business";

const demoUsers: Record<
  DemoRole,
  { email: string; password: string; name: string; label: string }
> = {
  client: {
    email: DEMO_EMAIL,
    password: "comerico2025",
    name: "Juan A.",
    label: "Cliente",
  },
  business: {
    email: "ventas@laespiga.pe",
    password: "laespiga2025",
    name: "Panadería La Espiga",
    label: "Negocio",
  },
};

function Login({ go }: { go: (s: Screen) => void }) {
  const { login, enterGuest } = useShop();
  const [demoRole, setDemoRole] = useState<DemoRole>("client");
  const [email, setEmail] = useState(demoUsers.client.email);
  const [password, setPassword] = useState(demoUsers.client.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const switchUser = () => {
    const next: DemoRole = demoRole === "client" ? "business" : "client";
    setDemoRole(next);
    setEmail(demoUsers[next].email);
    setPassword(demoUsers[next].password);
    setError("");
  };

  const submit = () => {
    const match = (Object.keys(demoUsers) as DemoRole[]).find(
      (r) =>
        demoUsers[r].email.toLowerCase() === email.trim().toLowerCase() &&
        demoUsers[r].password === password,
    );
    if (!match) {
      setError("Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.");
      return;
    }
    login(match);
  };

  const other: DemoRole = demoRole === "client" ? "business" : "client";

  return (
    <div className="screen login-screen login-main">
      <div className="login-brand">
        <img className="login-logo" src={logoUrl} alt="ComeRICO" />
        <h1>Qué bueno verte</h1>
        <p>Comida rica de tu barrio a mitad de precio.</p>
      </div>
      <div className="login-form">
        <label className="field">
          <span>Correo electrónico</span>
          <div className="email-field">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
              placeholder="nombre@correo.com"
            />
            <button
              type="button"
              className="demo-swap"
              aria-label={`Cambiar a la cuenta demo de ${demoUsers[other].label}`}
              title={`Cuenta demo: cambiar a ${demoUsers[other].label}`}
              onClick={switchUser}
            >
              <Icon name={other === "business" ? "store" : "user"} size={13} />
            </button>
          </div>
        </label>
        <label className="field">
          <span>Contraseña</span>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Tu contraseña"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </label>
        <button className="forgot-link" onClick={() => go("forgot")}>
          ¿Olvidaste tu contraseña?
        </button>
        {error && (
          <div className="login-error" role="alert">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        )}
        <button className="btn primary" onClick={submit}>
          Iniciar sesión
        </button>
      </div>
      <p className="signup-copy">
        ¿Aún no tienes cuenta? <button onClick={() => go("signup")}>Crear cuenta</button>
      </p>
      <button className="guest-link" onClick={enterGuest}>
        o explora sin cuenta
      </button>
    </div>
  );
}

/** Ordena: primero lo disponible y luego por cercanía a la dirección activa. */
function useSortedOffers() {
  const { stockOf, distanceTo } = useShop();
  const avail = (o: Offer) => availOf(o, stockOf(packKey(o.name)));
  const sorted = [...offers].sort(
    (a, b) =>
      Number(avail(a) !== "available") - Number(avail(b) !== "available") ||
      distanceTo(a.name) - distanceTo(b.name),
  );
  return { sorted, avail };
}

function Home({ go }: { go: (s: Screen) => void }) {
  const {
    openProduct,
    points,
    activePlace,
    activeAddress,
    spins,
    openAllPacks,
    openBenefits,
    myOrders,
    favorites,
    notices,
    role,
  } = useShop();
  const { sorted, avail } = useSortedOffers();
  const completed = myOrders.filter(isCompleted).length;
  const showLoyalty = role !== "guest" && completed > 0;
  const unread = notices.filter((n) => !n.read).length;
  const usual = [
    ...new Set([...myOrders.filter(isCompleted).map((o) => o.product.store), ...favorites]),
  ]
    .filter((n) => offers.some((o) => o.name === n))
    .slice(0, 6);
  const lvl = levelOf(points);
  const nx = nextLevel(points);
  const [filter, setFilter] = useState<"Todos" | Category>("Todos");
  const featured = offers
    .filter((o) => avail(o) === "available")
    .sort((a, b) => toNum(b.discount) - toNum(a.discount))
    .slice(0, 3);
  const sectionLabel: Record<Category, string> = {
    Panadería: "Panaderías y pastelerías",
    Café: "Cafeterías",
    Menú: "Menús del día",
  };
  const head = (
    <div className="home-head">
      <button className="place-switch" onClick={() => go("locations")}>
        <small>
          <Icon name="pin" size={13} /> {activePlace}
        </small>
        <h1>
          {activeAddress.split(",")[0]} <Icon name="chevron" size={14} />
        </h1>
      </button>
      <div className="head-actions">
        <button
          className="bell-btn"
          aria-label={unread ? `Notificaciones, ${unread} sin leer` : "Notificaciones"}
          onClick={() => go("notifications")}
        >
          <Icon name="bell" size={19} />
          {unread > 0 && <b className="nav-badge">{unread}</b>}
        </button>
        <button
          className="avatar-btn"
          aria-label="Mi perfil"
          style={
            showLoyalty ? { boxShadow: `0 0 0 3px #fafaf8, 0 0 0 5px ${lvl.color}` } : undefined
          }
          onClick={() => go("profile")}
        >
          <UserAvatar />
        </button>
      </div>
    </div>
  );

  if (!hasCoverage(activeAddress))
    return (
      <div className="screen with-nav">
        {head}
        <EmptyHome go={go} embedded />
        <BottomNav active="home" go={go} />
      </div>
    );
  const list = filter === "Todos" ? sorted : sorted.filter((o) => o.category === filter);
  return (
    <div className="screen with-nav">
      {head}
      {showLoyalty && (
        <div className="level-strip">
          <button className="level-main" onClick={() => openBenefits("nivel")}>
            <LevelBadge level={lvl} small />
            <span className="mini-bar">
              <i style={{ width: `${levelProgress(points)}%`, background: lvl.color }} />
            </span>
            <small>
              {nx ? `${fmtPts(nx.min - points)} pts para ${nx.name}` : `${fmtPts(points)} pts`}
            </small>
            <Icon name="chevron" size={15} />
          </button>
          {spins > 0 && (
            <button
              className="spin-chip"
              onClick={() => go("roulette")}
              aria-label={`${spins} giros en la ruleta`}
            >
              <Icon name="gift" size={15} /> {spins}
            </button>
          )}
        </div>
      )}
      <div className="search-row">
        <button className="search" onClick={() => openAllPacks({ focus: true })}>
          <Icon name="search" />
          <span>Busca un local o comida</span>
        </button>
        <button
          className="map-btn"
          aria-label="Ver mapa de tiendas"
          title="Ver mapa"
          onClick={() => go("map")}
        >
          <Icon name="map" />
        </button>
      </div>
      <div className="chips">
        {(["Todos", "Panadería", "Café", "Menú"] as const).map((c) => (
          <button
            key={c}
            className={filter === c ? "selected" : ""}
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
        <button onClick={() => openAllPacks({ near: true })}>Cerca de mí</button>
      </div>
      {featured.length === 0 && (
        <div className="error-box info-box">
          <Icon name="clock" />
          <div>
            <b>Los packs de hoy ya cerraron</b>
            <p>Los locales publican sus packs cada tarde. Vuelve mañana desde las 3:00 p. m.</p>
          </div>
        </div>
      )}
      {filter !== "Todos" ? (
        <section>
          <div className="section-title">
            <div>
              <span>
                {list.filter((o) => avail(o) === "available").length} disponibles hoy · por cercanía
              </span>
              <h2>{sectionLabel[filter]}</h2>
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {list.map((o) => (
              <OfferCard
                key={o.name}
                compact
                offer={o}
                onClick={() => openProduct(productFromOffer(o))}
              />
            ))}
          </div>
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <section>
              <div className="section-title">
                <div>
                  <span>Mayor descuento hoy</span>
                  <h2>Packs Sorpresa</h2>
                </div>
                <button onClick={() => go("all-packs")}>Ver todos</button>
              </div>
              <div className="horizontal">
                {featured.map((o) => (
                  <OfferCard
                    key={o.name}
                    offer={o}
                    onClick={() => openProduct(productFromOffer(o))}
                  />
                ))}
              </div>
            </section>
          )}
          {usual.length > 0 && (
            <section>
              <div className="section-title">
                <div>
                  <span>Atajo</span>
                  <h2>Tus locales de siempre</h2>
                </div>
              </div>
              <div className="usual-row">
                {usual.map((n) => {
                  const o = offerFor(n);
                  const a = avail(o);
                  return (
                    <button
                      key={n}
                      className="usual-card"
                      onClick={() => openProduct(productFromOffer(o))}
                    >
                      <img src={o.photo} alt="" />
                      <b>{n}</b>
                      <small>
                        {a === "available" ? `${o.price} · volver a pedir` : timeBadge(o, a)}
                      </small>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
          <section>
            <div className="section-title">
              <div>
                <span>Ordenado por distancia a {activePlace}</span>
                <h2>Ofertas cerca de ti</h2>
              </div>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {sorted.map((o) => (
                <OfferCard
                  key={o.name}
                  compact
                  offer={o}
                  onClick={() => openProduct(productFromOffer(o))}
                />
              ))}
            </div>
          </section>
        </>
      )}
      <BottomNav active="home" go={go} />
    </div>
  );
}

type SortKey = "distance" | "discount" | "price" | "closing" | "rating";

const sortLabels: Record<SortKey, string> = {
  distance: "Más cerca",
  discount: "Mayor descuento",
  price: "Menor precio",
  closing: "Cierra pronto",
  rating: "Mejor valorados",
};
const PREFS: [string, string][] = [
  ["veg", "Vegetariano"],
  ["gluten", "Sin gluten"],
  ["lact", "Sin lácteos"],
];
const PICK_TIMES = Array.from({ length: 10 }, (_, i) => at(12 + i));

function AllPacks({ go }: { go: (s: Screen) => void }) {
  const { openProduct, packsPreset, goBack, stockOf, distanceTo } = useShop();
  const [cat, setCat] = useState<"Todos" | Category>("Todos");
  const [sort, setSort] = useState<SortKey>(packsPreset.near ? "distance" : "discount");
  const [query, setQuery] = useState("");
  const [cheap, setCheap] = useState(false);
  const [near, setNear] = useState(!!packsPreset.near);
  const [soon, setSoon] = useState(false);
  const [prefs, setPrefs] = useState<string[]>([]);
  const [pickAt, setPickAt] = useState<number | null>(null);
  const q = query.trim().toLowerCase();
  const avail = (o: Offer) => availOf(o, stockOf(packKey(o.name)));
  const now = nowMin();
  const list = offers
    .filter((o) => cat === "Todos" || o.category === cat)
    .filter((o) => !q || `${o.name} ${o.pack} ${o.content} ${o.category}`.toLowerCase().includes(q))
    .filter((o) => !cheap || toNum(o.price) <= 10)
    .filter((o) => !near || distanceTo(o.name) <= 400)
    .filter((o) => !soon || (avail(o) === "available" && now >= o.from && o.to - now <= 45))
    .filter((o) => !prefs.includes("veg") || o.tags.includes("Vegetariano"))
    .filter((o) => !prefs.includes("gluten") || !o.allergens.includes("Trigo"))
    .filter((o) => !prefs.includes("lact") || !o.allergens.includes("Leche"))
    .filter((o) => pickAt === null || (o.from <= pickAt && pickAt < o.to))
    .sort((a, b) => {
      const ua = Number(avail(a) !== "available") - Number(avail(b) !== "available");
      if (ua) return ua;
      if (sort === "discount") return toNum(b.discount) - toNum(a.discount);
      if (sort === "price") return toNum(a.price) - toNum(b.price);
      if (sort === "closing") return a.to - b.to;
      if (sort === "distance") return distanceTo(a.name) - distanceTo(b.name);
      return toNum(b.rating) - toNum(a.rating);
    });
  const nAvail = list.filter((o) => avail(o) === "available").length;
  const activeFilters =
    [cheap, near, soon].filter(Boolean).length + prefs.length + (pickAt === null ? 0 : 1);
  const togglePref = (k: string) =>
    setPrefs(prefs.includes(k) ? prefs.filter((x) => x !== k) : [...prefs, k]);
  return (
    <div className="screen with-nav">
      <Header title="Packs Sorpresa" onBack={goBack} />
      <label className="search search-input">
        <Icon name="search" />
        <input
          autoFocus={!!packsPreset.focus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca un local o comida"
          aria-label="Buscar packs"
        />
        {query && (
          <button aria-label="Borrar búsqueda" onClick={() => setQuery("")}>
            <Icon name="x" size={16} />
          </button>
        )}
      </label>
      <div className="chips">
        {(["Todos", "Panadería", "Café", "Menú"] as const).map((c) => (
          <button
            key={c}
            className={cat === c ? "selected" : ""}
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="quick-chips filter-chips">
        <button
          className={cheap ? "selected" : ""}
          aria-pressed={cheap}
          onClick={() => setCheap(!cheap)}
        >
          Hasta S/ 10
        </button>
        <button
          className={near ? "selected" : ""}
          aria-pressed={near}
          onClick={() => setNear(!near)}
        >
          A menos de 400 m
        </button>
        <button
          className={soon ? "selected" : ""}
          aria-pressed={soon}
          onClick={() => setSoon(!soon)}
        >
          Cierra en 45 min
        </button>
        {PREFS.map(([k, label]) => (
          <button
            key={k}
            className={prefs.includes(k) ? "selected" : ""}
            aria-pressed={prefs.includes(k)}
            onClick={() => togglePref(k)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="sort-row">
        <span>Recoger</span>
        <select
          aria-label="Hora a la que puedes recoger"
          value={pickAt ?? ""}
          onChange={(e) => setPickAt(e.target.value === "" ? null : Number(e.target.value))}
        >
          <option value="">A cualquier hora</option>
          {PICK_TIMES.map((t) => (
            <option key={t} value={t}>
              Puedo a las {minLabel(t)}
            </option>
          ))}
        </select>
      </div>
      <div className="sort-row">
        <span>Ordenar por</span>
        <select
          aria-label="Ordenar packs"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
        >
          {(Object.keys(sortLabels) as SortKey[]).map((k) => (
            <option key={k} value={k}>
              {sortLabels[k]}
            </option>
          ))}
        </select>
      </div>
      <p className="result-count">
        {nAvail} {nAvail === 1 ? "pack disponible" : "packs disponibles"} hoy
        {list.length > nAvail && ` · ${list.length - nAvail} no disponibles`}
        {activeFilters > 0 && (
          <button
            className="clear-filters"
            onClick={() => {
              setCheap(false);
              setNear(false);
              setSoon(false);
              setPrefs([]);
              setPickAt(null);
            }}
          >
            Quitar filtros ({activeFilters})
          </button>
        )}
      </p>
      {list.length === 0 ? (
        <div className="empty-state small-empty">
          <h2>No encontramos packs</h2>
          <p>
            {q ? `No hay resultados para “${query}”.` : "Ningún pack cumple estos filtros."} Prueba
            con otra búsqueda o quita filtros.
          </p>
        </div>
      ) : (
        <div className="all-packs-list">
          {list.map((o) => (
            <OfferCard
              key={o.name}
              compact
              offer={o}
              onClick={() => openProduct(productFromOffer(o))}
            />
          ))}
        </div>
      )}
      <BottomNav go={go} />
    </div>
  );
}

function EmptyHome({ go, embedded }: { go: (s: Screen) => void; embedded?: boolean }) {
  const { notify, setActivePlace, activePlace, places } = useShop();
  const [alert, setAlert] = useState(false);
  const covered = places.find((pl) => hasCoverage(pl.address));
  const body = (
    <div className="empty-state">
      <div className="empty-illustration">
        <Icon name="map" size={58} />
        <i></i>
      </div>
      <h2>Aún no hay ofertas por aquí</h2>
      <p>
        Todavía no hay locales aliados cerca de <b>{activePlace}</b>, así que tampoco podemos hacer
        delivery a esa dirección. Prueba con otra dirección o te avisamos.
      </p>
      {covered && (
        <button
          className="btn primary"
          onClick={() => {
            setActivePlace(covered.name);
            notify(`Cambiamos a tu dirección ${covered.name}`);
            go("home");
          }}
        >
          Ver ofertas cerca de {covered.name}
        </button>
      )}
      <button
        className="btn ghost"
        disabled={alert}
        onClick={() => {
          setAlert(true);
          notify("Te avisaremos cuando haya ofertas en esta zona");
        }}
      >
        {alert ? "✓ Te avisaremos" : "Avisarme cuando haya"}
      </button>
      <button className="link-btn center-link" onClick={() => go("locations")}>
        Cambiar de dirección
      </button>
    </div>
  );
  if (embedded) return body;
  return (
    <div className="screen with-nav">
      <Header title="Cerca de ti" />
      {body}
      <BottomNav active="home" go={go} />
    </div>
  );
}

function MapScreen({
  go,
  denied = false,
  onOpenStore,
}: {
  go: (s: Screen) => void;
  denied?: boolean;
  onOpenStore?: (name: string) => void;
}) {
  const { notify, places, setActivePlace, openAllPacks, stockOf, activePoint } = useShop();
  if (denied)
    return (
      <div className="screen with-nav">
        <Header title="Elige tu zona" onBack={() => go("map")} />
        <div className="permission-card">
          <div className="round-icon">
            <Icon name="pin" />
          </div>
          <h2>Encuentra ofertas cercanas</h2>
          <p>
            No tenemos permiso para usar tu ubicación. Puedes activarlo o elegir una zona
            manualmente.
          </p>
          <button
            className="btn primary"
            onClick={() => {
              notify("Ubicación activada: te mostramos las tiendas cercanas");
              go("map");
            }}
          >
            Permitir ubicación
          </button>
        </div>
        <h3 className="subheading">O elige una de tus direcciones</h3>
        <div className="list">
          {places.map((pl) => (
            <button
              key={pl.name}
              onClick={() => {
                setActivePlace(pl.name);
                go("home");
              }}
            >
              <Icon name="pin" />
              <span>
                <b className="row-label">{pl.name}</b>
                <small>{pl.address}</small>
              </span>
              <Icon name="chevron" />
            </button>
          ))}
        </div>
        <BottomNav go={go} />
      </div>
    );
  const clamp = (n: number) => Math.max(4, Math.min(96, n));
  return (
    <div className="screen with-nav map-screen">
      <div className="map-top">
        <button className="search" onClick={() => openAllPacks({ focus: true })}>
          <Icon name="search" />
          <span>Buscar en esta zona</span>
        </button>
        <button
          className="locate"
          aria-label="Centrar en mi ubicación"
          onClick={() => notify("Mapa centrado en tu dirección activa")}
        >
          <Icon name="pin" />
        </button>
      </div>
      <div className="map-canvas">
        <div className="road r1"></div>
        <div className="road r2"></div>
        <div className="road r3"></div>
        <span className="district">JR. ALONSO DE MOLINA</span>
        <div className="map-legend" aria-label="Leyenda">
          {(Object.keys(categoryColor) as Category[]).map((c) => (
            <span key={c}>
              <i style={{ background: categoryColor[c] }} /> {c}
            </span>
          ))}
          <span>
            <i className="you" /> Tú
          </span>
        </div>
        <span
          className="you-are-here"
          aria-label="Tu dirección activa"
          style={{ left: `${clamp(activePoint.x)}%`, top: `${clamp(activePoint.y)}%` }}
        />
        {stores.map((st) => {
          const o = offerFor(st.name);
          const a = availOf(o, stockOf(packKey(o.name)));
          return (
            <button
              key={st.name}
              className={`store-marker ${a !== "available" ? "off" : ""}`}
              style={{ left: `${st.x}%`, top: `${st.y}%` }}
              onClick={() => onOpenStore?.(st.name)}
              aria-label={`${st.name}, ${o.category}${a !== "available" ? `, ${timeBadge(o, a)}` : ""}`}
            >
              <span className="store-tag" style={{ background: categoryColor[o.category] }}>
                {a === "available" ? `${o.category} · ${o.price}` : timeBadge(o, a)}
              </span>
              <span className="store-pin" style={{ color: categoryColor[o.category] }}>
                <Icon name="store" size={18} />
              </span>
            </button>
          );
        })}
      </div>
      <BottomNav go={go} />
    </div>
  );
}

function StoreScreen({ go, storeName }: { go: (s: Screen) => void; storeName: string }) {
  const { openProduct, goBack, stockOf, distanceTo, published, subs, openSubFor } =
    useShop();
  const st = stores.find((x) => x.name === storeName) ?? stores[0];
  const o = offerFor(st.name);
  const pubs = st.name === BUSINESS_STORE ? published : [];
  const subscribed = subs.some((s) => s.store === st.name);
  const row = (p: Product, small: string) => {
    const left = stockOf(p.key);
    const a = availOf(p, left);
    return (
      <button key={p.key} className="catalog-item" onClick={() => openProduct(p)}>
        <img
          className="catalog-photo"
          src={p.photo}
          alt={p.name}
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== photos.bread) e.currentTarget.src = photos.bread;
          }}
        />
        <span className="catalog-text">
          <b>{p.name}</b>
          <small>{small}</small>
          <span className="catalog-price">
            <strong>{money(p.price)}</strong>
            <del>{money(p.oldPrice)}</del>
          </span>
        </span>
        <span className="catalog-side">
          <small>{a === "available" ? `Quedan ${left}` : timeBadge(p, a)}</small>
          <span className="catalog-add">
            <Icon name="chevron" size={18} />
          </span>
        </span>
      </button>
    );
  };
  return (
    <div className="screen store-screen">
      <div className="detail-photo">
        <img src={o.photo} alt={st.name} />
        <button className="back-float" aria-label="Volver" onClick={goBack}>
          <Icon name="back" />
        </button>
      </div>
      <div className="store-info">
        <span className="store-tag" style={{ background: categoryColor[o.category] }}>
          {o.category}
        </span>
        <h1>{st.name}</h1>
        <div className="store-meta">
          ★ {o.rating} · a {distLabel(distanceTo(st.name))}
        </div>
        <div className="address">
          <Icon name="pin" />
          <span>
            <b>{st.address}</b>
            <small>Abierto {st.hours}</small>
          </span>
        </div>
        <div className="address">
          <Icon name="calendar" />
          <span>
            <b>Packs: {daysShort(o.days)}</b>
            <small>Ventana de recojo {windowLabel(o.from, o.to)}</small>
          </span>
        </div>
      </div>
      <section>
        <div className="section-title">
          <div>
            <span>Destacado</span>
            <h2>Pack Sorpresa</h2>
          </div>
        </div>
        <OfferCard compact offer={o} onClick={() => openProduct(productFromOffer(o))} />
        <button
            className="plan-add-btn"
            onClick={() => {
              openSubFor(st.name);
              go("planner");
            }}
          >
            <Icon name="calendar" size={18} />
            {subscribed ? "Ya tienes una suscripción · ver" : "Suscribirme a este local"}
          </button>
      </section>
      {pubs.length > 0 && (
        <section>
          <div className="section-title">
            <h2>Publicado hoy por el local</h2>
            <small>{pubs.length} nuevos</small>
          </div>
          <div className="catalog-list">
            {pubs.map((p) => {
              const prod = productFromPublished(p);
              return row(
                prod,
                `${p.kind === "pack" ? "Pack Sorpresa" : "Oferta del día"} · hasta ${minLabel(p.to)}`,
              );
            })}
          </div>
        </section>
      )}
      <section>
        <div className="section-title">
          <h2>Catálogo de hoy</h2>
          <small>{st.items.length} productos</small>
        </div>
        <div className="catalog-list">
          {st.items.map((it) => row(productFromItem(st, it), it.desc))}
        </div>
      </section>
    </div>
  );
}

function Detail({ go, state: forced }: { go: (s: Screen) => void; state?: "soldout" | "expired" }) {
  const {
    product: p,
    qty,
    setQty,
    goBack,
    openSubFor,
    subs,
    openHelp,
    openProduct,
    stockOf,
    distanceTo,
    activeAddress,
    activePlace,
  } = useShop();
  const left = stockOf(p.key);
  const av: Avail = forced ?? availOf(p, left);
  const unavailable = av !== "available";
  const max = Math.max(1, Math.min(MAX_QTY, left));
  const shownQty = Math.min(qty, max);
  const similar = offers
    .filter(
      (o) =>
        o.category === p.category &&
        o.name !== p.store &&
        availOf(o, stockOf(packKey(o.name))) === "available",
    )
    .slice(0, 2);
  const pct = Math.round((1 - p.price / p.oldPrice) * 100);
  const eligible = p.isPack;
  const subscribed = subs.some((s) => s.store === p.store);
  const deliveryOk = hasCoverage(activeAddress);
  return (
    <div className="screen detail-screen">
      <div className="detail-photo">
        <img src={p.photo} alt={p.name} />
        <button className="back-float" aria-label="Volver" onClick={goBack}>
          <Icon name="back" />
        </button>
        <span className="discount big">AHORRA {pct}%</span>
      </div>
      <div className="detail-content">
        <Stepper current={0} />
        <div className="eyebrow">{p.isPack ? "PACK SORPRESA" : p.category.toUpperCase()}</div>
        <h1>{p.name}</h1>
        <div className="merchant-line">
          <b>{p.store}</b>
          <span>
            ★ {p.rating} · {REVIEWS[p.store] ?? 40} reseñas
          </span>
        </div>
        <div className="hero-price">
          <strong>{money(p.price)}</strong>
          <span>
            precio normal <del>{money(p.oldPrice)}</del>
          </span>
        </div>
        {unavailable && (
          <div className="error-box">
            <Icon name="alert" />
            <div>
              <b>
                {av === "soldout"
                  ? "Este pack se agotó hoy"
                  : `La ventana de recojo de hoy terminó a las ${minLabel(p.to)}`}
              </b>
              <p>
                {similar.length
                  ? "Mira estas opciones similares disponibles."
                  : "Vuelve mañana: el local publica sus packs cada día."}
              </p>
            </div>
          </div>
        )}
        {unavailable && similar.length > 0 && (
          <div className="similar-list">
            {similar.map((o) => (
              <OfferCard
                key={o.name}
                compact
                offer={o}
                onClick={() => openProduct(productFromOffer(o))}
              />
            ))}
          </div>
        )}
        <div className="facts">
          <div>
            <Icon name="bag" />
            <span>
              <b>{av === "soldout" ? "Agotado" : `Quedan ${left}`}</b>
              <small>{p.isPack ? "bolsas disponibles" : "unidades disponibles"}</small>
            </span>
          </div>
          <div>
            <Icon name="clock" />
            <span>
              <b>Hoy {windowLabel(p.from, p.to)}</b>
              <small>{timeBadge(p, av)}</small>
            </span>
          </div>
        </div>
        <section className="pack-about">
          <div className="section-title">
            <h2>{p.isPack ? "¿Qué puede traer?" : "Descripción"}</h2>
            <button aria-label="¿Qué es un Pack Sorpresa?" onClick={() => openHelp("pack")}>
              <Icon name="info" size={18} />
            </button>
          </div>
          <p>
            {p.desc}
            {p.isPack && " El contenido exacto es sorpresa."}
          </p>
          <div className="value">
            <span>Valor aproximado</span>
            <b>{money(p.oldPrice)}</b>
          </div>
        </section>
        <section>
          <h2>Condiciones</h2>
          <div className="cond-list">
            <div className="address">
              <Icon name="clock" />
              <span>
                <b>Recojo hoy de {windowLabel(p.from, p.to)}</b>
                <small>
                  Eliges una franja de 30 min al pagar. Guardamos tu pedido hasta las{" "}
                  {minLabel(p.to)}
                </small>
              </span>
            </div>
            <div className="address">
              <Icon name="alert" />
              <span>
                <b>Alérgenos declarados por el local</b>
                <span className="allergens" aria-label="Alérgenos">
                  {p.allergens.map((a) => (
                    <span key={a}>{a}</span>
                  ))}
                </span>
                <button className="link-btn" onClick={() => openHelp("allergens")}>
                  ¿Tienes una alergia severa?
                </button>
              </span>
            </div>
            <div className="address">
              <Icon name="info" />
              <span>
                <b>Cancelación</b>
                <small>
                  Gratis mientras el local no empiece a prepararlo. Si no lo recoges antes de las{" "}
                  {minLabel(p.to)}, no hay reembolso.
                </small>
              </span>
            </div>
          </div>
        </section>
        <section>
          <h2>Formas de entrega</h2>
          <div className="address">
            <Icon name="store" />
            <span>
              <b>Recojo en tienda · gratis</b>
              <small>
                {p.address} · a {distLabel(distanceTo(p.store))} de {activePlace}
              </small>
            </span>
          </div>
          <div className="address">
            <Icon name="bike" />
            <span>
              <b>
                {deliveryOk
                  ? `Delivery del local · ${money(DELIVERY_FEE)}`
                  : "Delivery no disponible"}
              </b>
              <small>
                {deliveryOk
                  ? "Lo lleva el propio local en la franja que elijas, dentro de la ventana."
                  : `Aún no llegamos a ${zoneOf(activeAddress) ?? "tu dirección"}.`}
              </small>
            </span>
          </div>
        </section>
        <div className="quantity">
          <span>
            <b>Cantidad</b>
            <small>
              Máximo {MAX_QTY} por persona{!unavailable && ` · quedan ${left}`}
            </small>
          </span>
          <div>
            <button
              aria-label="Quitar uno"
              disabled={unavailable || shownQty <= 1}
              onClick={() => setQty(Math.max(1, shownQty - 1))}
            >
              <Icon name="minus" />
            </button>
            <b aria-live="polite">{shownQty}</b>
            <button
              aria-label="Agregar uno"
              disabled={unavailable || shownQty >= max}
              onClick={() => setQty(Math.min(max, shownQty + 1))}
            >
              <Icon name="plus" />
            </button>
          </div>
        </div>
        {eligible && (
          <button
            className="plan-add-btn"
            onClick={() => {
              openSubFor(p.store);
              go("planner");
            }}
          >
            <Icon name="calendar" size={18} />
            {subscribed
              ? "Tienes una suscripción a este local · ver"
              : "Suscribirme - semanal o mensual"}
          </button>
        )}
      </div>
      <div className="sticky-action">
        {unavailable && (
          <small>No puedes pedir un pack {av === "soldout" ? "agotado" : "vencido"}.</small>
        )}
        <button
          className="btn primary"
          disabled={unavailable}
          onClick={() => {
            if (shownQty !== qty) setQty(shownQty);
            go("payment");
          }}
        >
          {unavailable ? "No disponible" : `Continuar · ${money(p.price * shownQty)}`}
        </button>
      </div>
    </div>
  );
}

function Payment({ go }: { go: (s: Screen) => void }) {
  const {
    product: p,
    qty,
    placeOrder,
    points,
    coupons,
    selectedCouponId,
    selectCoupon,
    places,
    activeAddress,
    freeShipAvailable,
    lastPrefs,
    role,
    requireAccount,
    consumeFailure,
    goBack,
  } = useShop();
  const pickupSlots = slotsFor(p, "pickup");
  const deliverySlots = slotsFor(p, "delivery");
  const [mode, setMode] = useState<DeliveryMode>(() =>
    lastPrefs.mode === "delivery" && hasCoverage(activeAddress) && deliverySlots.length
      ? "delivery"
      : "pickup",
  );
  const [address, setAddress] = useState(hasCoverage(activeAddress) ? activeAddress : "");
  const slots = mode === "pickup" ? pickupSlots : deliverySlots;
  const [slotFrom, setSlotFrom] = useState<number | null>(null);
  const slot = slots.find((s) => s.from === slotFrom) ?? slots[0] ?? null;
  const [method, setMethod] = useState<PayMethod>(lastPrefs.method);
  const [confirm, setConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showCoupons, setShowCoupons] = useState(false);

  const subtotal = +(p.price * qty).toFixed(2);
  const perkShip = mode === "delivery" && freeShipAvailable;
  const fee = mode === "delivery" && !perkShip ? DELIVERY_FEE : 0;
  const usable = coupons.filter(couponUsable);
  const [couponId, setCouponId] = useState<string>(() =>
    usable.some((c) => c.id === selectedCouponId)
      ? selectedCouponId
      : (bestCoupon(usable, subtotal, mode === "delivery" ? DELIVERY_FEE : 0)?.id ?? ""),
  );
  const coupon = usable.find((c) => c.id === couponId);
  const couponOff = couponDiscount(coupon, subtotal, fee);
  const total = Math.max(0, +(subtotal + fee - couponOff).toFixed(2));
  const pts = pointsFor(subtotal);
  const pickup = mode === "pickup";
  const chooseCoupon = (id: string) => {
    setCouponId(id);
    selectCoupon(id);
    setShowCoupons(false);
  };

  const pay = () => {
    if (role === "guest") {
      requireAccount();
      return;
    }
    if (!slot) {
      setError(
        pickup
          ? "La ventana de recojo de hoy terminó."
          : "Ya no alcanza el tiempo para delivery hoy. Elige recojo.",
      );
      return;
    }
    if (!pickup) {
      if (address.trim().length < 8) {
        setError("Ingresa una dirección de entrega válida (calle, número y distrito).");
        return;
      }
      if (!hasCoverage(address)) {
        setError(`Aún no hacemos delivery en ${zoneOf(address)}. Elige otra dirección o recojo.`);
        return;
      }
    }
    setError("");
    setConfirmError("");
    setConfirm(true);
  };

  const confirmOrder = () => {
    if (processing || !slot) return;
    setProcessing(true);
    setTimeout(() => {
      if (method !== "cash" && total > 0 && consumeFailure()) {
        go("payment-error");
        return;
      }
      const r = placeOrder({
        mode,
        address: pickup ? "" : address.trim(),
        method,
        slot,
        subtotal,
        fee,
        discount: couponOff,
        total,
        couponId: coupon && couponOff > 0 ? coupon.id : undefined,
        freeShip: perkShip,
      });
      if (!r.ok) {
        setProcessing(false);
        setConfirmError(r.reason);
        return;
      }
      go("confirmation");
    }, 900);
  };

  return (
    <div className="screen payment-screen">
      <Header title="Pago" onBack={goBack} />
      <Stepper current={1} />
      <div className="demo-label">DEMO · PAGO SIMULADO</div>
      <section className="summary">
        <img src={p.photo} alt={p.name} />
        <div>
          <small>{p.store}</small>
          <b>{p.name}</b>
          <span>
            {qty} {qty === 1 ? "unidad" : "unidades"} · ventana {windowLabel(p.from, p.to)}
          </span>
        </div>
      </section>
      <section>
        <h2>¿Cómo quieres recibirlo?</h2>
        <div className="login-tabs mode-tabs" role="tablist" aria-label="Forma de entrega">
          <button
            role="tab"
            aria-selected={pickup}
            className={pickup ? "active" : ""}
            onClick={() => {
              setMode("pickup");
              setSlotFrom(null);
              setError("");
            }}
          >
            <Icon name="store" size={18} /> Recojo
          </button>
          <button
            role="tab"
            aria-selected={!pickup}
            className={!pickup ? "active" : ""}
            disabled={!deliverySlots.length}
            onClick={() => {
              setMode("delivery");
              setSlotFrom(null);
              setError("");
            }}
          >
            <Icon name="bike" size={18} /> Delivery
          </button>
        </div>
        {!deliverySlots.length && (
          <small className="inline-note">
            El delivery necesita al menos 30 min antes del cierre: hoy ya no alcanza.
          </small>
        )}
        {pickup ? (
          <div className="address">
            <Icon name="pin" />
            <span>
              <b>{p.store}</b>
              <small>{p.address}</small>
            </span>
            <b className="fee-tag">Gratis</b>
          </div>
        ) : (
          <>
            <label className="field">
              <span>Dirección de entrega</span>
              <input
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setError("");
                }}
                placeholder="Calle, número y distrito"
              />
            </label>
            <div className="place-chips">
              {places.map((pl) => {
                const ok = hasCoverage(pl.address);
                return (
                  <button
                    key={pl.name}
                    className={address === pl.address ? "selected" : ""}
                    disabled={!ok}
                    title={ok ? undefined : "Sin cobertura de delivery"}
                    onClick={() => {
                      setAddress(pl.address);
                      setError("");
                    }}
                  >
                    <Icon name="pin" size={13} /> {pl.name}
                    {!ok && " (sin cobertura)"}
                  </button>
                );
              })}
            </div>
            <div className="address">
              <Icon name="bike" />
              <span>
                <b>Delivery del local</b>
                <small>
                  {perkShip ? "Beneficio Oro: 1 envío gratis por semana" : "Costo de envío"}
                </small>
              </span>
              <b className="fee-tag">{fee ? money(fee) : "Gratis"}</b>
            </div>
          </>
        )}
      </section>
      <section>
        <h2>¿A qué hora?</h2>
        {slots.length ? (
          <>
            <div className="time-chips" role="radiogroup" aria-label="Franja horaria">
              {slots.map((s) => (
                <button
                  key={s.from}
                  role="radio"
                  aria-checked={slot?.from === s.from}
                  className={slot?.from === s.from ? "active" : ""}
                  onClick={() => setSlotFrom(s.from)}
                >
                  {slotLabel(s)}
                </button>
              ))}
            </div>
            <small className="inline-note">
              {pickup
                ? `Recoge en tu franja; guardamos tu pedido hasta las ${minLabel(p.to)}`
                : "El local lleva tu pedido en esa franja. No mostramos al repartidor en tiempo real: te avisamos cuando salga."}
            </small>
          </>
        ) : (
          <small className="inline-note">No quedan franjas disponibles hoy para este pack.</small>
        )}
        {error && (
          <div className="login-error" role="alert">
            <Icon name="alert" size={18} />
            <span>{error}</span>
          </div>
        )}
      </section>
      <section>
        <h2>¿Cómo quieres pagar?</h2>
        <div className="radio-cards" role="radiogroup" aria-label="Método de pago">
          {(["yape", "card", "cash"] as PayMethod[]).map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={method === m}
              className={method === m ? "selected" : ""}
              onClick={() => setMethod(m)}
            >
              <i>{method === m && <span />}</i>
              <span>
                <b>{methodLabel(m, mode)}</b>
                <small>
                  {m === "yape"
                    ? "Recomendado"
                    : m === "card"
                      ? "Método guardado"
                      : pickup
                        ? "Paga en el local"
                        : "Paga al recibir"}
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>
      {usable.length > 0 && (
        <section>
          <h2>Cupón</h2>
          <div className="list discount-list">
            <button aria-expanded={showCoupons} onClick={() => setShowCoupons(!showCoupons)}>
              <Icon name="ticket" />
              <span>
                <b className="row-label">{coupon ? coupon.name : "Sin cupón"}</b>
                <small>
                  {coupon
                    ? couponOff > 0
                      ? `Ahorras ${money(couponOff)}`
                      : coupon.kind === "shipping" && pickup
                        ? "Solo aplica con delivery"
                        : `Aún no aplica: ${coupon.detail.toLowerCase()}`
                    : `${usable.length} ${usable.length === 1 ? "cupón disponible" : "cupones disponibles"}`}
                </small>
              </span>
              <Icon name="chevron" />
            </button>
            {showCoupons && (
              <>
                {usable.map((c) => {
                  const off = couponDiscount(c, subtotal, fee);
                  return (
                    <button
                      key={c.id}
                      role="radio"
                      aria-checked={c.id === couponId}
                      onClick={() => chooseCoupon(c.id)}
                    >
                      <Icon name={c.id === couponId ? "check" : "ticket"} />
                      <span>
                        <b className="row-label">{c.name}</b>
                        <small>
                          {off > 0 ? `Ahorras ${money(off)}` : `Aún no aplica · ${c.detail}`}
                        </small>
                      </span>
                    </button>
                  );
                })}
                <button role="radio" aria-checked={!couponId} onClick={() => chooseCoupon("")}>
                  <Icon name={!couponId ? "check" : "x"} />
                  <span>
                    <b className="row-label">No usar cupón</b>
                  </span>
                </button>
              </>
            )}
          </div>
        </section>
      )}
      <section className="total">
        <div>
          <span>
            {p.isPack ? "Pack Sorpresa" : p.name} × {qty}
          </span>
          <b>{money(subtotal)}</b>
        </div>
        <div>
          <span>{pickup ? "Recojo en tienda" : perkShip ? "Envío (beneficio Oro)" : "Envío"}</span>
          <b>{fee ? money(fee) : "Gratis"}</b>
        </div>
        {couponOff > 0 && (
          <div className="discount-line">
            <span>{coupon!.name}</span>
            <b>−{money(couponOff)}</b>
          </div>
        )}
        <div className="grand">
          <span>Total</span>
          <b>{money(total)}</b>
        </div>
        <div className="points-preview">
          <p>
            <Icon name="star" size={17} /> Ganarás <b>{pts} pts</b> cuando{" "}
            {pickup ? "recojas" : "recibas"} tu pedido
            {nextLevel(points) && levelOf(points + pts).name !== levelOf(points).name ? (
              <strong> · ¡y subirás a {levelOf(points + pts).name}!</strong>
            ) : null}
          </p>
          <LevelBar pts={points} extra={pts} />
        </div>
      </section>
      <p className="muted-note conditions-note">
        <Icon name="info" size={15} /> Puedes cancelar sin costo mientras tu pedido esté
        «Confirmado». Si no lo recoges antes de las {minLabel(p.to)}, no hay reembolso.
      </p>
      <div className="sticky-action">
        <button className="btn primary" onClick={pay}>
          {role === "guest"
            ? "Crear cuenta para pagar"
            : total === 0
              ? "Confirmar pedido gratis"
              : method === "cash"
                ? `Confirmar pedido · ${money(total)}`
                : `Pagar ${money(total)}`}
        </button>
      </div>
      {confirm && slot && (
        <Modal label="Confirmar pedido" onClose={processing ? undefined : () => setConfirm(false)}>
          <div className="round-icon">
            <Icon name="check" />
          </div>
          <h2>¿Confirmas tu pedido?</h2>
          <p>
            {total === 0
              ? "No se cobrará nada: tu cupón cubre el pedido."
              : method === "cash"
                ? `Pagarás ${money(total)} en efectivo ${pickup ? "al recoger" : "al recibir"}.`
                : `Se cobrará ${money(total)} con ${methodLabel(method, mode)}.`}{" "}
            {pickup
              ? `Recoges en ${p.store} hoy entre ${slotLabel(slot)}`
              : `Lo llevamos a ${address.trim()} hoy entre ${slotLabel(slot)}`}
          </p>
          {confirmError && (
            <div className="login-error" role="alert">
              <Icon name="alert" size={18} />
              <span>{confirmError} No se realizó ningún cobro.</span>
            </div>
          )}
          {confirmError ? (
            <button className="btn primary" onClick={() => go("detail")}>
              Volver al pack
            </button>
          ) : (
            <button className="btn primary" disabled={processing} onClick={confirmOrder}>
              {processing ? "Procesando pago…" : "Sí, confirmar"}
            </button>
          )}
          <button className="btn ghost" disabled={processing} onClick={() => setConfirm(false)}>
            Revisar pedido
          </button>
        </Modal>
      )}
    </div>
  );
}

function PaymentError({ go }: { go: (s: Screen) => void }) {
  const { goBack } = useShop();
  return (
    <div className="screen">
      <Header title="No pudimos cobrar" onBack={goBack} />
      <div className="error-state">
        <div className="error-icon">
          <Icon name="alert" size={34} />
        </div>
        <h1>Tu pago fue rechazado</h1>
        <p>
          No se realizó ningún cobro y el pedido no se creó. Revisa los datos de tu tarjeta o prueba
          otro método.
        </p>
        <div className="error-box">
          <Icon name="info" />
          <span>
            <b>Tu pack y la cantidad siguen elegidos</b>
            <small>Vuelve al pago, revisa tu franja e inténtalo con Yape / Plin o efectivo.</small>
          </span>
        </div>
        <button className="btn primary" onClick={goBack}>
          Probar otro método
        </button>
        <button className="btn ghost" onClick={() => go("detail")}>
          Volver al detalle
        </button>
      </div>
    </div>
  );
}

function Confirmation({ go }: { go: (s: Screen) => void }) {
  const { myOrders, lastOrderId, user, points, openOrder } = useShop();
  const o = myOrders.find((x) => x.id === lastOrderId) ?? myOrders.find(isActiveOrder);
  if (!o)
    return (
      <div className="screen confirmation">
        <Header title="Confirmación" />
        <div className="empty-state small-empty">
          <h2>Aún no hay un pedido reciente</h2>
          <p>Cuando confirmes un pedido verás aquí tu código y tu franja.</p>
          <button className="btn primary" onClick={() => go("home")}>
            Explorar packs
          </button>
        </div>
      </div>
    );
  const p = o.product;
  const pickup = o.mode === "pickup";
  const spins = spinsPerOrder(points);
  return (
    <div className="screen confirmation">
      <Header title="Pedido confirmado" />
      <Stepper current={2} />
      <div className="success-mark">
        <Icon name="check" size={34} />
      </div>
      <h1>¡Listo, {user.nickname || user.first}!</h1>
      <p>
        {pickup
          ? "Te avisaremos cuando el local tenga tu pedido listo."
          : "Te avisaremos cuando el local despache tu pedido."}
      </p>
      <div className="ticket">
        <div className="ticket-head">
          <span>Código del pedido</span>
          <strong>{o.id}</strong>
        </div>
        <div className="qr" aria-label={`Código QR del pedido ${o.id}`}></div>
        <small>{pickup ? "Muéstralo al recoger" : "Muéstralo al recibir"}</small>
        <hr />
        <div className="pickup-time">
          <Icon name="clock" />
          <span>
            <small>{pickup ? "Recoge hoy entre" : "Llega hoy entre"}</small>
            <b>{slotLabel(o.slot)}</b>
            {pickup && <small>Guardamos tu pedido hasta las {minLabel(p.to)}</small>}
          </span>
        </div>
        <div className="address">
          <Icon name="pin" />
          <span>
            <b>{pickup ? p.store : "Delivery a tu dirección"}</b>
            <small>{pickup ? p.address : o.address}</small>
          </span>
        </div>
        <div className="address">
          <Icon name="bag" />
          <span>
            <b>
              {o.qty} × {p.name}
            </b>
            <small>{methodLabel(o.method, o.mode)}</small>
          </span>
          <b className="fee-tag">{money(o.total)}</b>
        </div>
      </div>
      <div className="points-card">
        <div>
          <span className="points-gain">+{o.points} pts</span>
          <small>al {pickup ? "recoger" : "recibir"} tu pedido</small>
        </div>
        <LevelBar pts={points} extra={o.points} />
        <small className="inline-note">
          <Icon name="gift" size={14} /> Al completarlo también ganas {spins}{" "}
          {spins === 1 ? "giro" : "giros"} de ruleta.
        </small>
      </div>
      <div className="confirmation-actions">
        <button className="btn primary" onClick={() => openOrder(o.id)}>
          Ver detalle del pedido
        </button>
        <button className="btn ghost" onClick={() => go("home")}>
          Seguir explorando
        </button>
      </div>
    </div>
  );
}

function Status({ type }: { type: StatusLabel }) {
  const cls = ["Cancelado", "No recogido", "No disponible", "Sin confirmar"].includes(type)
    ? "red"
    : ["Recogido", "Entregado", "Listo para recoger", "Activa"].includes(type)
      ? "green"
      : ["Programada", "Saltada", "Pausada"].includes(type)
        ? "gray"
        : "blue";
  return (
    <span className={`status ${cls}`}>
      <Icon name={cls === "red" ? "alert" : cls === "gray" ? "calendar" : "check"} size={13} />
      {type}
    </span>
  );
}

function OrderItem({
  order: o,
  onOpen,
  onReview,
  onReorder,
}: {
  order: Order;
  onOpen: () => void;
  onReview: () => void;
  onReorder: () => void;
}) {
  const { setOrderStatus, undoCompletion, notify } = useShop();
  const active = isActiveOrder(o);
  const pickup = o.mode === "pickup";
  const done = isCompleted(o);
  return (
    <article className="order-item">
      <button className="order-open" onClick={onOpen} aria-label={`Ver detalle del pedido ${o.id}`}>
        <div className="order-top">
          <img src={o.product.photo} alt="" />
          <div>
            <Status type={o.status} />
            <h3>{o.product.store}</h3>
            <p>
              {o.qty} × {o.product.name}
            </p>
            {active && (
              <small className="order-pts">
                +{o.points} pts al {pickup ? "recoger" : "recibir"}
              </small>
            )}
            {done && o.pointsAwarded && <small className="order-pts">+{o.points} pts</small>}
          </div>
        </div>
        <div className="order-meta">
          <span>
            {o.id} · {dayLabel(o.day)} · {pickup ? "Recojo" : "Delivery"}
            {active && ` · ${slotLabel(o.slot)}`}
          </span>
          <b>{money(o.total)}</b>
        </div>
        {o.subscriptionId && <small className="order-address">Entrega de tu suscripción</small>}
        {!pickup && o.address && <small className="order-address">Entrega en {o.address}</small>}
      </button>
      {active && (
        <button
          className="btn primary"
          onClick={() => {
            setOrderStatus(o.id, pickup ? "Recogido" : "Entregado", { by: "cliente" });
            notify(`Pedido ${o.id} recibido. Puedes verlo en Historial.`, () =>
              undoCompletion(o.id, o.status),
            );
          }}
        >
          Pedido recibido
        </button>
      )}
      {!active &&
        (done ? (
          <button className="outline-btn" disabled={o.reviewed} onClick={onReview}>
            {o.reviewed ? `Calificado ★ ${o.rating ?? 5}` : `Calificar · +${REVIEW_POINTS} pts`}
          </button>
        ) : (
          <button className="outline-btn" onClick={onReorder}>
            Volver a pedir
          </button>
        ))}
    </article>
  );
}

function Orders({ go, empty = false }: { go: (s: Screen) => void; empty?: boolean }) {
  const { myOrders, orders, openProduct, startReview, openOrder, subs, toggleSkip } = useShop();
  const [tab, setTab] = useState<"Activos" | "Programados" | "Historial">("Activos");
  const active = empty
    ? []
    : myOrders
        .filter(isActiveOrder)
        .sort((a, b) => a.day.localeCompare(b.day) || a.slot.from - b.slot.from);
  const history = empty ? [] : myOrders.filter((o) => !isActiveOrder(o));
  const occ = empty
    ? []
    : upcoming(subs).filter(
        (oc) => !orders.some((o) => o.subscriptionId === oc.sub.uid && o.day === oc.key),
      );
  const tabs: ["Activos" | "Programados" | "Historial", number][] = [
    ["Activos", active.length],
    ["Programados", occ.filter((oc) => !oc.sub.skipped.includes(oc.key)).length],
    ["Historial", 0],
  ];
  return (
    <div className="screen with-nav">
      <Header title="Mis pedidos" />
      <div className="tabs three" role="tablist" aria-label="Tipo de pedidos">
        {tabs.map(([t, n]) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t} {n > 0 && <span>{n}</span>}
          </button>
        ))}
      </div>
      {tab === "Programados" ? (
        occ.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <Icon name="calendar" size={55} />
            </div>
            <h2>No tienes entregas programadas</h2>
            <p>Las entregas de tus suscripciones de los próximos 7 días aparecerán aquí.</p>
            <button className="btn primary" onClick={() => go("planner")}>
              Ver suscripciones
            </button>
          </div>
        ) : (
          <div className="order-list">
            {occ.map((oc) => {
              const o = offerFor(oc.sub.store);
              const skipped = oc.sub.skipped.includes(oc.key);
              return (
                <article key={oc.sub.uid + oc.key} className="order-item">
                  <div className="order-top">
                    <img src={o.photo} alt="" />
                    <div>
                      <Status type={skipped ? "Saltada" : "Programada"} />
                      <h3>{oc.sub.store}</h3>
                      <p>
                        {dayLabel(oc.key)} ·{" "}
                        {slotLabel({ from: oc.sub.slot, to: oc.sub.slot + 30 })}
                      </p>
                      <small className="order-pts">
                        {oc.sub.mode === "pickup" ? "Recojo" : "Delivery"} ·{" "}
                        {skipped ? "no se cobrará" : `${money(subPrice(oc.sub))} al confirmarse`}
                      </small>
                    </div>
                  </div>
                  <button className="outline-btn" onClick={() => toggleSkip(oc.sub.uid, oc.key)}>
                    {skipped ? "Volver a recibir esta entrega" : "Saltar esta entrega"}
                  </button>
                </article>
              );
            })}
          </div>
        )
      ) : (tab === "Activos" ? active : history).length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <Icon name="bag" size={55} />
          </div>
          <h2>{tab === "Activos" ? "No tienes pedidos activos" : "Tu historial está vacío"}</h2>
          <p>Cuando pidas un pack, podrás seguirlo desde aquí.</p>
          <button className="btn primary" onClick={() => go("home")}>
            Explorar ofertas
          </button>
        </div>
      ) : (
        <div className="order-list">
          {(tab === "Activos" ? active : history).map((o) => (
            <OrderItem
              key={o.id}
              order={o}
              onOpen={() => openOrder(o.id)}
              onReview={() => {
                startReview(o.id);
                go("review");
              }}
              onReorder={() => openProduct(o.product)}
            />
          ))}
        </div>
      )}
      <BottomNav active="orders" go={go} />
    </div>
  );
}

function OrderDetail({ go }: { go: (s: Screen) => void }) {
  const {
    myOrders,
    orderId,
    goBack,
    setOrderStatus,
    undoCompletion,
    notify,
    startReview,
    openLegal,
  } = useShop();
  const o = myOrders.find((x) => x.id === orderId) ?? myOrders.find(isActiveOrder) ?? myOrders[0];
  const [cancel, setCancel] = useState(false);
  if (!o)
    return (
      <div className="screen with-nav">
        <Header title="Pedido" onBack={goBack} />
        <div className="empty-state small-empty">
          <h2>No encontramos el pedido</h2>
          <button className="btn primary" onClick={() => go("orders")}>
            Ver mis pedidos
          </button>
        </div>
        <BottomNav go={go} />
      </div>
    );
  const pickup = o.mode === "pickup";
  const active = isActiveOrder(o);
  const bad =
    o.status === "Cancelado" || o.status === "No recogido" || o.status === "No disponible";
  const reached = (st: OrderStatus) => o.timeline.find((t) => t.status === st);
  const doneStatus: OrderStatus = pickup ? "Recogido" : "Entregado";
  const refund =
    o.method === "cash" ? "No se realizó ningún cobro." : "El reembolso llega en hasta 5 días.";
  return (
    <div className="screen with-nav">
      <Header title={`Pedido ${o.id}`} onBack={goBack} />
      <div className="tracking-card order-card">
        <div className="order-top">
          <img src={o.product.photo} alt="" />
          <div>
            <Status type={o.status} />
            <h3>{o.product.store}</h3>
            <p>
              {o.qty} × {o.product.name}
            </p>
          </div>
        </div>
        {bad ? (
          <div className="error-box">
            <Icon name="alert" />
            <div>
              <b>
                {o.status === "Cancelado"
                  ? "Pedido cancelado"
                  : o.status === "No recogido"
                    ? "No se recogió a tiempo"
                    : "Hoy no hubo pack"}
              </b>
              <p>
                {o.status === "Cancelado"
                  ? `${sentence(o.note ?? "El pedido se canceló")} ${refund}`
                  : o.status === "No recogido"
                    ? `${sentence(o.note ?? "La ventana terminó")} Como el local ya lo había preparado, no hay reembolso.`
                    : `${sentence(o.note ?? "El local no tuvo packs ese día")} No se te cobró nada.`}
              </p>
            </div>
          </div>
        ) : (
          <ol className="track-steps" aria-label="Estado del pedido">
            {FLOW[o.mode].map((st) => {
              const r = reached(st);
              return (
                <li
                  key={st}
                  className={r ? "done" : ""}
                  aria-current={o.status === st ? "step" : undefined}
                >
                  <i>{r ? <Icon name="check" size={12} /> : null}</i>
                  {st}
                  <small>{r ? minLabel(r.at) : "—"}</small>
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {!bad && (
        <div className="ticket">
          <div className="ticket-head">
            <span>Código del pedido</span>
            <strong>{o.id}</strong>
          </div>
          {active && <div className="qr" aria-label={`Código QR del pedido ${o.id}`}></div>}
          <small>
            {active
              ? pickup
                ? "Muéstralo al recoger"
                : "Muéstralo al recibir"
              : `${doneStatus} ${dayLabel(o.day).toLowerCase()}`}
          </small>
        </div>
      )}
      <section>
        <div className="address">
          <Icon name="clock" />
          <span>
            <b>
              {dayLabel(o.day)} · {pickup ? "recojo" : "entrega"} entre {slotLabel(o.slot)}
            </b>
            <small>
              {pickup
                ? `Guardamos tu pedido hasta las ${minLabel(o.product.to)}`
                : "Franja elegida al pagar"}
            </small>
          </span>
        </div>
        <div className="address">
          <Icon name="pin" />
          <span>
            <b>{pickup ? o.product.store : "Entrega en"}</b>
            <small>{pickup ? o.product.address : o.address}</small>
          </span>
        </div>
        {!pickup && active && (
          <p className="muted-note">
            ComeRICO no muestra al repartidor en tiempo real. Te avisamos en cada cambio de estado.
          </p>
        )}
      </section>
      <section className="total">
        <div>
          <span>
            {o.product.isPack ? "Pack Sorpresa" : o.product.name} × {o.qty}
          </span>
          <b>{money(o.subtotal)}</b>
        </div>
        <div>
          <span>
            {pickup ? "Recojo en tienda" : o.freeShip ? "Envío (beneficio Oro)" : "Envío"}
          </span>
          <b>{o.fee ? money(o.fee) : "Gratis"}</b>
        </div>
        {o.discount > 0 && (
          <div className="discount-line">
            <span>{o.subscriptionId ? "Descuento mensual" : "Cupón"}</span>
            <b>−{money(o.discount)}</b>
          </div>
        )}
        <div className="grand">
          <span>Total · {methodLabel(o.method, o.mode)}</span>
          <b>{money(o.total)}</b>
        </div>
        {!bad && (
          <p className="inline-note">
            <Icon name="star" size={14} />{" "}
            {o.pointsAwarded
              ? `Ganaste ${o.points} pts con este pedido.`
              : `Ganarás ${o.points} pts al ${pickup ? "recogerlo" : "recibirlo"}.`}
          </p>
        )}
      </section>
      <div className="confirmation-actions">
        {active && (
          <button
            className="btn primary"
            onClick={() => {
              const prev = o.status;
              setOrderStatus(o.id, doneStatus, { by: "cliente" });
              notify(`Pedido ${o.id} marcado como ${doneStatus.toLowerCase()}`, () =>
                undoCompletion(o.id, prev),
              );
            }}
          >
            Pedido recibido
          </button>
        )}
        {isCompleted(o) && !o.reviewed && (
          <button
            className="btn primary"
            onClick={() => {
              startReview(o.id);
              go("review");
            }}
          >
            Calificar · +{REVIEW_POINTS} pts
          </button>
        )}
        {canCancel(o) && (
          <button className="btn danger-link" onClick={() => setCancel(true)}>
            Cancelar pedido
          </button>
        )}
        {active && !canCancel(o) && (
          <small className="inline-note">
            El local ya empezó a prepararlo, así que ya no se puede cancelar desde la app.
          </small>
        )}
        <button className="btn ghost" onClick={() => openLegal("claims", o.id)}>
          Reportar un problema
        </button>
      </div>
      {cancel && (
        <Modal label="Cancelar pedido" onClose={() => setCancel(false)}>
          <div className="round-icon logout-icon">
            <Icon name="alert" />
          </div>
          <h2>¿Cancelar el pedido {o.id}?</h2>
          <p>
            Liberamos {o.qty} × {o.product.name} para otra persona. {refund}
            {o.couponId ? " Tu cupón vuelve a tu cuenta." : ""}
          </p>
          <button
            className="btn danger"
            onClick={() => {
              setOrderStatus(o.id, "Cancelado", {
                by: "cliente",
                note: "Cancelaste el pedido antes de que el local empezara a prepararlo.",
              });
              setCancel(false);
            }}
          >
            Sí, cancelar pedido
          </button>
          <button className="btn ghost" onClick={() => setCancel(false)}>
            No, mantenerlo
          </button>
        </Modal>
      )}
      <BottomNav go={go} />
    </div>
  );
}

function Review({ go }: { go: (s: Screen) => void }) {
  const { myOrders, reviewId, submitReview, subs, openSubFor } = useShop();
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(["Buena porción"]);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const order =
    myOrders.find((o) => o.id === reviewId && isCompleted(o)) ??
    myOrders.find((o) => isCompleted(o) && !o.reviewed);
  if (!order)
    return (
      <div className="screen review">
        <Header title="Califica tu experiencia" onBack={() => go("orders")} />
        <div className="empty-state small-empty">
          <h2>No tienes pedidos por calificar</h2>
          <p>Podrás calificar un pedido cuando lo recojas o lo recibas.</p>
          <button className="btn primary" onClick={() => go("orders")}>
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  const rp = order.product;
  return (
    <div className="screen review">
      <Header title="Califica tu experiencia" onBack={() => go("orders")} />
      <div className="verified">
        <Icon name="check" size={15} /> Compra verificada · {order.id}
      </div>
      <img src={rp.photo} alt={rp.name} />
      <h2>{rp.store}</h2>
      <p>¿Cómo estuvo {rp.isPack ? "tu Pack Sorpresa" : rp.name}?</p>
      <div className="stars" role="radiogroup" aria-label="Calificación">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            role="radio"
            aria-checked={n === stars}
            aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
            onClick={() => setStars(n)}
            className={n <= stars ? "active" : ""}
          >
            ★
          </button>
        ))}
      </div>
      <span className="rating-label">
        {["", "Muy malo", "Malo", "Regular", "Bueno", "¡Excelente!"][stars]}
      </span>
      <h3>¿Qué destacarías?</h3>
      <div className="quick-chips">
        {["Buena porción", "Fresco", "Puntual", "Buena atención", "Bien empacado"].map((c) => (
          <button
            key={c}
            className={tags.includes(c) ? "selected" : ""}
            aria-pressed={tags.includes(c)}
            onClick={() => setTags(tags.includes(c) ? tags.filter((x) => x !== c) : [...tags, c])}
          >
            {c}
          </button>
        ))}
      </div>
      <label className="field">
        <span>
          Comentario <small>(opcional)</small>
        </span>
        <textarea
          placeholder="Cuéntanos un poco más..."
          rows={4}
          maxLength={300}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <i>{comment.length}/300</i>
      </label>
      <div className="sticky-action">
        <button
          className="btn primary"
          disabled={order.reviewed}
          onClick={() => {
            submitReview(order.id, stars, tags);
            if (rp.isPack && !subs.some((s) => s.store === rp.store)) setDone(true);
            else go("orders");
          }}
        >
          {order.reviewed
            ? "Ya calificaste este pedido"
            : `Publicar reseña · +${REVIEW_POINTS} pts`}
        </button>
      </div>
      {done && (
        <Modal label="Gracias por tu reseña" onClose={() => go("orders")}>
          <div className="round-icon">
            <Icon name="calendar" />
          </div>
          <h2>¡Gracias! +{REVIEW_POINTS} pts</h2>
          <p>
            ¿Te gustó {rp.store}? Recibe su Pack Sorpresa cada semana, en los días y la franja que
            elijas. Solo se cobra cuando el local confirma tu pack.
          </p>
          <button
            className="btn primary"
            onClick={() => {
              openSubFor(rp.store);
              go("planner");
            }}
          >
            Suscribirme a {rp.store}
          </button>
          <button className="btn ghost" onClick={() => go("orders")}>
            Ahora no
          </button>
        </Modal>
      )}
    </div>
  );
}

function ProfileRow({
  icon,
  label,
  hint,
  value,
  onClick,
}: {
  icon: string;
  label: string;
  hint?: string;
  value?: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick}>
      <Icon name={icon} />
      <span>
        <b className="row-label">{label}</b>
        {hint && <small>{hint}</small>}
      </span>
      {value ? <b className="row-value">{value}</b> : <Icon name="chevron" />}
    </button>
  );
}

function Profile({ go }: { go: (s: Screen) => void }) {
  const {
    notify,
    openHelp,
    openLegal,
    user,
    points,
    activeAddress,
    favorites,
    spins,
    coupons,
    openBenefits,
    role,
    logout,
    notices,
    subs,
  } = useShop();
  const usable = coupons.filter(couponUsable).length;
  const unread = notices.filter((n) => !n.read).length;
  const lvl = levelOf(points);
  const [logoutModal, setLogoutModal] = useState<"one" | "all" | null>(null);
  const [ally, setAlly] = useState(false);
  const guest = role === "guest";
  const info = (
    <section>
      <h3 className="subheading">Más información</h3>
      <div className="list">
        <ProfileRow
          icon="store"
          label="Quiero ser aliado ComeRICO"
          hint="Vende la comida del día de tu negocio"
          onClick={() => setAlly(true)}
        />
        <ProfileRow
          icon="bike"
          label="Quiero ser repartidor"
          onClick={() => notify("Te avisaremos cuando abramos postulaciones de repartidores")}
        />
        <ProfileRow icon="headset" label="Ayuda" onClick={() => openHelp()} />
        <ProfileRow icon="info" label="Términos y condiciones" onClick={() => openLegal("terms")} />
        <ProfileRow
          icon="book"
          label="Libro de reclamaciones"
          onClick={() => openLegal("claims")}
        />
        <ProfileRow
          icon="shield"
          label="Política de privacidad"
          onClick={() => openLegal("privacy")}
        />
      </div>
    </section>
  );
  return (
    <div className="screen with-nav profile-screen">
      <Header
        title="Mi perfil"
        action={
          guest ? undefined : (
            <button className="text-action" onClick={() => go("edit-profile")}>
              Editar
            </button>
          )
        }
      />
      {guest ? (
        <div className="guest-card">
          <b>Estás explorando como invitado</b>
          <p>Crea tu cuenta para pagar, seguir tus pedidos, suscribirte y sumar puntos.</p>
          <button className="btn primary" onClick={() => go("signup")}>
            Crear cuenta
          </button>
          <button className="btn ghost" onClick={logout}>
            Ya tengo cuenta · iniciar sesión
          </button>
        </div>
      ) : (
        <>
          <div className="profile-head">
            <UserAvatar big />
            <h2>
              {user.first} {user.last}
            </h2>
            <p>{user.email}</p>
            <button className="pill-btn" onClick={() => go("edit-profile")}>
              Editar datos personales
            </button>
          </div>
          <section className="level-card">
            <div className="level-title">
              <LevelBadge level={lvl} />
              <button onClick={() => openHelp("levels")}>
                <Icon name="info" size={18} /> ¿Cómo funcionan?
              </button>
            </div>
            <h2>{fmtPts(points)} puntos</h2>
            <LevelBar pts={points} />
            <div className="benefit">
              <Icon name="check" />
              <span>
                <b>Nivel {lvl.name} · gratis, por tu actividad</b>
                <small>{lvl.perks[lvl.perks.length - 1]}</small>
              </span>
            </div>
            <button className="btn ghost small-btn" onClick={() => openBenefits("nivel")}>
              Ver mis beneficios
            </button>
          </section>

          <section>
            <h3 className="subheading">Beneficios</h3>
            <div className="list">
              <ProfileRow
                icon="trophy"
                label="Mis beneficios"
                hint={`Nivel ${lvl.name} · ${usable} ${usable === 1 ? "cupón" : "cupones"}`}
                onClick={() => openBenefits(usable ? "cupones" : "nivel")}
              />
              <ProfileRow
                icon="gift"
                label="Gira y gana"
                hint={`${spins} ${spins === 1 ? "giro disponible" : "giros disponibles"}`}
                onClick={() => go("roulette")}
              />
            </div>
          </section>

          <section>
            <h3 className="subheading">Mi cuenta</h3>
            <div className="list">
              <ProfileRow
                icon="user"
                label="Datos personales"
                hint="Nombre, DNI y celular"
                onClick={() => go("edit-profile")}
              />
              <ProfileRow
                icon="pin"
                label="Direcciones"
                hint={activeAddress}
                onClick={() => go("locations")}
              />
              <ProfileRow
                icon="heart"
                label="Favoritos"
                hint={
                  favorites.length
                    ? `${favorites.length} ${favorites.length === 1 ? "local guardado" : "locales guardados"}`
                    : "Guarda locales con el corazón"
                }
                onClick={() => go("favorites")}
              />
              <ProfileRow
                icon="calendar"
                label="Mis suscripciones"
                hint={
                  subs.length
                    ? `${subs.filter((s) => !s.paused).length} activas`
                    : "Recibe packs de tus locales favoritos"
                }
                onClick={() => go("planner")}
              />
              <ProfileRow
                icon="card"
                label="Métodos de pago"
                hint="Yape / Plin (principal) · Tarjeta ···· 4821"
                onClick={() => notify("Pronto podrás administrar tus métodos de pago aquí")}
              />
              <ProfileRow
                icon="receipt"
                label="Datos de facturación"
                onClick={() => notify("Pronto podrás agregar tu RUC para facturas")}
              />
            </div>
          </section>

          <section>
            <h3 className="subheading">Configuración</h3>
            <div className="list">
              <ProfileRow
                icon="bell"
                label="Notificaciones"
                hint={unread ? `${unread} sin leer · preferencias` : "Avisos y preferencias"}
                onClick={() => go("notifications")}
              />
            </div>
          </section>
        </>
      )}

      {info}

      {!guest && (
        <div className="session-actions">
          <button className="btn soft" onClick={() => setLogoutModal("one")}>
            <Icon name="logout" /> Cerrar sesión
          </button>
          <button className="btn ghost" onClick={() => setLogoutModal("all")}>
            <Icon name="logout" /> Cerrar todas las sesiones
          </button>
        </div>
      )}
      <p className="app-version">
        Versión 1.1.0 (prototipo)
        <br />
        Hecho con 🧡 en Lima
      </p>

      <BottomNav active="profile" go={go} />
      {logoutModal && (
        <Modal label="Cerrar sesión" onClose={() => setLogoutModal(null)}>
          <div className="round-icon logout-icon">
            <Icon name="logout" />
          </div>
          <h2>{logoutModal === "one" ? "¿Cerrar sesión?" : "¿Cerrar todas las sesiones?"}</h2>
          <p>
            {logoutModal === "one"
              ? "Podrás volver a ingresar cuando quieras con tu correo y contraseña. Tus pedidos se mantienen."
              : "Se cerrará tu cuenta en todos los dispositivos donde hayas ingresado."}
          </p>
          <button className="btn danger" onClick={logout}>
            {logoutModal === "one" ? "Sí, cerrar sesión" : "Sí, cerrar todas"}
          </button>
          <button className="btn ghost" onClick={() => setLogoutModal(null)}>
            Seguir en ComeRICO
          </button>
        </Modal>
      )}
      {ally && (
        <Modal label="Ser aliado ComeRICO" onClose={() => setAlly(false)}>
          <div className="round-icon">
            <Icon name="store" />
          </div>
          <h2>Vende en ComeRICO</h2>
          <p>
            Para vender en ComeRICO tu negocio necesita una cuenta de aliado. Déjanos tu interés y
            un asesor te contactará para activarla.
          </p>
          <button
            className="btn primary"
            onClick={() => {
              setAlly(false);
              notify(
                `Recibimos tu interés${user.email ? `: te escribiremos a ${user.email}` : ""}`,
              );
            }}
          >
            Quiero que me contacten
          </button>
          <small className="muted-note">
            Demo: para ver el panel de negocio, cierra sesión e ingresa con el usuario Negocio.
          </small>
          <button className="btn ghost" onClick={() => setAlly(false)}>
            Cerrar
          </button>
        </Modal>
      )}
    </div>
  );
}

function Notifications({ go }: { go: (s: Screen) => void }) {
  const { notices, markNoticesRead, noticePrefs, setNoticePrefs, goBack, openOrder } = useShop();
  const [fresh] = useState(() => notices.filter((n) => !n.read).map((n) => n.id));
  useEffect(() => {
    markNoticesRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggle = (k: NoticeKind) => setNoticePrefs({ ...noticePrefs, [k]: !noticePrefs[k] });
  return (
    <div className="screen with-nav">
      <Header title="Notificaciones" onBack={goBack} />
      <h3 className="subheading">Avisos</h3>
      {notices.length === 0 ? (
        <p className="muted-note">
          Aún no tienes avisos. Aquí verás cuándo tu pedido está listo, recordatorios de recojo y
          novedades de tus suscripciones.
        </p>
      ) : (
        <div className="list notice-list">
          {notices.map((n) => (
            <button
              key={n.id}
              className={fresh.includes(n.id) ? "is-new" : ""}
              onClick={() => n.orderId && openOrder(n.orderId)}
              disabled={!n.orderId}
            >
              <Icon
                name={
                  n.kind === "pedidos" ? "bag" : n.kind === "suscripciones" ? "calendar" : "gift"
                }
              />
              <span>
                <b className="row-label">{n.text}</b>
                <small>
                  {dayLabel(n.day)} · {minLabel(n.at)}
                  {fresh.includes(n.id) && " · nuevo"}
                </small>
              </span>
              {n.orderId && <Icon name="chevron" />}
            </button>
          ))}
        </div>
      )}
      <h3 className="subheading">Preferencias</h3>
      <div className="list">
        <SwitchRow
          icon="bag"
          label="Pedidos"
          hint="Estados, recordatorios de recojo y cancelaciones"
          on={noticePrefs.pedidos}
          onToggle={() => toggle("pedidos")}
        />
        <SwitchRow
          icon="calendar"
          label="Suscripciones"
          hint="Entregas confirmadas, saltadas o sin pack"
          on={noticePrefs.suscripciones}
          onToggle={() => toggle("suscripciones")}
        />
        <SwitchRow
          icon="gift"
          label="Premios"
          hint="Cupones, giros y niveles"
          on={noticePrefs.premios}
          onToggle={() => toggle("premios")}
        />
      </div>
      <p className="muted-note">
        Los avisos siempre quedan guardados aquí; si desactivas una categoría dejamos de mostrártela
        como alerta. Por ahora los avisos llegan dentro de la app: las notificaciones push llegarán
        en una próxima versión.
      </p>
      <BottomNav go={go} />
    </div>
  );
}

function EditProfile({ go }: { go: (s: Screen) => void }) {
  const { user, setUser, notify } = useShop();
  const [form, setForm] = useState<User>(user);
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState(false);

  const errors: Partial<Record<keyof User, string>> = {};
  if (form.first.trim().length < 2) errors.first = "Ingresa tu nombre.";
  if (form.last.trim().length < 2) errors.last = "Ingresa tu apellido.";
  if (form.dni && !/^\d{8}$/.test(form.dni)) errors.dni = "El DNI debe tener 8 dígitos.";
  if (!/^9\d{8}$/.test(form.phone))
    errors.phone = "Ingresa un celular de 9 dígitos que empiece con 9.";

  const dirty = (Object.keys(form) as (keyof User)[]).some((k) => form[k] !== user[k]);
  const valid = Object.keys(errors).length === 0;

  const set = (k: keyof User, v: string) => {
    setForm({ ...form, [k]: v });
    setTouched(true);
    setSaved(false);
  };

  const save = () => {
    if (!valid || !dirty) return;
    setUser({
      ...form,
      first: form.first.trim(),
      last: form.last.trim(),
      nickname: form.nickname.trim(),
    });
    setSaved(true);
    setTouched(false);
  };

  const field = (
    k: keyof User,
    label: string,
    placeholder: string,
    opts: { required?: boolean; inputMode?: "numeric" | "tel"; max?: number } = {},
  ) => (
    <label className={`field ${touched && errors[k] ? "has-error" : ""}`}>
      <span>
        {label}
        {opts.required && "*"}
      </span>
      <div className="clear-field">
        <input
          value={form[k]}
          inputMode={opts.inputMode}
          placeholder={placeholder}
          onChange={(e) =>
            set(
              k,
              opts.inputMode
                ? e.target.value.replace(/\D/g, "").slice(0, opts.max)
                : e.target.value,
            )
          }
        />
        {form[k] && (
          <button type="button" aria-label={`Borrar ${label}`} onClick={() => set(k, "")}>
            <Icon name="x" size={16} />
          </button>
        )}
      </div>
      {touched && errors[k] && <em>{errors[k]}</em>}
    </label>
  );

  return (
    <div className="screen edit-profile">
      <Header title="Datos personales" onBack={() => go("profile")} />
      <div className="profile-head">
        <UserAvatar big />
        <button
          className="pill-btn"
          onClick={() => notify("Pronto podrás subir una foto desde tu galería")}
        >
          <Icon name="camera" size={16} /> Editar imagen
        </button>
      </div>
      <div className="login-form">
        {field("nickname", "¿Cómo te llaman tus amigos?", "Ej. Vale, Pipe, Cami, Mari…")}
        {field("first", "Nombre", "Tu nombre", { required: true })}
        {field("last", "Apellido", "Tu apellido", { required: true })}
        {field("dni", "Número de DNI", "Ejemplo: 45678912", { inputMode: "numeric", max: 8 })}
        <label className="field locked">
          <span>Correo electrónico*</span>
          <div className="clear-field">
            <input value={form.email} disabled />
            <Icon name="lock" size={18} />
          </div>
          <small className="verified">
            <Icon name="check" size={14} /> Email verificado con éxito
          </small>
        </label>
        {field("phone", "Celular", "9XX XXX XXX", { required: true, inputMode: "tel", max: 9 })}
        {saved && (
          <div className="save-ok" role="status">
            <Icon name="check" size={18} /> Tus datos se guardaron correctamente.
          </div>
        )}
      </div>
      <div className="sticky-action">
        <button className="btn primary" disabled={!dirty || !valid} onClick={save}>
          Guardar
        </button>
      </div>
    </div>
  );
}

function Levels({ go }: { go: (s: Screen) => void }) {
  const {
    points,
    history,
    myOrders,
    benefitsTab,
    goBack,
    coupons,
    spins,
    openHelp,
    freeShipAvailable,
  } = useShop();
  const [tab, setTab] = useState<BenefitsTab>(benefitsTab);
  const usableCoupons = coupons.filter(couponUsable);
  const idx = levelIndex(points);
  const lvl = LEVELS[idx];
  const month = dateKey(0).slice(0, 7);
  const done = myOrders.filter((o) => isCompleted(o) && o.day.startsWith(month));
  const packs = done.reduce((acc, o) => acc + o.qty, 0);
  const saved = done.reduce((acc, o) => acc + (o.product.oldPrice - o.product.price) * o.qty, 0);
  const fullValue = done.reduce((acc, o) => acc + o.product.oldPrice * o.qty, 0);
  const avgPct = fullValue ? Math.round((saved / fullValue) * 100) : 0;
  const ledger = history.reduce((acc, h) => acc + h.pts, 0);
  return (
    <div className="screen with-nav levels-screen">
      <Header
        title="Mis beneficios"
        onBack={goBack}
        action={
          <button
            className="icon-btn"
            aria-label="Cómo funcionan los niveles"
            onClick={() => openHelp("levels")}
          >
            <Icon name="help" />
          </button>
        }
      />
      <section className="level-hero" style={{ background: lvl.bg }}>
        <div className="level-hero-top">
          <div className="levelup-medal" style={{ background: "#fff", color: lvl.color }}>
            <Icon name="trophy" size={30} />
          </div>
          <div>
            <small>Tu nivel · gratis, por tu actividad</small>
            <h2 style={{ color: lvl.color }}>{lvl.name}</h2>
            <b>{fmtPts(points)} pts</b>
          </div>
        </div>
        <LevelBar pts={points} />
        {nextLevel(points) && (
          <small className="inline-note">
            ≈ {ordersToNext(points)} {ordersToNext(points) === 1 ? "pedido" : "pedidos"} completados
            más para llegar a {nextLevel(points)!.name}
          </small>
        )}
      </section>
      <div className="benefit-tabs" role="tablist">
        {(
          [
            ["nivel", "Nivel y puntos"],
            ["cupones", `Cupones${usableCoupons.length ? ` (${usableCoupons.length})` : ""}`],
          ] as [BenefitsTab, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            className={tab === k ? "active" : ""}
            onClick={() => setTab(k)}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "nivel" && (
        <>
          <section>
            <h3 className="subheading">Beneficios por nivel</h3>
            <div className="ladder">
              {LEVELS.map((l, i) => {
                const state = i < idx ? "done" : i === idx ? "current" : "locked";
                return (
                  <div key={l.name} className={`ladder-item ${state}`}>
                    <span
                      className="ladder-dot"
                      style={{ background: state === "locked" ? "#d6d3d1" : l.color }}
                    >
                      <Icon name={state === "locked" ? "lock" : "check"} size={14} />
                    </span>
                    <div
                      className="ladder-body"
                      style={state === "current" ? { borderColor: l.color } : undefined}
                    >
                      <div className="ladder-head">
                        <LevelBadge level={l} small />
                        <small>
                          {state === "current"
                            ? "Tu nivel"
                            : state === "done"
                              ? "Superado"
                              : `Desde ${fmtPts(l.min)} pts · te faltan ${fmtPts(l.min - points)}`}
                        </small>
                      </div>
                      <ul>
                        {l.perks.map((perk) => (
                          <li key={perk}>{perk}</li>
                        ))}
                      </ul>
                      {l.name === "Oro" && state === "current" && (
                        <small className="inline-note">
                          {freeShipAvailable
                            ? "Tu envío gratis de esta semana está disponible."
                            : "Ya usaste tu envío gratis de esta semana."}
                        </small>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="muted-note">
              El nivel es un reconocimiento por usar ComeRICO: no se paga ni vence.
            </p>
          </section>

          <section>
            <h3 className="subheading">Cómo ganar puntos</h3>
            <div className="list">
              <button onClick={() => go("home")}>
                <Icon name="bag" />
                <span>
                  <b className="row-label">Completa tus pedidos</b>
                  <small>
                    {POINTS_PER_SOL} pts por cada S/ 1 de productos, al recoger o recibir
                  </small>
                </span>
                <Icon name="chevron" />
              </button>
              <button onClick={() => go("orders")}>
                <Icon name="star" />
                <span>
                  <b className="row-label">Califica tus pedidos</b>
                  <small>+{REVIEW_POINTS} pts por reseña de un pedido completado</small>
                </span>
                <Icon name="chevron" />
              </button>
              <button onClick={() => openHelp("cancel")}>
                <Icon name="clock" />
                <span>
                  <b className="row-label">Recoge a tiempo</b>
                  <small>Los pedidos cancelados o no recogidos no suman puntos</small>
                </span>
                <Icon name="chevron" />
              </button>
            </div>
          </section>

          <section>
            <h3 className="subheading">Tu ahorro este mes</h3>
            <div className="impact-grid">
              <div>
                <Icon name="bag" />
                <b>{packs}</b>
                <small>packs del mes</small>
              </div>
              <div>
                <Icon name="star" />
                <b>{avgPct}%</b>
                <small>ahorro promedio</small>
              </div>
              <div>
                <Icon name="coin" />
                <b>{money(saved)}</b>
                <small>ahorrados</small>
              </div>
            </div>
          </section>

          <section>
            <h3 className="subheading">Movimientos de puntos</h3>
            <div className="list history-list">
              {history.map((h) => (
                <div key={h.id} className="history-row">
                  <span>
                    <b>{h.label}</b>
                    <small>
                      {h.detail} · {h.date}
                    </small>
                  </span>
                  <strong className={h.pts < 0 ? "neg" : ""}>
                    {h.pts >= 0 ? "+" : "−"}
                    {Math.abs(h.pts)}
                  </strong>
                </div>
              ))}
              <div className="history-row total-row">
                <span>
                  <b>Saldo</b>
                  <small>Suma de todos tus movimientos</small>
                </span>
                <strong>{fmtPts(ledger)}</strong>
              </div>
            </div>
          </section>
        </>
      )}
      {tab === "cupones" && (
        <section>
          <div className="coupon-intro">
            <span className={`spins-pill ${spins ? "" : "empty"}`}>
              <Icon name="ticket" size={15} /> {spins}{" "}
              {spins === 1 ? "giro disponible" : "giros disponibles"}
            </span>
            <button className="btn primary small-btn" onClick={() => go("roulette")}>
              <Icon name="gift" size={16} /> Ir a la ruleta
            </button>
          </div>
          <div className="coupon-list">
            {usableCoupons.length ? (
              usableCoupons.map((c) => <CouponRow key={c.id} c={c} />)
            ) : (
              <p className="muted-note">
                Aún no tienes cupones. Ganas uno al subir de nivel y en la ruleta, que te da un giro
                por cada pedido completado.
              </p>
            )}
          </div>
          <p className="muted-note">
            El cupón que apliques aquí se preselecciona en tu próximo pago. Usas uno por pedido.
          </p>
        </section>
      )}
      <BottomNav go={go} />
    </div>
  );
}

type SubDraft = Subscription & { isNew: boolean };

function Planner({ go }: { go: (s: Screen) => void }) {
  const {
    subs,
    saveSub,
    removeSub,
    toggleSkip,
    setPaused,
    subDraft,
    clearSubDraft,
    places,
    activeAddress,
    openHelp,
    orders,
    role,
    notify,
    openOrder,
  } = useShop();
  const today = todayIndex();
  const [dayOff, setDayOff] = useState(0);
  const [picker, setPicker] = useState(false);
  const [sheet, setSheet] = useState<SubDraft | null>(null);
  const [confirmNew, setConfirmNew] = useState<Subscription | null>(null);
  const [sheetError, setSheetError] = useState("");

  const defaultPlace =
    (hasCoverage(activeAddress)
      ? activeAddress
      : places.find((p) => hasCoverage(p.address))?.address) ?? "";
  const openNew = (store: string) => {
    const o = offerFor(store);
    setSheetError("");
    setSheet({
      uid: `sub-${Date.now()}`,
      store,
      days: [o.days.includes(today) ? today : o.days[0]],
      slot: subSlots(o)[0],
      mode: "pickup",
      place: defaultPlace,
      duration: "1w",
      start: dateKey(0),
      paused: false,
      skipped: [],
      isNew: true,
    });
  };

  useEffect(() => {
    if (!subDraft) return;
    const existing = subs.find((s) => s.store === subDraft);
    if (existing) setSheet({ ...existing, isNew: false });
    else openNew(subDraft);
    clearSubDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const occ = upcoming(subs);
  const orderFor = (oc: Occurrence) =>
    orders.find((o) => o.subscriptionId === oc.sub.uid && o.day === oc.key);
  const occStatus = (oc: Occurrence): StatusLabel => {
    if (oc.sub.skipped.includes(oc.key)) return "Saltada";
    const ord = orderFor(oc);
    if (ord) return ord.status;
    if (oc.offset === 0 && nowMin() >= offerFor(oc.sub.store).to) return "Sin confirmar";
    return "Programada";
  };
  const dayOcc = occ.filter((oc) => oc.offset === dayOff);
  const weekly = subs
    .filter((s) => !s.paused)
    .reduce((acc, s) => acc + subPrice(s) * s.days.length, 0);
  const dayName = (off: number) => (off === 0 ? "Hoy" : capitalize(WEEKDAYS[(today + off) % 7]));
  const placeName = (addr: string) => places.find((pl) => pl.address === addr)?.name ?? addr;
  const durationText = (s: Subscription) => {
    const end = subEnd(s);
    return end ? `hasta el ${keyLabel(end)}` : "sin fecha de fin";
  };

  const validate = (s: Subscription) => {
    const o = offerFor(s.store);
    if (!s.days.length) return "Elige al menos un día.";
    if (s.days.some((d) => !o.days.includes(d)))
      return `${s.store} solo entrega packs ${daysShort(o.days)}.`;
    if (!subSlots(o).includes(s.slot))
      return `Elige una franja dentro de la ventana ${windowLabel(o.from, o.to)}`;
    if (s.mode === "delivery") {
      if (!s.place) return "Elige una dirección de entrega.";
      if (!hasCoverage(s.place)) return `Aún no hacemos delivery en ${zoneOf(s.place)}.`;
    }
    return "";
  };
  const saveSheet = () => {
    if (!sheet) return;
    const { isNew, ...sub } = sheet;
    const err = validate(sub);
    if (err) {
      setSheetError(err);
      return;
    }
    if (isNew) {
      setConfirmNew(sub);
      setSheet(null);
      return;
    }
    saveSub(sub);
    setSheet(null);
    notify("Suscripción actualizada · aplica desde la próxima entrega sin confirmar");
  };

  if (role === "guest")
    return (
      <div className="screen with-nav planner-screen">
        <Header title="Suscripciones" />
        <div className="empty-state plan-empty">
          <div className="empty-illustration">
            <Icon name="calendar" size={55} />
          </div>
          <h2>Crea tu cuenta para suscribirte</h2>
          <p>
            Elige cualquier local y recibe sus packs con un plan semanal o mensual.
          </p>
          <button className="btn primary" onClick={() => go("signup")}>
            Crear cuenta
          </button>
        </div>
        <BottomNav active="planner" go={go} />
      </div>
    );

  const eligible = offers;
  return (
    <div className="screen with-nav planner-screen">
      <Header
        title="Suscripciones"
        action={
          <button
            className="icon-btn"
            aria-label="Cómo funcionan las suscripciones"
            onClick={() => openHelp("subscription")}
          >
            <Icon name="help" />
          </button>
        }
      />
      {subs.length === 0 ? (
        <div className="empty-state plan-empty">
          <div className="empty-illustration">
            <Icon name="calendar" size={55} />
          </div>
          <h2>Recibe packs de tus locales favoritos</h2>
          <p>
            Suscríbete a cualquier local sin compras previas. Elige un plan semanal o mensual
            (4 semanas), con 10 % de descuento en packs en el mensual.
          </p>
          {eligible.length ? (
            <button className="btn primary" onClick={() => setPicker(true)}>
              Suscribirme a un local
            </button>
          ) : (
            <button className="btn primary" onClick={() => go("home")}>
              Pedir mi primer pack
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="plan-sub">Tus entregas de los próximos 7 días.</p>
          <div className="week-strip">
            {Array.from({ length: 7 }, (_, off) => {
              const n = occ.filter(
                (oc) => oc.offset === off && !oc.sub.skipped.includes(oc.key),
              ).length;
              return (
                <button
                  key={off}
                  className={`week-day ${off === dayOff ? "active" : ""} ${n ? "has" : ""}`}
                  onClick={() => setDayOff(off)}
                  aria-pressed={off === dayOff}
                  aria-label={`${dayName(off)}: ${n} entregas`}
                >
                  <small>{off === 0 ? "Hoy" : WEEKDAYS[(today + off) % 7].slice(0, 3)}</small>
                  <strong>{dayNumber(off)}</strong>
                  <i>
                    {Array.from({ length: Math.min(n, 3) }).map((_, j) => (
                      <b key={j} />
                    ))}
                  </i>
                </button>
              );
            })}
          </div>
          <div className="day-head">
            <h2>{dayName(dayOff)}</h2>
            <span>
              {dayOcc.length} {dayOcc.length === 1 ? "entrega" : "entregas"}
            </span>
          </div>
          <div className="day-list">
            {dayOcc.length ? (
              dayOcc.map((oc) => {
                const o = offerFor(oc.sub.store);
                const st = occStatus(oc);
                const ord = orderFor(oc);
                return (
                  <div key={oc.sub.uid + oc.key} className="plan-card">
                    <img src={o.photo} alt="" />
                    <span className="plan-info">
                      <b>{oc.sub.store}</b>
                      <small>
                        {slotLabel({ from: oc.sub.slot, to: oc.sub.slot + 30 })} ·{" "}
                        {oc.sub.mode === "pickup"
                          ? "Recojo"
                          : `Delivery a ${placeName(oc.sub.place)}`}
                      </small>
                      <Status type={st} />
                      <span className="sub-actions">
                        {ord ? (
                          <button className="mini-btn" onClick={() => openOrder(ord.id)}>
                            Ver pedido
                          </button>
                        ) : st === "Programada" || st === "Saltada" ? (
                          <button
                            className="mini-btn"
                            onClick={() => toggleSkip(oc.sub.uid, oc.key)}
                          >
                            {st === "Saltada" ? "No saltar" : "Saltar"}
                          </button>
                        ) : null}
                      </span>
                    </span>
                    <span className="plan-price">{money(subPrice(oc.sub))}</span>
                  </div>
                );
              })
            ) : (
              <div className="day-empty">No tienes entregas este día.</div>
            )}
          </div>
          <h3 className="subheading">Mis suscripciones</h3>
          <div className="day-list">
            {subs.map((s) => {
              const o = offerFor(s.store);
              return (
                <button
                  key={s.uid}
                  className="plan-card"
                  onClick={() => {
                    setSheetError("");
                    setSheet({ ...s, days: [...s.days], isNew: false });
                  }}
                >
                  <img src={o.photo} alt="" />
                  <span className="plan-info">
                    <b>{s.store}</b>
                    <small>
                      {capitalize(daysPhrase(s.days))} · {minLabel(s.slot)}
                    </small>
                    <em>
                      {s.duration === "4w" ? "Mensual -10 %" : s.duration === "1w" ? "Semanal" : "Plan vigente"} · {s.mode === "pickup" ? "Recojo" : "Delivery"} · {durationText(s)}
                    </em>
                    <Status type={s.paused ? "Pausada" : "Activa"} />
                  </span>
                  <span className="plan-price">{money(subPrice(s))}</span>
                </button>
              );
            })}
          </div>
          {eligible.some((o) => !subs.some((s) => s.store === o.name)) && (
            <button className="btn ghost add-day-btn" onClick={() => setPicker(true)}>
              <Icon name="plus" size={18} /> Suscribirme a otro local
            </button>
          )}
          <div className="plan-bar">
            <span>
              <strong>
                ≈ {money(weekly)}
                <small> / semana</small>
              </strong>
              <small>Se cobra cada entrega cuando el local la confirma</small>
            </span>
          </div>
        </>
      )}

      {picker && (
        <Modal label="Elige un local" className="sheet" onClose={() => setPicker(false)}>
          <h2>Elige un local</h2>
          <p>Elige cualquier local, sin compras previas. Plan semanal o mensual con 10 % de descuento en packs.</p>
          <div className="picker-list">
            {offers.map((o) => {
              const has = subs.some((s) => s.store === o.name);
              return (
                <button
                  key={o.name}
                  className="plan-card"
                  disabled={has}
                  onClick={() => {
                    setPicker(false);
                    openNew(o.name);
                  }}
                >
                  <img src={o.photo} alt="" />
                  <span className="plan-info">
                    <b>{o.name}</b>
                    <small>
                      {daysShort(o.days)} · {windowLabel(o.from, o.to)}
                    </small>
                    <em>{has ? "Ya estás suscrito" : o.pack}</em>
                  </span>
                  <span className="plan-price">{o.price}</span>
                </button>
              );
            })}
          </div>
          <button className="btn ghost" onClick={() => setPicker(false)}>
            Cancelar
          </button>
        </Modal>
      )}

      {sheet &&
        (() => {
          const o = offerFor(sheet.store);
          const price = subPrice(sheet);
          return (
            <Modal
              label={`Suscripción a ${sheet.store}`}
              className="sheet plan-sheet"
              onClose={() => setSheet(null)}
            >
              <h2>{sheet.store}</h2>
              <p>
                Pack Sorpresa · entrega packs {daysShort(o.days)} de {windowLabel(o.from, o.to)}
              </p>
              <span className="editor-label">Días</span>
              <div className="weekday-toggles">
                {WEEKDAYS.map((n, i) => {
                  const on = sheet.days.includes(i);
                  const offered = o.days.includes(i);
                  return (
                    <button
                      key={n}
                      className={on ? "active" : ""}
                      aria-pressed={on}
                      aria-label={`${n}${offered ? "" : " (sin packs)"}`}
                      disabled={!offered}
                      title={offered ? undefined : `${sheet.store} no entrega packs este día`}
                      onClick={() =>
                        setSheet({
                          ...sheet,
                          days: on
                            ? sheet.days.filter((x) => x !== i)
                            : [...sheet.days, i].sort((a, b) => a - b),
                        })
                      }
                    >
                      {n.slice(0, 2)}
                    </button>
                  );
                })}
              </div>
              <span className="editor-label">Franja</span>
              <div className="time-chips">
                {subSlots(o).map((t) => (
                  <button
                    key={t}
                    className={t === sheet.slot ? "active" : ""}
                    aria-pressed={t === sheet.slot}
                    onClick={() => setSheet({ ...sheet, slot: t })}
                  >
                    {slotLabel({ from: t, to: t + 30 })}
                  </button>
                ))}
              </div>
              <span className="editor-label">Modalidad</span>
              <div className="login-tabs mode-tabs" role="tablist" aria-label="Modalidad">
                {(["pickup", "delivery"] as DeliveryMode[]).map((m) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={sheet.mode === m}
                    className={sheet.mode === m ? "active" : ""}
                    onClick={() => setSheet({ ...sheet, mode: m })}
                  >
                    {m === "pickup" ? "Recojo · gratis" : `Delivery · ${money(DELIVERY_FEE)}`}
                  </button>
                ))}
              </div>
              {sheet.mode === "delivery" && (
                <>
                  <span className="editor-label">Lugar</span>
                  <div className="place-chips">
                    {places.map((pl) => {
                      const ok = hasCoverage(pl.address);
                      return (
                        <button
                          key={pl.name}
                          className={pl.address === sheet.place ? "selected" : ""}
                          disabled={!ok}
                          onClick={() => setSheet({ ...sheet, place: pl.address })}
                        >
                          <Icon name="pin" size={13} /> {pl.name}
                          {!ok && " (sin cobertura)"}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              <span className="editor-label">Plan de suscripción</span>
              <div className="time-chips">
                {DURATIONS.map(([k, label]) => (
                  <button
                    key={k}
                    className={sheet.duration === k ? "active" : ""}
                    aria-pressed={sheet.duration === k}
                    onClick={() => setSheet({ ...sheet, duration: k })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="muted-note">
                Semanal: {money(subPrice({ ...sheet, duration: "1w" }))} por entrega.
                Mensual (4 semanas): {money(subPrice({ ...sheet, duration: "4w" }))} por entrega.
                Ahorra 10 % en el pack; el envío mantiene su precio.
              </p>
              <p className="sheet-preview">
                {sheet.days.length ? capitalize(daysPhrase(sheet.days)) : "Elige los días"} entre{" "}
                <b>{slotLabel({ from: sheet.slot, to: sheet.slot + 30 })}</b>
                {sheet.mode === "delivery" ? ` en ${placeName(sheet.place)}` : " en el local"}.
                <br />
                <b>{money(price)} por entrega</b> · ≈ {money(price * sheet.days.length)} por semana
                {sheet.duration !== "open" &&
                  ` · ≈ ${money(price * sheet.days.length * DURATION_WEEKS[sheet.duration])} en total`}
              </p>
              <small className="sheet-note">
                Se cobra cada entrega cuando el local confirma tu pack ese día. Si no hay pack, no
                se cobra.
              </small>
              {sheetError && (
                <div className="login-error" role="alert">
                  <Icon name="alert" size={18} />
                  <span>{sheetError}</span>
                </div>
              )}
              <div className="sheet-actions">
                {sheet.isNew ? (
                  <button className="btn ghost" onClick={() => setSheet(null)}>
                    Cancelar
                  </button>
                ) : (
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setPaused(sheet.uid, !sheet.paused);
                      setSheet(null);
                    }}
                  >
                    {sheet.paused ? "Reanudar" : "Pausar"}
                  </button>
                )}
                <button className="btn primary" onClick={saveSheet}>
                  {sheet.isNew ? "Revisar y confirmar" : "Guardar cambios"}
                </button>
              </div>
              {!sheet.isNew && (
                <button
                  className="btn ghost danger-text"
                  onClick={() => {
                    removeSub(sheet.uid);
                    setSheet(null);
                  }}
                >
                  Cancelar suscripción
                </button>
              )}
            </Modal>
          );
        })()}

      {confirmNew && (
        <Modal
          label="Confirma tu suscripción"
          className="sheet"
          onClose={() => setConfirmNew(null)}
        >
          <h2>Confirma tu suscripción</h2>
          <p>{confirmNew.duration === "4w" ? "Plan mensual - 4 semanas - 10 % de descuento en packs" : "Plan semanal - 1 semana"}</p>
          <div className="plan-summary">
            <div>
              <span>{confirmNew.store}</span>
              <b>{money(subPrice(confirmNew))} / entrega</b>
            </div>
            <div>
              <span>
                {capitalize(daysPhrase(confirmNew.days))} ·{" "}
                {slotLabel({ from: confirmNew.slot, to: confirmNew.slot + 30 })}
              </span>
              <b>{confirmNew.mode === "pickup" ? "Recojo" : "Delivery"}</b>
            </div>
            <div className="grand">
              <span>Estimado por semana</span>
              <b>≈ {money(subPrice(confirmNew) * confirmNew.days.length)}</b>
            </div>
          </div>
          <ul className="perk-list plain">
            <li>
              <Icon name="card" size={16} /> Cada entrega se cobra recién cuando el local confirma
              tu pack ese día, con Yape / Plin (tu método principal). No hay cobro por adelantado.
            </li>
            <li>
              <Icon name="alert" size={16} /> Si el local no tiene pack, no se cobra y te avisamos.
            </li>
            <li>
              <Icon name="calendar" size={16} /> Termina {durationText(confirmNew)}. Puedes saltar
              una entrega, pausar o cancelar cuando quieras.
            </li>
            <li>
              <Icon name="star" size={16} /> Cada entrega completada suma puntos como un pedido
              normal.
            </li>
          </ul>
          <div className="sheet-actions">
            <button
              className="btn ghost"
              onClick={() => {
                setSheet({ ...confirmNew, isNew: true });
                setConfirmNew(null);
              }}
            >
              Revisar
            </button>
            <button
              className="btn primary"
              onClick={() => {
                saveSub(confirmNew);
                setConfirmNew(null);
                notify(`Te suscribiste a ${confirmNew.store}`);
              }}
            >
              Confirmar suscripción
            </button>
          </div>
        </Modal>
      )}
      <BottomNav active="planner" go={go} />
    </div>
  );
}

function Locations({ go }: { go: (s: Screen) => void }) {
  const { places, activePlace, setActivePlace, addPlace, goBack } = useShop();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const save = () => {
    if (address.trim().length < 8) {
      setError("Escribe una dirección completa (calle, número y distrito).");
      return;
    }
    const nm = name.trim() || "Otro lugar";
    if (places.some((pl) => pl.name.toLowerCase() === nm.toLowerCase())) {
      setError("Ya tienes una dirección con ese nombre.");
      return;
    }
    addPlace({ name: nm, address: address.trim(), ...pointFor(address.trim()) });
    setAdding(false);
    setName("");
    setAddress("");
    setError("");
  };
  return (
    <div className="screen with-nav">
      <Header title="Mis direcciones" onBack={goBack} />
      <p className="plan-sub">
        Elige dónde buscar packs. Tu dirección activa es <b>{activePlace}</b>: con ella calculamos
        las distancias y la usamos para el delivery.
      </p>
      <div className="list">
        {places.map((pl) => (
          <button
            key={pl.name}
            role="radio"
            aria-checked={pl.name === activePlace}
            onClick={() => setActivePlace(pl.name)}
          >
            <Icon name={pl.name === "Casa" ? "home" : "pin"} />
            <span>
              <b className="row-label">
                {pl.name} {pl.name === activePlace && <em className="active-tag">Activa</em>}
              </b>
              <small>
                {pl.address}
                {!hasCoverage(pl.address) && " · sin cobertura"}
              </small>
            </span>
            <i className={`radio-dot ${pl.name === activePlace ? "on" : ""}`} aria-hidden />
          </button>
        ))}
      </div>
      {adding ? (
        <div className="login-form add-place">
          <label className="field">
            <span>Nombre</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Universidad"
            />
          </label>
          <label className="field">
            <span>Dirección*</span>
            <input
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError("");
              }}
              placeholder="Calle, número y distrito"
            />
          </label>
          {address.trim().length >= 8 && !hasCoverage(address) && (
            <small className="inline-note">
              Aún no tenemos locales ni delivery en {zoneOf(address)}. Puedes guardarla igual.
            </small>
          )}
          {error && (
            <div className="login-error" role="alert">
              <Icon name="alert" size={18} />
              <span>{error}</span>
            </div>
          )}
          <button className="btn primary" onClick={save}>
            Guardar dirección
          </button>
          <button className="btn ghost" onClick={() => setAdding(false)}>
            Cancelar
          </button>
        </div>
      ) : (
        <button className="btn ghost add-day-btn" onClick={() => setAdding(true)}>
          <Icon name="plus" size={18} /> Añadir dirección
        </button>
      )}
      <BottomNav go={go} />
    </div>
  );
}

function WheelArt({ win }: { win: number | null }) {
  const colors = ["#fdba74", "#c2410c", "#15803d", "#facc15", "#7c2d12", "#dcfce7"];
  const dark = [0, 3, 5];
  const pt = (a: number) => `${160 + 156 * Math.sin(a)},${160 - 156 * Math.cos(a)}`;
  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label="Premios: 5%, 10%, S/ 3, envío gratis, 25 o 50 puntos"
    >
      {WHEEL.map((seg, i) => {
        const a0 = (i * Math.PI) / 3;
        const a1 = ((i + 1) * Math.PI) / 3;
        const fill = dark.includes(i) ? "#431407" : "#fff";
        return (
          <g key={seg.label} className={win === null ? "" : i === win ? "seg-win" : "seg-dim"}>
            <path
              d={`M160,160 L${pt(a0)} A156,156 0 0 1 ${pt(a1)} Z`}
              fill={colors[i]}
              stroke="#ffffff90"
              strokeWidth="1.5"
            />
            <g transform={`rotate(${i * 60 + 30} 160 160)`} fill={fill} textAnchor="middle">
              <text x="160" y="58" className="wheel-big">
                {seg.label}
              </text>
              <text x="160" y="80" className="wheel-small">
                {seg.kind === "points"
                  ? "puntos"
                  : seg.kind === "shipping"
                    ? "gratis"
                    : "descuento"}
              </text>
            </g>
          </g>
        );
      })}
      <circle cx="160" cy="160" r="156" fill="none" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

function CouponRow({ c, isNew }: { c: Coupon; isNew?: boolean }) {
  const { selectedCouponId, selectCoupon } = useShop();
  const usable = couponUsable(c);
  const on = usable && c.id === selectedCouponId;
  const hoursLeft = Math.max(1, Math.ceil((c.expiresAt - Date.now()) / 3600000));
  const state =
    c.kind === "points"
      ? "Sumados a tu cuenta"
      : c.used
        ? "Usado"
        : c.expiresAt <= Date.now()
          ? "Vencido"
          : hoursLeft >= 48
            ? `Vence en ${Math.round(hoursLeft / 24)} días`
            : `Vence en ${hoursLeft} h`;
  return (
    <div className={`coupon-row ${on ? "selected" : ""} ${isNew ? "is-new" : ""}`}>
      <span className="coupon-icon">
        <Icon
          name={c.kind === "points" ? "star" : c.kind === "shipping" ? "bike" : "ticket"}
          size={20}
        />
      </span>
      <span>
        <b>{c.name}</b>
        <small>{c.detail}</small>
        <small>{state}</small>
      </span>
      {usable && (
        <button
          className={`outline-btn use-btn ${on ? "on" : ""}`}
          aria-pressed={on}
          onClick={() => selectCoupon(on ? "" : c.id)}
        >
          {on ? "✓ Aplicado" : "Aplicar"}
        </button>
      )}
    </div>
  );
}

function Roulette({ go }: { go: (s: Screen) => void }) {
  const { spins, spin, coupons, points, goBack, openHelp } = useShop();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winIndex, setWinIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<Coupon | null>(null);
  const available = coupons.filter(couponUsable);
  const history = coupons.filter((c) => !couponUsable(c));
  const reduceMotion =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const doSpin = () => {
    if (spinning || spins <= 0) return;
    const idx = pickPrize();
    const target = 360 - (idx * 60 + 30) + (Math.random() * 36 - 18);
    const next = rotation + 6 * 360 + ((((target - rotation) % 360) + 360) % 360);
    const prize = spin(idx);
    setWinner(null);
    setWinIndex(null);
    setSpinning(true);
    setRotation(next);
    setTimeout(
      () => {
        setSpinning(false);
        setWinIndex(idx);
        setWinner(prize);
        navigator.vibrate?.(30);
      },
      reduceMotion ? 300 : 4300,
    );
  };

  const status = spinning
    ? "Girando…"
    : winner
      ? winner.kind === "points"
        ? `¡Ganaste ${winner.value} puntos! Ya están en tu cuenta.`
        : `¡Ganaste ${winner.name}! Úsalo en tu próximo pedido antes de 7 días.`
      : spins
        ? "Toca GIRAR para descubrir tu premio"
        : "Completa un pedido para ganar un giro";

  return (
    <div className="screen with-nav roulette-screen">
      <Header
        title="Gira y gana"
        onBack={goBack}
        action={
          <button
            className="icon-btn"
            aria-label="Cómo funciona la ruleta"
            onClick={() => openHelp("roulette")}
          >
            <Icon name="help" />
          </button>
        }
      />
      <div className="roulette-head">
        <span className={`spins-pill ${spins ? "" : "empty"}`}>
          <Icon name="ticket" size={15} /> {spins}{" "}
          {spins === 1 ? "giro disponible" : "giros disponibles"}
        </span>
        <small>{fmtPts(points)} pts</small>
      </div>
      <div className="wheel-wrap">
        <div className="wheel-pointer" aria-hidden />
        <div
          className={`wheel-disc ${spinning ? "spinning" : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <WheelArt win={winIndex} />
        </div>
        <button className="wheel-center" onClick={doSpin} disabled={spinning || spins <= 0}>
          <b>{spinning ? "…" : spins ? "GIRAR" : "SIN GIROS"}</b>
        </button>
      </div>
      <p
        className={`roulette-status ${winner && !spinning ? "win" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status}
      </p>
      {!spins && !spinning && (
        <button className="btn ghost" onClick={() => go("home")}>
          Ver packs
        </button>
      )}
      <section>
        <h3 className="subheading">Tus cupones</h3>
        <div className="coupon-list">
          {available.length ? (
            available.map((c) => <CouponRow key={c.id} c={c} isNew={winner?.id === c.id} />)
          ) : (
            <p className="muted-note">
              Los cupones que ganes aparecerán aquí y podrás aplicarlos al pagar.
            </p>
          )}
        </div>
      </section>
      {history.length > 0 && (
        <details className="reward-history">
          <summary>Historial ({history.length})</summary>
          <div className="coupon-list">
            {history.map((c) => (
              <CouponRow key={c.id} c={c} />
            ))}
          </div>
        </details>
      )}
      <p className="muted-note roulette-foot">
        Ganas 1 giro por cada pedido completado (2 en nivel Oro). Usas un cupón por pedido y los
        cupones vencen en {COUPON_DAYS} días.
      </p>
      <BottomNav go={go} />
    </div>
  );
}

function Favorites({ go }: { go: (s: Screen) => void }) {
  const { favorites, openProduct, goBack } = useShop();
  const list = offers.filter((o) => favorites.includes(o.name));
  return (
    <div className="screen with-nav">
      <Header title="Favoritos" onBack={goBack} />
      {list.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <Icon name="heart" size={55} />
          </div>
          <h2>Aún no tienes favoritos</h2>
          <p>Toca el corazón de cualquier pack para encontrarlo rápido aquí.</p>
          <button className="btn primary" onClick={() => go("all-packs")}>
            Explorar packs
          </button>
        </div>
      ) : (
        <div className="all-packs-list fav-list">
          {list.map((o) => (
            <OfferCard
              key={o.name}
              compact
              offer={o}
              onClick={() => openProduct(productFromOffer(o))}
            />
          ))}
        </div>
      )}
      <BottomNav go={go} />
    </div>
  );
}

function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const slides = [
    {
      icon: "bag",
      title: "Comida de hoy a mitad de precio",
      text: "Los locales de tu zona publican packs con su comida del día a precio especial. Sabes qué puede traer el pack, su valor y sus alérgenos; el contenido exacto es sorpresa.",
    },
    {
      icon: "clock",
      title: "Elige tu horario y recoge",
      text: "Cada pack tiene una ventana de recojo. Eliges una franja, pagas en la app y te avisamos cuando el local lo tenga listo. También hay delivery en algunas zonas.",
    },
    {
      icon: "leaf",
      title: "Ahorra y sube de nivel",
      text: "Cada pedido completado suma puntos: sube a Plata y Oro, gana cupones, giros de ruleta y envío gratis, sin pagar nada extra.",
    },
  ];
  const sl = slides[i];
  return (
    <Modal label="Bienvenida a ComeRICO" backdropClass="onboarding" onClose={onDone}>
      <button className="skip-btn" onClick={onDone}>
        Saltar
      </button>
      {i === 0 ? (
        <img className="onboard-logo" src={logoUrl} alt="ComeRICO" />
      ) : (
        <div className="onboard-icon">
          <Icon name={sl.icon} size={40} />
        </div>
      )}
      <small className="step-count">
        Paso {i + 1} de {slides.length}
      </small>
      <h2>{sl.title}</h2>
      <p>{sl.text}</p>
      <div className="dots" aria-hidden>
        {slides.map((_, k) => (
          <i key={k} className={k === i ? "on" : ""} />
        ))}
      </div>
      <button
        className="btn primary"
        onClick={() => (i < slides.length - 1 ? setI(i + 1) : onDone())}
      >
        {i < slides.length - 1 ? "Siguiente" : "Empezar"}
      </button>
      {i > 0 && (
        <button className="btn ghost" onClick={() => setI(i - 1)}>
          Atrás
        </button>
      )}
    </Modal>
  );
}

function Help({ go }: { go: (s: Screen) => void }) {
  const { goBack, helpTopic, notify, setOnboarded, role } = useShop();
  const [q, setQ] = useState("");
  const list = HELP_TOPICS.filter((t) =>
    `${t.q} ${t.a}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  return (
    <div className="screen with-nav">
      <Header title={role === "business" ? "Ayuda para negocios" : "Ayuda"} onBack={goBack} />
      <label className="search search-input">
        <Icon name="search" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="¿En qué te ayudamos?"
          aria-label="Buscar en la ayuda"
        />
      </label>
      <h3 className="subheading">Preguntas frecuentes</h3>
      <div className="faq">
        {list.map((t) => (
          <details key={t.id} open={t.id === helpTopic}>
            <summary>
              {t.q}
              <Icon name="chevron" size={16} />
            </summary>
            <p>{t.a}</p>
          </details>
        ))}
        {list.length === 0 && (
          <p className="muted-note">
            No encontramos respuestas para “{q}”. Escríbenos y te ayudamos.
          </p>
        )}
      </div>
      {role !== "business" && (
        <button
          className="btn ghost add-day-btn"
          onClick={() => {
            setOnboarded(false);
            go("home");
          }}
        >
          <Icon name="info" size={18} /> Ver la introducción otra vez
        </button>
      )}
      <h3 className="subheading">¿Necesitas más ayuda?</h3>
      <div className="list">
        <button onClick={() => notify("Abriendo chat de soporte por WhatsApp (demo)")}>
          <Icon name="headset" />
          <span>
            <b className="row-label">Chatear con soporte</b>
            <small>WhatsApp · respondemos en menos de 10 min</small>
          </span>
          <Icon name="chevron" />
        </button>
        <button onClick={() => notify("Abriendo tu correo: soporte@comerico.pe (demo)")}>
          <Icon name="receipt" />
          <span>
            <b className="row-label">Escribir un correo</b>
            <small>soporte@comerico.pe</small>
          </span>
          <Icon name="chevron" />
        </button>
      </div>
      <BottomNav go={go} />
    </div>
  );
}

function Legal({ go }: { go: (s: Screen) => void }) {
  const { goBack, legalDoc, myOrders, orders, role, claimOrderId } = useShop();
  const [kind, setKind] = useState<"Reclamo" | "Queja">("Reclamo");
  const [orderId, setOrderId] = useState(claimOrderId);
  const [detail, setDetail] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const relatable =
    role === "business" ? orders.filter((o) => o.product.store === BUSINESS_STORE) : myOrders;
  const titles: Record<LegalDoc, string> = {
    terms: role === "business" ? "Términos para aliados" : "Términos y condiciones",
    privacy: "Política de privacidad",
    claims: "Libro de reclamaciones",
  };
  const detailError =
    detail.trim().length < 20 ? "Describe lo ocurrido en al menos 20 caracteres." : "";
  return (
    <div className="screen with-nav legal-screen">
      <Header title={titles[legalDoc]} onBack={goBack} />
      {legalDoc === "terms" && (
        <div className="doc">
          <p className="muted-note">Última actualización: noviembre 2026</p>
          <h3>1. El servicio</h3>
          <p>
            ComeRICO conecta a personas con locales que ofrecen su comida del día a precio reducido.
            El local prepara el pedido y es responsable de su calidad.
          </p>
          <h3>2. Packs Sorpresa</h3>
          <p>
            El contenido exacto puede variar. Se informa el tipo de comida, lo que puede incluir, su
            valor aproximado, la ventana de recojo y los alérgenos declarados por el local.
          </p>
          <h3>3. Pagos, cancelaciones y reembolsos</h3>
          <p>
            Puedes cancelar sin costo mientras el pedido esté «Confirmado». Los reembolsos con Yape
            o tarjeta tardan hasta 5 días. Si no recoges el pedido dentro de la ventana, pasa a «No
            recogido» y no hay reembolso.
          </p>
          <h3>4. Suscripciones</h3>
          <p>
            Cada entrega se cobra cuando el local confirma el pack ese día. Si no hay pack, no se
            cobra. Puedes saltar, pausar o cancelar en cualquier momento.
          </p>
          <h3>5. Puntos, niveles y premios</h3>
          <p>
            Los puntos y niveles son gratuitos y no tienen valor monetario. Los cupones vencen en{" "}
            {COUPON_DAYS} días y se usa uno por pedido.
          </p>
        </div>
      )}
      {legalDoc === "privacy" && (
        <div className="doc">
          <p className="muted-note">
            Conforme a la Ley N.º 29733 de Protección de Datos Personales.
          </p>
          <h3>Qué datos usamos</h3>
          <p>Tu nombre, correo, celular, direcciones guardadas e historial de pedidos.</p>
          <h3>Para qué</h3>
          <p>
            Para procesar tus pedidos, calcular tus puntos y nivel y mostrarte ofertas cercanas. No
            vendemos tus datos.
          </p>
          <h3>Tus derechos</h3>
          <p>
            Puedes acceder, corregir o eliminar tus datos desde «Datos personales» o escribiendo a
            privacidad@comerico.pe.
          </p>
        </div>
      )}
      {legalDoc === "claims" &&
        (sent ? (
          <div className="empty-state small-empty">
            <div className="success-mark">
              <Icon name="check" size={30} />
            </div>
            <h2>Recibimos tu {kind.toLowerCase()}</h2>
            <p>
              Hoja N.º <b>{sent}</b>. Te responderemos a tu correo en un plazo máximo de 15 días
              hábiles.
            </p>
            <button className="btn primary" onClick={goBack}>
              Listo
            </button>
          </div>
        ) : (
          <div className="login-form">
            <p className="muted-note">
              Conforme al Código de Protección y Defensa del Consumidor. Completa los campos para
              registrar tu hoja.
            </p>
            <span className="editor-label">Tipo</span>
            <div className="login-tabs mode-tabs" role="tablist" aria-label="Tipo de hoja">
              {(["Reclamo", "Queja"] as const).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={kind === k}
                  className={kind === k ? "active" : ""}
                  onClick={() => setKind(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <small className="muted-note">
              {kind === "Reclamo"
                ? "Reclamo: disconformidad con el producto o servicio que pagaste."
                : "Queja: malestar con la atención recibida, sin relación con el producto."}
            </small>
            <label className="field">
              <span>Pedido relacionado (opcional)</span>
              <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                <option value="">Ninguno</option>
                {relatable.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} · {o.product.store} · {dayLabel(o.day)}
                  </option>
                ))}
              </select>
            </label>
            <label className={`field ${tried && detailError ? "has-error" : ""}`}>
              <span>Detalle*</span>
              <textarea
                rows={5}
                value={detail}
                maxLength={500}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="Cuéntanos qué pasó, cuándo y qué solución esperas"
              />
              <i>{detail.length}/500</i>
              {tried && detailError && (
                <em>
                  <Icon name="alert" size={14} />
                  {detailError}
                </em>
              )}
            </label>
            <button
              className="btn primary"
              onClick={() => {
                setTried(true);
                if (!detailError)
                  setSent(`2026-${String(Math.floor(100000 + Math.random() * 899999))}`);
              }}
            >
              Enviar {kind.toLowerCase()}
            </button>
          </div>
        ))}
      <BottomNav go={go} />
    </div>
  );
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

function Forgot({ go }: { go: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const err = !emailOk(email) ? "Ingresa un correo válido, por ejemplo nombre@correo.com." : "";
  return (
    <div className="screen login-screen">
      <Header title="Recuperar contraseña" onBack={() => go("login")} />
      {sent ? (
        <div className="empty-state small-empty">
          <div className="success-mark">
            <Icon name="check" size={30} />
          </div>
          <h2>Revisa tu correo</h2>
          <p>
            Enviamos un enlace a <b>{email.trim()}</b> para crear una nueva contraseña. Vence en 30
            minutos. Si no lo ves, revisa la carpeta de spam.
          </p>
          <button className="btn primary" onClick={() => go("login")}>
            Volver a iniciar sesión
          </button>
          <button className="btn ghost" onClick={() => setSent(false)}>
            Usar otro correo
          </button>
        </div>
      ) : (
        <div className="login-form">
          <p className="plan-sub">
            Escribe el correo con el que te registraste y te enviaremos un enlace para crear una
            nueva contraseña.
          </p>
          <label className={`field ${tried && err ? "has-error" : ""}`}>
            <span>Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@correo.com"
            />
            {tried && err && (
              <em>
                <Icon name="alert" size={14} />
                {err}
              </em>
            )}
          </label>
          <button
            className="btn primary"
            onClick={() => {
              setTried(true);
              if (!err) setSent(true);
            }}
          >
            Enviar enlace
          </button>
        </div>
      )}
    </div>
  );
}

function Signup({ go }: { go: (s: Screen) => void }) {
  const { signup, openLegal, role, goBack } = useShop();
  const [f, setF] = useState({ first: "", last: "", email: "", phone: "", pass: "" });
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [tried, setTried] = useState(false);
  const errors: Record<string, string> = {};
  if (f.first.trim().length < 2) errors.first = "Ingresa tu nombre.";
  if (f.last.trim().length < 2) errors.last = "Ingresa tu apellido.";
  if (!emailOk(f.email)) errors.email = "Ingresa un correo válido.";
  else if (f.email.trim().toLowerCase() === DEMO_EMAIL)
    errors.email = "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (!/^9\d{8}$/.test(f.phone)) errors.phone = "Celular de 9 dígitos que empiece con 9.";
  if (f.pass.length < 8 || !/\d/.test(f.pass))
    errors.pass = "Mínimo 8 caracteres e incluye al menos un número.";
  if (!terms) errors.terms = "Debes aceptar los términos para continuar.";
  const field = (k: keyof typeof f, label: string, ph: string, type = "text") => (
    <label className={`field ${tried && errors[k] ? "has-error" : ""}`}>
      <span>{label}*</span>
      <input
        type={type}
        value={f[k]}
        placeholder={ph}
        inputMode={k === "phone" ? "tel" : undefined}
        onChange={(e) =>
          setF({
            ...f,
            [k]: k === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 9) : e.target.value,
          })
        }
      />
      {tried && errors[k] && (
        <em>
          <Icon name="alert" size={14} />
          {errors[k]}
        </em>
      )}
    </label>
  );
  return (
    <div className="screen login-screen">
      <Header title="Crear cuenta" onBack={role === "guest" ? goBack : () => go("login")} />
      {role === "guest" && (
        <p className="plan-sub">
          Crea tu cuenta para pagar y seguir tu pedido. No perderás lo que elegiste.
        </p>
      )}
      <div className="login-form">
        {field("first", "Nombre", "Tu nombre")}
        {field("last", "Apellido", "Tu apellido")}
        {field("email", "Correo electrónico", "nombre@correo.com", "email")}
        {field("phone", "Celular", "9XX XXX XXX")}
        <label className={`field ${tried && errors.pass ? "has-error" : ""}`}>
          <span>Contraseña*</span>
          <div className="password-field">
            <input
              type={show ? "text" : "password"}
              value={f.pass}
              onChange={(e) => setF({ ...f, pass: e.target.value })}
              placeholder="Mínimo 8 caracteres"
            />
            <button type="button" onClick={() => setShow(!show)}>
              {show ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <small className="pass-hint">
            {f.pass.length >= 8 && /\d/.test(f.pass)
              ? "✓ Contraseña segura"
              : "Usa 8 caracteres o más e incluye un número."}
          </small>
          {tried && errors.pass && (
            <em>
              <Icon name="alert" size={14} />
              {errors.pass}
            </em>
          )}
        </label>
        <label className={`check-row ${tried && errors.terms ? "has-error" : ""}`}>
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>
            Acepto los{" "}
            <button type="button" className="link-btn" onClick={() => openLegal("terms")}>
              términos y condiciones
            </button>{" "}
            y la{" "}
            <button type="button" className="link-btn" onClick={() => openLegal("privacy")}>
              política de privacidad
            </button>
          </span>
        </label>
        {tried && Object.keys(errors).length > 0 && (
          <div className="login-error" role="alert">
            <Icon name="alert" size={18} />
            <span>Revisa los {Object.keys(errors).length} campos marcados.</span>
          </div>
        )}
        <button
          className="btn primary"
          onClick={() => {
            setTried(true);
            if (Object.keys(errors).length) return;
            signup({
              nickname: f.first.trim(),
              first: f.first.trim(),
              last: f.last.trim(),
              dni: "",
              phone: f.phone,
              email: f.email.trim().toLowerCase(),
            });
          }}
        >
          Crear cuenta
        </button>
      </div>
      <p className="signup-copy">
        ¿Ya tienes cuenta? <button onClick={() => go("login")}>Inicia sesión</button>
      </p>
    </div>
  );
}

function BusinessProfile({ go }: { go: (s: Screen) => void }) {
  const { notify, openHelp, openLegal, login, logout } = useShop();
  const [logoutModal, setLogoutModal] = useState(false);
  const st = stores.find((x) => x.name === BUSINESS_STORE)!;
  const o = offerFor(st.name);
  return (
    <div className="screen with-nav business">
      <Header title="Mi negocio" />
      <div className="profile-head">
        <div className="avatar big store">
          <Icon name="store" size={30} />
        </div>
        <h2>{st.name}</h2>
        <p>ventas@laespiga.pe · ★ {o.rating}</p>
      </div>
      <section>
        <h3 className="subheading">Mi local</h3>
        <div className="list">
          <button onClick={() => notify("Pronto podrás editar los datos del local")}>
            <Icon name="pin" />
            <span>
              <b className="row-label">Dirección del local</b>
              <small>{st.address}</small>
            </span>
            <Icon name="chevron" />
          </button>
          <button onClick={() => notify("Pronto podrás cambiar tu horario de atención")}>
            <Icon name="clock" />
            <span>
              <b className="row-label">Horario y ventana de packs</b>
              <small>
                Abierto {st.hours} · packs {daysShort(o.days)}, {windowLabel(o.from, o.to)}
              </small>
            </span>
            <Icon name="chevron" />
          </button>
          <button onClick={() => notify("Pronto podrás configurar tu cuenta de abono")}>
            <Icon name="card" />
            <span>
              <b className="row-label">Cuenta de abono</b>
              <small>BCP ···· 3390 · abonos cada lunes</small>
            </span>
            <Icon name="chevron" />
          </button>
        </div>
      </section>
      <section>
        <h3 className="subheading">Ayuda</h3>
        <div className="list">
          <button onClick={() => openHelp()}>
            <Icon name="headset" />
            <span>
              <b className="row-label">Ayuda para negocios</b>
            </span>
            <Icon name="chevron" />
          </button>
          <button onClick={() => openLegal("terms")}>
            <Icon name="info" />
            <span>
              <b className="row-label">Términos para aliados</b>
            </span>
            <Icon name="chevron" />
          </button>
        </div>
      </section>
      <div className="session-actions">
        <button className="btn soft" onClick={() => login("client")}>
          <Icon name="user" /> Cambiar a modo cliente (demo)
        </button>
        <button className="btn ghost" onClick={() => setLogoutModal(true)}>
          <Icon name="logout" /> Cerrar sesión
        </button>
      </div>
      {logoutModal && (
        <Modal label="Cerrar sesión" onClose={() => setLogoutModal(false)}>
          <div className="round-icon logout-icon">
            <Icon name="logout" />
          </div>
          <h2>¿Cerrar sesión?</h2>
          <p>Tus ofertas publicadas seguirán visibles para los clientes.</p>
          <button className="btn danger" onClick={logout}>
            Sí, cerrar sesión
          </button>
          <button className="btn ghost" onClick={() => setLogoutModal(false)}>
            Seguir en ComeRICO
          </button>
        </Modal>
      )}
      <BottomNav business active="business-profile" go={go} />
    </div>
  );
}

function Dashboard({ go }: { go: (s: Screen) => void }) {
  const { orders, published, stockOf, removePublished, notify } = useShop();
  const today = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  const mine = orders.filter((o) => o.product.store === BUSINESS_STORE && o.day === dateKey(0));
  const sold = mine.filter((o) => o.status !== "Cancelado" && o.status !== "No disponible");
  const sales = sold.reduce((acc, o) => acc + o.total, 0);
  const units = sold.reduce((acc, o) => acc + o.qty, 0);
  const delivered = mine.filter(isCompleted).reduce((acc, o) => acc + o.qty, 0);
  const pending = mine.filter(isActiveOrder).length;
  const soldOf = (key: string) =>
    sold.filter((o) => o.product.key === key).reduce((acc, o) => acc + o.qty, 0);
  const base = offerFor(BUSINESS_STORE);
  const active = [
    {
      id: "base",
      name: base.pack,
      key: packKey(BUSINESS_STORE),
      photo: base.photo,
      removable: false,
    },
    ...published.map((p) => ({
      id: p.id,
      name: p.name,
      key: `pub:${p.id}`,
      photo: p.photo,
      removable: true,
    })),
  ].map((x) => ({ ...x, left: stockOf(x.key), qty: stockOf(x.key) + soldOf(x.key) }));
  const available = active.reduce((acc, o) => acc + o.left, 0);
  const todayIdx = todayIndex();
  return (
    <div className="screen with-nav business">
      <div className="business-head">
        <div>
          <small>Hoy, {today}</small>
          <h1>Hola, La Espiga</h1>
        </div>
        <button
          className="avatar store"
          aria-label="Mi negocio"
          onClick={() => go("business-profile")}
        >
          <Icon name="store" />
        </button>
      </div>
      <div className="metrics">
        <div className="main-metric">
          <span>Ventas de hoy</span>
          <strong>{money(sales)}</strong>
          <small>
            {sold.length} {sold.length === 1 ? "pedido" : "pedidos"} en ComeRICO
          </small>
        </div>
        <div>
          <span>Entregados hoy</span>
          <b>{delivered}</b>
          <small>{units} productos vendidos</small>
        </div>
        <button onClick={() => go("business-orders")}>
          <span>Pendientes</span>
          <b>{pending}</b>
          <small>por entregar ›</small>
        </button>
        <div>
          <span>Ofertas activas</span>
          <b>{active.length}</b>
          <small>{available} unidades disponibles</small>
        </div>
      </div>
      <div className="quick-actions">
        <button onClick={() => go("publish")}>
          <span className="qa-icon">
            <Icon name="plus" />
          </span>
          <b>Publicar oferta</b>
          <small>Un producto con descuento</small>
        </button>
        <button onClick={() => go("pack")}>
          <span className="qa-icon">
            <Icon name="bag" />
          </span>
          <b>Crear Pack Sorpresa</b>
          <small>Varios productos en una bolsa</small>
        </button>
      </div>
      <section className="chart-card">
        <div className="section-title">
          <div>
            <h2>Esta semana</h2>
            <small>Datos de ejemplo · hoy resaltado</small>
          </div>
          <b>S/ 1,248</b>
        </div>
        <div className="bars">
          {[42, 58, 37, 75, 65, 90, 48].map((h, i) => (
            <div key={i} className={i === todayIdx ? "today" : ""}>
              <i style={{ height: `${h}%` }} />
              <small>{["L", "M", "M", "J", "V", "S", "D"][i]}</small>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="section-title">
          <h2>Ofertas activas</h2>
          <small>{active.length} publicadas</small>
        </div>
        <div className="active-offers">
          {active.map((o) => (
            <div key={o.id} className="active-offer">
              <img src={o.photo} alt="" />
              <div>
                <b>{o.name}</b>
                <small>
                  {o.left} de {o.qty} disponibles
                </small>
                <div className="mini-progress">
                  <i style={{ width: `${o.qty ? Math.round((o.left / o.qty) * 100) : 0}%` }} />
                </div>
              </div>
              {o.removable && (
                <button
                  aria-label={`Retirar ${o.name}`}
                  title="Retirar oferta"
                  onClick={() => {
                    removePublished(o.id);
                    notify(`Retiraste «${o.name}»`);
                  }}
                >
                  <Icon name="x" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      <BottomNav business active="dashboard" go={go} />
    </div>
  );
}

const roundUp30 = (m: number) => Math.ceil(m / 30) * 30;
const publishFrom = (deadline: number) =>
  Math.min(deadline - 30, Math.max(roundUp30(nowMin()), deadline - 90));

function Publish({ go, errors = false }: { go: (s: Screen) => void; errors?: boolean }) {
  const { publishOffer, removePublished, notify } = useShop();
  const [f, setF] = useState(
    errors
      ? {
          name: "",
          desc: "Selección de panes y dulces horneados hoy.",
          qty: "8",
          old: "28.90",
          price: "35.00",
        }
      : { name: "", desc: "", qty: "", old: "", price: "" },
  );
  const [deadline, setDeadline] = useState(errors ? at(12) : at(21, 30));
  const [allergens, setAllergens] = useState<string[]>(errors ? ["Trigo"] : []);
  const [photo, setPhoto] = useState(PHOTO_OPTIONS[0]);
  const [tried, setTried] = useState(errors);
  const set = (k: keyof typeof f, v: string) => setF({ ...f, [k]: v });

  const qty = Number(f.qty);
  const old = parseMoney(f.old);
  const price = parseMoney(f.price);
  const pct = old > 0 && price > 0 && price < old ? Math.round((1 - price / old) * 100) : null;
  const err: Record<string, string> = {};
  if (f.name.trim().length < 3) err.name = "Escribe un nombre para identificarla.";
  if (!Number.isInteger(qty) || qty < 1 || qty > 50) err.qty = "Indica una cantidad entre 1 y 50.";
  if (!(old > 0)) err.old = "Ingresa el precio normal.";
  if (!(price > 0)) err.price = "Ingresa el precio con descuento.";
  else if (old > 0 && price >= old) err.price = "Debe ser menor al precio normal.";
  else if (pct !== null && pct < 30)
    err.price = "Ofrece al menos 30% de descuento para que se venda.";
  if (deadline <= nowMin() + 30)
    err.deadline = "La hora límite debe ser al menos 30 min después de ahora.";
  if (!allergens.length) err.allergens = "Marca los alérgenos o elige «Sin alérgenos».";
  const nErr = Object.keys(err).length;

  const show = (k: string) => tried && err[k];
  const field = (
    k: "name" | "qty" | "old" | "price",
    label: string,
    ph: string,
    prefix?: string,
  ) => (
    <label className={`field ${show(k) ? "has-error" : ""}`}>
      <span>{label}</span>
      <div className={prefix ? "money-field" : undefined}>
        {prefix && <i>{prefix}</i>}
        <input
          value={f[k]}
          inputMode={k === "name" ? undefined : "decimal"}
          placeholder={ph}
          onChange={(e) =>
            set(k, k === "name" ? e.target.value : e.target.value.replace(/[^\d.,]/g, ""))
          }
        />
      </div>
      {show(k) && (
        <em>
          <Icon name="alert" size={14} />
          {err[k]}
        </em>
      )}
    </label>
  );

  const submit = () => {
    setTried(true);
    if (nErr) {
      document
        .querySelector(".form-scroll")
        ?.closest(".screen")
        ?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const id = `pub-${Date.now()}`;
    publishOffer({
      id,
      kind: "oferta",
      name: f.name.trim(),
      desc: f.desc.trim(),
      qty,
      price,
      oldPrice: old,
      from: publishFrom(deadline),
      to: deadline,
      photo,
      allergens,
      category: "Panadería",
    });
    go("dashboard");
    notify("Oferta publicada: ya aparece en la ficha de tu local", () => removePublished(id));
  };

  const preview: Offer = {
    category: "Panadería",
    photo,
    name: BUSINESS_STORE,
    pack: f.name.trim() || "Nombre de tu oferta",
    content: f.desc,
    rating: offerFor(BUSINESS_STORE).rating,
    price: price > 0 ? money(price) : "S/ —",
    oldPrice: old > 0 ? money(old) : "",
    discount: pct !== null ? `-${pct}%` : "—",
    stock: qty > 0 ? qty : 1,
    from: publishFrom(deadline),
    to: deadline,
    allergens,
    tags: [],
    days: [],
  };

  return (
    <div className="screen form-screen">
      <Header
        title="Publicar oferta"
        onBack={() => go("dashboard")}
        action={
          <button className="text-action" onClick={() => notify("Borrador guardado")}>
            Borrador
          </button>
        }
      />
      <div className="form-scroll">
        {tried && nErr > 0 && (
          <div className="login-error" role="alert">
            <Icon name="alert" size={18} />
            <span>
              Revisa {nErr === 1 ? "el campo marcado" : `los ${nErr} campos marcados`} para
              publicar.
            </span>
          </div>
        )}
        <button
          className="shortcut"
          onClick={() => {
            setF({
              name: "Canasta de panes del día",
              desc: "Selección de panes y dulces horneados hoy.",
              qty: "8",
              old: "28.90",
              price: "12.90",
            });
            setDeadline(at(21, 30));
            setAllergens(["Trigo"]);
            notify("Cargamos los datos de ayer. Revisa la cantidad y la hora.");
          }}
        >
          <span>
            <Icon name="plus" />
            <b>Duplicar oferta de ayer</b>
            <small>Rellena el formulario automáticamente</small>
          </span>
          <Icon name="chevron" />
        </button>
        <section>
          <h2>Información</h2>
          <span className="editor-label">Foto</span>
          <div className="photo-options">
            {PHOTO_OPTIONS.map((ph) => (
              <button
                key={ph}
                className={photo === ph ? "active" : ""}
                aria-pressed={photo === ph}
                aria-label="Elegir esta foto"
                onClick={() => setPhoto(ph)}
              >
                <img src={ph} alt="" />
              </button>
            ))}
            <button
              className="photo-add"
              aria-label="Tomar una foto"
              onClick={() => notify("Pronto podrás tomar una foto con la cámara")}
            >
              <Icon name="camera" />
            </button>
          </div>
          {field("name", "Nombre de la oferta*", "Ej. Canasta de panes del día")}
          <label className="field">
            <span>
              Descripción <small>(opcional)</small>
            </span>
            <textarea
              value={f.desc}
              rows={3}
              maxLength={140}
              placeholder="¿Qué incluye? Ej. 6 panes y 2 dulces del día"
              onChange={(e) => set("desc", e.target.value)}
            />
            <i>{f.desc.length}/140</i>
          </label>
        </section>
        <section>
          <h2>Precio y cantidad</h2>
          <div className="field-grid">
            {field("qty", "Cantidad*", "Ej. 8")}
            {field("old", "Precio normal*", "0.00", "S/")}
            {field("price", "Precio con descuento*", "0.00", "S/")}
            <div className="calculated">
              <span>Descuento</span>
              <b>{pct !== null ? `${pct}%` : "—"}</b>
              <small>Se calcula solo · mínimo 30%</small>
            </div>
          </div>
        </section>
        <section>
          <h2>Recojo</h2>
          <label className={`field ${show("deadline") ? "has-error" : ""}`}>
            <span>Hora límite de recojo*</span>
            <select value={deadline} onChange={(e) => setDeadline(Number(e.target.value))}>
              {DEADLINES.map((d) => (
                <option key={d} value={d}>
                  {minLabel(d)}
                </option>
              ))}
            </select>
            {show("deadline") ? (
              <em>
                <Icon name="alert" size={14} />
                {err.deadline}
              </em>
            ) : (
              <small className="field-hint">
                Los clientes podrán recoger de {windowLabel(publishFrom(deadline), deadline)}
                Después de esa hora la oferta deja de mostrarse.
              </small>
            )}
          </label>
        </section>
        <section>
          <h2>Alérgenos*</h2>
          <div className={`allergens selectable ${show("allergens") ? "has-error" : ""}`}>
            {ALLERGENS.map((a) => {
              const on = allergens.includes(a);
              return (
                <button
                  key={a}
                  className={on ? "selected" : ""}
                  aria-pressed={on}
                  onClick={() =>
                    setAllergens(
                      a === "Sin alérgenos"
                        ? on
                          ? []
                          : ["Sin alérgenos"]
                        : on
                          ? allergens.filter((x) => x !== a)
                          : [...allergens.filter((x) => x !== "Sin alérgenos"), a],
                    )
                  }
                >
                  {a}
                  {on && " ✓"}
                </button>
              );
            })}
          </div>
          {show("allergens") && (
            <em className="inline-error">
              <Icon name="alert" size={14} />
              {err.allergens}
            </em>
          )}
          <small className="field-hint">El cliente verá estos alérgenos antes de pagar.</small>
        </section>
        <section>
          <div className="section-title">
            <h2>Vista previa</h2>
            <small>Así la verá el cliente</small>
          </div>
          <OfferCard compact hideFav preview offer={preview} />
        </section>
      </div>
      <div className="sticky-action">
        <button className="btn primary" onClick={submit}>
          Publicar oferta
        </button>
      </div>
    </div>
  );
}

function PackForm({ go }: { go: (s: Screen) => void }) {
  const { publishOffer, removePublished, notify } = useShop();
  const inventory: [string, number][] = [
    ["Pan francés", 12],
    ["Empanada de pollo", 6],
    ["Croissant de mantequilla", 4],
    ["Torta de chocolate", 3],
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const [type, setType] = useState<Category>("Panadería");
  const [value, setValue] = useState("");
  const [price, setPrice] = useState("");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [deadline, setDeadline] = useState(at(21, 30));
  const [tried, setTried] = useState(false);
  const toggle = (x: string) =>
    setSelected((s) => (s.includes(x) ? s.filter((y) => y !== x) : [...s, x]));
  const v = parseMoney(value);
  const pr = parseMoney(price);
  const pct = v > 0 && pr > 0 && pr < v ? Math.round((1 - pr / v) * 100) : null;
  const err: Record<string, string> = {};
  if (!selected.length) err.items = "Selecciona al menos un producto del inventario.";
  if (!(v > 0)) err.value = "Ingresa el valor aproximado.";
  if (!(pr > 0)) err.price = "Ingresa el precio del pack.";
  else if (v > 0 && pr >= v) err.price = "El precio debe ser menor al valor aproximado.";
  if (!allergens.length) err.allergens = "Los alérgenos son obligatorios.";
  if (deadline <= nowMin() + 30) err.deadline = "Elige una hora al menos 30 min después de ahora.";
  const nErr = Object.keys(err).length;
  const show = (k: string) => tried && err[k];
  const units = Math.min(
    ...(selected.length ? selected.map((x) => inventory.find((i) => i[0] === x)![1]) : [0]),
  );
  return (
    <div className="screen form-screen">
      <Header title="Crear Pack Sorpresa" onBack={() => go("dashboard")} />
      <div className="info-banner">
        <Icon name="info" />
        <p>
          El cliente verá el tipo de comida, lo que puede incluir, su valor y los alérgenos, pero el
          contenido exacto será sorpresa.
        </p>
      </div>
      <div className="form-scroll">
        {tried && nErr > 0 && (
          <div className="login-error" role="alert">
            <Icon name="alert" size={18} />
            <span>
              Revisa {nErr === 1 ? "el campo marcado" : `los ${nErr} campos marcados`} para crear el
              pack.
            </span>
          </div>
        )}
        <section>
          <h2>Elige del inventario de hoy</h2>
          <p className={`helper ${show("items") ? "error-text" : ""}`}>
            {show("items") ? err.items : "Selecciona al menos un producto"}
          </p>
          <div className="check-list">
            {inventory.map(([x, n]) => (
              <button
                key={x}
                onClick={() => toggle(x)}
                aria-pressed={selected.includes(x)}
                className={selected.includes(x) ? "selected" : ""}
              >
                <i>{selected.includes(x) && "✓"}</i>
                <span>
                  <b>{x}</b>
                  <small>{n} disponibles</small>
                </span>
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <small className="field-hint">
              Podrás armar hasta {units} packs con este inventario.
            </small>
          )}
        </section>
        <section>
          <h2>¿Qué tipo de comida es?</h2>
          <div className="quick-chips">
            {(["Panadería", "Café", "Menú"] as Category[]).map((t) => (
              <button
                key={t}
                className={type === t ? "selected" : ""}
                aria-pressed={type === t}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
        <section>
          <div className="field-grid">
            <label className={`field ${show("value") ? "has-error" : ""}`}>
              <span>Valor aproximado*</span>
              <div className="money-field">
                <i>S/</i>
                <input
                  inputMode="decimal"
                  placeholder="0.00"
                  value={value}
                  onChange={(e) => setValue(e.target.value.replace(/[^\d.,]/g, ""))}
                />
              </div>
              {show("value") && (
                <em>
                  <Icon name="alert" size={14} />
                  {err.value}
                </em>
              )}
            </label>
            <label className={`field ${show("price") ? "has-error" : ""}`}>
              <span>Precio del Pack*</span>
              <div className="money-field">
                <i>S/</i>
                <input
                  inputMode="decimal"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d.,]/g, ""))}
                />
              </div>
              {show("price") && (
                <em>
                  <Icon name="alert" size={14} />
                  {err.price}
                </em>
              )}
            </label>
          </div>
          {pct !== null && (
            <div className="saving-callout">
              El cliente ahorra{" "}
              <b>
                {money(v - pr)} · {pct}%
              </b>
            </div>
          )}
        </section>
        <section>
          <h2>
            Alérgenos <span className="required">Obligatorio</span>
          </h2>
          <div className={`allergens selectable ${show("allergens") ? "has-error" : ""}`}>
            {ALLERGENS.map((a) => {
              const on = allergens.includes(a);
              return (
                <button
                  key={a}
                  className={on ? "selected" : ""}
                  aria-pressed={on}
                  onClick={() =>
                    setAllergens(
                      a === "Sin alérgenos"
                        ? on
                          ? []
                          : ["Sin alérgenos"]
                        : on
                          ? allergens.filter((x) => x !== a)
                          : [...allergens.filter((x) => x !== "Sin alérgenos"), a],
                    )
                  }
                >
                  {a}
                  {on && " ✓"}
                </button>
              );
            })}
          </div>
          {show("allergens") && (
            <em className="inline-error">
              <Icon name="alert" size={14} />
              {err.allergens}
            </em>
          )}
        </section>
        <label className={`field ${show("deadline") ? "has-error" : ""}`}>
          <span>Hora límite de recojo*</span>
          <select value={deadline} onChange={(e) => setDeadline(Number(e.target.value))}>
            {DEADLINES.map((d) => (
              <option key={d} value={d}>
                {minLabel(d)}
              </option>
            ))}
          </select>
          {show("deadline") && (
            <em>
              <Icon name="alert" size={14} />
              {err.deadline}
            </em>
          )}
        </label>
      </div>
      <div className="sticky-action">
        <button
          className="btn primary"
          onClick={() => {
            setTried(true);
            if (nErr) return;
            const id = `pack-${Date.now()}`;
            publishOffer({
              id,
              kind: "pack",
              name: `Pack Sorpresa extra · ${type}`,
              desc: `Puede incluir: ${selected.join(", ").toLowerCase()}.`,
              qty: Math.max(1, units),
              price: pr,
              oldPrice: v,
              from: publishFrom(deadline),
              to: deadline,
              photo: photos.bread,
              allergens,
              category: type,
            });
            go("dashboard");
            notify("Pack Sorpresa publicado en la ficha de tu local", () => removePublished(id));
          }}
        >
          Crear Pack Sorpresa
        </button>
      </div>
    </div>
  );
}

const CANCEL_REASONS = ["Se acabó el stock", "Problema en el local", "El cliente lo pidió"];

function BusinessOrders({ go }: { go: (s: Screen) => void }) {
  const { orders, setOrderStatus, notify, subs, confirmSubDelivery, noPackSubDelivery, user } =
    useShop();
  const [codeFor, setCodeFor] = useState<Order | null>(null);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [cancelFor, setCancelFor] = useState<Order | null>(null);
  const today = dateKey(0);
  const list = orders
    .filter(
      (o) => o.product.store === BUSINESS_STORE && o.day === today && o.status !== "No disponible",
    )
    .sort(
      (a, b) => Number(!isActiveOrder(a)) - Number(!isActiveOrder(b)) || a.slot.from - b.slot.from,
    );
  const pending = list.filter(isActiveOrder).length;
  const subToday = upcoming(subs, 1).filter(
    (oc) =>
      oc.sub.store === BUSINESS_STORE &&
      !oc.sub.skipped.includes(oc.key) &&
      !orders.some((o) => o.subscriptionId === oc.sub.uid && o.day === oc.key),
  );
  const first = (o: Order) => o.customerName.split(" ")[0];
  const advance = (o: Order, to: OrderStatus, text: string) => {
    setOrderStatus(o.id, to, { by: "local" });
    notify(text);
  };
  return (
    <div className="screen with-nav business">
      <Header
        title="Pedidos de hoy"
        action={
          <button
            className="icon-btn"
            aria-label="Buscar pedido"
            onClick={() => notify("Pronto podrás buscar pedidos por código o nombre")}
          >
            <Icon name="search" />
          </button>
        }
      />
      <div className="priority-note">
        <Icon name="info" />
        <span>
          {pending} por entregar · ordenados por franja de recojo. Cada cambio de estado avisa al
          cliente.
        </span>
      </div>
      {subToday.length > 0 && (
        <section>
          <h3 className="subheading">Suscripciones de hoy</h3>
          <div className="order-list business-orders">
            {subToday.map((oc) => (
              <article key={oc.sub.uid}>
                <div className="customer">
                  <div className="avatar blue">
                    {`${user.first.charAt(0)}${user.last.charAt(0)}`.toUpperCase()}
                  </div>
                  <div>
                    <h3>
                      {user.first} {user.last.charAt(0)}.
                    </h3>
                    <small>
                      Suscripción · {slotLabel({ from: oc.sub.slot, to: oc.sub.slot + 30 })} ·{" "}
                      {oc.sub.mode === "pickup" ? "Recojo" : "Delivery"}
                    </small>
                  </div>
                  <b>1 pack</b>
                </div>
                <div className="sub-actions">
                  <button className="btn primary" onClick={() => confirmSubDelivery(oc)}>
                    Confirmar pack
                  </button>
                  <button className="btn ghost" onClick={() => noPackSubDelivery(oc)}>
                    Hoy no hay pack
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {list.length === 0 ? (
        <p className="muted-note">Aún no tienes pedidos hoy.</p>
      ) : (
        <div className="order-list business-orders">
          {list.map((o) => {
            const active = isActiveOrder(o);
            return (
              <article key={o.id} className={active ? "" : "is-done"}>
                <div className="customer">
                  <div className="avatar gray">
                    {o.customerName
                      .split(" ")
                      .map((w) => w.charAt(0))
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <Status type={o.status} />
                    <h3>{o.customerName}</h3>
                    <small>
                      #{o.id} · {slotLabel(o.slot)} · {o.mode === "pickup" ? "Recojo" : "Delivery"}
                      {o.subscriptionId ? " · suscripción" : ""}
                    </small>
                  </div>
                  <b>
                    {o.qty} {o.qty === 1 ? "pack" : "packs"}
                  </b>
                </div>
                {o.status === "Confirmado" && (
                  <button
                    className="btn primary"
                    onClick={() =>
                      advance(o, "En preparación", `Avisamos a ${first(o)} que preparas su pedido`)
                    }
                  >
                    Empezar a preparar
                  </button>
                )}
                {o.status === "En preparación" &&
                  (o.mode === "pickup" ? (
                    <button
                      className="btn primary"
                      onClick={() =>
                        advance(
                          o,
                          "Listo para recoger",
                          `Avisamos a ${first(o)} que su pedido está listo`,
                        )
                      }
                    >
                      Marcar listo para recoger
                    </button>
                  ) : (
                    <button
                      className="btn primary"
                      onClick={() =>
                        advance(o, "En camino", `Avisamos a ${first(o)} que su pedido va en camino`)
                      }
                    >
                      Despachar pedido
                    </button>
                  ))}
                {o.status === "Listo para recoger" && (
                  <button
                    className="btn outline"
                    onClick={() => {
                      setCodeFor(o);
                      setCode("");
                      setCodeError("");
                    }}
                  >
                    Entregar · validar código
                  </button>
                )}
                {o.status === "En camino" && (
                  <button
                    className="btn outline"
                    onClick={() => advance(o, "Entregado", "Entrega registrada. ¡Buen trabajo!")}
                  >
                    Confirmar entrega
                  </button>
                )}
                {!active && (
                  <div className={`code ${isCompleted(o) ? "done" : ""}`}>
                    <Icon name={isCompleted(o) ? "check" : "alert"} size={16} /> {o.status}
                  </div>
                )}
                {active && (
                  <button className="link-btn cancel-link" onClick={() => setCancelFor(o)}>
                    Cancelar por incidencia
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
      {codeFor && (
        <Modal label="Validar código" onClose={() => setCodeFor(null)}>
          <h2>Validar código</h2>
          <p>Pide al cliente los 4 últimos dígitos del código que ve en su app (RICO-····).</p>
          <label className={`field ${codeError ? "has-error" : ""}`}>
            <input
              className="code-input"
              inputMode="numeric"
              aria-label="Últimos 4 dígitos del código"
              value={code}
              placeholder="0000"
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, "").slice(0, 4));
                setCodeError("");
              }}
            />
            {codeError && (
              <em>
                <Icon name="alert" size={14} />
                {codeError}
              </em>
            )}
          </label>
          <button
            className="btn primary"
            onClick={() => {
              if (code !== codeFor.id.slice(-4)) {
                setCodeError(
                  code.length < 4
                    ? "Faltan dígitos: el código tiene 4 números."
                    : "El código no coincide. Verifica el pedido con el cliente.",
                );
                return;
              }
              setOrderStatus(codeFor.id, "Recogido", { by: "local" });
              setCodeFor(null);
              notify("Pedido entregado. ¡Buen trabajo!");
            }}
          >
            Confirmar entrega
          </button>
          <button className="btn ghost" onClick={() => setCodeFor(null)}>
            Cancelar
          </button>
        </Modal>
      )}
      {cancelFor && (
        <Modal label="Cancelar pedido" onClose={() => setCancelFor(null)}>
          <h2>¿Cancelar {cancelFor.id}?</h2>
          <p>Avisaremos a {first(cancelFor)} y le devolveremos su dinero. Elige el motivo:</p>
          {CANCEL_REASONS.map((r) => (
            <button
              key={r}
              className="btn ghost"
              onClick={() => {
                setOrderStatus(cancelFor.id, "Cancelado", {
                  by: "local",
                  note: `Cancelado por el local: ${r.toLowerCase()}.`,
                });
                setCancelFor(null);
                notify(`Pedido ${cancelFor.id} cancelado. Avisamos al cliente.`);
              }}
            >
              {r}
            </button>
          ))}
          <button className="btn soft" onClick={() => setCancelFor(null)}>
            No cancelar
          </button>
        </Modal>
      )}
      <BottomNav business active="business-orders" go={go} />
    </div>
  );
}

function LevelUpModal() {
  const { levelUp, clearLevelUp, user, openBenefits } = useShop();
  if (!levelUp) return null;
  const coupon = LEVEL_COUPON[levelUp.name];
  return (
    <Modal label={`Subiste a nivel ${levelUp.name}`} className="levelup" onClose={clearLevelUp}>
      <div className="confetti" aria-hidden>
        {Array.from({ length: 18 }).map((_, i) => (
          <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.12}s` }} />
        ))}
      </div>
      <div className="levelup-medal" style={{ background: levelUp.bg, color: levelUp.color }}>
        <Icon name="trophy" size={40} />
      </div>
      <small>¡Felicidades, {user.nickname || user.first}!</small>
      <h2>Subiste a nivel {levelUp.name}</h2>
      {coupon && (
        <div className="reward-done">
          <Icon name="ticket" size={18} /> Te regalamos un cupón de S/ {coupon} para tu próximo
          pedido.
        </div>
      )}
      <p>Además desbloqueaste:</p>
      <ul className="perk-list">
        {levelUp.perks
          .filter((perk) => !perk.startsWith("Cupón"))
          .map((perk) => (
            <li key={perk}>
              <Icon name="check" size={16} /> {perk}
            </li>
          ))}
      </ul>
      <button
        className="btn primary"
        onClick={() => {
          clearLevelUp();
          openBenefits(coupon ? "cupones" : "nivel");
        }}
      >
        Ver mis beneficios
      </button>
      <button className="btn ghost" onClick={clearLevelUp}>
        Seguir
      </button>
    </Modal>
  );
}

/** Controles de la demo: simulan al local, al reloj y a la pasarela de pago. */
function DemoPanel({ go }: { go: (s: Screen) => void }) {
  const {
    orders,
    setOrderStatus,
    addDemoSpin,
    failNextPayment,
    setFailNextPayment,
    subs,
    confirmSubDelivery,
    noPackSubDelivery,
    moveClock,
    resetDemo,
    notify,
  } = useShop();
  const now = nowMin();
  const today = dateKey(0);
  const active = orders
    .filter((o) => isActiveOrder(o) && o.day === today)
    .sort((a, b) => a.slot.from - b.slot.from)
    .slice(0, 6);
  const pendingSubs = upcoming(subs, 1).filter(
    (oc) =>
      !oc.sub.skipped.includes(oc.key) &&
      !orders.some((o) => o.subscriptionId === oc.sub.uid && o.day === oc.key),
  );
  return (
    <div className="demo-panel" aria-label="Controles de la demo">
      <h4>CONTROLES DE DEMO</h4>
      <p>Simulan lo que en producción harían el local, el reloj o la pasarela de pago.</p>
      <b className="demo-sub">
        Reloj: {minLabel(now)}
        {clock.simulated ? " (simulado)" : ""}
      </b>
      <div className="demo-row">
        <button onClick={() => moveClock(now - 60)}>−1 h</button>
        <button onClick={() => moveClock(now + 15)}>+15 min</button>
        <button onClick={() => moveClock(now + 60)}>+1 h</button>
        <button onClick={() => moveClock(null)}>Hora real</button>
      </div>
      <b className="demo-sub">Pedidos de hoy</b>
      {active.length ? (
        active.map((o) => {
          const nx = nextStatus(o);
          return (
            <div key={o.id} className="demo-order">
              <span>
                {o.id} · {o.customerName}
                <small>{o.status}</small>
              </span>
              {nx && (
                <button onClick={() => setOrderStatus(o.id, nx, { by: "local" })}>→ {nx}</button>
              )}
            </div>
          );
        })
      ) : (
        <p>No hay pedidos activos hoy.</p>
      )}
      {pendingSubs.length > 0 && (
        <>
          <b className="demo-sub">Suscripciones de hoy ({pendingSubs.length})</b>
          <div className="demo-row">
            <button onClick={() => pendingSubs.forEach((oc) => confirmSubDelivery(oc))}>
              El local confirma
            </button>
            <button onClick={() => pendingSubs.forEach((oc) => noPackSubDelivery(oc))}>
              Hoy sin pack
            </button>
          </div>
        </>
      )}
      <b className="demo-sub">Otros</b>
      <div className="demo-row">
        <button
          onClick={() => {
            addDemoSpin();
            notify("Demo: +1 giro de prueba");
          }}
        >
          +1 giro
        </button>
        <button
          className={failNextPayment ? "on" : ""}
          aria-pressed={failNextPayment}
          onClick={() => setFailNextPayment(!failNextPayment)}
        >
          Rechazar próximo pago
        </button>
        <button onClick={() => go("map-denied")}>Ubicación sin permiso</button>
        <button onClick={resetDemo}>Reiniciar demo</button>
      </div>
    </div>
  );
}

/* Persistencia local de la demo (se reinicia cada día). */
const STORE_KEY = "comerico.demo.v2";
const savedState: Record<string, unknown> = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    return s && s.day === dateKey(0) ? s : {};
  } catch {
    return {};
  }
})();
function usePersisted<T>(key: string, initial: T | (() => T)) {
  return useState<T>(() =>
    key in savedState
      ? (savedState[key] as T)
      : typeof initial === "function"
        ? (initial as () => T)()
        : initial,
  );
}

export default function App() {
  const [role, setRole] = usePersisted<Role | null>("role", null);
  const [screen, setScreen] = useState<Screen>(() =>
    role === "business" ? "dashboard" : role ? "home" : "login",
  );
  const [menu, setMenu] = useState(false);
  const [storeName, setStoreName] = useState(stores[0].name);
  const [returnTo, setReturnTo] = useState<Screen>("home");
  const [product, setProduct] = useState<Product>(() => productFromOffer(offers[0]));
  const [qty, setQty] = useState(1);
  const [user, setUser] = usePersisted<User>("user", demoUser);
  const [history, setHistory] = usePersisted<PointsEntry[]>("history", initialHistory);
  const [coupons, setCoupons] = usePersisted<Coupon[]>("coupons", []);
  const [spins, setSpins] = usePersisted("spins", 1);
  const [rewardedLevels, setRewardedLevels] = usePersisted<string[]>("rewardedLevels", ["Plata"]);
  const [favorites, setFavorites] = usePersisted<string[]>("favorites", ["Panadería La Espiga"]);
  const [places, setPlaces] = usePersisted<SavedPlace[]>("places", initialPlaces);
  const [activePlace, setActivePlace] = usePersisted("activePlace", "Casa");
  const [subs, setSubs] = usePersisted<Subscription[]>("subs", []);
  const [notices, setNotices] = usePersisted<Notice[]>("notices", []);
  const [noticePrefs, setNoticePrefs] = usePersisted<NoticePrefs>("noticePrefs", {
    pedidos: true,
    suscripciones: true,
    premios: true,
  });
  const [lastPrefs, setLastPrefs] = usePersisted<ClientProfile["lastPrefs"]>("lastPrefs", {
    mode: "pickup",
    method: "yape",
  });
  const [orders, setOrders] = usePersisted<Order[]>("orders", initialOrders);
  const [stock, setStock] = usePersisted<Record<string, number>>("stock", initialStock);
  const [published, setPublished] = usePersisted<PublishedOffer[]>("published", []);
  const [onboarded, setOnboarded] = usePersisted("onboarded", false);
  const [lastOrderId, setLastOrderId] = usePersisted<string | null>("lastOrderId", null);
  const [selectedCouponId, setSelectedCouponId] = usePersisted("selectedCouponId", "");
  const [levelUp, setLevelUp] = useState<Level | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [subDraft, setSubDraft] = useState<string | null>(null);
  const [packsPreset, setPacksPreset] = useState<PacksPreset>({});
  const [toast, setToast] = useState<AppToast | null>(null);
  const [stack, setStack] = useState<Screen[]>([]);
  const [lastTab, setLastTab] = useState<Screen>(role === "business" ? "dashboard" : "home");
  const [helpTopic, setHelpTopic] = useState("");
  const [legalDoc, setLegalDoc] = useState<LegalDoc>("terms");
  const [claimOrderId, setClaimOrderId] = useState("");
  const [benefitsTab, setBenefitsTab] = useState<BenefitsTab>("nivel");
  const [failNextPayment, setFailNextPayment] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  // Panel lateral (FRAME + controles de demo): se puede ocultar para presentar.
  const [panelHidden, setPanelHidden] = useState(() => {
    try {
      return localStorage.getItem("comerico.panelHidden") === "1";
    } catch {
      return false;
    }
  });
  const togglePanel = (hidden: boolean) => {
    setPanelHidden(hidden);
    if (hidden) setMenu(false);
    try {
      localStorage.setItem("comerico.panelHidden", hidden ? "1" : "0");
    } catch {
      /* sin almacenamiento local */
    }
  };
  const [tick, setTick] = useState(0);
  const latest = useRef({ orders, coupons });
  latest.current = { orders, coupons };
  const idSeq = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 20000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.undo ? 5000 : 3600);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({
          day: dateKey(0),
          role,
          user,
          history,
          coupons,
          spins,
          rewardedLevels,
          favorites,
          places,
          activePlace,
          subs,
          notices,
          noticePrefs,
          lastPrefs,
          orders,
          stock,
          published,
          onboarded,
          lastOrderId,
          selectedCouponId,
        }),
      );
    } catch {
      /* sin almacenamiento local: la demo funciona igual */
    }
  }, [
    role,
    user,
    history,
    coupons,
    spins,
    rewardedLevels,
    favorites,
    places,
    activePlace,
    subs,
    notices,
    noticePrefs,
    lastPrefs,
    orders,
    stock,
    published,
    onboarded,
    lastOrderId,
    selectedCouponId,
  ]);

  const points = history.reduce((acc, h) => acc + h.pts, 0);
  const myOrders = orders.filter((o) => !!user.email && o.customer === user.email);
  const activeEntry = places.find((pl) => pl.name === activePlace) ?? places[0];
  const activeAddress = activeEntry?.address ?? HOME_ADDRESS;
  const activePoint =
    activeEntry && hasCoverage(activeAddress)
      ? { x: activeEntry.x, y: activeEntry.y }
      : { x: 0, y: 900 };
  const stockOf = (key: string) => stock[key] ?? 0;
  const weekStart = dateKey(-todayIndex());
  const freeShipAvailable =
    levelIndex(points) >= 2 &&
    !myOrders.some((o) => o.freeShip && o.status !== "Cancelado" && o.day >= weekStart);

  const go = (s: Screen) => {
    if (s !== screen) setStack((prev) => [...prev.slice(-30), screen]);
    // Cierra avisos de la pantalla anterior, pero conserva el que acompaña a esta navegación.
    setToast((t) => (t && Date.now() - t.id > 400 ? null : t));
    setScreen(s);
    setMenu(false);
    if (TAB_SCREENS.includes(s)) setLastTab(s);
  };
  const resetTo = (s: Screen) => {
    setStack([]);
    setMenu(false);
    setScreen(s);
    if (TAB_SCREENS.includes(s)) setLastTab(s);
  };
  const goBack = () => {
    const prev = stack[stack.length - 1] ?? (role === "business" ? "dashboard" : "home");
    setStack((st) => st.slice(0, -1));
    setScreen(prev);
    if (TAB_SCREENS.includes(prev)) setLastTab(prev);
  };
  const notify = (text: string, undo?: () => void) => setToast({ id: Date.now(), text, undo });

  const pushNotice = (text: string, kind: NoticeKind, orderRef?: string) => {
    setNotices((prev) =>
      [
        {
          id: `n${Date.now()}${Math.random()}`,
          text,
          at: nowMin(),
          day: dateKey(0),
          read: false,
          kind,
          orderId: orderRef,
        },
        ...prev,
      ].slice(0, 60),
    );
    if (role === "client" && noticePrefs[kind]) setToast({ id: Date.now(), text });
  };

  const addPoints = (
    delta: number,
    label: string,
    detail: string,
    kind: PointsEntry["kind"],
    orderRef?: string,
  ) => {
    const next = points + delta;
    if (delta > 0 && levelIndex(next) > levelIndex(points)) {
      setLevelUp(levelOf(next));
      const newly = LEVELS.slice(levelIndex(points) + 1, levelIndex(next) + 1)
        .map((l) => l.name)
        .filter((n) => !rewardedLevels.includes(n) && LEVEL_COUPON[n]);
      if (newly.length) {
        setRewardedLevels((prev) => [...prev, ...newly]);
        setCoupons((prev) => [...newly.map((n) => levelCoupon(n, orderRef)), ...prev]);
        pushNotice(
          `¡Subiste a ${levelOf(next).name}! Te regalamos un cupón de S/ ${LEVEL_COUPON[newly[newly.length - 1]]}.`,
          "premios",
        );
      }
    }
    setHistory((prev) => [
      {
        id: `p${Date.now()}${Math.random()}`,
        label,
        detail,
        pts: delta,
        date: keyLabel(dateKey(0)),
        orderId: orderRef,
        kind,
      },
      ...prev,
    ]);
  };

  const nextOrderId = () => {
    const base = Math.max(4800, ...latest.current.orders.map((o) => Number(o.id.slice(5)) || 0));
    idSeq.current = Math.max(idSeq.current + 1, base + 1);
    return `RICO-${idSeq.current}`;
  };
  const customerName = `${user.first} ${user.last.charAt(0)}${user.last ? "." : ""}`.trim();

  const setOrderStatus: Shop["setOrderStatus"] = (id, status, opts = {}) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    const mine = !!user.email && o.customer === user.email;
    // La demo permite confirmar la recepción sin recorrer los estados del local.
    const demoReceipt =
      opts.by === "cliente" &&
      mine &&
      isActiveOrder(o) &&
      status === (o.mode === "pickup" ? "Recogido" : "Entregado");
    if (!demoReceipt && !canTransition(o, status)) return;
    const now = nowMin();
    const patch: Partial<Order> = {
      status,
      timeline: [...o.timeline, { status, at: now }],
      note: opts.note ?? o.note,
    };
    if (status === "Cancelado") {
      setStock((s) => ({ ...s, [o.product.key]: (s[o.product.key] ?? 0) + o.qty }));
      if (o.couponId)
        setCoupons((prev) => prev.map((c) => (c.id === o.couponId ? { ...c, used: false } : c)));
    }
    let granted = 0;
    if ((status === "Recogido" || status === "Entregado") && mine && !o.pointsAwarded) {
      granted = spinsPerOrder(points);
      addPoints(o.points, `Pedido ${o.id}`, `${o.qty} × ${o.product.name}`, "gana", o.id);
      setSpins((n) => n + granted);
      patch.pointsAwarded = true;
      patch.spinsGranted = granted;
    }
    setOrders((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    if (!mine) return;
    const store = o.product.store;
    const refund =
      o.method === "cash" ? "No se realizó ningún cobro." : "El reembolso llega en hasta 5 días.";
    const thanks = `¡Pedido completado! Ganaste ${o.points} pts y ${granted} ${granted === 1 ? "giro" : "giros"} con el pedido ${o.id}.`;
    const messages: Partial<Record<OrderStatus, string>> = {
      "En preparación": `${store} empezó a preparar tu pedido ${o.id}.`,
      "Listo para recoger": `¡Tu pedido ${o.id} está listo! Recógelo en ${store} hasta las ${minLabel(o.product.to)} con tu código.`,
      "En camino": `${store} despachó tu pedido ${o.id} a las ${minLabel(now)} Llega entre ${slotLabel(o.slot)}`,
      Recogido: thanks,
      Entregado: thanks,
      Cancelado:
        opts.by === "local"
          ? `${store} canceló tu pedido ${o.id}. ${opts.note ?? ""} ${refund}`
          : `Cancelaste el pedido ${o.id}. ${refund}`,
      "No recogido": `No recogiste tu pedido ${o.id} antes de las ${minLabel(o.product.to)} Como el local ya lo preparó, no hay reembolso.`,
    };
    const text = messages[status];
    if (text)
      pushNotice(text.replace(/\s+/g, " "), o.subscriptionId ? "suscripciones" : "pedidos", o.id);
  };

  const undoCompletion = (id: string, prev: OrderStatus) => {
    const o = latest.current.orders.find((x) => x.id === id);
    if (!o || !isCompleted(o)) return;
    if (o.pointsAwarded)
      setHistory((h) => [
        {
          id: `p${Date.now()}${Math.random()}`,
          label: `Corrección pedido ${o.id}`,
          detail: "Se deshizo la confirmación de entrega",
          pts: -o.points,
          date: keyLabel(dateKey(0)),
          orderId: o.id,
          kind: "revierte",
        },
        ...h,
      ]);
    if (o.spinsGranted) setSpins((n) => Math.max(0, n - (o.spinsGranted ?? 0)));
    const lvl = latest.current.coupons.filter(
      (c) => c.source === "nivel" && c.orderId === o.id && !c.used,
    );
    if (lvl.length) {
      setCoupons((p) => p.filter((c) => !lvl.some((x) => x.id === c.id)));
      setRewardedLevels((p) => p.filter((l) => !lvl.some((c) => c.name.includes(l))));
    }
    setLevelUp(null);
    setOrders((p) =>
      p.map((x) =>
        x.id === id
          ? {
              ...x,
              status: prev,
              pointsAwarded: false,
              spinsGranted: 0,
              timeline: x.timeline.slice(0, -1),
            }
          : x,
      ),
    );
  };

  const placeOrder: Shop["placeOrder"] = (d) => {
    const p = product;
    const left = stockOf(p.key);
    const a = availOf(p, left);
    if (a === "soldout") return { ok: false, reason: "Se agotó mientras pagabas." };
    if (a === "expired") return { ok: false, reason: "La ventana de recojo de hoy terminó." };
    if (qty > left) return { ok: false, reason: `Solo quedan ${left}. Ajusta la cantidad.` };
    if (d.slot.to <= nowMin()) return { ok: false, reason: "La franja elegida ya pasó." };
    const order: Order = {
      id: nextOrderId(),
      customer: user.email,
      customerName,
      product: p,
      qty,
      mode: d.mode,
      address: d.address,
      method: d.method,
      subtotal: d.subtotal,
      fee: d.fee,
      discount: d.discount,
      total: d.total,
      status: "Confirmado",
      day: dateKey(0),
      slot: d.slot,
      timeline: [{ status: "Confirmado", at: nowMin() }],
      points: pointsFor(d.subtotal),
      couponId: d.couponId,
      freeShip: d.freeShip,
    };
    setStock((s) => ({ ...s, [p.key]: (s[p.key] ?? 0) - qty }));
    if (d.couponId) {
      setCoupons((prev) => prev.map((c) => (c.id === d.couponId ? { ...c, used: true } : c)));
      setSelectedCouponId("");
    }
    setOrders((prev) => [order, ...prev]);
    setLastOrderId(order.id);
    setLastPrefs({ mode: d.mode, method: d.method });
    pushNotice(
      `Pedido ${order.id} confirmado · ${d.mode === "pickup" ? "recoge" : "llega"} hoy entre ${slotLabel(d.slot)}`,
      "pedidos",
      order.id,
    );
    return { ok: true, order };
  };

  const noPackSubDelivery = (oc: Occurrence, note = "Hoy el local no tuvo packs") => {
    if (orders.some((o) => o.subscriptionId === oc.sub.uid && o.day === oc.key)) return;
    const p = productFromOffer(offerFor(oc.sub.store));
    const order: Order = {
      id: nextOrderId(),
      customer: user.email,
      customerName,
      product: p,
      qty: 1,
      mode: oc.sub.mode,
      address: oc.sub.mode === "delivery" ? oc.sub.place : "",
      method: "yape",
      subtotal: 0,
      fee: 0,
      discount: 0,
      total: 0,
      status: "No disponible",
      day: oc.key,
      slot: { from: oc.sub.slot, to: oc.sub.slot + 30 },
      timeline: [{ status: "No disponible", at: nowMin() }],
      points: 0,
      subscriptionId: oc.sub.uid,
      note,
    };
    setOrders((prev) => [order, ...prev]);
    pushNotice(
      `Hoy ${oc.sub.store} no tuvo pack para tu suscripción: no se te cobró nada.`,
      "suscripciones",
      order.id,
    );
  };

  const confirmSubDelivery = (oc: Occurrence) => {
    if (
      oc.sub.skipped.includes(oc.key) ||
      orders.some((o) => o.subscriptionId === oc.sub.uid && o.day === oc.key)
    )
      return;
    const p = productFromOffer(offerFor(oc.sub.store));
    if (stockOf(p.key) <= 0) {
      noPackSubDelivery(oc, "El local se quedó sin packs hoy");
      return;
    }
    const fee = oc.sub.mode === "delivery" ? DELIVERY_FEE : 0;
    const slot = { from: oc.sub.slot, to: oc.sub.slot + 30 };
    const order: Order = {
      id: nextOrderId(),
      customer: user.email,
      customerName,
      product: p,
      qty: 1,
      mode: oc.sub.mode,
      address: oc.sub.mode === "delivery" ? oc.sub.place : "",
      method: "yape",
      subtotal: p.price,
      fee,
      discount: subDiscount(oc.sub),
      total: subPrice(oc.sub),
      status: "Confirmado",
      day: oc.key,
      slot,
      timeline: [{ status: "Confirmado", at: nowMin() }],
      points: pointsFor(p.price),
      subscriptionId: oc.sub.uid,
    };
    setStock((s) => ({ ...s, [p.key]: (s[p.key] ?? 0) - 1 }));
    setOrders((prev) => [order, ...prev]);
    pushNotice(
      `Suscripción ${oc.sub.store}: tu pack de hoy está confirmado. Se cobró ${money(order.total)} con Yape / Plin · ${oc.sub.mode === "pickup" ? "recoge" : "llega"} entre ${slotLabel(slot)}`,
      "suscripciones",
      order.id,
    );
  };

  // Reglas automáticas del reloj: "No recogido" al cerrar la ventana y recordatorio 30 min antes.
  useEffect(() => {
    const today = dateKey(0);
    const now = nowMin();
    orders.forEach((o) => {
      if (!isActiveOrder(o) || o.mode !== "pickup") return;
      const end = o.product.to;
      if (o.day < today || (o.day === today && now >= end)) {
        setOrderStatus(o.id, "No recogido", {
          by: "sistema",
          note: `No se recogió antes de las ${minLabel(end)}`,
        });
      } else if (
        o.day === today &&
        !o.reminded &&
        !!user.email &&
        o.customer === user.email &&
        end - now <= 30
      ) {
        setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, reminded: true } : x)));
        pushNotice(
          `Quedan ${end - now} min para recoger tu pedido ${o.id} en ${o.product.store}.`,
          "pedidos",
          o.id,
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, orders]);

  const applyProfile = (p: ClientProfile) => {
    setUser(p.user);
    setHistory(p.history);
    setCoupons(p.coupons);
    setSpins(p.spins);
    setRewardedLevels(p.rewardedLevels);
    setFavorites(p.favorites);
    setPlaces(p.places);
    setActivePlace(p.activePlace);
    setSubs(p.subs);
    setNotices(p.notices);
    setLastPrefs(p.lastPrefs);
    setSelectedCouponId("");
    setLevelUp(null);
    setLastOrderId(null);
  };
  const whenText = (key: string) =>
    key === dateKey(0) ? "de hoy" : key === dateKey(1) ? "de mañana" : `del ${keyLabel(key)}`;

  const shop: Shop = {
    role,
    user,
    setUser,
    isDemoUser: user.email === DEMO_EMAIL,
    login: (r) => {
      if (r === "client" && user.email !== DEMO_EMAIL) applyProfile(demoProfile());
      setRole(r);
      setOnboarded(true);
      resetTo(r === "client" ? "home" : "dashboard");
    },
    enterGuest: () => {
      applyProfile(freshProfile(guestUser));
      setRole("guest");
      setOnboarded(true);
      resetTo("home");
    },
    signup: (u) => {
      if (role === "guest") setUser(u);
      else applyProfile(freshProfile(u));
      setRole("client");
      setOnboarded(true);
      const dest: Screen = pendingCheckout ? "payment" : "home";
      setPendingCheckout(false);
      resetTo(dest);
      notify(`¡Bienvenida/o a ComeRICO, ${u.first}!`);
    },
    logout: () => {
      setRole(null);
      setPendingCheckout(false);
      resetTo("login");
    },
    requireAccount: () => {
      setPendingCheckout(true);
      go("signup");
    },
    goBack,
    lastTab,
    product,
    openProduct: (p) => {
      setProduct(p);
      setQty(1);
      setStoreName(p.store);
      setReturnTo(screen === "detail" || screen === "payment" ? returnTo : screen);
      go("detail");
    },
    returnTo,
    qty,
    setQty,
    stockOf,
    orders,
    myOrders,
    lastOrderId,
    placeOrder,
    setOrderStatus,
    undoCompletion,
    orderId,
    openOrder: (id) => {
      setOrderId(id);
      go("order");
    },
    completedWith: (store) => myOrders.some((o) => isCompleted(o) && o.product.store === store),
    points,
    history,
    levelUp,
    clearLevelUp: () => setLevelUp(null),
    reviewId,
    startReview: (id) => setReviewId(id),
    submitReview: (id, rating, tags) => {
      const o = orders.find((x) => x.id === id);
      if (!o || !isCompleted(o) || o.reviewed || o.customer !== user.email) return;
      addPoints(REVIEW_POINTS, "Reseña publicada", `${o.product.store} · ${o.id}`, "gana", o.id);
      setOrders((prev) =>
        prev.map((x) => (x.id === id ? { ...x, reviewed: true, rating, reviewTags: tags } : x)),
      );
    },
    places,
    activePlace,
    activeAddress,
    activePoint,
    setActivePlace,
    addPlace: (pl) => {
      setPlaces((prev) => [...prev, pl]);
      setActivePlace(pl.name);
    },
    distanceTo: (store) => distanceM(store, activePoint),
    favorites,
    toggleFavorite: (store) =>
      setFavorites((prev) =>
        prev.includes(store) ? prev.filter((x) => x !== store) : [...prev, store],
      ),
    subs,
    saveSub: (s) =>
      setSubs((prev) =>
        prev.some((x) => x.uid === s.uid)
          ? prev.map((x) => (x.uid === s.uid ? s : x))
          : [...prev, s],
      ),
    removeSub: (uid) => {
      const before = subs;
      const s = subs.find((x) => x.uid === uid);
      setSubs((prev) => prev.filter((x) => x.uid !== uid));
      notify(`Cancelaste tu suscripción a ${s?.store ?? "el local"}`, () => setSubs(before));
    },
    toggleSkip: (uid, key) => {
      const s = subs.find((x) => x.uid === uid);
      if (!s) return;
      const skipped = s.skipped.includes(key);
      setSubs((prev) =>
        prev.map((x) =>
          x.uid === uid
            ? { ...x, skipped: skipped ? x.skipped.filter((k) => k !== key) : [...x.skipped, key] }
            : x,
        ),
      );
      notify(
        skipped
          ? `Volverás a recibir la entrega ${whenText(key)} de ${s.store}`
          : `Saltaste la entrega ${whenText(key)} de ${s.store}: no se cobrará`,
      );
    },
    setPaused: (uid, paused) => {
      setSubs((prev) => prev.map((x) => (x.uid === uid ? { ...x, paused } : x)));
      notify(paused ? "Suscripción pausada: no se programarán entregas" : "Suscripción reanudada");
    },
    subDraft,
    openSubFor: (store) => setSubDraft(store),
    clearSubDraft: () => setSubDraft(null),
    confirmSubDelivery,
    noPackSubDelivery,
    spins,
    addDemoSpin: () => setSpins((n) => n + 1),
    coupons,
    selectedCouponId,
    selectCoupon: setSelectedCouponId,
    spin: (index) => {
      const seg = WHEEL[index];
      const c: Coupon = {
        ...seg,
        id: `cup-${Date.now()}`,
        used: false,
        expiresAt: Date.now() + COUPON_DAYS * 86400000,
        source: "ruleta",
      };
      setSpins((n) => Math.max(0, n - 1));
      setCoupons((prev) => [c, ...prev]);
      if (c.kind === "points") addPoints(c.value, "Premio de la ruleta", c.name, "bono");
      return c;
    },
    freeShipAvailable,
    lastPrefs,
    notices,
    markNoticesRead: () =>
      setNotices((prev) => prev.map((n) => (n.read ? n : { ...n, read: true }))),
    noticePrefs,
    setNoticePrefs,
    packsPreset,
    openAllPacks: (preset) => {
      setPacksPreset(preset);
      go("all-packs");
    },
    notify,
    onboarded,
    setOnboarded,
    helpTopic,
    openHelp: (topic = "") => {
      setHelpTopic(topic);
      go("help");
    },
    legalDoc,
    claimOrderId,
    openLegal: (doc, ref = "") => {
      setLegalDoc(doc);
      setClaimOrderId(ref);
      go("legal");
    },
    benefitsTab,
    openBenefits: (tab) => {
      setBenefitsTab(tab);
      go("levels");
    },
    published,
    publishOffer: (o) => {
      setPublished((prev) => [o, ...prev]);
      setStock((s) => ({ ...s, [`pub:${o.id}`]: o.qty }));
    },
    removePublished: (id) => {
      setPublished((prev) => prev.filter((x) => x.id !== id));
      setStock((s) => ({ ...s, [`pub:${id}`]: 0 }));
    },
    failNextPayment,
    setFailNextPayment,
    consumeFailure: () => {
      if (!failNextPayment) return false;
      setFailNextPayment(false);
      return true;
    },
    moveClock: (m) => {
      if (m === null) resetClock();
      else setClock(m);
      setTick((n) => n + 1);
    },
    resetDemo: () => {
      try {
        localStorage.removeItem(STORE_KEY);
      } catch {
        /* sin almacenamiento local */
      }
      window.location.reload();
    },
  };

  let view: ReactNode;
  switch (screen) {
    case "login":
      view = <Login go={go} />;
      break;
    case "home":
      view = <Home go={go} />;
      break;
    case "all-packs":
      view = <AllPacks go={go} />;
      break;
    case "empty-home":
      view = <EmptyHome go={go} />;
      break;
    case "map":
      view = (
        <MapScreen
          go={go}
          onOpenStore={(name) => {
            setStoreName(name);
            go("store");
          }}
        />
      );
      break;
    case "planner":
      view = <Planner go={go} />;
      break;
    case "locations":
      view = <Locations go={go} />;
      break;
    case "roulette":
      view = <Roulette go={go} />;
      break;
    case "favorites":
      view = <Favorites go={go} />;
      break;
    case "order":
      view = <OrderDetail go={go} />;
      break;
    case "notifications":
      view = <Notifications go={go} />;
      break;
    case "store":
      view = <StoreScreen go={go} storeName={storeName} />;
      break;
    case "map-denied":
      view = <MapScreen go={go} denied />;
      break;
    case "detail":
      view = <Detail go={go} />;
      break;
    case "soldout":
      view = <Detail go={go} state="soldout" />;
      break;
    case "expired":
      view = <Detail go={go} state="expired" />;
      break;
    case "payment":
      view = <Payment go={go} />;
      break;
    case "payment-error":
      view = <PaymentError go={go} />;
      break;
    case "confirmation":
      view = <Confirmation go={go} />;
      break;
    case "orders":
      view = <Orders go={go} />;
      break;
    case "orders-empty":
      view = <Orders go={go} empty />;
      break;
    case "review":
      view = <Review go={go} />;
      break;
    case "profile":
      view = <Profile go={go} />;
      break;
    case "edit-profile":
      view = <EditProfile go={go} />;
      break;
    case "help":
      view = <Help go={go} />;
      break;
    case "legal":
      view = <Legal go={go} />;
      break;
    case "forgot":
      view = <Forgot go={go} />;
      break;
    case "signup":
      view = <Signup go={go} />;
      break;
    case "business-profile":
      view = <BusinessProfile go={go} />;
      break;
    case "levels":
      view = <Levels go={go} />;
      break;
    case "dashboard":
      view = <Dashboard go={go} />;
      break;
    case "publish":
      view = <Publish go={go} />;
      break;
    case "publish-errors":
      view = <Publish go={go} errors />;
      break;
    case "pack":
      view = <PackForm go={go} />;
      break;
    case "business-orders":
      view = <BusinessOrders go={go} />;
      break;
  }
  return (
    <ShopContext.Provider value={shop}>
      <main className="prototype-canvas">
        <div className="phone-frame">
          {view}
          {(screen === "login" || screen === "home") && !onboarded && (
            <Onboarding onDone={() => setOnboarded(true)} />
          )}
          {role === "client" && screen !== "login" && <LevelUpModal />}
          {toast && !(levelUp && role === "client" && screen !== "login") && (
            <div className="app-toast" role="status" key={toast.id}>
              <span>{toast.text}</span>
              {toast.undo && (
                <button
                  onClick={() => {
                    toast.undo?.();
                    setToast(null);
                  }}
                >
                  <Icon name="undo" size={15} /> Deshacer
                </button>
              )}
            </div>
          )}
        </div>
        {panelHidden && (
          <button
            className="panel-show"
            onClick={() => togglePanel(false)}
            aria-label="Mostrar el panel de frames y controles de demo"
            title="Mostrar panel"
          >
            <Icon name="map" size={16} /> Mostrar panel
          </button>
        )}
        <aside className="annotation" hidden={panelHidden}>
          <button
            className="panel-hide"
            onClick={() => togglePanel(true)}
            aria-label="Ocultar el panel de frames y controles de demo"
            title="Ocultar panel"
          >
            <Icon name="x" size={14} />
          </button>
          <div className="annotation-title">FRAME · {screenNames[screen]}</div>
          <b>{heuristics[screen]}</b>
          <p>Heurísticas de Nielsen aplicadas en esta pantalla.</p>
          <button onClick={() => setMenu(!menu)}>
            <Icon name="map" size={18} /> Ver todos los frames
          </button>
          {menu && (
            <div className="screen-menu">
              {(Object.keys(screenNames) as Screen[]).map((s) => (
                <button key={s} className={s === screen ? "active" : ""} onClick={() => go(s)}>
                  <span>{screenNames[s]}</span>
                  <small>{heuristics[s]}</small>
                </button>
              ))}
            </div>
          )}
          <DemoPanel go={go} />
        </aside>
        <button
          className="mobile-frame-menu"
          aria-label="Abrir controles de demo y frames"
          onClick={() => setMenu(!menu)}
        >
          Demo
        </button>
        {menu && (
          <div className="mobile-menu-sheet">
            <div>
              <b>Demo y frames</b>
              <button onClick={() => setMenu(false)}>Cerrar</button>
            </div>
            <DemoPanel go={go} />
            {(Object.keys(screenNames) as Screen[]).map((s) => (
              <button key={s} onClick={() => go(s)}>
                <span>{screenNames[s]}</span>
                <small>{heuristics[s]}</small>
              </button>
            ))}
          </div>
        )}
      </main>
    </ShopContext.Provider>
  );
}
