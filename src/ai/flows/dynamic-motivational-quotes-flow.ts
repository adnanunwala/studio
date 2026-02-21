'use server';
/**
 * @fileOverview A Genkit flow for generating unique and inspiring motivational quotes.
 *
 * - dynamicMotivationalQuotes - A function that triggers the quote generation flow.
 * - DynamicMotivationalQuotesOutput - The return type for the dynamicMotivationalQuotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DynamicMotivationalQuotesOutputSchema = z.object({
  quote: z.string().describe('An inspiring motivational quote.'),
});
export type DynamicMotivationalQuotesOutput = z.infer<typeof DynamicMotivationalQuotesOutputSchema>;

export async function dynamicMotivationalQuotes(): Promise<DynamicMotivationalQuotesOutput> {
  return dynamicMotivationalQuotesFlow();
}

const prompt = ai.definePrompt({
  name: 'motivationalQuotePrompt',
  input: {schema: z.void()}, // No specific input needed for generating a general quote
  output: {schema: DynamicMotivationalQuotesOutputSchema},
  prompt: `Generate a unique, inspiring, and concise motivational quote for daily encouragement. Focus on themes of focus, productivity, and achieving goals. The quote should be suitable for display on a dashboard.`, 
});

const dynamicMotivationalQuotesFlow = ai.defineFlow(
  {
    name: 'dynamicMotivationalQuotesFlow',
    inputSchema: z.void(),
    outputSchema: DynamicMotivationalQuotesOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
