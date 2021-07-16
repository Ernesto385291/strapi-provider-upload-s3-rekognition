"use strict";

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require("lodash");
const AWS = require("aws-sdk");

module.exports = {
  init(config) {
    const rekognition = new AWS.Rekognition({
      accessKeyId: config.rekognitionAccessKeyId,
      secretAccessKey: config.rekognitionSecretAccessKey,
      region: config.region,
      apiVersion: "2016-06-27",
    });

    const S3 = new AWS.S3({
      apiVersion: "2006-03-01",
      accessKeyId: config.s3AccessKeyId,
      secretAccessKey: config.s3SecretAccessKey,
      region: config.region,
      params: {
        Bucket: config.bucket,
      },
    });

    return {
      upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          const params = {
            Image: {
              Bytes: new Buffer(file.buffer),
            },
            MinConfidence: "80",
          };

          //Detecting inappropriate images with rekognition
          rekognition.detectModerationLabels(params, (err, data) => {
            if (err) {
              throw new Error(err);
            }
            if (data.ModerationLabels.length > 0) {
              return reject("Image not allowed");
            } else {
              const path = file.path ? `${file.path}/` : "";
              S3.upload(
                {
                  Key: `${path}${file.hash}${file.ext}`,
                  Body: Buffer.from(file.buffer, "binary"),
                  ACL: "public-read",
                  ContentType: file.mime,
                  ...customParams,
                },
                (err, data) => {
                  if (err) {
                    return reject(err);
                  }
                  // set the bucket file url
                  file.url = data.Location;
                  resolve();
                }
              );
            }
          });
        });
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          // delete file on S3 bucket
          const path = file.path ? `${file.path}/` : "";
          S3.deleteObject(
            {
              Key: `${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err);
              }
              resolve();
            }
          );
        });
      },
    };
  },
};
