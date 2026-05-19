import Anthropic from '@anthropic-ai/sdk';
import type { DepartmentKey, Policy } from './design';

const EXTRACT_PROMPT = `You are processing a policy document for Mosaic Youth Theatre of Detroit's Policy Portal.

Read the attached PDF carefully and return a single JSON object with this exact structure. Nothing else — no markdown fences, no preamble, just the JSON.

{
  "title": "Short clear title in plain English. Maximum 10 words. Sentence case, no period.",
  "department": "Exactly one of: HR, Admin, Finance, Development, Programs, Productions, Operations",
  "summary": "Plain-English summary written for a staff member or family. 2-3 sentences. No jargon, no marketing tone, no rhetorical flourishes. Just say what the policy does.",
  "clauses": [
    {
      "title": "Short clause heading, 2-5 words",
      "text": "The substantive content of this clause, rewritten clearly while preserving every meaningful detail (dates, dollar amounts, timeframes, eligibility criteria).",
      "callout": null
    }
  ],
  "tags": ["3 to 5 short topical tags"],
  "adopted_date": "YYYY-MM-DD if found in the document, else null",
  "applies_to": "Who the policy applies to (e.g. 'All staff', 'All productions', 'All students and families')",
  "length_pages": 4
}

Choose department by subject matter, not where the document was filed.
Use the "callout" field on a clause only when there's a genuinely important warning or exception worth flagging.
If text is unclear, do your best and note uncertainty briefly in the summary.

Begin your response with { and end with }.`;

export interface ExtractedPolicy {
  title: string;
  department: DepartmentKey;
  summary: string;
  clauses: Array<{ title: string; text: string; callout: string | null }>;
  tags: string[];
  adopted_date: string | null;
  applies_to: string;
  length_pages: number;
}

const VALID_DEPTS: DepartmentKey[] = ['HR','Admin','Finance','Development','Programs','Productions','Operations'];

export async function extractPolicyFromPDF(pdfBase64: string): Promise<ExtractedPolicy> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{
      role: 'user',
      content: [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
        { type: 'text', text: EXTRACT_PROMPT },
      ],
    }],
  });

  const textBlock = response.content.find(c => c.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in API response');
  }

  let raw = textBlock.text.trim();
  raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```\s*$/, '');
  const match = raw.match(/\{[\s\S]*\}/);
  if (match) raw = match[0];

  let parsed: ExtractedPolicy;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Claude returned non-JSON: ${raw.slice(0, 200)}`);
  }

  // Validate
  if (!parsed.title || typeof parsed.title !== 'string') throw new Error('Missing or invalid title');
  if (!VALID_DEPTS.includes(parsed.department)) throw new Error(`Invalid department: ${parsed.department}`);
  if (!parsed.summary || typeof parsed.summary !== 'string') throw new Error('Missing summary');
  if (!Array.isArray(parsed.clauses)) parsed.clauses = [];
  if (!Array.isArray(parsed.tags)) parsed.tags = [];

  return parsed;
}
