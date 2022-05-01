import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

function WithStyle(WrappedComponent, styles) {
  function Enhance(props) {
    return <WrappedComponent {...props} />;
  }

  hoistNonReactStatic(Enhance, WrappedComponent);

  return Enhance;
}

export default WithStyle;
