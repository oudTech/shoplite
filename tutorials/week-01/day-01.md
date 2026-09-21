# Day 1 (Mon) — Project Kickoff & Git Basics

## What you're learning

Git and GitHub: `clone`, `add`, `commit`, `push`, and branches.

## Why it matters for ShopLite

Every day from now on, you'll be changing shared code as a team. Without a
disciplined git workflow, you'll overwrite each other's work constantly.
This is the backbone every other day builds on — get it right now.

## The project you're building

**ShopLite** — a mini but real online store: browsable products, a cart,
accounts, checkout, order history, and an admin panel. By Week 8 it's
deployed live.

## Today's setup

```bash
# 1. Clone the shared repo (your mentor will give you the real URL)
git clone <repo-url> shoplite
cd shoplite

# 2. Create your own feature branch — never commit straight to main
git checkout -b day-01-setup

# 3. Confirm the folder structure exists
ls
# README.md  frontend/  tutorials/
```

Open `frontend/` — you'll notice it's mostly empty right now. That's on
purpose; you'll fill it in over the next two weeks.

### Core git commands you need today

```bash
git status                 # what's changed?
git add <file>              # stage a file
git commit -m "message"     # save a snapshot with a clear message
git push origin day-01-setup   # push your branch up
```

A good commit message says _what_ changed and _why_ — "fix bug" tells
nobody anything. "Add empty frontend folder structure for ShopLite" does.

## Exercise

1. Create a `NOTES.md` file inside `frontend/` with one line: your name and
   today's date.
2. Stage it, commit it with a proper message, and push your branch.
3. Open a pull request into `main` and tag your mentor as a reviewer.

Don't move on to Day 2 until that PR is merged.
