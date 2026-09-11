# Tartessos Quest

**Tartessos Quest** es una práctica guiada para aprender InterSystems IRIS, ObjectScript y desarrollo backend mediante una aventura arqueológica interactiva.

El proyecto combina una interfaz web en React con un backend en InterSystems IRIS. Cada pantalla representa un nivel de la expedición y cada nivel propone un ejercicio técnico que el estudiante debe resolver modificando clases ObjectScript, modelos persistentes, consultas SQL, endpoints REST, métodos Embedded Python o globals.

La historia sitúa al jugador en una excavación vinculada a Tartessos. A medida que avanza, la expedición desciende por un hipogeo, clasifica cámaras, registra hallazgos, interpreta inscripciones y reconstruye la crónica del descubrimiento.

---

## Objetivo de la práctica

El objetivo principal es que el estudiante aprenda de forma progresiva:

- Los fundamentos del entorno InterSystems IRIS.
- La sintaxis básica de ObjectScript.
- La creación de clases, propiedades y métodos.
- El uso de objetos persistentes.
- Relaciones, validaciones e índices.
- SQL sobre clases persistentes.
- Class Queries.
- JSON y servicios REST.
- Embedded Python dentro de IRIS.
- Uso directo de globals.
- Criterios para decidir entre objetos, SQL y globals.

Cada ejercicio tiene una pantalla de juego, una ayuda contextual y una validación automática ejecutada desde el backend o desde un endpoint construido por el estudiante.

---

## Arquitectura general

El proyecto se divide en dos grandes bloques:

```text
tartessos-quest/
├── tartessos-ui/        # Interfaz React
└── iris/                # Backend InterSystems IRIS
```

### Interfaz React

La interfaz muestra la aventura, el estado del progreso y los paneles de ayuda de cada nivel.

Responsabilidades principales:

- Mostrar la escena visual de cada ejercicio.
- Presentar el texto narrativo y técnico.
- Permitir cambiar el idioma.
- Llamar a los endpoints de IRIS.
- Mostrar errores internacionalizados.
- Guardar el avance del jugador en el contexto de juego.
- Mostrar el código de validación cuando un nivel se supera.

### Backend IRIS

El backend contiene:

- La API REST principal de validación.
- Las clases que debe modificar el estudiante.
- El modelo de dominio de la excavación.
- Los datos persistentes de cámaras, sarcófagos y ofrendas.
- Utilidades auxiliares.
- Validaciones automáticas por ejercicio.
- Uso de globals para progreso y crónica de la expedición.

---

## Estructura de la interfaz

La interfaz se encuentra en:

```text
tartessos-ui/src
```

Estructura principal:

```text
src/
├── api/
│   ├── irisClient.ts
│   ├── questApi.ts
│   └── backendErrors.ts
├── assets/
│   └── images/
├── components/
├── game/
│   ├── GameContext.tsx
│   ├── CurrentLevel.tsx
│   └── gameTypes.ts
├── i18n/
└── levels/
```

### `api/questApi.ts`

Centraliza las llamadas al backend.

Ejemplos de rutas usadas por la interfaz:

```text
GET /tartessos/progress
GET /tartessos/exercise/1/validate
GET /tartessos/exercise/2/validate
...
GET /tartessos/exercise/11/validate
```

El ejercicio 9 es especial: el frontend llama directamente al endpoint REST creado por el estudiante:

```text
GET /tartessos/student/burial-trail?floorLevel=3
```

### `api/backendErrors.ts`

Convierte códigos de error del backend en mensajes internacionalizados.

El backend devuelve errores con esta estructura general:

```json
{
  "success": false,
  "exercise": 6,
  "validationCode": "",
  "errorCode": "OFFERING_CLASSIFICATION_INDEX_MISSING",
  "errorMessage": "Offering must define an index on Classification"
}
```

La interfaz no muestra directamente `errorMessage`. Usa `errorCode` para buscar el texto traducido en los ficheros de idioma.

### `game/GameContext.tsx`

Mantiene el progreso del jugador:

- Nivel actual.
- Niveles completados.
- Códigos de activación obtenidos.

El progreso se recupera desde el backend mediante:

```text
GET /tartessos/progress
```

### `game/CurrentLevel.tsx`

