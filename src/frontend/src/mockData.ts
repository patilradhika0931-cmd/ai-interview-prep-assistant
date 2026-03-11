export type Role =
  | "Software Developer"
  | "Data Analyst"
  | "AI Engineer"
  | "Web Developer";
export type Topic =
  | "Python"
  | "DSA"
  | "Web Development"
  | "AI/ML"
  | "System Design"
  | "Behavioral";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  question: string;
  modelAnswer: string;
  difficulty: Difficulty;
  category: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  tip: string;
}

export interface FeedbackTemplate {
  score: number;
  correctness: string;
  communication: string;
  improvements: string[];
  strengths: string[];
}

export interface SessionHistory {
  id: string;
  date: string;
  role: Role;
  score: number;
  questionsAnswered: number;
  status: "Completed" | "In Progress";
}

// Interview question banks per role
export const interviewQuestions: Record<Role, InterviewQuestion[]> = {
  "Software Developer": [
    {
      id: "sd1",
      question:
        "Explain the concept of Object-Oriented Programming and its four pillars.",
      tip: "Think about Encapsulation, Abstraction, Inheritance, and Polymorphism with real examples.",
    },
    {
      id: "sd2",
      question:
        "What is the difference between a stack and a queue? When would you use each?",
      tip: "Use LIFO vs FIFO analogy. Mention real-world use cases like undo operations or task scheduling.",
    },
    {
      id: "sd3",
      question:
        "Describe the time complexity of common sorting algorithms. Which one would you choose for a nearly-sorted array?",
      tip: "Compare Quicksort, Mergesort, and Insertion sort. Mention why Insertion sort is optimal for nearly-sorted data.",
    },
    {
      id: "sd4",
      question:
        "What are design patterns? Explain the Singleton and Observer patterns.",
      tip: "Define design patterns as reusable solutions. Give practical code-level examples.",
    },
    {
      id: "sd5",
      question:
        "How would you debug a memory leak in a production application?",
      tip: "Discuss profiling tools, heap dumps, monitoring metrics, and systematic elimination approach.",
    },
  ],
  "Data Analyst": [
    {
      id: "da1",
      question:
        "Explain the difference between descriptive, predictive, and prescriptive analytics.",
      tip: "Use the 'what happened, what will happen, what should we do' framework.",
    },
    {
      id: "da2",
      question:
        "How would you handle missing data in a dataset before analysis?",
      tip: "Discuss imputation techniques, dropping strategies, and when each is appropriate.",
    },
    {
      id: "da3",
      question:
        "What is the difference between correlation and causation? Give an example.",
      tip: "Use the classic ice cream/drowning example. Explain how to establish causation through experiments.",
    },
    {
      id: "da4",
      question: "Explain how you would optimize a slow SQL query.",
      tip: "Mention EXPLAIN plans, indexing, query restructuring, and avoiding SELECT *.",
    },
    {
      id: "da5",
      question:
        "Describe a time when you found a critical insight from data that changed a business decision.",
      tip: "Use the STAR method. Focus on the analytical process and measurable impact.",
    },
  ],
  "AI Engineer": [
    {
      id: "ai1",
      question:
        "Explain the difference between supervised, unsupervised, and reinforcement learning.",
      tip: "Give concrete examples for each. Mention real-world applications.",
    },
    {
      id: "ai2",
      question:
        "What is overfitting and how would you prevent it in a neural network?",
      tip: "Discuss regularization, dropout, early stopping, and data augmentation techniques.",
    },
    {
      id: "ai3",
      question:
        "Explain the attention mechanism in Transformer models. Why is it so powerful?",
      tip: "Describe the query-key-value mechanism. Explain how self-attention enables parallel processing.",
    },
    {
      id: "ai4",
      question:
        "How would you evaluate a classification model beyond accuracy?",
      tip: "Discuss precision, recall, F1, ROC-AUC. Explain class imbalance scenarios.",
    },
    {
      id: "ai5",
      question:
        "What are the main challenges in deploying machine learning models in production?",
      tip: "Cover data drift, model monitoring, latency, scalability, and model versioning.",
    },
  ],
  "Web Developer": [
    {
      id: "wd1",
      question:
        "Explain the event loop in JavaScript. How does async/await work under the hood?",
      tip: "Describe call stack, callback queue, and microtask queue. Walk through a Promise example.",
    },
    {
      id: "wd2",
      question:
        "What is the virtual DOM in React and how does reconciliation work?",
      tip: "Explain diffing algorithm, keys in lists, and why the virtual DOM improves performance.",
    },
    {
      id: "wd3",
      question:
        "Describe the CSS Box Model and the difference between box-sizing values.",
      tip: "Draw out content, padding, border, margin. Explain content-box vs border-box.",
    },
    {
      id: "wd4",
      question: "How do you optimize a web application's performance?",
      tip: "Cover code splitting, lazy loading, caching, CDN, image optimization, and Core Web Vitals.",
    },
    {
      id: "wd5",
      question:
        "Explain RESTful API design principles. What makes an API truly RESTful?",
      tip: "Cover statelessness, resource URIs, HTTP methods, and HATEOAS. Contrast with GraphQL.",
    },
  ],
};

