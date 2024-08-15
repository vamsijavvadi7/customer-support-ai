// #Sample Code for bedrock request

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'; // ES Modules import

const client = new BedrockRuntimeClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: 'us-east-1',
});

const invoke = async () => {
  try {
    // Prepare the input for the API call
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: "What's is life?"
          }
        ]
      })
    });

    // Send the API request
    const response = await client.send(command);

    // Log the response

    // Decode the response body
    const bodyText = new TextDecoder().decode(response.body);

    // Parse the response JSON
    const responseData = JSON.parse(bodyText);

    // Log the response data

    // Extract the result from the content array
    const content = responseData.content;
    if (content && content.length > 0) {
      const result = content[0].text;
      console.log(result);
    } else {
      console.log('No content found in the response.');
    }

  } catch (error) {
    console.error('Error during API invocation:', error);
  }
};

invoke();
