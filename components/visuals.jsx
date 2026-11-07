import { useEffect, useState } from 'react';
import { Icon } from './icons';

const colors = { purple: '#7042c9', light: '#ded0ff', ink: '#26213b', muted: '#777188', grid: '#e3deef', green: '#d9f28f', darkGreen: '#436819', peach: '#ffb69e' };
const number = (n) => new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(n);
const percent = (ratio) => `${(ratio * 100).toFixed(1)}%`;
const series = (length, fn) => Array.from({ length }, (_, i) => fn(i));

function Slider({ label, min, max, step = 1, value, set, display = number(value) }) {
  return <label className="slider"><span>{label}<span className="slider-value" aria-hidden="true">{display}</span></span><input type="range" aria-label={label} aria-valuetext={String(display)} min={min} max={max} step={step} value={value} onChange={(event) => set(Number(event.target.value))}/></label>;
}
function Metrics({ data }) {
  return <dl className="metrics">{data.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}
function Diagram({ label, children, height = 222 }) {
  return <svg className="diagram" viewBox={`0 0 540 ${height}`} role="img" aria-label={label}>{children}</svg>;
}
function Box({ x, y, width, height = 60, title, value, fill = '#fff' }) {
  return <g><rect x={x} y={y} width={width} height={height} rx="12" fill={fill} stroke={colors.grid}/><text className="svg-caption" x={x + width / 2} y={y + 22} textAnchor="middle">{title}</text>{value && <text className="svg-value" x={x + width / 2} y={y + 43} style={{ fontSize: Math.min(14, (width - 18) / (String(value).length * 0.58)) }} textAnchor="middle">{value}</text>}</g>;
}
function Stepper({ count, render, instructions, interval = 850 }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (index < count - 1) setIndex(index + 1);
      if (index >= count - 2) setPlaying(false);
    }, interval);
    return () => window.clearTimeout(timer);
  }, [count, index, interval, playing]);

  function go(next) {
    setPlaying(false);
    setIndex(next);
  }

  return <div className="lab">
    <p className="lab-instruction">{instructions}</p>
    {render(index)}
    <div className="lab-controls">
      <button className="mini-button" onClick={() => go(0)} disabled={index === 0 && !playing}><Icon name="reset" size={16}/> Reset</button>
      <button className="mini-button" onClick={() => go(index - 1)} disabled={index === 0}>Back</button>
      <button className="mini-button" onClick={() => {
        if (playing) { setPlaying(false); return; }
        if (index === count - 1) setIndex(0);
        setPlaying(true);
      }}>{playing ? 'Pause' : 'Play'}</button>
      <button className="mini-button filled" onClick={() => go(index + 1)} disabled={index === count - 1}>Step <Icon name="arrow" size={15}/></button>
      <span className="lab-position" aria-live="polite">Step {index + 1} / {count}</span>
    </div>
  </div>;
}

function Steps({ frames }) {
  return <Stepper count={frames.length} instructions="Step through the example and watch what changes." render={(index) => {
    const [title, first, second] = frames[index];
    return <Diagram label={`${title}. ${first}. ${second}`} height={178}>
      <text className="svg-caption" x="270" y="32" textAnchor="middle">{title}</text>
      <g key={index} className="diagram-enter">
        <Box x={second ? 26 : 160} y={52} width={second ? 218 : 220} height={67} title={second ? 'Current step' : 'Result'} value={first} fill={colors.light}/>
        {second && <><path d="M252 85h36m-7-7 7 7-7 7" fill="none" stroke={colors.purple} strokeWidth="2"/><Box x={296} y={52} width={218} height={67} title="State" value={second} fill={colors.green}/></>}
      </g>
      {frames.map((frame, i) => <circle key={i} cx={270 + (i - (frames.length - 1) / 2) * 19} cy="149" r={i === index ? 5.5 : 4} fill={i === index ? colors.purple : colors.grid}/>)}
    </Diagram>;
  }}/>;
}

