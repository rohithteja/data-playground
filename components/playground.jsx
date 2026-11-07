'use client';

import { useEffect, useState } from 'react';
import { featured, subjects, topicCount, topicKey } from '../content/index.mjs';
import { HeroArt, Icon } from './icons';
import { VisualLab } from './visuals';

const storageKey = 'data-playground.progress.v1';
const subjectUrl = (subject) => `#/${subject.id}`;
const lessonUrl = (subject, topic, tab = 'learn') => `${subjectUrl(subject)}/${topic.id}/${tab}`;
const tabs = [['learn', 'Learn', 'book'], ['visualize', 'Visualize', 'flask'], ['practice', 'Practice', 'bolt']];
const featuredSubject = subjects.find((subject) => subject.id === featured.subject);
const featuredTopic = featuredSubject.topics.find((topic) => topic.id === featured.topic);

function getRoute() {
  return window.location.hash.slice(2).split('/');
}

export default function Playground() {
  const [route, setRoute] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const update = () => {
      setRoute(getRoute());
      setMenu(false);
      window.scrollTo(0, 0);
    };
    setRoute(getRoute());
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(saved)) setCompleted(saved.filter((key) => typeof key === 'string'));
    } catch {}
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const subject = subjects.find((item) => item.id === route[0]);
  const topic = subject?.topics.find((item) => item.id === route[1]);
  const tab = tabs.find(([id]) => id === route[2])?.[0] ?? 'learn';
  const totalComplete = subjects.flatMap((item) => item.topics.map((entry) => topicKey(item, entry))).filter((key) => completed.includes(key)).length;

  function markComplete(key) {
    const next = [...new Set([...completed, key])];
    setCompleted(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
  }

  function browse(event) {
    if (subject) return;
    event.preventDefault();
    document.getElementById('subjects')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <div className="shell">
    <a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
    {menu && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMenu(false)} />}
    <aside className={`sidebar ${menu ? 'open' : ''}`} id="sidebar">
      <a className="brand" href="#/" onClick={() => setMenu(false)}>
        <span className="brand-icon"><Icon name="spark" size={23}/></span>
        <span>Data Playground<small>EPITA STUDY LAB</small></span>
      </a>
      <nav aria-label="Course navigation">
        <div className="nav-caption">WORKSPACE</div>
        <a className={`nav-link ${!subject ? 'active' : ''}`} href="#/" aria-current={!subject ? 'page' : undefined} onClick={() => setMenu(false)}><Icon name="grid" size={17}/> Overview</a>
        <div className="nav-caption subject-caption">SUBJECTS <span>{String(subjects.length).padStart(2, '0')}</span></div>
        {subjects.map((item) => <a key={item.id} className={`nav-link ${item.tone} ${subject === item ? 'active' : ''}`} href={subjectUrl(item)} aria-current={subject === item ? 'page' : undefined} onClick={() => setMenu(false)}><Icon name={item.icon} size={17}/>{item.short}</a>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="progress-title"><Icon name="target" size={17}/> Your progress <span>{totalComplete}/{topicCount}</span></div>
        <progress value={totalComplete} max={topicCount} aria-label="Topics completed"/>
        <small>Saved on this device</small>
      </div>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <div className="crumb">
          <button className="menu-toggle" aria-expanded={menu} aria-controls="sidebar" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}><Icon name={menu ? 'close' : 'menu'}/></button>
          <a href="#/">Study lab</a><Icon name="chevron" size={13}/><span>{subject?.short ?? 'Overview'}</span>
        </div>
        <span className="local-status"><i/> Local workspace</span>
      </header>
      <main id="main" className="main" tabIndex={-1}>
        {!subject ? <>
          <section className="hero">
            <div className="hero-copy">
              <div className="pill hero-pill"><Icon name="spark" size={13}/> THE BEGINNER’S STUDY LAB</div>
              <h1>Data Science<br/><em>Playground.</em></h1>
              <p>See how the ideas in your EPITA slides work. Pick a topic, play with a diagram, and try a quick challenge.</p>
              <a className="button primary" href={subjectUrl(subjects[0])} onClick={browse}>Explore subjects <Icon name="arrow" size={17}/></a>
            </div>
            <HeroArt/>
            <span className="hero-index">FIG. 01 <span> / </span> THE DATA CUBE</span>
          </section>
          <a className="spotlight" href={lessonUrl(featuredSubject, featuredTopic, 'visualize')}>
            <span className="spot-icon"><Icon name="flask" size={24}/></span>
            <span className="spot-copy"><span className="eyebrow">TRY A VISUAL LAB</span><strong>Bayes’ theorem</strong><small>Change the base rate and see what a positive result means.</small></span>
            <span className="spot-action">Open lab <Icon name="arrow" size={17}/></span>
          </a>
          <section className="subject-section" id="subjects">
            <div className="section-heading"><div><div className="eyebrow purple">COURSE LIBRARY</div><h2>Choose a subject</h2></div><span>{subjects.length} subjects <b>·</b> {topicCount} topics</span></div>
            <div className="subject-grid">{subjects.map((item, index) => <SubjectCard key={item.id} item={item} index={index} completed={completed}/>)}</div>
          </section>
          <footer className="footer">Data Playground <span>·</span> Adapted from the EPITA course slides</footer>
        </> : !topic ? <SubjectView subject={subject} completed={completed}/> : <LessonView key={topicKey(subject, topic)} subject={subject} topic={topic} tab={tab} done={completed.includes(topicKey(subject, topic))} onComplete={() => markComplete(topicKey(subject, topic))}/>}
      </main>
    </div>
  </div>;
}

function SubjectCard({ item, index, completed }) {
  const done = item.topics.filter((topic) => completed.includes(topicKey(item, topic))).length;
  return <a className={`subject-card ${item.tone}`} href={subjectUrl(item)}>
    <div className="card-top"><span className="subject-icon"><Icon name={item.icon} size={23}/></span><span className="card-number">{String(index + 1).padStart(2, '0')}</span></div>
    <h3>{item.title}</h3><p>{item.description}</p>
    <div className="card-foot"><span>{done ? `${done}/${item.topics.length} completed` : `${item.topics.length} topics`}</span><Icon name="arrow" size={18}/></div>
  </a>;
}

function SubjectView({ subject, completed }) {
  const next = subject.topics.find((topic) => !completed.includes(topicKey(subject, topic))) ?? subject.topics[0];
  return <>
    <a className="back-link" href="#/"><Icon name="left" size={16}/> All subjects</a>
    <header className={`subject-header ${subject.tone}`}>
      <span className="subject-icon"><Icon name={subject.icon} size={31}/></span>
      <div><span className="eyebrow">{subject.topics.length} TOPICS</span><h1>{subject.title}</h1><p>{subject.description}</p></div>
      <a className="button primary" href={lessonUrl(subject, next)}> {next === subject.topics[0] ? 'Start learning' : 'Continue'} <Icon name="arrow" size={17}/></a>
    </header>
    <div className="section-heading lesson-heading"><div><div className="eyebrow purple">LEARNING PATH</div><h2>Pick a topic</h2></div><span>Learn · Visualize · Practice</span></div>
    <div className="topic-list">{subject.topics.map((topic, index) => {
      const done = completed.includes(topicKey(subject, topic));
      return <a className="topic-row" key={topic.id} href={lessonUrl(subject, topic)}><span className={`topic-index ${done ? 'done' : ''}`}>{done ? <Icon name="check" size={18}/> : String(index + 1).padStart(2, '0')}</span><span className="topic-description"><strong>{topic.title}</strong><small>{topic.summary}</small></span><span className="duration"><Icon name="clock" size={15}/>{topic.minutes} min</span><Icon name="chevron" size={17}/></a>;
    })}</div>
  </>;
}

function LessonView({ subject, topic, tab, done, onComplete }) {
  const number = subject.topics.indexOf(topic);
  const next = subject.topics[number + 1];
  return <>
    <a className="back-link" href={subjectUrl(subject)}><Icon name="left" size={16}/> {subject.title}</a>
    <div className="lesson-title"><div className="eyebrow purple">TOPIC {String(number + 1).padStart(2, '0')} / {subject.topics.length}</div><h1>{topic.title}</h1><p>{topic.summary}</p><div className="lesson-meta"><span><Icon name="clock" size={16}/> {topic.minutes} min</span>{done && <span className="completed"><Icon name="check" size={16}/> Completed</span>}</div></div>
    <nav className="lesson-tabs" aria-label="Lesson modes">{tabs.map(([id, name, icon]) => <a href={lessonUrl(subject, topic, id)} aria-current={id === tab ? 'page' : undefined} key={id}><Icon name={icon} size={18}/>{name}</a>)}</nav>
    {tab === 'learn' && <section className="lesson-panel">
      <div className="eyebrow purple">THE IDEA</div><h2>How it works</h2><p>{topic.explain}</p>
      <div className="example"><div className="eyebrow"><Icon name="spark" size={15}/> WORKED EXAMPLE</div><p>{topic.example}</p></div>
      <a className="button primary" href={lessonUrl(subject, topic, 'visualize')}>Try the visual <Icon name="arrow" size={17}/></a>
    </section>}
    {tab === 'visualize' && <section className="lesson-panel"><div className="eyebrow purple">VISUAL LAB</div><h2>Try it yourself</h2><VisualLab visual={topic.visual}/><a className="button primary" href={lessonUrl(subject, topic, 'practice')}>Practice this topic <Icon name="arrow" size={17}/></a></section>}
    {tab === 'practice' && <Practice questions={topic.questions} onComplete={onComplete} nextHref={next ? lessonUrl(subject, next) : subjectUrl(subject)} nextLabel={next ? 'Next topic' : 'Back to subject'}/>}
    <div className="lesson-source"><Icon name="book" size={16}/><span>{topic.source}</span></div>
  </>;
}

function Practice({ questions, onComplete, nextHref, nextLabel }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [checked, setChecked] = useState(false);
  const { question, choices, answer, feedback } = questions[index];
  const correct = checked && choice === answer;
  const final = index === questions.length - 1;
  return <section className="lesson-panel practice">
    <div className="eyebrow purple">QUICK CHECK {index + 1} / {questions.length}</div>
    <h2>{question}</h2>
    <fieldset><legend className="sr-only">Choose an answer</legend>{choices.map((label, i) => <label className={`answer ${choice === i ? 'selected' : ''} ${checked && choice === i ? (correct ? 'right' : 'wrong') : ''}`} key={label}>
      <input type="radio" name="answer" checked={choice === i} disabled={correct} onChange={() => { setChoice(i); setChecked(false); }}/>
      <span className="answer-letter">{String.fromCharCode(65 + i)}</span><span>{label}</span>
    </label>)}</fieldset>
    <div className="feedback-slot" aria-live="polite">{checked && <div className={`feedback ${correct ? 'right' : 'wrong'}`}><strong>{correct ? 'Correct!' : 'Try another answer.'}</strong>{correct && ` ${feedback}`}</div>}</div>
    {!correct && <button className="button primary" disabled={choice === null || checked} onClick={() => { setChecked(true); if (choice === answer && final) onComplete(); }}>Check answer <Icon name="arrow" size={17}/></button>}
    {correct && (final ? <a className="button primary" href={nextHref}>{nextLabel} <Icon name="arrow" size={17}/></a> : <button className="button primary" onClick={() => { setIndex(index + 1); setChoice(null); setChecked(false); }}>Next question <Icon name="arrow" size={17}/></button>)}
  </section>;
}
