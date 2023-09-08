"use client";
import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import React, { useCallback, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { AlertCircle, CheckCircle, FolderIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function Dropzone() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [convertedText, setConvertedText] = useState("");
  const [copiedText, setCopiedText] = useState(false);

  function getText(file: File) {
    setUploading(true);
    let formData = new FormData();
    formData.append("file", file);

    fetch("/api/audioToText", {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      const data = await res.json();
      setConvertedText(data.text);
      setUploaded(true);
    });
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    getText(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "audio/*": [],
      },
      maxFiles: 1,
    });

  return (
    <>
      {uploaded ? (
        <div>
          <div className="flex gap-2 justify-end">
            <Button
              variant={"outline"}
              onClick={() => {
                navigator.clipboard.writeText(convertedText);
                setCopiedText(true);
                setTimeout(() => setCopiedText(false), 2000);
              }}
            >
              {copiedText ? <CheckCircle /> : <>Copy Text</>}
            </Button>
            <Button
              variant={"outline"}
              onClick={() => {
                setUploading(false);
                setUploaded(false);
              }}
            >
              Reset
            </Button>
          </div>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {convertedText}
          </p>
        </div>
      ) : (
        <>
          {!uploading ? (
            <div {...getRootProps({ className: "dropzone" })}>
              <Input {...getInputProps()} accept="application/pdf" />

              <Card
                className={`min-w-[450px] h-[300px] ${
                  isDragActive && "bg-secondary"
                }`}
              >
                <CardContent className="flex flex-col items-center mt-6">
                  <div className="flex flex-col gap-2 items-center">
                    <FolderIcon size={80} />

                    <div className="text-lg font-semibold">
                      Drag your audio file here
                    </div>
                  </div>

                  <div className="flex items-center gap-2 m-6">
                    <div className="h-1 w-24 rounded bg-gray-100" />
                    <p className="text-sm text-muted-foreground">Or</p>
                    <div className="h-1 w-24 rounded bg-gray-100" />
                  </div>

                  <Button>Select File</Button>
                </CardContent>
              </Card>

              {fileRejections.length > 0 && (
                <Alert
                  variant="destructive"
                  className="absolute bottom-4 right-4 w-auto"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Only upload audio files and one at a time.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Loader2 className="h-[100px] w-[100px] animate-spin" />
          )}
        </>
      )}
    </>
  );
}
