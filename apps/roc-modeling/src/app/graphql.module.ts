import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from '@env/environment';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';


export function createApollo(httpLink: HttpLink): ApolloClientOptions<any>
{
  return {
    link: httpLink.create({ uri: environment.graphql }),
    cache: new InMemoryCache()
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
})
export class GraphQLModule { }
