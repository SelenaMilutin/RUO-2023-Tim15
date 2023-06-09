const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
var ses = new AWS.SES({region: 'eu-central-1'});

module.exports.registerUser= async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    
    var snsparams = {
        Message: 'User successfully created',
        Subject: 'Tim15 registration notification',
        TopicArn: 'arn:aws:sns:eu-central-1:260436118818:DatabaseTopic'
      };
    var user = JSON.parse(event.body)
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
      try {
    snsparams.Message = "User already exists"
    const data = await sns.publish(snsparams).promise();
  } catch (e) {
    console.log(e.stack)
        

  } finally {
    return {
  statusCode: 404,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: "User already exists!"
}
  }
  
    }
    var albumParams = {
        TableName: 'serverlessAlbums',
        Item: {
          "s3Link": user.username + "/root",
          "albumName": "root",
          "subAlbums": [],
          "fileOwner": user.username, 
          "hasAccess": [user.username]
        }
      };
      try {
    await docClient.put(albumParams).promise();}
    catch(err) {}
    var userparams = {
        TableName: 'serverlessUsers',
        Item: {
          "username": user.username,
          "namee": user.name,
          "lastname": user.surname,
          "birthday": user.birthday,
          "email": user.email,
          "password":user.password
        }
      };
      try {
    await docClient.put(userparams).promise();
    try {
    const data = await sns.publish(snsparams).promise();
  } catch (e) {
    console.log(e.stack)
       

  } finally {
    return {
  statusCode: 200,
  headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:4200",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET, PUT"
        },
  body: JSON.stringify('Successfully created item!')
}
    
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
        console.log("MAIL SENTSUCCESSFULLY!!");      
  } catch (e) {
        console.log("FAILURE IN SENDING MAIL!!", e);
      }  
  return;
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