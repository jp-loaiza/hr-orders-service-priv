/**
 * @this {any}
 */
function MockClient() {
  this.connect = () => Promise.resolve({})
  this.end = () => Promise.resolve({})
  this.put = () => Promise.resolve({})
}

module.exports = MockClient
