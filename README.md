# What's This?

There's an auto-commit script located at [packages/scripts/commit.mjs](packages/scripts/commit.mjs). Place `GOOGLE_API_KEY=` in your `.env` file and run the auto-commit by executing `pnpm run commit`. This utilizes the Gemini Pro free version, which means Google will record all your input data for their training purposes. The commit message is translated to Indonesian below the original commit message you can change the prompt to remove that.

# How to Use Clarifai GPT-4 Turbo

### Use it to Create Auto Commit

Export your Clarifai API key with `export CLARIFAI_API_KEY=<your_CLARIFAI_API_KEY>` and then run `pnpm run commit-clarifai`.

### Use it to Fix Any Grammar Mistakes in `README.md`

Execute `pnpm run fix-grammar` to correct the grammar in `README.md` and create a backup named `README.md.bak` in case of errors.

### Use it to Fix grammar and create commit message automatically

Just run `pnpm run fix-and-commit`