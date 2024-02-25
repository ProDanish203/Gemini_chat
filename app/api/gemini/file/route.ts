import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const getFilePath = (path:any, mimeType:any) => {
    return {
        inlineData: {
            // @ts-ignore
            data: Buffer.from(fs.readdirSync(path)).toString("base64"),
            mimeType
        }
    }
}

export const POST = async (req: NextRequest) => {
  try {
    // const { history, message, image, imageType } = await req.json();
    // if (!history){
    //     return NextResponse.json(
    //         { success: false, message: "Chat history is required" },
    //         { status: 500 }
    //     );
    // }
    // if (!message){
    //     return NextResponse.json(
    //         { success: false, message: "Prompt is required" },
    //         { status: 500 }
    //     );
    // }
    // if (!image || !imageType){
    //     return NextResponse.json(
    //         { success: false, message: "Image is required" },
    //         { status: 500 }
    //     );
    // }

    const formData = await req.formData();
    const message = formData.get("message");
    const image = formData.get("image");
    const imageType = formData.get("imageType");

    const imagePath = getFilePath(image, imageType)
    console.log(imagePath)

    // @ts-ignore
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const vision = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // const imageData = {
    //     data: image,
    //     mimeType: imageType
    // }

    // const result = await vision.generateContent([message, imageData]);
    // const response = await result.response;
    // const data = response.text();
    // console.log(response)

    // if (!data){
    //     return NextResponse.json(
    //         {
    //             success: false,
    //             message: "Something went wrong while generating the response",
    //         },
    //     { status: 500 }
    //     );
    // }

    return NextResponse.json(
      { success: true, data: "askdjh", message: "Response generated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
};
