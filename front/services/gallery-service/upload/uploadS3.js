const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const s3Bucket = "milostim15.gallery";

module.exports.upload = async (event, context) => {
    
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    
    const objectName = event.hasAccess + '-' + event.albumName + '-' + event.fileName;

    try {
        const exists = await checkIfFileExists(s3Bucket, objectName);
        console.error(exists);
        if (exists) return { error: "File with same name already exist in album." }
    }
    catch(error) {
        console.error("Error:", error);
        return { error: error }
    };

    const objectData = event.file;
    const objectType = "application/json";
    try {
        const params = {
            Bucket: s3Bucket,
            Key: objectName,
            Body: objectData,
            ContentType: objectType
        };
        await s3.putObject(params).promise(); 
        event["s3Name"] = objectName;
        return event
        
    } catch (err) {
        return { error: err }
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
  
  