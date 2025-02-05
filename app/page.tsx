import ImageOptimizer from "@/components/image-optimizer";

export default function Home() {
  return (
    <div className="min-h-screen py-8 bg-muted/10">
    <div className="container mx-auto">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Image Optimizer</h1>
        <p className="text-muted-foreground">
          Upload your images and we&apos;ll optimize them for the web. Images will be converted to WebP format and
          compressed to less than 100KB while maintaining quality.
        </p>
      </div>
      <ImageOptimizer />
    </div>
  </div>
  );
}
