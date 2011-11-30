/**
 * Configuration object
 */
var config = {
    
    HALFSIZE_X: 1500,
    HALFSIZE_Y: 1000,

    STEP_TIME: 15,
    GM: 50,
    
    EARTH_RADIUS: 150,

    GRID_SPACE: 100,
    GRID_COLOR: 0x444444,
    GRID_OPACITY: 0.4,

    SNAP_THRESHOLD: 0.05,

    RENDER_TIME: 15,
    
    DEFAULT_THRUST: { push: 0.003, rot: 0.005 },
    DEFAULT_TYPE: 'default',
    
    INPUT_UP: 'u',
    INPUT_DOWN: 'd',
    INPUT_LEFT: 'l',
    INPUT_RIGHT: 'r',
    INPUT_SHOOT: 's'
};

exports.config = config;