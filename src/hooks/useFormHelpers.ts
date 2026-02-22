import { useCallback, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { StudentFormData } from "@/schemas/studentFormSchema";

const STORAGE_KEY = "student_application_form";

export function useLocalStoragePersistence(
  form: UseFormReturn<StudentFormData, any, any>,
  currentStep: number,
) {
  // Load saved data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const { data } = parsed;
        if (data) {
          form.reset(data);
        }
      }
    } catch {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save whenever any field changes
  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ data: values, step: currentStep }),
        );
      } catch {
        // storage full or unavailable
      }
    });
    return () => unsubscribe();
  }, [form, currentStep]);

  // Also save when step changes
  useEffect(() => {
    try {
      const values = form.getValues();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: values, step: currentStep }),
      );
    } catch {
      // storage full or unavailable
    }
  }, [currentStep, form]);

  const clearStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getSavedStep = useCallback((): number => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.step || 0;
      }
    } catch {}
    return 0;
  }, []);

  return { clearStorage, getSavedStep };
}
