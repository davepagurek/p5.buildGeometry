let tree

function setup() {
  createCanvas(600, 600, WEBGL)
  tree = buildGeometry('tree', (builder) => {
    builder.push()
    builder.translate(100, -50)
    builder.scale(0.5)
    builder.rotateX(PI/4)
    builder.cone()
    builder.pop()
    builder.cone()
  })
}

function draw() {
  background(255)
  lights()
  ambientMaterial(255)
  orbitControl()
  model(tree)
}
