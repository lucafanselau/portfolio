"use client";

import { useControls } from "@/hooks/use-controls";
import { Sky } from "@react-three/drei";

const shadowSize = 40;

export const Lights = () => {
  const { ambient, intensity, position } = useControls("lights", {
    ambient: 0.2,
    intensity: 0.8,
    position: [0, 40, 20],
  });
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      {/* <ambientLight intensity={ambient} /> */}
      <directionalLight
        castShadow
        position={position}
        intensity={intensity}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-shadowSize, shadowSize, shadowSize, -shadowSize, 0.1, 100]}
        />
      </directionalLight>
    </>
  );
};

export const LightsConfigurable = () => {
  const ambientCtl = useControls("Ambient Light", {
    visible: true,
    intensity: 0.1,
  });

  const directionalCtl = useControls("Directional Light", {
    visible: true,
    position: {
      x: 3.3,
      y: 7.0,
      z: 4.4,
    },
    castShadow: true,
    intensity: 1,
  });

  const pointCtl = useControls("Point Light", {
    visible: false,
    position: {
      x: 2,
      y: 0,
      z: 0,
    },
    castShadow: true,
  });

  const spotCtl = useControls("Spot Light", {
    visible: false,
    position: {
      x: 3,
      y: 2.5,
      z: 1,
    },
    castShadow: true,
  });

  return (
    <>
      <ambientLight
        visible={ambientCtl.visible}
        intensity={ambientCtl.intensity}
      />
      <directionalLight
        visible={directionalCtl.visible}
        position={[
          directionalCtl.position.x,
          directionalCtl.position.y,
          directionalCtl.position.z,
        ]}
        castShadow={directionalCtl.castShadow}
        shadow-bias={-0.00001}
        intensity={directionalCtl.intensity}
      />
      <pointLight
        visible={pointCtl.visible}
        position={[
          pointCtl.position.x,
          pointCtl.position.y,
          pointCtl.position.z,
        ]}
        castShadow={pointCtl.castShadow}
      />
      <spotLight
        visible={spotCtl.visible}
        position={[spotCtl.position.x, spotCtl.position.y, spotCtl.position.z]}
        castShadow={spotCtl.castShadow}
      />
    </>
  );
};
