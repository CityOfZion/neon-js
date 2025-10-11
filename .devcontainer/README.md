# Using docker compose
Start the image for use with the integration tests using
```shell
docker compose up
```
Shutting down takes another step beyond `ctrl-c` to properly clean up to allow running the integration tests again.
Run
```shell
docker compose down -v
```
