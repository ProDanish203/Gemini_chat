"use client";
import { Button } from "@/components/ui/button";
import { convertImage } from "@/lib/convertImage";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

interface ChatItem {
  role: string;
  parts: string;
}

export default function Home() {
  const getChatHistory = (): ChatItem[] => {
    const savedHistory =
      typeof window !== "undefined" ? localStorage.getItem("chat-history") : "";
    return savedHistory ? JSON.parse(savedHistory) : [];
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<ChatItem[]>(getChatHistory());

  const handleFileChange = async (file: any) => {
    try {
      setFile(file);
      const base64Image = await convertImage(file);
      setImage(base64Image);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!prompt) return toast.error("Prompt is required");
    try {
      setLoading(true);
      const formData = new FormData();

      if (file && image) {
        // @ts-ignore
        formData.append("history", chat);
        formData.append("image", file);
        formData.append("imageType", file.type);
        formData.append("message", prompt);
      }

      const url =
        file && image
          ? `${process.env.NEXT_PUBLIC_PATH}/gemini/file`
          : `${process.env.NEXT_PUBLIC_PATH}/gemini`;

      const options = {
        method: "POST",
        body:
          file && image
            ? formData
            : JSON.stringify({
                history: chat,
                message: prompt,
              }),
      };

      const res = await fetch(url, options);
      const data = await res.json();
      
      if(data){
        setChat((prev) => {
          const updatedChat = [
            ...prev,
            {
              role: "user",
              parts: prompt,
            },
            {
              role: "model",
              parts: data.data,
            },
          ];
          localStorage.setItem("chat-history", JSON.stringify(updatedChat));
          return updatedChat;
        });
      }else{
        toast.error("Something went wrong");
      }
        
      setPrompt("");
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem("chat-history");
    toast.success("Chat history deleted");
    setChat([]);
  };

  return (
    mounted && (
      <main className="max-w-[1400px] w-full mx-auto py-10 px-4">
        <div className="w-full rounded-lg border-primary border-2 py-4 px-4  flex flex-col justify-between relative">
          {chat && chat.length > 0 && (
            <Button
              className="absolute right-2 rounded-md shadow-sm"
              variant="destructive"
              title="Clear Chat"
              onClick={clearChat}
            >
              <i className="fas fa-trash-can"></i>
            </Button>
          )}

          <div className="w-full mb-10 h-[60vh] overflow-y-auto">
            {chat &&
              chat.map((msg, idx) => (
                <div
                  className={`message ${
                    msg.role === "user" ? "message-user" : "message-model"
                  }`}
                  key={idx}
                >
                  {msg.parts}
                </div>
              ))}
            {loading && (
              <div className="message message-model">Jynx is thinking...</div>
            )}
          </div>

          <div className="w-full mt-auto flex max-md:flex-col items-end gap-5">
            <div className="mt-auto border-neutral-400 focus:border-primary outline-none border-2 rounded-lg px-4 py-1.5 w-full bg-neutral-800 text-text relative">
              <textarea
                rows={2}
                placeholder="Enter prompt"
                className="outline-none rounded-lg w-full bg-transparent resize-none"
                value={prompt}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setPrompt(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              ></textarea>
              {/* <div>
                <label
                  htmlFor="image"
                  className="absolute top-2 sm:right-3 right-2 rounded-md shadow-sm"
                  title="Upload Image"
                >
                  <i className="fas fa-image text-xl"></i>
                </label>
                <input
                  type="file"
                  accept=""
                  id="image"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target?.files?.[0])}
                />
              </div> */}
            </div>

            <Button
              disabled={loading || !prompt}
              onClick={handleSubmit}
              variant="default"
              className="disabled:opacity-85 disabled:cursor-not-allowed text-text px-10 py-2 rounded-md max-md:w-full"
            >
              {loading ? "Generating..." : "Send"}
            </Button>
          </div>
        </div>
      </main>
    )
  );
}
