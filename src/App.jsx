import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap'; 
import * as dat from 'lil-gui'; 

const App = () => {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false); 

  useEffect(() => {
   
    const canvas = canvasRef.current;

    
    const scene = new THREE.Scene();

    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFF99 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    
    let sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
    camera.position.z = 3;
    scene.add(camera);

    
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);

    
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
    };
    window.addEventListener('resize', handleResize);

    
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / sizes.width) * 2 - 1;
      mouseY = -(event.clientY / sizes.height) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    
    const gui = new dat.GUI();
    const params = {
      rotationSpeedX: 0.5,
      rotationSpeedY: 0.5,
      color: "#FFFF99", 
      elevation: 0, 
      visible: true, 
      wireframe: false, 
      spin: () => startStopSpin(), 
    };

    
    gui.add(params, 'rotationSpeedX', -2, 2).name('Rotation Speed X');
    gui.add(params, 'rotationSpeedY', -2, 2).name('Rotation Speed Y');
    gui.add(params, 'elevation', -5, 5).name('Elevation').onChange(() => {
      mesh.position.y = params.elevation; 
    });
    gui.add(params, 'visible').name('Visible').onChange(() => {
      mesh.visible = params.visible; 
    });
    gui.add(params, 'wireframe').name('Wireframe').onChange(() => {
      material.wireframe = params.wireframe; 
    });
    gui.addColor(params, 'color').name('Cube Color').onChange(() => {
      material.color.set(params.color); 
    });
    gui.add(params, 'spin').name('Spin');

    
    let spinAnimation = null;
    const startStopSpin = () => {
      if (spinning) {
        
        setSpinning(false);
        if (spinAnimation) {
          gsap.killTweensOf(mesh.rotation); 
        }
      } else {
        
        setSpinning(true);
        gsap.to(mesh.rotation, {
          duration: 5, 
          y: '+=6.28', 
          repeat: -1, 
          ease: 'linear', 
        });
      }
    };

    
    const animateCube = () => {
      
      gsap.to(mesh.rotation, {
        duration: 1,
        x: mouseY * Math.PI * params.rotationSpeedX,
        y: mouseX * Math.PI * params.rotationSpeedY,
        ease: 'power2.out',
      });

      
      window.requestAnimationFrame(animateCube);
    };

    
    animateCube();

    
    const tick = () => {
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };
    tick();

    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      gui.destroy(); 
    };
  }, [spinning]); 

  return <canvas ref={canvasRef} className="webgl" />;
};

export default App;