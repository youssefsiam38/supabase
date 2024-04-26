import type { ErrorCode } from './error-codes.types'

const storageErrorCodes: ErrorCode[] = [
  {
    errorCode: 'NoSuchBucket',
    description: 'The specified bucket does not exist.',
    statusCode: '404',
    resolution:
      "Verify the bucket name and ensure it exists in the system, if it exists you don't have permissions to access it.",
  },
  {
    errorCode: 'NoSuchKey',
    description: 'The specified key does not exist.',
    statusCode: '404',
    resolution:
      "Check the key name and ensure it exists in the specified bucket, if it exists you don't have permissions to access it.",
  },
  {
    errorCode: 'NoSuchUpload',
    description: 'The specified upload does not exist.',
    statusCode: '404',
    resolution: 'The uploadID provided might not exists or the Upload was previously aborted',
  },
  {
    errorCode: 'InvalidJWT',
    description: 'The provided JWT (JSON Web Token) is invalid.',
    statusCode: '401',
    resolution: 'The JWT provided might be expired or malformed, provide a valid JWT',
  },
  {
    errorCode: 'InvalidRequest',
    description: 'The request is not properly formed.',
    statusCode: '400',
    resolution:
      "Review the request parameters and structure, ensure they meet the API's requirements, the error message will provide more details",
  },
  {
    errorCode: 'TenantNotFound',
    description: 'The specified tenant does not exist.',
    statusCode: '404',
    resolution:
      'The Storage service had issues while provisioning, please [Contact Support](https://supabase.com/dashboard/support/new)',
  },
  {
    errorCode: 'EntityTooLarge',
    description: 'The entity being uploaded is too large.',
    statusCode: '413',
    resolution:
      'Verify the max-file-limit is equal or higher to the resource you are trying to upload, you can change this value on the [Project Setting](https://supabase.com/dashboard/project/_/settings/storage)',
  },
  {
    errorCode: 'InternalError',
    description: 'An internal server error occurred.',
    statusCode: '500',
    resolution:
      "Investigate server logs to identify the cause of the internal error. If you think it's a Storage error please [Contact Support](https://supabase.com/dashboard/support/new)",
  },
  {
    errorCode: 'ResourceAlreadyExists',
    description: 'The specified resource already exists.',
    statusCode: '409',
    resolution:
      'Use a different name or identifier for the resource to avoid conflicts. Use `x-upsert:true` header to overwrite the resource.',
  },
  {
    errorCode: 'InvalidBucketName',
    description: 'The specified bucket name is invalid.',
    statusCode: '400',
    resolution:
      'Ensure the bucket name follows the naming conventions and does not contain invalid characters.',
  },
  {
    errorCode: 'InvalidKey',
    description: 'The specified key is invalid.',
    statusCode: '400',
    resolution: 'Verify the key name and ensure it follows the naming conventions.',
  },
  {
    errorCode: 'InvalidRange',
    description: 'The specified range is not valid.',
    statusCode: '416',
    resolution:
      'Make sure that range provided is within the file size boundary and follow the [HTTP Range spec](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Range)',
  },
  {
    errorCode: 'InvalidMimeType',
    description: 'The specified MIME type is not valid.',
    statusCode: '400',
    resolution: 'Provide a valid MIME type, ensure using the standard MIME type format',
  },
  {
    errorCode: 'InvalidUploadId',
    description: 'The specified upload ID is invalid.',
    statusCode: '400',
    resolution:
      'The upload ID provided is invalid or missing. Make sure to provide a active uploadID',
  },
  {
    errorCode: 'KeyAlreadyExists',
    description: 'The specified key already exists.',
    statusCode: '409',
    resolution:
      'Use a different key name to avoid conflicts with existing keys. Use `x-upsert:true` header to overwrite the resource.',
  },
  {
    errorCode: 'BucketAlreadyExists',
    description: 'The specified bucket already exists.',
    statusCode: '409',
    resolution: 'Choose a unique name for the bucket that does not conflict with existing buckets.',
  },
  {
    errorCode: 'DatabaseTimeout',
    description: 'Timeout occurred while accessing the database.',
    statusCode: '504',
    resolution:
      'Investigate database performance and increase the default pool size. If this error still occurs please upgrade your instance',
  },
  {
    errorCode: 'InvalidSignature',
    description: 'The signature provided does not match the calculated signature.',
    statusCode: '403',
    resolution:
      'Check that you are providing the correct signature format, for more information refer to [SignatureV4](https://docs.aws.amazon.com/AmazonS3/latest/API/sig-v4-authenticating-requests.html)',
  },
  {
    errorCode: 'SignatureDoesNotMatch',
    description: 'The request signature does not match the calculated signature.',
    statusCode: '403',
    resolution:
      'Check your credentials, access key id / access secret key / region that are all correct, refer to [S3 Authentication](/docs/guides/storage/s3/authentication).',
  },
  {
    errorCode: 'AccessDenied',
    description: 'Access to the specified resource is denied.',
    statusCode: '403',
    resolution: 'Check that you have the correct RLS policy to allow access to this resource',
  },
  {
    errorCode: 'ResourceLocked',
    description: 'The specified resource is locked.',
    statusCode: '423',
    resolution:
      'This resource cannot be altered while there is a lock. Wait and try the request again',
  },
  {
    errorCode: 'DatabaseError',
    description: 'An error occurred while accessing the database.',
    statusCode: '500',
    resolution:
      'Investigate database logs and system configuration to identify and address the database error.',
  },
  {
    errorCode: 'MissingContentLength',
    description: 'The Content-Length header is missing.',
    statusCode: '411',
    resolution:
      'Ensure the Content-Length header is included in the request with the correct value.',
  },
  {
    errorCode: 'MissingParameter',
    description: 'A required parameter is missing in the request.',
    statusCode: '400',
    resolution:
      "Provide all required parameters in the request to fulfill the API's requirements. The message field will contain more details",
  },
  {
    errorCode: 'InvalidUploadSignature',
    description: 'The provided upload signature is invalid.',
    statusCode: '403',
    resolution:
      'The MultiPartUpload record was altered while the upload was ongoing, the signature do not match. Do not alter the upload record',
  },
  {
    errorCode: 'LockTimeout',
    description: 'Timeout occurred while waiting for a lock.',
    statusCode: '423',
    resolution:
      "The lock couldn't be acquired within the specified timeout. Wait and try the request again",
  },
  {
    errorCode: 'S3Error',
    description: 'An error occurred related to Amazon S3.',
    resolution:
      'Refer to Amazon S3 documentation or [Contact Support](https://supabase.com/dashboard/support/new) for assistance with resolving the S3 error.',
  },
  {
    errorCode: 'S3InvalidAccessKeyId',
    description: 'The provided AWS access key ID is invalid.',
    statusCode: '403',
    resolution: 'Verify the AWS access key ID provided and ensure it is correct and active.',
  },
  {
    errorCode: 'S3MaximumCredentialsLimit',
    description: 'The maximum number of credentials has been reached.',
    statusCode: '400',
    resolution: 'The maximum limit of credentials is reached.',
  },
  {
    errorCode: 'InvalidChecksum',
    description: 'The checksum of the entity does not match.',
    statusCode: '400',
    resolution:
      'Recalculate the checksum of the entity and ensure it matches the one provided in the request.',
  },
  {
    errorCode: 'MissingPart',
    description: 'A part of the entity is missing.',
    statusCode: '400',
    resolution:
      'Ensure all parts of the entity are included in the request before completing the operation.',
  },
  {
    errorCode: 'SlowDown',
    description: 'The request rate is too high and has been throttled.',
    statusCode: '503',
    resolution:
      'Reduce the request rate or implement exponential backoff and retry mechanisms to handle throttling.',
  },
]

export { storageErrorCodes }
