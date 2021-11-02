import { createServer, Model, Factory } from 'miragejs';
import faker from 'faker';

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    models: {
      user: Model.extend<Partial<User>>({}),
    },

    factories: {
      user: Factory.extend({
        name() {
          return faker.name.firstName();
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(server) {
      server.createList('user', 6);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750; // api delay for testing

      this.get('/users');
      this.post('/users');

      this.namespace = ''; // back to original namespace because next has api either
      this.passthrough(); // if not detected pass to next
    },
  });

  return server;
}
