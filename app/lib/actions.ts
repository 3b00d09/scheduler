'use server';

import OpenAI from 'openai';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { systemPrompt } from './utils';
import { StudyPlanSchema, type StudyPlan } from './schema';

export async function generateStudyPlan(
  inputText: string,
  apiKey: string
): Promise<
  { success: true; plan: StudyPlan } | { success: false; error: string }
> {
  try {
    if (!inputText || !apiKey) {
      return { success: false, error: 'Missing required fields' };
    }

    if (!apiKey.startsWith('sk-')) {
      return { success: false, error: 'Invalid API key format' };
    }

    const openai = new OpenAI({ apiKey });

    const today = new Date();
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDay = daysOfWeek[today.getDay()];
    const currentDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: `Today is ${currentDay}, ${currentDate}.

My schedule:
${inputText}

Create a complete weekly plan starting from this Monday. Make sure:
1. Every single hour from 6:00 AM to midnight is planned
2. Include realistic wake up times, meal times, and travel times
3. Don't skip hours - if I have class at 12:00, plan what I'm doing from 6:00-12:00
4. Add specific study goals for each study session
5. Be realistic about energy levels after work shifts`,
    },
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'study_plan',
      schema: {
        ...zodToJsonSchema(StudyPlanSchema),
        additionalProperties: false,
      },
      strict:false,
    },
  },
});

    const content = completion.choices[0].message.content;
    if (!content) {
      return { success: false, error: 'No response from AI' };
    }

    const plan = StudyPlanSchema.parse(JSON.parse(content));

    return { success: true, plan };
  } catch (error: any) {
    console.error('OpenAI Error:', error);

    if (error.status === 401 || error.message?.includes('Incorrect')) {
      return { success: false, error: 'Invalid API key' };
    }

    if (error.status === 429) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please try again.',
      };
    }

    if (
      error.code === 'insufficient_quota' ||
      error.message?.includes('quota')
    ) {
      return {
        success: false,
        error: 'Out of OpenAI credits. Please add credits to your account.',
      };
    }

    if (error.message?.includes('model')) {
      return { success: false, error: 'Model not available' };
    }

    return {
      success: false,
      error: error.message || 'Failed to generate plan',
    };
  }
}