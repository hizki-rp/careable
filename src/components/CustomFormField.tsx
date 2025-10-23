'use client'
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { type CustomFormFieldProps, FormFieldType } from '@/lib/types';
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { Calendar } from './ui/calendar';
import Image from 'next/image';

const RenderField = ({ field, props }: { field: any; props: CustomFormFieldProps }) => {
    const { fieldType, iconSrc, iconAlt, placeholder, showTimeSelect, dateFormat, renderSkeleton, children, className } = props;

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            height={24}
                            width={24}
                            alt={iconAlt || 'icon'}
                            className='ml-2'
                        />
                    )}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className="shad-input border-0"
                            disabled={props.disabled}
                        />
                    </FormControl>
                </div>
            )
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled={props.disabled}
                    />
                </FormControl>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <div className="flex rounded-md border border-dark-500 bg-dark-400">
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className='shad-input border-0'
                            disabled={props.disabled}
                        />
                    </div>
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal border-0 bg-dark-400",
                                        !field.value && "text-white"
                                    )}
                                     disabled={props.disabled}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                        format(field.value, dateFormat ?? 'PPP')
                                    ) : (
                                        <span>{placeholder}</span>
                                    )}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={props.disabled}>
                        <SelectTrigger className={cn("shad-select-trigger", className)}>
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className="shad-select-content">
                            {children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className='flex items-center gap-4'>
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={props.disabled}
                        />
                        <label htmlFor={props.name} className='checkbox-label'>
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            )
        case FormFieldType.FILE_UPLOADER:
            return (
                <div className="file-uploader">
                    <Upload className="text-green-500" size={40} />
                    <div className="mb-2 flex flex-col gap-2">
                        <h4 className="text-16-semibold">
                            <span className="text-green-500">Click to upload </span>
                            or drag and drop
                        </h4>
                        <p className="text-12-regular">
                            SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                    </div>
                </div>
            );
        default:
            return null;
    }
}

const CustomFormField = (props: CustomFormFieldProps) => {
    const { control, name, label, fieldType } = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel className="shad-input-label">{label}</FormLabel>
                    )}
                    <RenderField field={field} props={props} />
                    <FormMessage className='shad-error' />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField
