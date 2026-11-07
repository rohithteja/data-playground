import { harmonization, engineering } from './foundations.mjs';
import { python, algorithms } from './python-algorithms.mjs';
import { probability, math } from './probability-math.mjs';
import { ecosystem, eda } from './analytics.mjs';

export const subjects = [harmonization, python, probability, eda, math, algorithms, ecosystem, engineering];
export const featured = { subject: 'probability', topic: 'bayes' };
export const topicKey = (subject, topic) => `${subject.id}/${topic.id}`;
export const topicCount = subjects.reduce((count, subject) => count + subject.topics.length, 0);
