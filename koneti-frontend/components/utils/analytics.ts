// Prilagođeni GA event tracker
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// Primeri specifičnih event-a
export const analytics = {
  trackPageView: (path: string, title: string) => {
    trackEvent('page_view', {
      page_path: path,
      page_title: title,
    });
  },

  trackReservation: (reservationType: string, value: number) => {
    trackEvent('add_to_cart', {
      items: [
        {
          item_name: reservationType,
          value: value,
        },
      ],
    });
  },

  trackMenuClick: (drinkName: string, category: string) => {
    trackEvent('view_item', {
      items: [
        {
          item_name: drinkName,
          item_category: category,
        },
      ],
    });
  },

  trackContactForm: (formType: string) => {
    trackEvent('contact', {
      type: formType,
    });
  },

  trackCareerApplication: (position: string) => {
    trackEvent('career_apply', {
      position: position,
    });
  },
};