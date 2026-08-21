import {
  AssessmentQuestion,
  Article,
  Doctor,
  ProgressPhoto,
  SkinResult,
  UserProfile,
  Appointment,
} from "./types";

// NOTE: Placeholder photography only. Replace with licensed editorial
// photography of real Black skin per the Chael brand photography guidelines
// before shipping to production.
const ph = (seed: string, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const user: UserProfile = {
  name: "Rae",
  email: "rae@chael.app",
  photoUrl: ph("rae-profile", 400, 400),
  streakDays: 12,
  goals: ["Even out jawline breakouts", "Build a calmer nighttime routine"],
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "onset",
    prompt: "When did this breakout start?",
    options: [
      { id: "week", label: "In the last week" },
      { id: "two-weeks", label: "1–2 weeks ago" },
      { id: "month", label: "2–4 weeks ago" },
      { id: "longer", label: "More than a month ago" },
    ],
  },
  {
    id: "pattern",
    prompt: "Have you noticed a pattern to when it flares up?",
    options: [
      { id: "cycle", label: "Around my cycle" },
      { id: "stress", label: "During stressful weeks" },
      { id: "product", label: "After trying a new product" },
      { id: "no-pattern", label: "No pattern I've noticed" },
    ],
  },
  {
    id: "texture",
    prompt: "How would you describe the texture?",
    options: [
      { id: "bumpy", label: "Small, bumpy, under the skin" },
      { id: "inflamed", label: "Red and inflamed" },
      { id: "blackheads", label: "Mostly blackheads" },
      { id: "mixed", label: "A mix of everything" },
    ],
  },
  {
    id: "routine",
    prompt: "How often are you cleansing right now?",
    options: [
      { id: "once", label: "Once a day" },
      { id: "twice", label: "Twice a day" },
      { id: "inconsistent", label: "Inconsistently" },
      { id: "none", label: "I don't have a routine yet" },
    ],
  },
];

export const latestResult: SkinResult = {
  id: "result-1",
  date: new Date().toISOString(),
  condition: "Inflammatory acne",
  location: "jawline and chin",
  severity: "moderate",

  contributors: [
    { label: "Hormonal", level: "high" },
    { label: "Stress", level: "medium" },
    { label: "Diet", level: "low" },
    { label: "Skincare product", level: "low" },
    { label: "Lifestyle", level: "low" },
  ],
  summary:
    "Inflammatory acne appears most visible around the jawline. Pores in this area look blocked and irritated, consistent with a hormonal pattern.",
  explanation:
    "This usually shows up when pores become blocked with oil and dead skin, then inflamed by bacteria. The jawline concentration and timing you described both point toward a hormonal contributor, with stress likely making it harder to settle.",
    see_derm: false,
    derm_reason: null,
};


export const articles: Article[] = [
  {
    id: "hormonal-acne",
    title: "Understanding hormonal acne along the jawline",
    excerpt:
      "Why breakouts cluster along the jaw and chin, and what actually helps over time.",
    readTime: "6 min read",
    category: "Acne",
    imageUrl: ph("article-hormonal", 900, 600),
  },
  {
    id: "post-inflammatory",
    title: "Caring for post-inflammatory marks on deeper skin tones",
    excerpt:
      "The difference between a mark that will fade and one that needs support.",
    readTime: "5 min read",
    category: "Hyperpigmentation",
    imageUrl: ph("article-marks", 900, 600),
  },
  {
    id: "gentle-routine",
    title: "Building a routine that calms, not strips",
    excerpt: "A simple order of operations for irritated, reactive skin.",
    readTime: "4 min read",
    category: "Routine",
    imageUrl: ph("article-routine", 900, 600),
  },
];

export const progressPhotos: ProgressPhoto[] = [
  { id: "p1", date: "2026-05-01", imageUrl: ph("progress-may1", 700, 900), note: "Starting point" },
  { id: "p2", date: "2026-05-15", imageUrl: ph("progress-may15", 700, 900) },
  { id: "p3", date: "2026-06-13", imageUrl: ph("progress-jun13", 700, 900), note: "Jawline calming down" },
];

export const appointments: Appointment[] = [
  {
    id: "appt-1",
    doctorId: "amina-adeyemi",
    date: "2026-06-20",
    time: "10:00 AM",
    type: "in-person",
    reason: "Acne consultation",
    status: "upcoming",
  },
];

export const progressSeries = [
  { label: "May 1", value: 42 },
  { label: "May 8", value: 48 },
  { label: "May 15", value: 55 },
  { label: "May 22", value: 51 },
  { label: "May 30", value: 63 },
  { label: "Jun 6", value: 70 },
  { label: "Jun 13", value: 78 },
];
