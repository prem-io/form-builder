import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormBuilder } from '@/components/form-builder';
import { FormRenderer } from '@/components/form-renderer';
import { Toaster } from '@/components/ui/toaster';
import { FormQuestion, FormSchema, QuestionType } from '@/types';
import { Button } from '@/components/ui/button';

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { ListPlus } from 'lucide-react';
import { QUESTION_ICON_TYPES, TEXT_TYPE_VALIDATIONS } from './constants';
import { isTextType, shortId } from './lib/utils';
import { toast } from '@/hooks/use-toast';

const defaultQuestion: Omit<FormQuestion, 'id'> = {
	title: '',
	type: 'text',
	required: false,
	hidden: false,
};

const App = () => {
	const [formSchema, setFormSchema] = useState<FormSchema>({
		id: 'form',
		questions: [],
	});

	// useCallback to ensure `onChange` remains stable across renders
	const handleFormChange = useCallback((updatedSchema: FormSchema) => {
		setFormSchema(updatedSchema);
	}, []);

	// Function to add a new question
	const addQuestion = (type: QuestionType) => {
		setFormSchema((prevSchema) => ({
			...prevSchema,
			questions: [
				...prevSchema.questions,
				{
					...defaultQuestion,
					id: shortId(),
					type,
					validation: isTextType(type)
						? {
								regex: TEXT_TYPE_VALIDATIONS[type],
						  }
						: undefined,
					selectOptions:
						type === 'select' ? { isMulti: false, options: [] } : undefined,
				},
			],
		}));
	};

	const loadSchema = async () => {
		try {
			const response = await fetch('/data/formSchema.json');
			console.log(response);
			
			if (!response.ok) throw new Error('Failed to fetch schema');
			const data = await response.json();
			setFormSchema(data);
			toast({
				title: 'Success',
				description: 'Form schema loaded successfully.',
				duration: 2000,
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to load schema.',
				variant: 'destructive',
			});
		}
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<div className='hidden lg:block fixed top-1/2 left-[100px] transform -translate-y-1/2 w-[250px] bg-white shadow-xl rounded-lg p-4'>
				<h3 className='text-md font-semibold mb-3'>Add Question Type</h3>
				<div className='flex flex-col space-y-1'>
					{Object.entries(QUESTION_ICON_TYPES).map(
						([type, { label, icon: Icon, bg, color }]) => (
							<Button
								key={type}
								variant='ghost'
								className='w-full h-[40px] justify-start px-1 flex items-center text-left'
								onClick={() => addQuestion(type as QuestionType)}>
								<div className={`p-2 rounded-md ${bg}`}>
									<Icon className={`w-5 h-5 ${color}`} />
								</div>
								{label}
							</Button>
						)
					)}
				</div>
				<hr className='my-3 border-gray-200' />
				<Button
					onClick={loadSchema}
					className='w-full bg-orange-500 text-white hover:bg-orange-700'>
					Load Form Schema
				</Button>
			</div>

			{/* Mobile Floating Button & Sheet */}
			<div className='lg:hidden fixed bottom-6 right-6'>
				<Sheet>
					<SheetTrigger asChild>
						<Button
							className='rounded-full p-4 shadow-lg bg-blue-600 text-white hover:bg-blue-700 transition-all'
							variant='default'>
							<ListPlus className='w-6 h-6' />
						</Button>
					</SheetTrigger>
					<SheetContent side='bottom' className='p-4'>
						<h3 className='text-md font-semibold flex items-center gap-2 mb-3'>
							Add Question Type
						</h3>

						<div className='flex flex-col space-y-1'>
							{Object.entries(QUESTION_ICON_TYPES).map(
								([type, { label, icon: Icon, bg, color }]) => (
									<Button
										key={type}
										variant='ghost'
										className='w-full h-[40px] justify-start px-1 flex items-center text-left'
										onClick={() => addQuestion(type as QuestionType)}>
										<div className={`p-2 rounded-md ${bg}`}>
											<Icon className={`w-5 h-5 ${color}`} />
										</div>
										{label}
									</Button>
								)
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Main Container */}
			<main className='container max-w-3xl mx-auto py-6'>
				<Tabs defaultValue='builder'>
					<TabsList className='grid grid-cols-2 mb-6'>
						<TabsTrigger value='builder'>Form Builder</TabsTrigger>
						<TabsTrigger value='preview'>Preview Form</TabsTrigger>
					</TabsList>

					{/* Form Builder */}
					<TabsContent value='builder'>
						<FormBuilder schema={formSchema} onChange={handleFormChange} />
					</TabsContent>

					{/* Form Preview */}
					<TabsContent value='preview'>
						<FormRenderer schema={formSchema} />
					</TabsContent>
				</Tabs>
				<Toaster />
			</main>
		</>
	);
};

export default App;
