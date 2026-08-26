# English Kids 🦉 — Proyecto formativo SENA (Ficha 3156695)

**Articulación con la Media · Doble Titulación** — Técnico en Sistemas Teleinformáticos (código 233108 v1)
Institución Educativa Gonzalo Rivera Laguado · Cúcuta, Colombia · Vigencia 2025–2026

Plataforma de aprendizaje de inglés para estudiantes de **3º a 5º de primaria**:

- **Aprender** — tarjetas con dibujo, palabra y pronunciación en inglés (voz real del navegador) y sonidos de animales.
- **Quiz** — evaluación por módulos: 8 preguntas, 3 corazones, estrellas y confeti. Con 4+ aciertos el módulo queda aprobado.
- **Memoria** — parejas dibujo–palabra con cronómetro e intentos.
- **Gran Certificado** — al aprobar los 6 módulos se desbloquea el cofre y se genera un mini-certificado con nombre, fecha y opción de imprimir.
- **Proyecto** — carátula institucional con el problema, los objetivos, el equipo, los impactos y la ficha técnica.

## ¿Dónde se guarda la información?

No usa cuentas ni servidores: **todo se guarda en la caché del navegador** (localStorage).
Cada computador/navegador conserva su propio avance: módulos aprobados, estrellas, historial de partidas y certificado.
Si se borra la caché del navegador, el progreso se reinicia (hay botón "Borrar progreso" en la pestaña Diploma).

## Ejecutar en local

```bash
npm install
npm run dev
```

## Publicar en internet (GitHub → Vercel)

Es una aplicación 100 % estática: no necesita base de datos ni variables de entorno.

1. **Sube el código a GitHub**
   - Crea un repositorio nuevo (por ejemplo `English-Kids`) en [github.com/new](https://github.com/new).
   - Sube los archivos del proyecto (sin la carpeta `node_modules`, que se regenera sola).
2. **Conecta Vercel**
   - Entra a [vercel.com](https://vercel.com) → **Add New Project** → importa el repositorio.
   - Vercel detecta Vite automáticamente: comando `npm run build`, carpeta de salida `dist`.
   - Pulsa **Deploy**. En ~1 minuto la app estará en `https://tu-proyecto.vercel.app`.
3. Cada `git push` a la rama `main` genera un nuevo despliegue automático.

> 💡 También puedes usar **Netlify** o **GitHub Pages**: basta con publicar la carpeta `dist` que genera `npm run build`.

## Estructura del código

```
src/
  views/        Home · Flashcards · Quiz · Memory · Certificate · Project
  lib/          sound.ts (voz, efectos y animales) · store.ts (progreso en caché)
  components/   Background · Mascot · Letters
  data/         vocabulario EN/ES · información institucional del proyecto
```

Lógica de sonido separada de la visual, estados de carga/finalizado explícitos y comentarios en español.
