declare module 'react-syntax-highlighter' {
  import * as React from 'react';
  export class Prism extends React.Component<any> {}
  // Add other exports if needed, or keep it simple
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const oneLight: any;
  export const oneDark: any;
  // Add other style exports if needed
}
