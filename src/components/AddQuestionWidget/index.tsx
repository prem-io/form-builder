import { ListPlus } from 'lucide-react';
import { QuestionType } from '@/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { useFormStore } from '@/store/useFormStore';

import { QUESTION_ICON_TYPES } from '@/constants';
import { cn } from '@/lib/utils';

interface AddQuestionWidget {
	activeTab: string;
}
const AddQuestionWidget = ({ activeTab }: AddQuestionWidget) => {
	console.log(activeTab);

	const { setSchema, addQuestion } = useFormStore();

	const loadSchema = async () => {
		try {
			const response = await fetch('/data/formSchema.json');
			console.log(response);

			if (!response.ok) throw new Error('Failed to fetch schema');
			const data = await response.json();
			setSchema(data);
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

	if (activeTab !== 'builder') return null;

	return (
		<>
			{/* Desktop Sidebar */}
			<div
				className={cn(
					'hidden lg:block fixed top-1/2 left-[100px] transform -translate-y-1/2 w-[250px] bg-white shadow-xl rounded-lg p-4',
					activeTab !== 'builder' && 'hidden'
				)}>
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
			<div
				className={cn(
					'lg:hidden fixed bottom-6 right-6',
					activeTab !== 'builder' && 'hidden'
				)}>
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
		</>
	);
};

export default AddQuestionWidget;
