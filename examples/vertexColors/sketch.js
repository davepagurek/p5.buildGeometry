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
      builder.fill('#857259')
      builder.cylinder(15, 100)
      builder.translate(0, -50)
      if (depth >= 5) {
        builder.fill('#8ae887')
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
  orbitControl()
  push()
  noStroke()
  if (millis() % 2000 < 1000) {
    lights()
    ambientMaterial(255)
    shadedModelColors()
  } else {
    flatModelColors()
  }
  model(tree)
  pop()
}
