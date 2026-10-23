const PROJECTS_KEY = 'slidegenius_projects_v1';
const SETTINGS_KEY = 'slidegenius_settings_v1';

const INITIAL_PROJECTS = [
  {
    id: 'demo-ai-healthcare',
    title: 'AI in Healthcare: Transforming Patient Outcomes',
    topic: 'How Artificial Intelligence is revolutionizing modern healthcare, diagnostics, and patient treatment.',
    themeId: 'professional-blue',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    outline: [
      {
        slideNo: 1,
        slidePoint: 'AI in Healthcare',
        outline: 'Introduction to artificial intelligence applications in modern healthcare, clinical workflows, and patient impact.'
      },
      {
        slideNo: 2,
        slidePoint: 'Key Drivers of Clinical AI',
        outline: 'Why healthcare systems are accelerating AI adoption: diagnostic precision, workforce shortages, and medical imaging advances.'
      },
      {
        slideNo: 3,
        slidePoint: 'Core Applications & Diagnostics',
        outline: 'Medical computer vision for radiology, predictive triage for ICU admissions, and automated pathological screening.'
      },
      {
        slideNo: 4,
        slidePoint: 'Measurable Clinical Impact',
        outline: 'Data metrics showing reduction in diagnostic delay, improved early detection rates, and lower readmission statistics.'
      },
      {
        slideNo: 5,
        slidePoint: 'Future Roadmap & Ethics',
        outline: 'Addressing patient privacy, algorithmic bias, FDA regulatory approvals, and doctor-in-the-loop collaborative systems.'
      },
      {
        slideNo: 6,
        slidePoint: 'Conclusion & Next Steps',
        outline: 'Summary of clinical transformation and key action steps for healthcare leaders deploying AI solutions.'
      }
    ],
    slides: [
      {
        id: 'slide-1',
        slideNo: 1,
        layout: 'title',
        title: 'AI in Healthcare',
        subtitle: 'Transforming Patient Outcomes & Diagnostic Precision in Modern Medicine',
        badge: 'Executive Briefing',
        bullets: [
          'Harnessing deep learning algorithms to support clinical diagnosis',
          'Accelerating drug discovery timelines from years to months',
          'Empowering physicians with real-time predictive analytics'
        ],
        metrics: [
          { label: 'Diagnostic Speed', value: '4.5x' },
          { label: 'Error Reduction', value: '-38%' },
          { label: 'Global Market', value: '$187B' }
        ],
        notes: 'Welcome everyone. Today we are diving into how AI is moving from theoretical research to frontline clinical impact.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-2',
        slideNo: 2,
        layout: 'grid-3',
        title: 'Key Drivers of Clinical Adoption',
        subtitle: 'Critical pressures pushing healthcare systems toward intelligent automation',
        badge: 'Industry Landscape',
        cards: [
          {
            title: 'Diagnostic Precision',
            desc: 'Neural networks detect early micro-tumors and subtle vascular anomalies days before human review.',
            tag: 'Diagnostics'
          },
          {
            title: 'Workforce Relief',
            desc: 'Automating administrative charting and radiologist triage reduces physician burnout by over 40%.',
            tag: 'Operations'
          },
          {
            title: 'Personalized Therapeutics',
            desc: 'Genomic matching matches complex oncological profiles to optimal targeted therapies instantaneously.',
            tag: 'Genomics'
          }
        ],
        notes: 'The three pillars driving hospital adoption are diagnostic accuracy, reducing physician burnout, and targeted therapies.',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-3',
        slideNo: 3,
        layout: 'split-image',
        title: 'Core Diagnostic Applications',
        subtitle: 'From pixel-level radiology detection to bedside early-warning alerts',
        badge: 'Clinical Workflows',
        bullets: [
          'Radiology AI screening CT scans for pulmonary embolisms with 97.4% sensitivity',
          'Automated ophthalmology scans detecting diabetic retinopathy in under 60 seconds',
          'Continuous ICU vital stream monitoring providing 4-hour sepsis early warnings'
        ],
        notes: 'Highlight the speed at which radiology scans are pre-screened to ensure critical findings receive immediate attention.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-4',
        slideNo: 4,
        layout: 'metrics',
        title: 'Measurable Clinical Impact',
        subtitle: 'Proven clinical outcomes across multi-center hospital deployments',
        badge: 'Real-World Results',
        metrics: [
          { label: 'Time to Triage', value: '-62%', subtext: 'From 48 min down to 18 min' },
          { label: 'Early Detection Rate', value: '+31%', subtext: 'In stage-1 oncology screenings' },
          { label: 'Hospital Readmission', value: '-24%', subtext: 'Through automated discharge follow-up' },
          { label: 'Annual Cost Savings', value: '$3.2M', subtext: 'Average per 500-bed hospital' }
        ],
        notes: 'These metrics represent real hospital operational data following a 12-month pilot integration.',
        image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-5',
        slideNo: 5,
        layout: 'two-column',
        title: 'Ethical Frontiers & Regulatory Safeguards',
        subtitle: 'Balancing rapid innovation with patient trust and clinical safety',
        badge: 'Governance',
        col1Title: 'Key Challenges',
        col1Points: [
          'Algorithmic bias across underrepresented patient demographics',
          'Black-box opacity hindering physician confidence in critical decisions',
          'Complex HIPAA / GDPR compliance across multi-site federated data'
        ],
        col2Title: 'Strategic Solutions',
        col2Points: [
          'Rigorous multi-ethnic validation datasets and fairness audits',
          'Explainable AI (XAI) overlays showing heatmaps of decision evidence',
          'Human-in-the-loop mandate: AI serves as copilot, not sole authority'
        ],
        notes: 'Emphasize that ethical AI is not an afterthought; human-in-the-loop oversight is mandatory.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-6',
        slideNo: 6,
        layout: 'thank-you',
        title: 'Thank You for Your Attention',
        subtitle: 'Shaping the Future of Intelligent & Compassionate Medicine Together',
        badge: 'Q&A & Discussion',
        bullets: [
          'Contact: healthcare-ai@hospital-innovations.org',
          'Whitepaper: https://github.com/sourav739397/CSE4204-8A-T01-AI-Based-PPT-Slide-Generator',
          'Open Source & Free Presentation Platform'
        ],
        notes: 'Open the floor for questions regarding implementation timelines and IT requirements.',
        image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=900&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export function getAllRawProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    const projects = JSON.parse(raw);
    return Array.isArray(projects) ? projects : INITIAL_PROJECTS;
  } catch (err) {
    console.error('Error reading projects from storage:', err);
    return INITIAL_PROJECTS;
  }
}

export function getProjects(userId = null) {
  const allProjects = getAllRawProjects();
  if (!userId) {
    return allProjects;
  }

  // Filter projects for this user, or unassigned legacy projects
  let userProjects = allProjects.filter(p => p.userId === userId || !p.userId);

  // If this user has no projects yet, generate a starter presentation for them
  if (userProjects.length === 0) {
    const userStarter = {
      ...INITIAL_PROJECTS[0],
      id: 'proj-welcome-' + userId.replace(/[^a-zA-Z0-9]/g, '').slice(-6),
      userId,
      title: 'Welcome to SlideGenius: AI Presentation Tour',
      topic: 'Getting started with AI presentation generation, slide editing, and PPTX export.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [userStarter, ...allProjects];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return [userStarter];
  }

  return userProjects;
}

export function getProjectById(id, userId = null) {
  const projects = getAllRawProjects();
  const proj = projects.find(p => p.id === id);
  return proj || null;
}

export function saveProject(project, userId = null) {
  const projects = getAllRawProjects();
  const index = projects.findIndex(p => p.id === project.id);
  const updated = {
    ...project,
    userId: userId || project.userId || 'guest',
    updatedAt: new Date().toISOString()
  };

  let newProjects;
  if (index >= 0) {
    newProjects = [...projects];
    newProjects[index] = updated;
  } else {
    newProjects = [updated, ...projects];
  }

  localStorage.setItem(PROJECTS_KEY, JSON.stringify(newProjects));
  return updated;
}

export function deleteProject(id, userId = null) {
  const projects = getAllRawProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
  return userId ? filtered.filter(p => p.userId === userId) : filtered;
}

export function duplicateProject(id, userId = null) {
  const project = getProjectById(id);
  if (!project) return null;

  const duplicated = {
    ...project,
    id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    userId: userId || project.userId || 'guest',
    title: `${project.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return saveProject(duplicated, duplicated.userId);
}

export function getUserStats(userId) {
  const projects = getProjects(userId);
  const totalSlides = projects.reduce((acc, p) => acc + (p.slides?.length || 0), 0);
  return {
    totalProjects: projects.length,
    totalSlides,
    lastActive: projects[0]?.updatedAt || new Date().toISOString()
  };
}

export function getSettings() {
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || '';
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      const defaultSettings = {
        geminiApiKey: envKey,
        model: 'gemini-3-flash-preview',
        useMockFallback: true,
        autoSave: true
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.geminiApiKey && envKey) {
      parsed.geminiApiKey = envKey;
    }
    if (!parsed.model || parsed.model === 'gemini-1.5-flash' || parsed.model === 'gemini-2.0-flash') {
      parsed.model = 'gemini-3-flash-preview';
    }
    return parsed;
  } catch (e) {
    return {
      geminiApiKey: envKey,
      model: 'gemini-3-flash-preview',
      useMockFallback: true,
      autoSave: true
    };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

