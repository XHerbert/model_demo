



var unreal = {

    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    mesh: null,
    bloomComposer: null,

    bloomLayer: null,
    ENTIRE_SCENE: 0,
    BLOOM_SCENE: 1,
    materials: {},
    darkMaterial: null,

    initRenderBloom: function (scene, camera, renderer, mesh) {

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.mesh = mesh;

        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(this.BLOOM_SCENE);
        this.darkMaterial = new THREE.MeshBasicMaterial({});

        // this.renderer.autoClear = false;
        var renderScene = new THREE.RenderPass(scene, camera);
        //Bloom通道创建
        var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.1, 0.0);
        bloomPass.renderToScreen = false;
        bloomPass.threshold = 0.2;
        bloomPass.strength = 0.25;
        bloomPass.radius = 0.75;

        bloomPass.threshold = 0;
        bloomPass.strength = 0.75;
        bloomPass.radius = 1;
        bloomPass.bloomStrength = 3.0;
        window.bloomPass = bloomPass;

        /** 
        let bloomComposer = new THREE.EffectComposer(this.renderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);
        this.bloomComposer = bloomComposer;


        let finalPass = new THREE.ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: this.getVertexShader(),
                fragmentShader: this.getFragmentShader(),
                defines: {}
            }), "baseTexture"
        );
        finalPass.needsSwap = true;
        let finalComposer = new THREE.EffectComposer(renderer);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(finalPass);

        this.renderBloom(false);
        finalComposer.render();

        **/



        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.composer.addPass(renderScene);
        // 眩光通道bloomPass插入到composer
        this.composer.addPass(bloomPass);

        var copyShader = new THREE.ShaderPass(THREE.CopyShader);
        copyShader.renderToScreen = true;
        this.composer.addPass(copyShader);

        //反锯齿 R85版本代码
        let ssaaRenderPass = new THREE.SSAARenderPass(this.scene, this.camera, 0x000000, 0);
        ssaaRenderPass.setSize(window.innerWidth, window.innerHeight);
        ssaaRenderPass.unbiased = true;
        this.composer.addPass(ssaaRenderPass);

    },


    composerRenderer: function render() {
        // this.composer.render();

        // this.renderer.clear();
        this.camera.layers.set(this.BLOOM_SCENE);
        this.composer.render();

        // this.renderer.clearDepth();
        //this.camera.layers.set(this.ENTIRE_SCENE);
        //this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.composerRenderer.bind(this));
    },


    renderBloom: function renderBloom(mask) {
        if (mask === true) {
            unreal.scene.traverse(unreal.darkenNonBloomed);
            unreal.bloomComposer.render();
            unreal.scene.traverse(unreal.restoreMaterial);
        } else {
            unreal.camera.layers.set(unreal.BLOOM_SCENE);
            unreal.bloomComposer.render();
            unreal.camera.layers.set(unreal.ENTIRE_SCENE);
        }
    },


    getVertexShader: function () {
        return `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `;
    },

    getFragmentShader: function () {
        return `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        vec4 getTexture( sampler2D texelToLinearTexture ) {
            return mapTexelToLinear( texture2D( texelToLinearTexture , vUv ) );
        }

        void main() {
            gl_FragColor = ( getTexture( baseTexture ) + vec4( 1.0 ) * getTexture( bloomTexture ) );
        }
        `;
    },

    darkenNonBloomed: function darkenNonBloomed(obj) {
        if (obj.isMesh && unreal.bloomLayer.test(obj.layers) === false) {
            unreal.materials[obj.uuid] = obj.material;
            obj.material = unreal.darkMaterial;
        }
    },
    restoreMaterial: function restoreMaterial(obj) {
        if (unreal.materials[obj.uuid]) {
            obj.material = unreal.materials[obj.uuid];
            delete unreal.materials[obj.uuid];
        }
    }
}

export { unreal }