function Bayes() {
  const [prevalence, setPrevalence] = useState(1);
  const truePositive = 90 * prevalence;
  const falsePositive = 5 * (100 - prevalence);
  const share = truePositive / (truePositive + falsePositive);
  return <div className="lab">
    <p className="lab-instruction">Move the base rate in a group of 10,000. The test catches 90% of real cases and flags 5% of the others.</p>
    <Slider label="Base rate" min={0.2} max={25} step={0.2} value={prevalence} display={`${prevalence}%`} set={setPrevalence}/>
    <Diagram label={`Of all positive tests, ${percent(share)} are true positives.`} height={202}>
      <path d="M163 77C200 77 185 48 222 48M163 77C200 77 185 121 222 121M345 48C385 48 362 78 402 78M345 121C385 121 362 78 402 78" fill="none" stroke={colors.purple} strokeWidth="2" strokeDasharray="4 4"/>
      <Box x={19} y={48} width={144} title="All cases" value="10,000" />
      <Box x={222} y={18} width={123} title="True positives" value={number(truePositive)} fill={colors.green}/>
      <Box x={222} y={91} width={123} title="False positives" value={number(falsePositive)} fill={colors.peach}/>
      <Box x={402} y={48} width={119} title="Total positives" value={number(truePositive + falsePositive)} fill={colors.light}/>
      <rect x="20" y="168" width="500" height="14" rx="7" fill={colors.peach}/>
      <rect className="svg-transition" x="20" y="168" width={500 * share} height="14" rx="7" fill="#9fc74a"/>
    </Diagram>
    <Metrics data={[[ 'Positive tests that are real', percent(share)], ['True positives', number(truePositive)], ['False positives', number(falsePositive)]]}/>
  </div>;
}

const plot = { x: 52, y: 21, w: 456, h: 165 };
const px = (x) => plot.x + x * plot.w;
const py = (y) => plot.y + (1 - y) * plot.h;
const points = (data) => data.map(([x, y]) => `${px(x)},${py(y)}`).join(' ');
function Plot({ label, xLabel, yLabel, children }) {
  return <Diagram label={label}>
    {[0, 0.25, 0.5, 0.75, 1].map((v) => <path key={v} d={`M${px(0)} ${py(v)}H${px(1)}M${px(v)} ${py(0)}V${py(1)}`} stroke={colors.grid}/>)}
    <path d={`M${px(0)} ${py(1)}V${py(0)}H${px(1)}`} fill="none" stroke={colors.muted}/>
    {children}
    <text x="280" y="211" textAnchor="middle" className="svg-caption">{xLabel}</text>
    <text x="17" y="105" transform="rotate(-90 17 105)" textAnchor="middle" className="svg-caption">{yLabel}</text>
  </Diagram>;
}

function Outlier() {
  const [last, setLast] = useState(100);
  const values = [10, 20, 30, 40, last];
  const mean = (100 + last) / 5;
  return <div className="lab">
    <p className="lab-instruction">Drag the largest basket value. Compare the positions of the mean and median.</p>
    <Slider label="Largest basket" min={50} max={150} step={5} value={last} display={`€${last}`} set={setLast}/>
    <Diagram label={`Basket totals ${values.join(', ')} euros. Median 30 euros, mean ${mean} euros.`} height={160}>
      <path d="M52 79h456" stroke={colors.muted}/>
      {[0, 30, 60, 90, 120, 150].map((v) => <g key={v}><path d={`M${px(v / 150)} 79v8`} stroke={colors.muted}/><text x={px(v / 150)} y="104" className="svg-caption" textAnchor="middle">{v}</text></g>)}
      {values.map((v, i) => <circle key={i} className="svg-transition" cx={px(v / 150)} cy="70" r="7" fill={i === 4 ? '#df684b' : colors.purple}/>)}
      <path d={`M${px(0.2)} 43V60`} stroke={colors.darkGreen} strokeWidth="2"/><text x={px(0.2)} y="35" textAnchor="middle" fill={colors.darkGreen} className="svg-label">Median</text>
      <path d={`M${px(mean / 150)} 109v14`} stroke={colors.purple} strokeWidth="2"/><text x={px(mean / 150)} y="142" textAnchor="middle" fill={colors.purple} className="svg-label">Mean</text>
    </Diagram>
    <Metrics data={[[ 'Mean', `€${mean}`], ['Median', '€30']]}/>
  </div>;
}

