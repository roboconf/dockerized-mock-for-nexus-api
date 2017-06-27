# Dockerized Mock for Nexus API

Building [Roboconf's Docker images](https://github.com/roboconf/roboconf-dockerfile) requires an internet connection to
retrieve the last artifacts from [Sonatype's OSS repository](https://oss.sonatype.org/). However,
there are times where we would like to use locally built Maven artifacts.

This project aims at mocking [Nexus' Core API](https://repository.sonatype.org/nexus-restlet1x-plugin/default/docs/index.html)
to download local Maven artifacts.  
The server can be launched manually with NodeJS or embedded in a Docker image.

> For the moment, only the
> [redirect operation](https://repository.sonatype.org/nexus-restlet1x-plugin/default/docs/path__artifact_maven_redirect.html)
> is implemented.  
> The **LATEST** value is not supported when resolving artifacts.


## Build it 

```
docker build -t roboconf/mock-for-nexus-api .
```

## Run it

```properties
# Add a volume to load the local Maven repository.
# The volume is read-only.
# Make the API available on the 9090 port.
# The container will run in background and be deleted automatically once stopped.
docker run -d --rm -p 9090:9090 -v /home/vzurczak/.m2:/home/maven:ro roboconf/mock-for-nexus-api
```

## Access the API

The API will be available by default at http://localhost:9090/redirect  
Example of GET request (to run in your web browser).

```
http://localhost:9090/redirect?g=net.roboconf&r=releases&a=roboconf-karaf-dist-dm&v=0.9-SNAPSHOT&p=tar.gz
```

## Run the Server without Docker

Assuming you have NodeJS installed...

```properties
# Start the server
npm start
```

... or...

```properties
# To start the server while watching file edition
npm run dev
```
