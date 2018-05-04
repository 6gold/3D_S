'use strict';

//
var object3D_S; // model imported
var center_3D_S;
var boundingBox_3D_S;
var rotation_3D_S;

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

// set loader
var objLoader_3D_S = new THREE.OBJLoader2();
var callbackOnLoad_3D_S = function (event) {
    console.log(event.detail);
    object3D_S = event.detail.loaderRootNode;
    // scale the model
    object3D_S.scale.set(5,5,5);
    // calculate the center point
    center_3D_S = object3D_S.position;
    console.log(center_3D_S);
    // calculate the bounding box
    boundingBox_3D_S = new THREE.Box3().setFromObject(object3D_S);
    console.log(boundingBox_3D_S);
    // calculate the Euler rotation
    rotation_3D_S = object3D_S.rotation;
    console.log(rotation_3D_S);
    // calculate number of vertexes and faces
    // console.log(objLoader_3D_S);
    console.log(controller_3D_S);

    // add model to scene
    scene_3D_S.add(object3D_S);
};
objLoader_3D_S.load('assets/models/obj/Lockheed C130 Hercules.obj', callbackOnLoad_3D_S, null, null, null, false);

// set fs
// var fs = require('fs');
// var data = fs.readFileSync('http://localhost:3000/assets/rcs/model_bi_f02.000ghz_t90_p-180~180_vv.rcs','utf-8');
// console.log(data);




// call functions
render_3D_S();

// definition of functions

/* method: render_3D_S
   args: none
   function: render */
function render_3D_S() {
    requestAnimationFrame(render_3D_S);
    if (!renderer_3D_S.autoClear) renderer_3D_S.clear();
    // update values
    // console.log(camera_3DS.rotation.x);
    controller_3D_S.update();
    renderer_3D_S.render(scene_3D_S,camera_3DS);
}