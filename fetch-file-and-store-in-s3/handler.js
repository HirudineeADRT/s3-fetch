'use strict';

const fetch = require('node-fetch');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const s3 = new AWS.S3();

module.exports.save = (event, context, callback) => {
  fetch(event.image_url)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      return Promise.reject(new Error(
        `Failed to fetch ${response.url}: ${response.status} ${response.statusText}`));
    })
    .then(response => response.buffer())
    .then((buffer) =>{
      var image = document.createElement('img');
      image.src = 'data:image/jpeg;base64,' + buffer.toString('base64')
    })
    .then(image => (
      
      s3.putObject({
        "Body": image.src,
        "Bucket": "indunil1",
        "Key": event.key
      }).promise()
    ))
    .then(v => callback(null, v), callback);
};