// Smart question generator bank
export const questionBank: Question[] = [
  // Python
  {
    id: "py1",
    question: "What are Python decorators and how do they work?",
    modelAnswer:
      "Decorators are functions that take another function as input and extend its behavior without explicitly modifying it. They use the @syntax sugar over higher-order functions. Common uses include logging, authentication, and memoization. Under the hood, @decorator is equivalent to func = decorator(func).",
    difficulty: "Medium",
    category: "Python",
  },
  {
    id: "py2",
    question: "Explain the difference between a list and a tuple in Python.",
    modelAnswer:
      "Lists are mutable, dynamic arrays while tuples are immutable sequences. Tuples are faster and use less memory. Lists use square brackets [], tuples use parentheses (). Tuples can be used as dictionary keys; lists cannot. Use tuples for fixed data, lists for data that needs to change.",
    difficulty: "Easy",
    category: "Python",
  },
  {
    id: "py3",
    question:
      "What is a generator in Python and how does it differ from a list comprehension?",
    modelAnswer:
      "Generators are lazy iterators that produce values on-demand using yield, consuming minimal memory. List comprehensions create entire lists in memory at once. Generators use () syntax vs [] for comprehensions. Use generators for large datasets or infinite sequences. Example: (x**2 for x in range(1000000)) vs [x**2 for x in range(1000000)].",
    difficulty: "Medium",
    category: "Python",
  },
  {
    id: "py4",
    question:
      "Explain Python's GIL (Global Interpreter Lock) and its implications.",
    modelAnswer:
      "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecode simultaneously. This limits true parallel execution in CPU-bound tasks. I/O-bound tasks are less affected as the GIL is released during I/O. Solutions: use multiprocessing for CPU-bound tasks, asyncio for I/O-bound tasks, or use PyPy/Cython.",
    difficulty: "Hard",
    category: "Python",
  },
  {
    id: "py5",
    question: "What are context managers and when would you use them?",
    modelAnswer:
      "Context managers manage resources via the 'with' statement, ensuring proper setup and teardown. They implement __enter__ and __exit__ methods or use @contextmanager decorator. Common uses: file handling (ensures file is closed), database connections, thread locks. This prevents resource leaks and makes code cleaner.",
    difficulty: "Medium",
    category: "Python",
  },
  // DSA
  {
    id: "dsa1",
    question: "Explain the difference between BFS and DFS graph traversals.",
    modelAnswer:
      "BFS uses a queue and explores neighbors level by level, finding shortest paths in unweighted graphs. DFS uses a stack (or recursion) and goes as deep as possible before backtracking. BFS: O(V+E), good for shortest path. DFS: O(V+E), good for cycle detection, topological sort, and connected components.",
    difficulty: "Medium",
    category: "DSA",
  },
  {
    id: "dsa2",
    question:
      "What is dynamic programming? Explain with the Fibonacci example.",
    modelAnswer:
      "DP solves complex problems by breaking them into overlapping subproblems, storing results to avoid recomputation (memoization or tabulation). Fibonacci without DP: O(2^n). With memoization: O(n). With tabulation: O(n) time and O(1) space for bottom-up approach. Key properties: optimal substructure and overlapping subproblems.",
    difficulty: "Hard",
    category: "DSA",
  },
  {
    id: "dsa3",
    question:
      "What is the time complexity of HashMap operations and what causes collisions?",
    modelAnswer:
      "HashMap has O(1) average for get/put/delete, O(n) worst case due to collisions. Collisions occur when different keys hash to the same bucket. Resolved via chaining (linked lists) or open addressing (probing). Java 8+ uses balanced trees for long chains, improving worst case to O(log n). Load factor affects resize threshold (default 0.75).",
    difficulty: "Medium",
    category: "DSA",
  },
  {
    id: "dsa4",
    question:
      "Explain how binary search works and write its iterative implementation.",
    modelAnswer:
      "Binary search finds target in sorted array by repeatedly halving the search space. Compare middle element with target: if equal, found; if less, search right half; if greater, search left half. Time: O(log n), Space: O(1). Code: while(low<=high){ mid=(low+high)/2; if(arr[mid]==target) return mid; else if(arr[mid]<target) low=mid+1; else high=mid-1; } return -1.",
    difficulty: "Easy",
    category: "DSA",
  },
  // Web Development
  {
    id: "web1",
    question: "What is CORS and how do you handle it?",
    modelAnswer:
      "Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts HTTP requests to different origins. The browser sends a preflight OPTIONS request; the server responds with Access-Control-Allow-Origin headers. Solutions: configure server CORS headers, use a proxy, or for development use browser extensions. Never use wildcard '*' in production with credentials.",
    difficulty: "Medium",
    category: "Web Development",
  },
  {
    id: "web2",
    question:
      "Explain the difference between localStorage, sessionStorage, and cookies.",
    modelAnswer:
      "localStorage: persists indefinitely, 5-10MB, accessible across tabs, client-only. sessionStorage: cleared when tab closes, 5-10MB, tab-specific, client-only. Cookies: sent with every HTTP request (bandwidth overhead), ~4KB limit, can be HTTP-only (secure), has expiry, accessible server-side. Use localStorage for preferences, sessionStorage for temporary data, cookies for auth tokens.",
    difficulty: "Easy",
    category: "Web Development",
  },
  {
    id: "web3",
    question: "What are Web Workers and when would you use them?",
    modelAnswer:
      "Web Workers run JavaScript in background threads, preventing UI blocking for CPU-intensive tasks. They communicate with the main thread via postMessage/onmessage. No DOM access. Use cases: image processing, complex calculations, data parsing. Types: Dedicated (one script), Shared (multiple scripts), Service Workers (network proxy, caching, PWA).",
    difficulty: "Hard",
    category: "Web Development",
  },
  // AI/ML
  {
    id: "aiml1",
    question: "What is the difference between L1 and L2 regularization?",
    modelAnswer:
      "L1 (Lasso): adds absolute value of coefficients as penalty, produces sparse models (some weights become exactly 0), useful for feature selection. L2 (Ridge): adds squared coefficients as penalty, shrinks weights toward zero but rarely to exactly 0, handles correlated features better. Elastic Net combines both. Choice depends on whether feature selection is needed.",
    difficulty: "Medium",
    category: "AI/ML",
  },
  {
    id: "aiml2",
    question: "Explain the bias-variance tradeoff in machine learning.",
    modelAnswer:
      "Bias: error from overly simplistic assumptions (underfitting — model misses patterns). Variance: error from sensitivity to training data fluctuations (overfitting — model memorizes noise). Total error = Bias² + Variance + Irreducible Noise. Solutions: increase model complexity to reduce bias; add more data, regularization, or ensemble methods to reduce variance. Goal: find sweet spot minimizing total error.",
    difficulty: "Medium",
    category: "AI/ML",
  },
  // System Design
  {
    id: "sd_sys1",
    question: "How would you design a URL shortener like bit.ly?",
    modelAnswer:
      "Core components: API layer, URL mapping service, database, cache (Redis). Use base62 encoding to generate short codes. Store long_url → short_code mapping in DB (NoSQL for scale). Cache hot URLs in Redis. For redirects: 301 (permanent, cached by browser) vs 302 (temporary). Handle custom slugs, expiration, analytics. Scale: consistent hashing for sharding, CDN for global distribution.",
    difficulty: "Hard",
    category: "System Design",
  },
  {
    id: "sd_sys2",
    question:
      "Explain CAP theorem and its implications for distributed systems.",
    modelAnswer:
      "CAP theorem states distributed systems can only guarantee 2 of 3: Consistency (all nodes see same data simultaneously), Availability (every request gets a response), Partition Tolerance (system works despite network partitions). Since partitions are inevitable, choose CP (Zookeeper, HBase — sacrifice availability) or AP (Cassandra, DynamoDB — eventual consistency). Most modern systems aim for 'mostly consistent' with tunable consistency levels.",
    difficulty: "Hard",
    category: "System Design",
  },
  // Behavioral
  {
    id: "beh1",
    question:
      "Describe a time when you had to work with a difficult team member.",
    modelAnswer:
      "Use STAR method: Situation (describe the context and challenge), Task (your responsibility), Action (specific steps you took — empathy, communication, finding common ground, escalating if necessary), Result (positive outcome, lessons learned). Focus on professional resolution, not personal criticism. Emphasize collaboration and growth.",
    difficulty: "Medium",
    category: "Behavioral",
  },
  {
    id: "beh2",
    question: "Tell me about a time you failed. What did you learn?",
    modelAnswer:
      "Choose a real but not catastrophic failure. STAR: Situation/Task (what you were doing), Action (what went wrong and why), Result (impact and what you learned). Show self-awareness, accountability (no blame), and concrete changes in approach. Demonstrate growth mindset. End with how this failure made you better at your work.",
    difficulty: "Easy",
    category: "Behavioral",
  },
];

