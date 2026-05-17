// EcoMetal - Guardar formulario web en Google Sheets
// Google Sheet:
// https://docs.google.com/spreadsheets/d/1irq8I6rukonbBiKQ1n_rVrhoZ3gko5kWdIa5xyk2r10/edit?usp=sharing
//
// URL /exec usada en index.html:
// https://script.google.com/a/macros/tecsup.edu.pe/s/AKfycbySYvGc3Bz9OZj9I2i23OZrXsI9tvbY7c9Bm90EYVyk6aVbKF7CFy9i1aXIxYaanUmM/exec

const SPREADSHEET_ID = "1irq8I6rukonbBiKQ1n_rVrhoZ3gko5kWdIa5xyk2r10";
const SHEET_NAME = "Respuestas";

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    prepararCabecera(sheet);

    const datos = obtenerDatos(e);

    sheet.appendRow([
      new Date(),
      datos.nombre || "",
      datos.correo || "",
      datos.telefono || "",
      datos.asunto || "",
      datos.mensaje || "",
      datos.pagina || "EcoMetal"
    ]);

    return ContentService
      .createTextOutput("OK")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    return ContentService
      .createTextOutput("ERROR: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet() {
  return ContentService
    .createTextOutput("EcoMetal Apps Script activo")
    .setMimeType(ContentService.MimeType.TEXT);
}

function prepararCabecera(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Fecha y hora",
      "Nombre y Apellido",
      "Correo Electronico",
      "Telefono / Celular",
      "Asunto",
      "Mensaje",
      "Pagina"
    ]);
  }
}

function obtenerDatos(e) {
  let datos = {};

  if (e && e.parameter) {
    datos = e.parameter;
  }

  // Respaldo por si el navegador envia los datos como texto codificado.
  if ((!datos.nombre && !datos.correo && !datos.telefono) && e && e.postData && e.postData.contents) {
    datos = parsearFormulario(e.postData.contents);
  }

  return datos;
}

function parsearFormulario(contenido) {
  const datos = {};
  const pares = contenido.split("&");

  pares.forEach(function(par) {
    if (!par) return;

    const partes = par.split("=");
    const clave = decodeURIComponent((partes[0] || "").replace(/\+/g, " "));
    const valor = decodeURIComponent((partes.slice(1).join("=") || "").replace(/\+/g, " "));

    datos[clave] = valor;
  });

  return datos;
}

// Ejecuta esta funcion manualmente para probar que la hoja recibe datos.
function pruebaManual() {
  const prueba = {
    parameter: {
      nombre: "Juan Prueba",
      correo: "juan@prueba.com",
      telefono: "999999999",
      asunto: "Prueba de formulario",
      mensaje: "Este dato fue enviado desde pruebaManual",
      pagina: "EcoMetal"
    }
  };

  doPost(prueba);
}
