import { Poll } from "../db/schema";
import { PollModel } from "../db/mogoose";
import { io } from "../socket";
import { client } from "../redis";

// set poll code expiry to 1 day
const expiry = 60 * 60 * 24;

// generate a random number between min to max
function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// generate a random sequence of characters of given len
function randomFiller(len: number) {
  let char = "QWERRTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  let filler = "";
  for (let i = 0; i < len; i++) {
    filler += char.charAt(Math.floor(Math.random() * char.length));
  }
  return filler;
}

const shift = randomNumber(10000, 999999);
const filler = randomFiller(6);

/**
 * Generate a random unique 6 digit key
 * Gets a random number between 0 to 999983, pads from the left using the random filler to have a constant lenght of 6
 * Checks whether the generated string is unique or not. If not unique add random shift to the original
 * random number and pad it again. Keep on doing this until we get a unique key. *
 */
async function generateKeys() {
  //999983 is a prime number so mod should produce fairly distributed keys
  let key = randomNumber(0, 999983);
  let paddedKey = (filler + key).slice(-1 * filler.length);
  let value = await client.get(paddedKey);
  while (value !== null) {
    key = (key + shift) % 999983;
    paddedKey = (filler + key).slice(-1 * filler.length);
    value = await client.get(paddedKey);
  }
  return paddedKey;
}

async function createPoll(poll: Poll) {
  try {
    /**
     * TODO: Add input validation
     * check course code string format
     */
    const promise = [generateKeys(), PollModel.create(poll)] as const;
    const result = await Promise.all(promise);
    const pollId = result[1]["_id"].toString();
    const pollCode = result[0];
    await client.set(pollCode, pollId, { EX: expiry, NX: true });

    return { pollCode, pollId };
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function changePollStatus(pollId: string, hasStarted: boolean) {
  try {
    await client.set(pollId, hasStarted.toString(), {
      EX: expiry,
    });
    io.to(pollId).emit("pollStarted", hasStarted);
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err;
  }
}

async function getStudents(courseCode: string, startTime: Date, endTime: Date){
  try {
    let responseArray: { pollID: any; pollName: string; courseCode: string; utorid: string; answer: number; timestamp: Date; }[] = [];

    const result = await Promise.all([PollModel.find({"courseCode": courseCode})]);
    result[0].forEach((poll) => {
      poll.students.forEach((student) => {
        if((student.timestamp.getTime() >= startTime.getTime()) && (student.timestamp.getTime() <= endTime.getTime())){
          const studentResponse = {
            pollID: poll._id.toString(),
            pollName: poll.name,
            courseCode: poll.courseCode,
            utorid: student.utorid,
            answer: student.answer,
            timestamp: student.timestamp
          };
          responseArray.push(studentResponse);
        }
      });
    });
    return {responses: responseArray};
    
  } catch (err) {
          /**
     * TODO: Add error handler
     */
    throw err;
    }
}

export { createPoll, changePollStatus, getStudents };
