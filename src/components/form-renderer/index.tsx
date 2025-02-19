import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { submitForm } from '@/lib/mock-api';
import type { FormSchema, TextType } from '@/types/form';
import { getDefaultValue, isTextType } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface FormRendererProps {
	schema: FormSchema;
}

const TEXT_TYPE_PLACEHOLDERS: Record<TextType, string> = {
	text: 'Enter short response',
	paragraph: 'Enter detailed response',
	phone: 'Enter phone number',
	email: 'Enter email address',
	url: 'Enter URL',
};

export function FormRenderer({ schema }: FormRendererProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	// Dynamically generate validation schema based on form questions
	const generateValidationSchema = () => {
		const shape: Record<string, any> = {};

		schema.questions.forEach((question) => {
			if (question.hidden) return;

			let fieldSchema: any = z.string();

			if (question.type === 'text' || question.type === 'paragraph') {
				fieldSchema = z.string().min(1, 'Required');
			}

			if (question.type === 'number') {
				fieldSchema = z.number({
					required_error: 'Required',
					invalid_type_error: 'Must be a number',
				});

				if (question.validation?.min !== undefined) {
					fieldSchema = fieldSchema.min(
						question.validation.min,
						`Must be at least ${question.validation.min}`
					);
				}
				if (question.validation?.max !== undefined) {
					fieldSchema = fieldSchema.max(
						question.validation.max,
						`Must be at most ${question.validation.max}`
					);
				}
			}

			// Handle regex validation
			if (question?.validation?.regex) {
				const regexPattern = question?.validation?.regex
					? new RegExp(question.validation.regex)
					: new RegExp('.*');

				fieldSchema = z.string().regex(regexPattern, 'Invalid input');
			}

			if (question.type === 'select') {
				fieldSchema = question.selectOptions?.isMulti
					? z.array(z.string()).min(1, 'At least one option must be selected')
					: z.string().min(1, 'Please select an option');
			}

			if (question.required) {
				shape[question.id] = fieldSchema; // Enforce Required Fields
			} else {
				shape[question.id] = fieldSchema.optional(); // Make optional if not required
			}
		});

		return z.object(shape);
	};

	const form = useForm({
		resolver: zodResolver(generateValidationSchema()),
		defaultValues: schema.questions.reduce((acc, question) => {
			if (!question.hidden && question.value !== undefined) {
				acc[question.id] = question.value;
			}
			return acc;
		}, {} as Record<string, any>),
	});

	const { control, handleSubmit, reset } = form;

	const onSubmit = async (data: any) => {
		setIsSubmitting(true);
		try {
			await submitForm(data);
			toast({
				title: 'Success',
				description: 'Form submitted successfully',
				duration: 3000,
			});
			reset();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to submit form. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (schema.questions.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center p-8 text-gray-500'>
				<Inbox className='w-12 h-12 mb-4 text-gray-400' />
				<h2 className='text-lg font-semibold'>No form to render</h2>
				<p className='text-sm text-gray-400 mb-4'>
					Start by adding a question to build your form.
				</p>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				{schema.questions
					.filter((question) => !question.hidden)
					.map((question) => (
						<FormField
							key={question.id}
							control={control}
							name={question.id}
							defaultValue={getDefaultValue(question)}
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>{question.title}</FormLabel>
										<FormControl>
											<>
												{isTextType(question.type) && (
													<Input
														placeholder={
															TEXT_TYPE_PLACEHOLDERS[question.type as TextType]
														}
														{...field}
														type={question.type === 'phone' ? 'tel' : 'text'}
														value={field.value ?? ''}
														onChange={(e) => {
															field.onChange(e.target.value);
														}}
													/>
												)}

												{question.type === 'paragraph' && (
													<Textarea
														placeholder={
															TEXT_TYPE_PLACEHOLDERS[question.type as TextType]
														}
														{...field}
														value={field.value ?? ''}
													/>
												)}

												{question.type === 'number' && (
													<Input
														placeholder={
															TEXT_TYPE_PLACEHOLDERS[question.type as TextType]
														}
														{...field}
														type='number'
														value={field.value ?? ''}
														onChange={(e) => {
															field.onChange(Number(e.target.value) || '');
														}}
													/>
												)}

												{question.type === 'select' &&
													(question.selectOptions?.isMulti ? (
														<div className='space-y-2'>
															{question.selectOptions.options.map(
																(option, idx) => (
																	<div
																		key={option.value + idx}
																		className='flex items-center gap-2'>
																		<Checkbox
																			checked={(field.value || []).includes(
																				option.value
																			)}
																			onCheckedChange={(checked) => {
																				const values = new Set(
																					field.value || []
																				);
																				if (checked) {
																					values.add(option.value);
																				} else {
																					values.delete(option.value);
																				}
																				field.onChange(Array.from(values));
																			}}
																		/>
																		<label>{option.label}</label>
																	</div>
																)
															)}
														</div>
													) : (
														<Select
															value={field.value ?? ''}
															onValueChange={field.onChange}>
															<SelectTrigger>
																<SelectValue placeholder='Select an option' />
															</SelectTrigger>
															<SelectContent>
																{question.selectOptions?.options.map(
																	(option) => (
																		<SelectItem
																			key={option.value}
																			value={option.value}>
																			{option.label}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>
													))}
											</>
										</FormControl>
										{question.instructions && (
											<FormDescription>{question.instructions}</FormDescription>
										)}
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					))}
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</Button>
			</form>
		</Form>
	);
}
