---
title: "Best practices for Gitlab merge requests"
date: "2020-03-10"
excerpt: "This blog introduces best practices for Gitlab merge requests"
published: true
tags: ["Software Craftsmanship", "Code Review", "Merge Requests"]
---

## Preface

This blog is specifically talking about Gitlab merge requests, but it applies to
Github pull requests and other similar systems (e.g. bitbucket) as well.

## Introduction: Why good merge requests matter

A Merge Request (**MR**) is the basis of GitLab as a code collaboration and
version control platform. It is as simple as the name implies: a *request* to
*merge* one branch into another.

Review process is one key part in software development. Good review help find the
software defects at early phase. Since the later the bug found, the higher price
we will pay for that. 

Merge request or pull request (PR) in terms of github is where review happens for 
projects that need collaboration between multiple developers. That is also the 
basic way of working of various open source projects.

A good merge request helps reviewers spend less time to get understanding of
the changes about *What*, *How* and *Why*. It would be really nice for
reviewers to easily know changes from the merge request title, description and
commit messages. Then they could start review right away.  

## Best practices for good merge requests

### Describe *What* is the change using MR title

Merge request title is the first thing reviewers will see when they open the merge
request pages. It would be nice if reviewers are able to get the overall idea of 
the MR from the title easily. 

Title like `Add initial TROUBLESHOOTING guide` gives reviewers clear information 
about the changes while titles like `add deploy script` or `feature2200` really do 
not give reviewers any useful information. 

### Describe *Why* for the changes in  MR description

Section `description` right under `title` is the good place to put more info
about the changes. The main content is *Why*. If needed, put some complementary
information for *What* which is not covered in `title`. The idea is pretty like
the subject and body of commit message. The subject of the commit message is 
suggested to be limited in 50 characters and supplementary information then could 
be written in the body of commit message. Nice thing is if you have something 
written in the body of commit message, it will be automatically visible in 
`description` section when creating the merge request. 

Of course, not every MR need a description like not every commit message need a 
body. If the changes is quite simple and reviewers could easily understand that 
via checking the code, then feel free to leave the description empty. One
example could be rpm spec file version update. If the only change is the
version update, then title like `Update to 1.2.3` is good enough to leave the 
description empty.

### Add reviewers for review

Merge request is the place for review. That is how collabration is working for
open source project. Add reviewers for review when your changes are ready and
give enough time for review. 

GitLab supports markdown format in merge requests, issues, comments, etc.
Please make use of that to help make your comments, merge requests more readable. 
Refer to [3] of reference for detail introudction of GitLab markdown formatting. 
A few straightforward examples like:

>quoting previous discussions

```
providing example code
```
or
- links
- task lists
- images
- etc.

### Use `WIP` flag for Work in Process MRs

When your changes in merge request is not ready for merge, please add `WIP:` 
prefix before the merge request title. It helps prevent repository owner or 
masters from merging the changes to master branch by accident. Besides, if 
there is pipeline configured for this repository properly, MR marked with `WIP`
will not probably trigger that so resources could be saved. 

However, `not ready for merge` does not mean `not ready for review`. 
Developers - who are watching the repository - will receive notifications when 
merge requests are created. Starting from point in time, you as author becomes 
not able to prevent (active) reviewers from reviewing your code changes even 
the MR is marked as `WIP`. So in general, the proper time to create a merge 
request would be the point when your changes are ready for review.

### Delete the source branch

When creating a merge request, please tag the `Delete source branch when merge request accepted` 
option, then the source branch will be deleted automatically when the merge 
request is merged. 

This is important to always keep the repository clean, prevent it from being 
polluted by useless branches. 

Repository owner or masters could make use of `delete merged branches`
feature provided from GitLab to delete those branches in bulk which were not 
deleted automatically when the merge request was merged. There is also [`GitLab
API`](https://docs.gitlab.com/api/rest/) available for this feature, so it could
be automated if necessary. 

Tagging `Delete source branch when merge request accepted` is the suggested way
for developers. There is no guarantee repository owner will take care of those
useless branches for you, but other developers will definitely suffer from it.
So be a nice collaborator. 

### Squash the commits

There are hundreds of reasons to write good commit messages. The commits in one
merge request should be constructed from functional point of view. Avoid
containing lots of commits with meaningless commit messages. There are one post 
[`How-to-write-good-commit-message`](#reference) from Internet which has covered
this topic quite well. It is worthy you spending enough time to get yourself start 
paying enough attention to this topic. Just imagine what a nightware would it be 
for reviwers if they see following commits in one MR.

```bash
e4454fe add debug
3dc4451 add debug
4307bf3 add debug
f6ad779 add debug
6dd8460 add debug
ccf6dd1 add debug
cf5978f add debug
6fb96ec add debug
b7665d1 add debug
6b10d8b add debug
7f062e0 add debug
278338e add debug
7a46f05 add debug
7ef6f46 add debug
```

On other side, do not blindly squash everything into single commit. Commits
should be constructed logically. If the changes could be split into several
parts logically, then it is better to use separate commit for each of them. 

### Link MR to issues

Merge requests are usually implementing some new features or fixing some bugs.
In both cases, it would be better to have associated issues. Please link MRs 
to issues in `description` section using directives like `Closes` or `Fixes`. 
Examples like:

```bash
Fixes: #123
Fixes: PR1234567
```

The same pattern could also be used in commit messages. You could get a more
comprehansive understanding of this topic from GitLab document [`default closing pattern`](https://docs.gitlab.com/ee/user/project/issues/managing_issues.html#default-closing-pattern).

### Do not give up MR easily 

MR is the place for review, where reviewers will post their comments and then
valuable discussions happen. It is nice GitLab will record all of these in the MR.
Then anytime later developers and maintainers could come back and check anything 
they need for purposes like pronto investigation, features implementation. 

This nice thing get broken when developers start creating duplicated MRs. This 
is - in most cases - due to that developers do not have the git competence to fix 
conflicts in the source branch (mostly coming from rebase). Once duplicated MR 
is created, comments and discussions are distributed. Originally comments were 
recorded in the older MR while new ones come to the new MR. This makes it quite 
difficult for other developers and maintainers to follow the changes.  


## Terms

+ MR: Merge Request

## Reference

+ [1][`gitlab merge request`](https://docs.gitlab.com/ee/user/project/merge_requests/)
+ [2][`How to Write a Git Commit Message`](https://chris.beams.io/posts/git-commit/)
+ [3][`GitLab markdown formatting`](https://gitlabe1.ext.net.nokia.com/help/user/markdown)
