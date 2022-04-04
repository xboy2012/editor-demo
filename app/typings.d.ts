type CSSLocals = Record<string, string>;

declare module '*.css' {
  const content: CSSLocals;
  export = content;
}

declare module '*.sass' {
  const content: CSSLocals;
  export = content;
}

declare module '*.scss' {
  const content: CSSLocals;
  export = content;
}

declare module '*.less' {
  const content: CSSLocals;
  export = content;
}

declare module '*.styl' {
  const content: CSSLocals;
  export = content;
}

declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
