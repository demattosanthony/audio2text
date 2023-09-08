import { Dropzone } from "@/components/dropzone";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24 gap-24">
      <div className="flex items-center flex-col text-center gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Audio to Text
        </h1>

        <p className="text-xl text-muted-foreground">
          Drag and drop an audio file and get it converted to text. Max 4mb for
          now.
        </p>
      </div>

      <Dropzone />
    </main>
  );
}
