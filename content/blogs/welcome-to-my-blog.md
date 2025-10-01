---
title: "Kubernetes Is Not Everything: A Curated Collection of High-Quality Articles on the Container Ecosystem"
date: "2025-09-28"
excerpt: "This blog summary good articles relate to container ecosystem."
published: true
tags: ["container", "Kubernetes"]
---

The container ecosystem is vast, and **Kubernetes is only one important
piece of it**. To build a solid understanding, you should start from the
low-level runtimes and move upward, covering orchestration, networking,
storage, security, and the tool ecosystem.

This article provides a **learning path** with curated, high-quality
articles, helping you progress step by step from fundamentals to
advanced topics.

------------------------------------------------------------------------

## 1. Container Runtime Basics

Start with **runc** to understand the fundamentals of container
runtimes.

-   [Beginner's Guide to
    runC](https://medium.com/%40Mark.io/beginners-guide-to-runc-1b29cf281752)
-   [Introduction to runc by Danish
    Prakash](https://danishpraka.sh/posts/introduction-to-runc/)
-   [Dig into Runtimes -
    runc](https://blog.quarkslab.com/digging-into-runtimes-runc.html)

To understand how **Kubernetes, CRI, containerd, and runc** work
together:
- [Understanding Kubernetes Container Runtime: CRI, Containerd and Runc
Explained](https://devoriales.com/post/318/understanding-kubernetes-container-runtime-cri-containerd-and-runc-explained)

Extra readings:
- [Container Runtimes Part 1--4 (Ian
Lewis)](https://www.ianlewis.org/en/container-runtimes-part-1-introduction-container-r)
- [Building a container from scratch in Go by Liz
Rice](https://www.youtube.com/watch?v=Utf-A4rODH8)

------------------------------------------------------------------------

## 2. Linux Namespaces and Core Mechanisms

Understanding **namespaces and cgroups** is key to grasping how
containers work.

-   [Quarkslab: Digging into Linux namespaces - Part
    1](https://blog.quarkslab.com/digging-into-linux-namespaces-part-1.html)
-   [Quarkslab: Digging into Linux namespaces - Part
    2](https://blog.quarkslab.com/digging-into-linux-namespaces-part-1.html)
-   [Linux programmers manual:
    NAMESPACES(7)](https://man7.org/linux/man-pages/man7/namespaces.7.html)

Additional resources:
- [What even is a container: namespaces and
cgroups](https://jvns.ca/blog/2016/10/10/what-even-is-a-container/)
- [Cgroups, namespaces, and beyond: what are containers made from
(DockerCon)](https://www.youtube.com/watch?v=sK5i-N34im8)

------------------------------------------------------------------------

## 3. Must-Read Series

A highly recommended series for both technical and historical context:

-   [Demystifying Containers: Part I: Kernel
    Space](https://medium.com/@saschagrunert/demystifying-containers-part-i-kernel-space-2c53d6979504)
-   [Demystifying Containers: Part II: Container
    Runtimes](https://man7.org/linux/man-pages/man7/namespaces.7.html)
-   [Demystifying Containers: Part III: Container
    Images](https://medium.com/@saschagrunert/demystifying-containers-part-iii-container-images-244865de6fef)
-   [Demystifying Containers: Part IV: Container
    Security](https://www.suse.com/c/demystifying-containers-part-iv-container-security/)
-   [Demystifying Containers GitHub
    repository](https://github.com/saschagrunert/demystifying-containers)

------------------------------------------------------------------------

## 4. From Containers to Orchestration

Once you understand containers, the next step is orchestration and
Kubernetes.

-   [Journey From Containerization To Orchestration And
    Beyond](https://iximiuz.com/en/posts/journey-from-containerization-to-orchestration-and-beyond/)\
-   [How Kubernetes Reinvented Virtual Machines (in a good
    sense)](https://iximiuz.com/en/posts/kubernetes-vs-virtual-machines/)\
-   [What are Kubernetes Pods
    Anyway](https://www.ianlewis.org/en/what-are-kubernetes-pods-anyway)\
-   [Docker Containers vs. Kubernetes Pods - Taking a Deeper
    look](https://labs.iximiuz.com/tutorials/containers-vs-pods)\
-   [Kubernetes pod vs container: Multi-container pods and container
    communication](https://www.mirantis.com/blog/kubernetes-pod-vs-container-multi-container-pods-and-container-communication/)

------------------------------------------------------------------------

## 5. Container Networking and Service Discovery

Networking is one of the most complex parts of the container world.

-   [Tracing the path of network traffic in
    Kubernetes](https://learnkube.com/kubernetes-network-packets)
-   [Using network namespaces and a virtual switch to isolate
    servers](https://ops.tips/blog/using-network-namespaces-and-bridge-to-isolate-servers/)

Advanced series:
- [What Actually Happens When You Publish a Container
Port](https://iximiuz.com/en/posts/docker-publish-container-ports/)
- [How To Publish a Port of a Running
Container](https://iximiuz.com/en/posts/docker-publish-port-of-running-container/)
- [How to Expose Multiple Containers On the Same
Port](https://iximiuz.com/en/posts/multiple-containers-same-port-reverse-proxy/)
- [Sidecar Proxy Pattern - The Basis Of Service
Mesh](https://iximiuz.com/en/posts/service-proxy-pod-sidecar-oh-my/)
- [Service Discovery in Kubernetes: Combining the Best of Two
Worlds](https://iximiuz.com/en/posts/service-discovery-in-kubernetes/)

------------------------------------------------------------------------

## 6. Key Components

Important but often overlooked pieces:

-   [The Almighty Pause
    Container](https://www.ianlewis.org/en/almighty-pause-container)
-   [Cracking Kubernetes Node Proxy (aka
    kube-proxy)](https://arthurchiao.art/blog/cracking-k8s-node-proxy/)

------------------------------------------------------------------------

## 7. Tools and Ecosystem

Beyond Docker, the container ecosystem is full of powerful tools:

-   [buildah](https://github.com/containers/buildah)
-   [skopeo](https://github.com/containers/skopeo)
-   [podman](https://github.com/containers/libpod)
-   [umoci](https://github.com/opencontainers/umoci)

------------------------------------------------------------------------

## 8. Further Readings & References

-   [Containers Explained by Ivan Velichko](https://iximiuz.com/en/)
-   [Quarkslab containers
    category](https://blog.quarkslab.com/category/containers.html)
-   [CNI
    specification](https://github.com/containernetworking/cni/blob/main/SPEC.md)
-   [The Best Places to Learn & Try Kubernetes
    Online](https://www.tutorialworks.com/learn-kubernetes-online/)

------------------------------------------------------------------------

## Conclusion

From **low-level runc and Linux namespaces**, to **orchestration and
Kubernetes networking**, and finally **ecosystem tools and references**,
this curated collection covers the full-stack learning path of container
technologies.

👉 Suggested reading order: **runtime → namespaces → must-read series →
orchestration → networking → key components → tools**.

This way, you'll gradually build a **comprehensive understanding of the
container world**.

