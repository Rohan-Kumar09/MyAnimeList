### Fetch API: [https://graphql.anilist.co](https://graphql.anilist.co)

### Test Environment: [https://studio.apollographql.com/sandbox/explorer](https://studio.apollographql.com/sandbox/explorer)

```graphql
query PageQuery($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        medium
      }
      description
      episodes
    }
  }
}
```