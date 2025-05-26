# IaC-with-AWS-CDK

This repository is a collection of IaC (Infrastructure as Code) using AWS CDK.
There are four stacks:
- empty
- web_backend
- event_workers
- mystery


## Prerequisites

- Node
- direnv


## Setup

1. Copy the `.envrc.example` file to `.envrc`   

```bash
cp .envrc.example .envrc
```

2. Update the `.envrc` file with your AWS credentials

3. Allow the `.envrc` file
```bash
direnv allow
```

4. CD into stack folder
```bash
cd empty
npm install
```

5. Bootstrap the CDK
```bash
npm run bootstrap
```

6. Deploy the stack
```bash
npm run deploy
```




