---
title: "OCI - runtime spec introduction"
date: "2024-11-06"
excerpt: "This blog introduces runtime specification of OCI."
published: true
tags: ["OCI", "runc", "container"]
---


## Preface

The Open Container Initiative (OCI) defines open industry standards for containers.
OCI currently includes three specifications:

- Runtime Specification ([runtime-spec](https://github.com/opencontainers/runtime-spec/tree/main))
- Image Specification ([image-spec](https://github.com/opencontainers/image-spec))
- Distribution Specification ([distribution-spec](https://github.com/opencontainers/distribution-spec))

I will introduce the three OCI specifications in a series of articles, along with
related software and tools, such as the widely used container runtime **runc**.
This article will introduce some important concepts in the Runtime Specification (runtime-spec).

## Overview

The OCI Runtime Specification aims to define the configuration, execution environment,
and lifecycle of containers. A container’s configuration is defined in a file called
`config.json`. The configuration consists of a general section and a platform-specific
section. The general section refers to configuration items that are the same across
all platforms, while the platform-specific section contains configurations unique
to each platform (e.g., Linux-specific or Windows-specific settings). The execution
environment ensures that applications inside containers have a consistent runtime
across different runtimes (such as runc, crun, youki) and different environments.

## Filesystem Bundle

The input to a container runtime is something called a **filesystem bundle**, not
the more familiar container image. The relationship between the two will be covered
in a later article about the OCI Image Specification. For now, we need to understand
that a filesystem bundle is a set of files organized in a certain structure. A
bundle mainly contains the following two components:

```sh
# 'config.json' file contains all container configuration. This file must be
# located at the top level of the bundle directory and must be named config.json.
config.json
# The 'rootfs' directory is container’s root filesystem. It is specified by
# root.path in config.json. Here we assume root.path="rootfs".
rootfs
```

In later articles, I will explain how to build a filesystem bundle from scratch
and how to convert from a container image to a bundle.

The `config.json` file contains various configurations for the container. The
following table shows only a very small portion. Users rarely need to worry about
these directly because they are usually generated and wrapped by higher-level
tools. The table is just to give you a rough idea. For detailed configuration,
see: https://github.com/opencontainers/runtime-spec/blob/main/config.md.

![runtime config](/images/runc-cfg.png)

## The Five Principles of a Standard Container

![runc-5p](/images/runc-5p.png)

The five principles of a **Standard Container** are shown in the diagram above.
Below are some details:

1. A Standard Container defines a set of standard operations. Any OCI-compliant
container runtime must support these operations.
2. All standard operations must behave consistently, regardless of the software
running inside the container.
3. A Standard Container must be able to run on any platform supported by OCI.
4. A Standard Container is automation-friendly. Since it provides standard
operations, an encapsulated environment, and platform independence, it is
naturally suitable for integration into automated workflows.
5. A Standard Container enables production-quality delivery.

## The Lifecycle of a Standard Container

The lifecycle of a container is roughly as shown in the diagram below. Blue
steps represent commands issued by the user to the OCI runtime (such as runc).
Yellow steps represent internal runtime actions triggered by those commands.
In real applications, the “user” here is not an individual but higher-level
software — most commonly container runtimes compatible with the Kubernetes
Container Runtime Interface (CRI), such as containerd or cri-o. Future articles
will explain CRI and its relationship with OCI.

- **Step 1:** The user issues a command to create a container: `runc create <id> <path>`.
Here, `id` is the container identifier, and `path` points to the filesystem bundle.
- runc creates the container runtime environment based on `config.json` in the
bundle. It then sequentially calls the `prestart` hook, the `createRuntime` hook,
and the `createContainer` hook. Actions like mounting files or devices into the
container environment happen in these hooks.
- **Step 2:** After creating the container, the user issues a start command: `runc start <id>`.
- runc calls the `startContainer` hook, starts the user-specified program, then
calls the `poststart` hook. At this point, the user’s program is actually running.
- **Step 3:** When the container is no longer needed, the user deletes it with: `runc delete <id>`.
- runc tears down the container environment and calls the `poststop` hook.

![ctr lifecycle](/images/ctr-lifecycle.png)

## Summary

This article introduced some important concepts from OCI’s Runtime Specification
(runtime-spec). In the next article, we will walk through step by step how to
configure and start an OCI container with runc.

## References

- [runtime-spec](https://github.com/opencontainers/runtime-spec)
- [image-spec](https://github.com/opencontainers/image-spec)
- [distribution-spec](https://github.com/opencontainers/distribution-spec)
- [runtime configuration](https://github.com/opencontainers/runtime-spec/blob/main/config.md)
