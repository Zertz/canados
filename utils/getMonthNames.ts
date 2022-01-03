const monthFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
});

export function getMonthNames() {
  const monthNames: string[] = [];

  for (let i = 0; i < 12; i += 1) {
    const date = new Date(
      `2017-${`${i + 1}`.padStart(2, "0")}-01T12:00:00.000Z`
    );

    const month = monthFormatter.format(date);

    monthNames.push(month);
  }

  return monthNames;
}
