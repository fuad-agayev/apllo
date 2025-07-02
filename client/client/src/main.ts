
import { createApp, provide, h } from 'vue'
import App from './App.vue'

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

const httpLink = createHttpLink({
  uri: 'http://localhost:9002/graphql' // Apollo Server URL
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})



createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
}).mount('#app')
