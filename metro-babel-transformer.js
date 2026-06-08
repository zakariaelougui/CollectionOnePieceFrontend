const upstreamTransformer = require('expo/node_modules/@expo/metro-config/build/babel-transformer');

const STUB = `
'use strict';
const React = require('react');
function NativeComponentStub() { return null; }
NativeComponentStub.displayName = 'NativeComponentStub';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = NativeComponentStub;
module.exports = NativeComponentStub;
module.exports.default = NativeComponentStub;
`;

module.exports = {
  ...upstreamTransformer,
  async transform(params) {
    const { filename } = params;
    if (
      (filename.includes('/react-native/src/private/') ||
        filename.includes('/react-native/src/private/specs_DEPRECATED/')) &&
      filename.endsWith('NativeComponent.js')
    ) {
      return upstreamTransformer.transform({ ...params, src: STUB });
    }
    return upstreamTransformer.transform(params);
  },
};
