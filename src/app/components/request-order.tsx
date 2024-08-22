"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemeProvider } from "./theme-provider";
import { submitForm } from "../../lib/actions";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().optional(),
  selectedTypes: z.array(z.string()).min(1, {
    message: "At least one clothing type must be selected.",
  }),
  details: z.string().optional(),

  logo: z.instanceof(File).optional(),
});

export function RequestOrder() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      selectedTypes: [],
      details: "",
      logo: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(values);
    await submitForm(values);
    setLoading(false);
  }

  const handleTypeToggle = (type: string) => {
    const { selectedTypes } = form.getValues();
    if (selectedTypes.includes(type)) {
      form.setValue(
        "selectedTypes",
        selectedTypes.filter((t) => t !== type)
      );
    } else {
      form.setValue("selectedTypes", [...selectedTypes, type]);
    }
  };
  
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      form.setValue("logo", event.target.files[0]);
    } else {
      form.setValue("logo", undefined);
    }

  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Request Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DialogHeader>
            <DialogTitle className="text-xl">
              Request Order?
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jane@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="123-456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selectedTypes"
                render={() => (
                  <FormItem>
                    <FormLabel>Clothing</FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTypeToggle("hoodies")}
                          className={
                            form.getValues().selectedTypes.includes("hoodies")
                              ? "bg-black text-white"
                              : "bg-gray-200"
                          }
                        >
                          Hoodies
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTypeToggle("crewneck")}
                          className={
                            form.getValues().selectedTypes.includes("crewneck")
                              ? "bg-black text-white"
                              : "bg-gray-200"
                          }
                        >
                          Crewneck
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTypeToggle("tshirts")}
                          className={
                            form.getValues().selectedTypes.includes("tshirts")
                              ? "bg-black text-white"
                              : "bg-gray-200"
                          }
                        >
                          Tshirts
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleTypeToggle("sweatpants")}
                          className={
                            form.getValues().selectedTypes.includes("sweatpants")
                              ? "bg-black text-white"
                              : "bg-gray-200"
                          }
                        >
                          Sweatpants
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter details about clothes here (type of clothing, quantity, etc)."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={() => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <label className="block w-full relative h-10">
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png, .gif"
                          onChange={handleLogoChange}
                          className="absolute opacity-0 z-0 w-full h-full cursor-pointer"
                        />
                        <Button type="button" variant="default" className="w-full h-full bg-gray-500">
                          {form.getValues().logo ? (
                            <span>File Selected: {form.getValues().logo?.name}</span>
                          ) : (
                            <span>Choose File</span>
                          )}
                        </Button>
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading ? (
                <Button disabled>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" className="bg-black text-white">
                  Submit
                </Button>
              )}
            </form>
          </Form>
        </ThemeProvider>
      </DialogContent>
    </Dialog>
  );
}
