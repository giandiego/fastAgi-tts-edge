# fastAgi-tts-edge

Este proyecto demuestra el uso de Text-to-Speech (TTS) mediante Fast AGI en Asterisk, utilizando la librería [MsEdgeTTS](https://github.com/guquan-lengyue/MsEdgeTTS) para generar archivos de audio a partir de texto utilizando el servicio de TTS de Microsoft Edge.

## Pre-requisitos

- Node.js instalado en el sistema.
- Acceso a un sistema con Asterisk para implementar el AGI.

## Instalación

Sigue estos pasos para configurar el entorno de `fastAgi-tts-edge` en tu sistema.

1. **Clonar el Repositorio**

    ```bash
    cd /opt/
    git clone https://github.com/giandiego/fastAgi-tts-edge.git
    ```

2. **Instalar Dependencias**

    Navega al directorio del proyecto clonado y ejecuta:

    ```bash
    cd fastAgi-tts-edge
    npm i --force
    ```

3. **Instalar y Correr con PM2**

    PM2 es un gestor de procesos para aplicaciones Node.js, que facilita correr y manejar tu aplicación en producción.

    ```bash
    npm install pm2 -g
    pm2 start npm --name "fastAgi-tts-edge" -- run start
    pm2 startup
    pm2 save
    ```

    Para validar que la aplicación esté corriendo correctamente, puedes utilizar:

    ```bash
    pm2 status
    ```

## Uso
Dentro de asterisk:

``` bash
[ivr_edge_tts]
exten => s,1,Answer()
same => n,AGI(agi://localhost:4573/tts,"BIENVENIDOS A AULA ÚTIL, SI CONOCE EL NÚMERO DE ANEXO MÁRQUELO AHORA, MARQUE 0 PARA COMUNICARSE CON LA OPERADORA,PARA SOPORTE TÉCNICO MARQUE 1, PARA VENTAS MARQUE 2 Ó ESPERE EN LÍNEA QUE UNO DE NUESTRAS OPERADORAS LO ATENDERÁ\; GRACIAS.",es)
same => n,Hangup()

```


### Ver el Log

Para revisar el log de la aplicación y depurar posibles errores:

```bash
pm2 log
```

### Gestión de la Aplicación con PM2

-   **Para eliminar la instancia de la aplicación:**
    
    ```
    pm2 delete all
    ```
    
-   **Para reiniciar la aplicación:**
    
    ```
    pm2 restart all
    ```
    
-   **Para remover el inicio automático:**
    
    ```
    pm2 unstartup systemd
    ```
    

## Sobre la Aplicación

La aplicación utiliza `voxo-agi` para manejar llamadas AGI con Asterisk, y `MsEdgeTTS` para convertir texto en habla utilizando el servicio de TTS de Microsoft Edge. La conversión de audio para un formato adecuado para Asterisk se realiza mediante `sox`.

El flujo principal del script realiza los siguientes pasos:

1.  Recibe una llamada y el texto a convertir en voz.
2.  Genera un archivo de TTS utilizando `MsEdgeTTS`.
3.  Convierte el archivo de TTS a un formato adecuado para Asterisk usando `sox`.
4.  Reproduce el archivo convertido en la llamada.
5.  Limpia los archivos temporales generados en el proceso.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, siente libre de fork el repositorio y enviar tus pull requests.

## Licencia

GNU