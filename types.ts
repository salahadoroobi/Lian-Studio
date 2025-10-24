
export interface ReferenceImage {
  id: string;
  file: File;
  dataUrl: string;
}

export type EditorTool = 'brush' | 'eraser' | 'pan';

export interface Point {
  x: number;
  y: number;
}

export interface Path {
  points: Point[];
  color: string;
  size: number;
  tool: EditorTool;
}
