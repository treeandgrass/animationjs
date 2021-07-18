import { IEffectTiming, IOptionalEffectTiming } from './types'
import { FillMode, PlaybackDirection } from './enum'

export const EffectTiming: IEffectTiming = {
  delay: 0,
  endDelay: 0,
  fill: FillMode.auto,
  iterationStart: 0.0,
  iterations: 1.0,
  duration: 0,
  direction: PlaybackDirection.normal,
  easing: 'linear'
}

export const OptionalEffectTiming = {
  delay: 0,
  endDelay: 0,
  fill: FillMode.auto,
  iterationStart: 0.0,
  iterations: 1.0,
  duration: 'auto',
  direction: PlaybackDirection.normal,
  easing: 'linear'
}

/**
 * use to map initial value
 */
export const initialValues = {
  backgroundColor: 'transparent',
  backgroundPosition: '0% 0%',
  borderBottomColor: 'currentColor',
  borderBottomLeftRadius: '0px',
  borderBottomRightRadius: '0px',
  borderBottomWidth: '3px',
  borderLeftColor: 'currentColor',
  borderLeftWidth: '3px',
  borderRightColor: 'currentColor',
  borderRightWidth: '3px',
  borderSpacing: '2px',
  borderTopColor: 'currentColor',
  borderTopLeftRadius: '0px',
  borderTopRightRadius: '0px',
  borderTopWidth: '3px',
  bottom: 'auto',
  clip: 'rect(0px, 0px, 0px, 0px)',
  color: 'black',
  fontSize: '100%',
  fontWeight: '400',
  height: 'auto',
  left: 'auto',
  letterSpacing: 'normal',
  lineHeight: '120%',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
  marginTop: '0px',
  maxHeight: 'none',
  maxWidth: 'none',
  minHeight: '0px',
  minWidth: '0px',
  opacity: '1.0',
  outlineColor: 'invert',
  outlineOffset: '0px',
  outlineWidth: '3px',
  paddingBottom: '0px',
  paddingLeft: '0px',
  paddingRight: '0px',
  paddingTop: '0px',
  right: 'auto',
  strokeDasharray: 'none',
  strokeDashoffset: '0px',
  textIndent: '0px',
  textShadow: '0px 0px 0px transparent',
  top: 'auto',
  transform: '',
  verticalAlign: '0px',
  visibility: 'visible',
  width: 'auto',
  wordSpacing: 'normal',
  zIndex: 'auto'
}

export const EASING_FUNCTION_SET = {
  ease: 'ease',
  linear: 'linear',
  spring: 'spring',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  bezier: 'cubic-bezier',
  easeInOut: 'ease-in-out'
}

export const SUPPORTED_EASING = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'spring']

export const PreserveProps = ['easing', 'offset', 'composite']

export const UNRESOLVED = null