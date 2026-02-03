// Code.gs — paste this into the Google Apps Script editor attached to your Sheet.
// It receives the JSON POST from Vercel and appends a row.

function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const sheet  = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // If the sheet is empty, write the header row first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Submitted At',
        'Lead Name',
        'Lead Email',
        'Lead Phone',
        'Number of Doors',
        'Lead Role',
        'Quiz Role',
        'Score %',
        'Score Label',
        'Gaps',
        'Referred By Name',
        'Referred By Email'
      ]);
    }

    // Append the data row
    sheet.appendRow([
      data.submittedAt       || '',
      data.leadName          || '',
      data.leadEmail         || '',
      data.leadPhone         || '',
      data.leadDoors         || '',
      data.leadRole          || '',
      data.quizRole          || '',
      data.scorePct          || '',
      data.scoreLabel        || '',
      data.gaps              || '',
      data.referredByName    || '',
      data.referredByEmail   || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MIME_TYPE.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MIME_TYPE.JSON);
  }
}
