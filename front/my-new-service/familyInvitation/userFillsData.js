const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const ses = new AWS.SES();

module.exports.userFillsData= async (event, context) => {
    var user = JSON.parse(event.body);
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    var snsparams = {
        Message: 'User by email' + user.email + " filled his data. Confirm his registration by clicking on link.",
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-DRUGITIPIC'
      }
    if (!isCorrectData(user)) {
      return {
  statusCode: 404,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify("Data is not correct")
}
    }


      const params = {
        TableName : 'serverlessUsers',
        /* Item properties will depend on your application concerns */
        Key: {
          username: user.username
        }
      }
      try {
          const data = await docClient.get(params).promise()
          if (JSON.stringify(data.Item) != null) {
           return {
  statusCode: 404,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify("This username is already taken")
}
        }
      } catch(err){}
      
      const params2 = {
        TableName : 'serverlessUsersByInvitation',
        /* Item properties will depend on your application concerns */
        Key: {
          email: user.email
        }
      }
      try {
          const data = await docClient.get(params2).promise()
          if (JSON.stringify(data.Item) == null) {
            return {
  statusCode: 404,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify("This request does not exist!")
}
        }
        if (data.Item.callerUsername != user.callerUsername){
            return {
  statusCode: 404,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify("This request does not exist!")
}
        }
      } catch(err){}
        
      
      
        try {
            const data = await sns.publish(snsparams).promise();
          } catch (e) {
            console.log(e.stack)
        
          } finally {
            sendMail("Tim15 registration notification", "Your gest " + user.email + " filed in his data for registration. Please verify on http://localhost:4200/verifyRegistation")

            var userparams = {
              TableName: 'serverlessUsersByInvitation',
              Item: {
                "username": user.username,
                "callerUsername":user.callerUsername,
                "namee": user.name,
                "lastname": user.surname,
                "birthday": user.birthday,
                "email": user.email,
                "password":user.password
               }
            };
            try {
          await docClient.put(userparams).promise();
          
          return {
  statusCode: 200,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify("Almost there! We sent an verification email")
}
          
        }catch (err) {
          return { error: err }
      }
            
          }

}

function isCorrectData(user) {
  if (user.username == "" || user.name == "" || user.surname == "" || user.birthday == "" || user.email == "" || user.password == ""){
    return false
  }
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email))
  {
    return true
  }
  return false
}
  
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
  