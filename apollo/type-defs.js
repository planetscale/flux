import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
    type Org {
        id: ID!
        name: String!
        creation_time: String!
        users: [User]!
    }
    
    type  User {
        id: ID!
        email: String!
        username: String!
        display_name: String!
        org: Org!
        creation_time: String!
        admin: Boolean!
        posts: [Post]
    }
    
    type Lens {
        id: ID!
        name: String!
        description: String
        organization: Org!
    }
    
    type Post {
        id: ID!
        author: User!
        lens: Lens!
        creation_time: String!
        description: String
        content: String!
    
    type Reply {
        id: ID!
        post: Post!
        author: User!
        creation_time: String!
        content: String!
    }
    `;
