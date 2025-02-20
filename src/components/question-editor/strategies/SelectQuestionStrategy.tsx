import { useState } from 'react';
import { FormQuestion, QuestionTypeStrategy } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

const SelectQuestionStrategy: QuestionTypeStrategy = {
	render: (question: FormQuestion, updateField) => {
		const [newOption, setNewOption] = useState('');

		const addSelectOption = () => {
			const trimmedOption = newOption.trim();
			if (!trimmedOption) return;

			const existingOptions = question.selectOptions?.options || [];
			const normalizedValue = trimmedOption.toLowerCase();

			// Find the next available index for this label
			let index = 1;
			let uniqueValue = normalizedValue;
			while (existingOptions.some((opt) => opt.value === uniqueValue)) {
				uniqueValue = `${normalizedValue}-${index}`;
				index++;
			}

			updateField('selectOptions', {
				...question.selectOptions!,
				options: [
					...(question.selectOptions?.options || []),
					{ label: uniqueValue, value: trimmedOption },
				],
			});

			setNewOption('');
		};

		const removeSelectOption = (value: string) => {
			if (!question.selectOptions?.options) return;

			const updatedOptions = question.selectOptions.options.filter(
				(option) => option.value !== value
			);

			updateField('selectOptions', {
				...question.selectOptions,
				options: updatedOptions,
			});
		};

		return (
			<div className='space-y-4'>
				<div className='flex items-center gap-2'>
					<Checkbox
						id={`multi-${question.id}`}
						checked={question.selectOptions?.isMulti}
						onCheckedChange={(checked) =>
							updateField('selectOptions', {
								...question.selectOptions!,
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
					{question.selectOptions?.options.map((option) => (
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
		);
	},
};

export default SelectQuestionStrategy;
