import { Injectable } from "@angular/core";
import { Scene, PerspectiveCamera, WebGLRenderer, Renderer, ObjectLoader, FontLoader, Geometry, CubeGeometry,
    TextGeometry, MeshBasicMaterial, MeshFaceMaterial, MeshPhongMaterial, MultiMaterial, Mesh, SpotLight, Group,
    Font, ImageUtils, BackSide, FlatShading, SmoothShading, Vector3, Clock } from "three";
import { GameStatusService } from "./game-status.service";
import { CameraService } from "./cameras.service";
import { Arena } from "../models/arena";
import { Rink } from "../models/rink";
import { Stone, StoneColor } from "../models/stone";
import { RinkInfo } from "../models/rinkInfo.interface";
import { StoneHandler } from "../models/stoneHandler";

@Injectable()
export class RenderService {

    private static readonly NUMBER_OF_MODELS_TO_LOAD = 3;

    private _numberOfModelsLoaded: number;
    private _scene: Scene;
    private _currentCamera: PerspectiveCamera;
    private _renderer: Renderer;
    private _geometry: Geometry;
    private _material: MeshFaceMaterial;
    private _mesh: Mesh;

    private _clock: Clock;

    private _font: Font;
    private _text: string;
    private _textMaterial: MultiMaterial;
    private _textGroup: Group;
    private _fontLoader: FontLoader;
    private _textMesh: Mesh;
    private _fontName: string;

    private _rinkInfo: RinkInfo;
    private _stoneHandler: StoneHandler;

    private _objectLoader: ObjectLoader;
    private _animationStarted: boolean;

    constructor(private _gameStatusService: GameStatusService, private _cameraService: CameraService) {
        this._scene = new Scene();
        this._animationStarted = false;
        this._numberOfModelsLoaded = 0;
        this._objectLoader = new ObjectLoader();
    }

    public init(container: HTMLElement) {
        this._clock = new Clock(false);

        this._renderer = new WebGLRenderer({antialias: true, devicePixelRatio: window.devicePixelRatio});
        this._renderer.setSize(window.innerWidth, window.innerHeight, true);

        this._currentCamera = this._cameraService.perspectiveCamera;

        //Part 2: Scenery
        this.setUpLightning(); //Because lighting is everything
        this.generateSkybox();

        //Part 3: Components
        this.loadFont();
        this.loadRink();
        this.loadArena();

        //Part 4: Service
        this.linkRenderServerToCanvas(container);

        //Part 5: Events
        // bind to window resizes
        window.addEventListener('resize', _ => this.onResize());
    }

    public linkRenderServerToCanvas(container: HTMLElement) {
        // Inser the canvas into the DOM
        //var container = document.getElementById("glContainer");
        if (container.getElementsByTagName('canvas').length === 0) {
            container.appendChild(this._renderer.domElement);
        }
    }

    public setUpLightning() {
        let spotlightHouseNear = new SpotLight(0xffffff, 0.5, 0, 0.4);
        spotlightHouseNear.penumbra = 0.34;
        spotlightHouseNear.position.set(9, 10, -17);
        spotlightHouseNear.target.position.set(0, 0, -17);
        this._scene.add(spotlightHouseNear.target);
        this._scene.add(spotlightHouseNear);

        let spotlight1 = new SpotLight(0xffffff, 0.7, 0, 0.4);
        spotlight1.penumbra = 0.39;
        spotlight1.position.set(9, 10, -7);
        spotlight1.target.position.set(0, 0, -10);
        this._scene.add(spotlight1.target);
        this._scene.add(spotlight1);

        let spotlight2 = new SpotLight(0x3333cc, 0.8, 0, 0.2);
        spotlight2.penumbra = 0.7;
        spotlight2.position.set(-19, 10, 4);
        spotlight2.target.position.set(0, 0, 0);
        this._scene.add(spotlight2.target);
        this._scene.add(spotlight2);

        let spotlight3 = new SpotLight(0xff3333, 0.6, 0, 0.2);
        spotlight3.penumbra = 0.45;
        spotlight3.position.set(19, 10, 12);
        spotlight3.target.position.set(0, 0, 8);
        this._scene.add(spotlight3.target);
        this._scene.add(spotlight3);

        let spotlightHouseFar = new SpotLight(0xffffff, 0.8, 0, 0.4);
        spotlightHouseFar.penumbra = 0.34;
        spotlightHouseFar.position.set(-9, 10, 17);
        spotlightHouseFar.target.position.set(0, 0, 17);
        this._scene.add(spotlightHouseFar.target);
        this._scene.add(spotlightHouseFar);

        let spotlight4 = new SpotLight(0xffffff, 0.6, 0, 0.3);
        spotlight4.penumbra = 0.8;
        spotlight4.position.set(9, 10, 12);
        spotlight4.target.position.set(0, 0, 23);
        this._scene.add(spotlight4.target);
        this._scene.add(spotlight4);
    }

