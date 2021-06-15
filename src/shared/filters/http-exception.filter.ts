import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();
    const status = exception.getStatus();
    if (status === HttpStatus.UNAUTHORIZED) {
      if (typeof exception.response !== 'string') {
        exception.response['message'] =
          exception.response.message ||
          'You do not have permission to access this resource';
      }
    }
    res.status(status).json({
      statusCode: exception.getStatus(),
      error:
        exception.response.name || exception.response.error || exception.name,
      message:
        exception.response.message || exception.response || exception.message,
      errors: exception.response.errors || null,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null,
    });
  }
}
