import { client } from "../redis";

async function getUser(utorid: string | undefined) {
  if (!utorid)
    return { status: 400, data: { message: "Invalid utorid" } };
  let userType = await client.get(utorid);
  if (userType == null) userType = "student";
  return { status: 200, data: { userType } };
}

export { getUser };
