import * as THREE from "three";
import "./base.css";
import GUI from "lil-gui";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import type { WebGLRenderer } from "three";

const App = function App() {
  const scene = new THREE.Scene();
  const gui = new GUI();
  const canvas = useRef<HTMLCanvasElement>(null);

  // 基本物体
  // const sphere = new THREE.Mesh(
  //   new THREE.SphereGeometry(1, 32, 32),
  //   new THREE.MeshStandardMaterial({ roughness: 0.7 })
  // );
  // sphere.position.y = 1;
  // scene.add(sphere);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: "#a9c388" })
  );

  floor.rotation.x = -Math.PI * 0.5;
  floor.position.y = 0;
  scene.add(floor);

  // 环境光
  const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.5);
  gui.add(ambientLight, "intensity").min(0).max(1).step(0.1);
  scene.add(ambientLight);

  // 直射光
  const moonLight = new THREE.DirectionalLight("#ffffff", 1.5);
  gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
  gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
  gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
  scene.add(moonLight);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // 基础相机
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  // 避免每次刷新 丢失值
  const renderer = useRef<WebGLRenderer>(null);
  const controls = useRef<OrbitControls>(null);

  useEffect(() => {
    // controls
    controls.current = new OrbitControls(camera, canvas.current);
    controls.current.enableDamping = true;

    renderer.current = new THREE.WebGLRenderer({
      canvas: canvas.current as HTMLCanvasElement,
    });
    renderer.current.setSize(sizes.width, sizes.height);
    renderer.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  const clock = new THREE.Clock();

  const tick = () => {
    const elapseTime = clock.getElapsedTime();

    controls.current?.update();

    renderer.current?.render(scene, camera);

    window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    tick();
  }, []);

  const house = new THREE.Group();
  scene.add(house);

  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ color: "#ac8e82" })
  );
  walls.position.y = 2.5 / 2;
  house.add(walls);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: "#b35f45" })
  );
  roof.position.y = 2.5 + 1.0 / 2;
  roof.rotation.y = Math.PI * 0.25;
  house.add(roof);

  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshStandardMaterial({ color: "#aa7b7b" })
  );
  door.position.z = 2 + 0.01;
  door.position.y = 1;
  house.add(door);

  window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.current?.setSize(sizes.width, sizes.height);
    renderer.current?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  return (
    <>
      <canvas className="webgl" ref={canvas}></canvas>
    </>
  );
};

export default App;
