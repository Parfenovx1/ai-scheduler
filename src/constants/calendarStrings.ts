export const CALENDAR_STRINGS = {
  noPermissionError: "No permission to access the calendar",
  calendarNotFoundError: "Could not find a calendar",
  eventNotesDefault: "Event created via AI assistant",
  couldNotUnderstandEvent:
    "Sorry, I couldn't understand the event details. Please specify the title, date, and time more clearly.",
  couldNotAddEvent:
    "Sorry, I couldn't add the event to the calendar. Please check the app permissions and try again.",
  eventAddedSuccess: (title: string, dateString: string, timeString: string, duration: number) =>
    `✅ I've added "${title}" to your calendar on ${dateString} at ${timeString}. Duration: ${duration} minutes.`,
  defaultEventTitle: "New meeting",
  meetingWithPrefix: "Meeting with",
} as const;