// EcoMetal - Guardar formulario web en Google Sheets
// Pega este archivo en Google Apps Script como Code.gs

const SPREADSHEET_ID = "1irq8I6rukonbBiKQ1n_rVrhoZ3gko5kWdIa5xyk2r10";
const SHEET_NAME = "Respuestas";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

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

    const datos = e.parameter || {};

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
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput("EcoMetal Google Sheets API activa")
    .setMimeType(ContentService.MimeType.TEXT);
}
