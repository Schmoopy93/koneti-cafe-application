"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useTranslation } from "react-i18next";
import "./FullCalendarComponent.scss";

interface Reservation {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  subType?: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  status: string;
  selectedMenu?: string;
}

interface FullCalendarComponentProps {
  reservations: Reservation[];
  onEventClick: (reservation: Reservation) => void;
  onStatusUpdate: (id: string, status: string) => void;
}

export default function FullCalendarComponent({
  reservations,
  onEventClick,
  onStatusUpdate,
}: FullCalendarComponentProps) {
  const { t } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const validReservations = reservations.filter(reservation => reservation && typeof reservation.date === 'string' && reservation.date);
    const calendarEvents = validReservations.map((reservation) => {
      // Fix date format - extract just the date part
      const dateOnly = reservation.date.split('T')[0];
      const startDateTime = `${dateOnly}T${reservation.time}`;

      // Sanitize data for logging
      const sanitizedName = reservation.name?.replace(/[^a-zA-Z0-9\s]/g, '') || 'Unknown';

      return {
        id: reservation._id,
        title: `${reservation.name} (${reservation.guests} guests)`,
        start: startDateTime,
        backgroundColor: getStatusColor(reservation.status),
        borderColor: getStatusColor(reservation.status),
        textColor: "#ffffff",
        extendedProps: {
          reservation,
        },
      };
    });
    setEvents(calendarEvents);
  }, [reservations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#f39c12";
      case "approved":
        return "#27ae60";
      case "rejected":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };



  const handleEventClick = (clickInfo: any) => {
    const reservation = clickInfo.event.extendedProps.reservation;
    if (reservation) {
      onEventClick(reservation);
    }
  };

  return (
    <div className="fullcalendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,listWeek",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        locale="en"
        firstDay={1}
        eventDisplay="block"
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        buttonText={{
          today: t("adminPage.calendar.today"),
          month: t("adminPage.calendar.month"),
          week: t("adminPage.calendar.week"),
          list: t("adminPage.calendar.list"),
        }}
      />
    </div>
  );
}