import { QuestionTypeIcon, QuestionType, TextType } from '@/types/form';
import {
	Text,
	ScrollText,
	Phone,
	AtSign,
	Link,
	Hash,
	CheckSquare,
	// Sliders,
} from 'lucide-react';

export const QUESTION_ICON_TYPES: Record<QuestionType, QuestionTypeIcon> = {
	text: {
		label: 'Short Text',
		icon: Text,
		bg: 'bg-blue-100',
		color: 'text-blue-600',
	},
	paragraph: {
		label: 'Long Text',
		icon: ScrollText,
		bg: 'bg-green-100',
		color: 'text-green-600',
	},
	phone: {
		label: 'Phone Number',
		icon: Phone,
		bg: 'bg-yellow-100',
		color: 'text-yellow-600',
	},
	email: {
		label: 'Email',
		icon: AtSign,
		bg: 'bg-purple-100',
		color: 'text-purple-600',
	},
	url: {
		label: 'Website URL',
		icon: Link,
		bg: 'bg-red-100',
		color: 'text-red-600',
	},
	number: {
		label: 'Number',
		icon: Hash,
		bg: 'bg-indigo-100',
		color: 'text-indigo-600',
	},
	select: {
		label: 'Choice',
		icon: CheckSquare,
		bg: 'bg-teal-100',
		color: 'text-teal-600',
	},
	// range: {
	// 	label: 'Range',
	// 	icon: Sliders,
	// 	bg: 'bg-orange-100',
	// 	color: 'text-orange-600',
	// },
};

export const TEXT_TYPE_VALIDATIONS: Record<TextType, string> = {
	text: '',
	paragraph: '',
	phone: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}$',
	email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
	url: '^(http|https)://[^\\s/$.?#].[^\\s]*$',
};

export const TYPE_LABELS: Record<string, string> = {
	text: 'Free Text',
	paragraph: 'Descriptive Text',
	phone: 'Phone Number',
	email: 'Email',
	url: 'URL',
	select: 'Select',
	number: 'Number',
};
