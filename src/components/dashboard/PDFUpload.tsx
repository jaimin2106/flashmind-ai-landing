import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjsLib from "pdfjs-dist";

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFUploadProps {
  onTextExtracted: (text: string, filename: string) => void;
}

export function PDFUpload({ onTextExtracted }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndProcessFile(selectedFile);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    setError(null);

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(file);
    await extractTextFromPDF(file);
  };

  const extractTextFromPDF = async (file: File) => {
    setExtracting(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      const numPages = Math.min(pdf.numPages, 50); // Limit to first 50 pages

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }

      if (!fullText.trim()) {
        setError("No text found in PDF. The file might be image-based.");
        setFile(null);
        return;
      }

      onTextExtracted(fullText, file.name);
    } catch (err) {
      console.error("PDF extraction error:", err);
      setError("Failed to extract text from PDF");
      setFile(null);
    } finally {
      setExtracting(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card
              className={`glass border-2 border-dashed transition-colors cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Upload PDF File</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Drag and drop your PDF here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB • First 50 pages will be processed
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!extracting && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeFile}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {extracting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Extracting text from PDF...
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive text-center"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
