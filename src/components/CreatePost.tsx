// src/components/CreatePost.tsx

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Paperclip, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/store/hooks";

type PreviewFile = {
  file: File;
  preview: string;
};

export default function CreatePost() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const user = useAppSelector((state) => state.registration);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      files.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, [files]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    const newPreviews: PreviewFile[] = [];

    picked.forEach((f) => {
      // avoid dup by name+size
      if (!files.some((pf) => pf.file.name === f.name && pf.file.size === f.size)) {
        const preview = URL.createObjectURL(f);
        newPreviews.push({ file: f, preview });
      }
    });

    setFiles((prev) => [...prev, ...newPreviews]);

    // clear input so same file can be re-picked
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      const removed = prev[idx];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && files.length === 0) {
      return toast({
        title: "Add something",
        description: "Please enter text or attach a file before posting.",
        variant: "destructive",
      });
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const form = new FormData();
      form.append("content", content);
      files.forEach(({ file }) => form.append("files", file));

      const res = await fetch(
        "http://localhost:8080/api/v1/posts/create-post",
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast({ title: "Posted!", description: "Your post is live." });
        setContent("");
        // revoke previews
        files.forEach(({ preview }) => URL.revokeObjectURL(preview));
        setFiles([]);
        setOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create post.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Network Error",
        description: "Could not reach the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="bg-white/90 backdrop-blur-sm shadow rounded-lg px-6 py-4 cursor-pointer hover:bg-slate-100 transition">
          <div className="flex items-center space-x-3 text-slate-600">
            <User className="w-6 h-6" />
            <span className="text-base">What&#39;s on your mind?</span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg sm:mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <DialogHeader className="relative border-b px-6 py-4">
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>Share something with your network</DialogDescription>
          <DialogClose asChild>
            <button className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <X className="w-4 h-4" />
            </button>
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <User className="w-8 h-8 text-slate-500 mt-1" />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="flex-1 h-24 p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label
                className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-5 h-5" />
                <span>Add Media</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Posting…</span>
                  </>
                ) : (
                  <span>Post</span>
                )}
              </Button>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {files.map(({ preview, file }, i) => (
                  <div key={i} className="relative">
                    {file.type.startsWith("video/") ? (
                      <video
                        src={preview}
                        className="w-full h-24 object-cover rounded-lg"
                        muted
                        loop
                        autoPlay
                      />
                    ) : (
                      <img
                        src={preview}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
