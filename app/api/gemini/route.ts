import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { history, message } = await req.json();
    if (!history){
        return NextResponse.json(
            { success: false, message: "Chat history is required" },
            { status: 500 }
        );
    }
    if (!message){
        return NextResponse.json(
            { success: false, message: "Prompt is required" },
            { status: 500 }
        );
    }

    // @ts-ignore
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;

    const data = response.text();
    if (!data){
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while generating the response",
            },
        { status: 500 }
        );
    }

    return NextResponse.json(
      { success: true, data, message: "Response generated" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
