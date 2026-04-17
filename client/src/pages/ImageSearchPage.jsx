import ImageSearch from '../components/ImageSearch';

export default function ImageSearchPage() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-50">📷 Visual Product Search</h1>
          <p className="text-surface-400 mt-1">
            Upload an image to find similar products using Google Vision AI
          </p>
        </div>

        <ImageSearch />
      </div>
    </div>
  );
}
