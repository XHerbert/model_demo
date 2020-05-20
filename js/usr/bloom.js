

import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js"

var unreal = {

    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    mesh: null,

    initRenderBloom: function (scene, camera, renderer) {

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        var renderScene = new RenderPass(scene, camera);
        //Bloom通道创建
        var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 13.5, 0.8, 0.45);
        bloomPass.renderToScreen = true;
        bloomPass.threshold = 0;
        bloomPass.strength = 1.5;
        bloomPass.radius = 0;


        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.addPass(renderScene);
        // 眩光通道bloomPass插入到composer
        this.composer.addPass(bloomPass);

        console.log(this.renderer);
        console.log(typeof (this.renderer));
    },
    composerRenderer: function render() {
        this.composer.render();
        requestAnimationFrame(this.composerRenderer.bind(this));
        // if (this.mesh) {
        //     this.mesh.rotation.x += 0.005;
        //     this.mesh.rotation.y += 0.005;
        // }
    }

}

export { unreal }

