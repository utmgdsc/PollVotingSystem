import { UserType } from '../types/user.types'
import { client } from '../redis'

async function getUser (utorid: string): Promise<{ status: number; data: {
  message?: string,
  userType?: UserType
}}> {
  if (utorid.trim().length === 0) { return { status: 400, data: { message: 'Invalid utorid' } } }
  let userType = await client.get(utorid) as UserType
  if (userType == null) userType = UserType.STUDENT
  return { status: 200, data: { userType } }
}

export { getUser }
