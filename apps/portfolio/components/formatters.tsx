const timeFormat = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

// splits up "text" and creates a react bold tag for each pair of delimiters
const bold = (text: string, delimiter = "*") => {
  const parts = text.split(delimiter);
  const bolded = parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    }
    return <b key={index}>{part}</b>;
  });
  return <>{bolded}</>;
};

export const formatters = {
  date: (date: Date) => {
    return timeFormat.format(date);
  },
  bold,
};
