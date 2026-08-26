/**
 * ============================================================
 *  DATOS INSTITUCIONALES DEL PROYECTO
 *  Tomados del documento de proyecto formativo:
 *  "Articulación con la Media - Doble Titulación"
 *  IE Gonzalo Rivera Laguado · SENA · Cúcuta
 * ============================================================
 */

export const INSTITUTION = {
  nombre: "SENA",
  nombreCompleto: "Servicio Nacional de Aprendizaje",
  estrategia: "Articulación con la Media · Doble Titulación",
  institucionEducativa: "Institución Educativa Gonzalo Rivera Laguado",
  ciudad: "Cúcuta",
  pais: "Colombia",
  programa: "Técnico en Sistemas Teleinformáticos",
  codigoPrograma: "233108 v1",
  ficha: "3156695",
  vigencia: "2025 – 2026",
  fechaInicio: "4 de agosto de 2025",
  fechaFin: "9 de octubre de 2026",
  proyecto: "English Kids",
  subtitulo: "Plataforma de aprendizaje de inglés para grados 3º a 5º de primaria",
  slogan: "Formación gratuita para todos los colombianos",

  problema:
    "En muchas instituciones educativas, los estudiantes de 3º a 5º de primaria presentan dificultades para aprender inglés de manera efectiva: los métodos tradicionales no logran captar su atención ni adaptarse a sus formas de aprendizaje. Los niños pierden el interés, lo que afecta el desarrollo de sus habilidades comunicativas, y hacen falta herramientas digitales adecuadas para su edad que les permitan practicar el idioma de forma divertida y constante.",

  solucion:
    "English Kids es una plataforma web educativa dirigida a niños de 3º a 5º de primaria que transforma el aprendizaje del inglés en una experiencia divertida, accesible e interactiva. Combina tarjetas de vocabulario con pronunciación real, un quiz por módulos con corazones y estrellas, un juego de memoria y un certificado final, todo acompañado por Bubi, el búho profesor. Los docentes pueden recomendarla como apoyo a sus clases y las familias usarla en casa como refuerzo, para que los estudiantes pierdan el miedo al inglés y desarrollen gusto por aprenderlo.",

  objetivoGeneral:
    "Crear una plataforma web de aprendizaje de inglés para los grados de 3º a 5º de primaria.",

  objetivosEspecificos: [
    "Encuestar a los docentes de 3º a 5º de primaria para conocer sus opiniones y necesidades frente al proceso de enseñanza del inglés.",
    "Analizar los resultados de las encuestas y la retroalimentación docente para ajustar y mejorar el diseño de la plataforma, de modo que responda a las necesidades reales de los estudiantes.",
    "Diseñar y validar bocetos de la plataforma, escuchando las recomendaciones de los docentes sobre su apariencia y funcionamiento.",
    "Crear la plataforma web funcional con actividades interactivas, pronunciación en inglés y seguimiento del avance de cada estudiante.",
  ],

  beneficios: [
    "Favorece el aprendizaje interactivo y didáctico del idioma inglés.",
    "Mejora las habilidades de escucha, lectura y pronunciación.",
    "Motiva al estudiante con actividades digitales adaptadas a su nivel.",
    "Facilita al docente la evaluación y el seguimiento del progreso individual.",
    "Promueve el uso responsable y formativo de las TIC en el aula.",
  ],

  integrantes: [
    "Rogher Moncada",
    "Yampier Herrera",
    "Ricardo Rodriguez",
    "Darwin Cabrera",
    "Jayco Contreras",
    "Sebastian Palacios",
  ],

  cifras: [
    { valor: "3º a 5º", label: "grados de primaria" },
    { valor: "6 módulos", label: "· 58 palabras en inglés" },
    { valor: "$120.000", label: "vs $5.000.000 de la competencia" },
    { valor: "30 %", label: "menos uso de papel y fotocopias" },
  ],

  impactos: [
    {
      id: "economico",
      titulo: "Económico",
      emoji: "💰",
      color: "#ffc531",
      texto:
        "Ahorro estimado del 30 % en papelería y material impreso gracias a la digitalización de actividades, y optimización del tiempo docente al automatizar la evaluación y el seguimiento del progreso.",
    },
    {
      id: "regional",
      titulo: "Regional",
      emoji: "🏙️",
      color: "#59b9f2",
      texto:
        "Fortalece las competencias tecnológicas de Cúcuta: aprendices y técnicos locales aplican programación, diseño web y pedagogía digital, generando experiencia laboral en el sector educativo-tecnológico.",
    },
    {
      id: "social",
      titulo: "Social",
      emoji: "🤝",
      color: "#ff8fc0",
      texto:
        "Un espacio virtual interactivo que promueve la participación activa, la inclusión tecnológica y una mejor comunicación entre docentes, estudiantes y familias en torno al progreso académico.",
    },
    {
      id: "ambiental",
      titulo: "Ambiental",
      emoji: "🌱",
      color: "#4bc96b",
      texto:
        "Los contenidos digitales no generan desechos físicos: menos papel y tinta, uso eficiente de la energía y correcta disposición de los equipos al final de su vida útil.",
    },
  ],



  fichaTecnica: [
    ["Estrategia", "Articulación con la Media · Doble Titulación"],
    ["Institución formadora", "SENA — Servicio Nacional de Aprendizaje"],
    ["Institución educativa", "IE Gonzalo Rivera Laguado · Cúcuta 🇨🇴"],
    ["Programa de formación", "Técnico en Sistemas Teleinformáticos · 233108 v1"],
    ["Ficha", "3156695"],
    ["Vigencia", "2025 – 2026 (4 ago 2025 → 9 oct 2026)"],
    ["Población objetivo", "Estudiantes de 3º, 4º y 5º de primaria"],
    ["Estado", "Plataforma web funcional"],
  ] as [string, string][],
};
