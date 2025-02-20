import { useCallback } from 'react';
import { Blocks } from 'lucide-react';

import { QuestionEditor } from '@/components/question-editor';
import type { FormSchema, FormQuestion } from '@/types';
interface FormBuilderProps {
	schema: FormSchema;
	onChange: (schema: FormSchema) => void;
}

const EmptyState = () => (
	<div className='flex flex-col items-center justify-center p-8 text-gray-500'>
		<Blocks className='w-12 h-12 mb-4 text-gray-400' />
		<h2 className='text-lg font-semibold'>No Questions Added</h2>
		<p className='text-sm text-gray-400 mb-4'>
			Start by adding a question to build your form.
		</p>
	</div>
);

export function FormBuilder({ schema, onChange }: FormBuilderProps) {
	// Update an existing question
	const updateQuestion = useCallback(
		(updatedQuestion: FormQuestion) => {
			onChange({
				...schema,
				questions: schema.questions.map((q) =>
					q.id === updatedQuestion.id ? updatedQuestion : q
				),
			});
		},
		[onChange, schema]
	);

	// Delete a question
	const deleteQuestion = useCallback(
		(id: string) => {
			onChange({
				...schema,
				questions: schema.questions.filter((q) => q.id !== id),
			});
		},
		[onChange]
	);

	// Move a question up or down
	const moveQuestion = useCallback(
		(id: string, direction: 'up' | 'down') => {
			const index = schema.questions.findIndex((q) => q.id === id);
			if (index === -1) return; // If not found, do nothing

			const newQuestions = [...schema.questions];
			const newIndex = direction === 'up' ? index - 1 : index + 1;

			// Ensure new index is within bounds
			if (newIndex < 0 || newIndex >= newQuestions.length) return;

			// Swap positions
			[newQuestions[index], newQuestions[newIndex]] = [
				newQuestions[newIndex],
				newQuestions[index],
			];

			// Pass updated `FormSchema` to `onChange`
			onChange({ ...schema, questions: newQuestions });
		},
		[onChange]
	);

	// Duplicate a question
	const duplicateQuestion = useCallback(
		(question: FormQuestion) => {
			const newQuestion = {
				...question,
				id: crypto.randomUUID(), // Assign a new unique ID
			};

			onChange({
				...schema,
				questions: [...schema.questions, newQuestion],
			});
		},
		[onChange]
	);

	return (
		<div className='max-w-3xl mx-auto space-y-4'>
			{schema.questions.length === 0 ? (
				<EmptyState />
			) : (
				schema.questions.map((question) => (
					<QuestionEditor
						key={question.id}
						question={question}
						onUpdate={updateQuestion}
						onDelete={deleteQuestion}
						onMove={moveQuestion}
						onDuplicate={duplicateQuestion}
					/>
				))
			)}
		</div>
	);
}
