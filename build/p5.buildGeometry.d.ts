import type P5 from 'p5';
type GeometryBuilderCallback = (builder: GeometryBuilder) => void;
declare module 'P5' {
    interface Geometry {
        vertices: P5.Vector[];
        vertexNormals: P5.Vector[];
        faces: [number, number, number][];
        uvs: number[];
        edges: [number, number][];
        vertexColors: number[];
        gid: string;
    }
    interface __Graphics__ {
        buildGeometry(id: string, callback: GeometryBuilderCallback): P5.Geometry;
        freeGeometry(geometry: P5.Geometry): any;
        flatModelColors(): any;
        shadedModelColors(): any;
    }
    interface RendererGL {
        _vertexColorShader?: P5.Shader;
        _getVertexColorShader(): P5.Shader;
    }
}
export declare class GeometryBuilder {
    private geometry;
    private stack;
    private readonly p5;
    private scratch;
    constructor(p5: P5.p5InstanceExtensions, id: string);
    get(): P5.Geometry;
    private addGeometry;
    model(geometry: P5.Geometry): void;
    beginShape(...args: Parameters<P5.Graphics['beginShape']>): void;
    endShape(...args: Parameters<P5.Graphics['endShape']>): void;
    vertex(...args: Parameters<P5.Graphics['vertex']>): void;
    bezierVertex(...args: Parameters<P5.Graphics['bezierVertex']>): void;
    quadraticVertex(...args: Parameters<P5.Graphics['quadraticVertex']>): void;
    curveVertex(...args: Parameters<P5.Graphics['curveVertex']>): void;
    curveTightness(...args: Parameters<P5.Graphics['curveTightness']>): void;
    normal(...args: Parameters<P5.Graphics['normal']>): void;
    fill(...args: Parameters<P5.Graphics['fill']>): void;
    plane(...args: Parameters<P5.Graphics['plane']>): void;
    box(...args: Parameters<P5.Graphics['box']>): void;
    sphere(...args: Parameters<P5.Graphics['sphere']>): void;
    cylinder(...args: Parameters<P5.Graphics['cylinder']>): void;
    cone(...args: Parameters<P5.Graphics['cone']>): void;
    torus(...args: Parameters<P5.Graphics['torus']>): void;
    triangle(...args: Parameters<P5.Graphics['triangle']>): void;
    ellipse(...args: Parameters<P5.Graphics['ellipse']>): void;
    arc(...args: Parameters<P5.Graphics['arc']>): void;
    rectMode(mode: P5.RECT_MODE): void;
    rect(...args: Parameters<P5.Graphics['rect']>): void;
    quad(...args: Parameters<P5.Graphics['quad']>): void;
    bezier(...args: Parameters<P5.Graphics['bezier']>): void;
    curve(...args: Parameters<P5.Graphics['curve']>): void;
    line(...args: Parameters<P5.Graphics['line']>): void;
    transform(): DOMMatrix;
    normalMatrix(): DOMMatrix;
    push(): void;
    pop(): void;
    translate(x: number, y: number, z?: number): void;
    scale(x: number, y?: number, z?: number): void;
    rotate(angle: number): void;
    rotateX(angle: number): void;
    rotateY(angle: number): void;
    rotateZ(angle: number): void;
    applyMatrix(...args: number[]): void;
    resetMatrix(): void;
}
export declare const buildGeometry: (target: P5.p5InstanceExtensions, id: string, callback: GeometryBuilderCallback) => P5.Geometry;
export {};
