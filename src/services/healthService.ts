import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { Empty } from '@proto-gen/google/protobuf/empty';
import { HealthCheckResponse, HealthServiceServer } from '@proto-gen/healthz';

export const healthServerImplementation: HealthServiceServer = {
  healthz: (_call: ServerUnaryCall<Empty, HealthCheckResponse>, callback: sendUnaryData<HealthCheckResponse>) => {
    callback(null, { status: 'Success' });
  },
};
