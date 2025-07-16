import * as THREE from "three";
import "./base.css";
import { useEffect, useRef, useState } from "react";

import gsap from "gsap";

const App = function App() {
  const scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: "red",
  });
  const [mesh, setMesh] = useState(new THREE.Mesh(geometry, material));

  // 水平二维加了一个垂直的z轴 z轴正方形面向自己
  mesh.position.y = 1;
  mesh.position.x = 1;
  mesh.position.z = 2;

  // 重置位置到（1，1，1）
  mesh.position.normalize();
  mesh.position.set(0, 1, 2);

  // 场景中心与物体的距离
  console.log(mesh.position.length());

  scene.add(mesh);

  mesh.scale.x = 2;
  mesh.rotation.z = (1 / 4) * Math.PI;
  mesh.rotation.reorder("XZY");
  // setMesh((pre) => {});
  const size = {
    width: 800,
    height: 600,
  };
  // const camera = new THREE.PerspectiveCamera(
  // 75,
  // size.width / size.height,
  // 2,
  // 1000
  // );
  const camera = new THREE.OrthographicCamera();
  camera.position.z = 6;
  camera.position.x = 2;
  scene.add(camera);

  camera.lookAt(mesh.position);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<THREE.WebGLRenderer>(null);

  const axesHelper = new THREE.AxesHelper(2);

  const group = new THREE.Group();

  scene.add(axesHelper);

  scene.add(group);

  const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "green" })
  );
  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "yellow" })
  );

  cube1.position.x = -3;
  group.add(cube1);
  group.add(cube2);
  group.position.z = 1;

  useEffect(() => {
    if (canvas.current) {
      renderer.current = new THREE.WebGLRenderer({ canvas: canvas.current });
    }
    if (renderer.current) {
      renderer.current.setSize(size.width, size.height);
      renderer.current.render(scene, camera);
    }

    tick();
    console.log("dis", mesh.position.distanceTo(camera.position));
  }, []);

  let time = Date.now();
  const clock = new THREE.Clock();
  const tick = () => {
    mesh.position.x += 0.001;

    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;

    const elapsedTime = clock.getElapsedTime();

    mesh.rotation.z += 0.0001 * deltaTime;

    camera.rotation.z = elapsedTime;
    mesh.position.x = Math.sin(elapsedTime);
    camera.lookAt(mesh.position);

    if (renderer.current) {
      renderer.current.render(scene, camera);
    }

    window.requestAnimationFrame(tick);
  };

  return (
    <>
      <canvas className="webgl" ref={canvas}></canvas>
    </>
  );
};

export default App;
