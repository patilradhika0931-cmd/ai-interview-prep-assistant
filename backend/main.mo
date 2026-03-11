import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";

actor {

  // ---- Types ----

  type Difficulty = { #Easy; #Medium; #Hard };

  type Question = {
    id: Nat;
    role: Text;
    topic: Text;
    difficulty: Text;
    text: Text;
  };

  type AnswerFeedback = {
    score: Nat;
    feedback: Text;
    suggestions: Text;
  };

  type SessionAnswer = {
    answer: Text;
    feedback: ?AnswerFeedback;
  };

  type InterviewSession = {
    id: Nat;
    role: Text;
    questions: [Text];
    answers: [SessionAnswer];
    status: Text; // "active" | "completed"
    createdAt: Int;
    overallScore: ?Nat;
    strengths: [Text];
    weaknesses: [Text];
    suggestions: [Text];
  };

  type ResumeAnalysis = {
    id: Nat;
    skills: [Text];
    questions: [Text];
    createdAt: Int;
  };

  // ---- State ----

  var nextSessionId: Nat = 1;
  var nextAnalysisId: Nat = 1;

  let sessions = HashMap.HashMap<Nat, InterviewSession>(16, Nat.equal, func(n) { Text.hash(Nat.toText(n)) });
  let analyses = HashMap.HashMap<Nat, ResumeAnalysis>(16, Nat.equal, func(n) { Text.hash(Nat.toText(n)) });

  // ---- Question bank (seeded) ----

  let questionBank: [Question] = [
    // Software Developer - Python - Easy
    { id=1; role="Software Developer"; topic="Python"; difficulty="Easy"; text="What are Python's key data types?" },
    { id=2; role="Software Developer"; topic="Python"; difficulty="Easy"; text="Explain the difference between a list and a tuple in Python." },
    { id=3; role="Software Developer"; topic="Python"; difficulty="Medium"; text="What is a Python decorator and how does it work?" },
    { id=4; role="Software Developer"; topic="Python"; difficulty="Hard"; text="Explain Python's Global Interpreter Lock (GIL) and its implications for multi-threading." },
    // Software Developer - DSA
    { id=5; role="Software Developer"; topic="DSA"; difficulty="Easy"; text="What is the time complexity of binary search?" },
    { id=6; role="Software Developer"; topic="DSA"; difficulty="Medium"; text="Explain how a hash map works internally." },
    { id=7; role="Software Developer"; topic="DSA"; difficulty="Hard"; text="Describe Dijkstra's algorithm and its time complexity." },
    // Software Developer - Web Development
    { id=8; role="Software Developer"; topic="Web Development"; difficulty="Easy"; text="What is the difference between GET and POST HTTP methods?" },
    { id=9; role="Software Developer"; topic="Web Development"; difficulty="Medium"; text="Explain the concept of RESTful APIs." },
    { id=10; role="Software Developer"; topic="Web Development"; difficulty="Hard"; text="How would you design a scalable microservices architecture?" },
    // Software Developer - System Design
    { id=11; role="Software Developer"; topic="System Design"; difficulty="Medium"; text="How would you design a URL shortener like bit.ly?" },
    { id=12; role="Software Developer"; topic="System Design"; difficulty="Hard"; text="Design a distributed cache system. What challenges would you face?" },
    // Data Analyst - Python
    { id=13; role="Data Analyst"; topic="Python"; difficulty="Easy"; text="What Python libraries are commonly used for data analysis?" },
    { id=14; role="Data Analyst"; topic="Python"; difficulty="Medium"; text="How do you handle missing data in a pandas DataFrame?" },
    { id=15; role="Data Analyst"; topic="Python"; difficulty="Hard"; text="Explain how you would optimize a slow pandas pipeline processing millions of rows." },
    // Data Analyst - AI/ML
    { id=16; role="Data Analyst"; topic="AI/ML"; difficulty="Easy"; text="What is the difference between supervised and unsupervised learning?" },
    { id=17; role="Data Analyst"; topic="AI/ML"; difficulty="Medium"; text="How do you prevent overfitting in a machine learning model?" },
    { id=18; role="Data Analyst"; topic="AI/ML"; difficulty="Hard"; text="Explain gradient boosting and how XGBoost differs from random forests." },
    // AI Engineer - AI/ML
    { id=19; role="AI Engineer"; topic="AI/ML"; difficulty="Easy"; text="What is the difference between a neural network and a decision tree?" },
    { id=20; role="AI Engineer"; topic="AI/ML"; difficulty="Medium"; text="Explain the transformer architecture and its advantages over RNNs." },
    { id=21; role="AI Engineer"; topic="AI/ML"; difficulty="Hard"; text="How would you fine-tune a large language model for a specific domain?" },
    // AI Engineer - Python
    { id=22; role="AI Engineer"; topic="Python"; difficulty="Medium"; text="How do you implement a custom PyTorch training loop?" },
    { id=23; role="AI Engineer"; topic="Python"; difficulty="Hard"; text="Explain how you would profile and optimize a deep learning training pipeline." },
    // HR/Behavioral - all roles
    { id=24; role="Software Developer"; topic="HR/Behavioral"; difficulty="Easy"; text="Tell me about yourself and your experience as a software developer." },
    { id=25; role="Software Developer"; topic="HR/Behavioral"; difficulty="Medium"; text="Describe a challenging project you worked on and how you overcame obstacles." },
    { id=26; role="Data Analyst"; topic="HR/Behavioral"; difficulty="Easy"; text="Tell me about a time you used data to influence a business decision." },
    { id=27; role="AI Engineer"; topic="HR/Behavioral"; difficulty="Medium"; text="How do you stay current with the rapidly evolving AI/ML landscape?" },
    // DevOps
    { id=28; role="DevOps Engineer"; topic="System Design"; difficulty="Easy"; text="What is the difference between containers and virtual machines?" },
    { id=29; role="DevOps Engineer"; topic="System Design"; difficulty="Medium"; text="Explain the CI/CD pipeline and its key components." },
    { id=30; role="DevOps Engineer"; topic="System Design"; difficulty="Hard"; text="How would you design a Kubernetes cluster for high availability?" },
  ];

  // Feedback templates by score range
  func generateFeedback(answer: Text, _questionText: Text): AnswerFeedback {
    let len = Text.size(answer);
    let score: Nat = if (len > 300) 88
      else if (len > 150) 75
      else if (len > 50) 60
      else 40;
    let feedback = if (score >= 80)
      "Excellent answer! You demonstrated strong understanding of the concept."
    else if (score >= 65)
      "Good answer with solid fundamentals. Could use more depth in some areas."
    else if (score >= 50)
      "Adequate response but lacks detail and specific examples."
    else
      "The answer is too brief. Try to elaborate with examples and deeper explanations.";
    let suggestions = if (score >= 80)
      "Consider adding edge cases and real-world examples to make it even stronger."
    else if (score >= 65)
      "Add concrete examples from your experience and mention trade-offs."
    else if (score >= 50)
      "Expand your answer with technical details, examples, and mention potential pitfalls."
    else
      "Structure your answer using the STAR method and include technical specifics.";
    { score; feedback; suggestions }
  };

  // Role-based interview questions
  func getQuestionsForRole(role: Text): [Text] {
    switch (role) {
      case ("Software Developer") [
        "Tell me about yourself and your background as a software developer.",
        "What programming languages are you most proficient in?",
        "Explain the concept of object-oriented programming.",
        "What is the difference between a stack and a queue?",
        "How do you handle version control in your projects?",
      ];
      case ("Data Analyst") [
        "Tell me about your experience with data analysis.",
        "What tools do you use for data visualization?",
        "How do you clean and preprocess data?",
        "Explain the difference between mean, median, and mode.",
        "How have you used data to drive business decisions?",
      ];
      case ("AI Engineer") [
        "Tell me about your experience with machine learning.",
        "What frameworks have you used for deep learning?",
        "Explain the bias-variance tradeoff.",
        "How do you evaluate a classification model?",
        "Describe a machine learning project you built end-to-end.",
      ];
      case ("Product Manager") [
        "Tell me about your product management experience.",
        "How do you prioritize features in a product roadmap?",
        "Describe a product you launched and its impact.",
        "How do you gather and incorporate user feedback?",
        "What metrics do you use to measure product success?",
      ];
      case ("DevOps Engineer") [
        "Tell me about your DevOps experience.",
        "What CI/CD tools have you used?",
        "How do you monitor application performance in production?",
        "Explain the concept of infrastructure as code.",
        "How do you handle an unexpected production outage?",
      ];
      case (_) [
        "Tell me about yourself.",
        "What are your key technical skills?",
        "Describe a challenging problem you solved.",
        "Where do you see yourself in 5 years?",
        "Why are you interested in this role?",
      ];
    }
  };

  // ---- Public APIs ----

  public func createInterviewSession(role: Text): async Nat {
    let id = nextSessionId;
    nextSessionId += 1;
    let questions = getQuestionsForRole(role);
    let session: InterviewSession = {
      id;
      role;
      questions;
      answers = [];
      status = "active";
      createdAt = Time.now();
      overallScore = null;
      strengths = [];
      weaknesses = [];
      suggestions = [];
    };
    sessions.put(id, session);
    id
  };

  public query func getSession(sessionId: Nat): async ?InterviewSession {
    sessions.get(sessionId)
  };

  public func submitAnswer(sessionId: Nat, questionIndex: Nat, answer: Text): async ?AnswerFeedback {
    switch (sessions.get(sessionId)) {
      case null null;
      case (?session) {
        if (questionIndex >= session.questions.size()) return null;
        let questionText = session.questions[questionIndex];
        let feedback = generateFeedback(answer, questionText);
        let newAnswer: SessionAnswer = { answer; feedback = ?feedback };
        // Rebuild answers array
        let oldAnswers = Array.tabulate<SessionAnswer>(session.answers.size(), func(i) { session.answers[i] });
        let newAnswers = if (questionIndex < oldAnswers.size()) {
          Array.tabulate<SessionAnswer>(oldAnswers.size(), func(i) {
            if (i == questionIndex) newAnswer else oldAnswers[i]
          })
        } else {
          // Pad with empty if needed
          let padded = Array.tabulate<SessionAnswer>(questionIndex + 1, func(i) {
            if (i < oldAnswers.size()) oldAnswers[i]
            else if (i == questionIndex) newAnswer
            else { answer = ""; feedback = null }
          });
          padded
        };
        let updated: InterviewSession = {
          id = session.id;
          role = session.role;
          questions = session.questions;
          answers = newAnswers;
          status = session.status;
          createdAt = session.createdAt;
          overallScore = session.overallScore;
          strengths = session.strengths;
          weaknesses = session.weaknesses;
          suggestions = session.suggestions;
        };
        sessions.put(sessionId, updated);
        ?feedback
      };
    }
  };

  public func completeSession(sessionId: Nat): async ?InterviewSession {
    switch (sessions.get(sessionId)) {
      case null null;
      case (?session) {
        // Calculate average score
        var totalScore: Nat = 0;
        var count: Nat = 0;
        for (ans in session.answers.vals()) {
          switch (ans.feedback) {
            case (?fb) { totalScore += fb.score; count += 1; };
            case null {};
          };
        };
        let avgScore: Nat = if (count == 0) 0 else totalScore / count;
        let strengths: [Text] = if (avgScore >= 75) [
          "Strong technical knowledge",
          "Clear communication",
          "Good problem-solving approach",
        ] else if (avgScore >= 55) [
          "Basic concepts understood",
          "Adequate communication",
        ] else [
          "Willingness to attempt questions",
        ];
        let weaknesses: [Text] = if (avgScore >= 75) [
          "Could provide more edge case coverage",
        ] else if (avgScore >= 55) [
          "Needs more depth in technical answers",
          "Should include more concrete examples",
        ] else [
          "Technical fundamentals need strengthening",
          "Answers need more detail and structure",
          "Practice with real-world examples",
        ];
        let suggestions: [Text] = [
          "Review data structures and algorithms regularly",
          "Practice explaining concepts out loud",
          "Work on real projects to gain hands-on experience",
          "Do mock interviews with peers",
        ];
        let updated: InterviewSession = {
          id = session.id;
          role = session.role;
          questions = session.questions;
          answers = session.answers;
          status = "completed";
          createdAt = session.createdAt;
          overallScore = ?avgScore;
          strengths;
          weaknesses;
          suggestions;
        };
        sessions.put(sessionId, updated);
        ?updated
      };
    }
  };

  public query func getQuestions(role: Text, topic: Text, difficulty: Text): async [Question] {
    Array.filter<Question>(questionBank, func(q) {
      let roleMatch = role == "" or q.role == role;
      let topicMatch = topic == "" or q.topic == topic;
      let difficultyMatch = difficulty == "" or q.difficulty == difficulty;
      roleMatch and topicMatch and difficultyMatch
    })
  };

  public func saveResumeAnalysis(skills: [Text]): async Nat {
    let id = nextAnalysisId;
    nextAnalysisId += 1;
    // Generate questions based on skills
    let questions: [Text] = Array.tabulate<Text>(skills.size(), func(i) {
      let skill = skills[i];
      "Can you explain your experience with " # skill # " and provide a practical example?"
    });
    let extraQuestions: [Text] = [
      "How have you applied these skills in a team environment?",
      "What projects have you built using your core skills?",
      "How do you keep your technical skills up to date?",
    ];
    let allQuestions = Array.append<Text>(questions, extraQuestions);
    let analysis: ResumeAnalysis = {
      id;
      skills;
      questions = allQuestions;
      createdAt = Time.now();
    };
    analyses.put(id, analysis);
    id
  };

  public query func getResumeAnalysis(analysisId: Nat): async ?ResumeAnalysis {
    analyses.get(analysisId)
  };

  public query func getPerformanceHistory(): async [InterviewSession] {
    let completed = Iter.filter<InterviewSession>(sessions.vals(), func(s) { s.status == "completed" });
    Iter.toArray(completed)
  };

  public query func getAllSessions(): async [InterviewSession] {
    Iter.toArray(sessions.vals())
  };
};
