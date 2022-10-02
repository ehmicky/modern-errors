export const isErrorInstance = function (value) {
  return Object.prototype.toString.call(value) === '[object Error]'
}
