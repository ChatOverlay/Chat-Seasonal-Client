import moment from "moment-timezone";

//해당 시간표에 해당하는 시간인지 체크
export const isLectureInSession = (lectureTimes) => {
  if (!lectureTimes) return false; // Ensure lectureTimes is defined

  const scheduleMap = {
    1: "09:00-10:00",
    2: "10:00-11:00",
    3: "11:00-12:00",
    4: "12:00-13:00",
    5: "13:00-14:00",
    6: "14:00-15:00",
    7: "15:00-16:00",
    8: "16:00-17:00",
    9: "17:00-18:00",
    10: "18:00-19:00",
    11: "19:00-20:00",
    12: "20:00-21:00",
    13: "21:00-22:00",
  };
  const dayOfWeek = {
    월: "Monday",
    화: "Tuesday",
    수: "Wednesday",
    목: "Thursday",
    금: "Friday",
  };
  const currentKoreaTime = moment().tz("Asia/Seoul");

  return lectureTimes.split(",").some((time) => {
    const [day, period] = time.match(/(\D+)(\d+)/).slice(1);
    const today = dayOfWeek[day];
    const todayInKorea = currentKoreaTime.format("dddd");

    const [start, end] = scheduleMap[period].split("-");
    const startTime = moment.tz(
      `${currentKoreaTime.format("YYYY-MM-DD")} ${start}`,
      "Asia/Seoul"
    );
    const endTime = moment.tz(
      `${currentKoreaTime.format("YYYY-MM-DD")} ${end}`,
      "Asia/Seoul"
    );
    return (
      todayInKorea === today && currentKoreaTime.isBetween(startTime, endTime)
    );
  });
};
