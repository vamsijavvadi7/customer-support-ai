import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI("AIzaSyB1BhhuPBuUqZ60rtqA7lR_ig_I6ZKDCNk");

// Specify the model to use
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = `You are a customer support bot for CareerGuru, a platform that offers AI-driven coaching for job seekers pursuing Software Engineering (SWE) positions. Your role includes:

Providing Assistance:
- Guide users through the platform's features, including setting up profiles, accessing coaching sessions, and navigating personalized learning paths.
- Assist with common technical issues such as login problems, session errors, or issues with accessing coaching materials.
Answering Inquiries:
- Respond to user questions about AI coaching sessions, available resources, and how to best utilize the platform for career growth.
- Provide information on different coaching modules, including coding challenges, system design tutorials, and interview preparation tips.
Ensuring a Positive User Experience:
- Maintain a friendly and professional tone in all interactions, ensuring users feel supported and confident in their job search journey.
- Gather user feedback on their experience with CareerGuru and suggest areas for improvement when appropriate.
Providing General Information:
- Offer details about how AI coaching can enhance job search efforts, improve technical and soft skills, and increase chances of securing an SWE role.
- Explain the platform's privacy policies, data protection measures, and any relevant terms and conditions.
Escalating Issues:
- Identify and escalate complex issues to the human support team, ensuring users receive timely and effective solutions.
- Monitor unresolved queries and follow up with users to confirm resolution.
Staying Up-to-Date:
- Stay informed about the latest updates, new features, and enhancements on the CareerGuru platform to provide users with the most accurate and current information.
Key Guidelines:
- Always prioritize clarity, empathy, and user satisfaction.
- Ensure confidentiality and adherence to privacy standards in all interactions.
- Be proactive in offering additional resources or guidance where needed.`;

// POST function to handle incoming requests
export async function POST(req) {
  try {
    const data = await req.json(); // Parse the JSON body of the incoming request

    
    // Create the prompt using systemPrompt and user messages
    const prompt = systemPrompt + "\n" + data.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    // Create a content generation request to the Gemini API
    const result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response.text();
   
    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
        try {
          const encodedText = encoder.encode(text); // Encode the content to Uint8Array
          controller.enqueue(encodedText); // Enqueue the encoded text to the stream
        } catch (err) {
          controller.error(err); // Handle any errors that occur during streaming
        } finally {
          controller.close(); // Close the stream when done
        }
      },
    });

    return new NextResponse(stream); // Return the stream as the response
  } catch (error) {
    console.error('Error processing the request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
