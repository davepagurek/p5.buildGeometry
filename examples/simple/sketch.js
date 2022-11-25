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

    builder.beginShape(TRIANGLE_STRIP)
    for (let y = 20; y <= 60; y += 10) {
      for (let x of [20, 60]) {
        builder.vertex(x, y)
      }
    }
    builder.endShape()

    builder.beginShape()
    builder.vertex(-100, -120)
    builder.vertex(-120, -110)
    builder.vertex(-105, -100)
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
