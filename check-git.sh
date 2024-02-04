#!/bin/bash

# Get the list of untracked files
untracked_files=$(git status --short --untracked-files=all)

# Check if both .js and .mjs files are present
if echo "$untracked_files" | grep '\.js$' > /dev/null && echo "$untracked_files" | grep '\.mjs$' > /dev/null; then
    echo "1"
else
    echo "0"
fi
