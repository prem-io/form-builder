import { useState, useEffect } from 'react';
import {
	ArrowDown,
	ArrowUp,
	Copy,
	Plus,
	Trash2,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import type { FormQuestion, TextType } from '@/types';
import {
	QUESTION_ICON_TYPES,
	TEXT_TYPE_VALIDATIONS,
	TYPE_LABELS,
} from '@/constants';
import QuestionTypeFactory from './strategies/QuestionTypeFactory';
import { useFormStore } from '@/store/useFormStore';

interface QuestionEditorProps {
	questionId: string;
}

export function QuestionEditor({ questionId }: QuestionEditorProps) {
	const { toast } = useToast();
	const { updateQuestion, deleteQuestion, moveQuestion, duplicateQuestion } =
		useFormStore();

	const question = useFormStore((state) =>
		state.schema.questions.find((q) => q.id === questionId)
	);

	if (!question) return null; // Prevent rendering errors

	const [isExpanded, setIsExpanded] = useState(true);
	const [localQuestion, setLocalQuestion] = useState(question);
	const [showDescription, setShowDescription] = useState(
		false || !!localQuestion.instructions
	);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (JSON.stringify(question) !== JSON.stringify(localQuestion)) {
				// TODO: Persist changes to the server
				updateQuestion(localQuestion);
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

	const { type } = localQuestion;

	// Get the right strategy for the question type
	const questionStrategy = QuestionTypeFactory.getStrategy(type);

	const { icon, bg, color } = QUESTION_ICON_TYPES[type];
	const QuestionTypeIcon = icon;

	return (
		<Card className='mb-4'>
			<div className='flex flex-col md:flex-row md:items-center justify-between p-4 border-b'>
				<div className='flex items-center gap-2'>
					<div className={`p-2 rounded-md ${bg}`}>
						<QuestionTypeIcon className={`w-5 h-5 ${color}`} />
					</div>
					<h2 className='text-lg font-semibold'>
						{localQuestion.title || TYPE_LABELS[type] || 'Question Title'}
					</h2>
				</div>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='icon'
						aria-label='Move up'
						onClick={(e) => {
							e.stopPropagation();
							moveQuestion(question.id, 'up');
						}}>
						<ArrowUp className='h-4 w-4' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
						aria-label='Move down'
						onClick={(e) => {
							e.stopPropagation();
							moveQuestion(question.id, 'down');
						}}>
						<ArrowDown className='h-4 w-4' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
						aria-label='Duplicate question'
						onClick={(e) => {
							e.stopPropagation();
							duplicateQuestion(question);
						}}>
						<Copy className='h-4 w-4' />
					</Button>

					<Button
						variant='ghost'
						size='icon'
						aria-label='Delete question'
						onClick={() => deleteQuestion(question.id)}>
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

						{showDescription ? (
							<Input
								placeholder='Additional instructions (optional)'
								value={localQuestion.instructions || ''}
								onChange={(e) => updateField('instructions', e.target.value)}
							/>
						) : (
							<Button
								variant='ghost'
								className='mt-2 text-muted-foreground bg-accent text-black'
								onClick={() => setShowDescription(true)}>
								<Plus className='h-4 w-4 mr-2' />
								Add description
							</Button>
						)}

						{/* Use Strategy to Render Specific Fields */}
						{questionStrategy.render(localQuestion, updateField)}

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

						<hr className='flex-grow border-t border-gray-200' />
						<div className='flex gap-3'>
							<div className='flex items-center gap-2'>
								<Switch
									id={`required-${question.id}`}
									checked={localQuestion.required}
									aria-label='Required'
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
									aria-label='Hidden'
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
