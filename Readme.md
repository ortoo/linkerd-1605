# Outline

## Running
`docker-compose up`

## Scenario
Nodejs grpc client and server, linkerd with two routers: `incoming-grpc` (port 4138) which forwards grpc traffic onto the node grpc client and `grpc` (port 4145) which forwards traffic onto the linkerd `incoming-grpc` router (linkerd-linkerd simulation).

`tester/index.js` Contains a test script, setting up a grpc server, waiting 10s and then running a sequence of requests with different sized payloads (see `TEST_LENGTHS` in that file) against the destination coded on line 17 (could be either itself or either of the linkerd routers).

The `test` container logs when sending the request (and the rough size) and when receiving. I.e.

```
test_1     | SENDING REQUEST 10000
test_1     | SENDING REQUEST 50000
test_1     | SENDING REQUEST 65000
test_1     | SENDING REQUEST 65536
test_1     | SENDING REQUEST 100000
test_1     | SENDING REQUEST 200000
test_1     | success 10000
test_1     | success 50000
test_1     | success 65000
```

## Notes
`node -> incoming-grpc -> node`

With no initialStreamWindowBytes in the config then anything over ~64KB hangs. Explicitly adding in a `initialStreamWindowBytes: 65536` (even of 64KB) then no hanging.

`node -> grpc -> incoming-grpc -> node`

Putting initialStreamWindowBytes in seems to make no difference. It still hangs.
