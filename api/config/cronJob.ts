import { CronJob } from "cron";
import { deleteExpiredSessions } from "../utils/prismaHelper";

export default function initCronJob() {
  console.log("cron job initialized");

  const job = new CronJob(
    "0 0 * * *", // cronTime
    async function () {
      await deleteExpiredSessions();
    }, // onTick
    null, // onComplete
    true, // start
    "Asia/Kolkata" // timeZone
  );
  job.errorHandler = (error) => {
    console.log(error);
  };
}
