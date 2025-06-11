<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dtp6k3i4c/image/upload/v1749608674/sentry_slogan-removebg-preview_dx4h3m.png" width="400" alt="Nest Logo" /></a>
</p>

Un Paquete de autenticación basado en RSA para [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Descripción general

### Installacion de paquete

```bash
$ npm i @sentry-pkg/pkg
```

### Modo de uso

El paquete debe ser inicializado antes de su uso para generar el par de claves (pública y privada) utilizando el algoritmo RSA. Utiliza el siguiente comando:

```bash
$ npx @sentry-pkg/pkg --init
```

#### Parametros de inicialización

- --force: Inicialización forzada, para generar o reemplazar el par de claves (pública y privada) utilizando el algoritmo RSA

### Integración

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
