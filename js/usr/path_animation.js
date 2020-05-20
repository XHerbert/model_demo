

var pathAnimation = {
    viewer: null,
    path: [],
    time: 1200,
    objectNames: [],
    keyPath: null,


    init: function (viewer, curve, time, name) {
        this.viewer = viewer;
        this.keyPath = {
            "One": this.createCurve(this.lineOne()),
            "Two": this.createCurve(this.lineTwo()),
            "Three": this.createCurve(this.lineTree()),
            "Four": this.createCurve(this.lineFour())
        }

        this.path = this.keyPath[curve];
        this.time = time || 1200;

        let names = [];
        names.push(name);
        this.objectNames = names;

    },

    startPathAnimation: function () {
        let pathAnimationConfig = new Glodon.Bimface.Plugins.Animation.PathAnimationConfig();
        pathAnimationConfig.viewer = this.viewer;
        pathAnimationConfig.path = this.path;
        pathAnimationConfig.time = this.time;
        pathAnimationConfig.loop = true;
        pathAnimationConfig.objectNames = this.objectNames;
        pathAnimationConfig.isPitchEnabled = true;
        pathAnimationConfig.isYawEnabled = true;
        pathAnimationConfig.originYaw = 0.5 * Math.PI;
        let pathAnimation = new Glodon.Bimface.Plugins.Animation.PathAnimation(pathAnimationConfig);
        pathAnimation.play();
    },

    createCurve: function (points) {
        this.path = new THREE.CatmullRomCurve3(points, true, "catmullrom", 5);
        var divPts = this.path.getPoints(1000);
        var geometry = new THREE.Geometry();
        geometry.vertices = divPts;
        var material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        var lineMesh = new THREE.Line(geometry, material);
        //this.viewer.addExternalObject("pathCurve" + Math.random(), lineMesh);
        return this.path;
    },

    lineOne: function () {
        let lineOneList = [];
        lineOneList.push(new THREE.Vector3(49808.86323175468, -60209.2197005452, 1.5784847220133487));
        lineOneList.push(new THREE.Vector3(24906.55507202692, -60201.03686584278, 1.5784847220134188));
        lineOneList.push(new THREE.Vector3(-25412.621108574203, -60099.826635326805, 1.5784847220142866));
        lineOneList.push(new THREE.Vector3(-75814.98109140337, -60163.16476593739, 1.5686516248597615));
        lineOneList.push(new THREE.Vector3(-86966.52881014293, -59066.54871003681, -271.0952060645343));
        lineOneList.push(new THREE.Vector3(-90254.7569909109, -50792.66620973864, -271.09520606444886));
        lineOneList.push(new THREE.Vector3(-91021.29323294817, -46801.781063368806, -271.09520606442914));
        lineOneList.push(new THREE.Vector3(-92434.88400546901, -3183.007416726841, -271.0952060640407));
        lineOneList.push(new THREE.Vector3(-94687.60195365995, 48941.748410405395, -271.09520606360854));
        lineOneList.push(new THREE.Vector3(-93841.28661797308, 53256.74021376847, -271.0952060635715));
        lineOneList.push(new THREE.Vector3(-91953.11409520975, 55335.618528469306, -271.0952060635464));
        lineOneList.push(new THREE.Vector3(-90059.92661910865, 56871.33948658618, -271.0952060635405));
        lineOneList.push(new THREE.Vector3(-86050.00337222517, 57806.84231691128, 19.970166513766163));
        lineOneList.push(new THREE.Vector3(-83369.48470170106, 58085.86671682917, -271.0952060635229));
        lineOneList.push(new THREE.Vector3(-14463.498310135516, 57874.39355633329, -271.0952060635247));
        lineOneList.push(new THREE.Vector3(56097.10865268568, 58277.12734121342, 19.976544687399034));
        lineOneList.push(new THREE.Vector3(66929.21750811866, 58682.94766170612, -271.09520606351776));
        lineOneList.push(new THREE.Vector3(69367.75910915586, 56850.92896873867, -271.09520606354795));
        lineOneList.push(new THREE.Vector3(69614.83130657609, 53564.964297623046, -271.09520606356887));
        lineOneList.push(new THREE.Vector3(69782.61467779342, 46232.61516057252, -271.09520606363174));
        lineOneList.push(new THREE.Vector3(69188.66602409458, -44199.21569156643, -271.0952060644068));
        lineOneList.push(new THREE.Vector3(68929.37529640415, -51784.98598275098, -271.0952060644719));
        lineOneList.push(new THREE.Vector3(67259.44321195525, -55954.12162042135, -271.09520606450764));
        lineOneList.push(new THREE.Vector3(61679.11751470182, -58693.9847835294, -271.09520606453106));
        lineOneList.push(new THREE.Vector3(56265.30098991856, -59721.30409129166, -271.0952060645471));
        lineOneList.push(new THREE.Vector3(49808.86323175468, -60209.2197005452, 1.5784847220133487));
        return lineOneList;
    }, lineTwo: function () {
        let lineTwoList = [];
        lineTwoList.push(new THREE.Vector3(-92487.51714651776, -159113.86169851627, -271.0952060653918));
        lineTwoList.push(new THREE.Vector3(-99709.14955666535, 44831.919454736875, -271.09520606364373));
        lineTwoList.push(new THREE.Vector3(-100753.18739457274, 78947.2297341804, -271.09520606335127));
        lineTwoList.push(new THREE.Vector3(-104998.4322519375, 208455.90973564214, -271.0952060622413));
        lineTwoList.push(new THREE.Vector3(-103988.05895605758, 226765.71765993253, -271.09520606208434));
        lineTwoList.push(new THREE.Vector3(-114322.17895816082, 367947.9252169274, -271.0952060608814));
        return lineTwoList;

    }, lineTree: function () {
        let lineThreeList = [];
        lineThreeList.push(new THREE.Vector3(-128833.19013152213, 367312.0393498104, -271.09520606087966));
        lineThreeList.push(new THREE.Vector3(-119760.02842483853, 234340.77083588333, -271.09520606202665));
        lineThreeList.push(new THREE.Vector3(-119240.80634079016, 201936.74531571622, -271.0952060622971));
        lineThreeList.push(new THREE.Vector3(-117739.82174239264, 167091.58098440728, -271.0952060625958));
        lineThreeList.push(new THREE.Vector3(-115282.21835493711, 77526.19027515373, -271.0952060633635));
        lineThreeList.push(new THREE.Vector3(-114929.02276447894, 48665.61353790211, -271.0952060635963));
        lineThreeList.push(new THREE.Vector3(-106521.07995774568, -159760.31288225943, -271.09520606539735));
        return lineThreeList;
    }, lineFour: function () {
        let lineFourList = [];
        lineFourList.push(new THREE.Vector3(49057.7568729118, 63198.15555752455, -271.0952060634827));
        lineFourList.push(new THREE.Vector3(18779.277115910085, 63016.207145, 1.5784847230549983));
        lineFourList.push(new THREE.Vector3(-80783.57327116626, 62514.13616380488, -271.0952060634922));
        lineFourList.push(new THREE.Vector3(-92380.15336220303, 62643.465980981986, -271.09520606349105));
        lineFourList.push(new THREE.Vector3(-93903.37885389804, 64170.71200331778, -271.095206063478));
        lineFourList.push(new THREE.Vector3(-95036.07094650665, 74871.51396632881, 20.155640903664864));
        lineFourList.push(new THREE.Vector3(-95670.86618768972, 95597.4878794421, -271.0952060632014));
        lineFourList.push(new THREE.Vector3(-97672.3879908624, 168963.88366244218, -271.09520606257973));
        lineFourList.push(new THREE.Vector3(-97602.64126110256, 175919.1692405453, -271.0952060625238));
        lineFourList.push(new THREE.Vector3(-94605.58645994155, 180500.64754718627, -271.09520606247725));
        lineFourList.push(new THREE.Vector3(-81259.32198686442, 180943.57910806054, 1.5784847240621511));
        lineFourList.push(new THREE.Vector3(44907.589395451534, 181167.81106834122, -271.0952060624788));
        lineFourList.push(new THREE.Vector3(51436.91747022229, 181194.35305082134, -271.0952060624713));
        lineFourList.push(new THREE.Vector3(57143.436077456834, 177850.06460155905, -271.09520606250356));
        lineFourList.push(new THREE.Vector3(57099.488898853524, 172923.1191744995, -271.0952060625458));
        lineFourList.push(new THREE.Vector3(60402.66611995038, 75785.78202314784, -271.0952060633784));
        lineFourList.push(new THREE.Vector3(60452.36668561683, 67400.95785208797, -271.0952060634503));
        lineFourList.push(new THREE.Vector3(59477.490656005946, 65451.205367887094, -271.09520606346695));
        lineFourList.push(new THREE.Vector3(56211.65385937785, 63842.65994574113, -271.0952060634735));
        lineFourList.push(new THREE.Vector3(49053.584101468354, 63199.69586542734, -271.0952060634863));
        return lineFourList;
    },

    copy: function () {
        let copy = Object.assign({}, this);
        return copy;
    }
}

export { pathAnimation }