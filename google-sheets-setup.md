# EditKaro.in - Google Sheets Integration Setup Guide

Follow these steps to connect your **Newsletter Form** and **Contact Us Form** directly to a **Google Sheet**.

---

## Step 1: Create a New Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a **Blank spreadsheet**.
2. Rename the spreadsheet to `EditKaro Form Submissions`.
3. Name the first sheet tab at the bottom: **`Newsletter`**.
4. In sheet **`Newsletter`**, add the following headers in row 1:
   - Cell `A1`: `Date`
   - Cell `B1`: `Email`
5. Click the `+` button at the bottom left to create a second sheet tab and name it: **`Contact`**.
6. In sheet **`Contact`**, add the following headers in row 1:
   - Cell `A1`: `Date`
   - Cell `B1`: `Name`
   - Cell `C1`: `Email`
   - Cell `D1`: `Phone`
   - Cell `E1`: `Subject`
   - Cell `F1`: `Message`

---

## Step 2: Open Apps Script
1. In your Google Sheet, click on **Extensions** > **Apps Script** in the top menu bar.
2. Delete any existing code in `Code.gs`.
3. Paste the following Google Apps Script code into `Code.gs`:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var timestamp = new Date();
    
    if (data.formType === 'newsletter') {
      var sheet = ss.getSheetByName('Newsletter');
      if (!sheet) {
        sheet = ss.insertSheet('Newsletter');
        sheet.appendRow(['Date', 'Email']);
      }
      sheet.appendRow([timestamp, data.email]);
      
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Subscribed successfully!'
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (data.formType === 'contact') {
      var sheet = ss.getSheetByName('Contact');
      if (!sheet) {
        sheet = ss.insertSheet('Contact');
        sheet.appendRow(['Date', 'Name', 'Email', 'Phone', 'Subject', 'Message']);
      }
      sheet.appendRow([
        timestamp,
        data.name,
        data.email,
        data.phone || 'N/A',
        data.subject || 'N/A',
        data.message
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Message received successfully!'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': 'Invalid form type'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## Step 3: Deploy as a Web App
1. At the top right of Apps Script, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `EditKaro Form Handler`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Crucial for accepting form entries from website visitors!)*
4. Click **Deploy**.
5. Grant permissions when prompted (Select your account -> Advanced -> Go to EditKaro Form Handler (unsafe) -> Allow).
6. Copy the **Web App URL** provided (looks like `https://script.google.com/macros/s/.../exec`).

---

## Step 4: Paste Web App URL in Website Code
1. Open `c:\Users\saahi\Downloads\files\script.js`.
2. Replace `GOOGLE_SHEETS_WEB_APP_URL` variable at the top of `script.js` with your copied Web App URL:

```javascript
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
```

All submissions will now instantly save into your Google Sheet!
