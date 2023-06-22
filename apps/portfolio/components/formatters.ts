const timeFormat = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

export const formatters = {
  date: (date: Date) => {
    return timeFormat.format(date);
  },
};
