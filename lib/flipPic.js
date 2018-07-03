/**
 * 上传图片，保持原样上传而不翻转图片的方向
 * 用法示例：
 * if (file.type.indexOf('image/') !== -1) {
 *    flipPic(file);
 * }
 * 其中 file是从<input type="file" />元素上读取的file
 */

// 需要使用此库来获取图片方向 https://github.com/exif-js/exif-js/
import EXIF from 'exif-js';

const getImgOrientation = (img) => new Promise((resolve) => {
  EXIF.getData(img, function call() {
    const orientation = EXIF.getTag(this, 'Orientation');
    resolve(orientation);
  });
});
const rotateImg = (orientation, width, height) => {
  let x;
  let y;
  let deg;
  let isRotate;
  switch (orientation) {
    case 8:
      deg = -Math.PI / 2;
      x = -width;
      y = 0;
      isRotate = true;
      break;
    case 6:
      deg = Math.PI / 2;
      x = 0;
      y = -height;
      isRotate = true;
      break;
    case 3:
      deg = Math.PI;
      x = -width;
      y = -height;
      isRotate = false;
      break;
    default:
      deg = 0;
      x = 0;
      y = 0;
      isRotate = false;
  }
  return {
    x, y, deg, isRotate,
  };
};
const isExecutable = () => {
  if (!window.File
  || !window.Blob
  || !window.URL) {
    return false;
  }
  return true;
};
const canvasGetBlob = (canvas, file, q) => new Promise((resolve) => {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value(callback, type, quality) {
        const base64Data = this.toDataURL(type, quality);
        const blob = getBlobFromBase64Data(base64Data, type || 'image/png');
        blob.url = base64Data;
        callback(blob, true);
      },
    });
  }
  canvas.toBlob((blob, flag) => {
    if (!blob.url && !flag) {
      blob = new window.File([blob], file.name, { type: file.type });
    }
    resolve(blob);
  }, file.type || 'image/png', q);
});
export default (file) => new Promise((resolve) => {
  if (!isExecutable()) {
    resolve(file);
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const img = new Image();
  const url = URL.createObjectURL(file);
  img.onload = async () => {
    const orientation = await getImgOrientation(img);
    const originWidth = img.width;
    const originHeight = img.height;
    const { x, y, deg, isRotate } = rotateImg(orientation, originWidth, originHeight);
    if (isRotate) {
      canvas.height = originWidth;
      canvas.width = originHeight;
    } else {
      canvas.height = originHeight;
      canvas.width = originWidth;
    }
    context.rotate(deg);
    context.drawImage(img, 0, 0, originWidth, originHeight, x, y, originWidth, originHeight);
    const blob = await canvasGetBlob(canvas, file, 0.6);
    blob.uid = file.uid;
    URL.revokeObjectURL(url);
    resolve(blob);
  };
  img.src = url;
});
