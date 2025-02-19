// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitForm(data: any): Promise<{ success: boolean }> {
	await delay(1000); // Simulate network request

	// Simulate successful submission (95% success rate)
	if (Math.random() > 0.05) {
		console.log('Form submitted successfully:', data);
		return { success: true };
	}

	throw new Error('Failed to submit form');
}
