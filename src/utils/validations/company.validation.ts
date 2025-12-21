import { z } from "zod";

// Company name validation
const companyNameSchema = z
  .string()
  .min(1, "Company name is required.")
  .min(2, "Company name must be at least 2 characters.")
  .max(100, "Company name cannot exceed 100 characters.")
  .regex(/^[\p{L}0-9\s&.,'()\/:\-+]+$/u, "Company name contains invalid characters.")
  .trim();

// Website URL validation
const websiteSchema = z
  .string()
  .min(1, "Website is required.")
  .url("Please enter a valid website URL.")
  .regex(/^https?:\/\//, "Website must start with http:// or https://")
  .max(200, "Website URL cannot exceed 200 characters.");

// Address validation
const addressSchema = z
  .string()
  .min(1, "Address is required.")
  .min(10, "Address must be at least 10 characters.")
  .max(200, "Address cannot exceed 200 characters.")
  .trim();

// Tax code validation
// Acceptable formats:
// - 10 digits (standard company/personal tax code)
// - 12 digits (personal ID replacement from 01/07/2025)
// - 13 digits (branch), either as 13 continuous digits or as 10-3 with a hyphen after the 10th digit
const taxCodeSchema = z
  .string()
  .min(1, "Tax code is required.")
  .regex(/^(?:\d{10}|\d{12}|\d{13}|\d{10}-\d{3})$/, "Tax code must be 10, 12, or 13 digits (optional hyphen after 10 digits, e.g. 1234567890-001).")
  .trim();

// Description validation
const descriptionSchema = z
  .string()
  .min(1, "Description is required.")
  .min(20, "Description must be at least 20 characters.")
  .max(1000, "Description cannot exceed 1000 characters.")
  .trim();

// Document type validation
const documentTypeSchema = z
  .string()
  .min(1, "Document type is required.")
  .min(3, "Document type must be at least 3 characters.")
  .max(50, "Document type cannot exceed 50 characters.")
  .regex(/^[\p{L}0-9\s&.,'()\/:\-+]+$/u, "Document type contains invalid characters.")
  .trim();

// File validation (for client-side validation)
const fileValidationSchema = z.custom<File>((file) => {
  if (!file || !(file instanceof File)) {
    return false;
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return false;
  }
  
  // Check file type
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ];
  
  return allowedTypes.includes(file.type);
}, {
  message: "File must be PDF, JPG, or PNG format and less than 10MB."
});

// Document validation schema
const documentSchema = z.object({
  type: documentTypeSchema,
  file: fileValidationSchema,
});

// Main company form validation schema
export const companyFormSchema = z.object({
  name: companyNameSchema,
  website: websiteSchema,
  address: addressSchema,
  taxCode: taxCodeSchema,
  description: descriptionSchema,
  documents: z
    .array(documentSchema)
    .min(1, "At least one document is required.")
    .max(10, "Maximum 10 documents allowed."),
});

// Logo file validation
export const logoFileSchema = z.custom<File>((file) => {
  if (!file || !(file instanceof File)) {
    return false;
  }
  
  // Check file size (max 5MB for logo)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return false;
  }
  
  // Check file type (only images for logo)
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ];
  
  return allowedTypes.includes(file.type);
}, {
  message: "Logo must be JPG, PNG, or WebP format and less than 5MB."
});

// Individual field validators for real-time validation
export const validateCompanyName = (value: string) => {
  try {
    companyNameSchema.parse(value);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid company name" };
  }
};

export const validateWebsite = (value: string) => {
  try {
    websiteSchema.parse(value);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid website URL" };
  }
};

export const validateTaxCode = (value: string) => {
  try {
    taxCodeSchema.parse(value);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid tax code" };
  }
};

export const validateAddress = (value: string) => {
  try {
    addressSchema.parse(value);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid address" };
  }
};

export const validateDescription = (value: string) => {
  try {
    descriptionSchema.parse(value);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid description" };
  }
};

export const validateDocumentType = (value: string) => {
  try {
    documentTypeSchema.parse(value);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid document type" };
  }
};

export const validateFile = (file: File) => {
  try {
    fileValidationSchema.parse(file);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid file" };
  }
};

export const validateLogoFile = (file: File) => {
  try {
    logoFileSchema.parse(file);
    return { isValid: true, message: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, message: error.issues[0].message };
    }
    return { isValid: false, message: "Invalid logo file" };
  }
};