import executeQuery from "./db";
import moment from 'moment';

export async function createOrg({ orgName }) {
    const creationTime = moment().format( 'YYYY-MM-DD HH:mm:ss');

    try {
        return await executeQuery({
            query: 'INSERT INTO org (name, creation_time) VALUES (?, ?)',
            values: [orgName, creationTime]
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