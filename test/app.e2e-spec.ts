import {
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum'; // request-making library, needs an API
import { setBaseUrl } from 'pactum/src/exports/request';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from '../src/bookmark/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

// describe comes from jest
describe('App e2e', () => {
  let app: INestApplication; // Interface to abstract the app
  let prisma: PrismaService;
  const apiPort = 3333;
  const baseUrl = `http://localhost:${apiPort}`;

  /**
   * To test WebSockets, from https://github.com/nestjs/docs.nestjs.com/issues/97
   *
   * See also:
   * - https://stackoverflow.com/questions/70395110/nestjs-websocket-how-to-test-and-debug-socket-hang-up
   */
  // import * as WebSocket from 'ws'
  // beforeAll(async () => {
  //   const moduleFixture = await Test.createTestingModule({
  //     imports: [
  //       SocketModule,
  //     ],
  //   })
  //     .compile()

  //   app = moduleFixture.createNestApplication()
  //   app.useWebSocketAdapter(new WsAdapter(app))
  //   await app.init()
  // })

  // it('should connect successfully', (done) => {
  //   const address = app.getHttpServer().listen().address()
  //   const baseAddress = `http://[${address.address}]:${address.port}`

  //   const socket = new WebSocket(baseAddress)

  //   socket.on('open', () => {
  //     console.log('I am connected! YEAAAP')
  //     done()
  //   })

  //   socket.on('close', (code, reason) => {
  //     done({ code, reason })
  //   })

  //   socket.on ('error', (error) => {
  //     done(error)
  //   })
  // })

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // Provided by nestjs
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication(); // Attempts to create an App from which we can test
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Strips out unwanted request elements from a dto
      }),
    );
    await app.init(); // Start the server
    await app.listen(apiPort); // Sets up the server for pactum to make requests

    prisma = app.get(PrismaService); // Generates a PrismaService for the tester
    await prisma.cleanDb(); // Restarts the test database

    pactum.request.setBaseUrl(baseUrl); // Will prepend it to all test requests
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@email.com',
      password: 'secret',
    };

    describe('Signup', () => {
      it.todo('should throw 400 if email empty');

      it('should throw 400 if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw 400 if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw 400 if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.CREATED);
        // .inspect(); // Logs the contents of the request
      });

      it('should throw 403 if credentials are taken', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(HttpStatus.FORBIDDEN);
      });
    });

    describe('Signin', () => {
      it('should throw 403 if email is not recognized', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: 'bad_email',
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw 400 if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw 403 if password is wrong', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
            password: 'bad_pass',
          })
          .expectStatus(HttpStatus.FORBIDDEN);
      });

      it('should throw 400 if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw 400 if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .stores('userToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get current user', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit user', () => {
      it('should edit current user', () => {
        const dto: EditUserDto = {
          firstName: 'Ismaboo',
          email: 'xXxDarkAngel69xXx@caramail.com',
        };

        return pactum
          .spec()
          .patch('/users/edit')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(dto)
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get an empty array of bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      it('should create a new bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'Sick website, bruh',
          link: 'https://localhost:3030/login',
          description: 'quite a nice bookmark',
        };

        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(HttpStatus.CREATED)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.description)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should get an array of bookmarks of size >= 1', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by ID', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by ID', () => {
      it('should edit a bookmark by id', () => {
        const dto: EditBookmarkDto = {
          title: 'Even sicker website, bruh',
          link: 'https://localhost:3030/loginer',
          description:
            'This is a longer description that should immediately pop up when you inspect the body of the request! Woooooooooooooooohooooooooooooooooo!',
        };

        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(HttpStatus.OK)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.description)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Delete bookmark by ID', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(HttpStatus.NO_CONTENT);
      });

      it('should get an empty bookmarks array', () => {
          return pactum
            .spec()
            .get('/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userToken}',
            })
            .expectStatus(HttpStatus.OK)
            .expectJsonLength(0);
      })
    });
  });
});
