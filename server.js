import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer  }  from '@apollo/server/standalone';

//import db from '_db.js'
// import typeDefs from './schema.js';

import axios from 'axios';
const BASE_URL = 'http://localhost:5001';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), 'utf-8')

const resolvers = {
Query: {
    games: async () => (await axios.get(`${BASE_URL}/games`)).data,
    game: async (_, { id }) => (await axios.get(`${BASE_URL}/games/${id}`)).data,
    authors: async () => (await axios.get(`${BASE_URL}/authors`)).data,
    author: async (_, { id }) => (await axios.get(`${BASE_URL}/authors/${id}`)).data,
    reviews: async () => (await axios.get(`${BASE_URL}/reviews`)).data,
    review: async (_, { id }) => (await axios.get(`${BASE_URL}/reviews/${id}`)).data
  },

  Game: {
    reviews: async (parent) => {
      const reviews = await axios.get(`${BASE_URL}/reviews`)
      return reviews.data.filter(r => r.game_id === parent.id)
    }
  },

  Author: {
    reviews: async (parent) => {
      const reviews = await axios.get(`${BASE_URL}/reviews`)
      return reviews.data.filter(r => r.author_id === parent.id)
    }
  },

  Review: {
    author: async (parent) => (await axios.get(`${BASE_URL}/authors/${parent.author_id}`)).data,
    game: async (parent) => (await axios.get(`${BASE_URL}/games/${parent.game_id}`)).data
  },

  Mutation: {
    addGame: async (_, { game }) => {
      const newGame = { ...game, id: Math.floor(Math.random() * 10000).toString() }
      const res = await axios.post(`${BASE_URL}/games`, newGame)
      return res.data
    },
    deleteGame: async (_, { id }) => {
      await axios.delete(`${BASE_URL}/games/${id}`)
      return (await axios.get(`${BASE_URL}/games`)).data
    },
    updateGame: async (_, { id, editGame }) => {
      await axios.patch(`${BASE_URL}/games/${id}`, editGame)
      return (await axios.get(`${BASE_URL}/games/${id}`)).data
    }
  }
}



const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: {port: 9002}
})

console.log(`Server ready at port: ${url}`)