import {memory} from "wasm-game-of-life/wasm_game_of_life_bg.wasm";
import {Universe, Cell} from "wasm-game-of-life";
import * as THREE from "three";

const CELL_SIZE = 5;
const universe = Universe.new();
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas") as HTMLCanvasElement;
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  width * CELL_SIZE / - 2,
  width * CELL_SIZE / 2,
  height * CELL_SIZE / 2,
  height * CELL_SIZE / - 2,
  -100,
  1000
);

const renderer = new THREE.WebGLRenderer({canvas: canvas});

renderer.setSize(width * CELL_SIZE, height * CELL_SIZE);

const renderLoop = () => {
  universe.tick();

  drawCells();

  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
}

const getIndex = (row: number, column: number) => {
  return row * width + column;
}

const drawCells = () => {
  scene.remove.apply(scene, scene.children);
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
  const material = new THREE.MeshBasicMaterial({color: 0xffffff});
  const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, 0);

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      if (cells[idx] == Cell.Alive) {
        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (width * CELL_SIZE / - 2) + (col * CELL_SIZE);
        cube.position.y = (height * CELL_SIZE / - 2) + (row * CELL_SIZE);
        scene.add(cube);
      }
    }
  }
}

drawCells();
requestAnimationFrame(renderLoop);
