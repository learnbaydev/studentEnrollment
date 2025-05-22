const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generateOfferLetterPDF = async (userData, filePath) => {
  try {
    // Read HTML template
    const templatePath = path.join(__dirname, 'templates/scholarship-letter.html');
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Replace placeholders with actual data
    html = html.replace(/<<Full Name>>/g, userData.full_name)
               .replace(/<<Program Name>>/g, userData.program_name || userData.program_name)
               .replace(/<<Domain Name>>/g, userData.domain)
               .replace(/<<Program Fee>>/g, userData.program_fee)
              //  .replace(/<<Scholarship Percentage>>/g, userData.scholarship_percentage)
              //  .replace(/<<Scholarship Fee>>/g, userData.scholarship_fee)
               .replace(/<<Validity>>/g, userData.validity)
               .replace(/<<Signature>>/g, userData.signature || 'Scholarship & Admissions Team');
    
    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    await page.pdf({
      path: filePath,
      format: 'A4',
      margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px'
      },
      printBackground: true
    });
    
    await browser.close();
    
    console.log(`PDF generated successfully at ${filePath}`);
    return true;
    
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  }
};

// Example usage:
/*
const userData = {
  full_name: "John Doe",
  program_name: "Data Science Program",
  program_fee: "1,00,000",
  scholarship_percentage: "20",
  scholarship_fee: "80,000",
  validity: "30 days from the date of issue",
  signature: "Scholarship & Admissions Team"
};

generateScholarshipLetterPDF(userData, './scholarship-letter.pdf');
*/



module.exports = generateOfferLetterPDF;