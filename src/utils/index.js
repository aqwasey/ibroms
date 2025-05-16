import dayjs from "dayjs";

export const formatDate = (date, format = 'MMM YYYY')=> {
  if (date) {
    return dayjs(date).format(format)
  }

  return null
}
