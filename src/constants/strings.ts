// constants/strings.ts
export const STRINGS = {
  chatInputPlaceholder: "Ask a question or create an event...",
  emptyChatMessage: "Type something to start a conversation",
  permissionRequiredTitle: "Permission required",
  permissionRequiredMessage:
    "Calendar access is required to add events. You can change this in the app settings.",
  calendarPermissionDeniedMessage:
    "Calendar access is required to add events. Please grant permission in the app settings.",
  genericErrorMessage: "Error contacting AI",
  ok: "OK",
  calendarKeywordsRegex:
    /add|schedule|create.+event|remind|calendar/i,
} as const;