import * as THREE from './assets/three.module.js';

// Everything belongs to the architectural model, including workers attached to
// individual floor plates, so orbit and exploded view remain coherent.
export function createConstruction({model,floors,roof,mats,box,cylinder}) {
  const material=(color,roughness=.65)=>new THREE.MeshStandardMaterial({color,roughness});
  const yellow=material(0xe5b83e),orange=material(0xe97938),vest=material(0xe8a441);
  const steel=material(0x87958f,.35),concrete=material(0xc2c4b8),boots=material(0x36453d);
  const skin=material(0xbd8c6c),navy=material(0x38515a),stripe=material(0xf3edbf);
  const soil=material(0xb29b76),white=material(0xf5efde),red=material(0x9f4b37);
  const animations=[];
  function group(parent,x=0,y=0,z=0){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
  function sphere(parent,x,y,z,r,mat,sx=1,sy=1,sz=1){const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,10,8),mat);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;parent.add(mesh);return mesh;}
  function beam(parent,a,b,r,mat){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start);const mesh=cylinder(parent,0,0,0,r,r,delta.length(),mat,6);mesh.position.copy(start.add(end).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return mesh;}
  function rail(parent,x,z,w){for(const side of [-1,1]){const px=x+side*w/2;box(parent,px,.36,z,.035,.56,.035,yellow);}box(parent,x,.61,z,w,.035,.035,yellow);box(parent,x,.35,z,w,.025,.025,yellow);box(parent,x,.12,z,w,.14,.035,orange);}
  // Yellow temporary edge protection clearly separates the unfinished floors.
  for(let i=3;i<floors.length;i++){const floor=floors[i],w=i>4?4.9:6.2,cx=i>4?.55:0,d=i>4?3.9:4.3;rail(floor,cx,d/2,w);rail(floor,cx,-d/2,w);for(const x of [cx-w/2,cx+w/2]){const edge=group(floor,x,0,0);edge.rotation.y=Math.PI/2;rail(edge,0,0,d);}}
  // Reinforcing bars project above the roof slab.
  for(const x of [-1.6,2.5])for(const z of [-1.5,1.4])for(const dx of [-.06,.06])for(const dz of [-.06,.06])cylinder(roof,x+dx,.34,z+dz,.009,.009,.55,steel,5);
  // Scaffold frames along the left elevation, with decks and diagonal braces.
  for(let level=0;level<6;level++){const y=0,scaffold=floors[level];box(scaffold,-3.55,y,0,.6,.045,4.65,mats.wood);for(const z of [-2.25,0,2.25]){for(const x of [-3.82,-3.26])cylinder(scaffold,x,y+.43,z,.022,.022,.87,steel,6);}for(const z of [-2.25,0]){beam(scaffold,[-3.82,y,z],[-3.82,y+.83,z+2.25],.014,steel);beam(scaffold,[-3.82,y+.83,z],[-3.82,y,z+2.25],.014,steel);}box(scaffold,-3.82,y+.65,0,.025,.025,4.5,yellow);}
  // Articulated, hard-hatted crew. Limbs pivot at the shoulders and hips.
  function worker(parent,x,z,{task='hammer',rotation=0,phase=0,scale=1}={}){
    const root=group(parent,x,.09,z);root.rotation.y=rotation;root.scale.setScalar(scale);
    const body=group(root,0,.25,0);box(body,0,.095,0,.16,.23,.105,vest);box(body,0,.06,.057,.164,.028,.012,stripe);for(const side of [-1,1])box(body,side*.047,.13,.059,.018,.14,.01,stripe);
    cylinder(body,0,.245,0,.055,.05,.09,skin,10);sphere(body,0,.31,0,.07,yellow,1,.65,1);cylinder(body,0,.29,.015,.087,.087,.014,yellow,12);
    const arms=[];for(const side of [-1,1]){const arm=group(body,side*.105,.18,0);cylinder(arm,0,-.073,0,.03,.025,.16,navy,6);sphere(arm,0,-.17,0,.029,skin);arms.push(arm);}
    const legs=[];for(const side of [-1,1]){const leg=group(root,side*.047,.27,0);box(leg,0,-.1,0,.062,.2,.065,navy);box(leg,0,-.2,.022,.074,.06,.12,boots);legs.push(leg);}
    if(task==='hammer'){box(arms[1],0,-.19,.035,.025,.22,.025,mats.wood);box(arms[1],0,-.28,.035,.15,.055,.055,steel);}
    if(task==='drill'){box(arms[1],0,-.15,.06,.09,.09,.11,orange);cylinder(arms[1],0,-.25,.06,.012,.012,.18,steel);}
    if(task==='carry'){box(body,0,-.01,.2,.7,.055,.15,mats.wood);}
    if(task==='plan'){box(body,0,.03,.19,.26,.016,.19,white);}
    animations.push(t=>{const cycle=t*3+phase;if(task==='walk'||task==='carry'){legs.forEach((leg,i)=>leg.rotation.x=Math.sin(cycle+i*Math.PI)*.43);arms.forEach((arm,i)=>arm.rotation.x=task==='carry'?-1:Math.sin(cycle+i*Math.PI)*-.35);root.position.x=x+Math.sin(t*.45+phase)*.58;root.position.y=.09+Math.abs(Math.sin(cycle))*.016;root.rotation.y=rotation+(Math.cos(t*.45+phase)<0?Math.PI:0);}else if(task==='signal'){arms[1].rotation.z=-1.8+Math.sin(t*2.8+phase)*.3;arms[0].rotation.x=-.35;}else if(task==='plan'){arms.forEach(a=>a.rotation.x=-1.15);body.rotation.x=Math.sin(t*.8+phase)*.04;}else{arms[1].rotation.x=task==='drill'?-1.15+Math.sin(t*22+phase)*.035:-.9+Math.sin(cycle)*.8;arms[0].rotation.x=-.6;body.rotation.x=.08+Math.sin(cycle)*.04;}});
    return root;
  }
  worker(model,-1.3,2.55,{task:'walk',phase:0,rotation:Math.PI/2});worker(model,2.5,2.35,{task:'signal',phase:1,rotation:-.5});worker(model,-4.15,1.35,{task:'plan',rotation:.8});
  worker(floors[3],2.1,1.25,{task:'hammer',rotation:.5});worker(floors[4],-.8,1.2,{task:'carry',phase:1.5,rotation:Math.PI/2});worker(floors[5],1.5,1.1,{task:'drill',phase:2});worker(roof,-.7,.8,{task:'signal',phase:2});worker(roof,1.2,-.5,{task:'hammer',phase:4,rotation:1.1});
  // A construction crane: lattice mast, slewing jib, pulley, cable and moving load.
  const crane=group(model,3.85,.13,-2.4);box(crane,0,.12,0,.9,.24,.9,concrete);
  const mastHeight=7.45;for(const x of [-.2,.2])for(const z of [-.2,.2])box(crane,x,mastHeight/2,z,.06,mastHeight,.06,yellow);
  for(let y=.3;y<mastHeight;y+=.52){for(const z of [-.2,.2]){box(crane,0,y,z,.44,.035,.035,yellow);beam(crane,[-.2,y,z],[.2,y+.5,z],.018,yellow);}for(const x of [-.2,.2]){box(crane,x,y,0,.035,.035,.44,yellow);beam(crane,[x,y,-.2],[x,y+.5,.2],.018,yellow);}}
  const jib=group(crane,0,mastHeight,0);box(jib,-1.25,.04,0,6.4,.12,.34,yellow);box(jib,-1.25,.35,0,6.4,.05,.05,yellow);
  for(let x=-4.4;x<1.9;x+=.4){beam(jib,[x,0,-.14],[x+.4,.35,0],.018,yellow);beam(jib,[x,0,.14],[x+.4,.35,0],.018,yellow);}
  beam(jib,[0,.95,0],[-4.4,.1,0],.012,steel);beam(jib,[0,.95,0],[1.8,.1,0],.012,steel);box(jib,0,.62,0,.08,1.2,.08,yellow);box(jib,1.55,-.15,0,.75,.48,.65,concrete);box(jib,-.45,-.28,.25,.4,.42,.42,yellow);box(jib,-.45,-.25,.47,.28,.23,.015,mats.darkGlass);
  const trolley=group(jib,-3.2,-.08,0);box(trolley,0,0,0,.28,.15,.45,boots);const cable=cylinder(trolley,0,-.7,0,.012,.012,1,steel,6);const load=group(trolley,0,-1.5,0);cylinder(load,0,0,0,.06,.045,.18,boots);for(const x of [-.35,.35])beam(load,[0,-.05,0],[x,-.43,0],.009,steel);box(load,0,-.47,0,.85,.08,.55,mats.wood);for(let i=0;i<5;i++)box(load,0,-.39+i*.055,0,.76,.045,.43,concrete);
  animations.push(t=>{jib.rotation.y=-.35+Math.sin(t*.19)*.24;trolley.position.x=-3.1+Math.sin(t*.25)*.55;const length=1.15+(Math.sin(t*.48)+1)*.72;cable.scale.y=length;cable.position.y=-length/2;load.position.y=-length;load.rotation.z=Math.sin(t*.9)*.025;load.rotation.x=Math.cos(t*.8)*.02;});
  // Road loop and a mixer that actually travels around the site.
  box(model,4.55,.06,-.2,1.2,.035,5.7,mats.asphalt);box(model,0,.06,-3.38,10,.035,1,mats.asphalt);
  function wheels(parent,zPositions){const result=[];for(const x of [-.35,.35])for(const z of zPositions){const wheel=cylinder(parent,x,.13,z,.16,.16,.11,boots,12);wheel.rotation.z=Math.PI/2;const hub=cylinder(parent,x+Math.sign(x)*.063,.13,z,.065,.065,.012,steel,10);hub.rotation.z=Math.PI/2;result.push(wheel);}return result;}
  const mixer=group(model,-1,.12,3.18);box(mixer,0,.27,0,.63,.16,1.65,boots);box(mixer,0,.54,.53,.68,.6,.58,yellow);box(mixer,0,.67,.832,.53,.26,.015,mats.darkGlass);box(mixer,0,.35,.84,.69,.1,.055,white);for(const x of [-.23,.23])box(mixer,x,.43,.84,.1,.08,.02,white);const mixerWheels=wheels(mixer,[-.55,-.17,.54]);
  const drum=group(mixer,0,.63,-.36);drum.rotation.x=Math.PI/2+.16;const drumSpin=group(drum);const drumMesh=cylinder(drumSpin,0,0,0,.28,.19,.8,white,16);for(let i=0;i<4;i++){const band=new THREE.Mesh(new THREE.TorusGeometry(.283,.025,5,18),yellow);band.rotation.x=Math.PI/2;band.position.y=-.2+i*.14;drumSpin.add(band);}const mixerChute=box(mixer,0,.39,-.94,.23,.06,.45,steel);mixerChute.rotation.x=-.4;
  const route=new THREE.CatmullRomCurve3([[-3.8,3.18],[3.8,3.18],[4.5,2.5],[4.5,-2.65],[3.8,-3.35],[-3.8,-3.35],[-4.5,-2.65],[-4.5,2.5]].map(([x,z])=>new THREE.Vector3(x,.12,z)),true,'centripetal');
  const routePosition=new THREE.Vector3(),routeTangent=new THREE.Vector3();
  for(let i=0;i<3;i++){const angle=i*Math.PI*2/3;const marking=box(drumSpin,Math.cos(angle)*.264,0,Math.sin(angle)*.264,.045,.65,.045,yellow);marking.rotation.y=-angle;}
  animations.push(t=>{const progress=(t*.012+.08)%1;route.getPointAt(progress,routePosition);route.getTangentAt(progress,routeTangent);mixer.position.copy(routePosition);mixer.rotation.y=Math.atan2(routeTangent.x,routeTangent.z);drumSpin.rotation.y=t*1.3;mixerWheels.forEach(w=>w.rotation.x=t*2);});
  // Compact excavator with linked boom, stick, and bucket pivots.
  const excavator=group(model,-4.2,.11,-1);excavator.rotation.y=-.4;for(const x of [-.32,.32])box(excavator,x,.14,0,.22,.26,1.12,boots);box(excavator,0,.32,0,.68,.17,.85,steel);const cab=group(excavator,0,.43,0);box(cab,-.2,.25,-.15,.43,.5,.54,yellow);box(cab,-.2,.35,.135,.32,.22,.015,mats.darkGlass);box(cab,.18,.12,-.28,.38,.3,.5,yellow);const boom=group(cab,.22,.3,.18);box(boom,0,.5,0,.13,1,.16,yellow);beam(boom,[.09,.05,.03],[.09,.65,.1],.025,steel);const stick=group(boom,0,.97,0);box(stick,0,-.36,0,.11,.76,.13,yellow);const bucket=group(stick,0,-.75,0);box(bucket,0,-.04,.08,.38,.16,.34,steel);box(bucket,0,.05,.23,.38,.12,.05,steel);for(const x of [-.14,0,.14])box(bucket,x,-.12,.22,.04,.13,.05,steel);
  animations.push(t=>{cab.rotation.y=Math.sin(t*.5)*.28;boom.rotation.x=-.55+Math.sin(t*.9)*.2;stick.rotation.x=-.9+Math.sin(t*.9+.7)*.35;bucket.rotation.x=.5+Math.sin(t*.9+1)*.4;});
  sphere(model,-4.2,.11,-2,.6,soil,1,.27,1.1);
  // Parked tipper, wheelbarrow, tools, pallet stacks and site barriers.
  const tipper=group(model,4.05,.12,.65);tipper.rotation.y=Math.PI;box(tipper,0,.29,0,.65,.13,1.45,boots);box(tipper,0,.5,.46,.65,.45,.5,white);box(tipper,0,.6,.72,.5,.2,.015,mats.darkGlass);wheels(tipper,[-.46,.45]);const bed=group(tipper,0,.37,-.45);box(bed,0,.06,.05,.66,.1,.8,yellow);for(const x of [-.32,.32])box(bed,x,.22,.05,.045,.35,.8,yellow);box(bed,0,.22,-.34,.66,.35,.045,yellow);sphere(bed,0,.2,0,.3,soil,1,.45,1.1);animations.push(t=>bed.rotation.x=-.07-(Math.sin(t*.35)+1)*.1);
  function cone(x,z){box(model,x,.11,z,.22,.025,.22,boots);cylinder(model,x,.25,z,.025,.09,.28,orange,8);cylinder(model,x,.27,z,.045,.06,.06,white,8);}for(const x of [-2.8,-2.2,2.8,3.3])cone(x,2.7);
  for(let i=0;i<4;i++){box(model,2.8,.12+i*.07,-2.75,1.2,.055,.28,mats.wood);box(model,2.8,.12+i*.07,-2.37,1.2,.055,.28,mats.wood);}
  for(let i=0;i<3;i++)for(let j=0;j<2;j++)box(model,-1.1+i*.25,.16+j*.11,-2.85,.23,.1,.4,concrete);
  const barrow=group(model,1.6,.14,2.6);box(barrow,0,.2,0,.34,.18,.45,mats.green);const wheel=cylinder(barrow,0,.04,.29,.11,.11,.08,boots,10);wheel.rotation.z=Math.PI/2;for(const x of [-.2,.2]){beam(barrow,[x,.24,.12],[x,.3,-.49],.018,steel);beam(barrow,[x,.12,-.1],[x,-.02,-.13],.014,steel);}
  const table=group(floors[3],1.3,.1,.5);box(table,0,.26,0,.65,.055,.4,mats.wood);for(const x of [-.27,.27])for(const z of [-.14,.14])box(table,x,.13,z,.035,.26,.035,steel);box(table,0,.33,0,.17,.11,.2,orange);const saw=cylinder(table,0,.37,.03,.1,.1,.02,steel,16);saw.rotation.x=Math.PI/2;animations.push(t=>saw.rotation.z=t*5);
  const toolbox=group(floors[5],1.3,.12,.5);box(toolbox,0,.08,0,.27,.16,.18,red);box(toolbox,0,.18,0,.14,.035,.035,boots);
  // Site fencing at the back, with diagonal amber warning marks.
  for(let x=-2.8;x<2.5;x+=.75){box(model,x,.38,-3.93,.7,.56,.045,mats.green);box(model,x-.34,.42,-3.93,.035,.72,.05,steel);box(model,x,.5,-3.9,.35,.035,.015,stripe);}
  // Keep the animated parts separate; batch static geometry by material within
  // each transform group. The detailed site otherwise creates many draw calls.
  for(const mesh of [cable,saw,...mixerWheels])mesh.userData.animated=true;
  const groups=[];model.traverse(object=>{if(object.isGroup)groups.push(object);});
  for(const parent of groups){
    const batches=new Map();
    for(const mesh of parent.children){
      if(!mesh.isMesh||mesh.userData.animated||Array.isArray(mesh.material))continue;
      if(!batches.has(mesh.material))batches.set(mesh.material,[]);
      batches.get(mesh.material).push(mesh);
    }
    for(const [mat,meshes] of batches){
      if(meshes.length<3)continue;
      const positions=[],normals=[];
      for(const mesh of meshes){
        mesh.updateMatrix();const geometry=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();geometry.applyMatrix4(mesh.matrix);
        const position=geometry.getAttribute('position'),normal=geometry.getAttribute('normal');
        for(let i=0;i<position.count;i++){positions.push(position.getX(i),position.getY(i),position.getZ(i));normals.push(normal.getX(i),normal.getY(i),normal.getZ(i));}
        geometry.dispose();parent.remove(mesh);mesh.geometry.dispose();
      }
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));const mesh=new THREE.Mesh(geometry,mat);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);
    }
  }
  return {update(time){animations.forEach(animation=>animation(time));},count:8};
}
