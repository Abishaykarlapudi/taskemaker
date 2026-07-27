export const BLOOM_LEVELS = {
  1: {
    id: 1,
    key: 'REMEMBER',
    name: 'Remember',
    subtitle: 'Recall & Memorize',
    description: 'Retrieve facts, syntax rules, HTTP status codes, annotations, and definitions.',
    verbs: ['Recall', 'List', 'Define', 'Memorize', 'Identify', 'State', 'Repeat', 'Label'],
    color: '#6366f1', // Indigo
    lightBg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.3)',
    weight: 1,
    icon: 'Brain',
    upgradeSuggestion: 'Convert into an "Understand" task by explaining this concept in your own words or diagramming it.'
  },
  2: {
    id: 2,
    key: 'UNDERSTAND',
    name: 'Understand',
    subtitle: 'Explain & Summarize',
    description: 'Explain ideas or concepts, describe JVM architecture, summarize OOP principles, or sketch API flows.',
    verbs: ['Explain', 'Summarize', 'Classify', 'Outline', 'Interpret', 'Discuss', 'Translate', 'Illustrate'],
    color: '#06b6d4', // Cyan
    lightBg: 'rgba(6, 182, 212, 0.12)',
    border: 'rgba(6, 182, 212, 0.3)',
    weight: 2,
    icon: 'Lightbulb',
    upgradeSuggestion: 'Convert into an "Apply" task by writing code to demonstrate this concept in Java/React.'
  },
  3: {
    id: 3,
    key: 'APPLY',
    name: 'Apply',
    subtitle: 'Execute & Implement',
    description: 'Write working code, implement Spring Boot REST endpoints, execute SQL joins, solve DSA problems.',
    verbs: ['Implement', 'Execute', 'Build', 'Solve', 'Demonstrate', 'Use', 'Run', 'Operate'],
    color: '#10b981', // Emerald
    lightBg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    weight: 3,
    icon: 'Zap',
    upgradeSuggestion: 'Convert into an "Analyze" task by profiling performance or debugging edge cases.'
  },
  4: {
    id: 4,
    key: 'ANALYZE',
    name: 'Analyze',
    subtitle: 'Debug & Dissect',
    description: 'Debug stack traces, profile slow SQL queries, dissect library code, compare Spring Bean scopes.',
    verbs: ['Debug', 'Dissect', 'Compare', 'Inspect', 'Audit', 'Differentiate', 'Troubleshoot', 'Deconstruct'],
    color: '#f59e0b', // Amber
    lightBg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
    weight: 4,
    icon: 'Search',
    upgradeSuggestion: 'Convert into an "Evaluate" task by writing a code review or benchmarking architectural alternatives.'
  },
  5: {
    id: 5,
    key: 'EVALUATE',
    name: 'Evaluate',
    subtitle: 'Critique & Appraise',
    description: 'Review peer code, assess API security configurations, benchmark JPA vs Native SQL, evaluate trade-offs.',
    verbs: ['Critique', 'Benchmark', 'Assess', 'Appraise', 'Justify', 'Review', 'Validate', 'Rate'],
    color: '#f97316', // Orange
    lightBg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.3)',
    weight: 5,
    icon: 'Scale',
    upgradeSuggestion: 'Convert into a "Create" task by designing a reusable template or custom framework solution.'
  },
  6: {
    id: 6,
    key: 'CREATE',
    name: 'Create',
    subtitle: 'Design & Innovate',
    description: 'Design full-stack microservices, build capstone web apps, author technical guides, create new systems.',
    verbs: ['Design', 'Construct', 'Author', 'Innovate', 'Formulate', 'Compose', 'Devise', 'Architect'],
    color: '#ec4899', // Pink / Rose
    lightBg: 'rgba(236, 72, 153, 0.12)',
    border: 'rgba(236, 72, 153, 0.3)',
    weight: 6,
    icon: 'Sparkles',
    upgradeSuggestion: 'You are at the highest cognitive level! Focus on polishing and sharing your creation on GitHub.'
  }
};

export const TASK_TRACKS = {
  INSTITUTE: {
    id: 'INSTITUTE',
    label: 'Institute Course Assignment',
    badgeColor: '#3b82f6',
    icon: 'GraduationCap',
    description: 'Tasks assigned by your Java Full-Stack institute'
  },
  PERSONAL: {
    id: 'PERSONAL',
    label: 'Personal Daily Goal',
    badgeColor: '#a855f7',
    icon: 'UserCheck',
    description: 'Self-study, personal habits, DSA practice & projects'
  }
};

export const JAVA_FULLSTACK_SUGGESTIONS = [
  { levelId: 1, title: 'Recall Spring Boot annotations (@RestController, @Autowired, @Entity)' },
  { levelId: 1, title: 'Memorize common HTTP status codes (200, 201, 400, 401, 404, 500)' },
  { levelId: 2, title: 'Explain JVM Heap vs Stack memory allocation in notes' },
  { levelId: 2, title: 'Outline OOP Polymorphism with a real-world Java example' },
  { levelId: 3, title: 'Implement a Spring Boot REST API for User CRUD Operations' },
  { levelId: 3, title: 'Build a React Data Table component consuming Spring API' },
  { levelId: 4, title: 'Debug a NullPointerException in Spring Service layer' },
  { levelId: 4, title: 'Inspect and compare SQL INNER JOIN vs LEFT JOIN execution plan' },
  { levelId: 5, title: 'Critique and refactor monolithic Java method into clean SOLID code' },
  { levelId: 5, title: 'Benchmark Spring Data JPA query execution vs Native SQL' },
  { levelId: 6, title: 'Design & build an E-Commerce Full-Stack Microservice Capstone' },
  { levelId: 6, title: 'Architect a custom Authentication system using Spring Security & JWT' }
];

export function calculateCognitiveScore(tasks) {
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  if (completedTasks.length === 0) return 0;
  
  let totalWeightedScore = 0;
  completedTasks.forEach(task => {
    const levelObj = BLOOM_LEVELS[task.bloomLevel] || BLOOM_LEVELS[1];
    const painMultiplier = task.painRating ? (1 + task.painRating * 0.1) : 1;
    totalWeightedScore += levelObj.weight * 10 * painMultiplier;
  });

  return Math.round(totalWeightedScore);
}
