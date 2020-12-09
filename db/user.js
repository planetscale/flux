import executeQuery from "./db";
import moment from 'moment';

export async function createUser({ userName, displayName, isAdmin }) {
    const creationTime = moment().format( 'YYYY-MM-DD HH:mm:ss');

    try {
        return await executeQuery({
            query: 'INSERT INTO user (username, display_name, creation_time, admin) VALUES (?, ?, ?, ?)',
            values: [userName, displayName, creationTime, isAdmin]
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getUser({ email }) {
    try {
        const result = await executeQuery({
            query: 'SELECT * FROM user WHERE email = ?',
            values: [email],
        });

        return result[0];
    } catch (error) {
        console.log(error);
    }
}

export async function getUsersForOrg({ orgId }) {
    try {
        return await executeQuery({
            query: 'SELECT * FROM user WHERE org_id = ?',
            values: [orgId],
        });
    } catch (error) {
        console.log(error);
    }
}