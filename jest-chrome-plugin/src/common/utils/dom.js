/** 获取 鼠标移动 圈选 目标节点元素  */
export function getTouchMouseTargetElement(e) {
  if (e instanceof TouchEvent && e.touches) {
      const changedTouch = e.changedTouches[0];
      return document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
  }
  return e.target;
}

/** 判断是否是 DOM 元素 */
export function isDOM(obj) {
  return (
      obj &&
      typeof obj === 'object' &&
      obj.nodeType === 1 &&
      typeof obj.style === 'object' &&
      typeof obj.ownerDocument === 'object'
  );
}

/** 计算页面 zindex 总值 */
export function getMaxZIndex() {
  return [...document.querySelectorAll('*')].reduce(
      (r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0),
      0
  );
}

/** 创建 html 元素 */
export function createElement(tag, attr, content) {
  const ele = window.document.createElement(tag);
  Object.keys(attr).forEach((item) => {
      ele.setAttribute(item, attr[item]);
  });
  if (content) ele.innerHTML = content;
  return ele;
}


/** html 元素添加 style样式 */
function addRule(selector, cssObj) {
  Object.keys(cssObj).forEach((item) => {
      selector.style.setProperty(item, cssObj[item]);
  });
}

/** 创建圈选 包围的元素, 创建 parent的子元素 */
export function createSurroundEle(parent, className, content) {
  const ele = createElement(
      'div',
      {
          class: className,
      },
      content
  );
  parent.appendChild(ele);
  return ele;
}


/** 计算缩放比例 */
export function getScale(ele) {
  const pos = ele.getBoundingClientRect();
  const scalex = Number((ele.offsetWidth === undefined ? 1 : ele.offsetWidth / pos.width).toFixed(1));
  const scaley = Number((ele.offsetHeight === undefined ? 1 : ele.offsetHeight / pos.height).toFixed(1));

  return {
      scalex,
      scaley,
  };
}