function Complexity() {
  const [size, setSize] = useState(10);
  return <div className="lab">
    <p className="lab-instruction">Increase the input size. Both lines share the same scale for work.</p>
    <Slider label="Input size n" min={2} max={25} value={size} set={setSize}/>
    <Plot label={`At n equals ${size}, linear work is ${size}, quadratic work is ${size ** 2}.`} xLabel="Input size n" yLabel="Operations">
      <polyline points={points([[0, 0], [1, 25 / 625]])} fill="none" stroke={colors.darkGreen} strokeWidth="3"/>
      <polyline points={points(series(26, (i) => [i / 25, i ** 2 / 625]))} fill="none" stroke={colors.purple} strokeWidth="3"/>
      <path d={`M${px(size / 25)} ${py(0)}V${py(1)}`} stroke={colors.muted} strokeDasharray="4 4"/>
      <circle cx={px(size / 25)} cy={py(size / 625)} r="6" fill={colors.darkGreen}/>
      <circle cx={px(size / 25)} cy={py(size ** 2 / 625)} r="6" fill={colors.purple}/>
    </Plot>
    <Metrics data={[[ 'Linear work · n', number(size)], ['Quadratic work · n²', number(size ** 2)]]}/>
  </div>;
}

function Vectors() {
  const [angle, setAngle] = useState(45);
  const rad = angle * Math.PI / 180;
  const x = 220 + 112 * Math.cos(rad), y = 160 - 112 * Math.sin(rad);
  const cosine = Math.abs(Math.cos(rad)) < 1e-10 ? 0 : Math.cos(rad);
  return <div className="lab">
    <p className="lab-instruction">Rotate the purple unit vector. Compare its direction with the fixed green vector.</p>
    <Slider label="Angle between vectors" min={0} max={180} step={5} value={angle} display={`${angle}°`} set={setAngle}/>
    <Diagram label={`Two unit vectors separated by ${angle} degrees. Cosine similarity ${cosine.toFixed(2)}.`}>
      <defs><marker id="vector-end" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={colors.purple}/></marker><marker id="fixed-end" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={colors.darkGreen}/></marker></defs>
      <path d="M63 160h341M220 190V27" stroke={colors.grid}/>
      <path d="M220 160h112" stroke={colors.darkGreen} strokeWidth="4" markerEnd="url(#fixed-end)"/>
      <path d={`M220 160L${x} ${y}`} stroke={colors.purple} strokeWidth="4" markerEnd="url(#vector-end)"/>
      {angle > 0 && <path d={`M257 160A37 37 0 0 0 ${220 + 37 * Math.cos(rad)} ${160 - 37 * Math.sin(rad)}`} stroke={colors.purple} fill="none" strokeDasharray="3 3"/>}
      <text x="349" y="166" className="svg-caption">Fixed</text>
      <text x={x} y={y - 12} textAnchor="middle" className="svg-label" fill={colors.purple}>Rotating</text>
    </Diagram>
    <Metrics data={[[ 'Angle', `${angle}°`], ['Cosine similarity', cosine.toFixed(2)]]}/>
  </div>;
}

