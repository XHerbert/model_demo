/**
 * @author:xuhongbo
 * @function:chunk shaders
 */

import gradient_box_vertex_shader from '../gradientbox/gradient_box_vertex_shader.glsl.js';
import gradient_box_fragment_shader from '../gradientbox/gradient_box_fragment_shader.glsl.js';
import breathe_light_vertex_shader from '../breathelight/breathe_light_vertex_shader.glsl.js';
import breathe_light_fragment_shader from '../breathelight/breathe_light_fragment_shader.glsl.js';
import stripes_box_vertex_shader from '../stripesbox/stripes_box_vertex_shader.glsl.js';
import stripes_box_fragment_shader from '../stripesbox/stripes_box_fragment_shader.glsl.js';


export var ModelShaderChunk = {
    gradient_box_vertex_shader: gradient_box_vertex_shader,
    gradient_box_fragment_shader: gradient_box_fragment_shader,
    breathe_light_vertex_shader: breathe_light_vertex_shader,
    breathe_light_fragment_shader: breathe_light_fragment_shader,
    stripes_box_vertex_shader: stripes_box_vertex_shader,
    stripes_box_fragment_shader: stripes_box_fragment_shader,
}