Decide qué pantalla de nivel renderizar en función del progreso actual.

Cada nivel se implementa como un componente independiente dentro de `src/levels`.

### `levels/`

Cada ejercicio tiene una carpeta propia:

```text
levels/
├── Level00Intro/
├── Level01AdventurerRegistration/
├── Level02ExcavationTools/
├── Level03ChamberModel/
├── Level04Notebook/
├── Level05PersistentChambers/
├── Level06ConnectedModel/
├── Level07SqlQueries/
├── Level08ClassQueries/
├── Level09RestApi/
├── Level10EmbeddedPython/
└── Level11DiscoveryChronicle/
```

Cada carpeta suele contener:

```text
LevelXXName.tsx
LevelXXName.module.css
index.ts
```

---

## Internacionalización

La interfaz usa ficheros de idioma para separar texto narrativo, botones, ayudas y errores.

Cada nivel tiene un bloque propio, por ejemplo:

```json
"level10": {
  "title": "LA INSCRIPCIÓN DEL SARCÓFAGO",
  "reviewButton": "DESCIFRAR INSCRIPCIÓN",
  "genericValidationError": "La inscripción todavía no ha podido interpretarse correctamente."
}
```

Los errores del backend se traducen mediante un bloque global:

```json
"backendErrors": {
  "INVALID_FLOOR_LEVEL": "El nivel de profundidad indicado no es válido.",
  "INSCRIPTION_DECODE_FAILED": "El método Python no ha devuelto correctamente la inscripción invertida."
}
```

---

## Estructura del backend

El backend se encuentra en:

```text
iris/src
```

Paquetes principales:

```text
Tartessos.REST
Tartessos.Quest
Tartessos.Quest.Chambers
Tartessos.Quest.Finds
Tartessos.Quest.Translation
Tartessos.Quest.Analysis
Tartessos.Quest.API
```

### API principal

La clase principal de validación es:

```text
Tartessos.REST.API
```

Responsabilidades:

- Exponer `/progress`.
- Validar los ejercicios.
- Devolver respuestas JSON.
- Actualizar el progreso del jugador.
- Escribir códigos de activación.
- Centralizar errores estructurados.

Rutas principales:

```text
GET /tartessos/progress
GET /tartessos/exercise/1/validate
GET /tartessos/exercise/2/validate
GET /tartessos/exercise/3/validate
...
GET /tartessos/exercise/11/validate
```

La clase devuelve JSON y está preparada para llamadas desde la interfaz web.

### Progreso

El progreso se guarda en el global:

```objectscript
^progress
```

Estructura general:

```objectscript
^progress = "level-05-persistent-chambers"
^progress("completed", levelId) = 1
^progress("activationCodes", levelId) = validationCode
```

El endpoint `/progress` devuelve:

```json
{
  "currentLevel": "level-05-persistent-chambers",
  "completedLevels": [
    "level-01-adventurer-registration",
    "level-02-excavation-tools"
  ],
  "activationCodes": {
    "level-01-adventurer-registration": "TQ01A1"
  }
}
```

---

## Clases principales del dominio

### `Tartessos.Quest.Boot`

Usada en el primer ejercicio para registrar el nombre del aventurero.

### `Tartessos.Quest.ExcavationUtils`

Clase de utilidades que el estudiante va ampliando durante la práctica.

Incluye o acaba incluyendo métodos relacionados con:

- Preparación de herramientas.
- Registro de cámaras persistentes.
- Consultas SQL.
- Recuperación de inscripciones.
- Timeline de la expedición usando globals.

### `Tartessos.Quest.Chambers.*`

Modelo de cámaras del hipogeo:

```text
Tartessos.Quest.Chambers.Chamber
Tartessos.Quest.Chambers.Corridor
Tartessos.Quest.Chambers.Hall
Tartessos.Quest.Chambers.Mortuary
Tartessos.Quest.Chambers.Storage
```

Durante la práctica, estas clases pasan de ser un modelo inicial a un modelo persistente.

### `Tartessos.Quest.Finds.*`

Modelo de hallazgos:

```text
Tartessos.Quest.Finds.Sarcophagus
Tartessos.Quest.Finds.Offering
```

Se usan para trabajar relaciones, validaciones, índices y consultas SQL.

### `Tartessos.Quest.Translation.InscriptionQueries`

