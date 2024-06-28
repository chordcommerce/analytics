/* eslint-disable */
import type { EventProperties } from './types/index.js'

export const pruneNullValues = (props: EventProperties): EventProperties => {
  if (typeof props !== 'object' || props === null) return props
  if (!Array.isArray(props)) {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        props[key] = pruneNullValues(props[key])
        if (props[key] === null) delete props[key]
      }
    }
  } else {
    for (let i = 0; i < props.length; i++) {
      props[i] = pruneNullValues(props[i])
      if (props[i] === null) props.splice(i--, 1)
    }
  }
  return props
}
