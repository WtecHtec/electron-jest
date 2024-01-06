module.exports = [
  {
    nodeType: 'start',
    url: 'https://juejin.cn/'
  },
  {
    nodeType: 'opt',
    optsetting: {
      optType: 'opt_click',
      xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/div[1]/header[1]/div[1]/nav[1]/ul[1]/li[1]/ul[1]/li[2]/a[1]',
      waitTime: 0,
      clickData: {
        isCurrentPage: 2,
      }
    }
  },
  {
    nodeType: 'opt',
    optsetting: {
      optType: 'opt_click',
      xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/main[1]/main[1]/div[3]/div[2]/div[1]/a[1]/div[1]/p[1]',
      waitTime: 0,
      clickData: {
        isCurrentPage: 2,
      }
    }
  },
  {
    nodeType: 'end',
  },
]