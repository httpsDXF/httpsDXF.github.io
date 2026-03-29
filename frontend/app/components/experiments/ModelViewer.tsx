"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const DEMO_GLB =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";

export type ViewerFormat = "gltf" | "stl" | "obj" | "unknown";

function extOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function detectFormat(filename: string): ViewerFormat {
  const e = extOf(filename);
  if (e === "stl") return "stl";
  if (e === "obj") return "obj";
  if (e === "glb" || e === "gltf") return "gltf";
  return "unknown";
}

export function isBlockedCad(name: string): boolean {
  const e = extOf(name);
  return (
    e === "sldprt" ||
    e === "sldasm" ||
    e === "blend" ||
    e === "fbx" ||
    e === "step" ||
    e === "stp" ||
    e === "iges" ||
    e === "igs"
  );
}

function StlMesh({ url }: { url: string }) {
  const geom = useLoader(STLLoader, url);
  const g = useMemo(() => {
    geom.computeVertexNormals();
    geom.center();
    return geom;
  }, [geom]);
  return (
    <mesh geometry={g}>
      <meshStandardMaterial color="#c4c4c4" metalness={0.2} roughness={0.45} />
    </mesh>
  );
}

function ObjRoot({ url }: { url: string }) {
  const obj = useLoader(OBJLoader, url);
  const ref = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh && !child.material) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#a1a1aa",
          metalness: 0.15,
          roughness: 0.5,
        });
      }
    });
    const box = new THREE.Box3().setFromObject(obj);
    const c = box.getCenter(new THREE.Vector3());
    obj.position.sub(c);
  }, [obj]);
  return <primitive object={obj} ref={ref} />;
}

function ExplodableGltf({ url, explode }: { url: string; explode: number }) {
  const { scene } = useGLTF(url);
  const root = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    root.position.sub(c);
    root.updateMatrixWorld(true);
    root.children.forEach((child, i) => {
      child.userData._basePos = child.position.clone();
      child.userData._ei = i;
    });
  }, [root]);

  useEffect(() => {
    root.children.forEach((child) => {
      const base = child.userData._basePos as THREE.Vector3 | undefined;
      const i = (child.userData._ei as number) ?? 0;
      if (base) {
        child.position.set(
          base.x,
          base.y + explode * (i + 1) * 0.12,
          base.z,
        );
      }
    });
  }, [explode, root]);

  return <primitive object={root} />;
}

function GltfStatic({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const clone = useMemo(() => scene.clone(true), [scene]);
  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(clone);
    const c = box.getCenter(new THREE.Vector3());
    clone.position.sub(c);
  }, [clone]);
  return <primitive object={clone} />;
}

function SceneContent({
  url,
  format,
  explode,
  explodeEnabled,
}: {
  url: string;
  format: ViewerFormat;
  explode: number;
  explodeEnabled: boolean;
}) {
  if (format === "stl") {
    return (
      <group>
        <StlMesh url={url} />
      </group>
    );
  }
  if (format === "obj") {
    return (
      <group>
        <ObjRoot url={url} />
      </group>
    );
  }
  if (format === "gltf") {
    if (explodeEnabled && explode > 0) {
      return <ExplodableGltf url={url} explode={explode} />;
    }
    return <GltfStatic url={url} />;
  }
  return null;
}

function localFilePreview(file: File | null): {
  url: string | null;
  warn: string | null;
  format: ViewerFormat;
} {
  if (!file) {
    return { url: null, warn: null, format: "gltf" };
  }
  const name = file.name;
  if (isBlockedCad(name)) {
    return {
      url: null,
      warn: "This format cannot be previewed here. Use a glTF/GLB or STL export.",
      format: "gltf",
    };
  }
  const fmt = detectFormat(name);
  if (fmt === "unknown") {
    return {
      url: null,
      warn: "Unsupported extension. Use .glb, .gltf, .stl, or .obj.",
      format: "gltf",
    };
  }
  return { url: URL.createObjectURL(file), warn: null, format: fmt };
}

export function ModelViewer(props: {
  modelUrl: string | null;
  localFile: File | null;
  className?: string;
}) {
  const localPreview = useMemo(
    () => localFilePreview(props.localFile),
    [props.localFile],
  );

  useEffect(() => {
    const u = localPreview.url;
    return () => {
      if (u) URL.revokeObjectURL(u);
    };
  }, [localPreview.url]);

  const url = localPreview.url ?? props.modelUrl ?? DEMO_GLB;
  const warn = localPreview.warn;
  const format: ViewerFormat = props.localFile
    ? localPreview.format
    : props.modelUrl
      ? detectFromUrl(props.modelUrl)
      : "gltf";

  const [explode, setExplode] = useState(0);
  const explodeCapable = format === "gltf";

  return (
    <div className={props.className}>
      {warn ? (
        <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/80">
          {warn}
        </p>
      ) : null}
      <div className="relative mt-4 aspect-16/10 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
        <Canvas camera={{ position: [2.2, 1.6, 2.8], fov: 45 }}>
          <color attach="background" args={["#18181b"]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[6, 8, 4]} intensity={1.1} />
          <Suspense fallback={null}>
            <SceneContent
              url={url}
              format={format === "unknown" ? "gltf" : format}
              explode={explode}
              explodeEnabled={explodeCapable}
            />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
        </Canvas>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          {explodeCapable
            ? "Exploded view works best with multi-part glTF/GLB. Single mesh STL has no separate parts."
            : "STL is a single mesh — explode is disabled."}
        </p>
        <label className="flex min-w-[200px] flex-col gap-1 text-sm text-zinc-300">
          <span className="text-xs text-zinc-500">Explode factor</span>
          <input
            type="range"
            min={0}
            max={100}
            value={explodeCapable ? explode * 50 : 0}
            disabled={!explodeCapable}
            onChange={(e) =>
              setExplode(Number.parseInt(e.target.value, 10) / 50)
            }
            className="w-full accent-white disabled:opacity-40"
          />
        </label>
      </div>
    </div>
  );
}

function detectFromUrl(u: string): ViewerFormat {
  const q = u.split("?")[0] ?? u;
  const seg = q.split("/").pop() ?? "";
  return detectFormat(seg);
}

useGLTF.preload(DEMO_GLB);
