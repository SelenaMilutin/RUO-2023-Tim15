const AWS = require("aws-sdk");
const ses = new AWS.SES();

function createResponse(status, body) {
    return { 
        statusCode: status, 
        headers: {
            'Access-Control-Allow-Origin': 'http://localhost:4200',
        },
        body: JSON.stringify(body, null, 2)
    };
}

module.exports = {
    createResponse
};

async function sendMail(subject, data) {

    const emailParams = {
          Destination: {
            ToAddresses: ["selena.milutin@gmail.com"],
          },
          Message: {
            Body: {
              Text: { Data: data },
            },
            Subject: { Data: subject },
          },
          Source: "selena.milutin@gmail.com",
    };
        
    try {
          let key = await ses.sendEmail(emailParams).promise();
          console.log("MAIL SENT SUCCESSFULLY!!");      
    } catch (e) {
          console.log("FAILURE IN SENDING MAIL!!", e);
        }  
    return;
  }
    