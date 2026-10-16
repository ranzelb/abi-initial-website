import * as THREE from './assets/three.module.js';
import { createConstruction } from './construction.js';
const canvas=document.querySelector('#building');
try { init(); } catch(error) { console.warn('Architectural model unavailable:',error);canvas.hidden=true;document.querySelector('.model-fallback').hidden=false;document.querySelector('.model-controls').hidden=true; }
function init(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x000000,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
const scene=new THREE.Scene();const camera=new THREE.OrthographicCamera(-8,8,8,-8,.1,100);camera.position.set(13,11,16);camera.lookAt(0,3.3,0);
scene.add(new THREE.HemisphereLight(0xf8fff4,0x6e8378,3));const sun=new THREE.DirectionalLight(0xfff9e9,4.2);sun.position.set(-5,12,7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-13,right:13,top:15,bottom:-10,near:.1,far:40});sun.shadow.bias=-.001;sun.shadow.normalBias=.03;sun.shadow.radius=4;scene.add(sun);const fill=new THREE.DirectionalLight(0xc3e3d7,1.5);fill.position.set(6,4,-5);scene.add(fill);
const model=new THREE.Group();scene.add(model);model.rotation.y=-.2;
const shadowGround=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));shadowGround.rotation.x=-Math.PI/2;shadowGround.position.y=-.28;shadowGround.receiveShadow=true;scene.add(shadowGround);
const mats={stone:new THREE.MeshStandardMaterial({color:0xe5e8dc,roughness:.72}),edge:new THREE.MeshStandardMaterial({color:0xf4f2e8,roughness:.52}),green:new THREE.MeshStandardMaterial({color:0x577b63,roughness:.56}),glass:new THREE.MeshStandardMaterial({color:0x92b7a3,metalness:.55,roughness:.15}),darkGlass:new THREE.MeshStandardMaterial({color:0x496d61,metalness:.45,roughness:.21}),ground:new THREE.MeshStandardMaterial({color:0xd5dbc9,roughness:1}),asphalt:new THREE.MeshStandardMaterial({color:0xb1b9ab,roughness:1}),grass:new THREE.MeshStandardMaterial({color:0x8f9d70,roughness:1}),leaf:new THREE.MeshStandardMaterial({color:0x6f8a59,roughness:1}),leaf2:new THREE.MeshStandardMaterial({color:0x93a777,roughness:1}),wood:new THREE.MeshStandardMaterial({color:0x8c8061,roughness:1}),car:new THREE.MeshStandardMaterial({color:0xf0eee4,metalness:.3,roughness:.3}),black:new THREE.MeshStandardMaterial({color:0x425047,roughness:.8})};
function box(parent,x,y,z,w,h,d,mat,shadow=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=shadow;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
function cylinder(parent,x,y,z,rt,rb,height,mat,segments=8){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,height,segments),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
box(model,0,-.13,0,10.8,.22,8.3,mats.stone);box(model,0,.015,0,10.4,.08,8,mats.ground);box(model,0,.06,3.1,10.3,.035,1.5,mats.asphalt);box(model,-4.5,.06,-.4,1.4,.035,5.5,mats.asphalt);
for(let i=0;i<8;i++)box(model,-4.5+i*1.25,.085,3.1,.56,.012,.025,mats.edge,false);
// A stack of deliberately offset floor plates gives the model its architectural character.
const floors=[];const total=7;
for(let i=0;i<total;i++){const floor=new THREE.Group();floor.position.y=.22+i*.83;floor.userData.base=floor.position.y;floors.push(floor);model.add(floor);const width=i===0?6.5:i>4?4.9:6.2,depth=i===0?4.2:i>4?3.9:4.3;const cx=i>4?.55:0;
box(floor,cx,0,0,width+.2,.16,depth+.2,mats.edge);
if(i<3){box(floor,cx,.41,0,width-.26,.69,depth-.25,i%2?mats.glass:mats.darkGlass);
// Individual mullions and window transoms remain visible from every angle.
for(let x=-width/2+.2;x<=width/2;x+=.51){box(floor,cx+x,.42,depth/2-.08,.035,.67,.07,mats.green);box(floor,cx+x,.42,-depth/2+.08,.035,.67,.07,mats.green);}
for(let z=-depth/2+.18;z<=depth/2;z+=.52){box(floor,cx+width/2-.08,.42,z,.07,.67,.035,mats.green);box(floor,cx-width/2+.08,.42,z,.07,.67,.035,mats.green);}
box(floor,cx,.45,depth/2-.04,width,.025,.04,mats.green);box(floor,cx-width/2+.02,.45,0,.04,.025,depth,mats.green);
} else {
for(const x of [cx-width/2+.18,cx,cx+width/2-.18])for(const z of [-depth/2+.18,depth/2-.18])box(floor,x,.42,z,.18,.76,.18,mats.stone);
box(floor,cx,.77,0,width,.13,depth,mats.edge);
// Open structural bays reveal the crew and temporary edge protection.
}
if(i===0){for(let x=-2.7;x<=2.7;x+=1.35)box(floor,x,.42,2.32,.12,.75,.12,mats.edge);box(floor,0,.8,2.25,6.7,.13,.9,mats.edge);box(floor,-.6,.4,2.16,.07,.75,.05,mats.edge);box(floor,.6,.4,2.16,.07,.75,.05,mats.edge);}
if(i===2){box(floor,cx,.09,depth/2+.1,width+.15,.12,.6,mats.edge);box(floor,cx,.25,depth/2+.27,width,.2,.25,mats.green);for(let x=-width/2+.2;x<width/2;x+=.2)cylinder(floor,cx+x,.41,depth/2+.27,.09,.12,.25,mats.leaf,6);}
}
const roof=new THREE.Group();roof.position.y=.22+total*.83;roof.userData.base=roof.position.y;floors.push(roof);model.add(roof);box(roof,.55,0,0,5.15,.17,4.15,mats.edge);
// A stepped side volume creates a planted terrace below the upper tower.
for(let i=0;i<3;i++){box(model,-2.6,.25+i*.83,-.4,1.8,.16,3,mats.edge);box(model,-2.6,.65+i*.83,-.4,1.6,.65,2.8,mats.glass);for(let z=-1.7;z<1;z+=.4)box(model,-3.43,.65+i*.83,z,.04,.64,.035,mats.green);}
box(model,-2.6,2.75,-.4,1.95,.16,3.15,mats.edge);box(model,-2.6,2.87,-.4,1.7,.12,2.9,mats.grass);
function tree(x,z,size=1,y=.12,parent=model){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(size);parent.add(g);cylinder(g,0,.5,0,.035,.06,.9,mats.wood);const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.47,2),mats.leaf);leaf.position.set(0,1.15,0);leaf.scale.set(.85,1.2,.85);leaf.castShadow=true;g.add(leaf);const leaf2=new THREE.Mesh(new THREE.IcosahedronGeometry(.33,1),mats.leaf2);leaf2.position.set(.16,1.25,.04);leaf2.castShadow=true;g.add(leaf2);return g;}
for(const [x,z,s] of [[-4.65,3.75,.65],[4.65,3.75,.6]])tree(x,z,s);

