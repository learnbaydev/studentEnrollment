const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});

async function uploadFile(filePath, bucketName, s3Key = null) {
  try {
    const fileContent = await fs.readFile(filePath);
    const fileName = s3Key || `offer-letters/${Date.now()}_${path.basename(filePath)}`;
    
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: 'application/pdf',
      ContentDisposition: 'inline'
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Key; // Return the S3 key
  } catch (err) {
    console.error('Upload error:', err);
    throw err;
  }
}

async function getSignedUrl(bucketName, key, expires = 3600) {
  try {
    // Verify file exists first
    await s3.headObject({ Bucket: bucketName, Key: key }).promise();
    
    return s3.getSignedUrl('getObject', {
      Bucket: bucketName,
      Key: key,
      Expires: expires,
      ResponseContentType: 'application/pdf',
      ResponseContentDisposition: 'inline'
    });
  } catch (err) {
    console.error('Signed URL error:', err);
    throw err;
  }
}

module.exports = { uploadFile, getSignedUrl };