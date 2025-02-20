import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormBuilder } from '@/components/form-builder';
import { FormRenderer } from '@/components/form-renderer';
import { Toaster } from '@/components/ui/toaster';
import AddQuestionWidget from '@/components/AddQuestionWidget';

const App = () => {
	const [activeTab, setActiveTab] = useState('builder');

	return (
		<main className='container max-w-3xl mx-auto py-6'>
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className='grid grid-cols-2 mb-6'>
					<TabsTrigger value='builder'>Form Builder</TabsTrigger>
					<TabsTrigger value='preview'>Preview Form</TabsTrigger>
				</TabsList>

				{/* Form Builder */}
				<TabsContent value='builder'>
					<FormBuilder />
				</TabsContent>

				{/* Form Preview */}
				<TabsContent value='preview'>
					<FormRenderer />
				</TabsContent>
			</Tabs>
			<AddQuestionWidget activeTab={activeTab} />
			<Toaster />
		</main>
	);
};

export default App;