/** 创建圈选蒙层 */
export function addOverlay({
  target,
  root,
  id = 'dom-inspector',
  assistEle,
  theme = 'dom-inspector-theme-default',
  maxZIndex = 9999,
}) {
  if (!target) return null;
    const wrapper = createElement('div', {
        style: `z-index: ${maxZIndex}`,
        class: 'dom-inspector-wrapper',
    });
    const parent = createElement('div', {
        id,
        class: `dom-inspector ${theme}`,
        style: `z-index: ${maxZIndex}`,
    });
    wrapper.appendChild(parent);


    const overlay = {
      parent,
      content: createSurroundEle(parent, 'content'),
      paddingTop: createSurroundEle(parent, 'padding padding-top'),
      paddingRight: createSurroundEle(parent, 'padding padding-right'),
      paddingBottom: createSurroundEle(parent, 'padding padding-bottom'),
      paddingLeft: createSurroundEle(parent, 'padding padding-left'),
      borderTop: createSurroundEle(parent, 'border border-top'),
      borderRight: createSurroundEle(parent, 'border border-right'),
      borderBottom: createSurroundEle(parent, 'border border-bottom'),
      borderLeft: createSurroundEle(parent, 'border border-left'),
      marginTop: createSurroundEle(parent, 'margin margin-top'),
      marginRight: createSurroundEle(parent, 'margin margin-right'),
      marginBottom: createSurroundEle(parent, 'margin margin-bottom'),
      marginLeft: createSurroundEle(parent, 'margin margin-left'),
      tips: createSurroundEle(
          wrapper,
          'tips',
          '<div class="tag"></div><div class="id"></div><div class="class"></div><div class="line">&nbsp;|&nbsp;</div><div class="size"></div><div class="triangle"></div>'
      ),
    };

    const { scalex: scalexP, scaley: scaleyP } = getScale(assistEle);
    const { scalex: scalexE, scaley: scaleyE } = getScale(target);

    const elementInfo = getElementInfo(target);

    const contentLevel = {
      width: elementInfo.width,
      height: elementInfo.height,
    };
    const paddingLevel = {
        width: elementInfo['padding-left'] + contentLevel.width + elementInfo['padding-right'],
        height: elementInfo['padding-top'] + contentLevel.height + elementInfo['padding-bottom'],
    };

    const borderLevel = {
        width:
            elementInfo['border-left-width'] +
            paddingLevel.width +
            elementInfo['border-right-width'],
        height:
            elementInfo['border-top-width'] +
            paddingLevel.height +
            elementInfo['border-bottom-width'],
    };
    const marginLevel = {
        width: elementInfo['margin-left'] + borderLevel.width + elementInfo['margin-right'],
        height: elementInfo['margin-top'] + borderLevel.height + elementInfo['margin-bottom'],
    };

    // 绘制 圈选 元素整个盒子
    addRule(overlay.parent, {
      width: `${marginLevel.width}px`,
      height: `${marginLevel.height}px`,
      top: `${(elementInfo.top / scaleyE) * scaleyP}px`,
      left: `${(elementInfo.left / scalexE) * scalexP}px`,
    });

    if (scalexE !== scalexP || scaleyE !== scaleyP) {
        addRule(overlay.parent, {
            transform: `scale(${scalexP / scalexE}, ${scaleyP / scaleyE})`,
        });
    }

    // 绘制 圈选 内容 盒子
    addRule(overlay.content, {
      width: `${contentLevel.width}px`,
      height: `${contentLevel.height}px`,
      top: `${
          elementInfo['margin-top'] + elementInfo['border-top-width'] + elementInfo['padding-top']
      }px`,
      left: `${
          elementInfo['margin-left'] +
          elementInfo['border-left-width'] +
          elementInfo['padding-left']
      }px`,
    });

    // 绘制 圈选 元素的 四边的 内边距
    addRule(overlay.paddingTop, {
      width: `${paddingLevel.width}px`,
      height: `${elementInfo['padding-top']}px`,
      top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
      left: `${elementInfo['margin-left'] + elementInfo['border-left-width']}px`,
    });
    addRule(overlay.paddingRight, {
        width: `${elementInfo['padding-right']}px`,
        height: `${paddingLevel.height - elementInfo['padding-top']}px`,
        top: `${
            elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']
        }px`,
        right: `${elementInfo['margin-right'] + elementInfo['border-right-width']}px`,
    });
    addRule(overlay.paddingBottom, {
        width: `${paddingLevel.width - elementInfo['padding-right']}px`,
        height: `${elementInfo['padding-bottom']}px`,
        bottom: `${elementInfo['margin-bottom'] + elementInfo['border-bottom-width']}px`,
        right: `${
            elementInfo['padding-right'] +
            elementInfo['margin-right'] +
            elementInfo['border-right-width']
        }px`,
    });
    addRule(overlay.paddingLeft, {
        width: `${elementInfo['padding-left']}px`,
        height: `${
            paddingLevel.height - elementInfo['padding-top'] - elementInfo['padding-bottom']
        }px`,
        top: `${
            elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']
        }px`,
        left: `${elementInfo['margin-left'] + elementInfo['border-left-width']}px`,
    });

    //  绘制 圈选 元素的 四边的 边框
    addRule(overlay.borderTop, {
      width: `${borderLevel.width}px`,
      height: `${elementInfo['border-top-width']}px`,
      top: `${elementInfo['margin-top']}px`,
      left: `${elementInfo['margin-left']}px`,
    });
    addRule(overlay.borderRight, {
        width: `${elementInfo['border-right-width']}px`,
        height: `${borderLevel.height - elementInfo['border-top-width']}px`,
        top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
        right: `${elementInfo['margin-right']}px`,
    });
    addRule(overlay.borderBottom, {
        width: `${borderLevel.width - elementInfo['border-right-width']}px`,
        height: `${elementInfo['border-bottom-width']}px`,
        bottom: `${elementInfo['margin-bottom']}px`,
        right: `${elementInfo['margin-right'] + elementInfo['border-right-width']}px`,
    });
    addRule(overlay.borderLeft, {
        width: `${elementInfo['border-left-width']}px`,
        height: `${
            borderLevel.height -
            elementInfo['border-top-width'] -
            elementInfo['border-bottom-width']
        }px`,
        top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
        left: `${elementInfo['margin-left']}px`,
    });


    // 绘制 圈选 元素的 四边的 外边距
    addRule(overlay.marginTop, {
      width: `${marginLevel.width}px`,
      height: `${elementInfo['margin-top']}px`,
      top: 0,
      left: 0,
    });
    addRule(overlay.marginRight, {
        width: `${elementInfo['margin-right']}px`,
        height: `${marginLevel.height - elementInfo['margin-top']}px`,
        top: `${elementInfo['margin-top']}px`,
        right: 0,
    });
    addRule(overlay.marginBottom, {
        width: `${marginLevel.width - elementInfo['margin-right']}px`,
        height: `${elementInfo['margin-bottom']}px`,
        bottom: 0,
        right: `${elementInfo['margin-right']}px`,
    });
    addRule(overlay.marginLeft, {
        width: `${elementInfo['margin-left']}px`,
        height: `${
            marginLevel.height - elementInfo['margin-top'] - elementInfo['margin-bottom']
        }px`,
        top: `${elementInfo['margin-top']}px`,
        left: 0,
    });

    // 设置 tip 的显示
    getElByParent('.tag', overlay.tips).innerHTML = target.tagName.toLowerCase();
    getElByParent('.id', overlay.tips).innerHTML = target.id ? `#${target.id}` : '';
    //getElByParent('.class', overlay.tips).innerHTML = [...target.classList].map(item => `.${item}`).join('');
    getElByParent('.size', overlay.tips).innerHTML = `${marginLevel.width / scalexE}x${marginLevel.height / scaleyE}`;
    let tipsTop = 0;
    const tipsOrigin = ['top', 'left'];
    if (elementInfo.top / scaleyE >= 24 + 8) {
        overlay.tips.classList.remove('reverse');
        tipsTop = (elementInfo.top / scaleyE - 24 - 8) * scaleyP;
        tipsOrigin[0] = 'top';
    } else {
        overlay.tips.classList.add('reverse');
        tipsTop = ((marginLevel.height + elementInfo.top) / scaleyE + 8) * scaleyP;
        tipsOrigin[0] = 'top';
    }

    const lr = {
        left: 'auto',
        right: 'auto',
    };
    if ((elementInfo.left / scalexE) * scalexP > document.body.clientWidth * 0.7) {
        overlay.tips.classList.add('reverse-r');
        tipsOrigin[1] = 'right';
        lr.right = `${document.body.clientWidth - (elementInfo.right / scalexE) * scalexP}px`;
    } else {
        overlay.tips.classList.remove('reverse-r');
        lr.left = `${(elementInfo.left / scalexE) * scalexP}px`;
        tipsOrigin[1] = 'left';
    }

    addRule(overlay.tips, {
        top: `${tipsTop}px`,
        ...lr,
        display: 'block',
        'z-index': maxZIndex,
    });

    if (Number(scalexP) !== 1 || Number(scaleyP) !== 1) {
        addRule(overlay.tips, {
            transform: `scale(${scalexP}, ${scaleyP})`,
            'transform-origin': `${tipsOrigin[0]} ${tipsOrigin[1]}`,
        });
    }

    root.appendChild(wrapper);

}


