# English Kids 🦉 — Proyecto formativo SENA (Ficha 7080 · ADSO)

Aplicación web para que los niños aprendan inglés jugando, reescrita desde cero, limpia y funcional:

- **Aprender**: tarjetas de vocabulario con pronunciación en inglés (Web Speech API) y sonidos de animales.
- **Quiz**: evaluación por módulos con corazones, estrellas y puntuación (4+ aciertos aprueban el módulo).
- **Memoria**: parejas dibujo–palabra con cronómetro.
- **Certificado**: al completar los 6 módulos se desbloquea el cofre y se genera un mini-certificado con nombre, fecha y opción de imprimir.
- **Alumnos**: perfiles, perfil activo e historial de partidas.
- Sonidos amigables sintetizados con WebAudio (sin archivos externos), animaciones de letras y transiciones pausadas.

## Modos de datos

- **Modo demo (sin backend):** todo funciona igual; alumnos, puntuaciones y progreso se guardan en el navegador (`localStorage`).
- **Modo nube:** si detecta la API (`/api/health`), guarda alumnos y puntuaciones en **MongoDB** automáticamente.

## Ejecutar en local

```bash
npm install
npm run dev        # solo frontend (modo demo)
```

Para probar el backend localmente:

```bash
# requiere la CLI de Vercel
vercel dev
```

## Desplegar en Vercel con MongoDB

1. Crea un clúster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas) y obtén tu `MONGODB_URI`.
2. Sube este proyecto a GitHub.
3. En [vercel.com](https://vercel.com) → **Add New Project** → importa el repositorio (Vercel detecta Vite solo).
4. En **Settings → Environment Variables** añade:
   - `MONGODB_URI` = tu cadena de conexión
   - `MONGODB_DB` = `englishkids` (opcional)
5. **Deploy**. La web queda en `https://tu-proyecto.vercel.app` con base de datos conectada.

## Estructura

```
src/
  views/      Home · Flashcards · Quiz · Memory · Students · Certificate · Project
  lib/        api.ts (nube con respaldo local) · sound.ts (voz, efectos y animales) · progress.ts (módulos y certificado)
  components/ Background · Mascot · Letters
  data/       vocabulario EN/ES · datos institucionales del proyecto
api/          Serverless functions de Vercel (MongoDB)
```

Los datos institucionales (SENA, ficha, objetivos) se editan en `src/data/project.ts`.
