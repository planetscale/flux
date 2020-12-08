import { getUser } from '../db/user'

export const resolvers = {
    Query: {
        async user(){
            return getUser("testemail@planetscale.com")
        }
    },

    /*
    Mutation: {
        async createUser(args){
            const user = await createMember(args.input)
        }
    }
     */
}