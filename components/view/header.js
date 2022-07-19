var html = require('choo/html')
var Component = require('choo/component')
var { i18n } = require('../base')

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

    return html`
      <div class="View-header ${fixed ? 'is-fixed' : ''}" id="${this.id}">
        <ul class="View-nav">
          <li>
            <a class="View-link u-slideIn" href="/" onclick=${top}>
              <svg class="svg" viewBox="0 0 107.2 107.2"><circle cx="53.6" cy="53.6" r="50.59" style="fill:#fff"/><path d="M60,113.63A53.6,53.6,0,1,1,112.14,47.5h0A53.61,53.61,0,0,1,60,113.63Zm0-101.2A47.6,47.6,0,1,0,106.3,48.9,47.4,47.4,0,0,0,60,12.43Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><ellipse cx="41.9" cy="44.29" rx="5.64" ry="15.13" transform="translate(-15.63 4.59) rotate(-13.52)" style="fill:#543eed"/><ellipse cx="69.02" cy="37.77" rx="5.64" ry="15.13" transform="translate(-13.35 10.75) rotate(-13.52)" style="fill:#543eed"/><path d="M59.94,94.15a34.62,34.62,0,0,1-10.63-1.66A35.21,35.21,0,0,1,26.89,70.72a3,3,0,1,1,5.66-2,29.2,29.2,0,0,0,18.59,18A28.8,28.8,0,0,0,61,88.13a3,3,0,0,1,.23,6C60.81,94.15,60.37,94.15,59.94,94.15Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><path d="M88.66,76.41a2.93,2.93,0,0,1-1.34-.32,3,3,0,0,1-1.34-4,29,29,0,0,0,2.77-17.14,3,3,0,1,1,5.93-.86,34.8,34.8,0,0,1-3.33,20.68A3,3,0,0,1,88.66,76.41Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><path d="M88.32,57A3,3,0,0,1,87,51.26a15.27,15.27,0,0,1,8.1-.84,3,3,0,1,1-.83,5.94,9.43,9.43,0,0,0-4.78.37A3.12,3.12,0,0,1,88.32,57Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><path d="M26.56,73a3,3,0,0,1-2-5.19A15.3,15.3,0,0,1,32,64.57a3,3,0,1,1,1,5.91,9.69,9.69,0,0,0-4.44,1.8A3,3,0,0,1,26.56,73Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><path d="M76.41,89.2a4,4,0,1,1,3.77-2.75,3.92,3.92,0,0,1-2,2.31A3.86,3.86,0,0,1,76.41,89.2Zm0-5.73a1.72,1.72,0,0,0-.8.2,1.76,1.76,0,1,0,1.61,3.13A1.76,1.76,0,0,0,78,84.43h0a1.71,1.71,0,0,0-1-.87A1.65,1.65,0,0,0,76.4,83.47Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><path d="M67.77,93.69a1.09,1.09,0,0,1-.72-.27,1.11,1.11,0,0,1-.33-1.14l1.39-4.72-2.16,1a1.1,1.1,0,0,1-.9-2l4.35-2a1.09,1.09,0,0,1,1.17.17,1.12,1.12,0,0,1,.33,1.14l-1.39,4.73,2.16-1a1.1,1.1,0,0,1,.9,2L68.23,93.6A1.22,1.22,0,0,1,67.77,93.69Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><path d="M84.05,84.52h0a1.1,1.1,0,0,1-.77-.36L79.41,80a1.1,1.1,0,0,1,.06-1.55l3.09-2.85a1.11,1.11,0,0,1,1.56.07,1.09,1.09,0,0,1-.07,1.55l-2.28,2.1,2.35,2.55,2.28-2.1a1.1,1.1,0,0,1,1.55.06,1.11,1.11,0,0,1-.06,1.56L84.8,84.23A1.1,1.1,0,0,1,84.05,84.52Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/><path d="M82.39,82.11a1.13,1.13,0,0,1-.81-.35,1.11,1.11,0,0,1,.07-1.56l2.58-2.37a1.1,1.1,0,0,1,1.49,1.62l-2.58,2.37A1.07,1.07,0,0,1,82.39,82.11Z" transform="translate(-6.43 -6.43)" style="fill:#543eed"/></svg>
            </a>
          </li>
          <li class="Link-about">
            <a class="View-link u-slideIn" href="/about">${text`About`}
            </a>
          </li>
        </ul>
      </div>
    `

    function top () {
      window.scrollTo(0, 0)
    }
  }
}
