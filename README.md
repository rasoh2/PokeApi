# 🎮 PokéDex Ultimate - La Mejor PokéAPI del Mundo

<div align="center">
  
  ![Pokemon Banner](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)
  
  [![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-7952B3?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**La PokéDex más completa y hermosa del mundo web** 🌟

[Ver Demo](#) • [Reportar Bug](#) • [Solicitar Feature](#)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [API Utilizada](#-api-utilizada)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Autor](#-autor)

---

## 📝 Descripción

**PokéDex Ultimate** es una aplicación web moderna y elegante que te permite explorar el fascinante mundo Pokémon. Desarrollada con las últimas tecnologías web, ofrece una experiencia de usuario premium con diseños increíbles, animaciones fluidas y datos completos de más de 500 Pokémon.

> 🎓 **Proyecto Estudiantil** - Desarrollado como parte del bootcamp de Desarrollo Full Stack de **Desafío Latam** (2024)

### 🎯 Propósito

Este proyecto fue creado para demostrar:

- Integración profesional con APIs REST (PokéAPI)
- Diseño UI/UX moderno y responsivo
- Manejo eficiente de estado en React
- Optimización de rendimiento con Vite
- Implementación de mejores prácticas de desarrollo

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
