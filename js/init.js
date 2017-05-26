


function init() {

  // initAxFileForm();



  scene = new THREE.Scene();
  var stats = initStats();
  var gui = new dat.GUI();
  buildGUI(gui);


  // Animation parameters..
  var time = 0.0;
  var frameRate = 60.0; // TODO automate this value using stats.js
  let args = EQ.PARAMS.CAM.args;
  var mag = EQ.PARAMS.CUBE.size;


  // Renderer settings..
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xEEEEEE, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;


  // Visual cartesian axes. TODO remove after use!
  var axes = new THREE.AxisHelper(20);
  scene.add(axes);


  // The objects...
  var geometry = new THREE.BoxGeometry(mag,mag,mag);
  var material = new THREE.MeshNormalMaterial();
  var grid = new EQ.OBD.Grid({ 'scene':scene, 'geo':geometry, 'mat':material });
  // grid.toString();


  // Lights...
  var spotlight = new THREE.SpotLight( {color : EQ.PARAMS.LIGHT.color} );
  spotlight.position.set(EQ.PARAMS.LIGHT.pos.x, EQ.PARAMS.LIGHT.pos.y, EQ.PARAMS.LIGHT.pos.z);
  spotlight.castShadow = true;
  scene.add(spotlight);


  // Camera...
  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(
    args.fov,
    (function(){ return window.innerWidth / window.innerHeight; }()),
    args.near,
    args.far
  );
  camera.position.x = EQ.PARAMS.CAM.args.initPos.x;
  camera.position.y = EQ.PARAMS.CAM.args.initPos.y;
  camera.position.z = EQ.PARAMS.CAM.args.initPos.z;
  camera.lookAt(scene.position);


  // Add the scene to the page...
  $("#WebGL-output").append(renderer.domElement);


  // And action!
  step = 0;
  render();

  function render() {

    // console.log('clearColor: ' + renderer.getClearColor().toString());

    updateScene();
    stats.update();

    requestAnimationFrame(render);

    time += ( 1.0 / frameRate );
    renderer.render(scene, camera);
  }

  function updateScene() {
    // Cubes..
    grid.updateCells({
                        rotation : {
                          x : controls.rotationSpeed,
                          y : 0,
                          z : controls.rotationSpeed
                        },
                        geometry : {
                          wd : controls.cubeSize,
                          ht : controls.cubeSize,
                          dp : controls.cubeSize
                        },
                        orbit : { // TODO implement the following..
                          radius : controls.orbitRadius,
                          speed : controls.orbitSpeed
                        }
                      });

    // Camera..
    camera.position.x = controls.camXPos;
    camera.position.y = controls.camYPos;
    camera.position.z = controls.camZPos;
    camera.lookAt(scene.position);

    // Background colour..
    let newColour = EQ.UTILS.CONVERT.colourD2H({
                                          r : controls.bgColRed,
                                          g : controls.bgColGreen,
                                          b : controls.bgColBlue
                                        });
    let newRed = controls.bgColRed,
        newGreen = controls.bgColGreen,
        newBlue = controls.bgColBlue;
    let oldCol = renderer.getClearColor();
    oldCol.r !== controls.bgColRed &&
      oldCol.g !== controls.bgColGreen &&
      oldCol.b !== controls.bgColBlue &&
      renderer.setClearColor(newColour, 1);
  }

  function initStats() {
    var stats = new Stats();
    stats.setMode(0);
    $("#stats-output").append(stats.domElement);
    return stats;
  }
}
