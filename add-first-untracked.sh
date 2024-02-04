#!/bin/bash

# Get the list of untracked files
untracked_files=$(git diff --name-only)

if [[ -n "$untracked_files" ]]; then
  # Extract the first file name
  first_untracked_file=$(echo "$untracked_files" | head -n1)

  # Add the first untracked file to the staging area
  git add "$first_untracked_file"

  echo "Added $first_untracked_file to the staging area."
else
  echo "No untracked files found."
fi
