import { Quote } from './types';

export const SOOTHING_QUOTES: Quote[] = [
  {
    text: "Patience with yourself is the first step toward genuine understanding.",
    author: "Epictetus",
    context: "Discourses"
  },
  {
    text: "Depth arrives when you stop rushing the concept and let it settle in quiet thought.",
    author: "Richard Feynman",
    context: "Reflections on Physics"
  },
  {
    text: "Curiosity is not a chore to complete. It is a quiet room you enter at your own pace.",
    author: "Ada Lovelace",
    context: "Mathematical Notes"
  },
  {
    text: "The mind clarifies not through tension, but through steady, attentive practice.",
    author: "Marcus Aurelius",
    context: "Meditations"
  },
  {
    text: "Small, quiet increments build an understanding that lasts a lifetime.",
    author: "Marie Curie",
    context: "Laboratory Diaries"
  },
  {
    text: "Every difficult principle was once an unfamiliar sentence someone sat with in silence.",
    author: "Michael Faraday",
    context: "Experimental Researches"
  },
  {
    text: "To comprehend something deeply, one must first be willing to observe it without judgment.",
    author: "Jiddu Krishnamurti",
    context: "Freedom from the Known"
  },
  {
    text: "True mastery is nothing more than basic fundamentals sustained with care.",
    author: "Seneca",
    context: "Letters from a Stoic"
  },
  {
    text: "Allow yourself the space to be a beginner every single morning.",
    author: "Shunryu Suzuki",
    context: "Zen Mind, Beginner's Mind"
  },
  {
    text: "Knowledge is an organic structure. It grows strongest when rooted in calm focus.",
    author: "Santiago Ramon y Cajal",
    context: "Advice for a Young Investigator"
  }
];

export const getRandomQuote = (): Quote => {
  const index = Math.floor(Math.random() * SOOTHING_QUOTES.length);
  return SOOTHING_QUOTES[index];
};
