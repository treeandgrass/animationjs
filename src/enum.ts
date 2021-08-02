/**
* inactive Corresponds to the timeline inactive phase.
* before Corresponds to the timeline before phase.
* active Corresponds to the timeline active phase.
* after Corresponds to the timeline after phase.
*/
export enum TimelinePhase { 'inactive', 'before', 'active', 'after' }

export enum FillMode {
  none = 'none',
  forwards = 'forwards',
  backwards = 'backwards',
  both = 'both',
  auto = 'auto'
}

export enum PlaybackDirection {
  normal = 'normal',
  reverse = 'reverse',
  alternate = 'alternate',
  alternateReverse = 'alternate-reverse' }

export enum AnimationReplaceState { 'active', 'removed', 'persisted' }

export enum AnimationPlayState { 'idle', 'running', 'paused', 'finished' }

export enum CompositeOperation { REPLACE = 'replace', ADD = 'add', ACCU = 'accumulate' }

export enum ICurrentDirection {
  forwards = 'forwards',
  reverse = 'reverse'
}
