/**
* inactive Corresponds to the timeline inactive phase.
* before Corresponds to the timeline before phase.
* active Corresponds to the timeline active phase.
* after Corresponds to the timeline after phase.
*/
export enum TimelinePhase { "inactive", "before", "active", "after" }

export enum FillMode { "none", "forwards", "backwards", "both", "auto" }

export enum PlaybackDirection { "normal", "reverse", "alternate", "alternate-reverse" }

export enum AnimationReplaceState { "active", "removed", "persisted" }

export enum AnimationPlayState { "idle", "running", "paused", "finished" }
