var html = require('choo/html')
var Component = require('choo/component')
var Takeover = require('../takeover')
var {i18n} = require('../base')

var text = i18n(require('./lang.json'))

module.exports = class Header extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.state = state
    this.emit = emit
  }

  update (route) {
    return route !== this.route
  }

  createElement (route, fixed) {
    this.route = route
    var self = this

    return html`
      <div class="View-header ${fixed ? 'is-fixed' : ''}" id="${this.id}">
        <ul class="View-nav">
          <li><a class="View-link" href="/" onclick=${top}>${text`Zoe Kelly`}</a></li>
          <li><a class="View-link" href="/about">${text`About`}</a></li>
        </ul>
      </div>
    `

    function top () {
      window.scrollTo(0, 0)
    }

    function explode () {
      return function (event) {
        if (self.state.ui.inTransition) return event.preventDefault()
        var href = event.target.pathname
        var next = self.createElement(href, true)
        self.state.cache(Takeover, Takeover.id()).open(href, event.target.getBoundingClientRect(), next)
        window.requestAnimationFrame(function () {
          self.render(href)
        })
        event.preventDefault()
      }
    }
  }
}
