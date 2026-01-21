# 🎮 PokéDex Ultimate - Explora el Mundo Pokémon

<div align="center">
  
  ![Pokemon Banner](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.4.9-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-7952B3?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com/)
  [![PokéAPI](https://img.shields.io/badge/PokéAPI-v2-EF5350?style=for-the-badge&logo=pokemon)](https://pokeapi.co/)

**Una PokéDex moderna con el diseño oficial de Pokémon** ⚪🔴

_Explora más de 500 Pokémon con animaciones premium y diseño Pokéball_

</div>

---

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [🎨 Diseño y Paleta de Colores](#-diseño-y-paleta-de-colores)
- [🛠️ Tecnologías](#️-tecnologías)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [⚙️ Instalación](#️-instalación)
- [🚀 Uso](#-uso)
- [🎯 Funcionalidades Principales](#-funcionalidades-principales)
- [📱 Vistas](#-vistas)
- [🌐 API Utilizada](#-api-utilizada)
- [✅ Mejoras Implementadas](#-mejoras-implementadas)
- [👤 Autor](#-autor)

---

## ✨ Características

### 🎯 Funcionalidades Core

- **500+ Pokémon**: Catálogo completo de la PokéAPI con información detallada
- **Paginación inteligente**: Sistema de "Load More" que carga 30 Pokémon por página
- **Búsqueda en tiempo real**: Filtra Pokémon instantáneamente mientras escribes
- **Filtro por tipo**: Selector dinámico para explorar por tipo de Pokémon
- **Dos modos de vista**: Alterna entre vista de tarjetas (Grid) y selector compacto
- **Información completa**: Estadísticas, tipos, habilidades, altura, peso y más
- **Responsive design**: Optimizado para móviles, tablets y escritorio

### 🎨 Experiencia Visual

- **Paleta oficial Pokémon**: Colores auténticos (Rojo #DC0A2D, Amarillo #FFCB05, Azul #3B4CCA)
- **Diseño Pokéball**: Esquema de colores blanco/negro/rojo inspirado en la Pokéball icónica
- **Animaciones premium**:
  - Cubic-bezier timing functions para movimientos naturales
  - Efectos de entrada con transformaciones 3D
  - Animaciones de hover con rotación y escalado
  - Ripple effects en botones
  - Stagger animations en listas
  - Shimmer effects en barras de estadísticas
  - Float animations en imágenes
- **Gradientes dinámicos**: Cada tipo de Pokémon tiene su gradiente único
- **Glassmorphism**: Efectos de vidrio esmerilado en componentes clave

---

## 🎨 Diseño y Paleta de Colores

### Colores Principales (Esquema Pokéball)

```css
--pokemon-red: #dc0a2d; /* Rojo oficial de Pokémon */
--pokemon-white: #ffffff; /* Blanco Pokéball */
--pokemon-black: #1a1a1a; /* Negro para bordes y texto */
--pokemon-yellow: #ffcb05; /* Amarillo Pikachu (acentos) */
--pokemon-blue: #3b4cca; /* Azul oficial (acentos) */
```

### Características de Diseño

- **Navbar**: Gradiente rojo con borde negro inferior
- **Footer**: Gradiente negro con borde rojo superior
- **Cards**: Fondo blanco grisáceo con bordes negros sólidos de 3px
- **Fondos**: Blancos y grises claros para máximo contraste
- **Textos**: Negro sobre fondos claros para perfecta legibilidad
- **Info boxes**: Bordes negros con sombras suaves

---

## 🛠️ Tecnologías

### Frontend

- **React 18.2** - Biblioteca de UI con Hooks
- **React Router DOM 6** - Navegación SPA
- **Vite 4.4.9** - Build tool ultra rápido
- **Bootstrap 5.3** - Framework CSS responsive
- **Font Awesome 6** - Iconografía profesional

### Desarrollo

- **ESLint** - Linting y code quality
- **CSS Modules** - Estilos con scoped CSS
- **Context API** - Gestión de estado global
- **Fetch API** - Peticiones HTTP

### API

- **PokéAPI v2** - Base de datos oficial de Pokémon (https://pokeapi.co)

---

## 📁 Estructura del Proyecto

```
poke-api/
├── public/              # Archivos estáticos
├── src/
│   ├── assets/         # Imágenes y recursos
│   │   └── img/
│   ├── components/     # Componentes reutilizables
│   │   ├── Card.jsx           # Detalle de Pokémon individual
│   │   ├── Card.css
│   │   ├── Footer.jsx         # Footer con gradiente negro
│   │   ├── Footer.css
│   │   ├── NavBar.jsx         # Navegación con gradiente rojo
│   │   ├── NavBar.css
│   │   ├── NotFound.jsx       # Página 404
│   │   └── NotFound.css
│   ├── context/        # Context API
│   │   └── context.js         # Estado global de Pokémon
│   ├── views/          # Páginas principales
│   │   ├── Home.jsx           # Landing page con hero
│   │   ├── Home.css
│   │   ├── Gallery.jsx        # Galería principal con paginación
│   │   └── Gallery.css
│   ├── App.jsx         # Componente raíz con rutas
│   ├── App.css         # Estilos globales
│   ├── main.jsx        # Entry point
│   └── index.css       # Variables CSS y estilos base
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Instalación

### Prerrequisitos

- Node.js 16+ y npm/yarn instalados
- Git (opcional)

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/poke-api.git
cd poke-api
```

2. **Instalar dependencias**

```bash
npm install
# o con yarn
yarn install
```

3. **Iniciar servidor de desarrollo**

```bash
npm run dev
# o con yarn
yarn dev
```

4. **Abrir en navegador**

```
http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Genera build de producción
npm run preview  # Preview del build
npm run lint     # Ejecuta ESLint
```

---

## 🚀 Uso

### Navegación

1. **Página de Inicio**: Hero section con presentación y call-to-action
2. **Galería**: Vista principal con todos los Pokémon
3. **Detalle**: Click en cualquier Pokémon para ver información completa

### Funcionalidades

#### 🔍 Búsqueda

- Escribe en la barra de búsqueda para filtrar en tiempo real
- Busca por nombre o número de Pokédex

#### 🎭 Filtro por Tipo

- Usa el selector para ver solo Pokémon de un tipo específico
- Disponible en ambos modos de vista

#### 📊 Paginación

- Carga inicial: 30 Pokémon
- Click en "Cargar Más Pokémon" para ver otros 30
- Contador de Pokémon mostrados vs disponibles

#### 🔄 Modos de Vista

- **Vista Grid**: Tarjetas grandes con imágenes
- **Vista Selector**: Lista compacta para exploración rápida

---

## 🎯 Funcionalidades Principales

### 1. Sistema de Paginación

```javascript
const ITEMS_PER_PAGE = 30;
const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);

const loadMorePokemon = () => {
  setItemsToShow((prev) => prev + ITEMS_PER_PAGE);
};
```

### 2. Búsqueda en Tiempo Real

- Filtra por nombre mientras escribes
- No distingue mayúsculas/minúsculas
- Sin delay, instantáneo

### 3. Filtrado por Tipo

- 18 tipos de Pokémon disponibles
- Cada tipo con color oficial
- Compatibilidad con búsqueda simultánea

### 4. Animaciones Avanzadas

```css
/* Ejemplo de cubic-bezier timing */
transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Animación de entrada 3D */
@keyframes cardEnter {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.9) rotateX(10deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateX(0deg);
  }
}
```

---

## 📱 Vistas

### Home - Página de Inicio

- Hero section con título animado
- Feature cards mostrando capacidades
- Call-to-action con botón "Explorar Pokédex"
- Diseño centrado y atractivo

### Gallery - Galería Principal

- Grid responsive de cards Pokémon
- Barra de búsqueda con icono
- Selector de tipos
- Botón "Load More" con contador
- Vista alternativa de selector compacto
- Indicador de Pokémon mostrados/disponibles

### Card - Detalle de Pokémon

- Imagen oficial de alta calidad
- Número de Pokédex y nombre
- Badges de tipos con colores oficiales
- Descripción del Pokémon
- Estadísticas con barras animadas
- Información física (altura, peso)
- Habilidades
- Botón de regreso animado

### NotFound - 404

- Página de error personalizada
- Botón para volver al inicio

---

## 🌐 API Utilizada

### PokéAPI v2

**Endpoint principal**: `https://pokeapi.co/api/v2/pokemon?limit=500`

#### Datos obtenidos:

- Nombre y número de Pokédex
- Tipos (normal, fire, water, etc.)
- Estadísticas base (HP, Attack, Defense, Speed, etc.)
- Altura y peso
- Habilidades
- Sprites oficiales
- Descripciones (flavor text)

#### Endpoints utilizados:

```javascript
// Lista de Pokémon
GET https://pokeapi.co/api/v2/pokemon?limit=500

// Detalle individual
GET https://pokeapi.co/api/v2/pokemon/{id}

// Información de especies
GET https://pokeapi.co/api/v2/pokemon-species/{id}
```

---

## ✅ Mejoras Implementadas

### Fase 1: Paleta de Colores Oficial

- ✅ Implementación de colores oficiales de Pokémon
- ✅ Gradientes rojo/amarillo/azul en fondos

### Fase 2: Animaciones Premium

- ✅ Cubic-bezier timing functions
- ✅ Transformaciones 3D en entradas
- ✅ Ripple effects en botones
- ✅ Float animations en imágenes
- ✅ Shimmer effects en estadísticas
- ✅ Stagger animations en listas

### Fase 3: Sistema de Paginación

- ✅ Carga inicial de 30 Pokémon
- ✅ Botón "Load More" funcional
- ✅ Contador de progreso
- ✅ Optimización de rendimiento

### Fase 4: Rediseño Pokéball

- ✅ Esquema blanco/negro/rojo
- ✅ Fondos claros con máximo contraste
- ✅ Navbar roja con borde negro
- ✅ Footer negro con borde rojo
- ✅ Cards con bordes negros sólidos

### Fase 5: Accesibilidad y Contraste

- ✅ Textos negros en fondos blancos
- ✅ Eliminación de text-white en fondos claros
- ✅ Bordes prominentes para separación visual
- ✅ Sombras mejoradas en cards
- ✅ Fondos grisáceos para distinguir elementos

---

## 👤 Autor

**Sebastian**

Desarrollado con ❤️ y mucho ☕

---

<div align="center">

### 🌟 ¡Gracias por visitar este proyecto!

**¿Te gustó?** Dale una ⭐ al repositorio

**¿Encontraste un bug?** Abre un issue

**¿Tienes ideas?** Pull requests son bienvenidos

---

_Pokémon y todos los nombres relacionados son © Nintendo/Game Freak/Creatures Inc._

_Este proyecto usa [PokéAPI](https://pokeapi.co/) - Una API RESTful abierta para Pokémon_

</div>

---

## ✨ Características

### 🏠 **Página de Inicio**

- Hero section con animaciones espectaculares
- Tarjetas informativas con efectos hover
- Diseño completamente responsivo
- Call-to-action atractivo

### 📚 **Galería PokéDex**

- **Dos modos de visualización:**
  - 📋 Modo Selector: Dropdown clásico con búsqueda
  - 🎴 Modo Galería: Grid visual con tarjetas animadas
- Búsqueda en tiempo real
- Más de 500 Pokémon disponibles
- Imágenes oficiales de alta calidad
- Filtrado instantáneo

### 🎴 **Vista de Detalle**

- Información completa del Pokémon
- Descripción en español
- Estadísticas visuales con barras de progreso animadas
- Datos físicos (peso, altura)
- Lista de habilidades (incluyendo ocultas)
- Primeros 10 movimientos
- Diseño adaptativo según el tipo
- Efectos visuales premium

### 🧭 **Navegación**

- NavBar sticky con diseño Pokémon
- Animación de Pokébola interactiva
- Navegación responsiva
- Badge informativo

### 🚫 **Página 404**

- Pokébola animada única
- Mensajes divertidos
- Navegación fácil de retorno

### 👣 **Footer**

- Enlaces a redes sociales con animaciones
- Información del proyecto
- Diseño moderno y profesional

---

## 🛠️ Tecnologías

### Frontend

- **React 18.2** - Biblioteca de JavaScript para interfaces de usuario
- **React Router DOM 6.16** - Enrutamiento declarativo
- **Vite 4.4** - Build tool ultrarrápido

### Estilos

- **Bootstrap 5.3.2** - Framework CSS (CDN)
- **CSS3 Moderno** - Variables, Grid, Flexbox, Animations
- **FontAwesome 6** - Iconos profesionales (CDN)
- **Google Fonts** - Tipografías Poppins y Press Start 2P

### API

- **PokéAPI** - Base de datos RESTful de Pokémon

### Herramientas de Desarrollo

- **ESLint** - Linter para JavaScript
- **Git** - Control de versiones

---

## 📁 Estructura del Proyecto

```
poke-api/
├── public/                    # Archivos estáticos
├── src/
│   ├── assets/               # Recursos (imágenes, iconos)
│   │   └── img/
│   ├── components/           # Componentes reutilizables
│   │   ├── Card.jsx         # Vista detallada del Pokémon
│   │   ├── Card.css
│   │   ├── Footer.jsx       # Pie de página
│   │   ├── Footer.css
│   │   ├── NavBar.jsx       # Barra de navegación
│   │   ├── NavBar.css
│   │   ├── NotFound.jsx     # Página 404
│   │   └── NotFound.css
│   ├── context/              # Context API (preparado para futuro)
│   │   └── context.js
│   ├── views/                # Páginas/Vistas principales
│   │   ├── Home.jsx         # Página de inicio
│   │   ├── Home.css
│   │   ├── Gallery.jsx      # Galería de Pokémon
│   │   └── Gallery.css
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos globales de App
│   ├── main.jsx              # Punto de entrada
│   └── index.css             # Estilos globales y variables CSS
├── .eslintrc.cjs             # Configuración ESLint
├── .gitignore                # Archivos ignorados por Git
├── index.html                # HTML principal
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
└── README.md                 # Este archivo
```

### 📂 Descripción de Directorios

- **`/components`**: Componentes React reutilizables y sus estilos
- **`/views`**: Páginas principales de la aplicación
- **`/assets`**: Imágenes, iconos y recursos multimedia
- **`/context`**: Context API para manejo de estado global (extensible)

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** (v14 o superior)
- **npm** o **yarn**
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd poke-api
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
```

3. **Iniciar servidor de desarrollo**

```bash
npm run dev
# o
yarn dev
```

4. **Abrir en el navegador**

```
http://localhost:5173
```

---

## 💻 Uso

### Scripts Disponibles

```bash
# Desarrollo - Inicia el servidor de desarrollo
npm run dev

# Build - Genera versión de producción
npm run build

# Preview - Previsualiza el build de producción
npm run preview

# Lint - Analiza el código con ESLint
npm run lint
```

### Comandos de Build

```bash
# Compilar para producción
npm run build

# La salida estará en la carpeta /dist
```

---

## 📸 Capturas de Pantalla

### 🏠 Página de Inicio

![Home Page](docs/screenshots/home.png)

- Hero section animado
- Características principales
- Diseño atractivo

### 📚 Galería - Modo Selector

![Gallery Selector](docs/screenshots/gallery-selector.png)

- Búsqueda en tiempo real
- Selector con todos los Pokémon
- Interfaz intuitiva

### 🎴 Galería - Modo Grid

![Gallery Grid](docs/screenshots/gallery-grid.png)

- Visualización en tarjetas
- Imágenes oficiales
- Efectos hover premium

### 🔍 Vista de Detalle

![Pokemon Detail](docs/screenshots/detail.png)

- Información completa
- Estadísticas visuales
- Diseño adaptativo por tipo

---

## 🔌 API Utilizada

### PokéAPI

- **URL Base:** `https://pokeapi.co/api/v2/`
- **Documentación:** [pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)

#### Endpoints Utilizados

```javascript
// Obtener lista de Pokémon
GET https://pokeapi.co/api/v2/pokemon?limit=500

// Obtener datos de un Pokémon específico
GET https://pokeapi.co/api/v2/pokemon/{name-or-id}

// Obtener información de especie
GET https://pokeapi.co/api/v2/pokemon-species/{id}
```

---

## 🎨 Paleta de Colores

```css
/* Colores principales */
--pokemon-red: #ff1c1c /* Rojo Pokémon */ --pokemon-blue: #3b82f6
  /* Azul agua */ --pokemon-yellow: #ffd700 /* Amarillo eléctrico */
  --pokemon-dark: #1a1a2e /* Fondo oscuro */ /* Gradientes */
  --gradient-fire: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)
  --gradient-water: linear-gradient(135deg, #4fc3f7 0%, #2196f3 100%)
  --gradient-grass: linear-gradient(135deg, #81c784 0%, #66bb6a 100%);
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva característica increíble'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### 📝 Convenciones de Commits

```
Add: Nueva funcionalidad
Fix: Corrección de bugs
Update: Actualización de código existente
Style: Cambios de estilos/formato
Docs: Documentación
Refactor: Refactorización de código
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Sebastian**

- 🎓 Estudiante de Desarrollo Full Stack en **Desafío Latam**
- 📅 Proyecto desarrollado en 2024
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

---

## 🙏 Agradecimientos

- **[Desafío Latam](https://desafiolatam.com/)** por la formación y el bootcamp de Desarrollo Full Stack
- [PokéAPI](https://pokeapi.co/) por proporcionar la API gratuita
- [The Pokémon Company](https://www.pokemon.com/) por crear este universo increíble
- [Bootstrap](https://getbootstrap.com/) por el framework CSS
- [FontAwesome](https://fontawesome.com/) por los iconos
- [Vite](https://vitejs.dev/) por la herramienta de desarrollo ultrarrápida
- Compañeros y profesores del bootcamp por su apoyo

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

- 🐛 [Reportar un Bug](https://github.com/tu-usuario/poke-api/issues)
- 💡 [Solicitar Feature](https://github.com/tu-usuario/poke-api/issues)
- 📧 Email: tu-email@example.com

---

<div align="center">
  
  **¡Atrápalos a Todos!** 🎮⚡
  
  Hecho con ❤️ y ⚡ para **Desafío Latam** (2024)
  
  Proyecto estudiantil | Bootcamp Full Stack Developer
  
  ⭐ Si te gustó el proyecto, dale una estrella ⭐
  
</div>
