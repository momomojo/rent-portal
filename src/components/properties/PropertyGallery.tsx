import { useState } from 'react';
import { Upload, Edit, Trash } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Property } from '../../types/property';

interface PropertyGalleryProps {
  property: Property;
  onImagesUpdate: (images: string[]) => Promise<void>;
  editable?: boolean;
}

export default function PropertyGallery({ property, onImagesUpdate, editable = false }: PropertyGalleryProps) {
  const [editing, setEditing] = useState(false);
  const [images, setImages] = useState(property.images);
  const [currentImage, setCurrentImage] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: async (acceptedFiles) => {
      // In a real app, you would upload these files to storage
      // and get back URLs. For now, we'll create object URLs
      const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
      const updatedImages = [...images, ...newImages];
      await onImagesUpdate(updatedImages);
      setImages(updatedImages);
    }
  });

  const handleRemoveImage = async (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    await onImagesUpdate(updatedImages);
    setImages(updatedImages);
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            {editing ? 'Done' : 'Edit Images'}
          </button>
        </div>
      )}

      {editing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="h-48 w-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
          <div
            {...getRootProps()}
            className="h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500"
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">Add Images</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImage]}
                alt={`Property ${currentImage + 1}`}
                className="w-full h-96 object-cover rounded-lg"
              />
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={previousImage}
                    className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                  >
                    →
                  </button>
                </div>
              )}
              <div className="mt-4 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentImage === index ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}