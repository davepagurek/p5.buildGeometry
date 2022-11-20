let shapes

function setup() {
  createCanvas(600, 600, WEBGL)
  shapes = buildGeometry('shapes', (builder) => {
    builder.push()
    builder.translate(100, -50)
    builder.scale(0.5)
    builder.rotateX(PI/4)
    builder.cone()
    builder.pop()
    builder.cone()

    builder.beginShape()
    builder.vertex(-20, -50)
    builder.quadraticVertex(
      -40, -70,
      0, -60
    )
    builder.endShape()
  })
}

function draw() {
  background(255)
  lights()
  ambientMaterial(255)
  orbitControl()
  model(shapes)
}
