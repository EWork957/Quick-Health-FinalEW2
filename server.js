const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const PORT = 3000;
app.use(cors());

// Define the accessToken variable
let accessToken = '';

// Load the service account key JSON file
const serviceAccount = require('./health-chatbot-420906-6ed90db7e5d8.json');

// Extract private key and client email from the JSON
const privateKey = serviceAccount.private_key;
const clientEmail = serviceAccount.client_email;

// Configure the GoogleAuth client
const auth = new GoogleAuth({
  credentials: {
    private_key: privateKey,
    client_email: clientEmail
  },
  scopes: ['https://www.googleapis.com/auth/dialogflow']
});

// Obtain an access token using the Google Auth library
auth.getAccessToken()
  .then(token => {
    // Assign the obtained access token to the accessToken variable
    accessToken = token;
    // Log the access token for debugging purposes
    console.log('Access Token:', accessToken);
  })
  .catch(err => {
    console.error('Error obtaining access token:', err);
  });

// Middleware
app.use(express.json());
app.use(cors());

// Function to send the question to Dialogflow
async function sendToDialogflow(question, accessToken) {
  const projectId = 'health-chatbot-420906';
  const sessionId = '135246';
  const languageCode = 'en-US';

  const url = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;

  const requestBody = {
    queryInput: {
      text: {
        text: question,
        languageCode: languageCode,
      },
    },
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await axios.post(url, requestBody, config);
    return response.data;
  } catch (error) {
    console.error('Error sending request to Dialogflow:', error);
    throw new Error('Failed to send request to Dialogflow');
  }
}

// Handle POST requests to /webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const question = req.body.question;
    if (!question) {
      throw new Error('Question is required');
    }

    // Send the question to Dialogflow using the accessToken
    const dialogflowResponse = await sendToDialogflow(question, accessToken);

    // Extract the response from Dialogflow
    const fulfillmentText = dialogflowResponse.queryResult.fulfillmentText;

    // Send the response back to the client
    res.status(200).json({ response: fulfillmentText });
  } catch (error) {
    console.error('Error handling webhook request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
