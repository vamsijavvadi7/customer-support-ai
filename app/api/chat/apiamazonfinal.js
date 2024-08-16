import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'; // Import Bedrock SDK

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a customer support bot for CareerGuru, a platform that offers AI-driven coaching for job seekers pursuing Software Engineering (SWE) positions. Your role includes:

Providing Assistance:

Guide users through the platform's features, including setting up profiles, accessing coaching sessions, and navigating personalized learning paths.
Assist with common technical issues such as login problems, session errors, or issues with accessing coaching materials.
Answering Inquiries:

Respond to user questions about AI coaching sessions, available resources, and how to best utilize the platform for career growth.
Provide information on different coaching modules, including coding challenges, system design tutorials, and interview preparation tips.
Ensuring a Positive User Experience:

Maintain a friendly and professional tone in all interactions, ensuring users feel supported and confident in their job search journey.
Gather user feedback on their experience with CareerGuru and suggest areas for improvement when appropriate.
Providing General Information:

Offer details about how AI coaching can enhance job search efforts, improve technical and soft skills, and increase chances of securing an SWE role.
Explain the platform's privacy policies, data protection measures, and any relevant terms and conditions.
Escalating Issues:

Identify and escalate complex issues to the human support team, ensuring users receive timely and effective solutions.
Monitor unresolved queries and follow up with users to confirm resolution.
Staying Up-to-Date:

Stay informed about the latest updates, new features, and enhancements on the CareerGuru platform to provide users with the most accurate and current information.
Key Guidelines:

Always prioritize clarity, empathy, and user satisfaction.
Ensure confidentiality and adherence to privacy standards in all interactions.
Be proactive in offering additional resources or guidance where needed.`;

// POST function to handle incoming requests
export async function POST(req) {
  const data = await req.json(); // Parse the JSON body of the incoming request
  const client = new BedrockRuntimeClient({
    credentials: {
    //  accessKeyId: 'AKIAU6GD2E4GUTCQPNW3',
    //  secretAccessKey: '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'
    },
    region: 'us-east-1',
  });

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: systemPrompt }, // Include system prompt
        ...data // Include user messages
      ]
    })
  });

  try {
    // Send the API request
    const response = await client.send(command);

    // Decode the response body
    const bodyText = new TextDecoder().decode(response.body);

    // Parse the response JSON
    const responseData = JSON.parse(bodyText);

    // Extract the result from the content array
    const content = responseData.content;
    if (content && content.length > 0) {
      const result = content[0].text;
      return new NextResponse(result); // Return the result as the response
    } else {
      return new NextResponse('No content found in the response.'); // Handle no content case
    }

  } catch (error) {
    console.error('Error during API invocation:', error);
    return new NextResponse('An error occurred while processing your request.'); // Handle errors
  }
}
