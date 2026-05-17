// EcoMetal - Guardar formulario web en Google Sheets
// Google Sheet conectado:
// https://docs.google.com/spreadsheets/d/1irq8I6rukonbBiKQ1n_rVrhoZ3gko5kWdIa5xyk2r10/edit?usp=sharing
//
// URL de Apps Script usada en index.html:
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

    if (!e || !e.parameter) {
      return ContentService
        .createTextOutput("ERROR: No se recibieron datos del formulario.")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    const datos = e.parameter;

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

function pruebaManual() {
  const datosDePrueba = {
    parameter: {
      nombre: "Prueba Manual",
      correo: "correo@prueba.com",
      telefono: "999999999",
      asunto: "Prueba",
      mensaje: "Esto es una prueba desde Apps Script",
      pagina: "EcoMetal"
    }
  };

  doPost(datosDePrueba);
}
