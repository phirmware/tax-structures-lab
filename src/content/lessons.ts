export interface LessonMeta {
  id: string;
  number: string;
  title: string;
  summary: string;
  minutes: number;
  patternsTouched: string[];
}

export const LESSONS: LessonMeta[] = [
  {
    id: '1-1',
    number: '1.1',
    title: 'Why entities exist',
    summary: 'Why we invented the company. Limited liability and the separation of risk.',
    minutes: 12,
    patternsTouched: ['structure'],
  },
  {
    id: '1-2',
    number: '1.2',
    title: 'Income vs. profit vs. wealth',
    summary: 'Three different things, taxed differently. Tax is on profit, not revenue.',
    minutes: 10,
    patternsTouched: ['classification'],
  },
  {
    id: '1-3',
    number: '1.3',
    title: 'The fundamental principle of tax efficiency',
    summary:
      'The three levers behind every strategy: what is taxable, when, and at which rate.',
    minutes: 15,
    patternsTouched: ['classification', 'timing', 'structure'],
  },
  {
    id: '1-4',
    number: '1.4',
    title: 'Ordinary income vs. capital gains',
    summary: 'Why the same money is taxed dramatically differently depending on its label.',
    minutes: 12,
    patternsTouched: ['classification', 'capital-gains'],
  },
  {
    id: '1-5',
    number: '1.5',
    title: 'The retention principle',
    summary: 'Money kept inside a company compounds at corporate rates, not personal ones.',
    minutes: 14,
    patternsTouched: ['retention', 'deferral'],
  },
  {
    id: '1-6',
    number: '1.6',
    title: 'Deductions — the foundation of tax efficiency',
    summary: 'Why expenses reduce tax, and where the legitimate boundary sits.',
    minutes: 12,
    patternsTouched: ['classification'],
  },
  {
    id: '1-7',
    number: '1.7',
    title: 'Timing — deferral and acceleration',
    summary: 'The time value of money applies to taxes. Pay later, pay (in real terms) less.',
    minutes: 11,
    patternsTouched: ['deferral', 'timing'],
  },
  {
    id: '1-8',
    number: '1.8',
    title: 'Why losses can be valuable',
    summary: 'A loss this year can offset profit later. Why timing matters even for bad years.',
    minutes: 9,
    patternsTouched: ['timing', 'relief'],
  },
  {
    id: '1-9',
    number: '1.9',
    title: 'Pensions and retirement accounts',
    summary: "The universal deferral pattern. One of the most underused tools founders have.",
    minutes: 13,
    patternsTouched: ['deferral', 'incentive'],
  },
  {
    id: '1-10',
    number: '1.10',
    title: 'Why governments incentivize certain activities',
    summary: 'The tax code as policy lever — R&D, pensions, green energy, investment.',
    minutes: 10,
    patternsTouched: ['incentive', 'relief'],
  },
];

export function getLessonByIndex(idx: number): LessonMeta | undefined {
  return LESSONS[idx];
}

export function getLessonById(id: string): LessonMeta | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function nextLesson(id: string): LessonMeta | undefined {
  const i = LESSONS.findIndex((l) => l.id === id);
  return i >= 0 ? LESSONS[i + 1] : undefined;
}

export function prevLesson(id: string): LessonMeta | undefined {
  const i = LESSONS.findIndex((l) => l.id === id);
  return i > 0 ? LESSONS[i - 1] : undefined;
}