Clase usada para practicar Class Queries.

Expone una consulta reutilizable para obtener inscripciones según su origen:

```text
sarcophagus
offering
all
```

### `Tartessos.Quest.API.BurialTrail`

Clase REST creada por el estudiante en el ejercicio 9.

Expone:

```text
GET /tartessos/student/burial-trail?floorLevel=3
```

La interfaz usa directamente este endpoint para validar el ejercicio.

### `Tartessos.Quest.Analysis.InscriptionDecoder`

Clase con Embedded Python usada en el ejercicio 10.

El método Python llama a ObjectScript para recuperar una inscripción codificada y devuelve el texto invertido.

---

## Relación de ejercicios

| Ejercicio | Temas | Nivel | Objetivo principal |
|---|---|---|---|
| 0 | Preparación | `level-00-intro` | Instalar herramientas, clonar el proyecto y arrancar el entorno. |
| 1 | Temas 1-3 | `level-01-adventurer-registration` | Modificar una primera clase ObjectScript y registrar el aventurero. |
| 2 | Temas 4-6 | `level-02-excavation-tools` | Usar lógica básica, condicionales, bucles y métodos. |
| 3 | Temas 7-9 | `level-03-chamber-model` | Crear clases, herencia y propiedades tipadas. |
| 4 | Temas 10-13 | `level-04-notebook` | Trabajar con objetos, listas y métodos de instancia/clase. |
| 5 | Temas 14-16 | `level-05-persistent-chambers` | Convertir el modelo en persistente y guardar objetos. |
| 6 | Temas 17-19 | `level-06-connected-model` | Crear relaciones, índices y validaciones. |
| 7 | Temas 20-22 | `level-07-sql-queries` | Consultar el modelo persistente con SQL y joins. |
| 8 | Tema 25 | `level-08-class-queries` | Encapsular consultas SQL en Class Queries. |
| 9 | Temas 26-28 | `level-09-rest-api` | Crear un endpoint REST propio que devuelva JSON. |
| 10 | Temas 29-31 | `level-10-embedded-python` | Usar Embedded Python integrado con ObjectScript. |
| 11 | Temas 32-35 | `level-11-discovery-chronicle` | Registrar una crónica usando globals. |
| 12 | Tema 36 | Integración final | Cerrar la historia y unir las piezas del proyecto. |

---

## Flujo de validación

La mayoría de ejercicios siguen este patrón:

1. El estudiante modifica una clase ObjectScript.
2. Compila la clase.
3. Pulsa el botón principal del nivel en la interfaz.
4. React llama al endpoint correspondiente.
5. IRIS ejecuta la validación.
6. Si todo es correcto, se devuelve un código de validación.
7. El backend actualiza `^progress`.
8. La interfaz muestra el panel de éxito y el código.

Ejemplo de respuesta correcta:

```json
{
  "success": true,
  "exercise": 6,
  "validationCode": "TQ06F6",
  "errorCode": "",
  "errorMessage": ""
}
```

Ejemplo de error:

```json
{
  "success": false,
  "exercise": 6,
  "validationCode": "",
  "errorCode": "OFFERING_CLASSIFICATION_INDEX_MISSING",
  "errorMessage": "Offering must define an index on Classification"
}
```

La interfaz traduce el `errorCode` y no muestra directamente `errorMessage`.

---

## Caso especial: ejercicio 9

El ejercicio 9 no usa un endpoint central de validación como los anteriores.

El estudiante debe crear el endpoint REST:

```text
GET /tartessos/student/burial-trail?floorLevel=3
```

La interfaz lo llama directamente y valida la respuesta.

El endpoint debe:

- Leer `floorLevel` desde la request.
- Consultar cámaras mortuorias con ofrendas de oro.
- Construir una respuesta JSON.
- Dejar el campo `validationCode` vacío inicialmente.
- Llamar a `Tartessos.Quest.Utils.NextLevel(.response)`.
- Devolver la respuesta ya actualizada.

La clase `NextLevel()` informa el `validationCode` y registra el progreso cuando la respuesta cumple las condiciones esperadas.

---

## Caso especial: ejercicio 10

El ejercicio 10 combina ObjectScript y Embedded Python.

Flujo esperado:

