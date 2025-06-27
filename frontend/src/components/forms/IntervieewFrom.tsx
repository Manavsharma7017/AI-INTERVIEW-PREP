import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InterviewSchema } from "../../utils/validation";
import { Button } from "../ui/Button";
import type { Domain } from "../../types/types";

interface InterviewFormData {
  description: string;
  domain_id: number;
}

interface InterviewFormProps {
  onSubmit: (data: InterviewFormData) => Promise<void>;
  isLoading: boolean;
  domains: Domain[];
  domainId?: number;
  onCancel?: () => void; // ✅ New optional prop
}

export const InterviewForm: React.FC<InterviewFormProps> = ({
  onSubmit,
  isLoading,
  domains,
  domainId,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewFormData>({
    resolver: zodResolver(InterviewSchema),
    defaultValues: {
      description: "",
      domain_id: domainId ?? 0,
    },
  });

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 md:px-8 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-6"
      >
        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Interview Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Enter the interview question..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Domain Dropdown */}
        <div>
          <label
            htmlFor="domain_id"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Domain
          </label>
          <select
            id="domain_id"
            {...register("domain_id", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a domain</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
          {errors.domain_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.domain_id.message}
            </p>
          )}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
            Start Session
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
