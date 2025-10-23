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
  frontPhotoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the front of a national ID card, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  backPhotoDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of the back of a national ID card, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractUserDataInput = z.infer<typeof ExtractUserDataInputSchema>;

const ExtractUserDataOutputSchema = z.object({
  name: z.string().optional().describe('The full name of the person on the ID.'),
  email: z.string().optional().describe('The email address of the person, if available.'),
  phone: z.string().optional().describe('The phone number of the person, if available.'),
  address: z.string().optional().describe('The full address of the person, if available.'),
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
Analyze the provided images of a national ID card and extract the following information: full name, email address, phone number, and address.
The full name and email are likely on the front. The address and phone number are likely on the back.
If a piece of information is not present on the card, leave the corresponding field empty.

Front Photo: {{#if frontPhotoDataUri}}{{media url=frontPhotoDataUri}}{{else}}Not provided.{{/if}}
Back Photo: {{#if backPhotoDataUri}}{{media url=backPhotoDataUri}}{{else}}Not provided.{{/if}}`,
});

const extractUserDataFlow = ai.defineFlow(
  {
    name: 'extractUserDataFlow',
    inputSchema: ExtractUserDataInputSchema,
    outputSchema: ExtractUserDataOutputSchema,
  },
  async input => {
    if (!input.frontPhotoDataUri && !input.backPhotoDataUri) {
        throw new Error("At least one ID photo must be provided.");
    }
    const { output } = await prompt(input);
    return output!;
  }
);
