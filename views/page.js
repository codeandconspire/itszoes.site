var html = require('choo/html')
var raw = require('choo/html/raw')
var Component = require('choo/component')
var asElement = require('prismic-element')
var { asText, Elements } = require('prismic-richtext')
var view = require('../components/view')
var Figure = require('../components/figure')
var { i18n, resolve } = require('../components/base')

var text = i18n()

module.exports = view(pageView, meta)

function pageView (state, emit) {
  return state.prismic.getByUID('page', state.params.slug, function (err, doc) {
    if (err) throw err
    if (!doc) {
      // try and lookup case as linked item on homepage
      return state.prismic.getSingle('homepage', function (err, homepage) {
        if (!err && homepage) {
          var featured = homepage.data.featured_cases.find(function (item) {
            return item.page.uid === state.params.slug
          })

          if (featured) {
            return html`
              <main class="View-container View-container--nudge View-container--fill">
                <h1 class="Display Display--1 u-spaceIntro u-spaceB8 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 400ms;' : ''}">${asText(featured.page.data.title).trim()}</h1>
                <div class="View-reverse View-reverse--md">
                  ${featured.page.data.image.url
                    ? html`
                        <div class="u-spaceT4 u-spaceB4 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 200ms;' : ''}">
                          ${state.cache(Figure, `${Figure.id(featured.page.data.image)}-${state.ui.isPartial}`).render(featured.page.data.image)}
                        </div>
                      `
                    : null}
                </div>
              </main>
            `
          }
        }

        return html`
          <main class="View-container View-container--nudge View-container--fill"></main>
        `
      })
    }

    return html`
      <main class="View-container View-container--nudge">
        <h1 class="Display Display--1 u-spaceIntro u-spaceB8 u-spaceT8 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 150ms;' : ''}">${asText(doc.data.title).trim()}</h1>
        <div class="View-reverse View-reverse--md">
          ${doc.data.image.url
            ? html`
                <div class="u-spaceT4 u-spaceB4 ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 225ms;' : ''}">
                  ${state.cache(Figure, `${Figure.id(doc.data.image)}-${state.ui.isPartial}`).render(doc.data.image)}
                </div>
              `
            : null}
          <div class="${doc.data.image.url ? 'View-divider--toMd' : ''}">
            <section class="View-grid ${state.ui.isPartial ? 'u-slideIn' : ''}" style="${state.ui.isPartial ? 'animation-delay: 175ms;' : ''}">
              ${doc.data.introduction.map((item, index, list) => html`
                <div class="View-cell u-md-size1of${list.length > 3 ? 2 : list.length}">
                  ${state.cache(Topic, [doc.id, Topic.id(item), state.ui.isPartial].join('-')).render(item)}
                </div>
              `)}
            </section>
          </div>
        </div>
        ${!state.ui.isPartial && doc.data.body
          ? doc.data.body.map((slice) => {
            switch (slice.slice_type) {
              case 'gallery': return html`
                <div class="View-grid">
                  ${slice.items.map((item, index, list) => html`
                    <div class="View-cell u-md-size1of2 u-spaceB4">
                      ${state.cache(Figure, Figure.id(item.image), { size: 'half' }).render(item.image, item.caption)}
                    </div>
                  `)}
                </div>
              `
              case 'people': return html`
                <div class="View-grid">
                  ${slice.items.map((item, index, list) => html`
                    <div class="View-cell u-size1of2 u-md-size1of3 u-spaceB6">
                      ${state.cache(Figure, Figure.id(item.image), { size: 'third' }).render(item.image)}
                      <div class="Text u-spaceT3">${asElement(item.text)}</div>
                    </div>
                  `)}
                </div>
              `
              case 'image': return html`
                <div class=" u-spaceB6">
                  ${state.cache(Figure, Figure.id(slice.primary.image)).render(slice.primary.image, slice.primary.caption)}
                </div>
              `
              case 'text': return html`
                <div class="View-divider">
                  <div class="View-grid">
                    ${slice.primary.align.toLowerCase() === 'right'
                      ? html`
                          <div class="View-cell u-md-size1of2 u-lg-size1of3"></div>
                        `
                      : null}
                    <div class="View-cell u-md-size1of2 u-lg-size2of3">
                      <div class="Text u-spaceT4 u-spaceB4">
                        ${asElement(slice.primary.body)}
                      </div>
                    </div>
                  </div>
                </div>
              `
              case 'heading': return html`
                <div class="View-divider">
                  <div class="View-grid u-spaceT8 u-spaceB8">
                    <div class="View-cell u-md-size1of2 u-lg-size1of3 u-spaceB4">
                        <h2 class ="Display--subtitle" >${asText(slice.primary.heading).trim()}</h2>
                    </div>
                    <div class="View-cell u-lg-size2of3">
                      <div class="View-grid">
                        ${slice.items.map((item) => html`
                          <div class="View-cell u-lg-size1of2 u-spaceB6">
                            <div class="Text">
                              ${asElement(item.body)}
                            </div>
                          </div>
                        `)}
                      </div>
                    </div>
                  </div>
                </div>
              `
              case 'large_heading': return html`
                <h2 class="Display Display--1 u-spaceIntro u-spaceB8">
                  ${asText(slice.primary.heading).trim()}
                </h2>
              `
              case 'video': {
                let embed = slice.primary.video.find((block) => block.type === 'embed')

                if (embed) {
                  embed = asElement([embed])
                } else {
                  embed = slice.primary.video.find((block) => block.type === 'preformatted')
                  if (!embed) return null
                  embed = raw(embed.text)
                }

                return html`
                  <div class="Text Text--full u-spaceB4">
                    ${embed}
                  </div>
                `
              }
              default: return null
            }
          })
          : null}
      </main>
    `
  })
}

class Topic extends Component {
  constructor (id, state, opts = {}) {
    super(id)
    this.id = id
    this.local = state.components[id] = { expanded: false }
  }

  static id (props) {
    return asText(props.heading)
      .trim()
      .toLowerCase()
      .split(' ')
      .slice(0, 6)
      .map((word) => word.replace(/[^\w]/g, ''))
      .join('-')
  }

  update () {
    return false
  }

  expand () {
    this.local.expanded = true
    this.rerender()
  }

  unload () {
    this.local.expanded = false
  }

  createElement (props) {
    return html`
      <div id="${this.id}">
        ${props.heading
          ? html`
              <div class="Text Text--full">
                <h2 class="u-spaceT2">${asText(props.heading).trim()}</h2>
              </div>
            `
          : null}
        <div class="Text Text--wide u-spaceB6">
          ${asElement(props.body.slice(0, 1), resolve, serialize)}
        </div>
      </div>
    `

    function serialize (node, content, children) {
      switch (node.type) {
        case Elements.paragraph: return html`<p class="u-spaceB2">${children}</p>`
        default: return null
      }
    }
  }
}

function meta (state) {
  return state.prismic.getByUID('page', state.params.slug, function (err, doc) {
    if (err) throw err
    if (!doc) return { title: text`Loading` }

    var props = {
      title: doc.data.label.trim(),
      description: doc.data.description[0].text
    }

    var image = doc.data.featured_image
    if (!image || !image.url) image = doc.data.image
    if (image.url) {
      const { url, dimensions: { width, height } } = image
      props['og:image:width'] = 1024
      props['og:image:height'] = Math.floor(1024 * (height / width))
      props['og:image'] = `/media/fetch/c_fill,f_auto,q_auto,w_1024/${url}`
    } else {
      props['og:image'] = '/share.png'
    }

    return props
  })
}
