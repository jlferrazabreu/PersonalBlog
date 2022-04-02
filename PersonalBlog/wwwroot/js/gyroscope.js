define(['/lib/three/three.js'], function (three) {

    let camera, scene, renderer;
    let geometry, material, mesh;
    let rotationX = 0.01;
    let rotationY = 0.02;

    function rotationHandler(rotation) {
        let info = '[X, Y]';
        if (rotation.alpha && rotation.beta && rotation.gamma) {
            rotationX = rotation.alpha.toFixed(1) * 10;
            rotationY = rotation.beta.toFixed(1) * 10;
        }

        info = info.replace('X', rotationX);
        info = info.replace('Y', rotationY);
        $('#rotation-info').html(info);
    }

    if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
        let gyroscope = new Gyroscope();
        gyroscope.addEventListener('reading', function (e) {
            rotationHandler({
                alpha: gyroscope.x,
                beta: gyroscope.y,
                gamma: gyroscope.z
            });
        });
        gyroscope.start();
    }

    function init() {
        camera = new three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        camera.position.z = 1;

        scene = new three.Scene();
        geometry = new three.BoxGeometry(0.5, 0.5, 0.5);
        material = new three.MeshNormalMaterial();
        mesh = new three.Mesh(geometry, material);
        scene.add(mesh);
        renderer = new three.WebGLRenderer({ antialias: true });
        renderer.setSize(200, 200);

        document.querySelector('#canvas').appendChild(renderer.domElement);
    }

    let elapsed, interval = 500, past = Date.now();

    function animate() {
        let now = Date.now();
        elapsed = now - past;

        requestAnimationFrame(animate);

        if (elapsed > interval) {
            mesh.rotation.x = rotationX * rotationY;
            renderer.render(scene, camera);
            elapsed = 0;
        }
    }

    return {
        init,
        animate
    }
});
