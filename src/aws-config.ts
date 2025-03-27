
// AWS Amplify configuration for real-time updates and deployment
export const awsConfig = {
  // Replace these values with your actual AWS configuration after creating your resources
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_xxxxxxxx",
    userPoolWebClientId: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  },
  API: {
    endpoints: [
      {
        name: "trafficAPI",
        endpoint: "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod",
      },
    ],
  },
  // WebSocket configuration for real-time updates
  sockets: {
    trafficUpdates: "wss://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod",
  }
};
