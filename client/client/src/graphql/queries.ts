import gql from 'graphql-tag'

export const GET_GAMES = gql`
  query {
    games {
      id
      title
      platform
    }
  }
`
