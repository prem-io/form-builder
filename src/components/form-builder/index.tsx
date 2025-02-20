import { Blocks } from 'lucide-react';

import { QuestionEditor } from '@/components/question-editor';

import { useFormStore } from '@/store/useFormStore';

const EmptyState = () => (
	<div className='flex flex-col items-center justify-center p-8 text-gray-500'>
		<Blocks className='w-12 h-12 mb-4 text-gray-400' />
		<h2 className='text-lg font-semibold'>No Questions Added</h2>
		<p className='text-sm text-gray-400 mb-4'>
			Start by adding a question to build your form.
		</p>
	</div>
);

export function FormBuilder() {
	const { schema } = useFormStore();

	return (
		<div className='max-w-3xl mx-auto space-y-4'>
			{schema.questions.length === 0 ? (
				<EmptyState />
			) : (
				schema.questions.map(({ id }) => (
					<QuestionEditor key={id} questionId={id} />
				))
			)}
		</div>
	);
}
