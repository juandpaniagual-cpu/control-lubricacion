# Control de Lubricación - paquete limpio desde cero

Este paquete debe subirse a GitHub con esta estructura exacta en la raíz del repositorio.

## Estructura correcta

```text
functions/
  api/
    [[catchall]].js
.gitignore
_headers
_redirects
app.js
cloudflare-d1-lubrication-migration.sql
cloudflare-d1-records-migration.sql
cloudflare-d1-schema.sql
index.html
logo.svg
manifest.webmanifest
README.md
styles.css
sw.js
wrangler.example.toml
```

## Muy importante

No deben quedar archivos sueltos en la raíz como:

```text
db.js
health.js
login.js
records.js
users.js
[id].js
salud.js
descargar
```

Si existen en el repositorio anterior, bórralos o crea un repositorio nuevo limpio.

## Subir a GitHub desde cero

La forma más segura:

1. Crear un repositorio nuevo vacío en GitHub.
2. Descomprimir el ZIP.
3. Entrar a la carpeta descomprimida.
4. Subir TODO el contenido de esa carpeta a GitHub.
5. Verificar que en GitHub exista:

```text
functions/api/[[catchall]].js
```

## Configuración Cloudflare Pages

```text
Framework preset: None
Build command: exit 0
Build output directory: .
Root directory: /
Production branch: main
```

## Binding D1

En Cloudflare Pages > Settings > Bindings:

```text
Type: D1 database
Variable name: DB
Database: cmms-lubricacion-db
```

## Prueba

Después del deploy:

```text
https://TU-DOMINIO.pages.dev/api/health
```

Debe responder:

```json
{
  "ok": true,
  "app": "cmms-lubricacion",
  "d1": true
}
```

Usuarios iniciales:

```text
admin / admin123
supervisor / sup123
tecnico / tec123
consulta / ver123
```
