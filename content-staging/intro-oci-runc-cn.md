## 前言

Open Container Initiative (OCI) 定义了容器(container)的行业开放标准。OCI 现在包括了三个标准：

- 运行时标准: the Runtime Specification (runtime-spec)
- 容器镜像标准: the Image Specification (image-spec)
- 发布标准: the Distribution Specification (distribution-spec)

我将用一个系列的文章介绍 OCI 的三个标准，以及相关的软件，工具，比如广泛使用的容器运行时 runc。本篇文章将介绍容器运行时标准 (runtime-spec) 中一些重要的概念。

## 概览

OCI Runtime Specification 旨在定义容器的配置、执行环境和生命周期。容器的配置定义在一个叫 
config.json 的文件中。配置分为通用部分和平台特殊部分，通用部分指那些在所有平台上都一样的的配置项，
平台特殊配置指每个平台特有的配置，比如Linux专有的配置或Windows专有的配置等。
执行环境使容器内应用在不同容器运行时 (比如 runc, crun, youki) ，不同环境下都拥有一致性的运行环境。

## Filesystem Bundle

容器运行时 (runtime) 的输入是一个叫 "filesystem bundle" 的东西，而不是我们熟悉的 container
image。两者之间的关系会在后续介绍 OCI Image Specification的文章中覆盖。在此，我们需要了解
"filesystem bundle" 是一组文件按一定格式的组合。Filesystem bundle 主要包含如下两部分：

```
config.json # 包含了容器所有的配置。该文件一定要放在 bundle 目录的顶层并且名字为 config.json。
rootfs # 容器的根文件系统。由config.json中的root.path指定，此处假设 root.path="rootfs"。
```

我会在后续文章中讲解如何从零构建一个 filesystem bundle 以及如何从一个容器镜像转换到 filesystem bundle。

"config.json" 中包含了容器的各种配置，下面的表格展示了其中很小一部分内容。这块配置用户往往很少
需要关心，因为基本都是会被上层工具在此封装。表格主要是给大家一个直观的概念。"config.json"中详细
的配置可以查阅 https://github.com/opencontainers/runtime-spec/blob/main/config.md。

## 标准容器的5个原则

标准容器 (Standard Container) 的五个原则如上图所示。以下是一些详细说明：

1. Standard Container 定义了一些标准操作。任何 OCI 兼容的容器运行时都需要支持这些操作（如图中左边部分所示）。
2. 所有标准操作都不能因为容器内部软件的不同而产生不同的效果。
3. Standard Container 需要能在任何 OCI 支持的平台上运行。
4. Standard Container 是自动化友好的。由于标准容器提供了标准操作，封装环境以及平台无关，所以原生就很适合集成到自动化方案中去。
5. Standard Container 使能了产品质量级的交付。

## 标准容器的生命周期

容器的生命周期大概如下图所示。蓝色步骤代表用户向OCI容器运行时 (比如 runc）发起的命令，黄色的步骤对应用户发起命令后容器运行时内部对应的行为。这里的“用户”在实际应用中不会是人，而是更高一层的软件， 最常见的是那些符合Kubernetes Container Runtime Interface (CRI)的容器运行时比如 containerd, cri-o。后续会有文章讲解CRI，以及CRI与OCI之间的关系及交互。以下是一些关于图中步骤的解释 (会用runc举例）：

- [第一步]用户向 runc 发起命令创建一个容器：runc create <id> <path>。其中id是 container的标识，path是指向 filesystem bundle 的路径。
- runc 会根据 filesystem bundle中config.json的配置创建容器运行环境。然后依次调用 prestart hook, createRuntime hook, createContainer hook。我们常听说的比如映射文件或设备到容器环境中这些行为就发生在这些hook中。
- [第二步]用户在创建容器成功之后向 runc 发起启动命令：runc start <id>。
- runc会调用 startContainer hook，然后启动用户指定的程序，然后调用poststart hook。至此，用户的程序才真正运行起来了。
- [第三步]用户在不需要容器的时候用命令删除容器：runc delete <id>
- runc 销毁容器运行环境，调用 poststart hook。

## 总结

本文介绍了OCI对于容器运行时定义的标准(runtime-spec)中的一些重要概念。下一篇将用 runc 一步一步去配置，启动一个 OCI 容器。

## 参考文献

- https://github.com/opencontainers/runtime-spec
- https://github.com/opencontainers/image-spec
- https://github.com/opencontainers/distribution-spec
- https://github.com/opencontainers/runtime-spec/blob/main/config.md