     /**
     * See : http://danni-three.blogspot.ca/2013/09/threejs-skybox.html
     */
    public generateSkybox() {
        let imagePrefix = "../../assets/images/frozen_";
        let directions = ["rt", "lf", "up", "dn", "ft", "bk"];
        let imageSuffix = ".jpg";
        let materialArray = [];
        for (let i = 0; i < 6; i++) {
            materialArray.push( new MeshBasicMaterial({
            map: ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
            side: BackSide
            }));
        }
        this._geometry = new CubeGeometry( 200, 200, 200);
        this._material = new MeshFaceMaterial( materialArray );
        this._mesh = new Mesh( this._geometry, this._material );
        this._scene.add( this._mesh );
    }

    // Load the font
    public loadFont() {
        this._fontLoader = new FontLoader();
        this._textMaterial = new MultiMaterial([
            new MeshPhongMaterial({shading: FlatShading}), // front
            new MeshPhongMaterial({shading: SmoothShading})
            ]
        );
        this._textGroup = new Group();
        this._textGroup.position.y = 100;
        this._scene.add(this._textGroup);
        this._fontName = 'helvetiker_regular';
    }

    public loadRink() {
        Rink.createRink(this._objectLoader).then((rink: Rink) => {
            this._rinkInfo = rink;
            this._mesh.add(rink);
            this.onFinishedLoadingModel();
            this.loadStoneHandler();
            this.loadStone();
        });
    }

    public loadArena() {
        Arena.createArena(this._objectLoader).then((arena: Arena) => {
            this._mesh.add(arena);
            this.onFinishedLoadingModel();
        });
    }

    //Must be called after the rinkinfo is initialised.
    public loadStoneHandler() {
        let stoneColor: StoneColor;
        if (this._gameStatusService.randomFirstPlayer() === true) {
            stoneColor = StoneColor.Red;
        }
        else {
           stoneColor = StoneColor.Blue;
        }
        this._stoneHandler = new StoneHandler(this._objectLoader, this._rinkInfo, stoneColor);
    }

    public loadStone() {
        this._stoneHandler.generateNewStone().then((stone: Stone) => {
            this._scene.add(stone);
            this._cameraService.movePerspectiveCameraToFollowObjectOnZ(stone);
            this.onFinishedLoadingModel();
        });
    }

    public switchCamera() {
        this._currentCamera = this._cameraService.nextCamera();
        this.onResize();
    }

    private onFinishedLoadingModel() {
        ++this._numberOfModelsLoaded;
        if (!this._animationStarted && this._numberOfModelsLoaded >= RenderService.NUMBER_OF_MODELS_TO_LOAD) {
            this._animationStarted = true;
            if (document.hasFocus()) {
                this._clock.start();
            }
            this._gameStatusService.gameStatus.usedStone(); // Remove a stone from display
            this._stoneHandler.performShot(2.5, new Vector3(0, 0, 1), () => { console.log("Launch finished"); });
            this.animate();
        }
    }

     private animate() {
        window.requestAnimationFrame(_ => this.animate());
        if (this._clock.running === true) {
            let timePerFrame = this._clock.getDelta();
            this._stoneHandler.update(timePerFrame);
            this._cameraService.update(timePerFrame);
        }
        this._renderer.render(this._scene, this._currentCamera);
    }

    public toogleFocus(toogle: boolean) {
        if (toogle === true) {
            this._clock.start();
        }
        else {
            this._clock.stop();
        }
    }

    onWindowResize() {
        let factor = 0.8;
        let newWidth: number = window.innerWidth * factor;
        let newHeight: number = window.innerHeight * factor;

        this._currentCamera.aspect = newWidth / newHeight;
        this._currentCamera.updateProjectionMatrix();

        this._renderer.setSize(newWidth, newHeight);
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this._currentCamera.aspect = width / height;
        this._currentCamera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    /* This version loads the font each time, not efficient ! */
    slowCreateText() {
        console.log(this);
        this._fontLoader.load('/assets/fonts/helvetiker_regular.typeface.json', r => {
            this._scene.remove(this._textGroup);
            this._textGroup.remove(this._textMesh);
            this._font = new Font(r);
            let f = Object(r);

            let textGeo: TextGeometry = new TextGeometry( this._text, {
                font: f as Font,
                size: 20,
                height: 20,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: false
            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
            this._textMesh = new Mesh( textGeo, this._textMaterial );
            this._textMesh.position.x = centerOffset;
            this._textMesh.position.y = 50;
            this._textMesh.position.z = 0;
            this._textMesh.rotation.x = 0;
            this._textMesh.rotation.y = Math.PI * 2;
            this._textGroup.add( this._textMesh );
            this._scene.add(this._textGroup);
        });
    }

    private refreshText() {
        this.slowCreateText();
    }

    public setText(newText: string) {
        this._text = newText;
        this.refreshText();
    }

    public print() {
        console.log(this);
    }

    public translateMesh(x: number, y: number) {
        print();
        this._mesh.position.x += x;
        this._mesh.position.y += y;
    }
    /*
    public translateCamera(x: number, y: number, z: number): void {
        this._camera.position.x += x === undefined ? 0 : x ;
        this._camera.position.y += y === undefined ? 0 : y ;
        this._camera.position.z += z === undefined ? 0 : z ;
        this._camera.updateProjectionMatrix();
    }
    */
}
