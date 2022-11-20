import type P5 from 'p5'

type GeometryBuilderCallback = (builder: GeometryBuilder) => void

declare module 'P5' {
  interface Geometry {
    vertices: P5.Vector[]
    vertexNormals: P5.Vector[]
    faces: [number, number, number][]
    uvs: number[]
    edges: [number, number][]
    vertexColors: number[]
    gid: string
  }

  interface __Graphics__ {
    buildGeometry(id: string, callback: GeometryBuilderCallback): P5.Geometry
    freeGeometry(geometry: P5.Geometry)
  }
}

declare class p5 extends P5 {
  buildGeometry(id: string, callback: GeometryBuilderCallback): P5.Geometry
  freeGeometry(geometry: P5.Geometry)
  static Graphics: new (...args: any[]) => P5.Graphics
}

type GeometryInput = Pick<P5.Geometry, 'vertices' | 'vertexNormals' | 'faces' | 'uvs' | 'edges' | 'vertexColors'>

export class GeometryBuilder {
  private geometry: P5.Geometry
  private stack: DOMMatrix[]
  private readonly p5: P5.p5InstanceExtensions
  private scratch: P5.Graphics

  constructor(p5: P5.p5InstanceExtensions, id: string) {
    this.p5 = p5
    // @ts-ignore
    this.geometry = new p5.constructor.Geometry(1, 1)
    this.geometry.gid = id
    this.stack = [new DOMMatrix()]
    this.scratch = this.p5.createGraphics(1, 1, this.p5.WEBGL)

    // @ts-ignore
    const scratchRenderer = this.scratch._renderer as P5.Renderer

    // @ts-ignore
    scratchRenderer.drawBuffersScaled = (id: string, sX: number, sY: number, sZ: number) => {
      // @ts-ignore
      const geom = scratchRenderer.retainedMode.geometry[id].model as P5.Geometry
      this.push()
      this.scale(sX, sY, sZ)
      this.model(geom)
      this.pop()
    }

    // @ts-ignore
    scratchRenderer.drawBuffers = (id: string) => {
      // @ts-ignore
      const geom = scratchRenderer.retainedMode.geometry[id].model as P5.Geometry
      this.push()
      // @ts-ignore
      this.applyMatrix(...scratchRenderer.uMVMatrix.mat4)
      this.model(geom)
      this.pop()
    }
  }

  /**
   * Finishes building geometry and returns it.
   */
  get() {
    this.scratch.remove()
    return this.geometry
  }

  private addGeometry(input: GeometryInput) {
    const startIdx: number = this.geometry.vertices.length
    this.geometry.vertices.push(...input.vertices.map((v) => {
      const pt = this.transform().transformPoint(new DOMPoint(v.x, v.y, v.z, 1))
      return this.p5.createVector(pt.x, pt.y, pt.z)
    }))

    const normalMatrix = this.normalMatrix()
    this.geometry.vertexNormals.push(...input.vertexNormals.map((v) => {
      const pt = normalMatrix.transformPoint(new DOMPoint(v.x, v.y, v.z, 0))
      return this.p5.createVector(pt.x, pt.y, pt.z)
    }))

    this.geometry.faces.push(...input.faces.map((f) => f.map((idx) => idx + startIdx) as [number, number, number]))
    this.geometry.uvs.push(...input.uvs)
    this.geometry.edges.push(...input.edges.map((edge) => edge.map((idx) => idx + startIdx) as [number, number]))
    this.geometry.vertexColors.push(...input.vertexColors)
  }

  model(geometry: P5.Geometry) {
    this.addGeometry(geometry)
  }

  /**
   * Equivalent to calling `beginShape()` and `endShape()` in P5.
   * @param mode The mode you would normally pass to `beginShape()`
   * @param callback A function that constructs the shape, which normally is
   * placed between `beginShape()` and `endShape()`. A `p5.Graphics` is passed
   * into the callback, and all shape calls must be called on it (e.g. instead
   * of `vertex()`, you would call `graphics.vertex()`.)
   */
  shape(mode: Parameters<P5.Graphics['beginShape']>[0], callback: (graphics: P5.Graphics) => void) {
    this.scratch.beginShape(mode)
    callback(this.scratch)
    this.scratch.endShape()

    // @ts-ignore
    this.addGeometry(this.scratch._renderer.immediateMode.geometry)
  }