function shrub(x,z,w,d){box(model,x,.14,z,w,.13,d,mats.grass);for(let i=0;i<Math.round(w*5);i++)cylinder(model,x-w/2+i/5,.27,z,.12,.15,.25,mats.leaf2,6);}

const construction=createConstruction({model,floors,roof,mats,box,cylinder});
let paused=reduce,simulationTime=0;
const motionButton=document.querySelector('.motion-button');
function updateMotionButton(){motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'Play construction animation':'Pause construction animation');motionButton.innerHTML=paused?'▷ <span>Play motion</span>':'Ⅱ <span>Pause motion</span>';}
updateMotionButton();motionButton.addEventListener('click',()=>{paused=!paused;updateMotionButton();});
construction.update(0);
let targetRotation=-.2,dragging=false,previousX=0,lastMove=0,targetExplode=0,explode=0,visible=true,lastTime=0;let targetColor={green:0x577b63,glass:0x92b7a3,dark:0x496d61};
document.querySelectorAll('[data-color]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-color]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});targetColor=({green:{green:0x577b63,glass:0x92b7a3,dark:0x496d61},sand:{green:0x978163,glass:0xc1b9a0,dark:0x82795f},blue:{green:0x5b718b,glass:0x9aafc1,dark:0x4b647a}})[button.dataset.color];}));
document.querySelector('.explode-button').addEventListener('click',e=>{const b=e.currentTarget;targetExplode=targetExplode?0:1;b.setAttribute('aria-pressed',String(!!targetExplode));lastMove=performance.now();});
canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();targetRotation+=e.key==='ArrowRight'?.2:-.2;lastMove=performance.now();}});
canvas.addEventListener('pointerdown',e=>{dragging=true;previousX=e.clientX;canvas.setPointerCapture(e.pointerId);lastMove=performance.now();});canvas.addEventListener('pointermove',e=>{if(dragging){targetRotation+=(e.clientX-previousX)*.009;previousX=e.clientX;lastMove=performance.now();}});function stop(){dragging=false;lastMove=performance.now();}canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
function resize(){const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);const aspect=r.width/r.height,frustum=window.innerWidth<760?14.5:14.1;camera.left=-frustum*aspect/2;camera.right=frustum*aspect/2;camera.top=frustum/2;camera.bottom=-frustum/2;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(canvas);resize();
new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(canvas);
function theme(){const dark=document.body.classList.contains('dark-theme');mats.stone.color.setHex(dark?0xabb7a4:0xe5e8dc);mats.edge.color.setHex(dark?0xccd4c4:0xf4f2e8);shadowGround.material.opacity=dark?.25:.13;}window.addEventListener('abi-theme',theme);theme();
const tempColor=new THREE.Color();function animate(time){requestAnimationFrame(animate);if(!visible||document.hidden)return;const delta=Math.min((time-lastTime)/1000,.05);lastTime=time;if(!paused){simulationTime+=delta;construction.update(simulationTime);}if(!paused&&!dragging&&time-lastMove>4500)targetRotation+=delta*.035;model.rotation.y=THREE.MathUtils.lerp(model.rotation.y,targetRotation,reduce?1:.07);explode=THREE.MathUtils.lerp(explode,targetExplode,reduce?1:.045);floors.forEach((f,i)=>{f.position.y=f.userData.base+explode*i*.39;});model.position.y=-explode*.55;mats.green.color.lerp(tempColor.setHex(targetColor.green),.06);mats.glass.color.lerp(tempColor.setHex(targetColor.glass),.06);mats.darkGlass.color.lerp(tempColor.setHex(targetColor.dark),.06);renderer.render(scene,camera);}requestAnimationFrame(animate);
}
