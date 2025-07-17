import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type FoldType = 'central' | 'left-right' | 'up-down';

interface LabelDesignerProps {}

interface Dimensions {
  width: number;
  height: number;
}

const LabelDesigner: React.FC<LabelDesignerProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // State management
  const [title, setTitle] = useState('Label Design');
  const [labelWidth, setLabelWidth] = useState(4);
  const [labelHeight, setLabelHeight] = useState(2);
  const [foldType, setFoldType] = useState<FoldType>('central');
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  // A4 landscape dimensions in pixels (at 96 DPI: 11.69" x 8.27")
  const A4_WIDTH = 1123;
  const A4_HEIGHT = 794;
  const DPI = 96;

  // Convert inches to pixels
  const inchesToPixels = (inches: number) => inches * DPI;

  // Calculate final dimensions based on fold type
  const calculateFinalDimensions = (): Dimensions => {
    let finalWidth = labelWidth;
    let finalHeight = labelHeight;

    switch (foldType) {
      case 'left-right':
        finalWidth += 0.5; // 0.25 inch extra on each side
        break;
      case 'up-down':
        finalHeight += 0.5; // 0.25 inch extra on top and bottom
        break;
      case 'central':
      default:
        // No change for central fold
        break;
    }

    return { width: finalWidth, height: finalHeight };
  };

  // Draw the label design on canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to A4 landscape
    canvas.width = A4_WIDTH;
    canvas.height = A4_HEIGHT;

    // Clear canvas with light gray background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, A4_WIDTH, A4_HEIGHT);

    // Calculate label dimensions in pixels
    const labelWidthPx = inchesToPixels(labelWidth);
    const labelHeightPx = inchesToPixels(labelHeight);
    const finalDims = calculateFinalDimensions();
    const finalWidthPx = inchesToPixels(finalDims.width);
    const finalHeightPx = inchesToPixels(finalDims.height);

    // Center the label on the canvas
    const labelX = (A4_WIDTH - finalWidthPx) / 2;
    const labelY = (A4_HEIGHT - finalHeightPx) / 2;

    // Draw main label outline (1pt = 1.33px at 96 DPI)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.33;
    
    // Calculate image position based on fold type
    let imageX = labelX;
    let imageY = labelY;
    let imageWidth = labelWidthPx;
    let imageHeight = labelHeightPx;

    if (foldType === 'left-right') {
      imageX = labelX + inchesToPixels(0.35); // 0.25 + 0.1 padding
      imageWidth = labelWidthPx;
      imageHeight = labelHeightPx;
    } else if (foldType === 'up-down') {
      imageY = labelY + inchesToPixels(0.35); // 0.25 + 0.1 padding
      imageWidth = labelWidthPx;
      imageHeight = labelHeightPx;
    }

    // Draw the final label boundary
    ctx.strokeRect(labelX, labelY, finalWidthPx, finalHeightPx);

    // Draw the image area
    ctx.strokeRect(imageX, imageY, imageWidth, imageHeight);

    // Draw uploaded image if available
    if (uploadedImage) {
      ctx.drawImage(uploadedImage, imageX + 2, imageY + 2, imageWidth - 4, imageHeight - 4);
    } else {
      // Draw placeholder
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(imageX + 2, imageY + 2, imageWidth - 4, imageHeight - 4);
      ctx.fillStyle = '#64748b';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Upload Image', imageX + imageWidth / 2, imageY + imageHeight / 2);
    }

    // Draw fold lines
    if (foldType === 'central') {
      const centerY = labelY + finalHeightPx / 2;
      ctx.beginPath();
      ctx.moveTo(labelX, centerY);
      ctx.lineTo(labelX + finalWidthPx, centerY);
      ctx.stroke();
    } else if (foldType === 'left-right') {
      const leftFoldX = labelX + inchesToPixels(0.25);
      const rightFoldX = labelX + finalWidthPx - inchesToPixels(0.25);
      ctx.beginPath();
      ctx.moveTo(leftFoldX, labelY);
      ctx.lineTo(leftFoldX, labelY + finalHeightPx);
      ctx.moveTo(rightFoldX, labelY);
      ctx.lineTo(rightFoldX, labelY + finalHeightPx);
      ctx.stroke();
    } else if (foldType === 'up-down') {
      const topFoldY = labelY + inchesToPixels(0.25);
      const bottomFoldY = labelY + finalHeightPx - inchesToPixels(0.25);
      ctx.beginPath();
      ctx.moveTo(labelX, topFoldY);
      ctx.lineTo(labelX + finalWidthPx, topFoldY);
      ctx.moveTo(labelX, bottomFoldY);
      ctx.lineTo(labelX + finalWidthPx, bottomFoldY);
      ctx.stroke();
    }

    // Draw title (top left)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title, 40, 55);

    // Draw dimensions (top right)
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.textAlign = 'right';
    const rightMargin = A4_WIDTH - 40;
    ctx.fillText(`Final Width: ${finalDims.width}"`, rightMargin, 30);
    ctx.fillText(`Final Height: ${finalDims.height}"`, rightMargin, 50);
    ctx.fillText(`Fold Type: ${foldType}`, rightMargin, 70);

    // Draw dimension markings in red
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 1;
    ctx.font = 'bold 12px "Courier New", monospace';

    // Width marking (bottom)
    const bottomY = labelY + finalHeightPx + 20;
    ctx.beginPath();
    ctx.moveTo(labelX, bottomY);
    ctx.lineTo(labelX + finalWidthPx, bottomY);
    ctx.moveTo(labelX, bottomY - 5);
    ctx.lineTo(labelX, bottomY + 5);
    ctx.moveTo(labelX + finalWidthPx, bottomY - 5);
    ctx.lineTo(labelX + finalWidthPx, bottomY + 5);
    ctx.stroke();
    
    ctx.textAlign = 'center';
    ctx.fillText(`${finalDims.width}"`, labelX + finalWidthPx / 2, bottomY + 20);

    // Height marking (left side)
    const leftX = labelX - 20;
    ctx.beginPath();
    ctx.moveTo(leftX, labelY);
    ctx.lineTo(leftX, labelY + finalHeightPx);
    ctx.moveTo(leftX - 5, labelY);
    ctx.lineTo(leftX + 5, labelY);
    ctx.moveTo(leftX - 5, labelY + finalHeightPx);
    ctx.lineTo(leftX + 5, labelY + finalHeightPx);
    ctx.stroke();

    ctx.save();
    ctx.translate(leftX - 15, labelY + finalHeightPx / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(`${finalDims.height}"`, 0, 0);
    ctx.restore();
  };

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const img = new Image();
    img.onload = () => {
      setUploadedImage(img);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    };
    img.src = URL.createObjectURL(file);
  };

  // Download canvas as JPEG
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_label_design.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download started",
        description: "Your label design is being downloaded.",
      });
    }, 'image/jpeg', 0.9);
  };

  // Redraw canvas when state changes
  useEffect(() => {
    drawCanvas();
  }, [title, labelWidth, labelHeight, foldType, uploadedImage]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Label Design Generator</h1>
        <p className="text-muted-foreground">Create professional label mockups for vendor specifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <Card className="lg:col-span-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Design Controls</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter label title"
              />
            </div>

            <div>
              <Label htmlFor="width">Width (inches)</Label>
              <Input
                id="width"
                type="number"
                step="0.25"
                min="0.5"
                max="10"
                value={labelWidth}
                onChange={(e) => setLabelWidth(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                step="0.25"
                min="0.5"
                max="10"
                value={labelHeight}
                onChange={(e) => setLabelHeight(Number(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="fold-type">Fold Type</Label>
              <Select value={foldType} onValueChange={(value) => setFoldType(value as FoldType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Central Fold</SelectItem>
                  <SelectItem value="left-right">Left & Right Fold</SelectItem>
                  <SelectItem value="up-down">Up & Down Fold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Upload Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full mt-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose Image
              </Button>
            </div>

            <Button onClick={downloadImage} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download JPEG
            </Button>
          </div>
        </Card>

        {/* Canvas Area */}
        <Card className="lg:col-span-3 p-6">
          <h2 className="text-xl font-semibold mb-4">A4 Landscape Preview</h2>
          <div className="border rounded-lg overflow-hidden bg-canvas-bg">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-w-full"
              style={{ display: 'block' }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LabelDesigner;