  plane(...args: Parameters<P5.Graphics['plane']>) {
    this.scratch.plane(...args)
  }
  box(...args: Parameters<P5.Graphics['box']>) {
    this.scratch.box(...args)
  }
  sphere(...args: Parameters<P5.Graphics['sphere']>) {
    this.scratch.sphere(...args)
  }
  cylinder(...args: Parameters<P5.Graphics['cylinder']>) {
    this.scratch.cylinder(...args)
  }
  cone(...args: Parameters<P5.Graphics['cone']>) {
    this.scratch.cone(...args)
  }
  torus(...args: Parameters<P5.Graphics['torus']>) {
    this.scratch.torus(...args)
  }
  triangle(...args: Parameters<P5.Graphics['triangle']>) {
    this.scratch.triangle(...args)
  }
  ellipse(...args: Parameters<P5.Graphics['ellipse']>) {
    this.scratch.ellipse(...args)
  }
  arc(...args: Parameters<P5.Graphics['arc']>) {
    this.scratch.arc(...args)
  }
  rectMode(mode: P5.RECT_MODE) {
    this.scratch.rectMode(mode)
  }
  rect(...args: Parameters<P5.Graphics['rect']>) {
    this.scratch.rect(...args)
  }
  quad(...args: Parameters<P5.Graphics['quad']>) {
    this.scratch.quad(...args)
  }
  bezier(...args: Parameters<P5.Graphics['bezier']>) {
    this.scratch.bezier(...args)
  }
  curve(...args: Parameters<P5.Graphics['curve']>) {
    this.scratch.curve(...args)
  }
  line(...args: Parameters<P5.Graphics['line']>) {
    this.scratch.line(...args)
  }

  transform() {
    return this.stack[this.stack.length - 1]
  }

  normalMatrix() {
    const orig = this.transform()
    const inverse = new DOMMatrix([
      orig.m11, orig.m12, orig.m13, 0,
      orig.m21, orig.m22, orig.m23, 0,
      orig.m31, orig.m32, orig.m33, 0,
      0,        0,        0,        1,
    ]).inverse()

    // Transpose
    return new DOMMatrix([
      inverse.m11, inverse.m21, inverse.m31, 0,
      inverse.m12, inverse.m22, inverse.m32, 0,
      inverse.m13, inverse.m23, inverse.m33, 0,
      0,           0,           0,           1,
    ])
  }

  push() {
    this.stack.push(DOMMatrix.fromMatrix(this.transform()))
    this.scratch.push()
  }

  pop() {
    if (this.stack.length < 1) {
      throw new Error('You called pop() but nothing was push()ed. Check that your push/pop calls are not mismatched.')
    }
    this.stack.pop()
    this.scratch.pop()
  }
  
  translate(x: number, y: number, z: number = 0) {
    this.transform().translateSelf(x, y, z)
  }

  scale(x: number, y?: number, z?: number) {
    if (y === undefined && z === undefined) {
      y = x
      z = x
    } else if (z === undefined) {
      z = 1
    }
    this.transform().scaleSelf(x, y, z)
  }

  rotate(angle: number) {
    this.rotateZ(angle)
  }

  rotateX(angle: number) {
    this.transform().rotateSelf(angle * (180 / Math.PI), 0, 0)
  }

  rotateY(angle: number) {
    this.transform().rotateSelf(0, angle * (180 / Math.PI), 0)
  }

  rotateZ(angle: number) {
    this.transform().rotateSelf(0, 0, angle * (180 / Math.PI))
  }

  applyMatrix(...args: number[]) {
    this.stack.pop()
    this.stack.push(new DOMMatrix(args))
  }

  resetMatrix() {
    this.stack.pop()
    this.stack.push(new DOMMatrix())
  }
}

export const buildGeometry = (
  target: P5.p5InstanceExtensions,
  id: string,
  callback: GeometryBuilderCallback,
): P5.Geometry => {
  const builder = new GeometryBuilder(target, id)
  callback(builder)
  return builder.get()
}

p5.prototype.buildGeometry = function(id, callback) {
  return buildGeometry(this, id, callback)
}
p5.Graphics.prototype.buildGeometry = function(id, callback) {
  return buildGeometry(this, id, callback)
}

function freeGeometry(shape: P5.Geometry) {
	if (!shape.gid) {
		console.error('The model you passed to freeModel does not have an id!')
		return
	}
	this._renderer._freeBuffers(shape.gid)
}

p5.prototype.freeGeometry = freeGeometry
p5.Graphics.prototype.freeGeometry = freeGeometry