const loss = (w) => (w - 2) ** 2;
function LossPlot({ value, history = [], tangent = false }) {
  const bound = Math.max(3.2, ...history.map((w) => Math.abs(w - 2)));
  const x = (w) => (w - 2 + bound) / (2 * bound);
  const y = (l) => l / (bound ** 2 * 1.15);
  const gradient = 2 * (value - 2);
  const d = 0.18 * bound;
  return <Plot label={`Quadratic loss curve. Current weight ${number(value)}, loss ${number(loss(value))}.`} xLabel="Weight w" yLabel="Loss">
    <polyline points={points(series(81, (i) => { const w = 2 - bound + i * bound / 40; return [x(w), y(loss(w))]; }))} fill="none" stroke={colors.purple} strokeWidth="3"/>
    {history.length > 1 && <polyline points={points(history.map((w) => [x(w), y(loss(w))]))} fill="none" stroke="#b492ec" strokeWidth="2" strokeDasharray="4 4"/>}
    {tangent && <polyline points={points([[x(value - d), y(loss(value) - gradient * d)], [x(value + d), y(loss(value) + gradient * d)]])} stroke={colors.darkGreen} strokeWidth="2"/>}
    {history.slice(0, -1).map((w, i) => <circle key={i} cx={px(x(w))} cy={py(y(loss(w)))} r="3" fill={colors.purple}/>)}
    <circle cx={px(x(value))} cy={py(y(loss(value)))} r="7" stroke={colors.purple} strokeWidth="2" fill={colors.green}/>
  </Plot>;
}

function Slope() {
  const [value, setValue] = useState(4);
  return <div className="lab"><p className="lab-instruction">Move the point on L(w) = (w − 2)². The green line shows the local slope.</p>
    <Slider label="Weight w" min={-0.5} max={4.5} step={0.1} value={value} set={setValue}/>
    <LossPlot value={value} tangent/>
    <Metrics data={[[ 'Derivative', number(2 * (value - 2))], ['Loss', number(loss(value))]]}/>
  </div>;
}

function Descent() {
  const [rate, setRate] = useState(0.25);
  const history = [5];
  for (let i = 0; i < 6; i++) history.push(history[i] - rate * 2 * (history[i] - 2));
  return <div className="lab lab-outer">
    <Slider label="Learning rate" min={0.05} max={1.15} step={0.05} value={rate} set={setRate}/>
    <Stepper key={rate} count={history.length} instructions="Start at w = 5. Each step subtracts the learning rate times the slope. Try a rate above 1." render={(i) => <>
      <LossPlot value={history[i]} history={history.slice(0, i + 1)}/>
      <Metrics data={[[ 'Updates', i], ['Weight', number(history[i])], ['Loss', number(loss(history[i]))]]}/>
    </>}/>
  </div>;
}

function Distribution() {
  const [cutoff, setCutoff] = useState(2);
  const n = 12, p = 0.25;
  let current = (1 - p) ** n;
  const probabilities = [current];
  for (let k = 1; k <= n; k++) {
    current *= (n - k + 1) / k * p / (1 - p);
    probabilities.push(current);
  }
  const cumulative = probabilities.slice(0, cutoff + 1).reduce((total, val) => total + val, 0);
  return <div className="lab"><p className="lab-instruction">Shade all counts at or below the cutoff for 12 trials with a 25% chance of success each.</p>
    <Slider label="Success count cutoff" min={0} max={n} value={cutoff} set={setCutoff}/>
    <Plot label={`Binomial probability of ${cutoff} or fewer successes is ${percent(cumulative)}.`} xLabel="Number of successes" yLabel="Probability">
      {probabilities.map((val, i) => <g key={i}><rect x={px(i / 13) + 5} y={py(val / 0.28)} width="23" height={plot.h * val / 0.28} rx="3" fill={i <= cutoff ? colors.purple : colors.light}/><text x={px(i / 13) + 17} y="199" textAnchor="middle" className="svg-caption">{i}</text></g>)}
    </Plot>
    <Metrics data={[[ `P(X ≤ ${cutoff})`, percent(cumulative)], [`P(X = ${cutoff})`, percent(probabilities[cutoff])]]}/>
  </div>;
}

