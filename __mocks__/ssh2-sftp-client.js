/**
 * @this {any}
 */
function MockClient() {
  this.connect = () => {}
  this.end = () => {}
  this.put = () => {}
}

module.exports = MockClient
