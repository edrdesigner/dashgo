import {
  createServer,
  Model,
  Factory,
  Response,
  ActiveModelSerializer,
} from 'miragejs';
import faker from 'faker';

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

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
      server.createList('user', 200);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 750; // api delay for testing

      this.get('/users', function (schema, request) {
        const { page = 1, per_page = 8 } = request.queryParams;

        const total = schema.all('user').length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const { users } = this.serialize(schema.all('user'));
        const sortedUsers = users.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        const parsedUsers = users ? sortedUsers.slice(pageStart, pageEnd) : [];

        return new Response(
          200,
          { 'x-total-count': String(total) },
          { users: parsedUsers }
        );
      });

      this.post('/users');
      this.get('/users/:id');
      this.namespace = ''; // back to original namespace because next has api either
      this.passthrough(); // if not detected pass to next
    },
  });

  return server;
}
