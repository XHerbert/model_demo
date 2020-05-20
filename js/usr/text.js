/**
 * @author:xuhb
 * @function:绘制文本，先初始化在绘制文本
 */
var textObject = {
	fontPath: "",
	fontColor: null,
	fontSize: 0,
	textArray: [],
	opacity: 0,
	rotate: 0,
	wireframe: false,
	textViewer: null,
	init: function init(viewer, path, color, textArray, fontSize, opacity, rotate, wireframe) {
		this.textViewer = viewer;
		this.fontPath = path || 'fonts/FZDaBiaoSong-B06S_Regular.json';
		this.fontColor = color || 0xff0009;
		this.textArray = textArray;
		this.opacity = opacity || 0.9;
		this.rotate = rotate || 0;
		this.wireframe = wireframe || false;
		this.fontSize = fontSize || 5000;
	},
	drawText: function loadText() {
		if (!this.textArray) {
			console.warn('textArray can not empty!');
			return;
		}
		var loader = new THREE.FontLoader();
		loader.load(this.fontPath, function (font) {

			var xMid = 0;
			let fontMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, wireframe: false, opacity: 0.9, side: THREE.DoubleSide });

			for (let m = 0, len = this.textArray.length; m < len; m++) {

				let item = this.textArray[m];
				if (!item.boundingBox) continue;

				let bounding = JSON.parse(item.boundingBox);
				this.fontSize = ((bounding.max.x - bounding.min.x) * 0.08) > fontSize ? fontSize : ((bounding.max.x - bounding.min.x) * 0.08);

				let shapes = font.generateShapes(item.name, this.fontSize);
				let geometry = new THREE.ShapeGeometry(shapes);
				geometry.computeBoundingBox();

				xMid = - 0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
				geometry.translate(xMid, 0, 0);
				let textShape = new THREE.BufferGeometry();

				textShape.fromGeometry(geometry);
				text = new THREE.Mesh(textShape, fontMaterial);

				let centerX = (bounding.max.x + bounding.min.x) / 2;
				let centerY = (bounding.max.y + bounding.min.y) / 2;

				text.position.x = centerX;
				text.position.y = centerY;
				text.position.z = bounding.max.z + 5;
				this.textViewer.addExternalObject(item.name, text);
			}
			this.textViewer.render();
		});
	}
}

export { textObject }