import { getSettings } from './storageService';

// Curated high quality royalty-free imagery mapped to keywords
const CURATED_IMAGES = [
  { keywords: ['health', 'medical', 'hospital', 'doctor', 'clinic'], url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['tech', 'ai', 'data', 'robot', 'code', 'software'], url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['business', 'finance', 'market', 'money', 'economy'], url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['startup', 'rocket', 'launch', 'growth', 'pitch'], url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['nature', 'green', 'climate', 'sustainable', 'eco'], url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['education', 'learning', 'school', 'study', 'student'], url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['cyber', 'security', 'shield', 'protect', 'network'], url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['marketing', 'brand', 'social', 'strategy', 'sales'], url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['future', 'abstract', 'innovation', 'gradient', 'design'], url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
  { keywords: ['default'], url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80' },
];

export function getRelevantImage(text = '') {
  const lower = text.toLowerCase();
  for (const item of CURATED_IMAGES) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.url;
    }
  }
  return `https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80`;
}

/**
 * Call Google Gemini API directly
 */
async function callGemini(promptText, apiKey, model = 'gemini-3-flash-preview') {
  const candidateModels = [model, 'gemini-3-flash-preview', 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-flash-latest']
    .filter((m, i, arr) => m && arr.indexOf(m) === i);

  let lastError = null;

  for (const currentModel of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: promptText }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `Status ${response.status}`;
        if (response.status === 404 || errMsg.toLowerCase().includes('not found')) {
          lastError = new Error(errMsg);
          continue; // Try next candidate model
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response received from Gemini API');
      return text;
    } catch (err) {
      lastError = err;
      if (err.message && err.message.toLowerCase().includes('not found')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed.');
}

/**
 * Clean markdown block quotes from JSON
 */
function cleanJsonOutput(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Generate Presentation Outline using AI or intelligent generator
 */
export async function generateOutline(topic, slideCount = 5) {
  const settings = getSettings();
  const apiKey = settings?.geminiApiKey?.trim();

  if (apiKey) {
    try {
      const prompt = `
Generate a structured PowerPoint slide outline for the topic: "${topic}".
Create exactly ${slideCount} slides in total.
Each slide must include:
1. "slideNo": integer starting from 1
2. "slidePoint": concise punchy slide title (max 5 words)
3. "outline": 2-3 sentence descriptive summary explaining key points to cover

Structure requirements:
- Slide 1 should be the Title/Welcome slide.
- Slide 2 should establish the Core Problem or Agenda.
- Intermediate slides should cover Key Solutions, Deep Dive, and Measurable Impact/Metrics.
- The final slide should be a Conclusion and Call to Action/Thank You.

Return ONLY a valid JSON array of objects according to this schema:
[
  {
    "slideNo": 1,
    "slidePoint": "Title",
    "outline": "Description..."
  }
]
No markdown formatting other than the JSON block.
`;
      const aiResponse = await callGemini(prompt, apiKey, settings.model);
      const jsonStr = cleanJsonOutput(aiResponse);
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          slideNo: idx + 1,
          slidePoint: item.slidePoint || `Slide ${idx + 1}`,
          outline: item.outline || 'Key points and insights for this slide.'
        }));
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart local generator:', err);
    }
  }

  // Smart Offline Generative Engine
  return generateSmartLocalOutline(topic, slideCount);
}

/**
 * Smart Offline Generative Outline Generator
 */
function generateSmartLocalOutline(topic, slideCount = 5) {
  const cleanTopic = topic.trim() || 'Modern Innovation & Strategy';
  
  const baseOutlines = [
    {
      slideNo: 1,
      slidePoint: `${cleanTopic}`,
      outline: `Executive overview and introduction to ${cleanTopic}. Defining the landscape, core purpose, and strategic relevance.`
    },
    {
      slideNo: 2,
      slidePoint: `Market Context & Challenges`,
      outline: `Analyzing current industry pain points, operational inefficiencies, and urgent demands driving change in ${cleanTopic}.`
    },
    {
      slideNo: 3,
      slidePoint: `Key Pillars & Innovation`,
      outline: `Exploring core technical and strategic capabilities, breakthrough mechanisms, and operational best practices.`
    },
    {
      slideNo: 4,
      slidePoint: `Measurable Impact & Metrics`,
      outline: `Demonstrating quantitative outcomes: efficiency gains, return on investment, and performance metrics.`
    },
    {
      slideNo: 5,
      slidePoint: `Strategic Roadmap & Summary`,
      outline: `Key takeaways, long-term outlook, organizational action items, and open Q&A discussion.`
    }
  ];

  if (slideCount > 5) {
    baseOutlines.splice(3, 0, {
      slideNo: 4,
      slidePoint: `Case Study & Deep Dive`,
      outline: `Examining real-world implementation methodologies, step-by-step rollout framework, and stakeholder alignment.`
    });
  }

  return baseOutlines.slice(0, slideCount).map((s, idx) => ({
    ...s,
    slideNo: idx + 1
  }));
}

/**
 * Generate Full Slides from Outline
 */
export async function generateSlidesFromOutline(outline, topic, theme) {
  const settings = getSettings();
  const apiKey = settings?.geminiApiKey?.trim();
  const slides = [];

  for (let i = 0; i < outline.length; i++) {
    const item = outline[i];
    const isFirst = i === 0;
    const isLast = i === outline.length - 1;

    // Pick appropriate layout based on slide index and content
    let layout = 'split-image';
    if (isFirst) layout = 'title';
    else if (isLast) layout = 'thank-you';
    else if (i === 1) layout = 'grid-3';
    else if (i === 2) layout = 'two-column';
    else if (i === 3) layout = 'metrics';

    let slideContent = null;

    if (apiKey) {
      try {
        const slidePrompt = `
Generate slide presentation content in JSON format for slide #${item.slideNo}.
Topic: "${topic}"
Slide Title: "${item.slidePoint}"
Slide Outline: "${item.outline}"
Layout Style: "${layout}"

Return JSON matching this schema:
{
  "title": "${item.slidePoint}",
  "subtitle": "Clear, informative subtitle",
  "badge": "Category / Tag (e.g. Overview, Key Insight, Metrics, Strategy)",
  "bullets": ["Point 1 (action-oriented)", "Point 2 (data-supported)", "Point 3 (clear takeaway)"],
  "cards": [
    {"title": "Pillar 1", "desc": "Concise detail...", "tag": "Core"},
    {"title": "Pillar 2", "desc": "Concise detail...", "tag": "Strategy"},
    {"title": "Pillar 3", "desc": "Concise detail...", "tag": "Execution"}
  ],
  "metrics": [
    {"label": "Key Metric", "value": "+45%", "subtext": "Year-over-year increase"},
    {"label": "Cost Savings", "value": "3.5x", "subtext": "Efficiency multiple"}
  ],
  "col1Title": "Primary Perspective",
  "col1Points": ["First key insight", "Supporting fact"],
  "col2Title": "Strategic Response",
  "col2Points": ["Execution detail", "Expected outcome"],
  "notes": "Speaker notes for the presenter covering key talking points."
}
No markdown outside of valid JSON.
`;
        const res = await callGemini(slidePrompt, apiKey, settings.model);
        slideContent = JSON.parse(cleanJsonOutput(res));
      } catch (err) {
        console.warn(`Gemini generation for slide ${i+1} failed, using local generator:`, err);
      }
    }

    if (!slideContent) {
      slideContent = generateLocalSlideContent(item, i, outline.length, topic);
    }

    slides.push({
      id: `slide-${i + 1}-${Date.now().toString(36)}`,
      slideNo: i + 1,
      layout,
      title: slideContent.title || item.slidePoint,
      subtitle: slideContent.subtitle || item.outline.slice(0, 100),
      badge: slideContent.badge || (isFirst ? 'Introduction' : isLast ? 'Conclusion' : `Phase ${i}`),
      bullets: slideContent.bullets || [
        `Key milestone in ${item.slidePoint}`,
        'Demonstrating significant improvements in operational throughput',
        'Built with scalable, future-proof design principles'
      ],
      cards: slideContent.cards || [
        { title: 'Core Strategy', desc: `Targeted approaches for ${topic}`, tag: 'Pillar 1' },
        { title: 'Implementation', desc: 'Seamless integration with existing frameworks', tag: 'Pillar 2' },
        { title: 'Optimization', desc: 'Continuous feedback loops and metric tracking', tag: 'Pillar 3' }
      ],
      metrics: slideContent.metrics || [
        { label: 'Efficiency Gain', value: '+85%', subtext: 'Compared to legacy workflows' },
        { label: 'Time Saved', value: '12 hrs', subtext: 'Per team per week' },
        { label: 'Accuracy', value: '99.4%', subtext: 'Verified outcome rate' }
      ],
      col1Title: slideContent.col1Title || 'Current State',
      col1Points: slideContent.col1Points || [
        'Manual processes leading to bottlenecks',
        'Fragmented information and inconsistent data points',
        'High latency in turnaround times'
      ],
      col2Title: slideContent.col2Title || 'Future Vision',
      col2Points: slideContent.col2Points || [
        'Automated workflows driving rapid decision-making',
        'Centralized, reliable intelligence repository',
        'Accelerated delivery with measurable ROI'
      ],
      notes: slideContent.notes || `Presenter notes for ${item.slidePoint}: Guide the audience through the key findings, highlighting practical applicability.`,
      image: getRelevantImage(`${topic} ${item.slidePoint}`)
    });
  }

  return slides;
}

/**
 * Local Fallback Slide Content Generator
 */
function generateLocalSlideContent(item, index, total, topic) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (isFirst) {
    return {
      title: item.slidePoint,
      subtitle: `A Comprehensive Analysis & Strategic Guide to ${topic}`,
      badge: 'Executive Briefing',
      bullets: [
        'Unpacking modern trends and strategic imperatives',
        'Evidence-based methodologies and actionable takeaways',
        'Framework for cross-functional alignment and execution'
      ],
      notes: `Welcome everyone. Today we are presenting a strategic deep dive into ${topic}.`
    };
  }

  if (isLast) {
    return {
      title: item.slidePoint,
      subtitle: `Driving Immediate Value & Long-Term Excellence in ${topic}`,
      badge: 'Summary & Q&A',
      bullets: [
        'Recap of primary strategic pillars and implementation phases',
        'Next steps: establish cross-functional pilot teams within 30 days',
        'Open forum for stakeholder questions and technical inquiries'
      ],
      notes: 'Conclude with a strong call to action and open the floor for questions.'
    };
  }

  return {
    title: item.slidePoint,
    subtitle: item.outline,
    badge: `Step 0${index}`,
    bullets: [
      `Systematic approach to optimizing ${item.slidePoint}`,
      'Quantifiable benchmarks demonstrating consistent productivity gains',
      'Minimizing operational friction through proactive risk mitigation'
    ],
    cards: [
      { title: 'Foundational Discovery', desc: 'Assessing root causes and defining high-impact opportunities.', tag: 'Phase 1' },
      { title: 'Rapid Prototyping', desc: 'Validating concepts with minimal overhead and rapid iteration.', tag: 'Phase 2' },
      { title: 'Scaled Rollout', desc: 'Deploying across organizational tiers with comprehensive telemetry.', tag: 'Phase 3' }
    ],
    metrics: [
      { label: 'Cycle Speed', value: '3.8x', subtext: 'Accelerated turnaround' },
      { label: 'Error Margin', value: '< 0.5%', subtext: 'Quality threshold' },
      { label: 'Adoption Rate', value: '94%', subtext: 'User satisfaction' }
    ],
    col1Title: 'Key Challenges',
    col1Points: [
      'Siloed infrastructure limiting transparency',
      'Unstructured data causing decision delays',
      'Resource constraints impacting scale'
    ],
    col2Title: 'Target Solutions',
    col2Points: [
      'Unified data fabric and real-time dashboards',
      'Automated intelligence pipeline for fast synthesis',
      'Modular architecture enabling rapid scaling'
    ],
    notes: `Discuss the key insights in ${item.slidePoint}. Emphasize the tangible business outcomes.`
  };
}

