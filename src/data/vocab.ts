export interface Word {
  en: string;
  es: string;
  emoji: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameEs: string;
  emoji: string;
  color: string;
  words: Word[];
}

export const CATEGORIES: Category[] = [
  {
    id: "animals",
    nameEn: "Animals",
    nameEs: "Animales",
    emoji: "🦁",
    color: "#ffc531",
    words: [
      { en: "dog", es: "perro", emoji: "🐶" },
      { en: "cat", es: "gato", emoji: "🐱" },
      { en: "bird", es: "pájaro", emoji: "🐦" },
      { en: "fish", es: "pez", emoji: "🐟" },
      { en: "horse", es: "caballo", emoji: "🐴" },
      { en: "frog", es: "rana", emoji: "🐸" },
      { en: "duck", es: "pato", emoji: "🦆" },
      { en: "lion", es: "león", emoji: "🦁" },
      { en: "elephant", es: "elefante", emoji: "🐘" },
      { en: "rabbit", es: "conejo", emoji: "🐰" },
    ],
  },
  {
    id: "colors",
    nameEn: "Colors",
    nameEs: "Colores",
    emoji: "🎨",
    color: "#ff8fc0",
    words: [
      { en: "red", es: "rojo", emoji: "🔴" },
      { en: "blue", es: "azul", emoji: "🔵" },
      { en: "green", es: "verde", emoji: "🟢" },
      { en: "yellow", es: "amarillo", emoji: "🟡" },
      { en: "orange", es: "naranja", emoji: "🟠" },
      { en: "purple", es: "morado", emoji: "🟣" },
      { en: "pink", es: "rosa", emoji: "🩷" },
      { en: "black", es: "negro", emoji: "⚫" },
      { en: "white", es: "blanco", emoji: "⚪" },
      { en: "brown", es: "marrón", emoji: "🟤" },
    ],
  },
  {
    id: "numbers",
    nameEn: "Numbers",
    nameEs: "Números",
    emoji: "🔢",
    color: "#59b9f2",
    words: [
      { en: "one", es: "uno", emoji: "1️⃣" },
      { en: "two", es: "dos", emoji: "2️⃣" },
      { en: "three", es: "tres", emoji: "3️⃣" },
      { en: "four", es: "cuatro", emoji: "4️⃣" },
      { en: "five", es: "cinco", emoji: "5️⃣" },
      { en: "six", es: "seis", emoji: "6️⃣" },
      { en: "seven", es: "siete", emoji: "7️⃣" },
      { en: "eight", es: "ocho", emoji: "8️⃣" },
      { en: "nine", es: "nueve", emoji: "9️⃣" },
      { en: "ten", es: "diez", emoji: "🔟" },
    ],
  },
  {
    id: "food",
    nameEn: "Food",
    nameEs: "Comida",
    emoji: "🍎",
    color: "#ff6b6b",
    words: [
      { en: "apple", es: "manzana", emoji: "🍎" },
      { en: "banana", es: "plátano", emoji: "🍌" },
      { en: "milk", es: "leche", emoji: "🥛" },
      { en: "bread", es: "pan", emoji: "🍞" },
      { en: "cheese", es: "queso", emoji: "🧀" },
      { en: "egg", es: "huevo", emoji: "🥚" },
      { en: "water", es: "agua", emoji: "💧" },
      { en: "cookie", es: "galleta", emoji: "🍪" },
      { en: "pizza", es: "pizza", emoji: "🍕" },
      { en: "ice cream", es: "helado", emoji: "🍦" },
    ],
  },
  {
    id: "family",
    nameEn: "Family",
    nameEs: "Familia",
    emoji: "👨‍👩‍👧‍👦",
    color: "#8f7bf7",
    words: [
      { en: "mom", es: "mamá", emoji: "👩" },
      { en: "dad", es: "papá", emoji: "👨" },
      { en: "brother", es: "hermano", emoji: "👦" },
      { en: "sister", es: "hermana", emoji: "👧" },
      { en: "baby", es: "bebé", emoji: "👶" },
      { en: "grandma", es: "abuela", emoji: "👵" },
      { en: "grandpa", es: "abuelo", emoji: "👴" },
      { en: "family", es: "familia", emoji: "👨‍👩‍👧‍👦" },
    ],
  },
  {
    id: "body",
    nameEn: "Body",
    nameEs: "Cuerpo",
    emoji: "🖐️",
    color: "#4bc96b",
    words: [
      { en: "eye", es: "ojo", emoji: "👁️" },
      { en: "ear", es: "oreja", emoji: "👂" },
      { en: "nose", es: "nariz", emoji: "👃" },
      { en: "mouth", es: "boca", emoji: "👄" },
      { en: "hand", es: "mano", emoji: "✋" },
      { en: "foot", es: "pie", emoji: "🦶" },
      { en: "arm", es: "brazo", emoji: "💪" },
      { en: "leg", es: "pierna", emoji: "🦵" },
      { en: "tooth", es: "diente", emoji: "🦷" },
      { en: "head", es: "cabeza", emoji: "🙂" },
    ],
  },
];

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const AVATARS = ["🐥", "🦊", "🐼", "🐙", "🦄", "🐢", "🐝", "🐬", "🦖", "🐨"];

export function avatarFor(index: number): string {
  return AVATARS[index % AVATARS.length];
}
