---
title: "OCI - manage containers via runc"
date: "2024-12-12"
excerpt: "This blog introduces how to manage containers via runc."
published: true
tags: ["container", "runc"]
---

## Preface

The Open Container Initiative (OCI) defines open industry standards for containers.
OCI currently includes three specifications:

- Runtime Specification ([runtime-spec](https://github.com/opencontainers/runtime-spec/tree/main))
- Image Specification ([image-spec](https://github.com/opencontainers/image-spec))
- Distribution Specification ([distribution-spec](https://github.com/opencontainers/distribution-spec))

I will introduce the three OCI specifications in a series of articles, along with
related software and tools, such as the widely used container runtime **runc**.
This article is the second in the series, where we will actually use runc to
manage a container. For some important concepts about the runtime-spec, see the
first article: [*OCI - runtime spec introduction*](/blog/intro-oci-runc).

## Overview

In this article, we will design a container that contains a "hello-world" main
program, as well as a `createContainer` hook and a `postStop` hook. The main
program source code is as follows. The hooks are implemented using the existing
Linux `touch` command. They respectively create the files `/tmp/createContainerHook`
and `/tmp/postStopHook`.

```golang
package main

import (
  "fmt"
  "time"
)

func main() {
  fmt.Println("Hello World")
  time.Sleep(10 * time.Second)
}
```

The main operations covered in this article include:

- Preparing the filesystem bundle
- Using runc to create a container
- Using runc to start a container
- Using runc to delete a container

## Preparing the Filesystem Bundle

In the first article, we mentioned that an OCI container runtime (such as runc)
creates containers based on a directory called a **filesystem bundle**. A
filesystem bundle is essentially a directory containing two things: a configuration
file called `config.json` and a container root filesystem. A bundle can be converted
from a container image, or it can be manually created from scratch. In real use
cases, bundles are usually generated from images by software such as containerd.
Here, however, we will build one manually to show that it is not so mysterious.

1. First, create the filesystem bundle directory:

```sh
$ mkdir -p /tmp/filesystem-bundle-demo
```

2. Next, prepare the container root filesystem and copy our hello-world program
into the proper location:

```sh
$ cd /tmp/filesystem-bundle-demo
$ mkdir -p rootfs/usr/local/bin/
# Copy the binary into "/usr/local/bin". The structure is:
$ tree .
.
└── rootfs
    └── usr
        └── local
            └── bin
                ├── hello-world
```

3. Then generate a default `config.json` with runc and modify it accordingly.
The modifications mainly include changing the container startup command to our
`hello-world` program and adding hook configurations. Note that hook commands
run **on the host**, not inside the bundle. Hooks often perform tasks that modify
the container’s filesystem bundle, so they are external. The modified file looks
like this (note some content are removed for brevity):

```json
$ runc spec --rootless
# Edit config.json to change startup command and add hooks, final content:
$ cat config.json
{
  "ociVersion": "1.0.2-dev",
  "hooks": {
    "createContainer": [
      {
        "path": "/usr/bin/touch",
        "args": ["touch", "/tmp/createContainerHook"]
      }
    ],
    "postStop": [
      {
        "path": "/usr/bin/touch",
        "args": ["touch", "/tmp/postStopHook"]
      }
    ]
  },
  "process": {
    "terminal": false,
    "user": {
      "uid": 0,
      "gid": 0
    },
    "args": [
      "hello-world"
    ],
    "env": [
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "TERM=xterm"
    ],
    "cwd": "/",
    "capabilities": {
      "bounding": [
        "CAP_AUDIT_WRITE",
        "CAP_KILL",
        "CAP_NET_BIND_SERVICE"
      ],
      "effective": [
        "CAP_AUDIT_WRITE",
        "CAP_KILL",
        "CAP_NET_BIND_SERVICE"
      ],
      "permitted": [
        "CAP_AUDIT_WRITE",
        "CAP_KILL",
        "CAP_NET_BIND_SERVICE"
      ],
      "ambient": [
        "CAP_AUDIT_WRITE",
        "CAP_KILL",
        "CAP_NET_BIND_SERVICE"
      ]
    },
    "rlimits": [
      {
        "type": "RLIMIT_NOFILE",
        "hard": 1024,
        "soft": 1024
      }
    ],
    "noNewPrivileges": true
  },
  "root": {
    "path": "rootfs",
    "readonly": true
  },
  "hostname": "runc",
  "linux": {
    "uidMappings": [
      {
        "containerID": 0,
        "hostID": 1001,
        "size": 1
      }
    ],
    "gidMappings": [
      {
        "containerID": 0,
        "hostID": 1001,
        "size": 1
      }
    ],
    "maskedPaths": [
      "/proc/acpi",
      "/proc/asound",
      "/proc/kcore",
      "/proc/keys",
      "/proc/latency_stats",
      "/proc/timer_list",
      "/proc/timer_stats",
      "/proc/sched_debug",
      "/sys/firmware",
      "/proc/scsi"
    ]
  }
}
```

At this point, we have prepared the so-called filesystem bundle. You can see that
it contains very little — just our statically compiled hello-world binary in the
root filesystem.

## Creating a Container with runc

With the filesystem bundle ready, we can create a container. The following commands
create the container and check its state. We see the container in the `created`
state, and the file `/tmp/createContainerHook` exists while `/tmp/postStopHook`
does not, meaning the `createContainer` hook was executed at container creation,
but the `postStop` hook was not. This is as expected.

Also, from the `tree` command output, we see that extra directories like `dev`,
`proc`, and `sys` appear inside the container root filesystem. These are mounts
that runc sets up by default, as specified in the default `config.json`.

```sh
$ runc create --bundle ./ demo
$ runc list
ID          PID         STATUS      BUNDLE                        CREATED                          OWNER
demo        1928558     created     /tmp/filesystem-bundle-demo   2024-12-12T06:35:03.212069773Z   *
$ runc state demo
{
  "ociVersion": "1.0.2-dev",
  "id": "demo",
  "pid": 1928558,
  "status": "created",
  "bundle": "/tmp/filesystem-bundle-demo",
  "rootfs": "/tmp/filesystem-bundle-demo/rootfs",
  "created": "2024-12-12T06:35:03.212069773Z",
  "owner": ""
$ ls /tmp/{createContainerHook,postStopHook}
ls: cannot access '/tmp/postStopHook': No such file or directory
/tmp/createContainerHook
$ tree .
.
├── config.json
└── rootfs
    ├── dev
    ├── proc
    ├── sys
    └── usr
        └── local
            └── bin
                └── hello-world
```

## Starting a Container with runc

After creation, we can start the container, which actually runs the user program.
We see our hello-world program running and printing `Hello World`. If you watch
closely, the container status first becomes `running`, then `stopped`, corresponding
to the execution and exit of the program.

At this stage, the `postStop` hook has still not been executed.

```sh
$ runc start demo
 Hello World
$ runc list
ID          PID         STATUS      BUNDLE                        CREATED                          OWNER
demo        0           stopped     /tmp/filesystem-bundle-demo   2024-12-12T06:35:03.212069773Z   *
$ runc state demo
{
  "ociVersion": "1.0.2-dev",
  "id": "demo",
  "pid": 0,
  "status": "stopped",
  "bundle": "/tmp/filesystem-bundle-demo",
  "rootfs": "/tmp/filesystem-bundle-demo/rootfs",
  "created": "2024-12-12T06:35:03.212069773Z",
  "owner": ""
}
$ ls /tmp/{createContainerHook,postStopHook}
ls: cannot access '/tmp/postStopHook': No such file or directory
/tmp/createContainerHook
```

## Deleting a Container with runc

Finally, when we no longer need the container, we can delete it. At this point,
the `postStop` hook gets executed:

```sh
$ runc delete demo
$ ls /tmp/{createContainerHook,postStopHook}
/tmp/createContainerHook  /tmp/postStopHook
```

## Summary

This article demonstrated, through a simple example using runc, how containers
are managed at the OCI runtime layer. Of course, this was just the basic flow,
meant to give you an initial understanding. Advanced topics will be covered in
later articles. If you’re unclear on concepts such as filesystem bundles or hooks,
refer to [*OCI - runtime spec introduction*](/blog/intro-oci-runc).

If you’re using other OCI-compliant runtimes such as **crun** or **youki**, you
can try similar steps.

## References

- [runtime-spec](https://github.com/opencontainers/runtime-spec/tree/main)
- [runc](https://github.com/opencontainers/runc)
- [crun](https://github.com/containers/crun)
- [youki](https://github.com/youki-dev/youki)
