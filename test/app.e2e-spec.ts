import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

// describe comes from jest
describe('App e2e', () => {
  let app: INestApplication; // Interface o abstract the app
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ // Provided by nestjs
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication(); // Attempts to create an App from which we can test
    app.useGlobalPipes( 
      new ValidationPipe({
        whitelist: true, // Strips out unwanted request elements from a dto
      })
    )
    await app.init(); // Start the server
  });

  afterAll(() => {
    app.close();
  });
  
  
  
  it.todo('should pass');
});
