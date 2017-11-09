const fs = require('fs');

const grpc = require('grpc');

const descriptor = grpc.load(__dirname + '/test.proto');

const server = new grpc.Server();
server.addService(descriptor.Test.service, {
  test: (call, callback) => {
    callback(null, {success: true})
  }
});

server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();

const client = new descriptor.Test('linkerd:4145', grpc.credentials.createInsecure());

const TEST_LENGTHS = [
  10000,
  50000,
  65000,
  65536,
  100000,
  200000
]

setTimeout(() => {
  TEST_LENGTHS.forEach(function (count) {
    console.log('SENDING REQUEST', count);
    client.test({patch: {value: 'a'.repeat(count)}}, function (err) {
      if (err) {
        console.error(err, count);
      } else {
        console.log('success', count);
      }
    });
  });
}, 10000);
