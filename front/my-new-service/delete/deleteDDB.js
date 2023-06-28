const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const createResponse = require('../utility/utils.js').createResponse;
const sendMail = require('../utility/utils.js').sendMail;


module.exports.delete = async (event, context) => {
        // Previous step has failed
        if (event.hasOwnProperty('statusCode')) return event;
       var user = event['body']
        var params = {
            TableName: 'serverlessGallery',
            /* Item properties will depend on your application concerns */
            Key: {
              s3Name: user.s3Name
            },
            ReturnValues: null
          }
          
              try {
                var msg = "You have succesfully deleted " + user.fileName + " in album " + user.albumName
                sendMail("Upload file", msg)
              const data = await docClient.delete(params).promise()
              return {
            statusCode: 200,
            headers: {
                      "Access-Control-Allow-Headers" : "Content-Type",
                      "Access-Control-Allow-Origin": "http://localhost:4200",
                      "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
                  },
            body: JSON.stringify("Item successfully deleted!")
          }
            } catch (err) {
              return {
            statusCode: 404,
            headers: {
                      "Access-Control-Allow-Headers" : "Content-Type",
                      "Access-Control-Allow-Origin": "http://localhost:4200",
                      "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
                  },
            body: JSON.stringify(err)
          }
            }

}
  