// Feedback templates based on answer quality
export function generateFeedback(
  answer: string,
  _questionId: string,
): FeedbackTemplate {
  const wordCount = answer.trim().split(/\s+/).length;
  const hasKeywords =
    /explain|because|therefore|however|example|implement|design|consider|approach|solution/i.test(
      answer,
    );
  const isDetailed = wordCount > 50;
  const isComprehensive = wordCount > 100;

  let score: number;
  if (isComprehensive && hasKeywords)
    score = Math.floor(Math.random() * 15) + 82;
  else if (isDetailed && hasKeywords)
    score = Math.floor(Math.random() * 15) + 68;
  else if (isDetailed || hasKeywords)
    score = Math.floor(Math.random() * 15) + 52;
  else score = Math.floor(Math.random() * 20) + 30;

  const highFeedback: FeedbackTemplate = {
    score,
    correctness:
      "Excellent technical accuracy. Your answer demonstrated deep understanding of the core concept with precise terminology and clear logical flow.",
    communication:
      "Outstanding communication quality. You structured your response well with a clear introduction, supporting points, and conclusion. Your use of examples enhanced clarity.",
    improvements: [
      "Consider adding more edge case scenarios to showcase advanced thinking",
      "Quantify your claims with specific metrics or benchmarks where possible",
      "Mention alternative approaches briefly to show breadth of knowledge",
    ],
    strengths: [
      "Strong conceptual grasp",
      "Clear articulation",
      "Good use of examples",
    ],
  };

  const mediumFeedback: FeedbackTemplate = {
    score,
    correctness:
      "Good foundational understanding shown. Key concepts were addressed, though some important nuances could be explored more deeply.",
    communication:
      "Clear and comprehensible response. Structure could be improved — consider using a more systematic approach (definition → explanation → example → use case).",
    improvements: [
      "Expand on the 'why' behind your statements — examiners look for reasoning depth",
      "Include a concrete real-world example to ground abstract concepts",
      "Address potential trade-offs or limitations of the approach you described",
    ],
    strengths: [
      "Correct core answer",
      "Readable structure",
      "Relevant terminology",
    ],
  };

  const lowFeedback: FeedbackTemplate = {
    score,
    correctness:
      "The answer touches on the topic but lacks technical precision. Some key aspects of the concept were either missing or incorrectly described.",
    communication:
      "The response is brief and would benefit from more elaboration. Interviewers expect structured, detailed answers that demonstrate depth of knowledge.",
    improvements: [
      "Study the core concept more thoroughly — review documentation and tutorials",
      "Practice the STAR method for structuring technical answers",
      "Aim for 150-200 words with concrete examples in your responses",
      "Review related concepts that commonly appear alongside this topic",
    ],
    strengths: ["Attempted the question", "Some relevant keywords present"],
  };

  if (isComprehensive && hasKeywords) return highFeedback;
  if (isDetailed || hasKeywords) return mediumFeedback;
  return lowFeedback;
}

