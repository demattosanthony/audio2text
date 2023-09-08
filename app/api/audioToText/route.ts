import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const data: FormData = await req.formData();

    const file: File | null = data.get("file") as File; // Use File type for the file

    if (!file) {
      throw new Error("File not found in the request");
    }

    const respose = await openai.audio.translations.create({
      file,
      model: "whisper-1",
    });

    return NextResponse.json(respose);
  } catch {
    return NextResponse.error();
  }
}
