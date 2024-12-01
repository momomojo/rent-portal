import { type Property, type Application, type SearchFilters } from './validation';

interface PropertyDTO {
  id?: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: {
    amount: number;
    currency: string;
    period: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  features: string[];
  amenities: string[];
  specs: {
    beds: number;
    baths: number;
    area: number;
  };
  images: string[];
  availability: string;
  created?: string;
  updated?: string;
}

export const propertyTransformers = {
  // Transform API response to internal model
  fromAPI: (dto: PropertyDTO): Property => ({
    id: dto.id,
    title: dto.title,
    description: dto.description,
    type: dto.type as Property['type'],
    status: dto.status as Property['status'],
    price: {
      amount: dto.price.amount,
      currency: dto.price.currency,
      period: dto.price.period as Property['price']['period'],
    },
    address: {
      street: dto.location.address,
      city: dto.location.city,
      state: dto.location.state,
      zipCode: dto.location.zip,
      country: dto.location.country,
    },
    features: dto.features,
    amenities: dto.amenities,
    bedrooms: dto.specs.beds,
    bathrooms: dto.specs.baths,
    squareFeet: dto.specs.area,
    images: dto.images,
    availableFrom: dto.availability,
    createdAt: dto.created,
    updatedAt: dto.updated,
  }),

  // Transform internal model to API request
  toAPI: (property: Property): PropertyDTO => ({
    id: property.id,
    title: property.title,
    description: property.description,
    type: property.type,
    status: property.status,
    price: {
      amount: property.price.amount,
      currency: property.price.currency,
      period: property.price.period,
    },
    location: {
      address: property.address.street,
      city: property.address.city,
      state: property.address.state,
      zip: property.address.zipCode,
      country: property.address.country,
    },
    features: property.features,
    amenities: property.amenities,
    specs: {
      beds: property.bedrooms,
      baths: property.bathrooms,
      area: property.squareFeet,
    },
    images: property.images,
    availability: property.availableFrom,
    created: property.createdAt,
    updated: property.updatedAt,
  }),

  // Transform for display in property list
  toListItem: (property: Property) => ({
    id: property.id,
    title: property.title,
    type: property.type,
    price: `${property.price.currency} ${property.price.amount.toLocaleString()}/${
      property.price.period === 'monthly' ? 'mo' : 'yr'
    }`,
    location: `${property.address.city}, ${property.address.state}`,
    specs: `${property.bedrooms} beds • ${property.bathrooms} baths • ${property.squareFeet.toLocaleString()} sq ft`,
    mainImage: property.images[0],
    available: new Date(property.availableFrom).toLocaleDateString(),
  }),

  // Transform for search index
  toSearchDoc: (property: Property) => ({
    id: property.id,
    title: property.title,
    description: property.description,
    type: property.type,
    priceAmount: property.price.amount,
    pricePeriod: property.price.period,
    city: property.address.city,
    state: property.address.state,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    features: property.features.join(' '),
    amenities: property.amenities.join(' '),
    available: new Date(property.availableFrom).getTime(),
  }),
};

export const applicationTransformers = {
  // Transform application for submission
  toSubmission: (application: Application) => ({
    propertyId: application.propertyId,
    applicant: {
      name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
      dob: application.personalInfo.dateOfBirth,
      contact: {
        email: application.personalInfo.contact.email,
        phone: application.personalInfo.contact.phone,
        preferred: application.personalInfo.contact.preferredContact,
      },
    },
    employment: {
      current: {
        employer: application.employment.employer,
        position: application.employment.position,
        income: application.employment.income,
        startDate: application.employment.startDate,
      },
      verification: {
        contact: application.employment.employerContact,
      },
    },
    documents: application.documents.map(doc => ({
      type: doc.type,
      file: doc.url,
      uploadDate: doc.uploadedAt,
    })),
    references: application.references.map(ref => ({
      name: ref.name,
      relationship: ref.relationship,
      contact: ref.contact,
    })),
  }),

  // Transform application for display
  toSummary: (application: Application) => ({
    id: application.id,
    property: application.propertyId,
    applicant: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
    status: application.status,
    income: application.employment.income.toLocaleString(),
    documents: application.documents.length,
    references: application.references.length,
    submittedAt: application.createdAt,
  }),
};

export const searchTransformers = {
  // Transform search filters for API
  toAPIParams: (filters: SearchFilters) => ({
    price_min: filters.priceRange.min,
    price_max: filters.priceRange.max,
    types: filters.propertyTypes.join(','),
    beds_min: filters.bedrooms,
    baths_min: filters.bathrooms,
    amenities: filters.amenities.join(','),
    ...(filters.location && {
      lat: filters.location.latitude,
      lng: filters.location.longitude,
      radius: filters.location.radius,
    }),
    available_from: filters.availableFrom,
    sort: `${filters.sortBy}_${filters.sortOrder}`,
  }),

  // Transform API response to search results
  fromAPIResponse: (response: any[]) => 
    response.map(item => propertyTransformers.fromAPI(item)),
};
