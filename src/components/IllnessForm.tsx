
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ImageIcon, Upload } from "lucide-react";

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: "Symptoms must be at least 10 characters.",
  }),
  duration: z.string().min(1, {
    message: "Please specify how long you've had these symptoms.",
  }),
  severity: z.string().min(1, {
    message: "Please rate the severity of your symptoms.",
  }),
});

const IllnessForm = ({ onSubmit }: { onSubmit: (data: any) => void }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
      duration: "",
      severity: "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('symptoms', data.symptoms);
    formData.append('duration', data.duration);
    formData.append('severity', data.severity);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    onSubmit(formData);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Tell Us About Your Symptoms
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Medical Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="mx-auto h-32 w-auto" />
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Upload a file</span>
                    <input 
                      type="file" 
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="symptoms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What symptoms are you experiencing?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your symptoms in detail..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How long have you had these symptoms?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., 3 days, 1 week..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How severe are your symptoms?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rate from 1-10..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default IllnessForm;
