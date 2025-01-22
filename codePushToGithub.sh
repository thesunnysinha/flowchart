#!/bin/bash

# Navigate to the directory
script_directory="$(dirname "$0")"

# Navigate to the script's directory
cd "$script_directory"

# Ask for the branch name
read -p "Enter the branch name: " branch_name

# Check if the branch name is "main"
if [ "$branch_name" = "main" ]; then
    # Add all changes
    git add .

    # Ask for the commit message
    read -p "Enter the commit message: " commit_message

    # Commit with the entered message
    git commit -m "$commit_message"

    # Push changes directly to the "main" branch
    git push origin main

    git pull origin main
else
    # Create and switch to the new branch
    git checkout -b "$branch_name"

    # Add all changes
    git add .

    # Ask for the commit message
    read -p "Enter the commit message: " commit_message

    # Commit with the entered message
    git commit -m "$commit_message"

    # Push changes to the specified branch
    git push origin "$branch_name"

    git checkout main
fi
