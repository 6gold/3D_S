'use strict';

var sphere_3D_S; // sphere around the model
var sphere_radius_3D_S;
var sphere_pos_3D_S;
var sphere_wSegs_3D_S;
var sphere_hSegs_3D_S;
var sphere_phiStart_3D_S;
var sphere_phiLen_3D_S;
var sphere_thetaStart_3D_S;
var sphere_thetaLen_3D_S;

// get canvas
var canvas_3D_S = document.getElementById('canvas_3D_S');

// set scene
var scene_3D_S = new THREE.Scene();

// set Axis
var axisHelper_3D_S = new THREE.AxisHelper( 150 );
scene_3D_S.add( axisHelper_3D_S );

// set camera
var camera_3DS = new THREE.PerspectiveCamera(
    45, window.innerWidth/window.innerHeight, 0.1, 10000
);
camera_3DS.position.x = 0;
camera_3DS.position.y = 175;
camera_3DS.position.z = 500;
camera_3DS.lookAt(new THREE.Vector3(0, 0, 0));
scene_3D_S.add(camera_3DS);

// set lights
var ambientLight_3D_S = new THREE.AmbientLight(0x404040);
var directionalLight1_3D_S = new THREE.DirectionalLight(0xc0c090);
var directionalLight2_3D_S = new THREE.DirectionalLight(0xc0c090);
directionalLight1_3D_S.position.set(-100,-50,100);
directionalLight2_3D_S.position.set(100,50,-100);
scene_3D_S.add(ambientLight_3D_S);
scene_3D_S.add(directionalLight1_3D_S);
scene_3D_S.add(directionalLight2_3D_S);

// set renderer
var renderer_3D_S = new THREE.WebGLRenderer({
    canvas:canvas_3D_S,
    antialias:true,
});
renderer_3D_S.setClearColor(0xeeeeee);
renderer_3D_S.setSize( window.innerWidth, window.innerHeight );
renderer_3D_S.setPixelRatio( window.devicePixelRatio );

// set controller
var controller_3D_S = new THREE.TrackballControls(camera_3DS, renderer_3D_S.domElement);
controller_3D_S.rotateSpeed = 2.5;
controller_3D_S.zoomSpeed = 1.0;
controller_3D_S.panSpeed = 0.6;

// -----------------------------call functions---------------------------------------
createSphere();
render_3D_S();

// ---------------------------definition of functions--------------------------------
/* method: render_3D_S
   args: none
   function: render */
function render_3D_S() {
    requestAnimationFrame(render_3D_S);
    if (!renderer_3D_S.autoClear) renderer_3D_S.clear();
    controller_3D_S.update();
    renderer_3D_S.render(scene_3D_S,camera_3DS);
}

/* method: createSphere
   args: none
   function: draw a sphere */
function createSphere() {
    var geometry = new THREE.Geometry(); // define a blank geometry
    var material = new THREE.MeshBasicMaterial(
        {
            transparency: true,
            opacity: 1,
            wireframeLinewidth: 0.5,
            color: 0x444444
        }
    );
    material.wireframe = true;

    sphere_radius_3D_S = 60; // test value
    sphere_wSegs_3D_S = 30; // test value 纬带数(纬线数+1)
    sphere_hSegs_3D_S = 30; // test value 经带数

    // 【生成所有顶点位置】 latNumber:纬线计数器
    for (var latNumber=0; latNumber<=sphere_wSegs_3D_S; latNumber++) {
        var theta = latNumber * Math.PI / sphere_wSegs_3D_S;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber=0; longNumber<=sphere_hSegs_3D_S; longNumber++) {
            var phi = longNumber * 2 * Math.PI / sphere_hSegs_3D_S;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);
            // 球坐标系映射到xyz
            var x = sphere_radius_3D_S * sinTheta * cosPhi;
            var y = sphere_radius_3D_S * sinTheta * sinPhi;
            var z = sphere_radius_3D_S * cosTheta;
            var p = new THREE.Vector3(x, y, z);
            geometry.vertices.push(p);
        }
    }
    // 为了把这些顶点缝合到一起，需要【建立三角面片索引列表】
    var indexData = [];
    for (var latNumber = 0; latNumber < sphere_wSegs_3D_S; latNumber++) {
        for (var longNumber = 0; longNumber < sphere_hSegs_3D_S; longNumber++) {
            var first = (latNumber * (sphere_hSegs_3D_S + 1)) + longNumber;
            var second = first + sphere_hSegs_3D_S + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);
            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }
    // create faces
    for (var vertexCounter = 0; vertexCounter<indexData.length; vertexCounter+=3) {
        var face = new THREE.Face3(
            indexData[vertexCounter],
            indexData[vertexCounter+1],
            indexData[vertexCounter+2]
        );
        geometry.faces.push(face);
    }
    sphere_3D_S = new THREE.Mesh(geometry,material);//网格模型对象
    scene_3D_S.add(sphere_3D_S); //网格模型添加到场景中
}