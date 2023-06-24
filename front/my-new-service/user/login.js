module.exports.login= async (event, context) => {
    console.log("recieved event", JSON.stringify(event, null, 2))
    console.log("recieved context", JSON.stringify(context, null, 2))
    var AWS = require("aws-sdk")

    var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

    let params = {
      // Specify which items in the results are returned.
      FilterExpression: "username = :u AND password = :p",
      // Define the expression attribute value, which are substitutes for the values you want to compare.
      ExpressionAttributeValues: {
        ":u": {S: this.loginForm.value.username || ""},
        ":p": {S: this.loginForm.value.password || ""}
      },
      // Set the projection expression, which are the attributes that you want.
      ProjectionExpression: "username, password, lastname, birthday",
      TableName: "users",
    };
    ddb.scan(params, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
        if (data.Items?.length == 0) {
          alert("pogresni kredencijali")
          return
        }
        if (data.Items?.length != 1) {
          alert("ima vise naloga sa istim kredencijalima")
          return
        }
      }
    })
}