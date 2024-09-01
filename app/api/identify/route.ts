import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const image = data.get('image') as File;

  if (!image) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Identify this plant and provide its name, a brief description, and basic care instructions. Format your response as follows: 'Name: [plant name]\n\nDescription: [brief description]\n\nCare Instructions: [basic care instructions]'";

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image.type,
          data: Buffer.from(await image.arrayBuffer()).toString('base64')
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the text response
    const nameMatch = text.match(/Name: (.+)/);
    const descriptionMatch = text.match(/Description: (.+)/s);
    const careInstructionsMatch = text.match(/Care Instructions: (.+)/s);

    const name = nameMatch ? nameMatch[1].trim() : "Unknown Plant";
    const description = descriptionMatch ? descriptionMatch[1].trim() : "No description available.";
    const careInstructions = careInstructionsMatch ? careInstructionsMatch[1].trim() : "No care instructions available.";

    return NextResponse.json({ name, description, careInstructions });
  } catch (error) {
    console.error('Error identifying plant:', error);
    return NextResponse.json({ error: 'Failed to identify plant' }, { status: 500 });
  }
}