import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Bed, Bath, Maximize, Edit, Trash } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';
import { formatCurrency } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: 'available' | 'rented' | 'maintenance';
  imageUrl: string;
}

interface PropertyCardProps {
  property: Property;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete
}) => {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    rented: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-amber-100 text-amber-800'
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative">
        <OptimizedImage
          src={property.imageUrl}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <span 
          className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[property.status]
          }`}
        >
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </span>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{property.title}</CardTitle>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.address}</span>
            </div>
          </div>
          <p className="text-xl font-bold">
            {formatCurrency(property.price)}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center text-muted-foreground">
            <Bed className="h-4 w-4 mr-2" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Bath className="h-4 w-4 mr-2" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Maximize className="h-4 w-4 mr-2" />
            <span>{property.area} ft²</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex justify-between w-full">
          <Button variant="outline" onClick={() => onEdit?.(property.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            className="text-destructive" 
            onClick={() => onDelete?.(property.id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};