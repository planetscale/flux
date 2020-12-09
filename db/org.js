import executeQuery from './db';
import { DateTime } from 'luxon';

export async function createOrg({ orgName }) {
  const creationTime = DateTime.local().toString();

  try {
    return await executeQuery({
      query: 'INSERT INTO org (name, creation_time) VALUES (?, ?)',
      values: [orgName, creationTime],
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getOrg({ orgName }) {
  try {
    const result = await executeQuery({
      query: 'SELECT * FROM org WHERE name = ?',
      values: [orgName],
    });

    return result[0];
  } catch (error) {
    console.log(error);
  }
}
