const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports.upload = async (event, context) => {

    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))

    const s3Bucket = "milostim15.gallery";
    const objectName = event.fileName;
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
        return { body: 'Successfully created item!' }
        
    } catch (err) {
        return { error: err }
    } 
};