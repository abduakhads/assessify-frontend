import { NextRequest, NextResponse } from 'next/server';
import { generateQuizQuestions } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, numQuestions, numAnswers, numCorrectAnswers } = body;

    // Validate inputs
    if (!text || !numQuestions || !numAnswers || !numCorrectAnswers) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const questions = await generateQuizQuestions(
      text,
      numQuestions,
      numAnswers,
      numCorrectAnswers
    );

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  }
}
