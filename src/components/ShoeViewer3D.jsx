import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ShoeViewer3D = () => {
    const containerRef = useRef();
    const sceneRef = useRef();
    const rendererRef = useRef();
    const cameraRef = useRef();
    const meshRef = useRef();
    const frameIdRef = useRef();

    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState(null);

    // Three.js Lifecycle
    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        sceneRef.current = new THREE.Scene();
        sceneRef.current.background = new THREE.Color('#0a0a0a');

        // Camera
        const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        cameraRef.current.position.z = 5;

        // Renderer
        rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(rendererRef.current.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        sceneRef.current.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xff003c, 1);
        spotLight.position.set(10, 10, 10);
        sceneRef.current.add(spotLight);

        // Mesh (Cybernetic Chassis)
        const geometry = new THREE.BoxGeometry(2.5, 0.8, 1.2);
        const material = new THREE.MeshPhongMaterial({
            color: 0xff003c,
            transparent: true,
            opacity: 0.8,
            emissive: 0xff003c,
            emissiveIntensity: 0.2
        });
        meshRef.current = new THREE.Mesh(geometry, material);
        sceneRef.current.add(meshRef.current);

        // Wireframe Accent
        const wireframeGeom = new THREE.BoxGeometry(2.6, 0.9, 1.3);
        const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.3 });
        const wireframe = new THREE.Mesh(wireframeGeom, wireframeMat);
        meshRef.current.add(wireframe);

        // Animation Loop
        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);

            if (meshRef.current) {
                // Smooth interpolation
                meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, rotation.x, 0.1);
                meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, rotation.y, 0.1);

                // Subtle float
                meshRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.1;
                meshRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.03;
            }

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        animate();

        // Handle Resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameIdRef.current);
            window.removeEventListener('resize', handleResize);
            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
        };
    }, []);

    // Update rotation effect separately to avoid re-creating the scene
    useEffect(() => {
        // This is handled in the animate loop using the 'rotation' state
    }, [rotation]);

    const requestPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const response = await DeviceOrientationEvent.requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                } else {
                    setError('Permission Denied');
                }
            } catch (err) {
                setError('Permission Request Failed');
            }
        } else {
            setPermissionGranted(true);
        }
    };

    useEffect(() => {
        const handleOrientation = (e) => {
            const beta = e.beta || 0;
            const gamma = e.gamma || 0;
            const targetX = (THREE.MathUtils.clamp(beta, -45, 45) * Math.PI) / 180;
            const targetY = (THREE.MathUtils.clamp(gamma, -45, 45) * Math.PI) / 180;
            setRotation({ x: targetX, y: targetY });
        };

        if (permissionGranted) {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, [permissionGranted]);

    return (
        <div className="relative w-full h-[400px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-dark-700/50 group">
            {/* HUD Overlay */}
            <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-neon-blue uppercase tracking-[0.2em] pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></span>
                    Gyroscopic Link: {permissionGranted ? 'CONNECTED' : 'STANDBY'}
                </div>
                <div className="mt-1 opacity-50">β: {Math.round((rotation.x * 180) / Math.PI)}° | γ: {Math.round((rotation.y * 180) / Math.PI)}°</div>
            </div>

            {!permissionGranted && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-dark-950/90 backdrop-blur-sm p-6 text-center">
                    <h4 className="text-white font-bold mb-2 uppercase text-sm tracking-widest">Neural Link Required</h4>
                    <p className="text-gray-400 text-[10px] mb-6 max-w-[220px] leading-relaxed">Authorize gyroscopic sensor data to enable 3D kinetic interaction with this asset.</p>
                    <button
                        onClick={requestPermission}
                        className="bg-neon-blue text-dark-900 font-bold py-2.5 px-6 rounded-lg text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
                    >
                        Sync Sensors
                    </button>
                    {error && <div className="mt-4 text-neon-pink text-[8px] uppercase tracking-widest">{error}</div>}
                </div>
            )}

            <div ref={containerRef} className="w-full h-full" />

            {/* Hint */}
            <div className="absolute bottom-4 right-4 z-10 text-[8px] text-gray-500 uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Tilt device to rotate chassis
            </div>
        </div>
    );
};

export default ShoeViewer3D;
