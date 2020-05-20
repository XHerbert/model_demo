import { light } from '../usr/light.js'
import { unreal } from '../usr/custom-pass.js'

var wd_fbx = {

    scene: null,
    viewer: null,

    init_fbx: function (scene, camera, viewer, renderer) {
        this.scene = scene;
        this.viewer = viewer;

        viewer.setBackgroundColor(new Glodon.Web.Graphics.Color(16, 9, 37, 1));
        viewer.overrideComponentsFrameColorById(["ndae382c29-e035-4863-95bc-3be2b7c076f9"], new Glodon.Web.Graphics.Color("#01AAED", 1));
        //轮廓构件
        viewer.overrideComponentsColorById(["nd432ec5b7-c29f-494d-936d-9c7fc674d4af"], new Glodon.Web.Graphics.Color("#FFFFFF", 1));
        //表面构件
        viewer.overrideComponentsColorById(["ndae382c29-e035-4863-95bc-3be2b7c076f9"], new Glodon.Web.Graphics.Color(4, 25, 108, 0.97));



        // 灯光

        let dl = light.createDirectilyLight();
        dl.position.set(-6023.838728573304, 7480.745414898384, 26328.285241063819);
        dl.castShadow = true;
        dl.shadowDarkness = 1.0;
        dl.shadow.mapSize.width = 4096;
        dl.shadow.mapSize.height = 4096;
        dl.shadowCameraVisible = true;
        let helper = new THREE.DirectionalLightHelper(dl);

        viewer.addExternalObject("dl", dl);
        viewer.addExternalObject("dlh", helper);
        unreal.initRenderBloom(scene, camera, renderer, null);
        // unreal.composerRenderer();

        scene.traverseVisible(function (child) {
            console.log(child);
            child.visible = false;
            if (child instanceof THREE.Mesh) {
                // if (child.material.length) child.material[0].wireframe = true;
                child.visible = true;
            }
            child.castShadow = true;
            child.receiveShadow = true;
        });
    }
}

export { wd_fbx }