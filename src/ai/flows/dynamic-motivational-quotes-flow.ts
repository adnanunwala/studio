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
  try {
    return await dynamicMotivationalQuotesFlow();
  } catch (error) {
    console.error("Genkit Error in dynamicMotivationalQuotes:", error);
    return {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts."
    };
  }
}

const prompt = ai.definePrompt({
  name: 'motivationalQuotePrompt',
  input: {schema: z.object({}).optional()},
  output: {schema: DynamicMotivationalQuotesOutputSchema},
  prompt: `Generate a unique, inspiring, and concise motivational quote for daily encouragement. Focus on themes of focus, productivity, and achieving goals. The quote should be suitable for display on a dashboard.`, 
});

const dynamicMotivationalQuotesFlow = ai.defineFlow(
  {
    name: 'dynamicMotivationalQuotesFlow',
    inputSchema: z.object({}).optional(),
    outputSchema: DynamicMotivationalQuotesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input || {});
    if (!output) {
      throw new Error('No output received from the motivational quote prompt.');
    }
    return output;
  }
);
