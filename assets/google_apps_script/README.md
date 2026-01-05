Google Apps Script: receive order form and append to Google Sheets

Steps to deploy and connect with your site

1) Create a Google Sheet
- In Google Drive create a new Google Sheet.
- Note the Sheet ID from the URL: https://docs.google.com/spreadsheets/d/<THIS_IS_THE_ID>/edit

2) Edit `Code.gs`
- Open the script editor (Extensions → Apps Script) or create a new Apps Script project.
- Replace `SHEET_ID` in `Code.gs` with your Sheet ID.
- Optionally set `SHEET_NAME` to the target sheet name.

3) Save and deploy as Web App
- Click Deploy → New deployment
- Select "Web app" and set:
  - Description: e.g. "TFZ Order Receiver"
  - Execute as: Me
  - Who has access: Anyone (even anonymous)
- Click Deploy and copy the Web App URL.

4) Update your website
- In `index2.html` find the placeholder `GOOGLE_SCRIPT_URL` variable in the order modal script.
- Replace with the Web App URL you copied.

Example Web App URL usage in `index2.html`:
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';

5) Test
- Start a local static server and open `index2.html` in your browser.
- Click a "Commander" button, fill the form and submit.
- Check the Google Sheet — a new row should be appended.

Notes and security
- Deploying the web app with "Anyone, even anonymous" allows your static site to POST without OAuth.
- The Apps Script will be running with your Google account permissions — protect the script and the Spreadsheet.
- For more secure implementations consider using a backend endpoint that signs requests or adds verification.

If you want, I can also generate the exact `doPost` Apps Script for additional fields or automatic notifications (email/WhatsApp API) — tell me which features you'd like next.