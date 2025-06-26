<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dtp6k3i4c/image/upload/v1749608674/sentry_slogan-removebg-preview_dx4h3m.png" width="400" alt="Nest Logo" /></a>
</p>

Un Paquete de autenticación basado en RSA para [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![Build Status](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c7c_Build-Passing-brightgreen.svg)]() [![License: MIT](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c34_License-MIT-blue.svg)](/LICENSE) [![Deps](https://cdn.prod.website-files.com/5e0f1144930a8bc8aace526c/65dd9eb5aaca434fac4f1c9e_Deps-Up--to--date-brightgreen.svg)]()

## Installacion de paquete

```bash
$ npm i @sentry-pkg/pkg
```

## Modo de uso

El paquete debe ser inicializado antes de su uso para generar el par de claves (pública y privada) utilizando el algoritmo RSA. Utiliza el siguiente comando:

```bash
$ npx @sentry-pkg/pkg --init
```

### Parametros de inicialización

- --force: Inicialización forzada, para generar o reemplazar el par de claves (pública y privada) utilizando el algoritmo RSA

## Integración

En NestJS, la integración con sentry-pkg/pkg se facilita a través de un módulo dedicado, como el `SentryModule` que estás importando. Este módulo encapsula la lógica necesaria para inicializar el paquete y hacer que sus funcionalidades estén disponibles en toda tu aplicación o sistema.

`SentryModule.forRoot()`

El método forRoot() es una convención común en NestJS para configurar módulos dinámicos. Permite que el módulo sentry-pkg/pkg se configure con opciones específicas en el momento en que se importa en el módulo raíz del sistema

```javascript
import { SentryModule } from "@sentry-pkg/pkg";

@Module({
  imports: [
    SentryModule.forRoot({
      expiresIn: "1m",
      databaseOptions: {
        user: "postgres",
        host: "localhost",
        database: "business",
        password: "postgres",
        port: 5432,
      },
    }),
  ],
})
export class AppModule {}
```

Los parámetros son opcionales

```javascript
import { SentryModule } from "@sentry-pkg/pkg";

@Module({
  imports: [SentryModule.forRoot()],
})
export class AppModule {}
```

#### Opciones de Configuración `SentryOptions`

El método estático `forRoot` acepta un objeto `SentryOptions` opcional, que te permite personalizar el módulo según tus necesidades.

| Opción            | Tipo              | Valor por defecto            | Opciones                                                                                   |
| ----------------- | ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------ |
| `expiresIn`       | `string` `number` | `1m` (un minuto)             | `1m`, `5h`, `30d`                                                                          |
| `databaseOptions` | `DatabaseOptions` | La data se guarda en memoria | Credenciales para la conexión a una base de datos [PostgreSQL](https://www.postgresql.org) |

```typescript
interface SentryOptions {
  expiresIn?: string | number;
  databaseOptions?: DatabaseOptions;
}
```

`expiresIn?: string | number`

- Tipo: string | number
- Valor por defecto: `1m` (un minuto)

Esta opción define el tiempo de duración para el token interno utilizado por el módulo. Este token es usado para la autenticación, la validez de alguna sesión, o la duración de ciertos datos transitorios que maneja el módulo. Si no se especifica, el token tendrá una duración predeterminada de un minuto.

Puedes expresar la duración como:

- Un número (en milisegundos).
- Una cadena de texto con unidades (por ejemplo: `1m`, `5h`, `30d`).

`databaseOptions?: DatabaseOptions`

- Tipo: DatabaseOptions
- Valor por defecto: La data se guarda en memoria si no se proporciona esta opción.

Esta opción permite configurar las credenciales para la conexión a una base de datos [PostgreSQL](https://www.postgresql.org). El módulo utilizará esta configuración para la persistencia de datos, lo que significa que la información relevante (usuario) se almacenará en la base de datos en lugar de solo en la memoria.

Si `databaseOptions` no se proporciona, el módulo operará en modo "solo en memoria". Esto es útil para entornos de desarrollo, pruebas o situaciones donde la persistencia de datos no es crítica o se gestiona externamente.

```typescript
interface DatabaseOptions {
  user: string; // El nombre de usuario de la base de datos PostgreSQL.
  host: string; // La dirección del host de la base de datos (ej. 'localhost').
  database: string; // El nombre de la base de datos a la que conectarse.
  password: string; // La contraseña del usuario de la base de datos.
  port: number; // El puerto de conexión de la base de datos PostgreSQL (ej. 5432).
}
```

#### Ejemplo de Uso

```typescript
import { SentryModule } from "@sentry-pkg/pkg";

@Module({
  imports: [
    SentryModule.forRoot({
      expiresIn: "5m", // El token durará 5 minutos
      databaseOptions: {
        user: "myuser",
        host: "localhost",
        database: "myapp",
        password: "mypassword",
        port: 5432,
      },
    }),
  ],
  // ... otros controladores y proveedores
})
export class AppModule {}
```

En este ejemplo, el `SentryModule` se inicializa para que sus tokens internos duren 5 minutos y toda la data persistente se guarde en la base de datos [PostgreSQL](https://www.postgresql.org) especificada. Si databaseOptions se omitiera, la data se manejaría en memoria.

## Endpoints del paquetes

Este controlador maneja las operaciones relacionadas con la autenticación de usuarios, incluyendo registro, inicio de sesión, refresco de tokens y obtención de la información del usuario autenticado.

#### Registro de Usuario

| **Registro**               | **Descripción**                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| **1. Registro de Usuario** | Permite a un nuevo usuario registrarse en el sistema.                                                     |
| **Endpoint**               | POST /auth/signup                                                                                         |
| **Descripción**            | Crea una nueva cuenta de usuario con la información proporcionada.                                        |
| **Cuerpo de la Petición**  | Tipo: application/json <br> Esquema: `{ "email": "string", "password": "string", "username": "string" } ` |

#### Inicio de Sesión de Usuario

| **Inicio de Sesión**               | **Descripción**                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| **2. Inicio de Sesión de Usuario** | Permite a un usuario existente iniciar sesión y obtener un token de autenticación.                    |
| **Endpoint**                       | POST /auth/login                                                                                      |
| **Descripción**                    | Autentica a un usuario utilizando sus credenciales y emite un token de acceso y un token de refresco. |
| **Protección**                     | Requiere un proceso de autenticación previo para validar las credenciales.                            |
| **Cuerpo de la Petición**          | Tipo: application/json <br> Esquema: `{ "email": "string", "password": "string" }`                    |
| **Cuerpo de la Respuesta**         | Esquema: `{ "access_token": "string", "refresh_token": "string" }`                                    |

#### Refrescar Tokens de Acceso

| **Refrescar Tokens**              | **Descripción**                                                                                     |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| **3. Refrescar Tokens de Acceso** | Permite obtener un nuevo par de tokens de acceso y refresco utilizando un token de refresco válido. |
| **Endpoint**                      | POST /auth/refresh                                                                                  |
| **Descripción**                   | Intercambia un token de refresco caducado por un nuevo par de tokens de acceso y refresco.          |
| **Protección**                    | Requiere un `bearer token` refresh token.                                                           |
| **Cuerpo de la Petición**         | Ninguno.                                                                                            |
| **Cuerpo de la Respuesta**        | Esquema: `{ "access_token": "string" }`                                                             |

#### Obtener Información del Usuario Autenticado

| **Obtener Información del Usuario**                | **Descripción**                                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **4. Obtener Información del Usuario Autenticado** | Permite a un usuario autenticado obtener su propia información de perfil.                                                  |
| **Endpoint**                                       | GET /auth/me                                                                                                               |
| **Descripción**                                    | Retorna los detalles del perfil del usuario actualmente autenticado.                                                       |
| **Protección**                                     | Requiere `bearer token`, un token de acceso válido en el encabezado Authorization.                                         |
| **Parámetros de la Petición**                      | Ninguno.                                                                                                                   |
| **Cuerpo de la Respuesta**                         | Esquema: `{ "id": "string", "username": "string", "email": "string", "createdAt": "timestamp", "updatedAt": "timestamp" }` |

## Manejo de errores

`AllExceptionsFilter` es una clase especializada (un filtro de excepciones) proporcionada por @sentry-pkg/pkg que se encarga de capturar todas las excepciones no manejadas que ocurren durante el procesamiento de una petición HTTP en el sistema.

```typescript
import { AllExceptionsFilter } from "@sentry-pkg/pkg";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
```
