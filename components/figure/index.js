var html = require('choo/html')
var Component = require('choo/component')
var { mousemove, memo, srcset } = require('../base')

module.exports = class Header extends Component {
  constructor (id, state, emit, opts) {
    super(id)
    Object.assign(this, opts, { id })
    this.state = state
    this.interactive = opts && opts.interactive
    this.emit = emit
  }

  static id (img) {
    return img.url.match(/.+\/(.+?)\.(?:jpg|jpeg|png|svg|gif|webp)(?:\?|$)/)[1]
  }

  static prefetch (props) {
    if (!props.url || typeof window === 'undefined') return
    var img = new window.Image()
    img.src = `/media/fetch/q_0,w_20,f_png/${props.url}`
  }

  load (element) {
    var self = this

    if (this.interactive) {
      this.unload = mousemove(element)
    }

    // ready via cache
    if (element.querySelector('.js-image').complete) {
      element.classList.add('is-loaded')
      self.loaded = true
    }

    element.querySelector('.js-image').addEventListener('load', function () {
      element.classList.add('is-loaded')
      self.loaded = true
    })
  }

  update () {
    return false
  }

  createElement (img, caption) {
    var alt = img.alternative
    return html`
      <figure class="Figure ${this.loaded ? 'is-loaded' : ''}" id="${this.id}">
        <div class="Figure-container ${alt ? 'Figure-container--alternative' : ''}" style="--Figure-aspect: ${(img.dimensions.height / img.dimensions.width * 100).toFixed(2)}%; ${alt ? `--Figure-aspect-alternative: ${(alt.dimensions.height / alt.dimensions.width * 100).toFixed(2)}%` : ''}">
          ${img.url ? getImage(img, this.size) : null}
        </div>
        ${caption
          ? html`
              <figcaption class="u-spaceT2 u-spaceB2">${caption}</figcaption>
            `
          : null}
      </figure>
    `
  }
}

function getImage (props, size) {
  var viewport = '100vw'
  var sizes = [640, 750, 1125, 1440, [2880, 'q_80'], [3840, 'q_70']]

  if (size === 'half') {
    viewport = '(min-width: 600px) 50vw, 100vw'
    sizes = [640, 750, 1125, 1440, [2880, 'q_80'], [3840, 'q_70']]
  }

  if (size === 'third') {
    viewport = '(min-width: 600px) 30vw, 50vw'
    sizes = [640, 750, 1125, 1440, [2880, 'q_80'], [3840, 'q_70']]
  }

  if (!props.url) {
    return null
  }

  var attrs = memo(function (url, sizes) {
    var sources = srcset(props.url, sizes)
    return Object.assign({
      sizes: viewport,
      srcset: sources,
      alt: props.alt || '',
      src: sources.split(' ')[0]
    }, props.dimensions)
  }, [props.url, sizes.filter(function (size) {
    if (Array.isArray(size)) size = size[0]
    return size <= props.dimensions.width
  })])

  if (!props.alternative) {
    return html`
      <div>
        <img class="Figure-load" width="${attrs.width}" height="${attrs.height}" src="/media/fetch/q_0,w_20,f_png/${props.url}">
        <img class="Figure-image js-image" ${attrs}>
      </div>
    `
  }

  return html`
    <div>
      <img class="Figure-load" width="${attrs.width}" height="${attrs.height}" src="/media/fetch/q_0,w_20,f_png/${props.url}">
      <picture>
        <source srcset="${attrs.srcset}" media="(min-width: 600px)" sizes="${viewport}">
        <img class="Figure-image js-image" alt="${attrs.alt}" srcset="${srcset(props.alternative.url, sizes)}" sizes="${viewport}" width="${attrs.width}" height="${attrs.height}" src="${attrs.src}">
      </picture>
    </div>
  `
}
