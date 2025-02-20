import { create } from 'zustand';
import { FormSchema, FormQuestion, QuestionType } from '@/types';
import { isTextType, shortId } from '@/lib/utils';
import { TEXT_TYPE_VALIDATIONS } from '@/constants';

interface FormStore {
	schema: FormSchema;
	setSchema: (schema: FormSchema) => void;
	addQuestion: (type: QuestionType) => void;
	updateQuestion: (updatedQuestion: FormQuestion) => void;
	deleteQuestion: (id: string) => void;
	moveQuestion: (id: string, direction: 'up' | 'down') => void;
	duplicateQuestion: (question: FormQuestion) => void;
}

const defaultQuestion: Omit<FormQuestion, 'id'> = {
	title: '',
	type: 'text',
	required: false,
	hidden: false,
};

export const useFormStore = create<FormStore>((set) => ({
	schema: { id: 'form', questions: [] },

	setSchema: (schema) => set({ schema }),

	// Function to add a new question to the form schema
	addQuestion: (type: QuestionType) => {
		set((state) => {
			const newQuestion: FormQuestion = {
				...defaultQuestion,
				id: shortId(),
				type,
				validation: isTextType(type)
					? { regex: TEXT_TYPE_VALIDATIONS[type] }
					: undefined,
				selectOptions:
					type === 'select' ? { isMulti: false, options: [] } : undefined,
			};

			return {
				schema: {
					...state.schema,
					questions: [...state.schema.questions, newQuestion],
				},
			};
		});
	},

	updateQuestion: (updatedQuestion) => {
		set((state) => ({
			schema: {
				...state.schema,
				questions: state.schema.questions.map((q) =>
					q.id === updatedQuestion.id ? updatedQuestion : q
				),
			},
		}));
	},

	deleteQuestion: (id) => {
		set((state) => ({
			schema: {
				...state.schema,
				questions: state.schema.questions.filter((q) => q.id !== id),
			},
		}));
	},

	moveQuestion: (id, direction) => {
		set((state) => {
			const { schema } = state;
			const index = schema.questions.findIndex((q) => q.id === id);
			if (index === -1) return state;

			const newIndex = direction === 'up' ? index - 1 : index + 1;
			if (newIndex < 0 || newIndex >= schema.questions.length) return state;

			const newQuestions = [...schema.questions];

			// Swap positions
			[newQuestions[index], newQuestions[newIndex]] = [
				newQuestions[newIndex],
				newQuestions[index],
			];

			return { schema: { ...schema, questions: newQuestions } };
		});
	},

	duplicateQuestion: (question) => {
		set((state) => ({
			schema: {
				...state.schema,
				questions: [...state.schema.questions, { ...question, id: shortId() }],
			},
		}));
	},
}));
