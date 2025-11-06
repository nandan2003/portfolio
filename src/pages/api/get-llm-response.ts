// src/pages/api/get-llm-response.ts
import type { APIRoute } from 'astro';

// These are your *secret* keys. Set them in your deployment environment (e.g., Vercel, Netlify, Azure SWA).
const AI_FOUNDRY_ENDPOINT = import.meta.env.AI_FOUNDRY_ENDPOINT;
const AI_FOUNDRY_API_KEY = import.meta.env.AI_FOUNDRY_API_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { userMessage } = await request.json();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    // 1. Prepare the request for the Azure AI Foundry LLM
    //    The body structure will depend on the model you deployed.
    //    This example is for a Llama-3-style chat model.
    const requestBody = {
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 150,
    };

    // 2. Call the deployed model endpoint
    const response = await fetch(AI_FOUNDRY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_FOUNDRY_API_KEY}`,
        // Note: Some endpoints might use 'azureml-model-deployment' instead of 'Authorization'
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Azure AI request failed: ${response.statusText}`);
    }

    const data = await response.json();

    // 3. Extract the text response
    //    This path depends on your model's output format.
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Could not parse AI response.');
    }

    // 4. Send the clean text response back to the frontend
    return new Response(JSON.stringify({ reply: aiResponse }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
};