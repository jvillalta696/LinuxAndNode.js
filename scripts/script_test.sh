#!/bin/bash

# Define the source and destination paths
documents_dir="$HOME/Videos"
desktop_dir="$HOME"

# Check if the documents directory exists
if [ ! -d "$documents_dir" ]; then
    echo "Error: Documents directory not found." >&2
    exit 1
fi

# Check if the desktop directory exists
if [ ! -d "$desktop_dir" ]; then
    echo "Error: Desktop directory not found." >&2
    exit 1
fi

# Compress the documents folder into a zip file
zip_file="$desktop_dir/documents.zip"
cd "$documents_dir" && zip -r "$zip_file" . >/dev/null 2>&1

# Check if the zip command was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to compress the documents folder." >&2
    exit 1
fi

# Copy the zip file to the desktop directory
cp "$zip_file" "$desktop_dir/Document"

# Check if the copy command was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to copy the zip file to the desktop directory." >&2
    exit 1
fi

# Remove the original zip file
rm "$zip_file"

# Check if the remove command was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to remove the original zip file." >&2
    exit 1
fi

echo "Script executed successfully."
exit 0