/** 获取元素 内边距、外边距、宽高等元素数据 */
export function getElementInfo(ele) {
  const result = {};
  const requiredValue = [
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'z-index',
  ];

  const computedStyle = getComputedStyle(ele);
  requiredValue.forEach((item) => {
      result[item] = parseFloat(computedStyle.getPropertyValue(item)) || 0;
  });

  const info = ele.getBoundingClientRect();

  // FIXME: 简单兼容svg元素offsetWidth, offsetHeight 为空的场景
  // TODO: 需要判断Svg元素的box-sizing，来决定其width,height是否需要减去padding, border
  const width =
      ele.offsetWidth === undefined
          ? info.width
          : ele.offsetWidth -
            result['border-left-width'] -
            result['border-right-width'] -
            result['padding-left'] -
            result['padding-right'];

  const height =
      ele.offsetHeight === undefined
          ? info.height
          : ele.offsetHeight -
            result['border-top-width'] -
            result['border-bottom-width'] -
            result['padding-top'] -
            result['padding-bottom'];

  mixin(result, {
      width,
      height,
  });
  mixin(result, findPos(ele));
  return result;
}


/** 获取某个元素的子元素 */
export function getElByParent(selector, parent) {
  if (parent !== undefined && isDOM(parent)) {
      return parent.querySelector(selector);
  }
  return document.querySelector(selector);
}

/** 复制自身属性的值 */
export function mixin(target, source) {
  const targetCopy = target;
  Object.keys(source).forEach((item) => {
      if ({}.hasOwnProperty.call(source, item)) {
          targetCopy[item] = source[item];
      }
  });
  return targetCopy;
}

/** 获取 元素 上左右相对位置 位置 */
export function findPos(ele) {
  const computedStyle = window.getComputedStyle(ele);
  const pos = ele.getBoundingClientRect();
  // 获取元素本身的缩放比例
  const { scalex, scaley } = getScale(ele);

  // 计算元素缩放前的位置
  const x = pos.left * scalex - parseFloat(computedStyle.getPropertyValue('margin-left'));
  const y = pos.top * scaley - parseFloat(computedStyle.getPropertyValue('margin-top'));
  const r = pos.right * scalex + parseFloat(computedStyle.getPropertyValue('margin-right'));

  return {
      top: y,
      left: x,
      right: r,
      scalex,
      scaley,
  };
}
