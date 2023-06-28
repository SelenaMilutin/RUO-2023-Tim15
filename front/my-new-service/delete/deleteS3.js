const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const s3Bucket = "milostim15.gallery";
const createResponse = require('../utility/utils.js').createResponse;

module.exports.delete = async (event, context) => {
    body = JSON.parse(event.body)
    const objectName = body.albumName + '/' + body.fileName;
    try {
        const exists = await checkIfFileExists(s3Bucket, objectName);
        if (!exists) return createResponse(400, "File with same name nost not exist in album.");
    }
    catch(error) {
        console.error("Error:", error);
        return createResponse(500, 'Error');
    };
        // Previous step has failed
        var params = {
            Bucket: s3Bucket,
            Key: objectName
            /* 
               where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
               - full path name to your file without '/' at the beginning
            */
          };
          
          s3.deleteObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });

}

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
  