function Coins() {
  const [flips, setFlips] = useState([1, 1, 1, 0, 1]);
  function add(count) {
    setFlips((values) => [...values, ...series(count, () => Number(Math.random() < 0.5))]);
  }
  let heads = 0;
  const running = flips.map((flip, i) => { heads += flip; return [i / Math.max(1, flips.length - 1), heads / (i + 1)]; });
  return <div className="lab"><p className="lab-instruction">The example starts with four heads in five flips. Add independent fair flips and watch the running proportion.</p>
    <Plot label={`${heads} heads in ${flips.length} flips.`} xLabel="Flips so far" yLabel="Fraction heads">
      <path d={`M${px(0)} ${py(0.5)}H${px(1)}`} stroke={colors.darkGreen} strokeWidth="2" strokeDasharray="5 5"/>
      <polyline points={points(running)} stroke={colors.purple} fill="none" strokeWidth="2.5"/>
      <circle cx={px(1)} cy={py(heads / flips.length)} r="5" fill={colors.purple}/>
    </Plot>
    <Metrics data={[[ 'Flips', number(flips.length)], ['Heads', number(heads)], ['Fraction heads', percent(heads / flips.length)]]}/>
    <div className="lab-controls"><button className="mini-button" onClick={() => setFlips([1, 1, 1, 0, 1])}><Icon name="reset" size={16}/> Reset</button><button className="mini-button" onClick={() => add(1)} disabled={flips.length >= 5000}>Flip once</button><button className="mini-button filled" onClick={() => add(Math.min(100, 5000 - flips.length))} disabled={flips.length >= 5000}>Flip 100 times</button></div>
  </div>;
}

function Switch({ options, selected, set, label = 'Visual mode' }) {
  return <div className="lab-switch" role="group" aria-label={label}>{options.map((option, i) => <button className="mini-button" aria-pressed={selected === i} onClick={() => set(i)} key={option}>{option}</button>)}</div>;
}

function Correlation() {
  const [mode, setMode] = useState(0);
  const data = mode === 0
    ? series(13, (i) => [i / 14 + 0.06, 0.1 + i / 16 + [0.02, 0.09, -0.04][i % 3]])
    : series(13, (i) => [i / 14 + 0.07, 0.12 + ((i - 6) / 6) ** 2 * 0.77]);
  return <div className="lab"><p className="lab-instruction">Switch between two relationships. Both use paired measurements.</p>
    <Switch options={['Linear trend', 'U-shaped trend']} selected={mode} set={setMode}/>
    <Plot label={mode === 0 ? 'Scatterplot with an upward linear trend.' : 'Symmetric U-shaped scatterplot with zero linear correlation.'} xLabel="Feature x" yLabel="Feature y">
      {data.map(([x, y], i) => <circle key={i} className="svg-transition" cx={px(x)} cy={py(y)} r="6" fill={colors.purple}/>)}
    </Plot>
    <p className="lab-note">{mode === 0 ? 'Pearson correlation is positive because larger x usually comes with larger y.' : 'Pearson correlation is zero in this symmetric example. The plot still shows a strong relationship.'}</p>
  </div>;
}

function Binary() {
  const values = [2, 4, 7, 9, 12, 15, 19];
  const frames = [[0, 6, 3, '15 is greater than 9. Discard the left side and the middle.'], [4, 6, 5, '15 matches the middle. The search ends.']];
  return <Stepper count={frames.length} instructions="Find 15 in the sorted array. The purple cell is the middle of the current interval." render={(i) => {
    const [lo, hi, mid, caption] = frames[i];
    return <><Diagram label={caption} height={126}>
      {values.map((value, j) => <Box key={value} x={17 + j * 74} y={31} width={61} height={61} title={`i = ${j}`} value={value} fill={j === mid ? (i === 1 ? colors.green : colors.light) : j >= lo && j <= hi ? '#fff' : '#eeebf2'}/>)}
    </Diagram><p className="lab-note" aria-live="polite">{caption}</p></>;
  }}/>;
}

