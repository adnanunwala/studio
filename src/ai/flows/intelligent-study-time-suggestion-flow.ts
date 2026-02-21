'use server';
/**
 * @fileOverview An AI agent that suggests optimal study times based on user data.
 *
 * - suggestOptimalStudyTimes - A function that handles the study time suggestion process.
 * - IntelligentStudyTimeSuggestionInput - The input type for the suggestOptimalStudyTimes function.
 * - IntelligentStudyTimeSuggestionOutput - The return type for the suggestOptimalStudyTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentStudyTimeSuggestionInputSchema = z.object({
  pastStudySessions: z
    .array(
      z.object({
        date: z.string().describe('Date of the study session in YYYY-MM-DD format.'),
        startTime: z.string().describe('Start time of the study session, e.g., "09:00 AM".'),
        endTime: z.string().describe('End time of the study session, e.g., "10:00 AM".'),
        subject: z.string().describe('Subject studied, e.g., "Mathematics".'),
        productivityRating: z
          .number()
          .min(1)
          .max(5)
          .describe('A rating from 1 to 5, where 5 is highly productive.'),
      })
    )
    .optional()
    .describe('Historical data of past study sessions and their productivity.'),
  upcomingTasks: z
    .array(
      z.object({
        id: z.string().describe('Unique identifier for the task.'),
        name: z.string().describe('Name or description of the task.'),
        dueDate: z.string().optional().describe('Optional due date in YYYY-MM-DD format.'),
        priority: z.enum(['Low', 'Medium', 'High']).describe('Priority of the task.'),
        subject: z.string().optional().describe('Subject related to the task.'),
      })
    )
    .optional()
    .describe('List of tasks that need to be scheduled.'),
  dailySchedule: z
    .array(
      z.object({
        startTime: z.string().describe('Start time of the activity, e.g., "08:00 AM".'),
        endTime: z.string().describe('End time of the activity, e.g., "09:00 AM".'),
        activity: z.string().describe('Description of the scheduled activity.'),
      })
    )
    .optional()
    .describe('Current daily commitments, e.g., meetings, classes, in chronological order.'),
  currentDate: z.string().describe('The current date for which to suggest study times, in YYYY-MM-DD format.'),
  userPreferences: z
    .string()
    .optional()
    .describe('Any specific preferences the user has, e.g., "prefers mornings", "avoid evenings".'),
});
export type IntelligentStudyTimeSuggestionInput = z.infer<
  typeof IntelligentStudyTimeSuggestionInputSchema
>;

const IntelligentStudyTimeSuggestionOutputSchema = z.object({
  suggestedStudySlots: z.array(
    z.object({
      startTime: z.string().describe('Suggested start time, e.g., "10:00 AM".'),
      endTime: z.string().describe('Suggested end time, e.g., "11:00 AM".'),
      subjectRecommendation: z
        .string()
        .optional()
        .describe('Optional suggestion for what subject to study during this slot.'),
      reason: z
        .string()
        .describe('Explanation for why this study slot is suggested.'),
    })
  ).describe('A list of suggested optimal study time slots.'),
  explanation: z
    .string()
    .describe('A general explanation and summary of the generated suggestions.'),
});
export type IntelligentStudyTimeSuggestionOutput = z.infer<
  typeof IntelligentStudyTimeSuggestionOutputSchema
>;

export async function suggestOptimalStudyTimes(
  input: IntelligentStudyTimeSuggestionInput
): Promise<IntelligentStudyTimeSuggestionOutput> {
  try {
    return await intelligentStudyTimeSuggestionFlow(input);
  } catch (error) {
    console.error("Genkit Error in suggestOptimalStudyTimes:", error);
    return {
      suggestedStudySlots: [
        { 
          startTime: "10:00 AM", 
          endTime: "11:00 AM", 
          subjectRecommendation: "Mathematics", 
          reason: "Focus on your most challenging subject early when your mind is fresh." 
        },
        { 
          startTime: "02:00 PM", 
          endTime: "03:00 PM", 
          subjectRecommendation: "Review", 
          reason: "Afternoon slot for review and steady progress." 
        }
      ],
      explanation: "I couldn't generate personalized suggestions right now, but here's a standard study plan to get you started."
    };
  }
}

const prompt = ai.definePrompt({
  name: 'intelligentStudyTimeSuggestionPrompt',
  input: {schema: IntelligentStudyTimeSuggestionInputSchema},
  output: {schema: IntelligentStudyTimeSuggestionOutputSchema},
  prompt: `You are an intelligent study assistant designed to help users optimize their study schedule.
Your task is to analyze the provided past study data, upcoming tasks, and current daily schedule to suggest 2-3 optimal study times for the date: {{{currentDate}}}.

Here is the data:

Past Study Sessions (indicates productivity patterns):
{{#if pastStudySessions}}
{{#each pastStudySessions}}
- On {{{date}}} from {{{startTime}}} to {{{endTime}}}: Studied {{{subject}}} with a productivity rating of {{{productivityRating}}}/5.
{{/each}}
{{else}}
No past study sessions provided.
{{/if}}

Upcoming Tasks (consider these for scheduling):
{{#if upcomingTasks}}
{{#each upcomingTasks}}
- Task: "{{{name}}}", Priority: {{{priority}}}{{#if dueDate}}, Due Date: {{{dueDate}}}{{/if}}{{#if subject}}, Subject: {{{subject}}}{{/if}}
{{/each}}
{{else}}
No upcoming tasks provided.
{{/if}}

Current Daily Schedule (identify free slots):
{{#if dailySchedule}}
{{#each dailySchedule}}
- From {{{startTime}}} to {{{endTime}}}: {{{activity}}}
{{/each}}
{{else}}
No existing schedule provided. Assume a blank slate outside of typical sleep hours (e.g., 11 PM to 7 AM).
{{/if}}

User Preferences:
{{#if userPreferences}}
{{{userPreferences}}}
{{else}}
No specific preferences provided.
{{/if}}

Based on the above information, suggest 2-3 optimal study slots for {{{currentDate}}}. For each slot, provide a start time, end time, a brief reason for the suggestion, and optionally recommend a subject based on upcoming tasks or past productivity. Ensure the suggestions do not conflict with the existing daily schedule. Prioritize slots where productivity was historically high or where important tasks can be addressed.

Finally, provide a general explanation of your suggestions, highlighting the patterns you observed and how you arrived at your recommendations.`,
});

const intelligentStudyTimeSuggestionFlow = ai.defineFlow(
  {
    name: 'intelligentStudyTimeSuggestionFlow',
    inputSchema: IntelligentStudyTimeSuggestionInputSchema,
    outputSchema: IntelligentStudyTimeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('No output received from the prompt.');
    }
    return output;
  }
);
