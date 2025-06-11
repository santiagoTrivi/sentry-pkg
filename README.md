<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dtp6k3i4c/image/upload/v1749608674/sentry_slogan-removebg-preview_dx4h3m.png" width="400" alt="Nest Logo" /></a>
</p>

Un Paquete de autenticación basado en RSA para [Javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## Descripción general

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

* --force: Inicialización forzada, para generar o reemplazar el par de claves (pública y privada) utilizando el algoritmo RSA