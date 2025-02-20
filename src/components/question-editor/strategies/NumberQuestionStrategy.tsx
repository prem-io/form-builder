import { Input } from '@/components/ui/input';
import { QuestionTypeStrategy } from '@/types';

const NumberQuestionStrategy: QuestionTypeStrategy = {
	render: (question, updateField) => (
		<div className='grid grid-cols-2 gap-2'>
			<Input
				type='number'
				placeholder='Min'
				value={question.validation?.min || ''}
				onChange={(e) =>
					updateField('validation', {
						...question.validation,
						min: parseInt(e.target.value) || undefined,
					})
				}
			/>
			<Input
				type='number'
				placeholder='Max'
				value={question.validation?.max || ''}
				onChange={(e) =>
					updateField('validation', {
						...question.validation,
						max: parseInt(e.target.value) || undefined,
					})
				}
			/>
		</div>
	),
};

export default NumberQuestionStrategy;
