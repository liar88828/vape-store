import React from 'react';
import { ControllerRenderProps, useForm, useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"; // adjust the import path
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react"; // or your own UI
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { toast } from "sonner"
import { z } from "zod"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"

type FormHookProps = {
    name: string;
    type?: string;
    title: string;
    placeholder: string
};

export function InputHook({ name, placeholder, title, type = 'text' }: FormHookProps) {
    const { control } = useFormContext(); // retrieve control from context

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps, }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>{ title }</FormLabel>
                        <FormControl>
                            <Input
                                type={ type }
                                placeholder={ placeholder }
                                { ...field }
                                onChange={ (e) => {
                                    const { value } = e.target;

                                    if (type === "number") {
                                        field.onChange(value === "" ? undefined : Number(value));
                                    } else if (type === "date") {
                                        field.onChange(value === "" ? undefined : (value));
                                    } else if (type === "date" || type === "datetime-local") {
                                        field.onChange(value === "" ? undefined : new Date(value));
                                    } else {
                                        field.onChange(value);
                                    }
                                } }
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                ) }
            />
        </div>
    );
}

export function InputDateHook({ name, title, }: Omit<FormHookProps, 'type' | 'placeholder'>) {
    const { control } = useFormContext(); // retrieve control from context

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps, }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>{ title }</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild className={ 'w-full' }>
                                <FormControl>
                                    <Button
                                        variant={ "outline" }
                                        className={ cn(
                                            "w-full   pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        ) }
                                    >
                                        { field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        ) }
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={ field.value }
                                    onSelect={ field.onChange }
                                    disabled={ (date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage/>
                    </FormItem>
                ) }
            />
        </div>
    );
}
export function TextareaHook({ name, placeholder, title }: FormHookProps) {
    const { control } = useFormContext(); // retrieve control from context

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps }) => (
                    <FormItem className="col-span-2">
                        <FormLabel>{ title }</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={ placeholder }
                                { ...field } />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                ) }
            />
        </div>
    );
}

type SelectHookProps = {
    name: string;
    label: string;
    placeholder?: string;
    options: { label: string; value: string }[];
};

export function SelectHook({ name, label, placeholder = "Pilih...", options }: SelectHookProps) {
    const { control } = useFormContext();

    return (
        <div>
            <FormField
                control={ control }
                name={ name }
                render={ ({ field }: { field: ControllerRenderProps }) => (
                    <FormItem>
                        <FormLabel>{ label }</FormLabel>
                        <FormControl>

                            <Select
                                onValueChange={ field.onChange }
                                defaultValue={ field.value }
                                value={ field.value }
                            >
                                <SelectTrigger className={ 'w-full' }>
                                    <SelectValue placeholder={ placeholder }/>
                                </SelectTrigger>
                                <SelectContent>
                                    { options.map((option) => (
                                        <SelectItem key={ option.value } value={ option.value }>
                                            { option.label }
                                        </SelectItem>
                                    )) }
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                ) }
            />

        </div>
    );
}

