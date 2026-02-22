import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import FormContainer from "@/components/layout/FormContainer";
import StepProgressBar from "@/components/form/StepProgressBar";
import FormSectionCard from "@/components/form/FormSectionCard";
import InputField from "@/components/form/InputField";
import TextAreaField from "@/components/form/TextAreaField";
import SelectField from "@/components/form/SelectField";
import CheckboxField from "@/components/form/CheckboxField";
import FileUploadField from "@/components/form/FileUploadField";
import { useLocalStoragePersistence } from "@/hooks/useFormHelpers";
import {
  fullFormSchema,
  stepFields,
  stepTitles,
  DEPARTMENTS,
  type StudentFormData,
} from "@/schemas/studentFormSchema";
import { FILE_LIMITS } from "@/utils/validation";
import { Loader2 } from "lucide-react";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const NATIONALITY_OPTIONS = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Argentine",
  "Australian",
  "Bangladeshi",
  "Brazilian",
  "British",
  "Canadian",
  "Chinese",
  "Colombian",
  "Egyptian",
  "Ethiopian",
  "Filipino",
  "French",
  "German",
  "Ghanaian",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Italian",
  "Japanese",
  "Kenyan",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Nigerian",
  "Pakistani",
  "Polish",
  "Rwanda",
  "Russian",
  "Saudi",
  "South African",
  "South Korean",
  "Spanish",
  "Sudanese",
  "Swedish",
  "Tanzanian",
  "Thai",
  "Turkish",
  "Ugandan",
  "Ukrainian",
  "Vietnamese",
  "Zambian",
  "Zimbabwean",
].map((n) => ({ value: n.toLowerCase(), label: n }));

const COUNTRY_OPTIONS = [
  "Afghanistan",
  "Algeria",
  "Argentina",
  "Australia",
  "Bangladesh",
  "Brazil",
  "Canada",
  "China",
  "Colombia",
  "Egypt",
  "Ethiopia",
  "France",
  "Germany",
  "Ghana",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Nigeria",
  "Pakistan",
  "Philippines",
  "Poland",
  "Rwanda",
  "Russia",
  "Saudi Arabia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sudan",
  "Sweden",
  "Tanzania",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Zambia",
  "Zimbabwe",
].map((c) => ({ value: c.toLowerCase().replace(/\s+/g, "-"), label: c }));

