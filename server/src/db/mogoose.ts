import { model, connect, connection } from 'mongoose'
import {
  PollDocument,
  pollSchema,
  StudentDocument,
  studentSchema
} from './schema'

export const PollModel = model<PollDocument>('Poll', pollSchema)
export const StudentModel = model<StudentDocument>('Student', studentSchema)

export async function connectMongo () {
  await connect(process.env.MONGODB_URL)
  db.on('open', () => {
    console.log('Connected to mongo')
  })
}

export const db = connection