/**
 * Inline AI Slide Editor (e.g., rephrase, add points, change tone)
 */
export async function editSlideWithAi(slide, instruction, theme) {
  const settings = getSettings();
  const apiKey = settings?.geminiApiKey?.trim();

  if (apiKey) {
    try {
      const prompt = `
You are an expert presentation designer. Refine this slide based on the user instruction.
User Instruction: "${instruction}"

Current Slide Data:
${JSON.stringify(slide, null, 2)}

Return an updated JSON object maintaining the same schema (title, subtitle, badge, bullets, cards, metrics, notes).
Only return valid JSON with no markdown wrapping.
`;
      const res = await callGemini(prompt, apiKey, settings.model);
      const updated = JSON.parse(cleanJsonOutput(res));
      return {
        ...slide,
        ...updated,
        id: slide.id,
        slideNo: slide.slideNo,
        layout: updated.layout || slide.layout
      };
    } catch (err) {
      console.warn('AI inline edit failed, falling back to heuristic editor:', err);
    }
  }

  // Heuristic Local Inline Editor
  const lowerInst = instruction.toLowerCase();
  const modified = { ...slide };

  if (lowerInst.includes('concise') || lowerInst.includes('shorter') || lowerInst.includes('summary')) {
    modified.subtitle = modified.subtitle ? modified.subtitle.slice(0, 60) + '...' : modified.subtitle;
    modified.bullets = (modified.bullets || []).map(b => b.split(' ').slice(0, 6).join(' ') + '.');
  } else if (lowerInst.includes('stat') || lowerInst.includes('metric') || lowerInst.includes('number')) {
    modified.layout = 'metrics';
    modified.metrics = [
      { label: 'Performance', value: '+74%', subtext: 'Verified improvement' },
      { label: 'Time Saved', value: '4.2x', subtext: 'Efficiency multiplier' },
      { label: 'Success Rate', value: '98.5%', subtext: 'Customer satisfaction' }
    ];
  } else if (lowerInst.includes('grid') || lowerInst.includes('card')) {
    modified.layout = 'grid-3';
  } else if (lowerInst.includes('split') || lowerInst.includes('image')) {
    modified.layout = 'split-image';
  } else if (lowerInst.includes('bullet') || lowerInst.includes('point')) {
    modified.bullets = [
      ...(modified.bullets || []),
      `Enhanced perspective: ${instruction.slice(0, 40)}`
    ].slice(0, 4);
  } else {
    modified.title = `${modified.title}`;
    modified.badge = 'AI Refined';
    modified.notes = `${modified.notes} [AI Note: ${instruction}]`;
  }

  return modified;
}
