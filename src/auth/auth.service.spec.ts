import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('Auth Test suite', () => {
    let Service: AuthService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthService],
        }).compile();

        Service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(Service).toBeDefined();
    });
});