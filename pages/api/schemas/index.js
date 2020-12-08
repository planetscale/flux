import  {  gql  }  from  "apollo-server-micro";

export  const  typeDefs  =  gql`
    type Org {
        id: ID!
        name: String!
        creation_time: String!
    }
    
    type  Member {
        id: ID!
        username: String!
        display_name: String!
        org: String!
        creation_time: String!
        admin: Boolean!
    }
    
    type Lens {
        id: ID!
        name: String!
        description: String
        organization: String!
    }
    
    type Post {
        id: ID!
        member: String!
        lens: String!
        creation_time: String!
        description: String
        content: String!
    
    type Reply {
        id: ID!
        post_id: ID!
        member: String!
        creation_time: String!
        content: String!
    }
    `