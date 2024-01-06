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
  // {
  //   nodeType: 'opt',
  //   optsetting: {
  //     optType: 'opt_click',
  //     xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/main[1]/main[1]/div[3]/div[2]/div[1]/a[1]/div[1]/p[1]',
  //     waitTime: 0,
  //     clickData: {
  //       isCurrentPage: 2,
  //     }
  //   }
  // },
  {
    nodeType: 'opt',
    optsetting: {
      optType: 'opt_input',
      xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/div[1]/header[1]/div[1]/nav[1]/ul[1]/ul[1]/li[1]/ul[1]/li[1]/form[1]/input[1]',
      waitTime: 0,
      inputData: {
        inputValue: '测试输入',
      }
    }
  },
  {
    nodeType: 'opt',
    optsetting: {
      optType: 'opt_click',
      xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/div[1]/header[1]/div[1]/nav[1]/ul[1]/ul[1]/li[1]/ul[1]/li[1]/form[1]/div[1]',
      waitTime: 0,
      clickData: {
        isCurrentPage: 2,
      }
    }
  },
  {
    nodeType: 'opt',
    optsetting: {
      optType: 'opt_verify',
      xpath: '/html/body/div[1]/div[1]/div[@id="juejin"]/div[1]/main[1]/div[1]/div[1]/div[1]/div[1]/ul[1]/li[1]/div[1]/a[1]/object[1]/div[1]/div[1]/div[2]/a[1]/div[1]',
      waitTime: 0,
      verifyData: {
        rename: '测试校验',
        verifyValue: '揭秘百度智能测试在测试分析领域实践1',
        tipType: 'tip_alert',
      }
    }
  },
  {
    nodeType: 'end',
  },
]