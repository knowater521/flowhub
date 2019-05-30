/*
 * chain event
 * @param {String} name
 * @return {object} chainer
 */
module.exports = function (name) {
  const { chainer } = this

  const _chainer = { }

  _chainer.pipe = (...args) => {
    if (chainer[ name ]) {
      chainer[ name ] = chainer[ name ].concat(args)
    } else {
      chainer[ name ] = args
    }

    return _chainer
  }

  return _chainer
}
