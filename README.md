# HeroManager - Prueba Técnica Frontend (RIU)
Esta aplicación es una Single Page Application (SPA) desarrollada con Angular 20 para la gestión y mantenimiento de superhéroes. El proyecto demuestra el uso de servicios avanzados, componentes de Angular Material, pruebas unitarias y contenedorización.

## 🚀 Funcionalidades Implementadas
Core (Requerimientos Obligatorios)
CRUD Completo de Héroes: Registro, consulta, edición y eliminación de héroes.

Persistencia en Memoria: Gestión de datos centralizada en servicios (sin backend externo).

Búsqueda Dinámica: Filtro en tiempo real que permite encontrar héroes por cualquier cadena de texto.

Listado Paginado: Visualización organizada con acciones de gestión (añadir, editar, borrar) integradas.

Formularios con Validación: Control de entrada de datos para asegurar la integridad de la información.

Confirmación de Acción: Diálogo de seguridad antes de eliminar un registro.

Unit Testing: Pruebas unitarias para servicios y componentes principales.

## Mejoras y Extras (Opcionales)
Angular Material: Interfaz moderna y profesional basada en componentes oficiales de Material Design.

Feedback de Usuario: Interceptor para mostrar indicador de carga (Loading) durante operaciones asíncronas.

Directiva Uppercase: Directiva personalizada para forzar mayúsculas en el campo del nombre del héroe.

Diseño Responsivo: Layout estructurado para adaptarse a diferentes tamaños de pantalla.

## 🛠️ Cómo ejecutar la aplicación
Opción 1: Desarrollo Local (Angular CLI)
Requiere tener instalado Node.js y Angular CLI.

### Instalar dependencias:


npm install
Iniciar el servidor de desarrollo:


ng serve
Abrir el navegador en http://localhost:4200/.

### Opción 2: Docker (Contenedorización)
Requiere tener instalado Docker.

Construir la imagen de Docker:

docker build -t riu-challenge .
Ejecutar el contenedor:

docker run -p 8080:80 riu-challenge
Acceder a la aplicación en http://localhost:8080.

## 🧪 Pruebas Unitarias
Para ejecutar los tests automatizados y asegurar la calidad del código:
 ng test

## ✒️ Autor
Stefano Racke - Prueba de Frontend para RIU Challenge.