import { Platform, PermissionsAndroid } from "react-native";
import * as Calendar from "expo-calendar";
import { CALENDAR_STRINGS } from "../constants/calendarStrings";

export const requestCalendarPermissions = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const permission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_CALENDAR
    );
    return permission === PermissionsAndroid.RESULTS.GRANTED;
  } else if (Platform.OS === "ios") {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === "granted";
  }
  return false;
};

const getDefaultCalendarId = async (): Promise<string | null> => {
  try {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendar = calendars.find(
      (cal) =>
        cal.source.name === "Default" ||
        cal.source.name === "iCloud" ||
        cal.source.name === "Calendar" ||
        cal.isPrimary
    );

    return defaultCalendar?.id || calendars[0]?.id || null;
  } catch (error) {
    console.error("Failed to get calendar", error);
    return null;
  }
};

const addEventToCalendar = async (
  title: string,
  startDate: Date,
  endDate: Date,
  notes?: string
): Promise<string | null> => {
  try {
    const hasPermission = await requestCalendarPermissions();

    if (!hasPermission) {
      throw new Error(CALENDAR_STRINGS.noPermissionError);
    }

    const calendarId = await getDefaultCalendarId();

    if (!calendarId) {
      throw new Error(CALENDAR_STRINGS.calendarNotFoundError);
    }

    const eventId = await Calendar.createEventAsync(calendarId, {
      title,
      startDate,
      endDate,
      notes,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      alarms: [{ relativeOffset: -30 }],
    });

    return eventId;
  } catch (error) {
    console.error("Failed to add event to calendar", error);
    return null;
  }
};

interface EventDetails {
  title: string;
  date: Date;
  duration: number;
}

const parseEventFromText = (text: string): EventDetails | null => {
  try {
    let title = "";
    const withMatch = text.match(/meeting with\s+([a-zA-Z\s]+?)(?:\s+(?:at|on|for)\b|$)/i);
    if (withMatch) {
      title = `${CALENDAR_STRINGS.meetingWithPrefix} ${withMatch[1].trim()}`;
    } else {
      title = CALENDAR_STRINGS.defaultEventTitle;
    }

    const timeMatch = text.match(/(\d{1,2})[:.\-]?(\d{0,2})\s*(am|pm)?/i);
    let hours = 12;
    let minutes = 0;

    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;

      const meridiem = timeMatch[3]?.toLowerCase();
      if (meridiem === "pm" && hours < 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;
    }

    const now = new Date();
    const eventDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    if (eventDate < now) {
      eventDate.setDate(eventDate.getDate() + 1);
    }

    let duration = 60;

    const durationPatterns = [
      /for (\d+)\s*(minutes?|hours?)/i,
      /lasting (\d+)\s*(minutes?|hours?)/i,
      /duration of (\d+)\s*(minutes?|hours?)/i,
      /(\d+)\s*(minutes?|hours?)/i,
    ];

    for (const pattern of durationPatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        if (unit.startsWith("hour")) {
          duration = value * 60;
        } else {
          duration = value;
        }

        break;
      }
    }

    return {
      title,
      date: eventDate,
      duration,
    };
  } catch (error) {
    console.error("Error parsing event details", error);
    return null;
  }
};

export const isCalendarRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();

  const calendarActionPattern =
    /\b(add|schedule|create|set up|book|arrange|plan)\b.{0,15}\b(meeting|event|appointment|call)\b/i;

  const calendarNounPattern = /\b(add|put)\b.{0,15}\bcalendar\b/i;

  return calendarActionPattern.test(lowerMessage) || calendarNounPattern.test(lowerMessage);
};

export const handleCalendarRequest = async (
  message: string
): Promise<string> => {
  const eventDetails = parseEventFromText(message);

  if (!eventDetails) {
    return CALENDAR_STRINGS.couldNotUnderstandEvent;
  }

  const { title, date, duration } = eventDetails;

  const endDate = new Date(date);
  endDate.setMinutes(endDate.getMinutes() + duration);

  const eventId = await addEventToCalendar(
    title,
    date,
    endDate,
    CALENDAR_STRINGS.eventNotesDefault
  );

  if (eventId) {
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = date.toLocaleDateString();

    return CALENDAR_STRINGS.eventAddedSuccess(title, dateString, timeString, duration);
  } else {
    return CALENDAR_STRINGS.couldNotAddEvent;
  }
};
