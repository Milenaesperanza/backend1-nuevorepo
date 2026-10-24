# Manada Servicios

API Node.js con Express y persistencia en archivos JSON para gestionar los servicios y reservas de Manada PetShop.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

Instalar las dependencias:

```bash
npm install
```

Configurar las variables de entorno a partir de `.env.example`. El proyecto incluye un `.env` local para desarrollo.

## Ejecución

Para ejecutar la aplicación:

```bash
npm start
```

Para ejecutarla en modo desarrollo, reiniciando Node.js cuando cambian los archivos:

```bash
npm run dev
```

La API queda disponible en `http://localhost:8080` o en el puerto definido en `PORT`.

## Variables de entorno

La aplicación requiere estas variables:

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `PORT` | Puerto de ejecución de la aplicación | `8080` |
| `NODE_ENV` | Entorno de ejecución | `development` |

`PORT` debe ser un número entero entre 1 y 65535.

## Recurso `services`

El catálogo se persiste en `src/data/services.json`. Cada servicio tiene esta estructura:

```json
{
  "id": "service-1",
  "name": "Baño y corte",
  "description": "Servicio de higiene para mascotas",
  "duration": 60,
  "price": 15000,
  "category": "peluqueria",
  "available": true
}
```

El `id` se genera automáticamente. Los campos `name`, `description`, `duration`, `price`, `category` y `available` son obligatorios al crear o actualizar un servicio.

### Rutas de services

- `GET /api/services`: devuelve todos los servicios.
- `GET /api/services/:sid`: devuelve un servicio por id.
- `POST /api/services`: crea un servicio sin recibir el id en el body.
- `PUT /api/services/:sid`: actualiza un servicio sin modificar su id.
- `DELETE /api/services/:sid`: elimina un servicio.

El listado acepta filtros opcionales:

```text
GET /api/services?category=peluqueria&available=true&search=baño
```

### Uso de la capa de servicios

```js
import { ServicesService } from './src/services/services.service.js';

const servicesService = new ServicesService(servicesRepository);
const services = servicesService.getServices();
const service = servicesService.getServiceById('service-1');
```

## Recurso `bookings`

Las reservas se persisten en `src/data/bookings.json`. Cada reserva tiene esta estructura:

```json
{
  "id": "booking-1",
  "clientName": "Ana Pérez",
  "clientEmail": "ana@example.com",
  "date": "2026-10-14",
  "time": "10:00",
  "status": "pending",
  "services": [
    {
      "service": "service-1",
      "quantity": 1
    }
  ]
}
```

El `id` se genera automáticamente. Una reserva puede comenzar con `services` vacío. Los servicios agregados deben existir en el catálogo. Si se agrega dos veces el mismo servicio, se incrementa su `quantity`.

### Rutas de bookings

- `POST /api/bookings`: crea una reserva.
- `GET /api/bookings/:bid`: devuelve una reserva por id.
- `POST /api/bookings/:bid/services/:sid`: agrega un servicio existente a una reserva existente.

Ejemplo para crear una reserva:

```json
{
  "clientName": "Ana Pérez",
  "clientEmail": "ana@example.com",
  "date": "2026-10-14",
  "time": "10:00",
  "status": "pending",
  "services": []
}
```

## Arquitectura

- `src/config/env.config.js`: carga y valida las variables de entorno.
- `src/controllers/services.controller.js`: recibe solicitudes de servicios, llama al service y construye las respuestas HTTP.
- `src/controllers/bookings.controller.js`: recibe solicitudes de reservas, llama al service y construye las respuestas HTTP.
- `src/services/services.service.js`: contiene las reglas de negocio y validaciones de servicios.
- `src/services/bookings.service.js`: contiene las reglas de negocio y validaciones de reservas, incluida la relación con servicios.
- `src/repositories/services.repository.js`: abstrae el acceso al DAO de servicios.
- `src/repositories/bookings.repository.js`: abstrae el acceso al DAO de reservas.
- `src/dao/services.dao.js`: lee y escribe directamente `services.json`.
- `src/dao/bookings.dao.js`: lee y escribe directamente `bookings.json`.
- `src/routes/services.router.js`: define las rutas HTTP de `services` y las conecta con sus controllers.
- `src/routes/bookings.router.js`: define las rutas HTTP de `bookings` y las conecta con sus controllers.
- `src/data/services.json`: persistencia inicial de servicios.
- `src/data/bookings.json`: persistencia de reservas.
- `src/app.js`: configura Express y monta las rutas.
- `src/server.js`: inicia el servidor HTTP.

La API está organizada en cinco capas:

- **Rutas:** definen los endpoints y los conectan con el controller correspondiente.
- **Controllers:** leen `req.params`, `req.query` y `req.body`, llaman a los services y responden mediante `res.status().json()`.
- **Services:** contienen las reglas de negocio, sin depender de `req` ni `res`.
- **Repositories:** ofrecen métodos de acceso a datos sin reglas de negocio.
- **DAO:** leen y escriben directamente en los archivos JSON.
