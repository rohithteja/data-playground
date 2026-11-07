const shapes = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  compass: <><circle cx="12" cy="12" r="9"/><path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5z"/></>,
  code: <><path d="m8 6-6 6 6 6m8-12 6 6-6 6m-2-15-4 18"/></>,
  dice: <><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" strokeWidth="3"/></>,
  chart: <><path d="M4 4v16h16M8 15l4-5 4 2 4-7"/><circle cx="20" cy="5" r="1"/></>,
  vector: <><path d="M4 20h16M4 20V4m0 16L18 6m-6 0h6v6M4 20l10-2"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5M3 16l9 5 9-5"/></>,
  database: <><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></>,
  terminal: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m7 9 3 3-3 3m6 0h4"/></>,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6"/>,
  left: <path d="M20 12H5m6-6-6 6 6 6"/>,
  chevron: <path d="m9 6 6 6-6 6"/>,
  target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  book: <><path d="M12 6C9 4 6 4 3 5v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1v14"/></>,
  flask: <><path d="M9 3h6m-5 0v7l-6 8a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-8V3M7 15h10"/></>,
  bolt: <path d="m13 2-8 12h6l-1 8 9-12h-6l1-8z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  spark: <><path d="M12 2c0 6-4 10-10 10 6 0 10 4 10 10 0-6 4-10 10-10-6 0-10-4-10-10Z"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  reset: <><path d="M3 12a9 9 0 1 1 3 7M3 12V5m0 7h7"/></>,
};

export function Icon({ name, size = 20, className }) {
  return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

export function HeroArt() {
  return <svg className="hero-art" viewBox="0 0 470 300" fill="none" aria-hidden="true">
    <defs>
      <pattern id="hero-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#7B60CF" opacity=".3"/></pattern>
      <pattern id="ball-lines" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><path d="M0 0v5" stroke="#402781" opacity=".35"/></pattern>
    </defs>
    <rect x="23" y="20" width="430" height="260" fill="url(#hero-grid)"/>
    <ellipse cx="252" cy="159" rx="174" ry="84" transform="rotate(-24 252 159)" stroke="#8A70D0" strokeDasharray="4 6"/>
    <ellipse cx="261" cy="152" rx="150" ry="59" transform="rotate(21 261 152)" stroke="#AE96E7"/>
    <path d="M263 44v223M70 154h350" stroke="#AE96E7" strokeDasharray="3 6"/>
    <g className="hero-float">
      <path d="m163 95 96-43 95 43-95 48-96-48Z" fill="#DFD0FF" stroke="#302052" strokeWidth="2"/>
      <path d="m163 95 96 48v105l-96-49V95Z" fill="#9D7BEF" stroke="#302052" strokeWidth="2"/>
      <path d="m259 143 95-48v104l-95 49V143Z" fill="#BD9FFF" stroke="#302052" strokeWidth="2"/>
      <path d="M175 189l16-21 19 6 16-17 19 4m-70 30 70 35" stroke="#302052" strokeWidth="1.6"/>
      <circle cx="191" cy="168" r="4" fill="#E5FA96" stroke="#302052" strokeWidth="1.3"/><circle cx="210" cy="174" r="4" fill="#E5FA96" stroke="#302052" strokeWidth="1.3"/><circle cx="226" cy="157" r="4" fill="#E5FA96" stroke="#302052" strokeWidth="1.3"/>
      <path d="m276 214 13-7v-22l-13 7v22Zm22-11 13-7v-35l-13 7v35Zm22-11 13-7v-48l-13 7v48Z" fill="#E5FA96" stroke="#302052" strokeWidth="1.4"/>
      <path d="m232 95 27-13 27 13-27 14-27-14Z" fill="#E5FA96" stroke="#302052" strokeWidth="1.5"/>
    </g>
    <g className="hero-float slow"><circle cx="120" cy="182" r="32" fill="#E6F795" stroke="#302052" strokeWidth="1.5"/><path d="M91 168a32 32 0 0 0 56 29c-22 2-44-10-56-29Z" fill="url(#ball-lines)"/><ellipse cx="120" cy="182" rx="31" ry="11" transform="rotate(-24 120 182)" stroke="#302052" strokeWidth="1.2"/></g>
    <g className="hero-float delay"><path d="m388 159 33 18-33 19-33-19 33-18Z" fill="#FFC5AC" stroke="#302052" strokeWidth="1.5"/><path d="M355 177v25l33 19v-25m33-19v25l-33 19" fill="#EF9C85" stroke="#302052" strokeWidth="1.5"/></g>
    <path d="M114 73c0 11-6 17-17 17 11 0 17 6 17 17 0-11 6-17 17-17-11 0-17-6-17-17Zm275-26c0 8-5 13-13 13 8 0 13 5 13 13 0-8 5-13 13-13-8 0-13-5-13-13Z" fill="#FBF4FF" stroke="#4C3281" strokeWidth="1.4"/>
    <circle cx="405" cy="119" r="5" fill="#9B75EE"/><circle cx="83" cy="128" r="4" fill="#9B75EE"/><circle cx="174" cy="246" r="5" fill="#FFAD94"/>
    <path d="M230 28h12m-6-6v12M430 231h14m-7-7v14" stroke="#6C50B2" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>;
}
