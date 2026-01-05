// Replace SHEET_ID with your Google Sheet ID (the long id in the sheet URL)
var SHEET_ID = 'YOUR_SHEET_ID_HERE';

// Optional: sheet name to write to (default: first sheet)
var SHEET_NAME = 'Sheet1';

// Where to send internal notification emails (support/agents)
var NOTIFY_EMAIL = 'support@tfztv.com';

// If true, send a polite confirmation email to the customer (uses payload.email)
var SEND_USER_CONFIRMATION = true;

function doGet(e){
  return ContentService.createTextOutput(JSON.stringify({status:'ok', message:'Apps Script is running'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e){
  try {
    var raw = e.postData && e.postData.contents;
    var data = raw ? JSON.parse(raw) : {};

    // Basic required fields validation
    var fullname = (data.fullname || '').toString().trim();
    var email = (data.email || '').toString().trim();
    var phone = (data.phone || '').toString().trim();
    var plan = (data.plan || '').toString().trim();
    var message = (data.message || '').toString().trim();

    if(!fullname || !email || !phone){
      return ContentService
        .createTextOutput(JSON.stringify({status:'error', message:'Missing required fields'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // If the sheet is empty, add a header row
    if(sheet.getLastRow() === 0){
      sheet.appendRow(['Timestamp','Plan','Full Name','Email','Phone','Message']);
    }

    var row = [new Date(), plan, fullname, email, phone, message];
    sheet.appendRow(row);

    // Send internal notification email to support/agents
    try {
      var subject = 'Nouvelle commande TFZ — ' + (plan || 'Sans plan');
      var body = '';
      body += 'Nouvelle demande reçue:\n\n';
      body += 'Plan: ' + plan + '\n';
      body += 'Nom: ' + fullname + '\n';
      body += 'Email: ' + email + '\n';
      body += 'Téléphone: ' + phone + '\n';
      body += 'Message: ' + message + '\n\n';
      body += 'Reçu le: ' + new Date().toString() + '\n';

      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    } catch(mailErr){
      // swallow mail errors but include in log
      console.error('Mail send error: ' + mailErr);
    }

    // Optional: send confirmation email to the customer
    if(SEND_USER_CONFIRMATION && email){
      try{
        var userSubject = 'Confirmation de votre demande — TFZ TV';
        var userBody = '<p>Bonjour ' + fullname + ',</p>' +
          '<p>Merci — nous avons bien reçu votre demande pour <strong>' + (plan || 'un abonnement TFZ') + '</strong>. Un de nos agents vous contactera bientôt au ' + phone + ' pour confirmer et configurer votre commande.</p>' +
          '<p>Cordialement,<br>Équipe TFZ TV</p>';

        MailApp.sendEmail({
          to: email,
          subject: userSubject,
          htmlBody: userBody,
          name: 'TFZ TV'
        });
      }catch(userMailErr){
        console.error('User mail error: ' + userMailErr);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Utility to create header row manually if needed
function createHeaders(){
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  sheet.clear();
  sheet.appendRow(['Timestamp','Plan','Full Name','Email','Phone','Message']);
}
