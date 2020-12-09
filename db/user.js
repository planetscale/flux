import executeQuery from "./db";

export async function getUser({ email }) {
    try {
        const result = await executeQuery({
            query: 'SELECT * FROM member WHERE email = ?',
            values: [ email ],
        });
        return result[0];
    } catch (error) {
        console.log(error);
    }
}

/*
export async function createUser({  }) {

}
 */