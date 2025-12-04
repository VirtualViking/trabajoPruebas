Sistema de Gestión de Inventario
Sistema completo para la gestión de inventario de productos desarrollado con:
Node.js, Express.js y PostgreSQL. Incluye API REST, interfaz gráfica web y set completa de pruebas automatizadas con integración continua.


Tabla de Contenidos

Descripción del Proyecto
Arquitectura del Sistema
Base de Datos
Instalación y Configuración
Ejecución de la API
Ejecución de la Interfaz Gráfica
Ejecución de Pruebas
Pipeline de Integración Continua
Decisiones Técnicas


------------------------------------------------------------------------------------------------------------------------------------------------
1. Descripción del Proyecto
   
Este sistema permite gestionar un inventario de productos organizados por categorías. Las funcionalidades principales permiten:

Gestión de Categorías: Crear, listar, actualizar y eliminar categorías de productos.
Gestión de Productos: Crear, listar, actualizar y eliminar productos con nombre, descripción, precio, stock y categoría asociada.
API REST: Endpoints completos para todas las operaciones CRUD.
Interfaz Web: Aplicación frontend simple para interactuar con el sistema.
Pruebas Automatizadas: set de pruebas unitarias y de integración.
CI/CD: Pipeline automatizado en GitHub Actions.


------------------------------------------------------------------------------------------------------------------------------------------------

2. Arquitectura del Sistema
   
El proyecto sigue una arquitectura por capas que separa las responsabilidades en diferentes niveles:


                        FRONTEND                             
                  (HTML + CSS + JavaScript)                  
                       HTTP Requests           
                          │ 
                          ▼

                        ROUTES                             
                   (endpoints de la API)             

                          │
                          ▼

                      CONTROLLERS                           
                 (peticiones HTTP y respuestas)          

                          │
                          ▼

                        SERVICES                             
      (Lógica de negocio, validaciones, reglas)                                 

                          │
                          ▼

                        MODELS                              
            (Operaciones con la base de datos)                            

                          │
                          ▼

                     POSTGRESQL                            
                    (Base de Datos)                        



------------------------------------------------------------------------------------------------------------------------------------------------


4. Base de Datos
Motor de Base de Datos: Se utiliza PostgreSQL como sistema de gestión de base de datos relacional por su robustez, soporte para transacciones ACID


------------------------------------------------------------------------------------------------------------------------------------------------


5. Instalación y Configuración
Prerrequisitos

Node.js v18 o +
npm v9 o +
PostgreSQL v15 o +
Git



Para clonar el repositorio

Paso 1: git clone https://github.com/VirtualViking/trabajoPruebas.git
tener una carpeta abierta en el IDE y clonar desde alli



Paso 2: Instalar dependencias
npm install



Paso 3: Crear la Base de Datos
Abrir PostgreSQL (pgAdmin) y crear la base de datos:
CREATE DATABASE inventory_db;



Paso 4: Configurar Variables de Entorno
Crear el archivo .env dentro de la carpeta backend del repo:



Editar el archivo .env con la configuración de su base de datos:
envDB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=su_contraseña_de_postgresql
PORT=3000
NODE_ENV=development



Paso 5: Inicializar las Tablas
Ejecutar el script (desde la carpeta backend en la terminal del IDE):
node src/config/init-db.js

Mensaje que debe aparecer:

Connected to PostgreSQL database
Tables created successfully
Database initialization complete


------------------------------------------------------------------------------------------------------------------------------------------------

5.Ejecución de la API

Desde la carpeta backend:
npm run dev

Verificar que la API está corriendo
http://localhost:3000/api/health

Respuesta esperada:
json{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-12-01T10:00:00.000Z"
}


Endpoints disponinles

GET/api/categories Listar todas las categorías


GET/api/categories/:id obtener categoría por ID

POST/api/categories Crear nueva categoría


PUT/api/categories/:id Actualizar categoría


DELETE/api/categories/:idEliminar categoría


GET/api/products Listar todos los productos


GET/api/products/:id Obtener producto por ID 


GET/api/products/category/:categoryId Productos por categoría


POST/api/products Crear nuevo producto 


PUT/api/products/:id Actualizar producto 


PATCH/api/products/:id/stock Actualizar stock 


DELETE/api/products/:id Eliminar producto


------------------------------------------------------------------------------------------------------------------------------------------------


6. Ejecución de la Interfaz Gráfica
La interfaz gráfica se sirve automáticamente cuando la API está corriendo.


Asegurarse de que la API esté corriendo (npm run dev desde backend).
Abrir el navegador en: http://localhost:3000


Funcionalidades de la Interfaz


Sección de Categorías:


Crear nuevas categorías
Ver lista de categorías existentes
Editar categorías (botón Editar)
Eliminar categorías (botón Eliminar)




Sección de Productos:

Crear nuevos productos con nombre, descripción, precio, stock y categoría
Ver tabla de productos con toda la información
Editar productos existentes
Eliminar productos




Notificaciones:

Mensajes de éxito (verde) al completar operaciones
Mensajes de error (rojo) cuando hay problemas


------------------------------------------------------------------------------------------------------------------------------------------------



7. Ejecución de Pruebas
   

El proyecto incluye dos tipos de pruebas automatizadas:


Pruebas Unitarias
Validan la lógica de negocio de los servicios de manera aislada usando mocks.
Ejecutar desde la carpeta backend:

npm run test:unit


Pruebas de Integración
Validan el comportamiento de la API junto con la base de datos real.
Ejecutar desde la carpeta backend:

npm run test:integration


------------------------------------------------------------------------------------------------------------------------------------------------



8. Pipeline de Integración Continua
   
El proyecto utiliza GitHub Actions para ejecutar automáticamente las pruebas en cada push o pull request.
Archivo de Configuración
.github/workflows/ci.yml
Jobs del Pipeline


   install    ─── Instala dependencias y cachea node_modules

       │
       ▼


   unit-tests  │ integration-tests    ─── Se ejecutan en paralelo


                     │
                     ▼
            

    pipeline-success  ─── Imprime "OK" si pasan

   
   

Descripcion del workflow

install: Configura Node.js 18, instala dependencias.
unit-tests: Ejecuta las pruebas unitarias con Jest.
integration-tests:

Levanta un contenedor PostgreSQL como servicio
Configura las variables de entorno
Ejecuta las pruebas de integración


------------------------------------------------------------------------------------------------------------------------------------------------



9. Decisiones Técnicas

¿Por qué no se usa Docker?

Simplicidad de Instalación: El proyecto está diseñado para ser fácilmente ejecutable por estudiantes y desarrolladores 
que pueden no estar familiarizados con Docker. Solo se requiere Node.js y PostgreSQL instalados localmente.

Entorno Educativo: Al ser un proyecto académico, se prioriza que los estudiantes entiendan cada componente 
del sistema (Node.js, Express, PostgreSQL) sin la capa de abstracción que agrega Docker.

Recursos del Sistema: Docker puede consumir recursos significativos en máquinas con hardware limitado.

Depuración sencilla: Sin contenedores, es más fácil depurar problemas de conexión a la base de datos, permisos de archivos y configuración del entorno.


------------------------------------------------------------------------------------------------------------------------------------------------


Licencia


Este proyecto es de uso académico.
