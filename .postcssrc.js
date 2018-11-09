module.exports = {
  plugins: [
    require('postcss-px-to-viewport')({
      viewportWidth: 360,
      selectorBlackList: ['.use-px', '.hairlines']
    }),
    require('autoprefixer')({
      browsers: ['Android >= 4.0', 'iOS >= 7', 'last 5 versions']
    })
  ]
}
