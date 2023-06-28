const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const s3Bucket = "milostim15.gallery";
const createResponse = require('../utility/utils.js').createResponse;

module.exports.delete = async (event, context) => {
    
        // Previous step has failed
        var params = {
            Bucket: s3Bucket,
            Key: objectName
            /* 
               where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
               - full path name to your file without '/' at the beginning
            */
          };
          
          try {
              const data = await s3.deleteObject(params).promise()
                return event;
          } catch (err) {console.log(JSON.stringify(err)); return createResponse(500, 'Error');}
          

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
  