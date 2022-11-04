import { Poll } from '../db/schema'
import { PollModel, StudentModel } from '../db/mogoose'
import { io } from '../socket'
import { client } from '../redis'
import { customAlphabet } from 'nanoid/async'
import { pollResult } from './socketController'
import { AggregatedStudent } from '../types/pollController.types'
const nanoid = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890', 6)

// set poll code expiry to 1 day
const expiry = 60 * 60 * 24

async function createPoll (poll: Poll) {
  if (!poll.courseCode) { return { status: 400, data: { message: 'courseCode is required' } } }
  const promise = [nanoid(), PollModel.create(poll)] as const
  const result = await Promise.all(promise)
  const pollId = result[1]._id.toString()
  const pollCode = result[0]
  await client.set(pollCode, pollId, { EX: expiry, NX: true })

  return { status: 201, data: { pollCode, pollId } }
}

async function changePollStatus (pollId: string, hasStarted: boolean) {
  if (typeof hasStarted !== 'boolean') {
    return {
      status: 400,
      data: { message: 'hasStarted should be boolean' }
    }
  }
  const currSequence = await client.get(pollId)
  console.log('currSequence', currSequence)
  let newSequence
  // on every new start increment the sequence counter
  if (hasStarted) {
    if (currSequence == null) newSequence = 0
    else newSequence = parseInt(currSequence)
    if (newSequence < 0) newSequence *= -1
    newSequence++
    console.log('newSequence', newSequence)
    await client.set(pollId, newSequence.toString(), {
      EX: expiry
    })
    const result = await pollResult(pollId, newSequence)
    io.to(pollId).emit('result', result)
  } else {
    // for every stop make the current counter negative to indicate that it is not an active sequence
    if (currSequence != null) {
      newSequence = parseInt(currSequence) * -1
      await client.set(pollId, newSequence.toString(), {
        EX: expiry
      })
    }
  }

  io.to(pollId).emit('pollStarted', hasStarted)

  return { status: 200, data: { message: 'poll status successfully changed' } }
}

async function getStudents (courseCode: string, startTime: Date, endTime: Date) {
  // TODO Already addressed in TODO bellow
  // eslint-disable-next-line no-useless-catch
  try {
    const pollDoc = await PollModel.find({ courseCode })
    const promises: Promise<AggregatedStudent | void>[] = []
    const responses: AggregatedStudent[] = []
    pollDoc.forEach((element) => {
      promises.push(
        StudentModel.aggregate<AggregatedStudent>([
          {
            $match: {
              pollId: element._id.toString(),
              timestamp: { $gte: startTime, $lte: endTime }
            }
          },
          {
            $project: {
              _id: 0,
              pollId: 1,
              courseCode,
              sequence: 1,
              utorid: 1,
              timestamp: {
                $dateToString: {
                  date: '$timestamp',
                  timezone: 'America/Toronto'
                }
              },
              pollName: element.name,
              description: element.description,
              answer: 1
            }
          }
        ]).then((data) => {
          data.forEach((val) => {
            responses.push(val)
          })
        })
      )
    })
    await Promise.all(promises)
    console.log(responses)
    return { responses }
  } catch (err) {
    /**
     * TODO: Add error handler
     */
    throw err
  }
}

async function getPollStatus (pollId: string) {
  if (pollId.trim().length === 0) { return { status: 400, data: { message: 'Invalid poll Id' } } }
  const result = await client.get(pollId)
  const pollStarted = result === null ? false : parseInt(result) > 0
  return { status: 200, data: { pollStarted } }
}

async function getResult (pollId: string) {
  if (pollId.trim().length === 0) { return { status: 400, data: { message: 'Invalid poll Id' } } }
  const currSequence = await client.get(pollId)
  const result = await pollResult(pollId, parseInt(currSequence))
  return { status: 200, data: { ...result } }
}

async function endForever (pollCode: string) {
  if (pollCode === null || pollCode === undefined) { return { status: 400, data: { message: 'Invalid poll code' } } }
  const pollId = await client.get(pollCode)
  await Promise.all([client.del(pollCode), client.del(pollId)])
  io.to(pollId).emit('end', true)
  io.of('/').in(pollId).disconnectSockets()
  return { status: 200, data: { message: 'Poll closed' } }
}

export {
  createPoll,
  changePollStatus,
  getStudents,
  getPollStatus,
  getResult,
  endForever
}
