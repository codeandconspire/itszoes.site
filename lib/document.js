var dedent = require('dedent')
var hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    head: {
      _appendHtml: dedent`
        <meta property="og:site_name" content="Zoe Kelly">
        <script>document.documentElement.classList.add('has-js')</script>
        <link rel="shortcut icon" href="/assets/favicon.ico">
        <link rel="mask-icon" href="/assets/icon.svg" color="#000">
        <link rel="dns-prefetch" href="https://itszoessite.cdn.prismic.io">
      `
    }
  })
}
