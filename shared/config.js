/**
 * Configuration object
 */
var config = {
    
    HALFSIZE_X: 1500,
    HALFSIZE_Y: 1000,

    STEP_TIME: 15,
    GM: 30,
    
    EARTH_RADIUS: 150,

    GRID_SPACE: 100,
    GRID_COLOR: 0x444444,
    GRID_OPACITY: 0.4,

    SNAP_THRESHOLD: 0.05,

    RENDER_TIME: 15,
    UPDATE_TIME: 500,

    DEFAULT_THRUST: { push: 0.002, rot: 0.005 },
    DEFAULT_MODEL: 'nomodel',

    PARTICLE_TYPE: 'particle',
    BODY_TYPE: 'body',
    SHIP_TYPE: 'ship',
    
    INPUT_UP: 'u',
    INPUT_DOWN: 'd',
    INPUT_LEFT: 'l',
    INPUT_RIGHT: 'r',
    INPUT_SHOOT: 's'
};

exports.config = config;