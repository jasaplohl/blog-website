/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
const { v4: uuidv4 } = require('uuid')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "blogwebsiteDB";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "blog_id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/blog";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for all objects *
 ********************************/

 app.get("/blog", function(req, res) {
  let queryParams = {
    TableName: tableName
  }

  dynamodb.scan(queryParams, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get('/blog/:blog_id', function(req, res) {
  let getItemParams = {
    TableName: tableName,
    Key: {
      blog_id: req.params.blog_id
    }
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
* HTTP put method for insert object *
*************************************/

app.put("/blog", function(req, res) {

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }

  //If content is empty we don't post it
  if(putItemParams.Item.blog_content && putItemParams.Item.blog_content.trim() !== "") {
    if(putItemParams.Item.blog_id === undefined) {
      //Creating a post
      putItemParams.Item.user_id = req.apiGateway.event.requestContext.authorizer.claims.sub;
      putItemParams.Item.user_name = req.apiGateway.event.requestContext.authorizer.claims['cognito:username'];
      putItemParams.Item.blog_id = uuidv4();
      putItemParams.Item.timestamp = new Date().toISOString();
      putItemParams.Item.likes = [];
      putItemParams.Item.dislikes = [];
      putItemParams.Item.comments = [];

    } else {
      //Updating the post - we need to check if the user posting the update is the same as the author
      
      // if(req.apiGateway.event.requestContext.authorizer.claims['cognito:username'] === putItemParams.Item.user_id) {
        
      // } else {
      //   res.statusCode = 500;
      //   res.json({error: "You can only edit your own posts!", url: req.url});
      // }
    }
    dynamodb.put(putItemParams, (err, data) => {
      if(err) {
        res.statusCode = 500;
        res.json({error: err, url: req.url, body: req.body});
      } else{
        res.json({success: 'put call succeed!', url: req.url, data: data, blog_id: putItemParams.Item.blog_id, requestData: req.apiGateway.event.requestContext})
      }
    });
  } else {
    res.statusCode = 500;
    res.json({error: "Blog content cannot be empty!", url: req.url});
  }
});

/************************************
* HTTP post method for insert object *
*************************************/

app.post("/blog", function(req, res) {

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }

  //If content is empty we don't post it
  if(putItemParams.Item.blog_content && putItemParams.Item.blog_content.trim() !== "") {
    if(putItemParams.Item.blog_id === undefined) {
      //Creating a post
      putItemParams.Item.user_id = req.apiGateway.event.requestContext.authorizer.claims.sub;
      putItemParams.Item.user_name = req.apiGateway.event.requestContext.authorizer.claims['cognito:username'];
      putItemParams.Item.blog_id = uuidv4();
      putItemParams.Item.timestamp = new Date().toISOString();
      putItemParams.Item.likes = [];
      putItemParams.Item.dislikes = [];
      putItemParams.Item.comments = [];

    } else {
      //Updating the post - we need to check if the user posting the update is the same as the author
      
      // if(req.apiGateway.event.requestContext.authorizer.claims['cognito:username'] === putItemParams.Item.user_id) {

      // } else {
      //   res.statusCode = 500;
      //   res.json({error: "You can only edit your own posts!", url: req.url});
      // }
    }
    dynamodb.put(putItemParams, (err, data) => {
      if(err) {
        res.statusCode = 500;
        res.json({error: err, url: req.url, body: req.body});
      } else{
        res.json({success: 'post call succeed!', url: req.url, data: data, blog_id: putItemParams.Item.blog_id, requestData: req.apiGateway.event.requestContext})
      }
    });
  } else {
    res.statusCode = 500;
    res.json({error: "Blog content cannot be empty!", url: req.url});
  }
});

/**************************************
* HTTP remove method to delete object *
***************************************/

app.delete('/blog/:blog_id', function(req, res) {

  let removeItemParams = {
    TableName: tableName,
    Key: {
      blog_id: req.params.blog_id
    }
  }

  dynamodb.get(removeItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      var dataTemp;
      if (data.Item) {
        dataTemp = data.Item;
      } else {
        dataTemp = data;
      }
      if(req.apiGateway.event.requestContext.authorizer.claims.sub === dataTemp.user_id) {
        dynamodb.delete(removeItemParams, (err, data)=> {
          if(err) {
            res.statusCode = 500;
            res.json({error: err, url: req.url});
          } else {
            res.json({url: req.url, data: data});
          }
        });
      } else {
        res.statusCode = 500;
        res.json({error: "You can only delete your own posts!", url: req.url});
      }
    }
  });
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
