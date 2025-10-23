'use server';
/**
 * @fileOverview An AI flow to extract user data from an ID card image.
 *
 * - extractUserData - A function that handles the data extraction process.
 * - ExtractUserDataInput - The input type for the extractUserData function.
 * - ExtractUserDataOutput - The return type for the extractUserData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ExtractUserDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a national ID card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractUserDataInput = z.infer<typeof ExtractUserDataInputSchema>;

const ExtractUserDataOutputSchema = z.object({
  name: z.string().optional().describe('The full name of the person on the ID.'),
  email: z.string().optional().describe('The email address of the person, if available.'),
  phone: z.string().optional().describe('The phone number of the person, if available.'),
});
export type ExtractUserDataOutput = z.infer<typeof ExtractUserDataOutputSchema>;


export async function extractUserData(input: ExtractUserDataInput): Promise<ExtractUserDataOutput> {
  return extractUserDataFlow(input);
}


const prompt = ai.definePrompt({
  name: 'extractUserDataPrompt',
  input: { schema: ExtractUserDataInputSchema },
  output: { schema: ExtractUserDataOutputSchema },
  prompt: `You are an expert at extracting information from identity documents.
Analyze the provided image of a national ID card and extract the following information: full name, email address, and phone number.
If a piece of information is not present on the card, leave the corresponding field empty.

Photo: {{media url=photoDataUri}}`,
});

const extractUserDataFlow = ai.defineFlow(
  {
    name: 'extractUserDataFlow',
    inputSchema: ExtractUserDataInputSchema,
    outputSchema: ExtractUserDataOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