```text
Python recibe floorLevel
Python llama a ObjectScript
ObjectScript consulta la inscripción en la base de datos
ObjectScript devuelve la inscripción codificada
Python invierte el texto
Python devuelve la inscripción descodificada
```

El método ObjectScript vive en:

```text
Tartessos.Quest.ExcavationUtils.GetEncodedRoyalInscription(floorLevel)
```

El método Python vive en:

```text
Tartessos.Quest.Analysis.InscriptionDecoder.DecodeInscription(floorLevel)
```

La validación comprueba que Python devuelve exactamente el texto invertido a partir de la inscripción recuperada por ObjectScript.

---

## Caso especial: ejercicio 11

El ejercicio 11 usa globals para registrar la crónica del descubrimiento.

Global usado:

```objectscript
^tartessosTimeline
```

Estructura esperada:

```objectscript
^tartessosTimeline(eventNumber,"type")
^tartessosTimeline(eventNumber,"location")
^tartessosTimeline(eventNumber,"headline")
^tartessosTimeline(eventNumber,"summary")
```

Métodos esperados en `Tartessos.Quest.ExcavationUtils`:

```objectscript
ClearTimeline()
RegisterTimelineEvent(eventNumber,eventType,location,headline,summary)
BuildTimeline() As %DynamicArray
GetFrontPageHeadline() As %String
```

La validación registra eventos, recorre el global y construye un timeline JSON.

---

## Cómo trabajar en los ejercicios

### 1. Editar clases

El estudiante edita clases en VS Code usando la extensión de ObjectScript.

### 2. Compilar

Cada cambio debe compilarse antes de validar.

Desde terminal de IRIS:

```objectscript
Do $System.OBJ.Compile("Tartessos.Quest.ExcavationUtils")
```

También puede compilarse desde VS Code.

### 3. Validar desde la interfaz

Cada nivel tiene un botón principal:

```text
ENVIAR FORMULARIO
REVISAR HERRAMIENTAS
REVISAR CÁMARAS
REVISAR REGISTRO
REVISAR HALLAZGOS
DESCIFRAR INSCRIPCIÓN
PUBLICAR CRÓNICA
```

Al pulsarlo, la interfaz llama al backend y muestra el resultado.

---

## Protección de clases internas

Algunas clases pueden distribuirse compiladas, sin incluir el `.cls` fuente en el repositorio del estudiante.

Clases candidatas:

```text
Tartessos.REST.API
Tartessos.Quest.Utils
```

La estrategia recomendada es generar un artifact de despliegue desde un entorno privado y subir solo ese XML al repositorio público.

Ejemplo conceptual:

```text
deploy/tartessos-core-deployed.xml
```

Después, el setup del entorno lo importa al namespace correspondiente.

Esto permite que los estudiantes ejecuten la práctica sin ver la implementación interna de las clases de validación o soporte.

---

## Requisitos recomendados

- Git.
- Docker.
- Docker Compose.
- Visual Studio Code.
- Extensión ObjectScript para VS Code.
- Navegador moderno.

---

## Arranque rápido

```bash
git clone https://github.com/intersystems-ib/tartessos-quest.git
cd tartessos-quest
docker compose up -d
```

Después abre la interfaz web y sigue las instrucciones del nivel inicial.

---

## Notas para instructores

- Mantener las clases internas sensibles fuera del repositorio público si se desea ocultar las validaciones.
- Probar cada ejercicio en un contenedor limpio antes de publicarlo.
- Verificar que los datos temporales creados por las validaciones se limpian correctamente.
- Mantener sincronizadas las claves de traducción en español e inglés.
- Cuando se modifique el contrato de una respuesta JSON, actualizar también `questApi.ts`, el componente React correspondiente y los ficheros de idioma.

---

## Estado esperado del proyecto

Al completar la práctica, el estudiante habrá construido progresivamente:

- Un modelo de cámaras del hipogeo.
- Un modelo persistente de cámaras, sarcófagos y ofrendas.
- Relaciones entre entidades.
- Índices y validaciones.
- Consultas SQL.
- Class Queries reutilizables.
- Un endpoint REST propio.
- Un método Embedded Python integrado con ObjectScript.
- Una crónica del descubrimiento usando globals.

Todo ello dentro de una aventura gráfica narrativa inspirada en Tartessos.
