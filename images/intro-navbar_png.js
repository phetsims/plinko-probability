/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;