import { z } from "zod";
import { PATTERNS } from "@/utils/validation";

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "Max 50 characters"),
  middleName: z.string().trim().max(50).optional().or(z.literal("")),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Max 50 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  nationalId: z
    .string()
    .min(1, "National ID / Passport is required")
    .regex(
      PATTERNS.nationalId,
      "Invalid ID format (5-30 alphanumeric characters)",
    ),
});

export const contactInfoSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(PATTERNS.phone, "Invalid phone number"),
  altPhone: z
    .string()
    .regex(PATTERNS.phone, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(200, "Max 200 characters"),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State / Province is required").max(100),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().max(20).optional().or(z.literal("")),
});

export const academicSchema = z.object({
  highestLevel: z.string().nonempty("Education level is required").default(""),
  graduationYear: z
    .string()
    .nonempty("Graduation year is required")
    .default(""),
  schoolName: z.string().trim().min(1, "School name is required").max(200),

  gpa: z.string().max(10).optional().or(z.literal("")),
});

export const programSchema = z.object({
  department: z.string().min(1, "Department is required"),
  program: z.string().min(1, "Program is required"),
  studyMode: z.string().min(1, "Study mode is required"),
  intake: z.string().min(1, "Preferred intake is required"),
});

export const additionalSchema = z.object({
  personalStatement: z
    .string()
    .trim()
    .min(1, "Personal statement is required")
    .max(3000, "Too long"),
  extracurricular: z.string().max(1000).optional().or(z.literal("")),
  scholarshipNeeded: z.boolean().default(false),
  disabilitySupport: z.string().max(500).optional().or(z.literal("")),
});

export const emergencySchema = z.object({
  emergencyName: z.string().trim().min(1, "Contact name is required").max(100),
  emergencyRelationship: z.string().min(1, "Relationship is required"),
  emergencyPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(PATTERNS.phone, "Invalid phone number"),
});

export const declarationSchema = z.object({
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must accept the declaration",
  }),
  digitalSignature: z
    .string()
    .trim()
    .min(1, "Digital signature is required")
    .max(100),
  declarationDate: z.string(),
});

export const fullFormSchema = personalInfoSchema
  .merge(contactInfoSchema)
  .merge(academicSchema)
  .merge(programSchema)
  .merge(additionalSchema)
  .merge(emergencySchema)
  .merge(declarationSchema);

export type StudentFormData = z.infer<typeof fullFormSchema>;

export const stepFields: (keyof StudentFormData)[][] = [
  [
    "firstName",
    "middleName",
    "lastName",
    "dateOfBirth",
    "gender",
    "nationality",
    "nationalId",
  ],
  [
    "email",
    "phone",
    "altPhone",
    "address",
    "city",
    "state",
    "country",
    "postalCode",
  ],
  ["highestLevel", "schoolName", "graduationYear", "gpa"],
  ["department", "program", "studyMode", "intake"],
  [
    "personalStatement",
    "extracurricular",
    "scholarshipNeeded",
    "disabilitySupport",
  ],
  ["emergencyName", "emergencyRelationship", "emergencyPhone"],
  ["declaration", "digitalSignature", "declarationDate"],
];

export const stepTitles = [
  "Personal Information",
  "Contact Information",
  "Academic Background",
  "Program Selection",
  "Additional Information",
  "Emergency Contact",
  "Declaration",
];

export const DEPARTMENTS: Record<string, string[]> = {
  Engineering: [
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ],
  Business: ["Accounting", "Finance", "Marketing", "Management"],
  Sciences: ["Biology", "Chemistry", "Physics", "Mathematics"],
  "Arts & Humanities": [
    "English Literature",
    "History",
    "Philosophy",
    "Fine Arts",
  ],
  "Health Sciences": ["Nursing", "Public Health", "Pharmacy", "Medicine"],
};