const EDUCATION_LEVELS = [
  { value: "high-school", label: "High School / Secondary" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelors", label: "Bachelor's Degree" },
  { value: "masters", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate / PhD" },
];

const YEAR_OPTIONS = Array.from({ length: 30 }, (_, i) => {
  const year = String(new Date().getFullYear() - i);
  return { value: year, label: year };
});

const STUDY_MODE_OPTIONS = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
];

const INTAKE_OPTIONS = [
  { value: "january", label: "January" },
  { value: "may", label: "May" },
  { value: "september", label: "September" },
];

const RELATIONSHIP_OPTIONS = [
  { value: "parent", label: "Parent" },
  { value: "guardian", label: "Guardian" },
  { value: "spouse", label: "Spouse" },
  { value: "sibling", label: "Sibling" },
  { value: "other", label: "Other" },
];

export default function StudentApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<StudentFormData>({
    resolver: zodResolver(fullFormSchema) as any,
    shouldUnregister: false,
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      nationalId: "",
      email: "",
      phone: "",
      altPhone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      highestLevel: "",
      schoolName: "",
      graduationYear: "",
      gpa: "",
      department: "",
      program: "",
      studyMode: "",
      intake: "",
      personalStatement: "",
      extracurricular: "",
      scholarshipNeeded: false,
      disabilitySupport: "",
      emergencyName: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      declaration: false,
      digitalSignature: "",
      declarationDate: new Date().toISOString().split("T")[0],
    },
    mode: "onTouched",
  });

  const { clearStorage } = useLocalStoragePersistence(form, currentStep);

  const selectedDepartment = form.watch("department");
  const programOptions =
    selectedDepartment && DEPARTMENTS[selectedDepartment]
      ? DEPARTMENTS[selectedDepartment].map((p) => ({
          value: p.toLowerCase().replace(/\s+/g, "-"),
          label: p,
        }))
      : [];

  // Reset program when department changes
  useEffect(() => {
    form.setValue("program", "");
  }, [selectedDepartment, form]);

  const handleNext = async () => {
    const fields = stepFields[currentStep];

    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep((s) => Math.min(s + 1, stepTitles.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted:", data);
      toast({
        title: "Application Submitted!",
        description:
          "Your application has been received successfully. We will contact you shortly.",
      });
      clearStorage();
      form.reset();
      setCurrentStep(0);
      setCompletedSteps(new Set());
    } catch {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <FormSectionCard
            title={stepTitles[0]}
            description="Please provide your personal details."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="firstName"
                label="First Name"
                required
                placeholder="John"
              />
              <InputField
                name="middleName"
                label="Middle Name"
                placeholder="(Optional)"
              />
              <InputField
                name="lastName"
                label="Last Name"
                required
                placeholder="Doe"
              />
              <InputField
                name="dateOfBirth"
                label="Date of Birth"
                type="date"
                required
              />
              <SelectField
                name="gender"
                label="Gender"
                options={GENDER_OPTIONS}
                required
              />
              <SelectField
                name="nationality"
                label="Nationality"
                options={NATIONALITY_OPTIONS}
                required
              />
            </div>
            <InputField
              name="nationalId"
              label="National ID / Passport Number"
              required
              placeholder="e.g. AB1234567"
            />
            <FileUploadField
              name="profilePhoto"
              label="Profile Photo"
              accept="image/jpeg,image/png,image/webp"
              maxSize={FILE_LIMITS.profilePhoto.maxSize}
              allowedTypes={FILE_LIMITS.profilePhoto.types}
              description={FILE_LIMITS.profilePhoto.label}
            />
          </FormSectionCard>
        );

      case 1:
        return (
          <FormSectionCard
            title={stepTitles[1]}
            description="How can we reach you?"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="email"
                label="Email Address"
                type="email"
                required
                placeholder="john@example.com"
              />
              <InputField
                name="phone"
                label="Phone Number"
                required
                placeholder="+1 234 567 8900"
              />
              <InputField
                name="altPhone"
                label="Alternative Phone"
                placeholder="(Optional)"
              />
              <InputField
                name="postalCode"
                label="Postal Code"
                placeholder="(Optional)"
              />
            </div>
            <InputField
              name="address"
              label="Street Address"
              required
              placeholder="123 Main Street"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                name="city"
                label="City"
                required
                placeholder="New York"
              />
              <InputField
                name="state"
                label="State / Province"
                required
                placeholder="NY"
              />
              <SelectField
                name="country"
                label="Country"
                options={COUNTRY_OPTIONS}
                required
              />
            </div>
          </FormSectionCard>
        );

      case 2:
        return (
          <FormSectionCard
            title={stepTitles[2]}
            description="Tell us about your educational background."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                name="highestLevel"
                label="Highest Education Level"
                options={EDUCATION_LEVELS}
                required
              />
              <InputField
                name="schoolName"
                label="School / Institution Name"
                required
                placeholder="Harvard University"
              />
              <SelectField
                name="graduationYear"
                label="Year of Graduation"
                options={YEAR_OPTIONS}
                required
              />
              <InputField
                name="gpa"
                label="GPA / Grade"
                placeholder="(Optional) e.g. 3.8"
              />
            </div>
            <FileUploadField
              name="transcript"
              label="Transcript Upload"
              accept="application/pdf"
              maxSize={FILE_LIMITS.transcript.maxSize}
              allowedTypes={FILE_LIMITS.transcript.types}
              description={FILE_LIMITS.transcript.label}
            />
          </FormSectionCard>
        );

      case 3:
        return (
          <FormSectionCard
            title={stepTitles[3]}
            description="Choose your desired program of study."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                name="department"
                label="Department"
                options={Object.keys(DEPARTMENTS).map((d) => ({
                  value: d,
                  label: d,
                }))}
                required
              />
              <SelectField
                name="program"
                label="Program"
                options={programOptions}
                required
                disabled={!selectedDepartment}
                placeholder={
                  selectedDepartment
                    ? "Select program..."
                    : "Select department first"
                }
              />
              <SelectField
                name="studyMode"
                label="Study Mode"
                options={STUDY_MODE_OPTIONS}
                required
              />
              <SelectField
                name="intake"
                label="Preferred Intake"
                options={INTAKE_OPTIONS}
                required
              />
            </div>
          </FormSectionCard>
        );

      case 4:
        return (
          <FormSectionCard
            title={stepTitles[4]}
            description="Share more about yourself."
          >
            <TextAreaField
              name="personalStatement"
              label="Personal Statement"
              required
              maxWords={500}
              placeholder="Tell us about your motivation, goals, and why you are applying to this program..."
              rows={6}
            />
            <TextAreaField
              name="extracurricular"
              label="Extracurricular Activities"
              placeholder="(Optional) List any clubs, sports, volunteer work, or hobbies..."
              rows={4}
            />
            <CheckboxField
              name="scholarshipNeeded"
              label="I would like to be considered for a scholarship"
            />
            <InputField
              name="disabilitySupport"
              label="Disability Support Requirements"
              placeholder="(Optional) Describe any support you may need"
            />
          </FormSectionCard>
        );

      case 5:
        return (
          <FormSectionCard
            title={stepTitles[5]}
            description="Provide an emergency contact."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                name="emergencyName"
                label="Full Name"
                required
                placeholder="Jane Doe"
              />
              <SelectField
                name="emergencyRelationship"
                label="Relationship"
                options={RELATIONSHIP_OPTIONS}
                required
              />
            </div>
            <InputField
              name="emergencyPhone"
              label="Phone Number"
              required
              placeholder="+1 234 567 8900"
            />
          </FormSectionCard>
        );

      case 6:
        return (
          <FormSectionCard
            title={stepTitles[6]}
            description="Please review and confirm your application."
          >
            <CheckboxField
              name="declaration"
              label="I confirm that all the information provided in this application is accurate and complete to the best of my knowledge. I understand that providing false information may result in the rejection of my application."
              required
            />
            <InputField
              name="digitalSignature"
              label="Digital Signature (Type your full name)"
              required
              placeholder="Type your full legal name"
            />
            <InputField
              name="declarationDate"
              label="Date"
              type="date"
              disabled
            />
          </FormSectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <FormContainer>
      <StepProgressBar
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-2"
            >
              Back
            </Button>

            {currentStep < stepTitles.length - 1 ? (
              <Button type="button" onClick={handleNext} className="px-6 py-2">
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2"
                onClick={() => {
                  console.log("Form errors:", form.formState.errors);
                  console.log("Form values:", form.getValues());
                }}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </FormContainer>
  );
}
