const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-bucket-name';

// Upload file to S3
const uploadFile = async (filePath, key) => {
  const fileContent = fs.readFileSync(filePath);
  
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: 'application/pdf'
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully at ${data.Location}`);
    return data.Location;
  } catch (err) {
    console.error('Error uploading file:', err);
    throw err;
  }
};

// Generate signed URL for download
const getSignedUrl = async (key, expires = 3600) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Expires: expires
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (err) {
    console.error('Error generating signed URL:', err);
    throw err;
  }
};

// Delete file from S3
const deleteFile = async (key) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`File ${key} deleted successfully`);
  } catch (err) {
    console.error('Error deleting file:', err);
    throw err;
  }
};

module.exports = {
  uploadFile,
  getSignedUrl,
  deleteFile
};