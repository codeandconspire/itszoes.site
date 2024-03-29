var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Takeover extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.state = state
    this.emit = emit
  }

  static id () {
    return 'takeover'
  }

  update () {
    return false
  }

  open (href, coordinates, header) {
    var self = this
    var el = this.element

    self.emit('ui:transition')
    this.emit('ui:partial', href, function (view) {
      var { innerHeight, innerWidth } = window
      var { left, top } = coordinates
      var style = `left: ${left}px; top: ${top}px;`
      var isSlow = (
        (left > innerWidth / 4 && left < innerWidth * 0.8) &&
        (top > innerHeight / 4 && top < innerHeight * 0.8)
      )
      var className = 'Takeover-circle'
      if (innerHeight > innerWidth) className += ' Takeover-circle--portrait'
      if (isSlow) className += ' Takeover-circle--slow'
      var circle = html`<div>${header}<div class="${className}" style="${style}"></div></div>`

      circle.addEventListener('animationend', function onanimationend () {
        circle.removeEventListener('animationend', onanimationend)
        self.emit('pushState', href)
        window.requestAnimationFrame(function () {
          self.rerender()
          window.removeEventListener('wheel', onscroll)
          window.removeEventListener('touchmove', onscroll)
        })
      })

      window.requestAnimationFrame(function () {
        el.classList.add('is-active')
        el.appendChild(circle)
        el.appendChild(html`<div class="u-relative u-sizeFull">${view()}</div>`)
      })

      window.addEventListener('wheel', onscroll)
      window.addEventListener('touchmove', onscroll)

      function onscroll (event) {
        event.preventDefault()
      }
    })
  }

  createElement () {
    return html`<div class="Takeover" id="${this.id}"></div>`
  }
}
