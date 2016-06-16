var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'https://fgNp5QS0WYObPadXq3BAAdC7X53eNkKu:@ayushmittal.east-us.azr.facetflow.io',
  apiVersion: '1.0'
});

client.index({
              index: 'my_index',
              type: 'posts',
              id: '1',
              body: {
              user: 'me',
              post_date: new Date(),
              message: 'trying out facetflow'
            }
  }).then(function() {
      client.indices.refresh(function() {
        // Execute a search using the connection from above.

        client.search({
                        index: 'my_index',
                        type: 'posts',
                        body: {
                          query: {
                            filtered: {
                              query: {
                                query_string: {
                                  query: 'trying out facetflow'
                                }
                              },
                              filter: {
                                term: { user: 'me' }
                              }
                            }
                          }
                        }
        }).then(function(result) {
          console.log(JSON.stringify(result));
      });
  });
});
