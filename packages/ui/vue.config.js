module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
     @import "@/scss/startup.scss";
    `
      }
    }
  }
}
