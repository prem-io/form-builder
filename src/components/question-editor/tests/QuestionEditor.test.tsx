import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QuestionEditor } from '..';
import type { FormQuestion } from '@/types';

const mockQuestion: FormQuestion = {
	id: 'q1',
	type: 'text',
	title: 'Sample Question',
	required: false,
	hidden: false,
	instructions: '',
};

describe('QuestionEditor Component', () => {
	const onUpdate = vi.fn();
	const onMove = vi.fn();
	const onDuplicate = vi.fn();
	const onDelete = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('renders question title', () => {
		render(
			<QuestionEditor
				question={mockQuestion}
				onUpdate={onUpdate}
				onMove={onMove}
				onDuplicate={onDuplicate}
				onDelete={onDelete}
			/>
		);

		expect(screen.getByPlaceholderText('Question title')).toHaveValue(
			mockQuestion.title
		);
	});

	test('updates question title', () => {
		render(
			<QuestionEditor
				question={mockQuestion}
				onUpdate={onUpdate}
				onMove={onMove}
				onDuplicate={onDuplicate}
				onDelete={onDelete}
			/>
		);

		const input = screen.getByPlaceholderText('Question title');
		fireEvent.change(input, { target: { value: 'Updated Question' } });

		expect(input).toHaveValue('Updated Question');
	});

	test('calls onDelete when delete button is clicked', () => {
		render(
			<QuestionEditor
				question={mockQuestion}
				onUpdate={onUpdate}
				onMove={onMove}
				onDuplicate={onDuplicate}
				onDelete={onDelete}
			/>
		);

		const deleteButton = screen.getByRole('button', {
			name: /delete question/i,
		});
		fireEvent.click(deleteButton);

		expect(onDelete).toHaveBeenCalledWith(mockQuestion.id);
	});

	test('calls onMove when moving question up', () => {
		render(
			<QuestionEditor
				question={mockQuestion}
				onUpdate={onUpdate}
				onMove={onMove}
				onDuplicate={onDuplicate}
				onDelete={onDelete}
			/>
		);

		const moveUpButton = screen.getByRole('button', { name: /move up/i });
		fireEvent.click(moveUpButton);

		expect(onMove).toHaveBeenCalledWith(mockQuestion.id, 'up');
	});

	test('calls onMove when moving question down', () => {
		render(
			<QuestionEditor
				question={mockQuestion}
				onUpdate={onUpdate}
				onMove={onMove}
				onDuplicate={onDuplicate}
				onDelete={onDelete}
			/>
		);

		const moveUpButton = screen.getByRole('button', { name: /move down/i });
		fireEvent.click(moveUpButton);

		expect(onMove).toHaveBeenCalledWith(mockQuestion.id, 'down');
	});

	test('calls onDuplicate when duplicate button is clicked', () => {
		render(
			<QuestionEditor
				question={mockQuestion}
				onUpdate={onUpdate}
				onMove={onMove}
				onDuplicate={onDuplicate}
				onDelete={onDelete}
			/>
		);

		const duplicateButton = screen.getByRole('button', { name: /duplicate/i });
		fireEvent.click(duplicateButton);

		expect(onDuplicate).toHaveBeenCalledWith(mockQuestion);
	});

	test('toggles required switch', async () => {
		const mockQuestion: FormQuestion = {
			id: 'q1',
			type: 'text',
			title: 'Sample Question',
			required: false, // Initial state is false
			hidden: false,
			instructions: '',
		};

		const onUpdate = vi.fn();

		render(
			<QuestionEditor
				question={mockQuestion}
				onUpdate={onUpdate}
				onMove={vi.fn()}
				onDuplicate={vi.fn()}
				onDelete={vi.fn()}
			/>
		);

		const switchElement = screen.getByRole('switch', { name: /required/i });

		// Simulate clicking the switch
		fireEvent.click(switchElement);

		// Wait for the debounced `onUpdate` to be called in useEffect
		await waitFor(
			() => {
				expect(onUpdate).toHaveBeenCalled();
			},
			{ timeout: 1000 }
		); // Wait up to 1 second (600ms debounce)
	});

	test('adds a new select option', async () => {
		const questionWithSelect: FormQuestion = {
			...mockQuestion,
			type: 'select',
			selectOptions: { isMulti: false, options: [] },
		};

		render(
			<QuestionEditor
				question={questionWithSelect}
				onUpdate={onUpdate}
				onMove={onMove}
				onDuplicate={onDuplicate}
				onDelete={onDelete}
			/>
		);

		const input = screen.getByPlaceholderText('Add option');
		fireEvent.change(input, { target: { value: 'Option 1' } });
		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

		// Wait for the debounced `onUpdate` to be called in useEffect
		await waitFor(
			() => {
				expect(onUpdate).toHaveBeenCalled();
			},
			{ timeout: 1000 }
		); // Wait up to 1 second (600ms debounce)
	});
});
