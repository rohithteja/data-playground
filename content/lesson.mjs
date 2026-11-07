export const lesson = (id, title, minutes, summary, explain, example, visual, question, choices, answer, feedback, source) => ({
  id, title, minutes, summary, explain, example, visual,
  questions: [{ question, choices, answer, feedback }], source
});

export const steps = (...frames) => ({ kind: 'steps', frames });
export const lab = (kind) => ({ kind });
