Dashboard Layout Component
Este componente sirve como la estructura base o layout principal para el panel de administración de la aplicación. Su función es proporcionar un marco visual consistente en todas las vistas del dashboard.

Funcionalidades Principales
Barra de Herramientas Superior (mat-toolbar):

Muestra el branding del proyecto (HeroManager).

Identifica la autoría del desarrollo ("Prueba de Frontend Stefano Racke").

Incluye un espacio para el logotipo oficial.

Sección de Encabezado Dinámico:

Utiliza las variables {{ title }} y {{ subtitle }} para mostrar dinámicamente el nombre de la sección actual y una breve descripción, permitiendo reutilizar el layout en diferentes páginas (como listado, edición o creación).

Proyección de Contenido (ng-content):

Actúa como un contenedor genérico. Gracias a la etiqueta <ng-content>, cualquier componente o HTML que se coloque dentro de las etiquetas de este layout se inyectará automáticamente en la sección principal del dashboard.

Estructura de Clases
container: Gestiona el centrado y los márgenes laterales del contenido para mantener una alineación limpia.

flex: Organiza los elementos del logo y textos de la cabecera en línea.

dashboard-panel: Define el espaciado y estilo del cuerpo principal de la página, separando la cabecera del contenido dinámico.

Ejemplo de Implementación
HTML

<app-dashboard-layout 
  title="Listado de Héroes" 
  subtitle="Administra y visualiza todos los héroes registrados">
  
  <!-- El contenido de abajo se proyectará en el <ng-content> -->
  <app-tu-tabla-de-heroes></app-tu-tabla-de-heroes>
  
</app-dashboard-layout>