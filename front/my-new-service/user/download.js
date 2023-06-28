const s3 = new AWS.S3();

module.exports.handler = async (event, context) => {

  const body = JSON.parse(event.body)

  const params = {
    Bucket: 'milostim15.gallery',
    Key: body.fileName
  };

  const tempFilePath = body.fileName;

  try {
    const stream = s3.getObject(params).createReadStream();

    const writeStream = fs.createWriteStream(tempFilePath);
    stream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ body: "Success" }) 
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
      body: JSON.stringify({ error: err})
    }
  }
};