
// AWS Configuration
// Replace these values with your actual AWS resources

export const awsConfig = {
  region: "YOUR_AWS_REGION", // e.g., us-east-1
  
  // API Gateway - for HTTP APIs
  apiGateway: {
    ENDPOINT: "YOUR_API_GATEWAY_ENDPOINT", // e.g., https://xxxxxxx.execute-api.us-east-1.amazonaws.com/prod
  },
  
  // WebSocket API - for real-time communication
  webSocket: {
    ENDPOINT: "YOUR_WEBSOCKET_ENDPOINT", // e.g., wss://xxxxxxx.execute-api.us-east-1.amazonaws.com/prod
  },
  
  // Cognito - for authentication (if needed)
  cognito: {
    REGION: "YOUR_COGNITO_REGION",
    USER_POOL_ID: "YOUR_USER_POOL_ID",
    APP_CLIENT_ID: "YOUR_APP_CLIENT_ID",
    IDENTITY_POOL_ID: "YOUR_IDENTITY_POOL_ID",
  },
  
  // S3 - for file storage (if needed)
  s3: {
    BUCKET: "YOUR_S3_BUCKET_NAME",
    REGION: "YOUR_S3_REGION",
  }
};

// If we're in development mode, use mock endpoints
export const getWebSocketUrl = (): string => {
  if (process.env.NODE_ENV === "development") {
    return "ws://localhost:8080";
  }
  return awsConfig.webSocket.ENDPOINT;
};

export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000";
  }
  return awsConfig.apiGateway.ENDPOINT;
};