function Recursion() {
  const frames = [
    [['factorial(3)'], '3 waits for factorial(2).'],
    [['factorial(3)', 'factorial(2)'], '2 waits for factorial(1).'],
    [['factorial(3)', 'factorial(2)', 'factorial(1)'], 'The base case returns 1.'],
    [['factorial(3)', 'factorial(2)'], 'The call for 2 returns 2 × 1 = 2.'],
    [['factorial(3)'], 'The call for 3 returns 3 × 2 = 6.'],
    [[], 'The caller receives 6. The stack is empty.']
  ];
  return <Stepper count={frames.length} instructions="Follow factorial(3). New calls appear at the top of the stack." render={(i) => {
    const [stack, caption] = frames[i];
    return <><Diagram label={`${stack.join(', ')}. ${caption}`} height={224}>
      <path d="M137 28v170h266V28" stroke={colors.grid} strokeWidth="2" fill="none"/>
      {stack.map((call, j) => <g key={call} className="diagram-enter"><Box x={156} y={143 - j * 52} width={228} height={43} title={call} fill={j === stack.length - 1 ? colors.light : '#fff'}/></g>)}
      {stack.length === 0 && <text x="270" y="115" textAnchor="middle" className="svg-value">Result = 6</text>}
    </Diagram><p className="lab-note" aria-live="polite">{caption}</p></>;
  }}/>;
}

const initialSort = [4, 2, 5, 1, 3];
const sortFrames = [{ values: initialSort, pair: [], caption: 'Start with the unsorted array.' }];
const sorted = [...initialSort];
for (let end = sorted.length - 1; end > 0; end--) {
  for (let i = 0; i < end; i++) {
    const [left, right] = [sorted[i], sorted[i + 1]];
    if (left > right) [sorted[i], sorted[i + 1]] = [right, left];
    sortFrames.push({ values: [...sorted], pair: [left, right], caption: left > right ? `Swap ${left} and ${right}.` : `Keep ${left} before ${right}.` });
  }
}
sortFrames.push({ values: sorted, pair: [], caption: 'Each item is in sorted order.' });

function Sorting() {
  return <Stepper count={sortFrames.length} instructions="Run bubble sort. Each step compares adjacent bars and swaps them if they are out of order." render={(index) => {
    const { values, pair, caption } = sortFrames[index];
    return <><Diagram label={`${caption} Current order ${values.join(', ')}.`} height={192}>
      <path d="M48 162h444" stroke={colors.grid}/>
      {initialSort.map((value) => <g key={value} className="sort-bar" style={{ transform: `translateX(${64 + 83 * values.indexOf(value)}px)` }}><rect y={162 - value * 25} width="65" height={value * 25} rx="6" fill={pair.includes(value) ? colors.purple : index === sortFrames.length - 1 ? colors.green : colors.light}/><text x="32.5" y={151 - value * 25} className="svg-value" textAnchor="middle">{value}</text></g>)}
    </Diagram><p className="lab-note" aria-live="polite">{caption}</p></>;
  }}/>;
}

function Graph() {
  const [mode, setMode] = useState(0);
  const nodes = { A: [270, 37], B: [160, 96], C: [380, 96], D: [84, 168], E: [211, 168], F: [380, 168] };
  const order = mode === 0 ? 'ABCDEF' : 'ABDECF';
  return <div className="lab-outer"><Switch options={['Breadth-first', 'Depth-first']} selected={mode} set={setMode} label="Search strategy"/>
    <Stepper key={mode} count={6} instructions="Start at A. Purple shows the current node. Green nodes have already been visited." render={(index) => <Diagram label={`Visited ${order.slice(0, index + 1).split('').join(', ')}.`}>
      {['AB', 'AC', 'BD', 'BE', 'CF'].map(([a, b]) => <path key={a + b} d={`M${nodes[a].join(' ')}L${nodes[b].join(' ')}`} stroke={colors.muted} strokeWidth="2"/>)}
      {Object.entries(nodes).map(([name, [x, y]]) => <g key={name}><circle cx={x} cy={y} r="21" fill={name === order[index] ? colors.purple : order.indexOf(name) < index ? colors.green : '#fff'} stroke={colors.grid}/><text x={x} y={y + 5} textAnchor="middle" fill={name === order[index] ? '#fff' : colors.ink} className="svg-label">{name}</text></g>)}
      <text className="svg-caption" x="270" y="210" textAnchor="middle">Visit order · {order.slice(0, index + 1).split('').join(' → ')}</text>
    </Diagram>}/>
  </div>;
}

