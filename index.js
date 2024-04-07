"use strict";
const AGIServer = require('voxo-agi').AGIServer;
const { MsEdgeTTS, OUTPUT_FORMAT } = require("ly-ms-edge-tts");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const sox = require('sox');

// Función para generar el archivo de audio utilizando MsEdgeTTS
async function generateTTSFile(text) {
    console.log('Generando archivo de TTS...');
    const tts = new MsEdgeTTS();
    // await tts.setMetadata("es-PE-CamilaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    await tts.setMetadata("es-PE-CamilaNeural", OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3,0,0.5);
  
    const uniqueFileName = uuidv4();
    const filePath = path.join(__dirname, `${uniqueFileName}.mp3`);
  
    // await tts.toFile(filePath, text, {rate: 0.8, pitch: "+200Hz"});
    await tts.toFile(filePath, text);
    console.log('Archivo de TTS generado:', filePath);
    return filePath;
}
  
// Función para convertir el archivo de audio a formato adecuado para Asterisk usando sox
async function convertAudioFile(sourceFilePath) {
console.log('Convirtiendo archivo de audio...');
const convertedFilePath = sourceFilePath.replace('.mp3', '_converted.wav');

return new Promise((resolve, reject) => {
    const job = sox.transcode(sourceFilePath, convertedFilePath, {
    sampleRate: 8000,
    format: 'wav',
    channelCount: 1,
    });

    job.on('error', reject);
    job.on('end', () => {
    console.log('Archivo convertido:', convertedFilePath);
    resolve(convertedFilePath);
    });

    job.start();
});
}
  
// Función de limpieza de archivos
async function cleanUpFiles(...filePaths) {
filePaths.forEach(filePath => {
    fs.unlink(filePath, (err) => {
    if (err) {
        console.error(`Error al eliminar el archivo temporal ${filePath}:`, err);
    } else {
        console.log(`Archivo temporal ${filePath} eliminado con éxito.`);
    }
    });
});
}
  
// Script principal que maneja la llamada AGI
async function handleCall(channel) {
console.log('Script recibió llamada de %s -> %s', channel.request.callerid, channel.request.extension);

const textToSpeak = channel.request.arg_1;
console.log('Texto a convertir en voz:', textToSpeak);

if (!textToSpeak) {
    console.log("No se proporcionó texto para convertir a voz.");
    return;
}

try {
    const ttsFilePath = await generateTTSFile(textToSpeak);
    const convertedFilePath = await convertAudioFile(ttsFilePath);

    // Reproducir el archivo convertido en la llamada
    await channel.streamFile(convertedFilePath.replace('.wav', ''));
    console.log('Reproducción de audio completada.');

    await cleanUpFiles(ttsFilePath, convertedFilePath);
} catch (error) {
    console.error("Error durante la generación o conversión del archivo de audio:", error);
    await cleanUpFiles(ttsFilePath, convertedFilePath); // Intentar limpiar incluso si hay un error
}
}
  
// Iniciar el servidor AGI
console.log('Iniciando AGI Server en el puerto 4573...');
const agiServer = new AGIServer(handleCall, 4573);