#! /usr/bin/env node
const AWS = require('aws-sdk');

const [, , ...args] = process.argv

const [command, func, stage] = args;

// Create a DynamoDB client
const dynamoDB = new AWS.DynamoDB({
    region: "ap-southeast-1",
    // accessKeyId: "local",
    // secretAccessKey: "local",
    // endpoint: "http://localhost:8000",
});
const dbSchema = require('../db-migrate/003_dynamo_package.json')
if(!stage) {
    throw "stage option is not exits !!";
}
if (command === 'migrate') {
    const tableName = `${stage}_${dbSchema.TableName}`
    switch (func.toLocaleLowerCase()) {
        case 'up':
            dynamoDB.createTable(
              { ...dbSchema, TableName: tableName },
              function (err, data) {
                if (err) {
                  console.log(err);
                  console.error("migrate error !!");
                } else {
                  console.log(`Table ${tableName} created.`);
                }
              }
            );
            break;
        case 'down':
            
            dynamoDB.deleteTable({ TableName: tableName }, function (err, data) {
                if (err) {
                    console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
                }
            });
            break
        default:
            console.log('command does not exist!!')
    }
}

// const tableName = dbSchema.TableName
// dynamoDB.deleteTable({ TableName: tableName }, function(err, data) {
//     if (err) {
//       console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//       console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
//     }
//   });


// For migrate up
// dynamoDB.createTable(dbSchema, function (err, data) {
//     if (err) {
//         console.error('migrate error !!')
//     } else {
//         console.log('Table created.')
//     }
// });
