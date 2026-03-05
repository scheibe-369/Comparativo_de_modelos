import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shader sutil inspirado no background-paper-shaders
const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  
  void main() {
    vec2 uv = vUv;
    // Movimento lento e orgânico
    float noise = sin(uv.x * 2.5 + time * 0.1) * cos(uv.y * 2.0 + time * 0.12);
    noise += sin(uv.x * 4.0 - time * 0.08) * cos(uv.y * 3.5 + time * 0.05) * 0.5;
    
    // Mescla cores do tema (Roxo Gh e Fundo Escuro)
    vec3 color = mix(color1, color2, noise * 0.2 + 0.15);
    
    // Fade suave nas bordas para não obstruir conteúdo
    float edgeFade = 1.0 - length(uv - 0.5) * 1.6;
    edgeFade = clamp(edgeFade, 0.0, 1.0);
    
    gl_FragColor = vec4(color, edgeFade * 0.15); 
  }
`;

const AbstractMesh = () => {
    const meshRef = useRef();
    const uniforms = useMemo(() => ({
        time: { value: 0 },
        color1: { value: new THREE.Color("#7B61FF") }, // Gh Purple
        color2: { value: new THREE.Color("#070708") }  // Background deep black
    }), []);

    useFrame((state) => {
        if (meshRef.current) {
            uniforms.time.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[15, 15]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

export default function ShaderBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-60">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <AbstractMesh />
                </Suspense>
            </Canvas>
        </div>
    );
}
