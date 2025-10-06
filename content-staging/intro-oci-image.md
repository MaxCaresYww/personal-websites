## 前言

Open Container Initiative (OCI) 定义了容器（container）的行业开放标准。OCI 现在包括了三个标准：
- 运行时标准: Runtime Specification (runtime-spec)
- 容器镜像标准: Image Specification (image-spec)
- 发布标准: Distribution Specification (distribution-spec)

我将用一个系列的文章介绍 OCI 的三个标准，以及相关的软件，工具，比如广泛使用的容器运行时 runc。本篇文章将介绍容器镜像标准 (image-spec) 中一些重要的概念。以下是之前的两篇介绍 runtime specification 的文章链接：

- Open Container Initiative (OCI) - runtime spec
- OCI - 如何用 runc 管理容器

## 概述
您可能了解当您通过 Docker 或 Podman 等工具运行容器时需要使用到容器镜像（container image）。您可能还了解该镜像包含了运行容器内软件所需的所有依赖（软件库、文件等）。但是，您可能还没有时间研究容器镜像的具体组成方式。这篇文章将给您介绍这方面的内容。
OCI 定义了容器镜像的标准，该标准定义在一个 Github 的一个 repository 中（参考资料[1]）。 OCI 制定容器镜像标准的目的是：

> To enable the creation of interoperable tools for building, transporting, and
> preparing a container image to run.
> 能够创建可互操作的工具来构建、传输和准备要运行的容器镜像。

## 容器镜像是如何组成的

OCI 容器镜像由 manifest、index（可选）、一组文件系统层（filesystem layers）和 configuration 组成。镜像的 manifest、index 和 configuration 本质上就是 json 文件。每一个文件系统层是 tar 包或使用 gzip/zstd 压缩过的 tar 包。请参阅下图了解总体概况及他们之间的关联：

![]()

以下是一些要点：

- Image index 是可选的，因为它主要是用来支持多平台目的。Index 包含了一组 image manifest，每一个 manifest 对应一个平台。当镜像仅针对某一特定平台时，则不需要 index。
- Image manifest 是某一个特定平台的容器镜像的入口。它是对某一种特定的架构（architecture）和操作系统的。它包含了镜像 configuration 和 文件系统层（filesystem layers）的关联信息。但Configuration 和文件系统层是单独管理的，image manifest 只是包含了可以正确找到它们的信息。
- 镜像 configuration 包含镜了镜像的一些配置参数。当 OCI runtime（例如 runc）在容器镜像之上创建容器时，将使用这些配置。
- 镜像文件系统层代表了容器的根文件系统。这些层按照一定规则相互叠加可以创建出完整的文件系统。

## 一个例子

让我们通过一个例子来看看它在实践中是如何运作的。
首先，我们使用 skopeo 从docker hub下载 busybox 容器镜像并转化为OCI格式。skopeo是一个很好的工具，提供了很多关于容器镜像和容器镜像仓库的操作。也许稍后我会单独写一篇文章介绍关于容器镜像的一些常用工具。

```sh
$ skopeo copy docker://busybox:latest oci:busybox
$ tree busybox
busybox
├── blobs
│ └── sha256
│ ├── 79c9716db559ffde1170a4faf04910a08d930f511e6904c4899a1f7be2abfb34
│ ├── 9c0abc9c5bd3a7854141800ba1f4a227baa88b11b49d8207eadc483c3f2496de
│ └── af47096251092caf59498806ab8d58e8173ecf5a182f024ce9d635b5b4a55d66
├── index.json
└── oci-layout
```

这里的 index.json 就是我们之前提到的 image index，让我们看看它是什么样子的：

```sh
```

它包含一组 image manifest。在本例中，它仅包含一个 manifest。根据这个 manifest 的 digest，我们可以在 blobs 目录下找到它。让我们检查一下该文件：

```sh
```

该 image manifest 文件包含镜像配置文件和镜像文件系统层的信息。我们看到，busybox 只有一层文件系统层，并且该层是使用 gzip 压缩的 tar 包。让我们检查一下配置文件和文件系统层：

```sh
```

这里，镜像配置文件包含了镜像作为一个容器启动时的命令，镜像的历史、架构、操作系统等信息。
busybox 镜像的文件系统层是 gzip 压缩的。如果我们解压缩它，您会看到一个根文件系统。而这正是基于这个镜像的容器的运行环境。

```sh
```

## 结论

您可以随时从OCI image-spec（参考资料[1]）中查看详细信息。我希望你从概念上能从这个文章中对容器镜像有所了解。当然，还有许多其他有趣的主题和细节，例如：
- Image filesystem layer 是如何转化为容器的根文件系统（root filesystem）的
- 像 containerd/runc 这样的容器引擎在实践中是如何处理镜像的（哈：runc实际上不处理容器镜像的，runc 处理的已经是从镜像转化成的 filesystem bundle了，大家可以去看之前的两篇文章）
我希望我能在后续的文章中覆盖上面的内容。如果您想了解该领域的一些具体细节，请告诉我。