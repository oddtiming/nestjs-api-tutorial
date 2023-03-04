import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Exposes Express Request
    // const request = ctx.switchToWs().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
