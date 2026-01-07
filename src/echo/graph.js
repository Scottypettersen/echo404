// src/echo/graph.js
export const ECHO_GRAPH = {
  access1: { path: '/access1', requires: [], redirect: '/trace', next: 'access2' },
  access2: { path: '/access2', requires: ['ACCESS1_DONE'], redirect: '/trace', next: 'access3' },
  access3: { path: '/access3', requires: ['ACCESS2_DONE'], redirect: '/trace', next: 'puzzle' },

  puzzle: { path: '/puzzle', requires: ['ACCESS3_DONE'], redirect: '/trace', next: 'unlock' },
  unlock: { path: '/unlock', requires: ['PUZZLE_DONE'], redirect: '/trace', next: 'wall' },
  wall: { path: '/wall', requires: ['UNLOCK_DONE'], redirect: '/trace', next: null },

  // side routes (always accessible)
  trace: { path: '/trace', requires: [], redirect: '/trace', next: null },
  denied: { path: '/denied', requires: [], redirect: '/trace', next: null },
  glitch: { path: '/glitch', requires: [], redirect: '/trace', next: null },
  coredump: { path: '/core.dump', requires: [], redirect: '/trace', next: null },
};