// Sample session history
export const sessionHistory: SessionHistory[] = [
  {
    id: "s1",
    date: "Mar 10, 2026",
    role: "Software Developer",
    score: 88,
    questionsAnswered: 5,
    status: "Completed",
  },
  {
    id: "s2",
    date: "Mar 8, 2026",
    role: "AI Engineer",
    score: 74,
    questionsAnswered: 5,
    status: "Completed",
  },
  {
    id: "s3",
    date: "Mar 5, 2026",
    role: "Web Developer",
    score: 92,
    questionsAnswered: 5,
    status: "Completed",
  },
  {
    id: "s4",
    date: "Mar 2, 2026",
    role: "Data Analyst",
    score: 67,
    questionsAnswered: 4,
    status: "Completed",
  },
  {
    id: "s5",
    date: "Feb 28, 2026",
    role: "Software Developer",
    score: 79,
    questionsAnswered: 5,
    status: "Completed",
  },
];

// Skills pool for resume analysis
export const skillsPool: Record<string, string[]> = {
  default: [
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "SQL",
    "Git",
    "REST APIs",
    "Agile",
    "Problem Solving",
    "Communication",
  ],
  tech: [
    "TypeScript",
    "Docker",
    "AWS",
    "GraphQL",
    "Redis",
    "PostgreSQL",
    "CI/CD",
    "Microservices",
    "System Design",
  ],
  data: [
    "Pandas",
    "NumPy",
    "Scikit-learn",
    "TensorFlow",
    "Tableau",
    "Power BI",
    "Excel",
    "Statistical Analysis",
    "R",
  ],
  ai: [
    "PyTorch",
    "Transformers",
    "LangChain",
    "OpenCV",
    "NLP",
    "Computer Vision",
    "MLOps",
    "Hugging Face",
  ],
};

export const resumeQuestions: string[] = [
  "Describe a project where you used Python for data processing at scale. What optimizations did you implement?",
  "How have you designed and consumed RESTful APIs in your previous roles?",
  "Walk me through your experience with React. How do you manage state in large applications?",
  "Explain how you've used SQL to derive business insights. What was your most complex query?",
  "How have you implemented CI/CD pipelines in your projects?",
  "Describe a situation where your communication skills resolved a technical misunderstanding.",
];

export const atsRecommendations: string[] = [
  "Add more quantifiable achievements — ATS systems and recruiters respond better to 'increased performance by 40%' vs 'improved performance'",
  "Include job-specific keywords from the target job description to improve ATS match score",
  "Use standard section headings (Experience, Education, Skills) to ensure ATS can parse your resume correctly",
  "Remove graphics, tables, and complex formatting that ATS scanners cannot parse",
  "Tailor your resume for each application — a generic resume scores 20-30% lower than a targeted one",
];
