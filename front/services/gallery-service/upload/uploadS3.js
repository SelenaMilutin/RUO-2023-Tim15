const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const s3Bucket = "gst.milostim15.gallery";
const createResponse = require('../utility/utils.js').createResponse;

module.exports.upload = async (event, context) => {
    console.log(event)
    const res = validateRequest(event.body);
    if (res != null) return createResponse(400, "Invalid request");

    const body = event.body
    const objectName = body.albumName + '/' + body.fileName;

    try {
        const exists = await checkIfFileExists(s3Bucket, objectName);
        if (exists) return createResponse(400, "File with same name already exist in album.");
    }
    catch(error) {
        console.error("Error:", error);
        return createResponse(400, 'Error');
    };

    const objectData = Buffer.from(body['file'], 'base64');
    try {
        const params = {
            Bucket: s3Bucket,
            Key: objectName,
            Body: objectData,
        };
        await s3.putObject(params).promise(); 
        event['body']["s3Name"] = objectName;
        return event;
        
    } catch (error) {
        console.error("Error:", error);
        return createResponse(400, "Error");
    } 
};

async function checkIfFileExists(bucketName, fileName) {
    try {
      // Check if the item exists
      await s3.headObject({ Bucket: bucketName, Key: fileName }).promise();
      return true; // File exists
    } catch (error) {
      if (error.code === 'NotFound') {
        return false; // File does not exist
      }
      throw error; // Other error occurred
    }
}
  
function validateRequest(obj) {

    if (!obj.hasOwnProperty('fileName') || !obj.hasOwnProperty('fileType') || !obj.hasOwnProperty('fileSize')
        ||!obj.hasOwnProperty('description') || !obj.hasOwnProperty('tags') || !obj.hasOwnProperty('fileOwner')
        || !obj.hasOwnProperty('hasAccess') || !obj.hasOwnProperty('albumName') || !obj.hasOwnProperty('file')) {
        return createResponse(400, "Invalid request");
    }

    if (obj['fileName'].length > 40 || obj['fileName'] === "") return createResponse(400, "Title should contain 40 characters or less.");
    if (obj['description'].length > 500) return createResponse(400, "Title should contain 500 characters or less.");
    if (obj['fileName'].includes('/') || obj['fileName'].includes('-')) return createResponse(400, "Title shouldn't contain characters '/' and '-'.");
    if (!allowedFileTypes.includes(obj['fileType'].toLowerCase())) {
        return createResponse(400, "File type is not supported.");
    }
    if (obj['tags'].length > 15) return createResponse(400, "Up to 15 tags are allowed per file.");


    try {
        const size = parseInt(obj['fileSize']);
        if (size > 240000) return createResponse(400, "Files larger than 240MB aren't accepted.");
      } catch (error) {
        return createResponse(400, "Invalid request");
    }

    return null;

}

const allowedFileTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/json',
    'application/xml',
    'audio/mpeg',
    'audio/wav',
    'audio/aac',
    'audio/ogg',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-ms-wmv'
  ];