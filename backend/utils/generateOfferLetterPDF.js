const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { uploadFile } = require('./s3Storage');

const generateOfferLetterPDF = async (userData, userid) => {
  let browser;
  try {
    // Read HTML template
    const templatePath = path.join(__dirname, 'templates/scholarship-letter.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    const escapeHTML = (str) =>
      str?.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");


    
          html = html.replace(/<<Full Name>>/g, userData.full_name)
          .replace(/<<user Id>>/g, userid)
          .replace(/<<Program Name>>/g, userData.program_name || userData.program_name)
          .replace(/<<Domain Name>>/g, userData.domain)
          .replace(/<<Remarks data>>/g, escapeHTML(userData.remarks || 'N/A'))
          .replace(/<<Validity>>/g, userData.validity)
          .replace(/<<Signature>>/g, userData.signature || 'Scholarship & Admissions Team');
      
     
    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF buffer instead of saving to file
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px'
      },
      printBackground: true
    });
    
    // Create a temporary file
    const tempFileName = `offer_${userData.id}_${Date.now()}.pdf`;
    const tempFilePath = path.join(__dirname, '../temp', tempFileName);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, '../temp'))) {
      fs.mkdirSync(path.join(__dirname, '../temp'));
    }
    
    // Write to temp file
    fs.writeFileSync(tempFilePath, pdfBuffer);
    
    // Upload to S3
    const s3Key = `offer-letters/${tempFileName}`;
    const s3Url = await uploadFile(tempFilePath, s3Key);
    
    // Clean up temp file
    fs.unlinkSync(tempFilePath);
    
    console.log(`PDF generated and uploaded to S3 at ${s3Url}`);
    return { s3Key, s3Url };
    
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = generateOfferLetterPDF;