# p5.buildGeometry
Create a reusable `p5.Geometry` using the 3D primitives you're familiar with from p5!

## Why?
P5's WebGL mode uses the GPU, and the GPU is fast! However, sending data back and forth between the CPU and GPU can slow your sketch down a lot. If you have a shape that won't change from frame to frame, you can create a <a href="https://p5js.org/reference/#/p5.Geometry"?>`p5.Geometry`</a>, which you draw with `model(yourGeometry)`, to avoid sending the same model data to the GPU every frame.

Unfortunately, p5 on its own doesn't have any easy way to make a `p5.Geometry` other than manually placing vertices. This library lets you build one out of all the p5 functions you already know: 3D primitives, `rotate()`/`translate()`/`scale()`, `push()`/`pop()`, `beginShape()`/`vertex()`/`endShape()`, etc!

## Get the library

Add the library to your source code, *after* loading p5 but *before* loading your own code.

### Via CDN
```html
<script src="https://cdn.jsdelivr.net/npm/@davepagurek/p5.buildGeometry@0.0.1/build/p5.buildGeometry.js"></script>
```

### Self-hosted
[Download the minified or unminified source code from the releases tab](https://github.com/davepagurek/p5.buildGeometry/releases/), then add it to your HTML:
```html
<script type="text/javascript" src="p5.buildGeometry.js"></script>
```

### Via Typescript
First add the dependency:
```
yarn add @davepagurek/p5.buildGeometry
```

```html
import '@davepagurek/p5.buildGeometry'
```

## Usage

Create geometry in `setup` by calling `buildGeometry`. You need to pass in a **unique id** for your geometry, and a **function that constructs the shape.**

```js
const myGeom = buildGeometry('myGeom', (builder) => {
  builder.push()
  builder.translate(100, -50)
  builder.scale(0.5)
  builder.rotateX(PI/4)
  builder.cone()
  builder.pop()
  builder.cone()
})
```

Inside of your callback, you can use the methods you'd normally use on a `p5.Graphics` to draw shapes.

Then, you can draw your geometry to the screen as if it was an imported model:

```js
model(myGeom)
```

If you want to free your geometry from memory (allowing you to reassign its ID), call `freeGeometry` on it:
```js
// If you were drawing it to the main canvas
freeGeometry(myGeom)

// If you were drawing it to a graphic:
myGraphic.freeGeometry(myGeom)
```

## Examples

<table>
<tr>
<td>

```js
let tree
let button

function setup() {
  createCanvas(600, 600, WEBGL)
  button = createButton('Regenerate')
  button.mousePressed(makeTree)
  makeTree()
}

function makeTree() {
  if (tree) freeGeometry(tree)

  tree = buildGeometry('tree', (builder) => {
    const addBranch = (depth) => {
      builder.push()
      builder.translate(0, -50)
      builder.cylinder(15, 100)
      builder.translate(0, -50)
      if (depth >= 5) {
        builder.sphere(30)
      } else {
        const numChildren = round(random(1, 3))
        for (let i = 0; i < numChildren; i++) {
          builder.push()
          builder.rotateZ(random(-0.3, 0.3) * PI)
          builder.rotateY(random(TWO_PI))
          addBranch(depth + 1)
          builder.pop()
        }
      }
      builder.pop()
    }
    builder.translate(0, 200)
    builder.scale(0.7)
    addBranch(0)
  })
}

function draw() {
  background(255)
  lights()
  noStroke()
  ambientMaterial(255)
  orbitControl()
  model(tree)
}
```

</td>
<td>

<img src="https://user-images.githubusercontent.com/5315059/202913968-24da6b35-84b1-46a5-acce-fb07a32b6e33.png" />

<a href="https://davepagurek.github.io/p5.buildGeometry/examples/tree">View live</a>

</td>
</tr>
</table>


## Supported methods
- Adding geometry
  - `model()`
  - `beginShape()`
  - `endShape()`
  - `vertex()`
  - `bezierVertex()`
  - `quadraticVertex()`
  - `curveVertex()`
  - `curveTightness()`
  - `normal()`
  - `fill()` (to set vertex colors)
  - `plane()`
  - `box()`
  - `sphere()`
  - `cylinder`
  - `cone()`
  - `torus()`
  - `triangle()`
  - `ellipse()`
  - `arc()`
  - `rectMode()`
  - `rect()`
  - `quad()`
  - `bezier()`
  - `curve()`
  - `line()`
- Updating transforms
  - `push()`
  - `pop()`
  - `translate()`
  - `scale()`
  - `rotate()`
  - `rotateX()`
  - `rotateY()`
  - `rotateZ()`
  - `applyMatrix()`
  - `resetMatrix()`
