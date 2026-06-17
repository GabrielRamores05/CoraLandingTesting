const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1dszTTR7uwSvJaLMGOLvlNDQa5F7SuBIRqN57fYSkufA/edit";
const BOOKING_SHEET_NAME = "Registration";
const INQUIRY_SHEET_NAME = "Inquiry";
const GMEET_LINK = "http://meet.google.com/iry-hycj-jzs";
const DEMO_TIME = "3:00 PM - 4:00 PM";

function getOtherValue(data, field, otherField) {
  return data[field] === "Other" && data[otherField] ? data[otherField] : data[field] || "";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function doPost(e) {
  if (!e || !e.parameter) {
    return ContentService.createTextOutput("No form data");
  }

  const data = e.parameter;
  const ss = SpreadsheetApp.openByUrl(SPREADSHEET_URL);

  const firstName = data.FirstName || "";
  const lastName = data.LastName || "";
  const email = data.Email || "";
  const cooperativeName = data.CooperativeName || "";
  const cooperativeType = getOtherValue(data, "CooperativeType", "OtherCooperativeType");
  const role = getOtherValue(data, "Role", "OtherRole");
  const mobile = data.Mobile || "";
  const demoDate = data.DemoDate || "";
  const facebook = data.Facebook || "";
  const subscribed = data.Subscribed || "No";
  const inquiryType = getOtherValue(data, "InquiryType", "OtherInquiryType");
  const message = data.Message || "";

  if (data.FormType === "Booking") {
    const sheet = ss.getSheetByName(BOOKING_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput("Registration sheet not found");
    }

    sheet.appendRow([
      firstName,
      lastName,
      email,
      cooperativeName,
      cooperativeType,
      role,
      mobile,
      demoDate,
      facebook,
      subscribed
    ]);

    const safeFirstName = firstName || "there";
    const safeCooperativeName = cooperativeName || "your cooperative";

    const plainBody =
      "Hi " + safeFirstName + ",\n\n" +
      "Thank you for your interest! We've received your request and are excited to connect with " + safeCooperativeName + ".\n\n" +
      "Cooperative Type: " + cooperativeType + "\n" +
      "Your Role: " + role + "\n\n" +
      "Your demo is scheduled for:\n" +
      "Date: " + (demoDate || "TBA") + "\n" +
      "Time: " + DEMO_TIME + "\n\n" +
      "You can confirm your booking using this link:\n" +
      GMEET_LINK;

    const htmlBody =
      "<p>Hi <strong>" + escapeHtml(safeFirstName) + "</strong>,</p>" +
      "<p>Thank you for your interest! We've received your request and are excited to connect with <strong>" + escapeHtml(safeCooperativeName) + "</strong>.</p>" +
      "<p><strong>Cooperative Type:</strong> " + escapeHtml(cooperativeType) + "<br>" +
      "<strong>Your Role:</strong> " + escapeHtml(role) + "</p>" +
      "<p>Your demo is scheduled for:</p>" +
      "<p><strong>Date:</strong> " + escapeHtml(demoDate || "TBA") + "<br>" +
      "<strong>Time:</strong> " + DEMO_TIME + "</p>" +
      "<p>You can access the demo using the link below:</p>" +
      "<p><a href=\"" + GMEET_LINK + "\">" + GMEET_LINK + "</a></p>";

    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: "[CORA] Your Free Online Demo Link 😊",
        body: plainBody,
        htmlBody: htmlBody
      });
    }

  } else if (data.FormType === "Inquiry") {
    const sheet = ss.getSheetByName(INQUIRY_SHEET_NAME);
    if (!sheet) {
      return ContentService.createTextOutput("Inquiry sheet not found");
    }

    sheet.appendRow([
      firstName,
      lastName,
      email,
      cooperativeName,
      cooperativeType,
      role,
      mobile,
      demoDate,
      facebook,
      subscribed,
      inquiryType,
      message
    ]);

    const safeFirstName = firstName || "there";
    const safeInquiryType = inquiryType || "your inquiry";

    const plainBody =
      "Hi " + safeFirstName + ",\n\n" +
      "Thank you for reaching out about " + safeInquiryType + ". We've received your inquiry and our team will get back to you soon.";

    const htmlBody =
      "<p>Hi <strong>" + escapeHtml(safeFirstName) + "</strong>,</p>" +
      "<p>Thank you for reaching out about <strong>" + escapeHtml(safeInquiryType) + "</strong>. We've received your inquiry and our team will get back to you soon.</p>";

    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: "We Received Your Inquiry",
        body: plainBody,
        htmlBody: htmlBody
      });
    }
  }

  return ContentService.createTextOutput("Added..");
}
