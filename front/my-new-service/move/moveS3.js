const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const s3Bucket = "milostim15.gallery";
const createResponse = require('../utility/utils.js').createResponse;

module.exports.move = async (event, context) => {
  try {

    console.log(event)
    const body = event.body
    const objectName = body.s3Name;
    const newName = body.newName

    const copyParams = {
      Bucket: s3Bucket,
      CopySource: `${s3Bucket}/${objectName}`,
      Key: newName
    };

    await s3.copyObject(copyParams).promise();

    const deleteParams = {
      Bucket: s3Name,
      Key: objectName
    };

    await s3.deleteObject(deleteParams).promise();
    await s3.putObject(params).promise(); 
    return event;

  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, "Error");
  }
};