import { model, connect, connection } from 'mongoose'
import {
  PollDocument,
  pollSchema,
  StudentDocument,
  studentSchema
} from './schema'

export const PollModel = model<PollDocument>('Poll', pollSchema)
export const StudentModel = model<StudentDocument>('Student', studentSchema)

connect(process.env.MONGODB_URL).catch((err) => {
  throw err
})

export const db = connection
