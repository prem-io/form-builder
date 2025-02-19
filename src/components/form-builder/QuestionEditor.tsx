import { useState, useEffect } from 'react';
import {
	ArrowDown,
	ArrowUp,
	Copy,
	Plus,
	Trash2,
	ChevronDown,
	ChevronUp,
	X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { FormQuestion, TextType } from '@/types/form';
import {
	QUESTION_ICON_TYPES,
	TEXT_TYPE_VALIDATIONS,
	TYPE_LABELS,
} from '@/constants';

interface QuestionEditorProps {
	question: FormQuestion;
	onUpdate: (question: FormQuestion) => void;
	onMove: (id: string, direction: 'up' | 'down') => void;
	onDuplicate: (question: FormQuestion) => void;
	onDelete: (id: string) => void;
}

export function QuestionEditor({
	question,
	onUpdate,
	onMove,
	onDuplicate,
	onDelete,
}: QuestionEditorProps) {
	const [isExpanded, setIsExpanded] = useState(true);
	const [localQuestion, setLocalQuestion] = useState(question);
	const [newOption, setNewOption] = useState('');
	const [showDescription, setShowDescription] = useState(
		false || !!localQuestion.instructions
	);
	const { toast } = useToast();

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (JSON.stringify(question) !== JSON.stringify(localQuestion)) {
				// TODO: Persist changes to the server
				onUpdate(localQuestion);
				toast({
					title: 'Auto Saving...',
					description: 'Changes saved automatically',
					duration: 2000,
				});
			}
		}, 600);

		return () => clearTimeout(timeoutId);
	}, [localQuestion]);

	const updateField = <K extends keyof FormQuestion>(
		field: K,
		value: FormQuestion[K]
	) => {
		setLocalQuestion((prev) => {
			const updated = { ...prev, [field]: value };

			// Apply default validation based on the new type
			switch (value) {
				case 'text':
				case 'paragraph':
					updated.validation = {};
					break;

				case 'phone':
				case 'email':
				case 'url':
					updated.validation = {
						regex: TEXT_TYPE_VALIDATIONS[value as TextType],
					};
					break;

				case 'number':
				case 'range':
					updated.validation = { min: undefined, max: undefined };
					break;

				case 'select':
					updated.selectOptions = { isMulti: false, options: [] };
					break;
			}

			return updated;
		});
	};

	const addSelectOption = () => {
		const trimmedOption = newOption.trim();
		if (!trimmedOption) return;

		setLocalQuestion((prev) => {
			const existingOptions = prev.selectOptions?.options || [];
			const normalizedValue = trimmedOption.toLowerCase();

			// Find the next available index for this label
			let index = 1;
			let uniqueValue = normalizedValue;
			while (existingOptions.some((opt) => opt.value === uniqueValue)) {
				uniqueValue = `${normalizedValue}-${index}`;
				index++;
			}

			return {
				...prev,
				selectOptions: {
					...prev.selectOptions!,
					options: [
						...existingOptions,
						{ value: uniqueValue, label: trimmedOption },
					],
				},
			};
		});

		setNewOption('');
	};

	const removeSelectOption = (value: string) => {
		setLocalQuestion((prev) => ({
			...prev,
			selectOptions: {
				...prev.selectOptions!,
				options:
					prev.selectOptions?.options.filter((opt) => opt.value !== value) ||
					[],
			},
		}));
	};

	const { icon, bg, color } = QUESTION_ICON_TYPES[localQuestion.type];
	const QuestionTypeIcon = icon;

	return (
		<Card className='mb-4'>
			<div className='flex flex-col md:flex-row md:items-center justify-between p-4 border-b'>
				<div className='flex items-center gap-2'>
					<div className={`p-2 rounded-md ${bg}`}>
						<QuestionTypeIcon className={`w-5 h-5 ${color}`} />
					</div>
					<h2 className='text-lg font-semibold'>
						{localQuestion.title ||
							TYPE_LABELS[localQuestion.type] ||
							'Question Title'}
					</h2>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='icon'
						aria-label="Move up"
						onClick={(e) => {
							e.stopPropagation();
							onMove(question.id, 'up');
						}}>
						<ArrowUp className='h-4 w-4' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
						aria-label="Move down"
						onClick={(e) => {
							e.stopPropagation();
							onMove(question.id, 'down');
						}}>
						<ArrowDown className='h-4 w-4' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
						aria-label="Duplicate question"
						onClick={(e) => {
							e.stopPropagation();
							onDuplicate(question);
						}}>
						<Copy className='h-4 w-4' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
						aria-label='Delete question'
						onClick={() => onDelete(question.id)}	
					>
						<Trash2 className='h-4 w-4' />
					</Button>
					<Button
						variant='ghost'
						size='icon'
						aria-label='Collapse'
						onClick={() => setIsExpanded(!isExpanded)}>
						{isExpanded ? (
							<ChevronUp className='h-4 w-4' />
						) : (
							<ChevronDown className='h-4 w-4' />
						)}
					</Button>
				</div>
			</div>
			{isExpanded && (
				<CardContent className='p-4 space-y-4'>
					<div className='space-y-4'>
						<Input
							className='text-lg'
							placeholder='Question title'
							value={localQuestion.title}
							onChange={(e) => updateField('title', e.target.value)}
						/>

						{!showDescription && (
							<Button
								variant='ghost'
								className='mt-2 text-muted-foreground bg-accent text-black'
								onClick={() => setShowDescription(true)}>
								<Plus className='h-4 w-4 mr-2' />
								Add description
							</Button>
						)}

						{showDescription && (
							<Input
								placeholder='Additional instructions (optional)'
								value={localQuestion.instructions || ''}
								onChange={(e) => updateField('instructions', e.target.value)}
							/>
						)}

						{localQuestion.type === 'number' && (
							<div className='grid grid-cols-2 gap-2'>
								<Input
									type='number'
									className='w-full'
									placeholder='Min'
									value={localQuestion.validation?.min || ''}
									onChange={(e) =>
										updateField('validation', {
											...localQuestion.validation,
											min: Number.parseInt(e.target.value) || undefined,
										})
									}
								/>
								<Input
									type='number'
									className='w-full'
									placeholder='Max'
									value={localQuestion.validation?.max || ''}
									onChange={(e) =>
										updateField('validation', {
											...localQuestion.validation,
											max: Number.parseInt(e.target.value) || undefined,
										})
									}
								/>
							</div>
						)}

						{TEXT_TYPE_VALIDATIONS[localQuestion.type as TextType] && (
							<Input
								placeholder='Custom regex pattern (optional)'
								className='w-full'
								value={localQuestion.validation?.regex}
								onChange={(e) =>
									updateField('validation', {
										...localQuestion.validation,
										regex: e.target.value,
									})
								}
							/>
						)}

						{localQuestion.type === 'select' && (
							<div className='space-y-4'>
								<div className='flex items-center gap-2'>
									<Checkbox
										id={`multi-${question.id}`}
										checked={localQuestion.selectOptions?.isMulti}
										onCheckedChange={(checked) =>
											updateField('selectOptions', {
												...localQuestion.selectOptions!,
												isMulti: checked as boolean,
											})
										}
									/>
									<label htmlFor={`multi-${question.id}`}>
										Allow multiple selections
									</label>
								</div>

								<div className='flex gap-2'>
									<Input
										placeholder='Add option'
										value={newOption}
										onChange={(e) => setNewOption(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												e.preventDefault();
												addSelectOption();
											}
										}}
									/>
									<Button onClick={addSelectOption} type='button'>
										<Plus className='h-4 w-4' />
									</Button>
								</div>

								<div className='flex flex-wrap gap-2'>
									{localQuestion.selectOptions?.options.map((option) => (
										<Badge
											key={option.value}
											variant='secondary'
											className='flex items-center gap-1'>
											{option.label}
											<Button
												variant='ghost'
												size='icon'
												className='h-4 w-4 p-0 hover:bg-transparent'
												onClick={() => removeSelectOption(option.value)}>
												<X className='h-3 w-3' />
											</Button>
										</Badge>
									))}
								</div>
							</div>
						)}

						<hr className='flex-grow border-t border-gray-200' />
						<div className='flex gap-3'>
							<div className='flex items-center gap-2'>
								<Switch
									id={`required-${question.id}`}
									checked={localQuestion.required}
									aria-label="Required"
									onCheckedChange={(checked) =>
										updateField('required', checked as boolean)
									}
								/>
								<span>Required</span>
							</div>
							<div className='flex items-center gap-2'>
								<Switch
									id={`hidden-${question.id}`}
									checked={localQuestion.hidden}
									aria-label="Hidden"
									onCheckedChange={(checked) =>
										updateField('hidden', checked as boolean)
									}
								/>
								<span>Hidden</span>
							</div>
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	);
}
