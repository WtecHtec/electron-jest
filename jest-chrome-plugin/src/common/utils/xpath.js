
const svgTags = ['svg', 'path', 'g', 'image', 'text', 'line', 'rect', 'polygon', 'circle', 'ellipse'];
const ignoreTags = ['html', 'body', ...svgTags];
/** 判断是否是 DOM 元素 */
function isDOM(obj) {
  return (
      obj &&
      typeof obj === 'object' &&
      obj.nodeType === 1 &&
      typeof obj.style === 'object' &&
      typeof obj.ownerDocument === 'object'
  );
}



/** 获取dom tag类型 */
function getTagName(ele) {
  const tag = ele.tagName.toLowerCase();
  if (svgTags.indexOf(tag) !== -1) {
      return `*[name()='${tag}']`;
  }
  return tag;
};

/** 判断当前div是否属于插件 */
export function checkElByPlugin(ele) {
  const ids = ['dom-inspector-root-jest-pro-scale', 'dom-inspector-root-jest-pro-overlay', 'dom-inspector-root-jest-pro-crx-content', 'dom-inspector-root-jest-pro-crx-container']
  try {
    if (ids.includes(ele.id)) return true
    const drawerEl = document.getElementById('dom-inspector-root-jest-pro-drawer')
    const modalEl = document.getElementById('dom-inspector-root-jest-pro-tips-modal')
    const tipEl = document.getElementById('dom-inspector-root-jest-pro-crx-tip')
    const tipSpanEl = document.getElementById('dom-inspector-root-jest-pro-tip-span')
    const selectImgEl = document.getElementById('dom-inspector-root-jest-pro-crx-select-img')
    const recImgEl = document.getElementById('dom-inspector-root-jest-pro-crx-rec-img')
    return ele.contains(drawerEl) || ele.contains(modalEl) || ele.contains(tipEl) || ele.contains(tipSpanEl) || ele.contains(selectImgEl) || ele.contains(recImgEl);
  } catch (error) {
    return false
  }
}

/** 获取tag 在第几个位置 */
function findIndex(ele, currentTag) {
  let nth = 0;
  while (ele) {
      if (ele.nodeName.toLowerCase() === currentTag ) nth += 1;
      if (ele.nodeName.toLowerCase() === currentTag && !['html', 'body'].includes(currentTag) && checkElByPlugin(ele)) {
        nth -= 1;
      }
      ele = ele.previousElementSibling;
  }
  return nth;
}

// 最新版本，支持 id 支持 div [1] 场景
// 对于 id，保留最近一层的 id 元素，svg 元素除外
// 对于 div [1], 除了 svg元素、html、body，都保留 [1]
// allId: 是否仅保留最近一层 id，列表元素选择时以防万一，选择保留所有 id
export function getXpath(ele, allId = false) {
  if (!isDOM(ele)) {
      return null;
  }
  let cur = ele;
  let hasAddedId = false;
  const hasSvgEle = svgTags.indexOf(cur.tagName.toLowerCase()) !== -1;

  const path = [];
  while (cur && cur.nodeType === Node.ELEMENT_NODE) {
      const currentTag = cur.nodeName.toLowerCase();
      const nth = findIndex(cur, currentTag);
      let idMark = '';
      if (!hasAddedId && cur.hasAttribute('id')) {
          // 仅保留最近一层的id
          idMark = `[@id="${cur.id}"]`;
          hasAddedId = true;
      }
      let nthmark = '';
      if (idMark) {
          nthmark = '';
      } else if (ignoreTags.indexOf(currentTag) === -1) {
          nthmark = `[${nth}]`;
      } else {
          nthmark = nth === 1 ? '' : `[${nth}]`;
      }
      path.push(`${getTagName(cur)}${nthmark}${idMark}`);
      // svg元素会一直往上冒，由于 intersectionObser 对 svg 无效，所以需要获取完整的 xpath 来寻找最近的非 svg 元素
      if (idMark && !hasSvgEle && !allId) {
          path.push('');
          break;
      }
      cur = cur.parentNode;
  }
  return `/${path.reverse().join('/')}`;
}


export function getXpathByParentLevel(xpath, level) {
  let currentEl = document.evaluate(xpath, document).iterateNext()
  let index = level
  while(index && isDOM(currentEl)) {
    currentEl = currentEl.parentNode
    index = index - 1
  }
  if (!isDOM(currentEl)) return null
  console.log('getXpathByParentLevel', currentEl)
  return getXpath(currentEl, true)
}