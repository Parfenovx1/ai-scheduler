import { Platform, PermissionsAndroid } from "react-native";
import * as Calendar from "expo-calendar";

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
      throw new Error("Нет разрешения на доступ к календарю");
    }

    const calendarId = await getDefaultCalendarId();

    if (!calendarId) {
      throw new Error("Не удалось найти календарь");
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
    if (text.includes("встречу с ")) {
      const match = text.match(/встречу с\s+([^\d]+)(?:\s+на|в)/i);
      title = match ? `Встреча с ${match[1].trim()}` : "Новая встреча";
    } else {
      title = "Новая встреча";
    }

    const timeMatch = text.match(/(\d{1,2})[:\.\-]?(\d{0,2})/);
    let hours = 12;
    let minutes = 0;

    if (timeMatch) {
      hours = parseInt(timeMatch[1]);
      minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
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
      /на (\d+) (минут|час[а-я]*)/i,
      /длительностью (\d+) (минут|час[а-я]*)/i,
      /продолжительностью (\d+) (минут|час[а-я]*)/i,
      /(\d+) (минут|час[а-я]*)/i,
    ];

    for (const pattern of durationPatterns) {
      const match = text.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();

        if (unit.startsWith("час")) {
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
  const keywords = [
    "добавь встречу",
    "запланируй встречу",
    "запиши встречу",
    "создай встречу",
    "добавь в календарь",
    "запланируй в календаре",
    "запиши в календарь",
    "создай событие",
    "добавь событие",
  ];

  const lowerMessage = message.toLowerCase();
  return keywords.some((keyword) => lowerMessage.includes(keyword));
};

export const handleCalendarRequest = async (
  message: string
): Promise<string> => {
  const eventDetails = parseEventFromText(message);

  if (!eventDetails) {
    return "Извините, я не смог понять детали события. Пожалуйста, укажите название, дату и время более точно.";
  }

  const { title, date, duration } = eventDetails;

  const endDate = new Date(date);
  endDate.setMinutes(endDate.getMinutes() + duration);

  const eventId = await addEventToCalendar(
    title,
    date,
    endDate,
    `Событие создано через AI ассистента`
  );

  if (eventId) {
    const timeString = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = date.toLocaleDateString();

    return `✅ Я добавил "${title}" в ваш календарь на ${dateString} в ${timeString}. Продолжительность: ${duration} минут.`;
  } else {
    return "Извините, не удалось добавить событие в календарь. Проверьте разрешения приложения и попробуйте снова.";
  }
};
