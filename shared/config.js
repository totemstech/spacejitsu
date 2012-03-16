/**
 * Configuration object
 */
var config = {
 
  RATIO: 9 / 16,
  
  HALFSIZE_X: 2600,
  
  STEP_TIME: 15,
  GM: 30,
  
  GRID_SPACE: 100,
  GRID_COLOR: 0x444444,
  GRID_OPACITY: 0.4,
  
  SMOOTH_FACTOR: 0.2,
  SNAP_THRESHOLD: 100.0,
  
  RENDER_TIME: 15,
  UPDATE_TIME: 300,
  
  DEFAULT_THRUST: { push: 0.002, rot: 0.005 },
  DEFAULT_MODEL: 'nomodel',
  DEFAULT_LIFESPAN: 1000*60*60*24*365,
  DEFAULT_MISSILE: 'nomissile',
  
  PARTICLE_TYPE: 'particle',
  BODY_TYPE: 'body',
  PLANET_TYPE: 'planet',
  SHIP_TYPE: 'ship',
  MISSILE_TYPE: 'missile',
  
  INPUT_UP: 'u',
  INPUT_DOWN: 'd',
  INPUT_LEFT: 'l',
  INPUT_RIGHT: 'r',
  INPUT_SHOOT: 's',
  
  CLIENT_SIDE: !(typeof module !== 'undefined' && module.exports),
  SERVER_SIDE: (typeof module !== 'undefined' && module.exports),
  
  SIMULATION_LEN: 15,
  
  MISSILE_REPETITION: { 'm0': 200 },
  PLANET_RADIUS: { 'earth': 200,
                   'moon': 50 },

  MAX_VELOCITY: 3
  
};

exports.config = config;