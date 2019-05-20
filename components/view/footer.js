var html = require('choo/html')
var Component = require('choo/component')
var {i18n} = require('../base')

var text = i18n()

module.exports = class Footer extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
  }

  update () {
    return false
  }

  createElement () {
    return html`
      <footer class="View-footer View-container" id="${this.id}">

      </footer>
    `
  }
}
