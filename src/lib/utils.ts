import { FormQuestion, TextType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const shortId = () => Math.random().toString(36).slice(2, 11);

export const getDefaultValue = (question: FormQuestion) => {
	switch (question.type) {
		case 'text':
		case 'paragraph':
		case 'phone':
		case 'email':
		case 'url':
			return '';
		case 'number':
			return 0;
		case 'select':
			return question.selectOptions?.isMulti ? [] : '';
		default:
			return '';
	}
};

const TEXT_TYPES: TextType[] = ['text', 'phone', 'email', 'url'];

export const isTextType = (type: string): type is TextType => {
	return TEXT_TYPES.includes(type as TextType);
};
