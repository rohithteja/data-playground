import assert from 'node:assert/strict';
import { featured, subjects, topicKey } from '../content/index.mjs';
import { visualKinds } from '../content/visual-kinds.mjs';

const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
const unique = (values) => new Set(values).size === values.length;
assert(subjects.length > 0 && unique(subjects.map(({ id }) => id)), 'Subject IDs must be unique');
let lessons = 0;
for (const subject of subjects) {
  assert(slug.test(subject.id), `Invalid subject ID: ${subject.id}`);
  assert(['title', 'short', 'description', 'course', 'icon', 'tone'].every((field) => nonempty(subject[field])), `Missing subject field: ${subject.id}`);
  assert(subject.topics.length > 0 && unique(subject.topics.map(({ id }) => id)), `Topic IDs must be unique in ${subject.id}`);
  for (const topic of subject.topics) {
    const key = topicKey(subject, topic);
    assert(slug.test(topic.id), `Invalid topic ID: ${key}`);
    assert(['title', 'summary', 'explain', 'example', 'source'].every((field) => nonempty(topic[field])), `Missing lesson field: ${key}`);
    assert(Number.isInteger(topic.minutes) && topic.minutes > 0, `Invalid duration: ${key}`);
    assert(visualKinds.includes(topic.visual?.kind), `Unknown visual: ${key}`);
    if (topic.visual.kind === 'steps') {
      assert(topic.visual.frames?.length >= 2, `Add at least two frames: ${key}`);
      assert(topic.visual.frames.every((frame) => frame.length === 3 && nonempty(frame[0]) && nonempty(frame[1]) && typeof frame[2] === 'string'), `Invalid visual frame: ${key}`);
    }
    assert(topic.questions?.length > 0, `Missing practice questions: ${key}`);
    for (const item of topic.questions) {
      assert(nonempty(item.question) && nonempty(item.feedback), `Incomplete practice question: ${key}`);
      assert(item.choices.length >= 2 && item.choices.every(nonempty) && unique(item.choices), `Invalid choices: ${key}`);
      assert(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.choices.length, `Invalid answer index: ${key}`);
    }
    lessons++;
  }
}
assert(subjects.find(({ id }) => id === featured.subject)?.topics.some(({ id }) => id === featured.topic), 'Featured topic must exist');
console.log(`Validated ${lessons} topics across ${subjects.length} subjects.`);
