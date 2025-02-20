import { QuestionTypeStrategy } from '@/types';
import NumberQuestionStrategy from './NumberQuestionStrategy';
import SelectQuestionStrategy from './SelectQuestionStrategy';

const QuestionTypeFactory = {
	getStrategy: (type: string): QuestionTypeStrategy => {
		switch (type) {
			case 'number':
				return NumberQuestionStrategy;
			case 'select':
				return SelectQuestionStrategy;
			default:
				return { render: () => null };
		}
	},
};

export default QuestionTypeFactory;
