import { ReactElement } from 'react';

export type TextType = 'text' | 'paragraph' | 'phone' | 'email' | 'url';
export type NumberType = 'number' | 'range';
export type ChoiceType = 'select';

export type QuestionType = TextType | Exclude<NumberType, 'range'> | ChoiceType;

export interface SelectOptions {
	isMulti: boolean;
	options: Array<{
		value: string;
		label: string;
	}>;
}

export interface ValidationRules {
	required?: boolean;
	min?: number;
	max?: number;
	regex?: string;
	numberType?: NumberType;
}

export interface FormQuestion {
	id: string;
	title: string;
	type: QuestionType;
	value?: string | number | string[];
	placeholder?: string;
	instructions?: string;
	required: boolean;
	hidden: boolean;
	validation?: ValidationRules;
	selectOptions?: SelectOptions;
}

export interface FormSchema {
	id: string;
	questions: FormQuestion[];
}

export interface QuestionTypeIcon {
	label: string;
	icon: React.ElementType; // Type for a React component (Lucide icons)
	bg: string; // Tailwind background color class
	color: string; // Tailwind text color class
}

export interface QuestionTypeStrategy {
	render: (
		question: any,
		updateField: <K extends keyof FormQuestion>(
			field: K,
			value: FormQuestion[K]
		) => void
	) => ReactElement | null;
}
