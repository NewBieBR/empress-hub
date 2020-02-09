# Empress Hub

## Requirements
- [scp](https://www.google.com/search?q=install+scp&rlz=1C5CHFA_enFR861FR861&oq=install+scp&aqs=chrome..69i57j0l7.2449j0j1&sourceid=chrome&ie=UTF-8)
- node

## Getting started
```bash
yarn add empress-hub && empress-hub setup
```
- Go to folder that you want to push, then:
```bash
empress-hub init "~/cs101/hw1"
```
> *~/cs101/hw1*: path of the **remote** folder to push into
- Add files that you want to push
```bash
empress-hub add file1 file2...
```
- Push
```bash
empress-hub push
```