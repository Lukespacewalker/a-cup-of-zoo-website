import { expect, test } from "bun:test";
import { portraitGeometry } from "../../src/lib/content/animal-portrait";

test("portrait focus centers the face without stretching a tall source", () => {
  expect(portraitGeometry(640, 800, { x: 50, y: 40, zoom: 2 })).toEqual({
    width: 200,
    height: 250,
    left: -50,
    top: -50,
  });
});

test("focus at image edges never exposes an empty strip", () => {
  expect(portraitGeometry(800, 400, { x: 0, y: 100, zoom: 2 })).toEqual({
    width: 400,
    height: 200,
    left: 0,
    top: -100,
  });
  expect(portraitGeometry(400, 800, { x: 100, y: 0, zoom: 1 })).toEqual({
    width: 100,
    height: 200,
    left: 0,
    top: 0,
  });
});

test("legacy animals without focus keep a centered undistorted cover crop", () => {
  expect(portraitGeometry(640, 800, null)).toEqual({
    width: 100,
    height: 125,
    left: 0,
    top: -12.5,
  });
  expect(portraitGeometry(null, null)).toEqual({
    width: 100,
    height: 100,
    left: 0,
    top: 0,
  });
});