function Git() {
  const [mode, setMode] = useState(0);
  return <div className="lab"><p className="lab-instruction">The example starts with two branches that share commit A. Switch how the feature commits are integrated.</p>
    <Switch options={['Before integration', 'Merge', 'Rebase feature onto main']} selected={mode} set={setMode}/>
    <Diagram label={['Main and feature diverge at A.', 'Merge commit M has both branch tips as parents.', 'Feature commit C is replayed as C prime after B.'][mode]} height={175}>
      <path d={mode === 2 ? 'M80 74H400' : 'M80 74H242M80 74Q160 74 240 126' + (mode === 1 ? 'M242 74H400M240 126Q325 126 400 74' : '')} stroke={colors.purple} strokeWidth="2.5" fill="none"/>
      {[[80, 74, 'A'], [242, 74, 'B'], ...(mode < 2 ? [[240, 126, 'C']] : []), ...(mode ? [[400, 74, mode === 1 ? 'M' : 'C′']] : [])].map(([x, y, name]) => <g key={name}><circle cx={x} cy={y} r="19" stroke={colors.purple} fill={name === 'C' || name === 'C′' ? colors.green : colors.light}/><text x={x} y={y + 5} className="svg-value" textAnchor="middle">{name}</text></g>)}
      <text x={mode === 1 ? '400' : '242'} y="37" textAnchor="middle" className="svg-caption">main</text>
      <text x={mode === 2 ? '400' : '240'} y={mode === 2 ? '37' : '160'} textAnchor="middle" className="svg-caption">feature</text>
    </Diagram>
    <p className="lab-note">{['B and C each have A as their parent.', 'M joins both lines of history.', 'C′ carries the feature change and has a new parent, B.'][mode]}</p>
  </div>;
}

function Join() {
  const [mode, setMode] = useState(0);
  return <div className="lab"><p className="lab-instruction">Join orders to customers on customer ID. Order 103 has a customer ID that the lookup table lacks.</p>
    <Switch options={['Inner join', 'Left join']} selected={mode} set={setMode} label="Join type"/>
    <Diagram label={mode === 0 ? 'Two rows matched. Order 103 is excluded.' : 'All three orders remain. Order 103 has no customer name.'} height={205}>
      <text className="svg-caption" x="104" y="27" textAnchor="middle">ORDERS</text><text className="svg-caption" x="270" y="27" textAnchor="middle">CUSTOMERS</text><text className="svg-caption" x="438" y="27" textAnchor="middle">RESULT</text>
      {[['101 · A', 'A · Ada', '101 · Ada'], ['102 · B', 'B · Ben', '102 · Ben'], ['103 · C', 'No C key', mode ? '103 · NULL' : 'Excluded']].map(([left, right, result], i) => {
        const y = 46 + i * 49;
        return <g key={left}><path d={`M167 ${y + 17}h40m126 0h40`} stroke={i < 2 ? colors.purple : colors.muted} strokeDasharray={i === 2 ? '4 4' : undefined}/>
          <Box x={40} y={y} width={127} height={35} title={left}/><Box x={207} y={y} width={126} height={35} title={right}/><Box x={373} y={y} width={130} height={35} title={result} fill={i < 2 ? colors.green : colors.peach}/></g>;
      })}
    </Diagram><Metrics data={[[ 'Input orders', 3], ['Output rows', mode ? 3 : 2], ['Matched orders', 2]]}/>
  </div>;
}

