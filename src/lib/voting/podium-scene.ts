import { Scene, WebGLRenderer, OrthographicCamera, Group, BoxGeometry, MeshStandardMaterial, Mesh, HemisphereLight, DirectionalLight, PlaneGeometry, ShadowMaterial, Vector3, PCFShadowMap } from "three";

/** One small decorative scene; all photos, names, scores and links stay in HTML. */
export function createPodiumScene(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>("[data-podium-stage]")!;
  const host = root.querySelector<HTMLElement>("[data-podium-scene]")!;
  const places = [...root.querySelectorAll<HTMLElement>("[data-podium-place]")];
  let renderer: WebGLRenderer;
  try { renderer = new WebGLRenderer({ alpha:true, antialias:true, powerPreference:"low-power" }); }
  catch { root.dataset.renderer = "fallback"; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  host.append(renderer.domElement);
  const scene = new Scene();
  const camera = new OrthographicCamera(-4, 4, 3, -.5, .1, 40);
  camera.position.set(0, 4, 10); camera.lookAt(0, 0, 0);
  const group = new Group(); scene.add(group);
  scene.add(new HemisphereLight(0xfff8e6, 0x6b6957, 2.5));
  const light = new DirectionalLight(0xffffff, 2.5);
  light.position.set(-3, 6, 4); light.castShadow = true;
  light.shadow.mapSize.set(512, 512); light.shadow.normalBias = .03;
  scene.add(light);
  const shapes = [ { x:0, height:.9, color:0xd6bc7e }, { x:-2.35, height:.6, color:0xb5be99 }, { x:2.35, height:.42, color:0xcba48b } ].slice(0, places.length);
  const meshes = shapes.map(shape => {
    const mesh = new Mesh(new BoxGeometry(2.05, 1, 1.35), new MeshStandardMaterial({ color:shape.color, roughness:.85 }));
    mesh.position.set(shape.x, shape.height / 2, 0); mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh); return mesh;
  });
  const floor = new Mesh(new PlaneGeometry(10, 5), new ShadowMaterial({ opacity:.13 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.015; floor.receiveShadow = true; scene.add(floor);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0, height = 0, frame = 0, disposed = false;
  let hover = 0;
  const start = performance.now();
  const point = new Vector3();
  const draw = (now: number) => {
    frame = 0;
    if (disposed || document.hidden) return;
    const w = Math.round(stage.clientWidth), h = Math.round(stage.clientHeight);
    if (!w || !h) return;
    if (w !== width || h !== height) {
      width = w; height = h; renderer.setSize(w, h, false);
      const worldHeight = 8 * h / w;
      camera.top = worldHeight * .86; camera.bottom = -worldHeight * .14; camera.updateProjectionMatrix();
    }
    const progress = motion.matches ? 1 : Math.min(1, (now - start) / 450);
    group.scale.y = .8 + .2 * (1 - (1 - progress) ** 3);
    group.rotation.y = motion.matches ? 0 : hover;
    shapes.forEach((shape, i) => {
      const rank = Number(places[i].dataset.rank);
      shape.height = rank === 1 ? .9 : rank === 2 ? .6 : .42;
      meshes[i].scale.y = shape.height;
      meshes[i].position.y = shape.height / 2;
    });
    group.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    shapes.forEach((shape, i) => {
      point.set(shape.x, shape.height + .06, .25).applyMatrix4(group.matrixWorld).project(camera);
      places[i].style.setProperty("--podium-left", `${(point.x + 1) * w / 2}px`);
      places[i].style.setProperty("--podium-top", `${(1 - point.y) * h / 2}px`);
    });
    renderer.render(scene, camera);
    root.dataset.renderer = "three";
    if (progress < 1) requestDraw();
  };
  const requestDraw = () => { if (!frame && !disposed) frame = requestAnimationFrame(draw); };
  const events = new AbortController();
  const resize = new ResizeObserver(requestDraw); resize.observe(stage);
  const cleanup = () => {
    if (disposed) return;
    disposed = true; cancelAnimationFrame(frame); resize.disconnect(); events.abort();
    meshes.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); });
    floor.geometry.dispose(); floor.material.dispose(); renderer.dispose(); renderer.domElement.remove();
    places.forEach(place => { place.style.removeProperty("--podium-left"); place.style.removeProperty("--podium-top"); });
    root.dataset.renderer = "fallback";
  };
  renderer.domElement.addEventListener("webglcontextlost", cleanup, { signal:events.signal });
  stage.addEventListener("pointermove", event => {
    if (motion.matches || event.pointerType !== "mouse") return;
    const bounds = stage.getBoundingClientRect(); hover = ((event.clientX - bounds.left) / bounds.width - .5) * .09; requestDraw();
  }, { signal:events.signal });
  stage.addEventListener("pointerleave", () => { hover = 0; requestDraw(); }, { signal:events.signal });
  motion.addEventListener("change", requestDraw, { signal:events.signal });
  root.addEventListener("podium-updated", requestDraw, { signal:events.signal });
  document.addEventListener("visibilitychange", requestDraw, { signal:events.signal });
  window.addEventListener("pagehide", event => { if (!event.persisted) cleanup(); }, { signal:events.signal });
  requestDraw();
}
