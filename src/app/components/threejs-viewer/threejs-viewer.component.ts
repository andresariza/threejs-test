import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


@Component({
  selector: 'app-threejs-viewer',
  templateUrl: './threejs-viewer.component.html',
  styleUrls: ['./threejs-viewer.component.scss']
})
export class ThreejsViewerComponent implements OnInit {
  @ViewChild('threeContainer', {static: true}) threeContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private loader!: GLTFLoader;
  private controls!: OrbitControls;

  private SPEED = 0.8;
  private defaultValue = 'defaultValue';

  private KEY_MOVEMENTS: { [key: string]: any } = {
    ArrowUp: 'moveForward',
    ArrowDown: 'moveBackward',
    ArrowLeft: 'moveLeft',
    ArrowRight: 'moveRight',
    defaultValue: 'defaultValue'
  };

  private CONTROL_MOVE_CAMERA: { [key: string]: any } = {
    moveForward: (speed: any) => {
      // Obtiene la dirección hacia adelante de la cámara
      console.log('F actual z:', this.camera.position.z);
      console.log('speed:', speed);
      /*const forward = new THREE.Vector3(0, 0, this.camera.position.z);
      forward.applyQuaternion(this.camera.quaternion).normalize(); // Normaliza el vector

      // Ajusta la posición de la cámara en la dirección hacia adelante
      this.camera.position.add(forward.multiplyScalar(speed));/**/
      const nuevoZ = this.camera.position.z - speed;
      console.log('F nuevo z:', nuevoZ);
      this.camera.position.set(this.camera.position.x, this.camera.position.y, nuevoZ);
      //this.camera.position.y = 2;
    },
    moveBackward: (speed: any) => {
      // Obtiene la dirección hacia adelante de la cámara
      console.log('B actual z:', this.camera.position.z);
      console.log('speed:', speed);
      /*const backward = new THREE.Vector3(0, 0, this.camera.position.z);
      backward.applyQuaternion(this.camera.quaternion).normalize(); // Normaliza el vector

      // Ajusta la posición de la cámara en la dirección hacia adelante
      this.camera.position.add(backward.multiplyScalar(speed));/**/
      const nuevoZ = this.camera.position.z + speed;
      console.log('B nuevo z:', nuevoZ);
      this.camera.position.set(this.camera.position.x, this.camera.position.y, nuevoZ);
      //this.camera.position.y = 2;
    },
    moveLeft: (speed: any) => {
      // Obtiene la dirección hacia adelante de la cámara
      console.log('L actual x:', this.camera.position.x);
      console.log('speed:', speed);
      /*const left = new THREE.Vector3(this.camera.position.x, 0, 0);
      left.applyQuaternion(this.camera.quaternion).normalize(); // Normaliza el vector

      // Ajusta la posición de la cámara en la dirección hacia adelante
      this.camera.position.add(left.multiplyScalar(speed));/**/
      this.camera.position.x = this.camera.position.x - speed;
      console.log('L nuevo x:', this.camera.position.x);
      //this.camera.position.y = 2;
    },
    moveRight: (speed: any) => {
      // Obtiene la dirección hacia adelante de la cámara
      console.log('R actual x:', this.camera.position.x);
      console.log('speed:', speed);
      /* const right = new THREE.Vector3(this.camera.position.x, 0, 0);
       right.applyQuaternion(this.camera.quaternion).normalize(); // Normaliza el vector

       // Ajusta la posición de la cámara en la dirección hacia adelante
       this.camera.position.add(right.multiplyScalar(speed));/**/
      this.camera.position.x = this.camera.position.x + speed;
      console.log('R nuevo x:', this.camera.position.x);
      //this.camera.position.y = 2;
    },
    defaultValue: () => {
    },
  }

  constructor(private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.initThree();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.loadGLTFModel();
    this.createControls();
    this.addEventListeners();
    this.animate();
  }


  initThree(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff); // Fondo blanco
    this.threeContainer.nativeElement.appendChild(this.renderer.domElement);

    this.renderer.domElement.addEventListener('wheel', (event) => this.onMouseWheel(event), false);
  }

  createScene(): void {
    // Configura tu escena si es necesario

    // Agregar una luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);

    // O agregar una luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 7);
    directionalLight.position.set(1, 1, 12).normalize();
    this.scene.add(directionalLight);
  }

  createCamera(): void {
    this.camera.position.x = 2;
    this.camera.position.y = 1.3;
    this.camera.position.z = 2;
  }

  createRenderer(): void {
    // Configura tu renderizador si es necesario
  }

  loadGLTFModel(): void {
    this.loader = new GLTFLoader();
    this.loader.load('assets/models/demogltf_V2.gltf', (gltf) => {
      this.scene.add(gltf.scene);
    });
  }

  createControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = true; // Evita el desplazamiento lateral por clic y arrastre
    this.controls.maxPolarAngle = Math.PI / 2; // Restringe el movimiento hacia arriba
    this.controls.minPolarAngle = 0; // Restringe el movimiento hacia abajo
    this.controls.target.set(0, 1.3, 0);

    //this.controls.addEventListener('change', () => this.checkCollision());
  }


  onMouseWheel(event: WheelEvent): void {
    // Controlar el movimiento hacia adelante y hacia atrás con el mouse (scroll wheel)
    const delta = event.deltaY;
    console.log('delta=', delta)

    if (delta < 0) {
      this.CONTROL_MOVE_CAMERA['moveForward'](Math.abs(delta / 100));
    } else if (delta > 0) {
      this.CONTROL_MOVE_CAMERA['moveBackward'](Math.abs(delta / 100));
    }
  }

  addEventListeners(): void {
    // Eventos adicionales, por ejemplo, para el movimiento lateral
    document.addEventListener('keydown', (event) => this.onKeyDown(event), false);
    //document.addEventListener('keyup', (event) => this.onKeyUp(event), false);
  }

  onKeyDown(event: KeyboardEvent): void {
    // Controlar movimientos laterales
    console.log('key', typeof event.key);
    this.CONTROL_MOVE_CAMERA[this.KEY_MOVEMENTS[event.key] || 'defaultValue'](this.SPEED);
    //this.checkCollision(); // Asegúrate de verificar la colisión después de cada movimiento
  }

  checkCollision(): void {
    // Aquí puedes implementar lógica para prevenir traspasar obstáculos (paredes y techos)
    // Puedes utilizar las posiciones de la cámara y otros métodos de Three.js para realizar estas comprobaciones.

    // Obtener la posición y dirección de la cámara
    const cameraPosition = this.camera.position.clone();
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyQuaternion(this.camera.quaternion);

    // Definir un rayo que representa la dirección hacia donde mira la cámara
    const raycaster = new THREE.Raycaster(cameraPosition, cameraDirection);

    // Realizar la intersección con los objetos que podrían ser obstáculos
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      // Existe una intersección, ajustar la posición de la cámara para evitar colisiones
      const distanceToObstacle = cameraPosition.distanceTo(intersects[0].point);
      const safeDistance = 1; // Puedes ajustar esto según tus necesidades

      if (distanceToObstacle < safeDistance) {
        // Mover la cámara hacia atrás o realizar otra acción para evitar la colisión
        this.camera.position.add(cameraDirection.multiplyScalar(safeDistance - distanceToObstacle));
      }
    }
  }

  animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        requestAnimationFrame(animate);
        this.controls.update();
        this.render();
      };
      animate();
    });
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }


}
