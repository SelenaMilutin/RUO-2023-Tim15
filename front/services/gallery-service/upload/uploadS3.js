const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const s3Bucket = "milostim15.gallery";
const createResponse = require('../utility/utils.js').createResponse;

module.exports.upload = async (event, context) => {
    
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    
    const body = event.body;
    const objectName = body.hasAccess + '/' + body.albumName + '/' + body.fileName;

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
  
  