function Threshold() {
  const [threshold, setThreshold] = useState(55);
  const samples = [[92, 1], [84, 1], [73, 0], [66, 1], [57, 0], [45, 1], [36, 0], [27, 0], [21, 0], [14, 0]];
  const positives = samples.filter(([score]) => score >= threshold);
  const truePositives = positives.filter(([, actual]) => actual).length;
  return <div className="lab"><p className="lab-instruction">Scores at or above the line trigger an offer. Green bars mark customers who would respond.</p>
    <Slider label="Offer threshold" min={0} max={100} step={1} value={threshold} display={`${threshold}%`} set={setThreshold}/>
    <Plot label={`${positives.length} predicted positives, ${truePositives} of them correct.`} xLabel="Customers sorted by score" yLabel="Model score">
      {samples.map(([score, actual], i) => <rect key={score} x={px(i / 10) + 6} y={py(score / 100)} width="31" height={plot.h * score / 100} rx="3" fill={actual ? '#a9ce57' : '#ae94e7'} opacity={score >= threshold ? 1 : 0.42}/>)}
      <path d={`M${px(0)} ${py(threshold / 100)}H${px(1)}`} stroke={colors.ink} strokeDasharray="5 4" strokeWidth="2"/>
    </Plot>
    <Metrics data={[[ 'Offers sent', positives.length], ['Precision', positives.length ? percent(truePositives / positives.length) : 'Undefined'], ['Recall', percent(truePositives / 4)]]}/>
  </div>;
}

function Charts() {
  const [mode, setMode] = useState(0);
  const labels = ['Histogram', 'Bar chart', 'Scatterplot'];
  const captions = ['Count deliveries in ranges of delivery time.', 'Compare late delivery rates across cities.', 'Look at distance and time together for each delivery.'];
  return <div className="lab"><p className="lab-instruction">Choose a question to change the view of the example delivery data.</p>
    <Switch options={labels} selected={mode} set={setMode} label="Chart type"/>
    <Plot label={captions[mode]} xLabel={['Delivery time (min)', 'City', 'Distance'][mode]} yLabel={['Number of deliveries', 'Late rate', 'Delivery time'][mode]}>
      {mode === 0 && [2, 6, 10, 7, 3, 1].map((n, i) => <rect key={i} x={px(0.1 + i * 0.13)} y={py(n / 11)} width="58" height={plot.h * n / 11} fill={colors.purple} stroke="#fff"/>)}
      {mode === 1 && [0.1, 0.25, 0.15].map((n, i) => <g key={i}><rect x={px(0.17 + i * 0.26)} y={py(n / 0.3)} width="72" height={plot.h * n / 0.3} rx="4" fill={colors.purple}/><text x={px(0.17 + i * 0.26) + 36} y={py(n / 0.3) - 8} className="svg-caption" textAnchor="middle">{n * 100}%</text><text x={px(0.17 + i * 0.26) + 36} y="199" className="svg-caption" textAnchor="middle">{['A', 'B', 'C'][i]}</text></g>)}
      {mode === 2 && series(12, (i) => <circle key={i} cx={px(0.06 + i * 0.08)} cy={py(0.1 + i * 0.064 + [0.06, 0.15, -0.02][i % 3])} r="6" fill={colors.purple}/>)}
    </Plot><p className="lab-note">{captions[mode]}</p>
  </div>;
}

const visuals = { steps: Steps, bayes: Bayes, outlier: Outlier, complexity: Complexity, vectors: Vectors, slope: Slope, descent: Descent, distribution: Distribution, coins: Coins, correlation: Correlation, binary: Binary, recursion: Recursion, sorting: Sorting, graph: Graph, git: Git, join: Join, threshold: Threshold, charts: Charts };

export function VisualLab({ visual }) {
  const Lab = visuals[visual.kind];
  return <Lab {...visual}/>;
}
