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
import { PrismaService } from '../src/prisma/prisma.service';

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
   * - 
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
          .expectStatus(HttpStatus.OK)
      });
    });

    describe('Edit user', () => {
      it.todo('should be able to edit user');
    });
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {
      it.todo('should create a new bookmark');
    });

    describe('Get Bookmarks', () => {
      it.todo('should retrieve all bookmarks');
    });

    describe('Get Bookmark by ID', () => {
      it.todo('should retrieve single bookmark by ID');
    });

    describe('Edit Bookmark by ID', () => {
      it.todo('should edit a bookmark');
    });

    describe('Delete Bookmark by ID', () => {
      it.todo('should delete a bookmark');
    });
  });
});
