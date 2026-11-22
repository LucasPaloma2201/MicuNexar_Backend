MicuNexar — Backend
Proyecto de Programación IV — UTN Facultad Regional Tucumán.

MicuNexar es una plataforma que permite consultar servicios y emprendimientos locales, registrar usuarios y perfiles Nexer y gestionar solicitudes. El backend utiliza una API REST y una base de datos relacional PostgreSQL.
Integrantes
- Mariano Torres Mari
- Federico Chaile
- Lucas Paloma
Tecnologías
- Node.js y npm
- TypeScript y NestJS
- PostgreSQL
- Prisma ORM, Prisma Client y adaptador PG 7.10.1
- class-validator y class-transformer
- bcrypt y JWT
- Postman y pgAdmin 4 para las pruebas
Instalación y ejecución
1. Clonar el repositorio y ubicarse en la carpeta del backend.
2. Instalar las dependencias con npm install.
3. Crear una base PostgreSQL vacía llamada micunexar_db en el servidor local (si no existe).
4. Crear el archivo .env en la raíz. Ejemplo de configuración local:
PORT=3000
API_BASE_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:TU_CONTRASENA@localhost:4000/micunexar_db?schema=public"
JWT_SECRET="REEMPLAZAR_POR_SECRETO_GENERADO"
El puerto de PostgreSQL debe coincidir con el del servidor de cada integrante (por ejemplo, 4000 o 5432). El puerto HTTP de NestJS es 3000 en este ejemplo. Deben ser distintos en una misma computadora. Si la contraseña contiene caracteres reservados de URL, codificarlos.

Generar el secreto JWT (mínimo 32 caracteres) con:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
No subir .env ni publicar contraseñas o tokens. Reemplazar los valores de ejemplo por los locales.
5. Validar el esquema, aplicar la migración existente y generar el cliente local:
npx prisma validate
npx prisma migrate deploy
npx prisma generate
npx prisma migrate status
La carpeta prisma/migrations contiene la migración inicial ya creada. No ejecutar migrate reset ni generar otra migración inicial para instalar el proyecto.
6. Iniciar NestJS:
npm run start:dev
API local: http://localhost:3000.
Módulos y endpoints
Módulo	Operaciones
Auth	POST /auth/register, POST /auth/login
Users	GET /users, GET /users/me, GET /users/:id, PATCH /users/:id, DELETE /users/:id
Categories	POST y GET /categories; GET, PATCH y DELETE /categories/:id
Locations	POST y GET /locations; GET, PATCH y DELETE /locations/:id
Nexers	POST y GET /nexers; GET, PATCH y DELETE /nexers/:id
Services	POST y GET /services; GET, PATCH y DELETE /services/:id
Ventures	POST y GET /ventures; GET, PATCH y DELETE /ventures/:id
Requests	POST y GET /requests; GET, PATCH y DELETE /requests/:id


El registro se realiza únicamente desde /auth/register con full_name, email y password. El usuario y su credencial se almacenan en tablas separadas, sin devolver la contraseña ni el hash.

El login recibe email y password y devuelve un JWT con una hora de vigencia. Como mejora adicional de esta versión, las rutas de Users utilizan Bearer Token. El listado de prueba devuelve solamente id y full_name; las consultas de perfil, modificaciones y eliminaciones individuales se limitan a la cuenta autenticada.
Base de datos y reglas principales
Ocho tablas: users, auth, categories, locations, nexers, services, ventures y requests. Los identificadores y las relaciones se definen en prisma/schema.prisma. Las restricciones CHECK adicionales se conservan en la migración SQL inicial.
- Una ubicación sin padre representa una provincia; una localidad referencia a su provincia.
- Los perfiles Nexer se crean en estado PENDING. Solo se muestran públicamente los perfiles aprobados.
- Los servicios y emprendimientos se crean inactivos y solo se publican si su Nexer está aprobado.
- Una solicitud debe referenciar un servicio o un emprendimiento, no ambos, y una localidad existente.
- El registro de una solicitud comienza en PENDING. El flujo principal es ACCEPTED, IN_PROGRESS, AWAITING_CONFIRMATION y COMPLETED.
DTO y validación
Cada módulo dispone de DTO propios. ValidationPipe realiza la validación antes de ejecutar el controller. Los decoradores de class-validator definen los tipos y las restricciones y devuelven mensajes en español. Los services utilizan PrismaService para consultar y modificar PostgreSQL.
Pruebas mediante Postman
Importar postman/MicuNexar_API_UTN_FRT.postman_collection.json una vez integrado el archivo en el repositorio. Las peticiones utilizan URLs directas a localhost:3000, parámetros de ruta :id y Body en raw / JSON. Usar identificadores reales devueltos por la API, no suponer que son consecutivos.

Orden de carga: usuarios (registro crea también Auth), categorías, provincia y localidades, Nexers, servicios, emprendimientos y solicitudes. Para las pruebas locales se aprueban solamente los Nexers ficticios desde pgAdmin y se activan las publicaciones mediante PATCH. Verificar peticiones válidas e inválidas, las cinco operaciones de cada CRUD cuando correspondan y el mínimo de cinco registros por tabla después de las pruebas de eliminación.
Comandos útiles
npm run build
npx prisma validate
npx prisma generate
npx prisma migrate status
npm run start:dev
Alcance académico
Esta versión implementa los contenidos de los TP de Programación IV. Los módulos distintos de Users no disponen de autorización por propietario ni permisos administrativos; el flujo de solicitudes valida las transiciones, pero aún no verifica quién las ejecuta. La aprobación manual de Nexers es una preparación de datos de prueba, no un mecanismo de administración de producción. Utilizar una base local y datos ficticios; no desplegar esta API como servicio público.
