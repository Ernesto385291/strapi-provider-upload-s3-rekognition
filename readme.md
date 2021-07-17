# strapi-provider-upload-aws-s3-with-rekognition

AWS S3 provider for Strapi upload with rekognition helps you to detect and prevent inappropriate images. This project is an adaptation from strapi-provider-upload-aws-s3

## Configuration

**Example**

`./config/plugins.js`

```js
module.exports = ({ env }) => ({
  // ...
  upload: {
    provider: "aws-s3-with-rekognition",
    providerOptions: {
      s3AccessKeyId: env("AWS_S3_ACCESS_KEY_ID"),
      s3SecretAccessKey: env("AWS_S3_SECRET_ACCESS_KEY_ID"),
      rekognitionAccessKeyId: env("AWS_REKOGNITION_ACCESS_KEY_ID"),
      rekognitionSecretAccessKey: env("AWS_REKOGNITION_SECRET_ACCESS_KEY_ID"),
      region: env("AWS_REGION"),
      bucket: env("AWS_BUCKET"),
    },
  },
  // ...
});
```
