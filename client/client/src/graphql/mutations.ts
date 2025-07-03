import gql from 'graphql-tag'

export const ADD_GAME = gql`
  mutation($game: addGameInput!) {
    addGame(game: $game) {
      id
      title
      platform
    }
  }
`

export const DELETE_GAME = gql`
  mutation DeleteGame($id: ID!) {
    deleteGame(id: $id) {
      id
    }
  }
`



export const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $editGame: EditGameInput!) {
    updateGame(id: $id, editGame: $editGame) {
      id
      title
      platform
    }
  }
`
