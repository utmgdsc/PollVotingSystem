# CONTRIBUTING GUIDELINE

<aside>
This guideline is intended for participants in GDSC Open-source Initiative 2022: https://gdsc.community.dev/e/mndaxe/

</aside>

# Introduction

Welcome to our project! We hope that you will enjoy working on this project, and get valuable experience!

This guide contains basic setup information (repository setup with git), what kind of contributions you can start from, and some rules in our community.

We also welcome any feedback or concern. Feel free to contact us at [GDSC UTM Discord server](https://discord.gg/FMJNvhXJAa)!

# Setup your repo with Git

Getting the project’s source code on your local machine is the very first start. We will use Git (version control system) to maintain our project’s code stream. 

Here are the steps for you to setup the project on your machine:

1. **Fork** the repo
2. **Clone** your forked repo (the repo under your account)
    
    ```
    git clone <your forked repo clone url>
    ```
    
3. Add **upstream repository**
    
    ```
    git remote add upstream <our project repo clone url, not the forked repo>
    ```
    

You are all set!

Our main branch is `dev/gdsc-open-source-2022`, so please make sure that your code is always synced with that branch in our main project (not your forked one). To do so, we recommend some git commands:

```
git fetch upstream
git merge upstream/dev/gdsc-open-source-2022
```

In case you are not familiar with Git, or unsure about any steps above, you can try to google the keywords we highlight. If you still face some bugs after that, feel free to ping us on Discord for help in debugging! *We know that playing with Git is not fun sometimes.*

# Create Github Issue

Github Issue is the place for us to:

- Report bug
- Suggest task/feature/improvement

We will create new issues per sprint/milestone (normally once per month). If you find any issues interesting, please leave a comment and we can discuss it or assign it to you (in case no one working on it yet). You can also ask to co-work on an issue if there is an assignee already.

In case you want to create a new issue, we do recommend you use our Issue template (available when you create a new issue) and fill out as many details as possible. This will help us (as project owners) to understand your issues, and your fellow contributors in future work (what if they gonna do other features dependent on your feature?). Also, once you created it, please assign our admin (see Contact section) to review your issue and discuss it from there.

# Create Pull Request (PR)

Pull Request is where you ask us to get your code available (merged) to the main repository for everyone, instead of staying in your machine.

Once you are done with an issue (and **commit + push** all your code), you can create a PR from the branch (in your forked repo) you are working on to the `dev/gdsc-open-source-2022` branch (in the base repo). The Github interface should look like this:

![PR](https://docs.github.com/assets/cb-43627/images/help/pull_requests/choose-head-fork-compare-branch.png)

You are required to follow our Pull Request template (a simple version of [Zulip](https://github.com/zulip/zulip/) template). Please make sure not to skip any part and to include screenshots/gifs (for UI changes) or test cases (for functionality changes). Also please add 2 of our admins (see Contact section) as your reviewers so that we can review your code.

In case you faced any **merge conflict**, you should fetch the code from our base repository and **merge** it in your machine. Your IDE (should) prompt you where and how you want to resolve merge conflict. Example from VS Code:

![Conflict](https://code.visualstudio.com/assets/docs/sourcecontrol/overview/merge-conflict.png)

As a rule of thumb, we strongly recommend you *Accept Incoming Change*. If you lost any of your current work because of the conflict, we would suggest you copy them beforehand and then accept the change. 

# Community Rules

- All communication must be done via Discord and Github.
- Your code must be original work. Otherwise, students can be suspended from the contest.
- Project Owners and GDSC Executives should get back to your students’ inquiries no later than 48 hours. Please ping us if you do not hear back from us later than that.
- Please try to reach out to project owners if you have any inquiry related to the project, as they are the ones who understand the project the most.
- If you detect any inappropriate, unfair, or ambiguous behaviors during the initiative, please reach out and report to GDSC Executives ASAP.

# Contact Information

In case you have any questions or concerns, or you want us to review your issue/PR, please contact:

- Project Owner: [Shubh Bapna](https://github.com/shubhbapna) and [Chris Lim](https://github.com/hiimchrislim) (for project’s inquiries)
- GDSC Open-source Initiative Leads: [Giang Bui](https://github.com/huonggiangbui) and  [Joy Malhotra](https://github.com/joymalhotra) (for project’s inquiries and GDSC Open-source Initiative general inquiries)