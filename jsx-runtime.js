const add = (parent, child) => {
  parent.appendChild(child?.nodeType ? child : document.createTextNode(child))
}

const appendChild = (parent, child) => {
  if (Array.isArray(child)) {
    child.forEach(nestedChild => appendChild(parent, nestedChild))
  } else if (child !== undefined) {
    add(parent, child)
  }
}

const attribute = (name, value) => {
  if (
    value === undefined ||
    ['wrapper', 'wrap', 'wrapperclass', 'wrapperChildren'].includes(name.toLowerCase())
  ) {
    return undefined
  }
  if (name.toLowerCase() === 'classname') {
    return ['class', value]
  }
  return [name, value]
}

export const jsx = (tag, props) => {
  const {children, ...attributes} = props
  if (typeof tag === 'function') return tag(props, children)
  const element = document.createElement(tag)
  let isLiteral = false
  Object.entries(attributes || {}).forEach(([name, value]) => {
    if (name.startsWith('on') && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substr(2), value)
    }
    if (name === 'literal') {
      isLiteral = true
    } else {
      const attributeArgs = attribute(name, value)
      if (attributeArgs !== undefined) {
        element.setAttribute(...attributeArgs)
      }
    }
  })
  if (children !== undefined) {
    appendChild(element, children)
  }
  if (isLiteral) {
    return element.outerHtml
  }
  return element
}

export const jsxs = jsx
